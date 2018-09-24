import React, { Component } from 'react';
import { Button, Form, FormGroup, Label, Input } from 'reactstrap'
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

    	  <div class='col-8 col-sm-9' id="treeWrapper">
      	  { this.state.data.name ? <CenteredTree data={[this.state.data]} /> : <hr/> }
    	  </div>

        <div class='col-8 col-sm-3 fyi-toolpane'>
          <h3>{this.state.data.name}</h3>
          <Button color="secondary" size="sm" href={this.state.fyiLink}>Read the FYI</Button>
          <hr />
          <h5>Dependencies</h5>
          <Form>
            <FormGroup>
              <Label>New Dependency</Label>
              <Input placeholder="FYI Name" type="text" list="data" onKeyPress={this._handleKeyPressDep.bind(this)} />
              <small class='form-text text-muted'>Press enter to submit.</small>
            </FormGroup>
          </Form>
          <hr />
          <h5>Repositories</h5>
          {this.state.data.repos && this.state.data.repos.map((repo, index) =>
            <li key={index}><a href={`http://github.com/${repo}`}>{repo}</a></li>
          )}
          <br/>
          <Form>
            <FormGroup>
              <Label>New Repository</Label>
              <Input placeholder="Repo Org" type="select" onChange={this._handleChangeOrg.bind(this)} >
                {this.state.orgs && this.state.orgs.map((org) =>
                  <option value={`${org}`}>{org}</option>
                )}
              </Input>
              <br />
              <Input placeholder="Repo Name" type="text" onKeyPress={this._handleKeyPressRepo.bind(this)} />
              <small class='form-text text-muted'>Press enter to submit.</small>
            </FormGroup>
          </Form>
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
