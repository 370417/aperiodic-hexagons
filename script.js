/*

Algorithm outline

Assign ring orientations to tiles at every other unvisited row and column.
Row orientation is determined by tile location:
 - intersection (z)
 - row (x)
 - column (y)

Go through every just processed row, column, and z-column, and assign alternating lines to connecting tiles.

Repeat with twice the scale

0, 2,  4,  6,  8    1,  3,  5,  7,  9
0, 4,  8, 12, 16    2,  6,  10, 14, 18
0, 8, 16, 24, 32    4, 12, 20, 28, 36
                    8, 24, 40, ...

*/
const $plane = document.getElementById('plane');
const tileWidth = 173.2;
const tileHeight = 150;
displayPlane(createPlane(16, 16));
function createPlane(width, height) {
    const plane = [];
    for (let y = 0; y < height; y++) {
        plane[y] = [];
        for (let x = 0; x < width; x++) {
            plane[y][x] = [];
        }
    }
    return plane;
}
function displayPlane(plane) {
    const height = plane.length;
    const width = plane[0].length;
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            const dx = x * tileWidth + y * tileWidth / 2;
            const dy = y * tileHeight;
            const use = document.createElementNS('http://www.w3.org/2000/svg', 'use');
            use.setAttribute('href', '#tile');
            use.setAttribute('transform', `translate(${dx},${dy})`);
            $plane.appendChild(use);
        }
    }
}
function resize() {
    const width = window.innerWidth;
    const height = window.innerHeight;
    $plane.setAttribute('width', '' + width);
    $plane.setAttribute('height', '' + height);
    $plane.setAttribute('viewBox', `-${width} -${height} ${2 * width} ${2 * height}`);
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
function addCorners(plane) {
    const height = plane.length;
    const width = plane[0].length;
    const maxScale = Math.max(width, height);
    for (let scale = 1; scale <= maxScale; scale *= 2) {
        for (let y = scale; y < height; y += 2 * scale) {
            for (let x = scale; x < width; x += scale) {
                plane[y][x].ring = 0 /* x */;
            }
        }
        for (let x = scale; x < width; x += 2 * scale) {
            for (let y = scale; y < height; y += scale) {
                let tile = plane[y][x];
                if (tile.ring === 0 /* x */) {
                    tile.ring = 2 /* xy */;
                }
                else {
                    tile.ring = 1 /* y */;
                }
            }
        }
    }
}
