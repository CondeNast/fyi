import React, { Component } from 'react';
import Tree from 'react-d3-tree';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      data: {}
    }
  }
  render() {
    return (
      <div className="App">
      <div id="treeWrapper" style={{width: '100em', height: '100em'}}>
       { this.state.data.name ? <Tree data={[this.state.data]} /> : <hr/> }
      </div>
      </div>
    );
  }
  componentDidMount() {
      fetch('http://localhost:3000/fyis/autopilot-gq') 
        .then(response => response.json()).then(data => this.setState({ data }));
    }
}

export default App;
