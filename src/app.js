const container = document.querySelector(".container");
const setCellsAmount = document.querySelector(".set-cells-amount");
let cellsCount = 16 ** 2;

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

function highlight(event) {
  const { target } = event;
  if (target !== container) target.classList.add("highlighted");
}

function rerenderCells() {
  removeCells();
  renderCells();
}

renderCells();

container.addEventListener("mousedown", (event) => {
  highlight(event);
  container.addEventListener("mousemove", highlight);
});

window.addEventListener("mouseup", () => {
  container.removeEventListener("mousemove", highlight);
});

setCellsAmount.addEventListener("click", () => {
  const newCellsCount = Number(
    prompt("Enter the cells amount per side")
  );

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

window.addEventListener("resize", setCellWidth);
