import React, { Component } from 'react'
import { BrowserRouter, Switch, Route } from 'react-router-dom'
import FyiList from './FyiList'
import FyiDeployViewer from './FyiDeployViewer'
import FyiViewer from './FyiViewer'
import { Form, FormGroup, Label, Input, Modal, ModalHeader, ModalFooter, ModalBody, Nav, NavItem, NavLink, Navbar, NavbarBrand, NavbarToggler, Button, Collapse, UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap'
import './App.css'
import * as serviceWorker from './registerServiceWorker.js'
serviceWorker.unregister()

class App extends Component {
  constructor (props) {
    super(props)
    this.newFYITextInputRef = React.createRef();
    this.toggleDropdown = this.toggleDropdown.bind(this);
    this.toggleFYIModal = this.toggleFYIModal.bind(this);
    this.state = {
      dropdownOpen: false,
      modal: false
    };
  }

  toggleFYIModal() {
    this.setState({
      modal: !this.state.modal
    });
  }

  toggleDropdown() {
    this.setState({
      dropdownOpen: !this.state.dropdownOpen
    });
  }

  newFYICreateEvent = (event) => {
    let fyiName = this.newFYITextInputRef.current.value
    if(fyiName) {
      fetch('/fyis', {method: "POST", headers: {
        "Accept": "application/json"
      }, body: JSON.stringify({
        fyiName,
      })})
        .then(response => {
          response.json().then(data => {
            let fyiId = data.fyiId
            let parts = window.location.href.split('/')
            parts.splice(-1,1)
            parts.push('fyis')
            parts.push(fyiId)
            let newPath = parts.join('/')
            window.location.href = newPath
          })
        })
    }
    event.preventDefault();
  }

  render () {
    return (
      <div class= 'App'>

        <div class='fyi-navigation'>
           <Navbar color="light" light expand="md">
             <NavbarBrand href="/">FYI</NavbarBrand>
             <NavbarToggler onClick={this.toggle} />
             <Collapse isOpen={this.state.isOpen} navbar>
               <Nav className="ml-auto" navbar>
               <Button color="primary" className='create-fyi' onClick={this.toggleFYIModal}>New</Button>
               </Nav>
             </Collapse>
           </Navbar>
         </div>

        <div class='app-container container-fluid'>
          <div class='fyi-container'>
            <Switch>
              <Route exact path='/' component={FyiList} />
              <Route exact path='/deploys' component={FyiDeployViewer} />
              <Route path='/fyis/:fyiId*' component={FyiViewer} />
            </Switch>
          </div>

        </div>

        <Modal isOpen={this.state.modal} toggle={this.toggleFYIModal} className={this.props.className}>
          <ModalHeader toggle={this.newFYIModalEvent}>Create an FYI</ModalHeader>
          <ModalBody>
            <Form onSubmit={this.newFYICreateEvent}>
              <FormGroup>
                <Label>Name</Label>
                <Input innerRef={this.newFYITextInputRef} placeholder="My FYI Name" type="text" />
              </FormGroup>
            </Form>
          </ModalBody>
          <ModalFooter>
            <Button color="secondary" outline onClick={this.toggleFYIModal}>Cancel</Button>
            <Button color="primary" onClick={this.newFYICreateEvent}>Create</Button>
          </ModalFooter>
        </Modal>

      </div>
    )
  }
}

export default App
