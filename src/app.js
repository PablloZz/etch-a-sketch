const container = document.querySelector(".container");
let cellsCount = 16 ** 2;
for (let i = 0; i < cellsCount; i++) {
    createCell();
}

container.addEventListener("mousedown", event => {
    event.target.classList.add("hover");
    container.addEventListener("mousemove", addHovering);
});

window.addEventListener("mouseup", event => {
    container.removeEventListener("mousemove", addHovering);
});

function addHovering(event) {
    if (event.target === container) {
        return;
    }
    event.target.classList.add("hover");
}

function createCell() {
    const cell = document.createElement("div");
    cell.classList.add("cell");
    const containerWidth = Number.parseInt(
        window.getComputedStyle(container).width);
    cell.style.width = containerWidth / Math.sqrt(cellsCount) + "px";
    container.appendChild(cell);
}