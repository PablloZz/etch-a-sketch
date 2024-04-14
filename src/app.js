const SQUARE_POWER = 2;
const INITIAL_CELLS_COUNT = 16 ** SQUARE_POWER;
const WHITE_COLOR = "hsl(0, 0%, 100%)";
const Mode = {
  INITIAL: "initial",
  RAINBOW: "rainbow",
  FADING: "fading",
  SQUARE: "square",
  CIRCLE: "circle",
  ERASE: "erase",
};
const container = document.querySelector(".cells-container");
const cellsAmountButton = document.querySelector(".cells-amount");
const rainbowModeButton = document.querySelector(".rainbow-mode");
const fadingModeButton = document.querySelector(".fading-mode");
const eraseModeButton = document.querySelector(".erase-mode");
const squareModeButton = document.querySelector(".square-mode");
const circleModeButton = document.querySelector(".circle-mode");
const initialModeButton = document.querySelector(".initial-mode");
const clearFieldButton = document.querySelector(".clear-field");
let gameSettings = {
  cellsCount: INITIAL_CELLS_COUNT,
  currentMode: Mode.INITIAL,
  grid: true,
};

renderCells();

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
  cell.style.background = WHITE_COLOR;
  setCellWidth();

  return cell;
}

function renderCells() {
  const cell = createCell();
  for (let i = 0; i < gameSettings.cellsCount; i++) {
    container.append(cell.cloneNode(true));
  }
}

const removeItem = (itemIndex) => container.children[itemIndex].remove();

function removeItems() {
  const itemsCount = container.children.length;
  for (let i = itemsCount - 1; i >= 0; i--) {
    removeItem(i);
  }
}

function getCssVariableValue(variable) {
  return window
    .getComputedStyle(document.documentElement)
    .getPropertyValue(variable);
}

function handleInitialMode(cell) {
  const GRAY_COLOR = "hsl(0, 0%, 80%)";
  cell.style.background = GRAY_COLOR;
}

function handleRainbowMode(cell) {
  const FULL_CIRCLE_DEGREES = 360;
  const hue = Math.ceil(Math.random() * FULL_CIRCLE_DEGREES);
  cell.style.background = `hsl(${hue}, 100%, 50%)`;
}

function handleFadingMode(cell) {
  const Lightness = {
    STEP: 10,
    MIN: 0,
    MAX: 90,
  };
  const cellLightness = Number(getCssVariableValue("--cell-lightness"));
  const updatedCellLightness =
    cellLightness === Lightness.MIN
      ? Lightness.MAX
      : cellLightness - Lightness.STEP;
  document.documentElement.style.setProperty(
    "--cell-lightness",
    updatedCellLightness
  );
  cell.style.background = `hsl(0, 0%, ${updatedCellLightness}%)`;
}

function handleEraseMode(item) {
  if (gameSettings.grid) {
    item.style.background = WHITE_COLOR;
  } else {
    item.remove();
  }
}

function drawShape(event, element) {
  let { clientX: initialX, clientY: initialY } = event;

  function handleMouseMove(event) {
    const { clientX, clientY } = event;
    const differenceX = initialX - clientX;
    const differenceY = initialY - clientY;
    const absoluteDifferenceX = Math.abs(differenceX);
    const absoluteDifferenceY = Math.abs(differenceY);

    element.style.left =
      absoluteDifferenceX === differenceX
        ? `${initialX - differenceX}px`
        : `${initialX}px`;

    element.style.top =
      absoluteDifferenceY === differenceY
        ? `${initialY - differenceY}px`
        : `${initialY}px`;

    element.style.cssText += `width: ${absoluteDifferenceX}px; height: ${absoluteDifferenceY}px`;
  }

  container.addEventListener("mousemove", handleMouseMove);
  window.addEventListener("mouseup", () => {
    container.removeEventListener("mousemove", handleMouseMove);

    element.addEventListener("mouseenter", () => {
      if (gameSettings.currentMode === Mode.ERASE) {
        handleEraseMode(element);
      }
    });
  });
  container.append(element);
}

function handleSquareMode(event) {
  const square = document.createElement("div");
  square.classList.add("square");
  drawShape(event, square);
}

function handleCircleMode(event) {
  const circle = document.createElement("div");
  circle.classList.add("circle");
  drawShape(event, circle);
}

function highlight(event) {
  const { target } = event;

  if (target !== container) {
    switch (gameSettings.currentMode) {
      case Mode.INITIAL:
        return handleInitialMode(target);
      case Mode.RAINBOW:
        return handleRainbowMode(target);
      case Mode.FADING:
        return handleFadingMode(target);
      case Mode.ERASE:
        return handleEraseMode(target);
      case Mode.SQUARE:
        return handleSquareMode(event);
      case Mode.CIRCLE:
        return handleCircleMode(event);
    }
  }

  if (!gameSettings.grid) {
    switch (gameSettings.currentMode) {
      case Mode.SQUARE:
        return handleSquareMode(event);
      case Mode.CIRCLE:
        return handleCircleMode(event);
    }
  }
}

function rerenderCells() {
  removeItems();
  renderCells();
}

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

  if (!gameSettings.grid) {
    gameSettings.currentMode = Mode.INITIAL;
    gameSettings.grid = true;
    container.style.cssText += `border-right: none; border-bottom: none`;
  }

  gameSettings.cellsCount = newCellsCount ** SQUARE_POWER;
  rerenderCells();
}

function startDrawing(event) {
  highlight(event);
  if (gameSettings.grid) {
    const children = Array.from(container.children);
    children.forEach((cell) => cell.addEventListener("mouseenter", highlight));
  }
}

function stopDrawing() {
  const children = Array.from(container.children);
  children.forEach((cell) => cell.removeEventListener("mouseenter", highlight));
}

function setShapeMode(mode) {
  gameSettings = {
    ...gameSettings,
    currentMode: mode,
    grid: false,
  };
  const border = window.getComputedStyle(container).borderTop;
  container.style.cssText += `border-right: ${border}; border-bottom: ${border}`;
  removeItems();
}

function clearField() {
  if (gameSettings.grid) {
    rerenderCells();
  } else {
    removeItems();
  }
}

function handleFieldGrid() {
  if (!gameSettings.grid) {
    rerenderCells();
    gameSettings.grid = true;
    container.style.cssText += `border-right: none; border-bottom: none`;
  }
}

const setRainbowMode = () => (gameSettings.currentMode = Mode.RAINBOW);
const setFadingMode = () => (gameSettings.currentMode = Mode.FADING);
const setEraseMode = () => (gameSettings.currentMode = Mode.ERASE);
const setInitialMode = () => (gameSettings.currentMode = Mode.INITIAL);

container.addEventListener("mousedown", startDrawing);
window.addEventListener("mouseup", stopDrawing);
window.addEventListener("resize", setCellWidth);
cellsAmountButton.addEventListener("click", setCellsAmount);
rainbowModeButton.addEventListener("click", setRainbowMode);
fadingModeButton.addEventListener("click", setFadingMode);
squareModeButton.addEventListener("click", () => setShapeMode(Mode.SQUARE));
circleModeButton.addEventListener("click", () => setShapeMode(Mode.CIRCLE));
eraseModeButton.addEventListener("click", setEraseMode);
initialModeButton.addEventListener("click", setInitialMode);
clearFieldButton.addEventListener("click", clearField);
[rainbowModeButton, fadingModeButton, initialModeButton].forEach((button) => {
  button.addEventListener("click", handleFieldGrid);
});
