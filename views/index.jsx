var React = require('react');

class HelloMessage extends React.Component {
  render() {
    return <form action="/create-fyi" method="post">
             <label>FYI Name: <input type="text" name="name"/></label><br/><br/>
             <label>FYI Content: <textarea name="content"/></label><br/><br/>
             <button>Submit</button>
           </form>
  }
}

module.exports = HelloMessage;
