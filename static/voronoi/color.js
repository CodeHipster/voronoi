export class Color {
  constructor(r, g, b) {
    this.r = r
    this.g = g
    this.b = b
  }

  scale(scalar) {
    return new Color(
      Math.min(255, this.r * scalar),
      Math.min(255, this.g * scalar),
      Math.min(255, this.b * scalar))
  }

  add(color) {
    this.r = Math.min(255, this.r + color.r)
    this.g = Math.min(255, this.g + color.g)
    this.b = Math.min(255, this.b + color.b)
  }

  toString() {
    return `Color: r=${this.r}, g=${this.g}, b=${this.b}`
  }
}

export function randomColor() {
  return new Color(
    Math.floor(Math.random() * 255),
    Math.floor(Math.random() * 255),
    Math.floor(Math.random() * 255))
};

export function base() {
  return new Color(0, 0, 0)
}