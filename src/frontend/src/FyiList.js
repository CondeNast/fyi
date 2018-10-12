import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { TabContent, TabPane, Nav, NavItem, NavLink, Card, CardHeader, CardText, CardFooter, CardBody, CardTitle, Badge} from 'reactstrap'
import classnames from 'classnames';
import Truncate from 'react-truncate-html';

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
    const systemItems = this.state.systems.map((fyi) => {
        let fyiContent = fyi.content
        var fyiContentMatch = fyiContent.match(/<p>([\s\S]*)?<\/p>/i)||[];
        let fyiContentIntroText = fyiContentMatch.length > 0 ? fyiContentMatch[1] : `<br/><br/><br/>`;
        return (
          <Card className="shadow-sm">
            <CardHeader><Link to={"/fyis/"+fyi.id + "/" + fyi.name}>{fyi.name}</Link></CardHeader>
            <CardBody>
              <CardTitle>{fyi.name}</CardTitle>
              <CardText><Truncate lines={3} dangerouslySetInnerHTML={{ __html: fyiContentIntroText}} /></CardText>
              {fyi.tags && fyi.tags.filter((t) => !(['system','drip'].includes(t))).map(function(tag, index){
                return <Badge color='light' pill>{tag}</Badge>
              })}
              <CardText>{fyi.link}</CardText>
            </CardBody>
          </Card>
        )
      }
    );

    const allItems = this.state.all.map((fyi) =>
      <tr>
        <td key={fyi}><Link to={"/fyis/"+fyi.id + "/" + fyi.name}>{fyi.name}</Link></td>
      </tr>
    );
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
            <table class="table table-sm table-striped">
              <thead>
                <tr>
                  <th>FYI</th>
                </tr>
              </thead>
              <tbody>
                {allItems}
              </tbody>
            </table>
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
