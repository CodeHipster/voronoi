// test the drawing speed of path fill of triangles vs drawing each pixel.

// using a 800 x 800 grid

// polygon fill duration: 0.09999999403953552
// fill-vs-pixel.js:38 pixel fill duration: 486.40000000596046
// about 5k times faster....

export function polygons(ctx) {
  let start = window.performance.now()
  ctx.fillStyle = '#ff0000';
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(799, 0);
  ctx.lineTo(799, 799);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = '#00ff00';
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(0, 799);
  ctx.lineTo(799, 799);
  ctx.closePath();
  ctx.fill();
  console.log("polygon fill duration: " + (window.performance.now() - start))
}

export function pixels(ctx) {
  let start = window.performance.now()
  ctx.fillStyle = '#0ff000';
  for (let y = 0; y < 400; y++){
    for (let x = 0; x < 800; x++){
      ctx.fillRect( x, y, 1, 1 )
    }
  }
  ctx.fillStyle = '#000ff0';
  for (let y = 400; y < 800; y++){
    for (let x = 0; x < 800; x++){
      ctx.fillRect( x, y, 1, 1 )
    }
  }
  console.log("pixel fill duration: " + (window.performance.now() - start))
}