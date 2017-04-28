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


For every n in N+ there exists a set {n + 2nk : k in Z}
                                     {n(1+2k) : k in Z}

Consider the tile @ (x, y, z) : z = -x - y.
Let n in N+, k in Z so that x = n(1+2k)
Let m in N+, l in Z so that y = m(1+2l)
Then z = -n(1+2k) - m(1+2l)
       = -nm(1+2k)/m - nm(1+2l)/n
       = -nm((1+2k)m + (1+2l)/n)

*/
const $plane = document.getElementById('plane');
const tileWidth = 173.2;
const tileHeight = 150;
const plane = createPlane(16, 16);
// addCorners(pane)
cht(plane);
displayPlane(plane);
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
            const tile = plane[y][x];
            let angle;
            if (tile.ring === 0 /* x */) {
                angle = 60;
            }
            else if (tile.ring === 1 /* y */) {
                angle = 0;
            }
            else {
                angle = 120;
            }
            let scale = tile.chirality ? 1 : -1;
            use.setAttribute('href', '#tile');
            use.setAttribute('transform', `translate(${dx},${dy}) rotate(${angle}) scale(1,${scale})`);
            $plane.appendChild(use);
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
        // scale = 500
    }
}
function cht(plane) {
    const height = plane.length;
    const width = plane[0].length;
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            plane[y][x] = createTile(x, y);
        }
    }
}
function createTile(x, y) {
    if (x === 0 && y === 0) {
        return { ring: 1 /* y */, chirality: false };
    }
    if (x == 0) {
        return { ring: 0 /* x */, chirality: false };
    }
    if (y == 0) {
        return { ring: 1 /* y */, chirality: false };
    }
    if (x == -y) {
        return { ring: 2 /* xy */, chirality: false };
    }
    const xScale = calcScale(Math.abs(x));
    const yScale = calcScale(Math.abs(y));
    if (xScale > yScale) {
        return { ring: 0 /* x */, chirality: Math.abs(y) % (2 * xScale) > xScale };
    }
    else if (yScale > xScale) {
        return { ring: 1 /* y */, chirality: Math.abs(x) % (2 * yScale) < yScale };
    }
    else {
        const zScale = calcScale(Math.abs(x + y));
        return { ring: 2 /* xy */, chirality: Math.abs(x) % (2 * zScale) < zScale };
    }
}
function calcScale(coord) {
    if (coord % 2 === 1) {
        return 1;
    }
    else {
        return 2 * calcScale(coord / 2);
    }
}
