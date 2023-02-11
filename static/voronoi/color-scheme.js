import { Color } from "./color"

export class ColorScheme{
  shades = []
  constructor(startColor, endColor, nrOfShades){
    let div = nrOfShades - 1
    let rStep = (startColor.r - endColor.r)/div
    let gStep = (startColor.g - endColor.g)/div
    let bStep = (startColor.b - endColor.b)/div

    for (i = 0; i <= nrOfShades; i++){
      let r = startColor.r + i*rStep;
      let g = startColor.r + i*gStep;
      let b = startColor.r + i*bStep;
      this.shades.push(new Color(r,g,b))
    }
  }
}