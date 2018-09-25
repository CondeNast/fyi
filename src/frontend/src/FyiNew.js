import React, { Component } from 'react'
import { Button, Form, FormGroup, Label, Input } from 'reactstrap'

class FyiNew extends Component {
  constructor (props) {
    super(props);
  }

  render() {
    return (
      <div class='col-8 col-sm-3 fyi-toolpane'>
        <h3>New FYI</h3>
        <Form>
          <FormGroup>
            <Label>Name</Label>
            <Input placeholder="Name" type="text" />
            <Label>Add Repositories</Label>
            <Input placeholder="Repositories" type="text" type="text"/>
            <Label>Add Dependencies</Label>
            <Input placeholder="Dependencies" type="text" type="text"/>
            <Button color="secondary" size="sm" href="">Submit</Button>
          </FormGroup>
        </Form>
      </div>
    )
  }
}

export default FyiNew
