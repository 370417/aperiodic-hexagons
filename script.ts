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

1 + 2n
2 + 4n
...


For every n in N+ there exists a set {n + 2nx : x in Z}
                                     {n(1+2x) : x in Z}

*/

const $plane = document.getElementById('plane')
const tileWidth = 173.2
const tileHeight = 150

const enum Ring {
    x,
    y,
    xy,
}

interface Tile {
    ring: Ring,
}

type Plane = Tile[][];

const pane = createPlane(16, 16)
addCorners(pane)
displayPlane(pane)

function createPlane(width: number, height: number): Plane {
    const plane = []
    for (let y = 0; y < height; y++) {
        plane[y] = []
        for (let x = 0; x < width; x++) {
            plane[y][x] = []
        }
    }
    return plane
}

function displayPlane(plane: Plane) {
    const height = plane.length;
    const width = plane[0].length;
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            const dx = x * tileWidth + y * tileWidth / 2
            const dy = y * tileHeight
            const use = document.createElementNS('http://www.w3.org/2000/svg', 'use')

            const tile = plane[y][x]
            let angle
            if (tile.ring === Ring.x) {
                angle = 60
            } else if (tile.ring === Ring.y) {
                angle = 0
            } else {
                angle = 120
            }

            use.setAttribute('href', '#tile')
            use.setAttribute('transform', `translate(${dx},${dy}) rotate(${angle})`)
            if (tile.ring !== undefined) $plane.appendChild(use)
        }
    }
}

function resize() {
    const width = window.innerWidth;
    const height = window.innerHeight;

    $plane.setAttribute('width', '' + width);
    $plane.setAttribute('height', '' + height);
    $plane.setAttribute('viewBox', `0 0 ${4 * width} ${4 * height}`);
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

function addCorners(plane: Plane) {
    const height = plane.length;
    const width = plane[0].length;
    const maxScale = Math.max(width, height)
    for (let scale = 1; scale <= maxScale; scale *= 2) {
        for (let y = scale; y < height; y += 2 * scale) {
            for (let x = scale; x < width; x += scale) {
                plane[y][x].ring = Ring.x
            }
        }
        for (let x = scale; x < width; x += 2 * scale) {
            for (let y = scale; y < height; y += scale) {
                let tile = plane[y][x]
                if (tile.ring === Ring.x) {
                    tile.ring = Ring.xy
                } else {
                    tile.ring = Ring.y
                }
            }
        }
        // scale = 500
    }
}
