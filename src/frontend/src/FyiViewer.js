import React, { Component } from 'react';
import { Button, Form, Label, Input, ListGroup, ListGroupItem, Badge, Card, CardHeader, CardText, CardFooter, CardBody, CardTitle, } from 'reactstrap'
import CenteredTree from './CenteredTree';
import Truncate from 'react-truncate-html';

class FyiViewer extends Component {
  constructor(props) {
    super(props)
    this.state = {
      data: {},
      fyis: [],
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
              <CardTitle>{this.state.data.name}</CardTitle>
              <CardText><Truncate lines={5} dangerouslySetInnerHTML={{ __html: this.state.data.content}} /></CardText>
              <Button outline color="secondary" size="sm" href={this.state.fyiLink}>View in Confluence</Button>
            </CardBody>
          </Card>

          <hr />

          <Card className='shadow-sm fyi-tags' >
            <CardHeader>Tags</CardHeader>
              <CardBody className='tag-body'>
                {this.state.data.tags && this.state.data.tags.filter((t) => !(['drip'].includes(t))).map(function(tag, index){
                  return <Badge color='info'>
                    {tag}
                    <a class='remove-tag-button' href='#remove-tag' data-tag={tag} onClick={this._removeTag.bind(this)}>×</a>
                    </Badge>
                }, this)}
              </CardBody>

              <hr data-note='Add Tag' />

                <CardBody>
                  <Form>
                    <Input placeholder="Tag Name" type="text" list="data" onKeyPress={this._handleKeyPressTag.bind(this)} size='sm'/>
                    <small class='form-text text-muted'>Press enter to add</small>
                    </Form>
                </CardBody>
          </Card>
        </div>

        <div class='fyi-details col-6 no-gutters'>
        <datalist id="list-of-fyis">
          {this.state.fyis.map((fyi, index) =>
            <option value={fyi.name} key={index}/>
          )}
        </datalist>
        <datalist id="data-orgs">
        </datalist>
      	  <div class='fyi-diagram-container shadow-sm' id="treeWrapper">
        	  { this.state.data.name ? <CenteredTree data={[this.state.data]} /> : <hr/> }
      	  </div>

          <div class='fyi-activity-list'>
            <h6 className='text-muted'>Latest Activity</h6>
          { this.state.data.deploys && this.state.data.deploys.found ?
                (<ListGroup className='shadow-sm'>
                  {this.state.data.deploys.events.map((repo, index) => {
                    return Object.keys(repo).map((key) => {
                      let deployment = repo[key]
                      if(deployment.fyi.date_happened_human) {
                        return (
                          <ListGroupItem color='light'>
                            <strong>{deployment.fyi.repo_path}:</strong> Deployed to {key.toUpperCase()}<br />
                            <small class='text-muted'>{deployment.fyi.date_happened_human}</small>
                          </ListGroupItem>
                        )
                      }
                    })
                  })}
                </ListGroup>)
          :
            (<div><p className='text-muted'>None found.</p></div>)
          }
          </div>

        </div>

        <div class='col-8 col-sm-3 fyi-toolpane'>

          <Card className='shadow-sm'>
            <CardHeader>{this.state.data.name} Dependencies</CardHeader>

              <CardBody className='with-list'>
                <Form>
                  <ul>
                  {this.state.data.children && this.state.data.children.map((dependent) =>
                    <li class='fyi-current-dependency'><a href={"/fyis/"+dependent.fyiId + "/" + dependent.name}>{dependent.name}</a> <a data-dep-name={dependent.name} class="remove-dependency-button text-danger" href="#" onClick={this.__handleOnClickDeleteDependency.bind(this)}>Disconnect</a></li>
                  )}
                  </ul>
                </Form>
              </CardBody>
              <hr data-note='Add Dependency' />
              <CardBody>
                <Form>
                  <Input placeholder="Existing FYI Name" type="text" list="list-of-fyis" onKeyPress={this._handleKeyPressDep.bind(this)} size='sm'/>
                  <small class='form-text text-muted'>Press enter to add</small>
                </Form>
              </CardBody>

          </Card>

          <Card className="shadow-sm">
            <CardHeader>Related Repositories</CardHeader>
            <CardBody className='with-list'>
              <ul>
                {this.state.data.repos && this.state.data.repos.map((repo, index) =>
                  <li class='fyi-current-repo'><a href={`http://github.com/${repo}`}>{repo}</a> <a class="remove-repo-button text-danger" href="#" onClick=''>Disconnect</a></li>
                )}
              </ul>
            </CardBody>

            <hr data-note='Add Repository' />

            <CardBody>
              <Form>
                <Input placeholder="Repo Org" type="select" list="data" onChange={this._handleChangeOrg.bind(this)} size='sm' >
                  {this.state.orgs && this.state.orgs.map((org) =>
                    <option value={`${org}`}>{org}</option>
                  )}
                </Input>
                <small class='form-text text-muted'>Select GitHub organization</small>
                <Input placeholder="Repo Name" type="text" onKeyPress={this._handleKeyPressRepo.bind(this)} size='sm'/>
                <small class='form-text text-muted'>Press enter to submit.</small>
              </Form>
            </CardBody>
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
          this.setState({ name: search.fyi, data, fyis: fyis.all})
        });
    }
  __handleOnClickDeleteDependency = (event) => {
    let deletedDep = event.target.getAttribute('data-dep-name')
    this.state.data.children = this.state.data.children.filter( (c) => c.name !== deletedDep)
    this.setState(this.state)
    saveFyi(this.state.data.name, this.state.data.children.map(c => c.name))
    event.preventDefault()
  }
  _removeTag = (event) => {
    let removedTag = event.target.getAttribute('data-tag')
    this.state.data.tags = this.state.data.tags.filter( (c) => c !== removedTag)
    this.setState(this.state)
    saveFyi(this.state.data.name, this.state.data.children.map(c => c.name), this.state.data.tags)
    event.preventDefault()
  }
  _handleKeyPressTag = (event) => {
    let newTag = event.target.value
    if(newTag !== "" && event.key === "Enter"){
      this.state.data.tags.push(newTag)
      this.setState(this.state)
      event.target.value = '';
      saveFyi(this.state.data.name, this.state.data.children.map(c => c.name), this.state.data.tags)
      event.preventDefault()
    }
  }
  _handleKeyPressDep = (event) => {
    let newDependency = event.target.value
    if(newDependency !== "" && event.key === "Enter"){
      this.state.data.children.push({name: newDependency})
      this.setState(this.state)
      event.target.value = '';
      saveFyi(this.state.data.name, this.state.data.children.map(c => c.name))
      event.preventDefault()
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

function saveFyi(name, dependencies=[], tags=[]){
    fetch('/fyis/'+name, {method: "POST", headers: {
      "Accept": "application/json"
    }, body: JSON.stringify({
      name: name,
      tags: tags,
      dependencies: {
        fyis: dependencies
      }
    })})

}

export default FyiViewer
