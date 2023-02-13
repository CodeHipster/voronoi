export class Painter{
  constructor(colorScheme){
    this.colorScheme = colorScheme;
  }

  paint(nodes){
    for (let node of nodes){
      node.color = this.colorScheme.getColor(node.x, node.y)
    }
  }
}