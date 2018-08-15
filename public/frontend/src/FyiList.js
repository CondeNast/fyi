import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Tab, Tabs } from 'react-bootstrap'

class FyiList extends Component {
  constructor (props) {
    super(props)
    this.state = {
      systems: [],
      all: [],
      key: 1
    }
  }
  handleSelect(key) {
    this.setState(Object.assign({}, this.state, {key}))
  }
  render() {
    const systemItems = this.state.systems.map((fyi) =>
        <li key={fyi}><Link to={"/fyis/"+fyi}>{fyi}</Link></li>
    );
    const allItems = this.state.all.map((fyi) =>
        <li key={fyi}><Link to={"/fyis/"+fyi}>{fyi}</Link></li>
    );
    return (
     <Tabs
        activeKey={this.state.key}
        onSelect={this.handleSelect.bind(this)}
        id="fyi-list-tabs"
      >
        <Tab eventKey={1} title="Systems">
          <ul>{systemItems}</ul>
        </Tab>
        <Tab eventKey={2} title="All">
          <ul>{allItems}</ul>
        </Tab>
      </Tabs> 
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
        });
    }
}

export default FyiList
