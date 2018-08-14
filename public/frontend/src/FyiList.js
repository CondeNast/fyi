import React, { Component } from 'react'
import { Link } from 'react-router-dom'

class FyiList extends Component {
  constructor (props) {
    super(props)
    this.state = {
      fyis: []
    }
  }
  render () {
    const listItems = this.state.fyis.map((fyi) =>
      <li key={fyi}><Link to={'/fyis/' + fyi}>{fyi}</Link></li>
    )
    return (<ul>{listItems}</ul>)
  }
  componentDidMount () {
    let options = {
      headers: {
        'Accept': 'application/json'
      }
    }
    fetch('/fyis', options)
        .then(response => response.json()).then((fyis) => {
          this.setState({ fyis: fyis.fyis })
        })
  }
}

export default FyiList
