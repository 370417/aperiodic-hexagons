class Graph {
    get(pos) {
        if (this.map.has(pos.x)) {
            return this.map.get(pos.x).get(pos.y);
        }
    }
    set(x, y, tile) {
        if (!this.map.has(x)) {
            this.map.set(x, new Map());
        }
        this.map.get(x).set(y, tile);
    }
}
function hexToRect(hx, hy, hexWidth, hexHeight) {
    const rx = 0;
    const ry = 0;
    return { x: rx, y: ry };
}
const centerTile = {
    chilarity: false,
    rotation: 0,
    x: 0,
    y: 0,
    neighbors: new Map(),
};
//centerTile.neighbors.set(Directions.Left, null)
const graph = new Graph();
const $plane = document.getElementById('plane');
// Each hexagon can be replaced with two horizontally adjacent
// rectangles to convert the hexagonal tiling to a rectangular one
// dimensions of rectangular tiles in pixels
let rectWidth = 86.6;
let rectHeight = 150;
// size of rectangular tiling
let width = 2;
let height = 1;
// each value of plane is a map of rows
let plane = new Map();
plane.set(0, new Map());
// finish initializing plane with the origin tile
function resize() {
    const pxWidth = window.innerWidth;
    const pxHeight = window.innerHeight;
    const viewBox = [-pxWidth, -pxHeight, 2 * pxWidth, 2 * pxHeight].join(' ');
    $plane.setAttribute('width', '' + pxWidth);
    $plane.setAttribute('height', '' + pxHeight);
    $plane.setAttribute('viewBox', viewBox);
    while (width * rectWidth < pxWidth) {
        width += 2;
    }
}
resize();
let resizing = false;
function delayedResize() {
    if (!resizing) {
        resizing = true;
        requestAnimationFrame(() => {
            resize();
            resizing = false;
        });
    }
}
window.addEventListener('resize', delayedResize, false);