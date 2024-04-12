const container = document.querySelector(".cells-container");
const setCellsAmount = document.querySelector(".set-cells-amount");
const setRainbowMode = document.querySelector(".set-rainbow-mode");
const resetMode = document.querySelector(".reset-mode");
let cellsCount = 16 ** 2;
let currentMode = "initial";

function setCellWidth() {
  const containerWidth = Number.parseInt(
    window.getComputedStyle(container).width
  );
  const cellWidth = containerWidth / Math.sqrt(cellsCount) + "px";
  document.documentElement.style.setProperty("--cell-width", cellWidth);
}

function createCell() {
  const cell = document.createElement("div");
  cell.classList.add("cell");
  cell.style.background = "hsl(0, 0%, 100%)";
  setCellWidth();

  return cell;
}

function renderCells() {
  const cell = createCell();
  for (let i = 0; i < cellsCount; i++) {
    container.append(cell.cloneNode(true));
  }
}

const removeCell = (cellIndex) => container.children[cellIndex].remove();

function removeCells() {
  const cellsCount = container.children.length;
  for (let i = cellsCount - 1; i >= 0; i--) {
    removeCell(i);
  }
}

function handleRainbowMode(cell) {
  const colorStep = 15;
  const currentHue = Number(
    window
      .getComputedStyle(document.documentElement)
      .getPropertyValue("--cell-hue")
  );
  const updatedHue = currentHue + colorStep;
  document.documentElement.style.setProperty("--cell-hue", updatedHue);
  cell.style.background = `hsl(${updatedHue}, 100%, 50%)`;
}

function highlight(event) {
  const { target } = event;

  if (target !== container) {
    if (currentMode === "initial") {
      target.style.background = "hsl(0, 0%, 80%)";
    }

    if (currentMode === "rainbow") {
      handleRainbowMode(target);
    }
  }
}

function rerenderCells() {
  removeCells();
  renderCells();
}

renderCells();

container.addEventListener("mousedown", (event) => {
  highlight(event);
  const children = Array.from(container.children);
  children.forEach((cell) => cell.addEventListener("mouseenter", highlight));
});

window.addEventListener("mouseup", () => {
  const children = Array.from(container.children);
  children.forEach((cell) => cell.removeEventListener("mouseenter", highlight));
});

setCellsAmount.addEventListener("click", () => {
  const newCellsCount = Number(prompt("Enter the cells amount per side"));

  if (!newCellsCount) return alert("Please enter a valid number");

  if (newCellsCount > 100) {
    return alert("The maximum allowed number of cells is 100");
  }

  if (newCellsCount < 8) {
    return alert("The minimum allowed number of cells is 8");
  }

  cellsCount = newCellsCount ** 2;
  rerenderCells();
});

setRainbowMode.addEventListener("click", () => (currentMode = "rainbow"));
resetMode.addEventListener("click", () => (currentMode = "initial"));
window.addEventListener("resize", setCellWidth);
