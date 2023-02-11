// modifies the edges array.
export function sortHalfEdges(edges){
  // skip the last point, as the previous iteration should correct it.
  edgeloop: for (let i = 0; i < edges.length -1; i++){
    const edge = edges[i].edge
    const x = edge.vb.x
    const y = edge.vb.y
    // iterate over remaining edges
    for(let j = i +1; j < edges.length; j++){
      const nEdge = edges[j].edge
      if (nEdge.va.x == x && nEdge.va.y == y){
        // we want this edge to be the next.
        swapEdges(j, i+1, edges)
        continue edgeloop
      }else if(nEdge.vb.x == x && nEdge.vb.y == y){
        swapPoints(nEdge)
        swapEdges(j, i+1, edges)
        continue edgeloop
      }
      // else no match, continue
    }
    //TODO: we have a tiny bug here where we can't find connecting edges. Could be a rounding issue.
    throw new Error('could not find an edge that connects to: ', edge)
  }
}

function swapPoints(edge){
  console.log("swapping points")
  const temp = edge.va
  edge.va = edge.vb
  edge.vb = temp
}

function swapEdges(from, to, edges){
  if(from === to) return; // no need to swap
  console.log("swapping edges")
  const temp = edges[to]
  edges[to] = edges[from]
  edges[from] = temp
}