import React, { Component } from 'react';
import { ListGroup, ListGroupItem } from 'reactstrap'

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
                if(deployment) {
                  return (
                    <ListGroupItem color='light'>
                      <strong>{}/{deployment.repo}:</strong> Deployed to {deployment.env.toUpperCase()}<br />
                      <small class='text-muted'>{deployment.date_happened}</small>
                    </ListGroupItem>
                  )
                }
                return null
              })}
            </ListGroup>
          </div>
        </div>
      </div>
    );
  }
  componentDidMount() {
    let options = {
      headers: {
        "Accept": "application/json"
      },
    }
    fetch(`/deploys`, options)
      .then(response => response.json())
      .then(data => {
        this.setState({ data: {deploys: data} })
      });
    }
}

export default FyiViewer
