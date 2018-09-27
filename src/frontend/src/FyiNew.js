import React, { Component } from 'react'
import { Button, Form, Label, Input, ListGroup, ListGroupItem, Badge, Card, CardHeader, CardText, CardFooter, CardBody, CardTitle, } from 'reactstrap'
import CenteredTree from './CenteredTree';
import Truncate from 'react-truncate-html';

class FyiNew extends Component {
  constructor (props) {
    super(props);
    this.state = {
      data: {
        name: ''
      },
      orgs: process.env.REACT_APP_SUBSCRIBED_ORGS.split(',')
    }
  }

  render() {
    return (
      <div class='viewer'>
        <div class='fyi-info col-3'>
          <Card className="shadow-sm">
            <CardHeader>About</CardHeader>
            <CardBody>
              <CardText>FYI Details will show here...</CardText>
              <Button disabled outline color="secondary" size="sm" href={this.state.fyiLink}>View in Confluence</Button>
            </CardBody>
          </Card>
          <hr />
          <Card className="shadow-sm">
            <CardHeader>Repositories</CardHeader>
            <CardBody>
              <CardText>Repsitories will show here...</CardText>
              <ListGroup flush>
                <ListGroupItem disabled tag="a" href={`http://github.com}`}>...</ListGroupItem>
                <ListGroupItem disabled tag="a" href={`http://github.com`}>...</ListGroupItem>
              </ListGroup>
            </CardBody>
          </Card>
        </div>
        <div class='fyi-details col-6 no-gutters'>
          <h6 className='text-muted'>Create a new FYI</h6>
          <Card className="shadow-sm">
            <CardBody>
              <Input placeholder="Name" type="text" onKeyPress={this._handleKeyPressNew.bind(this)}/>
              <small class='form-text text-muted'>Press enter to submit.</small>
            </CardBody>
          </Card>
          <hr />
          <h6 className='text-muted'>Connections</h6>
          <div class='fyi-diagram-container shadow-sm' id="treeWrapper" style={{'background-color':'lightgrey'}}>
            <CenteredTree data={[this.state.data]} />
          </div>
          <div class='fyi-activity-list'>
            <h6 className='text-muted'>Latest Activity</h6>
            <ListGroup className='shadow-sm'>
              <ListGroupItem color='light'>
                Deployed to PROD<br />
                <small class='text-muted'>...</small>
              </ListGroupItem>
              <ListGroupItem color='light'>
                Deployed to STAG<br />
                <small class='text-muted'>...</small>
              </ListGroupItem>
              <ListGroupItem color='light'>
                Deployed to CI<br />
                <small class='text-muted'>...</small>
              </ListGroupItem>
            </ListGroup>
          </div>
        </div>
        <div class='col-8 col-sm-3 fyi-toolpane'>
          <Card className='shadow-sm'>
            <CardHeader>Edit</CardHeader>
            <Form>
              <CardBody>
                <CardTitle><Label>Add Dependency</Label></CardTitle>
                <Input disabled placeholder="FYI Name" type="text" list="data" />
                <small class='form-text text-muted'>Press enter to submit.</small>
              </CardBody>
            </Form>
            <Form>
              <CardBody>
                <CardTitle><Label>Add Repository</Label></CardTitle>
                <Input disabled placeholder="Repo Org" type="select" list="data" >
                  {this.state.orgs && this.state.orgs.map((org) =>
                    <option value={`${org}`}>{org}</option>
                  )}
                </Input>
                <br />
                <Input disabled placeholder="Repo Name" type="text" />
                <small class='form-text text-muted'>Press enter to submit.</small>
              </CardBody>
            </Form>
          </Card>
        </div>
      </div>
    );
    }

    _handleKeyPressNew = (event) => {
      if(event.key == 'Enter') {
        event.preventDefault();
        console.log("submit")
        let fyiName = event.target.value
        fetch('/fyis', {method: "POST", headers: {
          "Accept": "application/json"
        }, body: JSON.stringify({
          fyiName,
        })})
          .then(response => {
            response.json().then(data => {
              console.log(data)
              let fyiId = data.fyiId
              console.log("FYI", fyiId)
              let parts = window.location.href.split('/')
              parts.splice(-1,1)
              parts.push(fyiId)
              let newPath = parts.join('/')
              window.location.href = newPath
            })
          })
        event.target.value = '';
      }
    }
  }

export default FyiNew
