// INTERACTIVE TYPE
const interactiveTypeBlack = (p) => {
  let gridSize = 3;
  const points = [];
  let mutationRange = [-40, 40];
  const initialMutationLowerBound = mutationRange[0];
  let touchPointOld = 0;

  p.preload = function() {
    font = 'monospace';
  }

  p.setup = function() {
    var container = document.getElementById('interactive-type');
    p.createCanvas(container.offsetWidth, container.offsetHeight);

    // Define the grid pattern
    const grid = [
        "              ",
        "              ",
        "  2222222     ",
        "  2     2     ",
        "  2     2     ",
        "  2  3456111  ",
        "  2  4  5  1  ",
        "  2  5  4  1  ",
        "  2226543  1  ",
        "     1     1  ",
        "     1     1  ",
        "     1111111  ",
        "              ",
        "              ",
        "              ",
    ];

    const d = Math.min(p.height, p.width);
    if (d < 400) return;
    const isFilled = (x, y) => (Math.ceil(grid[Math.floor(y / d * 14)][Math.floor(x / d * 14)]));
    const isSkipped = (x_or_y) => Math.floor(x_or_y / d * 27) % 2; // interleaving rows and columns
    for (let x = 0; x < d; x += gridSize) {
      if (isSkipped(x)) continue;
      for (let y = 0; y < d; y += gridSize) {
        if (isSkipped(y)) continue;
        n = isFilled(x, y);
        if (!n) continue;
        let ds = [-gridSize*2, -gridSize, 0, gridSize, gridSize*2];
        let neighborsSkipped = ds.map(dx => ds.map(dy => isSkipped(x + dx) && isSkipped(y + dy))).flat().filter(x=>x).length;
        if (n == 2 && neighborsSkipped >= 1) continue;
        if (n >= 3 && neighborsSkipped >= 3) continue;
        points.push(p.createVector(x, y, n));
      }
    }
  }

  const codeToColor = {
    1: [127, 127, 127],
    2: [127, 127, 127],
    3: [214, 73, 51],
    4: [17, 176, 209],
    5: [10, 124, 89],
    6: [251, 176, 60],
  }
  p.draw = function() {
    p.background(0);

    count = 0;
    for (let i = 0; i < points.length; i++) {
      let x = points[i].x;
      let y = points[i].y;
      x += p.random(mutationRange[0], mutationRange[1]) * p.random(1.5);
      y += p.random(mutationRange[0], mutationRange[1]) * p.random(1.5);
      let color = codeToColor[points[i].z];
      p.stroke(color[0], color[1], color[2]);
      p.fill(color[0], color[1], color[2]);
      p.circle(x, y, gridSize/2);
    }
  }

  p.mouseWheel = function(event) {
    if (location.pathname === '/') { return; }
    const rangeStep = 10;
    if (event.delta > 0 && mutationRange[0] < 0) {
      mutationRange = [mutationRange[0] + rangeStep, mutationRange[1] - rangeStep];
      gridSize += 0.1;
    } 
    if (event.delta < 0 && gridSize > 1 && mutationRange[0] > initialMutationLowerBound) {
      mutationRange = [mutationRange[0] - rangeStep, mutationRange[1] + rangeStep];
      gridSize -= 0.1;
    }
  }

  p.touchMoved = function(event) {
    if (location.pathname === '/') { return; }
    const rangeStep =10;
    if (!("touches" in event)){
      return
    }
    let touchDelta = touchPointOld - event.touches[0].clientY;
    if (touchDelta > 0 && mutationRange[0] < 0) {
      mutationRange = [mutationRange[0] + rangeStep, mutationRange[1] - rangeStep];
      gridSize += 0.001;
    }
    if (touchDelta < 0 && gridSize > 1 && mutationRange[0] > initialMutationLowerBound) {
      mutationRange = [mutationRange[0] - rangeStep, mutationRange[1] + rangeStep];
      gridSize -= 0.001;
    }
    touchPointOld = event.touches[0].clientY;
  }

  p.windowResized = function() {
    p.resizeCanvas(document.getElementById('interactive-type').offsetWidth, document.getElementById('interactive-type').offsetHeight);
  }
}

let interactiveTypeSketch = new p5(interactiveTypeBlack, 'interactive-type');
