// vector in acial coordinates
// this can be either a displacement or a position vector
interface Vector {
    x: Number
    y: Number
}

interface Tile {
    chilarity: Boolean
    rotation: Number
    neighbors: Map<Vector, Tile>
}

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
