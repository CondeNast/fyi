import React, { Component } from 'react';
import CenteredTree from './CenteredTree';
import './App.css';
import * as serviceWorker from './registerServiceWorker.js';
serviceWorker.unregister()

class App extends Component {
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
      <div className="App">
            <a href={this.state.fyiLink}>Read the FYI</a><br/>
            <label> Depends on &nbsp; &nbsp;
	      <input type="text" list="data" onKeyPress={this._handleKeyPress} />
            </label>

            <datalist id="data">
                {this.state.fyis.map((fyi, index) =>
                    <option value={fyi} key={index}/>
                )}
            </datalist>
	  <div id="treeWrapper" style={{width: '100%', height: '80vh'}}>
	   { this.state.data.name ? <CenteredTree data={[this.state.data]} /> : <hr/> }
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
     search = JSON.parse('{"' + decodeURI(search).replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g,'":"') + '"}')
    }
    catch(e){
      search = {}
    }
      Promise.all([fetch(`/fyis/${search.fyi}`, options) , fetch('/fyis', options)])
        .then(([response, response2]) => Promise.all([ response.json(), response2.json()])).then( ([data, fyis]) => {
          this.setState({ name: search.fyi, data, fyis: fyis.fyis, fyiLink: data.link})
        });
    }
  _handleKeyPress = (event) => {
    let newDependency = event.target.value
    if(newDependency !== "" && event.key === "Enter"){
      this.state.data.children.push({name: newDependency})
      this.setState(this.state)
      event.target.value = '';
      fetch('/fyis/'+this.state.name, {method: "POST", body: JSON.stringify({
        name: this.state.name,
        dependencies: {
          fyis: this.state.data.children.map(c => c.name)
        }
      })})
    }
  }
}

export default App;
