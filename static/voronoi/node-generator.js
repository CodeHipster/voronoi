import { Node } from './node.js'

class NodeGenerator {
  retries = 100;
  generate(amount, range, spacing) {
    let nodes = []
    let spacing2 = spacing * spacing + spacing * spacing
    loopAmount: for (let i = 0; i < amount; i++) {
      for (let t = 0; t < this.retries; t++) {
        let node = this.randomNode(range)
        if (this.validateNode(node, nodes, spacing2)) {
          nodes.push(node)
          continue loopAmount
        }
      }
      console.log("Could not find a place to put a node. Returning the nodes generated so far.")
      break
    }
    return nodes
  }

  randomNode(range) {
    let x = Math.floor(Math.random() * range.x)
    let y = Math.floor(Math.random() * range.y)
    return new Node(x, y)
  }

  validateNode(node, nodes, spacing2) {
    for (const n of nodes) {
      let distance2 = node.distance2Node(n)
      if (distance2 <= spacing2) {
        return false
      }
    }
    return true;
  }
}

export default new NodeGenerator()