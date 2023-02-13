export class Node {
  // position & direction
  constructor(x, y, dx, dy) {
    this.x = x
    this.y = y
    this.dx = dx
    this.dy = dy
    return this
  }

  distance2Node(node) {
    return this.distance2(node.x, node.y)
  }

  distance2(x, y) {
    let disx = this.x - x
    let disy = this.y - y
    return disx * disx + disy * disy
  }

  toString() {
    return `Node: x=${this.x}, y=${this.y}, x=${this.dx}, y=${this.dy}`
  }
};