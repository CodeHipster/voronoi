export class NodeList {
  
  #nodes = []

  constructor(nodes){
    this.#nodes = nodes
  }

  getNode(x, y){
    let closestNode = null
    let closestDistance = Number.MAX_SAFE_INTEGER
    for (const node of this.#nodes) {
      let distance2 = node.distance2(x, y)
      if (distance2 < closestDistance) {
        closestDistance = distance2;
        closestNode = node;
      }
    }
    return closestNode;
  }
};