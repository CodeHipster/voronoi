import { Color } from "./voronoi/color.js";
import { VoronoiAnimation } from "./voronoi/voronoi-animation.js";
import { sortHalfEdges } from "./edge-sorter.js";

function startVoronoi() {
    // get the canvas
    const ctx = document.getElementById("voronoi").getContext("2d")
    const stepFunction = function(diagram) {
      // draw cells
      ctx.strokeStyle = '#000000'
      ctx.lineWidth = 3
      for (const cell of diagram.cells) {
        // Put the edges of the diagram in sequential order. Because the edges are in shared between cells
        // the sorting can not be done for the entire diagram (because it will unsort for another cell.)
        sortHalfEdges(cell.halfedges)
        ctx.fillStyle = `rgb(${cell.site.color.r},${cell.site.color.g},${cell.site.color.b})`
        ctx.beginPath()
        ctx.moveTo(cell.halfedges[0].edge.va.x, cell.halfedges[0].edge.va.y)
        for (const halfEdge of cell.halfedges) {
          const edge = halfEdge.edge
          ctx.lineTo(edge.vb.x, edge.vb.y)
        }
        ctx.closePath()
        ctx.stroke()
        ctx.fill()
      }      
    }

    const colors = [
      { x: 50, y: 750, color: new Color(66, 242, 245) },
      { x: 750, y: 50, color: new Color(245, 176, 66) },
      { x: 50, y: 50, color: new Color(245, 32, 32) },
      { x: 750, y: 750, color: new Color(35, 252, 35) }
    ]
    const boundingBox = { xl: 0, xr: 800, yt: 0, yb: 800 }
    const animation = new VoronoiAnimation(100, boundingBox, stepFunction, 6, colors)
    animation.start()
  }

  startVoronoi()