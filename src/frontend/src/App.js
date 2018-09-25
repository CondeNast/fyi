import React, { Component } from 'react'
import { BrowserRouter, Switch, Route } from 'react-router-dom'
import FyiNew from './FyiNew'
import FyiList from './FyiList'
import FyiViewer from './FyiViewer'
import { Nav, NavItem, NavLink } from 'reactstrap'
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

          <div class='col-6 col-md-2 fyi-sidebar'>
            <h3><a href='/'>Easy FYI</a></h3>
            <p>Discover the Condé Nast software architecture.</p>

            <Nav pills>
              <NavItem>
                <NavLink href="https://cnissues.atlassian.net/secure/Dashboard.jspa">Jira</NavLink>
                <NavLink href="https://cnissues.atlassian.net/wiki/spacedirectory/view.action">Confluence</NavLink>
                <NavLink href="https://github.com/condenast">GitHub</NavLink>
                <NavLink href="http://verso-components.conde.io/">Verso</NavLink>
                <NavLink href="https://foundation.conde.io">Verso Docs</NavLink>

              </NavItem>
            </Nav>
          </div>

          <div class='col-12 col-md-10 fyi-container'>
            <Switch>
              <Route exact path='/' component={FyiList} />
              <Route exact path='/new' component={FyiNew} />
              <Route path='/fyis/:fyiId/*' component={FyiViewer} />
            </Switch>
          </div>

        </div>
      </div>
    )
  }
}

export default App
