export class Color {
  constructor(r, g, b) {
    this.r = r
    this.g = g
    this.b = b
  }
  
  toString(){
    return `Color: r=${this.r}, g=${this.g}, b=${this.b}`
  }
}

export function randomColor() {
  return new Color(
    Math.floor(Math.random() * 255),
    Math.floor(Math.random() * 255),
    Math.floor(Math.random() * 255))
};