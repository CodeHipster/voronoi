export class Node {
  constructor(x, y) {
    this.x = x
    this.y = y
    return this
  }

  distance2Node(node) {
    return this.distance2(node.x, node.y)
  }

  distance2(x, y) {
    let dx = this.x - x
    let dy = this.y - y
    return dx * dx + dy * dy
  }

  toString() {
    return `Node: x=${this.x}, y=${this.y}`
  }
};