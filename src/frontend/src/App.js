import React, { Component } from 'react'
import { BrowserRouter, Switch, Route } from 'react-router-dom'
import FyiNew from './FyiNew'
import FyiList from './FyiList'
import FyiViewer from './FyiViewer'
import { Form, FormGroup, Label, Input, Modal, ModalHeader, ModalFooter, ModalBody, Nav, NavItem, NavLink, Navbar, NavbarBrand, NavbarToggler, Button, Collapse, UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap'
import './App.css'
import * as serviceWorker from './registerServiceWorker.js'
serviceWorker.unregister()

class App extends Component {
  constructor (props) {
    super(props)

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
  render () {
    return (
      <div class= 'App'>

        <div class='fyi-navigation'>
           <Navbar color="light" light expand="md">
             <NavbarBrand href="/">Co/Lab FYI</NavbarBrand>
             <NavbarToggler onClick={this.toggle} />
             <Collapse isOpen={this.state.isOpen} navbar>
               <Nav className="ml-auto" navbar>
                 <NavItem>
                   <NavLink href="/systems">Systems</NavLink>
                 </NavItem>
                 <NavItem>
                   <NavLink href="directory">Directory</NavLink>
                 </NavItem>
                 <UncontrolledDropdown nav inNavbar>
                   <DropdownToggle nav caret>
                     Resources
                   </DropdownToggle>
                   <DropdownMenu right>
                     <DropdownItem>
                       Jira
                     </DropdownItem>
                     <DropdownItem>
                       Confluence
                     </DropdownItem>
                     <DropdownItem divider />
                     <DropdownItem>
                       Condé Nast GitHub
                     </DropdownItem>
                     <DropdownItem>
                       Copilot Github
                     </DropdownItem>
                     <DropdownItem divider />
                     <DropdownItem>
                       Verso Components
                     </DropdownItem>
                     <DropdownItem>
                       Verso Docs
                     </DropdownItem>
                   </DropdownMenu>
                 </UncontrolledDropdown>
               <Button color="primary" className='create-fyi' onClick={this.toggleFYIModal}>New</Button>
               </Nav>
             </Collapse>
           </Navbar>
         </div>

        <div class='app-container container-fluid'>

          <div class='fyi-container'>
            <Switch>
              <Route exact path='/' component={FyiList} />
              <Route exact path='/new' component={FyiNew} />
              <Route path='/fyis/:fyiId/*' component={FyiViewer} />
            </Switch>
          </div>

        </div>

        <Modal isOpen={this.state.modal} toggle={this.toggleFYIModal} className={this.props.className}>
          <ModalHeader toggle={this.newFYIModalEvent}>Create an FYI</ModalHeader>
          <ModalBody>
            <Form>
              <FormGroup>
                <Label>Name</Label>
                <Input placeholder="My FYI Name" type="text" />              </FormGroup>
            </Form>
          </ModalBody>
          <ModalFooter>
            <Button color="secondary" outline onClick={this.toggleFYIModal}>Cancel</Button>
            <Button color="primary" onClick={this.toggleFYIModal}>Get Started</Button>{' '}
          </ModalFooter>
        </Modal>

      </div>
    )
  }
}

export default App
