import { base } from "./color.js";

function distance2(x1, y1, x2, y2) {
  let dx = x1 - x2
  let dy = y1 - y2
  return dx * dx + dy * dy
}

export class ColorScheme{
  colorPositions = []
  constructor(colorPositions){
    this.colorPositions = colorPositions;
  }

  getColor(x, y){
    let squaredDistances = []
    let totalSquaredDistance = 0;
    for (let cp of this.colorPositions){
      const d = distance2(x, y, cp.x, cp.y)
      squaredDistances.push(d)
      totalSquaredDistance += d;
    }

    let invertedDistances = []
    let totalInvertedDistance = 0;
    for (let sq of squaredDistances){
      const inv = totalSquaredDistance / sq
      invertedDistances.push(inv)
      totalInvertedDistance += inv;
    }

    let mixedColor = base()
    for (let i = 0; i < this.colorPositions.length; i++){
      const scalar = invertedDistances[i] / totalInvertedDistance
      const scaledColor = this.colorPositions[i].color.scale(scalar)
      mixedColor.add(scaledColor)
    }

    //TODO: Should we brighten the mixed colors a bit?
    return mixedColor;
  }
}
