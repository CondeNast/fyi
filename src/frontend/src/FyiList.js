import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { TabContent, TabPane, Nav, NavItem, NavLink, Card, CardHeader, CardText, CardFooter, CardBody, CardTitle, Badge} from 'reactstrap'
import classnames from 'classnames';
import Truncate from 'react-truncate-html';

class FyiCard extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    let fyi = this.props.fyi

    if(this.props.style === 'mosaic' && !fyi.contentIntro) {
      return null
    }

    let fyiContentIntroText = fyi.contentIntro ? `<p>${fyi.contentIntro}</p>` : `<br/><br/><br/><br/>`

    return (
      <Card className="shadow-sm">
        <CardBody>
          <CardTitle>{fyi.name}</CardTitle>
            { this.props.style === 'grid' ? <CardText><Truncate lines={8} dangerouslySetInnerHTML={{ __html: fyiContentIntroText}} /></CardText> : '' }
            { this.props.style === 'mosaic' ? <CardText dangerouslySetInnerHTML={{ __html: fyiContentIntroText}}/> : '' }
          {fyi.tags && fyi.tags.filter((t) => !(['system','drip'].includes(t))).map(function(tag, index){
            return <Badge color='light' pill>{tag}</Badge>
          })}
          <CardText>{fyi.link}</CardText>
        </CardBody>
        <CardFooter><Link to={"/fyis/"+fyi.id + "/" + fyi.name}>See Details</Link></CardFooter>
      </Card>
    )
  }
}

class FyiList extends Component {
  constructor (props) {
    super(props);

    this.toggle = this.toggle.bind(this);
    this.state = {
      systems: [],
      all: [],
      key: 1,
      activeTab: '1'
    };
  }

  toggle(tab) {
    if (this.state.activeTab !== tab) {
      this.setState({
        activeTab: tab
      });
    }
  }

  handleSelect(key) {
    this.setState(Object.assign({}, this.state, {key}))
  }

  render() {
    const systemItems = this.state.systems.map((fyi) => <FyiCard style='grid' fyi={fyi} key={fyi.id}/>);

    const allItems = this.state.all.map((fyi) => <FyiCard style='mosaic' fyi={fyi} key={fyi.id}/>);

    return (
      <div>
        <Nav tabs>
          <NavItem>
            <NavLink
              className={classnames({ active: this.state.activeTab === '1' })}
              onClick={() => { this.toggle('1'); }}
            >
              Systems
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink
              className={classnames({ active: this.state.activeTab === '2' })}
              onClick={() => { this.toggle('2'); }}
            >
              Directory
            </NavLink>
          </NavItem>
        </Nav>
        <TabContent activeTab={this.state.activeTab}>
          <TabPane tabId='1'>
            <div class="card-columns">{systemItems}</div>
          </TabPane>
          <TabPane tabId='2'>
            <div class="card-columns">{allItems}</div>
          </TabPane>
        </TabContent>
      </div>
    )
  }
  componentDidMount () {
    let options = {
      headers: {
        'Accept': 'application/json'
      }
    }
    fetch('/fyis', options)
        .then(response => response.json()).then( (fyis) => {
          this.setState({  systems: fyis.systems, all: fyis.all })
        })
        .catch(() => {
          this.setState({  systems: [], all: [] })
        });
    }
}

export default FyiList
