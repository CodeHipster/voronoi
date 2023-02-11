import {Voronoi} from "../rhill-voronoi.js";
import { randomColor } from "./color.js";
import { sortHalfEdges } from "./edge-sorter.js";
import generator from "./node-generator.js";
import { NodeList } from "./node-list.js";
import { Node } from "./node.js";

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
    console.log("execution time for diagram: " + diagram.execTime)

    voronoi.recycle()

    let start = window.performance.now()

    voronoi.compute(nodes, bbox)
    // draw cells
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 3;
    for (const cell of diagram.cells){
      sortHalfEdges(cell.halfedges)
      const c = randomColor()
      ctx.fillStyle = `rgb(${c.r},${c.g},${c.b})`;
      // ctx.fillStyle = `#ff0000`;
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

    console.log("image render cycle duration: " + (window.performance.now() - start))
    console.log("execution time for diagram: " + diagram.execTime)

  },
  template: `
      <canvas id="voronoi" width="800" height="800" style="border:1px solid #c3c3c3;">
        Your browser does not support the canvas element.
      </canvas>`
})