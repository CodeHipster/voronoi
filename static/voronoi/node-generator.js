import { Node } from './node.js'

export class NodeGenerator {
  retries = 100;
  generate(amount, bbox, radius) {
    let nodes = []
    let sqSpacing = (2*radius * 2*radius)
    loopAmount: for (let i = 0; i < amount; i++) {
      for (let t = 0; t < this.retries; t++) {
        let node = this.randomNode(bbox, radius)
        if (this.validateNode(node, nodes, sqSpacing, bbox)) {
          nodes.push(node)
          continue loopAmount
        }
      }
      console.log("Could not find a place to put a node. Returning the nodes generated so far.")
      break
    }
    return nodes
  }

  randomNode(bbox, radius) {
    // position
    let x = Math.floor(Math.random() * ((bbox.xr - radius) - (bbox.xl+ radius))) + bbox.xl + radius
    let y = Math.floor(Math.random() * ((bbox.yb - radius) - (bbox.yt + radius))) + bbox.yt + radius

    // direction
    let dx = (Math.random() * 2) - 1
    let dy = (Math.random() * 2) - 1

    // normalize direction
    const length = Math.sqrt(dx*dx + dy*dy)
    dx /= length
    dy /= length

    return new Node(x, y, dx, dy)
  }

  validateNode(node, nodes, sqSpacing) {
    for (const n of nodes) {
      let sqDistance = node.distance2Node(n)
      if (sqDistance <= sqSpacing) {
        return false
      }
    }
    return true;
  }
}