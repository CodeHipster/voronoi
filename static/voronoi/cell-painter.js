export class Painter{
  constructor(colorScheme){
    this.colorScheme = colorScheme;
  }

  paint(diagram){
    for (let cell of diagram.cells){
      console.log("cell: ", cell)
      cell.color = this.colorScheme.getColor(cell.site.x, cell.site.y)
    }
  }
}