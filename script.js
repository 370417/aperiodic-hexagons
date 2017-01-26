const $plane = document.getElementById('plane');

function resize() {
    const width = window.innerWidth;
    const height = window.innerHeight;

    const viewBox = [-width, -height, 2 * width, 2 * height].join(' ');

    $plane.setAttribute('width', width);
    $plane.setAttribute('height', height);
    $plane.setAttribute('viewBox', viewBox);
}

resize();

let resizing = false;
function delayedResize() {
    if (!resizing) {
        animationFrameId = requestAnimationFrame(() => {
            resize();
            resizing = false;
        });
    }
}

window.addEventListener('resize', delayedResize, false);
