const tolerance = 0.00001

// modifies the edges array.
export function sortHalfEdges(edges) {
  // skip the last point, as the previous iteration should correct it.
  edgeloop: for (let i = 0; i < edges.length - 1; i++) {
    const edge = edges[i].edge
    const x = edge.vb.x
    const y = edge.vb.y
    // iterate over remaining edges
    for (let j = i + 1; j < edges.length; j++) {
      const nEdge = edges[j].edge
      if (vertexMatch(nEdge.va, edge.vb)) {
        // we want this edge to be the next.
        swapEdges(j, i + 1, edges)
        continue edgeloop
      } else if (vertexMatch(nEdge.vb, edge.vb)) {
        // first swap points off edge. and then make it next in line.
        swapPoints(nEdge)
        swapEdges(j, i + 1, edges)
        continue edgeloop
      }
      // else no match, continue
    }
    console.log(edge, edges)
    throw new Error('could not find an edge that connects to.')
  }
}

function vertexMatch(pointA, pointB) {
  return (pointA.x == pointB.x || Math.abs(pointA.x - pointB.x) < tolerance) // x is within tolerance
    && (pointA.y == pointB.y || Math.abs(pointA.y - pointB.y) < tolerance) // y is within tolerance
}

function swapPoints(edge) {
  const temp = edge.va
  edge.va = edge.vb
  edge.vb = temp
}

function swapEdges(from, to, edges) {
  if (from === to) return; // no need to swap
  const temp = edges[to]
  edges[to] = edges[from]
  edges[from] = temp
}