import React, { Component } from 'react';
import CenteredTree from './CenteredTree';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      data: {},
      fyis: []
    }
  }
  render() {
    return (
      <div className="App">
	  <div id="treeWrapper" style={{width: '100em', height: '50em'}}>
	   { this.state.data.name ? <CenteredTree data={[this.state.data]} /> : <hr/> }
	  </div>
	    <input type="text" list="data" onKeyPress={this._handleKeyPress} />

            <datalist id="data">
                {this.state.fyis.map((fyi, index) =>
                    <option value={fyi} key={index}/>
                )}
            </datalist>
      </div>
    );
  }
  componentDidMount() {
    let search = window.location.search.substring(1);
    search = JSON.parse('{"' + decodeURI(search).replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g,'":"') + '"}')
      Promise.all([fetch(`/fyis/${search.fyi}`) , fetch('/fyis')])
        .then(([response, response2]) => Promise.all([ response.json(), response2.json()])).then( ([data, fyis]) => {
          this.setState({ name: search.fyi, data, fyis: fyis.fyis })
        });
    }
  _handleKeyPress = (event) => {
    let newDependency = event.target.value
    if(newDependency !== "" && event.key === "Enter"){
      this.state.data.children.push({name: newDependency})
      this.setState(this.state)
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
