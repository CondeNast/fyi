import React, { Component } from 'react';
import { Button, Form, Label, Input, ListGroup, ListGroupItem, Badge, Card, CardHeader, CardText, CardFooter, CardBody, CardTitle, } from 'reactstrap'
import CenteredTree from './CenteredTree';

class FyiViewer extends Component {
  constructor(props) {
    super(props)
    this.state = {
      data: {},
      fyiLink: "",
      fyis: [],
      orgs: process.env.REACT_APP_SUBSCRIBED_ORGS.split(',')
    }
  }
  render() {
    return (
      <div class='viewer'>
        <datalist id="data">
          {this.state.fyis.map((fyi, index) =>
            <option value={fyi.name} key={index}/>
          )}
        </datalist>
        <datalist id="data-orgs">
        </datalist>

        <div class='fyi-details col-8 col-sm-9 no-gutters'>

          <datalist id="data">
            {this.state.fyis.map((fyi, index) =>
              <option value={fyi.name} key={index}/>
            )}
          </datalist>

          <h6 className='text-muted'>Connections</h6>
      	  <div class='fyi-diagram-container shadow-sm' id="treeWrapper">
        	  { this.state.data.name ? <CenteredTree data={[this.state.data]} /> : <hr/> }
      	  </div>

          <div class='fyi-activity-list'>
            <h6 className='text-muted'>Latest Activity</h6>
            <ListGroup className='shadow-sm'>
              <ListGroupItem color='primary'>
                <strong>tyler_reinhard@condenast.com:</strong> Deployed <code>4610e41</code><br />
                <small class='text-muted'>Sept 28, 2018 at 6:30 PM · v6.3</small>
                <Button color="primary" size="sm" href='#'>...</Button>
              </ListGroupItem>
              <ListGroupItem color='secondary'>
                <strong>tyler_reinhard@condenast.com:</strong> Deployed <code>4610e41</code><br />
                <small class='text-muted'>Sept 28, 2018 at 6:30 PM · v6.3</small>
                <Button color="secondary" size="sm" href='#'>...</Button>
              </ListGroupItem>
              <ListGroupItem color='success'>
                <strong>tyler_reinhard@condenast.com:</strong> Deployed <code>4610e41</code><br />
                <small class='text-muted'>Sept 28, 2018 at 6:30 PM · v6.3</small>
                <Button color="success" size="sm" href='#'>...</Button>
              </ListGroupItem>
              <ListGroupItem color='danger'>
                <strong>tyler_reinhard@condenast.com:</strong> Deployed <code>4610e41</code><br />
                <small class='text-muted'>Sept 28, 2018 at 6:30 PM · v6.3</small>
                <Button color="danger" size="sm" href='#'>...</Button>
              </ListGroupItem>
              <ListGroupItem color='warning'>
                <strong>tyler_reinhard@condenast.com:</strong> Deployed <code>4610e41</code><br />
                <small class='text-muted'>Sept 28, 2018 at 6:30 PM · v6.3</small>
                <Button color="warning" size="sm" href='#'>...</Button>
              </ListGroupItem>
              <ListGroupItem color='info'>
                <strong>tyler_reinhard@condenast.com:</strong> Deployed <code>4610e41</code><br />
                <small class='text-muted'>Sept 28, 2018 at 6:30 PM · v6.3</small>
                <Button color="info" size="sm" href='#'>...</Button>
              </ListGroupItem>
              <ListGroupItem color='light'>
                <strong>tyler_reinhard@condenast.com:</strong> Deployed <code>4610e41</code><br />
                <small class='text-muted'>Sept 28, 2018 at 6:30 PM · v6.3</small>
                <Button color="light" size="sm" href='#'>...</Button>
              </ListGroupItem>
              <ListGroupItem color='dark'>
                <strong>tyler_reinhard@condenast.com:</strong> Deployed <code>4610e41</code><br />
                <small class='text-muted'>Sept 28, 2018 at 6:30 PM · v6.3</small>
                <Button color="dark" size="sm" href='#'>...</Button>
              </ListGroupItem>
            </ListGroup>
          </div>
        </div>

        <div class='col-8 col-sm-3 fyi-toolpane'>
          <h6 className='text-muted'>About</h6>
          <Card className="shadow-sm">
            <CardHeader><a href={"/fyis/"+this.state.data.id + "/" + this.state.data.name}>{this.state.data.name}</a><Badge href="#" color='secondary' pill>5 Connections</Badge></CardHeader>
            <CardBody>
              <CardText>This is the content of the FYI, truncated at about 300 characters for best fit. The truncation should includ an ellipsis to indicate there is more content on Confluence ...</CardText>
              <Button outline color="secondary" size="sm" href={this.state.fyiLink}>View in Confluence</Button>
            </CardBody>
            <CardFooter><small class="text-muted">Last updated 3 mins ago</small></CardFooter>
          </Card>

          <hr />
          <h6 className='text-muted'>Edit</h6>
          <Card className='shadow-sm'>
            <Form>
              <CardBody>
                <CardTitle><Label>Add Dependency</Label></CardTitle>
                <Input placeholder="FYI Name" type="text" list="data" onKeyPress={this._handleKeyPressDep.bind(this)} />
                <small class='form-text text-muted'>Press enter to submit.</small>
              </CardBody>
            </Form>
          </Card>

          <Card className='shadow-sm'>
            <Form>
              <CardBody>
                <CardTitle><Label>Add Repository</Label></CardTitle>
                <Input placeholder="Repo Org" type="select" list="data" onChange={this._handleChangeOrg.bind(this)} >
                  {this.state.orgs && this.state.orgs.map((org) =>
                    <option value={`${org}`}>{org}</option>
                  )}
                </Input>
                <br />
                <Input placeholder="Repo Name" type="text" onKeyPress={this._handleKeyPressRepo.bind(this)} />
                <small class='form-text text-muted'>Press enter to submit.</small>
              </CardBody>
            </Form>
          </Card>
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
      Promise.all([fetch(`/fyis/${search.fyiId}/whatever`, options) , fetch('/fyis', options)])
        .then(([response, response2]) => Promise.all([ response.json(), response2.json()])).then( ([data, fyis]) => {
          this.setState({ name: search.fyi, data, fyis: fyis.all, fyiLink: data.link})
        });
    }
  _handleKeyPressDep = (event) => {
    let newDependency = event.target.value
    if(newDependency !== "" && event.key === "Enter"){
      this.state.data.children.push({name: newDependency})
      this.setState(this.state)
      event.target.value = '';
      fetch('/fyis/'+this.state.data.name, {method: "POST", headers: {
        "Accept": "application/json"
      }, body: JSON.stringify({
        name: this.state.data.name,
        dependencies: {
          fyis: this.state.data.children.map(c => c.name)
        }
      })})
    }
  }
  _handleChangeOrg = (event) => {
    this.state.org = event.target.value
  }
  _handleKeyPressRepo = (event) => {
    if(event.key == 'Enter') {
      event.preventDefault();
      let org = this.state.org ? this.state.org : this.state.orgs[0]
      let repo = event.target.value
      console.log(`${org}/${repo}`)
      fetch('/repos', {method: "POST", headers: {
        "Accept": "application/json"
      }, body: JSON.stringify({
        name: repo,
        org,
        fyiName: this.state.data.name
      })})
      event.target.value = '';
    }
  }
}

export default FyiViewer
