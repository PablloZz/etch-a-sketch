const INITIAL_CELLS_COUNT = 16 ** 2;
const Mode = {
  INITIAL: "initial",
  RAINBOW: "rainbow",
  FADING: "fading",
  SQUARE: "square",
  ERASE: "erase",
};
const container = document.querySelector(".cells-container");
const cellsAmountButton = document.querySelector(".cells-amount");
const rainbowModeButton = document.querySelector(".rainbow-mode");
const fadingModeButton = document.querySelector(".fading-mode");
const eraseModeButton = document.querySelector(".erase-mode");
const squareModeButton = document.querySelector(".square-mode");
const resetModeButton = document.querySelector(".reset-mode");
const clearFieldButton = document.querySelector(".clear-field");
let gameSettings = {
  cellsCount: INITIAL_CELLS_COUNT,
  currentMode: Mode.INITIAL,
  grid: true,
};

function setCellWidth() {
  const containerWidth = Number.parseInt(
    window.getComputedStyle(container).width
  );
  const cellWidth = containerWidth / Math.sqrt(gameSettings.cellsCount) + "px";
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
  for (let i = 0; i < gameSettings.cellsCount; i++) {
    container.append(cell.cloneNode(true));
  }
}

const removeItem = (cellIndex) => container.children[cellIndex].remove();

function removeItems() {
  const cellsCount = container.children.length;
  for (let i = cellsCount - 1; i >= 0; i--) {
    removeItem(i);
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

function handleEraseMode(item) {
  if (gameSettings.grid) {
    item.style.background = "hsl(0, 0%, 100%)";
  } else {
    item.remove();
  }
}

function highlight(event) {
  const { target } = event;

  if (target !== container) {
    switch (gameSettings.currentMode) {
      case Mode.INITIAL:
        return (target.style.background = "hsl(0, 0%, 80%)");
      case Mode.RAINBOW:
        return handleRainbowMode(target);
      case Mode.FADING:
        return handleFadingMode(target);
      case Mode.ERASE:
        return handleEraseMode(target);
    }
  }
}

function rerenderCells() {
  removeItems();
  renderCells();
}

renderCells();

function handleSquareMode(event) {
  let { clientX: initialX, clientY: initialY } = event;
  const square = document.createElement("div");
  square.classList.add("square");
  container.addEventListener("mousemove", handleMouseMove);
  window.addEventListener("mouseup", () =>
    container.removeEventListener("mousemove", handleMouseMove)
  );
  container.append(square);

  function handleMouseMove(event) {
    const { clientX, clientY } = event;
    const differenceX = initialX - clientX;
    const differenceY = initialY - clientY;
    const absoluteDifferenceX = Math.abs(differenceX);
    const absoluteDifferenceY = Math.abs(differenceY);

    if (absoluteDifferenceX !== differenceX) {
      square.style.left = `${initialX}px`;
    }

    if (absoluteDifferenceY !== differenceY) {
      square.style.top = `${initialY}px`;
    }

    if (absoluteDifferenceX === differenceX) {
      square.style.left = `${initialX - differenceX}px`;
    }

    if (absoluteDifferenceY === differenceY) {
      square.style.top = `${initialY - differenceY}px`;
    }

    square.style.cssText += `width: ${absoluteDifferenceX}px; height: ${absoluteDifferenceY}px`;
  }
}

function initGame(event) {
  if (gameSettings.currentMode === Mode.SQUARE) {
    handleSquareMode(event);
  } else {
    highlight(event);
    const children = Array.from(container.children);
    children.forEach((cell) => cell.addEventListener("mouseenter", highlight));
  }
}

container.addEventListener("mousedown", initGame);

function setCellsAmount() {
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

  gameSettings.cellsCount = newCellsCount ** 2;
  rerenderCells();
}

function setSquareMode() {
  gameSettings = {
    ...gameSettings,
    currentMode: Mode.SQUARE,
    grid: false,
  };
  const border = window.getComputedStyle(container).borderTop;
  container.style.cssText += `border-right: ${border}; border-bottom: ${border}`;
  removeItems();
}

window.addEventListener("mouseup", () => {
  const children = Array.from(container.children);
  children.forEach((cell) => cell.removeEventListener("mouseenter", highlight));
});
cellsAmountButton.addEventListener("click", setCellsAmount);
rainbowModeButton.addEventListener(
  "click",
  () => (gameSettings.currentMode = Mode.RAINBOW)
);
fadingModeButton.addEventListener(
  "click",
  () => (gameSettings.currentMode = Mode.FADING)
);
squareModeButton.addEventListener("click", setSquareMode);
eraseModeButton.addEventListener(
  "click",
  () => (gameSettings.currentMode = Mode.ERASE)
);
resetModeButton.addEventListener(
  "click",
  () => (gameSettings.currentMode = Mode.INITIAL)
);
clearFieldButton.addEventListener("click", () => {
  if (gameSettings.grid) {
    rerenderCells();
  } else {
    removeItems();
  }
});
[rainbowModeButton, fadingModeButton, resetModeButton].forEach((button) => {
  button.addEventListener("click", () => {
    if (!gameSettings.grid) {
      rerenderCells();
      gameSettings.grid = true;
      container.style.cssText += `border-right: none; border-bottom: none`;
    }
  });
});
window.addEventListener("resize", setCellWidth);
