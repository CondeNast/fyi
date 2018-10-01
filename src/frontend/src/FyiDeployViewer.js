import React, { Component } from 'react';
import { Button, Form, Label, Input, ListGroup, ListGroupItem, Badge, Card, CardHeader, CardText, CardFooter, CardBody, CardTitle, } from 'reactstrap'
import CenteredTree from './CenteredTree';
import Truncate from 'react-truncate-html';

class FyiViewer extends Component {
  constructor(props) {
    super(props)
    this.state = {
      data: {},
    }
  }
  render() {
    return (
      <div class='viewer'>
        <div class='fyi-details col-12 no-gutters'>
          <div class='fyi-activity-list'>
            <h6 className='text-muted'>Latest Activity</h6>
            <ListGroup className='shadow-sm'>
              {this.state.data.deploys && this.state.data.deploys.events.map(deployment => {
                if(!deployment)
                  return
                return (
                  <ListGroupItem color='light'>
                    <strong>{}/{deployment.repo}:</strong> Deployed to {deployment.env.toUpperCase()}<br />
                    <small class='text-muted'>{deployment.date_happened}</small>
                  </ListGroupItem>
                )
              })}
            </ListGroup>
          </div>
        </div>
      </div>
    );
  }
  componentDidMount() {
    let search = window.location.search.substring(1);
    let options = {
      headers: {
        "Accept": "application/json"
      },
    }
    try{
     search = this.props.match.params
    }
    catch(e){
      search = {}
    }
      fetch(`/deploys`, options)
        .then(response => response.json())
        .then(data => {
          console.log(data)
          this.setState({ data: {deploys: data} })
        });
    }
}

export default FyiViewer
