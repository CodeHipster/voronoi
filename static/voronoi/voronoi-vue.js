import { Voronoi } from "../rhill-voronoi.js";
import { sortHalfEdges } from "./edge-sorter.js";
import generator from "./node-generator.js";
import { Painter } from "./cell-painter.js";
import { ColorScheme } from "./color-scheme.js";
import { Color } from "./color.js";
import { NodeMover } from "./node-mover.js";

new Vue({
  el: '.root',
  data() {
    return {
    }
  },
  methods: {
    step(bbox, nodes, nodeMover, voronoi, ctx, radius) {
      let diagram = voronoi.compute(nodes, bbox)

      // draw cells
      ctx.strokeStyle = '#000000';
      ctx.lineWidth = 3;
      for (const cell of diagram.cells) {
        sortHalfEdges(cell.halfedges)
        ctx.fillStyle = `rgb(${cell.site.color.r},${cell.site.color.g},${cell.site.color.b})`;
        ctx.beginPath();
        ctx.moveTo(cell.halfedges[0].edge.va.x, cell.halfedges[0].edge.va.y);
        for (const halfEdge of cell.halfedges) {
          const edge = halfEdge.edge
          ctx.lineTo(edge.vb.x, edge.vb.y);
        }
        ctx.closePath();
        ctx.stroke();
        ctx.fill()
      }

      // draw spheres off node (for debugging the bouncing)
      // ctx.strokeStyle = '#000000';
      // ctx.lineWidth = 1;
      // for (const cell of diagram.cells) {
      //   ctx.beginPath();
      //   ctx.arc(cell.site.x, cell.site.y, radius, 0, 2 * Math.PI);
      //   ctx.stroke()
      // }

      nodeMover.moveNodes(diagram)
      
      voronoi.recycle(diagram);
    }
  },
  mounted() {
    // generate nodes
    const range = { x: 800, y: 800 }
    const bbox = { xl: 0, xr: range.x, yt: 0, yb: range.y }
    const nodeRadius = 25
    const timestep = 15 // step every x ms
    let nodes = generator.generate(100, bbox, nodeRadius)
    const nodeMover = new NodeMover(nodeRadius, timestep, bbox)

    // paint the cells
    const scheme = new ColorScheme([
      { x: 50, y: 750, color: new Color(66, 242, 245) },
      { x: 750, y: 50, color: new Color(245, 176, 66) },
      { x: 50, y: 50, color: new Color(245, 32, 32) },
      { x: 750, y: 750, color: new Color(35, 252, 35) }
    ])
    const painter = new Painter(scheme)
    painter.paint(nodes)

    // get the canvas
    const ctx = document.getElementById("voronoi").getContext("2d")

    // create the voronoi diagram
    const voronoi = new Voronoi()

    // set interval
    const interval = setInterval(() => {
      try {
        const start = window.performance.now()
        this.step(bbox, nodes, nodeMover, voronoi, ctx, nodeRadius)
        const duration = window.performance.now() - start;
        // console.log('step duration: ', duration)
        if (duration > timestep) {
          // if the hardware is too slow. stop the interval.
          console.log('calculations took too long on device, stopping animation.', duration)
          clearInterval(interval)
        }
      } catch (error) {
        console.log("something broke, stopping the animation", error)
        clearInterval(interval)
        return
      }
    }, timestep);
  },
  template: `
      <canvas id="voronoi" width="800" height="800" style="border:1px solid #c3c3c3;">
        Your browser does not support the canvas element.
      </canvas>`
})