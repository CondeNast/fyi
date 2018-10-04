import React from "react";
import Tree from "react-d3-tree";


const containerStyles = {
  width: '100%',
  height: '100%',
}

const textLayoutStyle = {
  // className:
  // style:
  // textAnchor:
  x: 18,
  y: -1,
  // transform:
  // dy:
}

export default class CenteredTree extends React.PureComponent {
  state = {}
  handleClick = (nodeData, event)  => {
    window.location.assign(window.location.href.replace(/fyis.*/,  `fyis/${nodeData.fyiId}/${encodeURIComponent(nodeData.name)}`))
  }

  componentDidMount() {
    const dimensions = this.treeContainer.getBoundingClientRect();
    this.setState({
      translate: {
        x: dimensions.width / 2,
        y: dimensions.height / 6
      }
    });
  }

  render() {
    return (
      <div class='fyi-diagram' style={containerStyles} ref={tc => (this.treeContainer = tc)}>
        <Tree
          data={this.props.data}
          translate={this.state.translate}
          orientation={'vertical'}
          zoomable={true}
          collapsible={false}
          onClick={this.handleClick.bind(this)}
          textLayout={textLayoutStyle}
      allowForeignObjects
	    nodeLabelComponent={{
	      render: <NodeLabel className='fyi-node' />,
	      foreignObjectWrapper: {
		y: 0
	      }
      }}
        />
      </div>
    );
  }
}
class NodeLabel extends React.PureComponent {
  render() {
    const {className, nodeData} = this.props
    return (
      <div className={className}>
	  {nodeData.name}
      </div>
    )
  }
}

