// test the drawing speed of path fill of triangles vs drawing each pixel.

import { Color } from "../voronoi/color.js";
import { ColorScheme } from "../voronoi/color-scheme.js";

// using a 800 x 800 grid

// polygon fill duration: 0.09999999403953552
// fill-vs-pixel.js:38 pixel fill duration: 486.40000000596046
// about 5k times faster....

export function colorSchemeTest(ctx) {
  const scheme = new ColorScheme([
    { x: 50, y: 50, color: new Color(255, 0, 0) },
    { x: 750, y: 50, color: new Color(0, 255, 0) },
    { x: 750, y: 750, color: new Color(0, 0, 255) }
  ])
  for (let y = 0; y < 800; y++) {
    for (let x = 0; x < 800; x++) {
      const c = scheme.getColor(x, y)
      ctx.fillStyle = `rgb(${c.r},${c.g},${c.b})`;
      ctx.fillRect(x, y, 1, 1)
    }
  }
}

export function colorSchemeTest2(ctx) {
  const scheme = new ColorScheme([
    { x: 50, y: 750, color: new Color(66, 242, 245) },
    { x: 750, y: 50, color: new Color(245, 176, 66) }
  ])
  for (let y = 0; y < 800; y++) {
    for (let x = 0; x < 800; x++) {
      const c = scheme.getColor(x, y)
      ctx.fillStyle = `rgb(${c.r},${c.g},${c.b})`;
      ctx.fillRect(x, y, 1, 1)
    }
  }
}