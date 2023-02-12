import {Voronoi} from "../rhill-voronoi.js";
import { sortHalfEdges } from "./edge-sorter.js";
import generator from "./node-generator.js";
import { Painter } from "./cell-painter.js";
import { ColorScheme } from "./color-scheme.js";
import { Color } from "./color.js";

new Vue({
  el: '.root',
  data: {
  },
  mounted() {
    // generate nodes
    let range = { x: 800, y: 800 }
    var bbox = {xl: 0, xr: range.x, yt: 0, yb: range.y};
    let nodes = generator.generate(50, range, 50)

    // get the canvas
    var ctx = document.getElementById("voronoi").getContext("2d")

    // create the voronoi diagram
    let voronoi = new Voronoi()
    let diagram = voronoi.compute(nodes, bbox)
    console.log(diagram)

    // paint the cells
    const scheme = new ColorScheme([
      { x: 50, y: 750, color: new Color(66, 242, 245) },
      { x: 750, y: 50, color: new Color(245, 176, 66) },
      { x: 50, y: 50, color: new Color(245, 32, 32) },
      { x: 750, y: 750, color: new Color(35, 252, 35) }
    ])
    const painter = new Painter(scheme)
    painter.paint(diagram)
    // draw cells
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 3;
    for (const cell of diagram.cells){
      sortHalfEdges(cell.halfedges)
      ctx.fillStyle = `rgb(${cell.color.r},${cell.color.g},${cell.color.b})`;
      ctx.beginPath();
      ctx.moveTo(cell.halfedges[0].edge.va.x, cell.halfedges[0].edge.va.y);
      for (const halfEdge of cell.halfedges){
        const edge = halfEdge.edge
        ctx.lineTo(edge.vb.x, edge.vb.y);
      }
      ctx.closePath();
      ctx.stroke();
      ctx.fill()
    }

    console.log("execution time for diagram: " + diagram.execTime)

  },
  template: `
      <canvas id="voronoi" width="800" height="800" style="border:1px solid #c3c3c3;">
        Your browser does not support the canvas element.
      </canvas>`
})