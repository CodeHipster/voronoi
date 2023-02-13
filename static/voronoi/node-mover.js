function getNeighbors(halfEdges, voronoiId){
  let neighborNodes = []
  for (let he of halfEdges){
    if (he.edge.lSite.voronoiId == voronoiId){
      if(he.edge.rSite != null) {neighborNodes.push(he.edge.rSite)}
    }else{
      if(he.edge.lSite != null) {neighborNodes.push(he.edge.lSite)}
    }
  }
  return neighborNodes
}

// bounce node1 of node2
function bounce(node1, node2){
  const normal = {x: node2.y - node1.y, y: node2.x - node1.x }
  const length = Math.sqrt(normal.x * normal.x + normal.y * normal.y)
  // TODO: do we need to normalize? as the direction vector is already a normal
  normal.x /= length
  normal.y /= length

  // reflection: d - 2(d.n)n
  // d = direction of node
  // n = normal of line between 2 nodes.
  const dot = node1.dx * normal.x + node1.dy * normal.y
  let rx = node1.dx - (2 * dot * normal.x)
  let ry = node1.dy - (2 * dot * normal.y)

  // apply bounce to node1
  node1.dx = rx
  node1.dy = ry
}

export class NodeMover{

  // space between nodes (sphere), timestep in ms
  constructor(spacing, timestep){
    // spacing squared, to avoid sqrt
    this.spacing2 = spacing*spacing*2
    this.timestep = timestep
    const stepsPerSecond = (1000/timestep)
    // velocity in x pixels per second
    this.velocity = 3 / stepsPerSecond
  }

  // the diagram gives us neighbours, no sorting required :)
  moveNodes(diagram){
    cellLoop: for (let cell of diagram.cells){
      const node = cell.site
      const oldx = node.x
      const oldy = node.y
      // move node
      node.x += node.dx * this.velocity
      node.y += node.dy * this.velocity

      // bounce of walls

    
      // NOTE: not a perfect bounce, but should work for slow moving nodes.
      const neighbors = getNeighbors(cell.halfedges, cell.site.voronoiId)
      for (let n of neighbors){
        const xdif = node.x - n.x
        const ydif = node.y - n.y
        // distance squared
        const d2 = xdif * xdif + ydif * ydif
        // if node sphere overlaps other node. bounce.
        if (d2 <= this.spacing2){
          bounce(node, n) // change direction of node
          // set position back to previous position so the ball didn't move this step.
          node.x = oldx
          node.y = oldy
          continue cellLoop
        }
      }
    }
  }
}