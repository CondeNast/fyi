import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { TabContent, TabPane, Nav, NavItem, NavLink, Card, CardHeader, CardText, CardFooter, CardBody, CardTitle, Badge} from 'reactstrap'
import classnames from 'classnames';

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
    const systemItems = this.state.systems.map((fyi) =>
        <Card className="shadow-sm">
          <CardHeader><Link to={"/fyis/"+fyi.id + "/" + fyi.name}>{fyi.name}</Link><Badge href={"/fyis/"+fyi.id + "/" + fyi.name} color='success' pill>4 Connections</Badge></CardHeader>
          <CardBody>
            <CardTitle>{fyi.name}</CardTitle>
            <CardText>{fyi.content && fyi.content.slice(0,100)}</CardText>

            {fyi.tags.map(function(tag, index){
              return <Badge color='light' pill>{tag}</Badge>
            })}
            <CardText>{fyi.link}</CardText>
          </CardBody>
          <CardFooter><small class="text-muted">Last updated 3 mins ago</small></CardFooter>

        </Card>
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
            <div class="card-deck">{systemItems}</div>
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
