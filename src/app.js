const container = document.querySelector(".container");
const setCellsAmount = document.querySelector("#set-cells-amount");
let cellsCount = 16 ** 2;
createGameField();

container.addEventListener("mousedown", event => {
    event.target.classList.add("hover");
    container.addEventListener("mousemove", addHovering);
});

window.addEventListener("mouseup", event => {
    container.removeEventListener("mousemove", addHovering);
});

setCellsAmount.addEventListener("click", event => {
    let userInput = +prompt("Input the cells amount no more than 100:", 0);

    if (userInput > 100) {
        alert("It's too much, input another number");
        return;
    } else if (userInput < 8) {
        alert("It's too little, input another number");
        return;
    }

    cellsCount = userInput ** 2;
    createGameField();
});

window.addEventListener("resize", event => {
    createGameField();
});

function addHovering(event) {
    if (event.target === container) {
        return;
    }
    event.target.classList.add("hover");
}

function createGameField() {
    removeCells();

    for (let i = 0; i < cellsCount; i++) {
        createCell();
    }
}

function removeCells() {
    for (let i = container.children.length - 1; i >= 0; i--) {
        container.children[i].parentElement.removeChild(container.children[i]);
    }
}

function createCell() {
    const cell = document.createElement("div");
    cell.classList.add("cell");
    const containerWidth = Number.parseInt(
        window.getComputedStyle(container).width);
    cell.style.width = containerWidth / Math.sqrt(cellsCount) + "px";
    container.appendChild(cell);
}