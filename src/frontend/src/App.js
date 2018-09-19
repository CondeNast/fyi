import React, { Component } from 'react'
import { BrowserRouter, Switch, Route } from 'react-router-dom'
import FyiViewer from './FyiViewer'
import FyiList from './FyiList'
import './App.css'
import * as serviceWorker from './registerServiceWorker.js'
serviceWorker.unregister()

class App extends Component {
  constructor (props) {
    super(props)
  }
  render () {
    return (
      <div class= 'App'>
        <div class='app-container container-fluid'>

          {/* MENU*/}
          <div class='col-6 col-md-2 fyi-sidebar'>
            <h3><a href='/'>Easy FYI</a></h3>
            <p>Discover the Condé Nast software architecture.</p>
          </div>

          {/* Application */}
          <div class='col-12 col-md-10 fyi-container'>
            <Switch>
              <Route exact path='/' component={FyiList} />
              <Route path='/fyis/:fyiId/*' component={FyiViewer} />
            </Switch>
          </div>

        </div>
      </div>
    )
  }
}

export default App