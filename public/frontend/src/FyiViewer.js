import React, { Component } from 'react';
import CenteredTree from './CenteredTree';

class FyiViewer extends Component {
  constructor(props) {
    super(props)
    this.state = {
      data: {},
      fyiLink: "",
      fyis: []
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

    	  <div class='col-8 col-sm-9' id="treeWrapper">
      	  { this.state.data.name ? <CenteredTree data={[this.state.data]} /> : <hr/> }
    	  </div>

        <div class='col-8 col-sm-3 fyi-toolpane'>
          <h3>{this.state.data.name}</h3>
          <a class='nav-link btn btn-primary btn-sm' href={this.state.fyiLink}>
            Read the FYI
          </a>
          <hr />
          <h4>Edit</h4>
          <form>
            <div class='form-group'>
              <label>New Dependency</label>
              <input class='form-control form-control-lg' placeholder="FYI Name" type="text" list="data" onKeyPress={this._handleKeyPress.bind(this)} />
              <small class='form-text text-muted'>Press enter to submit.</small>
            </div>
          </form>
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
  _handleKeyPress = (event) => {
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
}

export default FyiViewer

function getSearchObject(search){
return JSON.parse('{"' + decodeURI(search).replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g,'":"') + '"}')
}
