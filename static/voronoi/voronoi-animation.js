import { Voronoi } from "./rhill-voronoi.js";
import { NodeGenerator } from "./node-generator.js";
import { Painter } from "./cell-painter.js";
import { ColorScheme } from "./color-scheme.js";
import { NodeMover } from "./node-mover.js";

// class to animate a voronoi diagram
// The base for the animation are nodes with a radius that bounce against eachother and the bounding box.
export class VoronoiAnimation {
  nodeMover;
  stepFunction;
  voronoi;
  stepTimer;
  boundingBox;
  nodes;
  timestep;

  // making this a lambda so the this will be correctly bound in recursion.
  recursiveStep = () => {
    try {
      const start = window.performance.now()

      // compute the diagram
      let diagram = this.voronoi.compute(this.nodes, this.boundingBox)

      // execute the client function
      this.stepFunction(diagram)
      // move the nodes for the next iteration
      this.nodeMover.moveNodes(diagram)
      // recycle the diagram so we can reuse the allocated memory next iteration
      this.voronoi.recycle(diagram);

      const duration = window.performance.now() - start
      if (duration > this.timestep * 5) {
        // if the hardware is way too slow. stop the interval.
        console.log('calculations took too long on device, stopping animation.', duration)
        return
      }
      // recursively call this function
      this.stepTimer = setTimeout(this.recursiveStep, Math.max(0, this.timestep - duration))
    } catch (error) {
      console.log("something broke, stopping the animation", error)
      clearTimeout(this.stepTimer) // probably not set, but to be sure.
    }
  }

  //  nrOfCells: maximum nr of cells to generate
  //    - maximum cells is 1000
  //    - will attempt to the given nr of cells, but due to spacing between cells and randomized locations, 
  //      the maximum might not always be reached.
  //  boundingBox: {xl:, xr:, yt, yb}
  //    - x left, x right, y top, y bottom. 
  //    - the y axis is inverted compared to the euclidian axis. i.e. y axis goes from top to bottom.
  //    - minimum size of the bounding box is 1 * 1
  //  stepFunction: A function that will be called with the diagram 25 times per second.
  //    - this function is to be used for rendering the diagram. 
  //    - the edges of the diagram are sequential, so they could be rendered using html Canvas Path
  //    - this class will try to reach 25 frames/second. 
  //    - but if a single step takes more than 1/25 of a second the rendering will slow down. 
  //    - if a step takes longer than 5/25 of a second, the animation is stopped. (try less nodes, or optimize the rendering algorithm)
  //  speed: the speed of the animation in units per second (same units as bbox)
  //  colors: an array of colors and their position. Colors of cells will be interpolated.
  //    - e.g. [ { x: 50, y: 750, color: new Color(66, 242, 245) }
  constructor(nrOfCells, boundingBox, stepFunction, speed, colors) {
    if (stepFunction == null) {
      throw new Error('stepFunction can\'t be null')
    }
    this.stepFunction = stepFunction
    if (nrOfCells > 1000) {
      throw new Error('Maximum nr of cells is 1000, got: ' + nrOfCells)
    }
    if (nrOfCells < 1) {
      throw new Error('Atleast 1 cell is required, got: ' + nrOfCells)
    }
    const width = boundingBox.xr - boundingBox.xl
    if (width < 1) {
      console.log('bounding box: ', boundingBox)
      throw new Error('Width of the bounding box is invalid, minimum is 1, got: ' + width)
    }
    const height = boundingBox.yb - boundingBox.yt
    if (height < 1) {
      console.log('bounding box: ', boundingBox)
      throw new Error('Height of the bounding box is invalid, minimum is 1, got: ' + width)
    }
    this.boundingBox = boundingBox

    // Nodes are the basis for generating the voronoi diagram and the animation of the diagram
    // they contain a position, color and velocity and direction.

    // generate nodes
    const surfaceArea = width * height
    const areaPerNode = surfaceArea / nrOfCells
    const diameter = Math.sqrt(areaPerNode)
    const nodeRadius = diameter / 4 // using half of the theoretical available radius
    this.timestep = 40 // step 25 times per second
    this.nodes = new NodeGenerator().generate(nrOfCells, boundingBox, nodeRadius)

    // initialize node mover
    this.nodeMover = new NodeMover(nodeRadius, this.timestep, this.boundingBox, speed)

    // give the nodes a color
    new Painter(new ColorScheme(colors)).paint(this.nodes)

    // initialize the Voronoi calculator
    this.voronoi = new Voronoi()
  }

  start() {
    // start the recursive timer
    this.recursiveStep()
  }

  stop() {
    // stop the timer
    clearTimeout(this.stepTimer)
  }
}