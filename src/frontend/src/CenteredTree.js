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
    const tree = this.props.data[0]
    const howManyNodesWide = treeMaxWidth(this.props.data[0])
    const howManyNodesHigh = treeHeight(this.props.data[0])

    // default diagram position
    var zoom = 1;
    var xPoint = dimensions.width / 2 // the x position of the center of the primary point
    var yPoint = dimensions.height / 6 // the y position of the center of the primary point

    // positioning logic, given tree width dimension
    if (howManyNodesWide > 5) {
      zoom = 0.6;

    } else if (howManyNodesWide >= 3) {
      zoom = 0.8;
      // other positioning logic can be used in these statements
      // yPoint = dimensions.height / 4.5
    }

    this.setState({
      zoom: zoom,
      translate: {
        x: xPoint,
        y: yPoint
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
          zoom={this.state.zoom}
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


function treeHeight(tree) {
  if(tree.children && tree.children.length !== 0) {
    return 1 + Math.max(...tree.children.map(treeHeight))
  }
  else {
    return 1;
  }
}

function treeMaxWidth(tree){
  let widths = []
  let height = treeHeight(tree)
  for(let i = 0;i <= height; i++){
     widths.push(getLevel(tree, i).length)
  }
  return Math.max(...widths)
}

function getLevel(tree, level){
  if(level === 0) { return [tree] }
  let ret = getNextLevel([tree])
  for(let i = 0;i < level - 1; i++){
    ret = getNextLevel(ret)
  }
  return ret
}

function getNextLevel(trees){
    return trees.map((n) => n.children).reduce(
      function(accumulator, currentValue) {
	return accumulator.concat(currentValue);
      },
      []
    )

}
