const INITIAL_CELLS_COUNT = 16 ** 2;
const Mode = {
  INITIAL: "initial",
  RAINBOW: "rainbow",
  FADING: "fading",
  ERASE: "erase",
};
const container = document.querySelector(".cells-container");
const cellsAmountButton = document.querySelector(".cells-amount");
const rainbowModeButton = document.querySelector(".rainbow-mode");
const fadingModeButton = document.querySelector(".fading-mode");
const eraseModeButton = document.querySelector(".erase-mode");
const resetModeButton = document.querySelector(".reset-mode");
const clearFieldButton = document.querySelector(".clear-field");
let cellsCount = INITIAL_CELLS_COUNT;
let currentMode = Mode.INITIAL;

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

function getCssVariableValue(variable) {
  return window
    .getComputedStyle(document.documentElement)
    .getPropertyValue(variable);
}

function handleRainbowMode(cell) {
  const colorStep = 15;
  const currentHue = Number(getCssVariableValue("--cell-hue"));
  const updatedHue = currentHue + colorStep;
  document.documentElement.style.setProperty("--cell-hue", updatedHue);
  cell.style.background = `hsl(${updatedHue}, 100%, 50%)`;
}

function handleFadingMode(cell) {
  const cellLightness = Number(getCssVariableValue("--cell-lightness"));
  const updatedCellLightness = cellLightness === 0 ? 90 : cellLightness - 10;
  document.documentElement.style.setProperty(
    "--cell-lightness",
    updatedCellLightness
  );
  cell.style.background = `hsl(0, 0%, ${updatedCellLightness}%)`;
}

function highlight(event) {
  const { target } = event;

  if (target !== container) {
    switch (currentMode) {
      case Mode.INITIAL:
        return (target.style.background = "hsl(0, 0%, 80%)");
      case Mode.RAINBOW:
        return handleRainbowMode(target);
      case Mode.FADING:
        return handleFadingMode(target);
      case Mode.ERASE:
        return (target.style.background = "hsl(0, 0%, 100%)");
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

cellsAmountButton.addEventListener("click", () => {
  const MAX_CELLS = 100;
  const MIN_CELLS = 8;
  const newCellsCount = Number(prompt("Enter the cells amount per side"));

  if (!newCellsCount) return alert("Please enter a valid number");

  if (newCellsCount > MAX_CELLS) {
    return alert("The maximum allowed number of cells is 100");
  }

  if (newCellsCount < MIN_CELLS) {
    return alert("The minimum allowed number of cells is 8");
  }

  cellsCount = newCellsCount ** 2;
  rerenderCells();
});

rainbowModeButton.addEventListener("click", () => (currentMode = Mode.RAINBOW));
fadingModeButton.addEventListener("click", () => (currentMode = Mode.FADING));
eraseModeButton.addEventListener("click", () => (currentMode = Mode.ERASE));
resetModeButton.addEventListener("click", () => (currentMode = Mode.INITIAL));
clearFieldButton.addEventListener("click", rerenderCells);
window.addEventListener("resize", setCellWidth);
