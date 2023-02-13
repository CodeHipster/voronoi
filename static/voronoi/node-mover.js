function getNeighbors(halfEdges, voronoiId) {
  let neighborNodes = []
  for (let he of halfEdges) {
    if (he.edge.lSite.voronoiId == voronoiId) {
      if (he.edge.rSite != null) { neighborNodes.push(he.edge.rSite) }
    } else {
      if (he.edge.lSite != null) { neighborNodes.push(he.edge.lSite) }
    }
  }
  return neighborNodes
}

function reflect(node, normal) {
  // reflection: d - 2(d.n)n
  // d = direction of node
  // n = normal of line between 2 nodes.

  const dot = node.dx * normal.x + node.dy * normal.y
  let rx = node.dx - (2 * dot * normal.x)
  let ry = node.dy - (2 * dot * normal.y)

  // apply bounce to node1
  node.dx = rx
  node.dy = ry
}

function bounceWalls(node, spacing, bbox){

  if (node.x - spacing <= bbox.xl) {
    // bounce of left wall
    reflect(node, { x: 1, y: 0 })
    return true;
  }
  if (node.x + spacing >= bbox.xr) {
    // bounce of right wall
    reflect(node, { x: -1, y: 0 })
    return true;
  }
  if (node.y - spacing <= bbox.yt) {
    // bounce of top wall
    reflect(node, { x: 0, y: 1 })
    return true;
  }
  if (node.y + spacing >= bbox.yb) {
    // bounce of bottom wall
    reflect(node, { x: 0, y: -1 })
    return true;
  }
}

// bounce node1 of node2
function bounce(node1, node2) {
  const normal = { x: node2.x - node1.x, y: node2.y - node1.y }
  const length = Math.sqrt(normal.x * normal.x + normal.y * normal.y)
  // normalize normal
  normal.x /= length
  normal.y /= length

  reflect(node1, normal)
  // node bounce does not affect other sphere.
}

export class NodeMover {
  // space between nodes (sphere), timestep in ms
  constructor(radius, timestep, bbox) {
    // spacing squared, to avoid sqrt
    this.bbox = bbox
    this.nodeRadius = radius
    // minimal space between node centers squared
    this.sqSpacing = (2*radius) * (2*radius)
    this.timestep = timestep
    const stepsPerSecond = (1000 / timestep)
    // velocity in x pixels per second
    this.velocity = 3 / stepsPerSecond
  }

  // the diagram gives us neighbours, no sorting required :)
  moveNodes(diagram) {
    cellLoop: for (let cell of diagram.cells) {
      const node = cell.site
      const oldx = node.x
      const oldy = node.y
      // move node
      node.x += node.dx * this.velocity
      node.y += node.dy * this.velocity

      // bounce of walls
      if (bounceWalls(node, this.nodeRadius, this.bbox)){
        // set position back to previous position so the ball didn't move this step.
        node.x = oldx
        node.y = oldy
        continue cellLoop
      }

      // NOTE: not a perfect bounce, but should work for slow moving nodes.
      const neighbors = getNeighbors(cell.halfedges, cell.site.voronoiId)
      for (let n of neighbors) {
        const xdif = node.x - n.x
        const ydif = node.y - n.y
        // distance squared
        const d2 = xdif * xdif + ydif * ydif
        // if node sphere overlaps other node. bounce.
        if (d2 <= (this.sqSpacing)) {
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