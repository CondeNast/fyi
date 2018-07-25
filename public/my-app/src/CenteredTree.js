import React from "react";
import Tree from "react-d3-tree";


const containerStyles = {
  width: '100%',
  height: '100vh',
}

export default class CenteredTree extends React.PureComponent {
  state = {}

  componentDidMount() {
    const dimensions = this.treeContainer.getBoundingClientRect();
    this.setState({
      translate: {
        x: dimensions.width / 2,
        y: dimensions.height / 2
      }
    });
  }

  render() {
    return (
      <div style={containerStyles} ref={tc => (this.treeContainer = tc)}>
        <Tree 
          data={this.props.data} 
          translate={this.state.translate} 
          orientation={'vertical'}
        />
      </div>
    );
  }
}
