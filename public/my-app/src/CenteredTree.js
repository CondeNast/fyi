import React from "react";
import Tree from "react-d3-tree";


const containerStyles = {
  width: '100%',
  height: '100%',
}

export default class CenteredTree extends React.PureComponent {
  state = {}
  handleClick = (nodeData, event)  => {
    window.location.assign(window.location.href.replace(this.props.data[0].name ,nodeData.name))
  }

  componentDidMount() {
    const dimensions = this.treeContainer.getBoundingClientRect();
    this.setState({
      translate: {
        x: dimensions.width / 2,
        y: dimensions.height / 4
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
          zoomable={false}
          collapsible={false}
          onClick={this.handleClick.bind(this)}

        />
      </div>
    );
  }
}
