const container = document.querySelector(".container");
let cellsCount = 16 ** 2;
for (let i = 0; i < cellsCount; i++) {
    const cell = document.createElement("div");
    cell.classList.add("cell");
    const containerWidth = Number.parseInt(
        window.getComputedStyle(container).width);
    cell.style.width = containerWidth / Math.sqrt(cellsCount) + "px";
    container.appendChild(cell);
}