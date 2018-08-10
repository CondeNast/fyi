import React, { Component } from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom'
import FyiViewer from './FyiViewer';
import FyiList from './FyiList';
import './App.css';
import * as serviceWorker from './registerServiceWorker.js';
serviceWorker.unregister()

class App extends Component {
  constructor(props) {
    super(props)
  }
  render() {
    return (
      <div className="App">
       <Switch>
         <Route exact path='/' component={FyiList}/>
         <Route path='/fyis/:fyi' component={FyiViewer}/>
       </Switch> 
      </div>
    );
  }
}

export default App;
