const canvas = document.getElementById("canvas");
const addTextButton = document.getElementById("addTextBtn");
const undoButton = document.getElementById("undoBtn");
const redoButton = document.getElementById("redoBtn");
const fontSelect = document.getElementById("fontSelect");
const decreaseFontSize = document.getElementById("decreaseFontSize");
const increaseFontSize = document.getElementById("increaseFontSize");
const boldBtn = document.getElementById("boldBtn");
const italicBtn = document.getElementById("italicBtn");
const underlineBtn = document.getElementById("underlineBtn");
const fontAlignBtn = document.getElementById("fontAlignBtn");
const alignOptions = document.getElementById("alignOptions");
const alignLeftBtn = document.getElementById("alignLeftBtn");
const alignCenterBtn = document.getElementById("alignCenterBtn");
const alignRightBtn = document.getElementById("alignRightBtn");

// Action stacks for undo/redo
let actionStack = [];
let redoStack = [];

// Current selected text element
let currentTextElement = null;

// Function to toggle visibility of alignment options
fontAlignBtn.addEventListener("click", (e) => {
  e.stopPropagation();
  alignOptions.style.display = alignOptions.style.display === "block" ? "none" : "block";
});

// Click outside the alignment options to close it
document.addEventListener("click", () => {
  alignOptions.style.display = "none";
});

// If user clicks inside the alignment options, it shouldn't close
alignOptions.addEventListener("click", (e) => {
  e.stopPropagation();
});

// Align text left
alignLeftBtn.addEventListener("click", () => {
  if (currentTextElement) {
    currentTextElement.style.textAlign = "left";
    fontAlignBtn.innerHTML = "&#x21A4;";
  }
  alignOptions.style.display = "none";
});

// Align text center
alignCenterBtn.addEventListener("click", () => {
  if (currentTextElement) {
    currentTextElement.style.textAlign = "center";
    fontAlignBtn.innerHTML = "&#x2194;";
  }
  alignOptions.style.display = "none";
});

// Align text right
alignRightBtn.addEventListener("click", () => {
  if (currentTextElement) {
    currentTextElement.style.textAlign = "right";
    fontAlignBtn.innerHTML = "&#x21A6;";
  }
  alignOptions.style.display = "none";
});

// Helper function to save actions for undo/redo
function saveAction(action) {
  actionStack.push(action);
  redoStack = []; // Clear redo stack on new action
}

// Helper function to update the font size display
function updateFontSizeDisplay() {
    if (currentTextElement) {
      const currentSize = parseInt(window.getComputedStyle(currentTextElement).fontSize);
      document.getElementById("fontSizeDisplay").textContent = currentSize;
    } else {
      document.getElementById("fontSizeDisplay").textContent = 10;
    }
  }
    
// Function to create and add text to the canvas
addTextButton.addEventListener("click", () => {
    const textElement = document.createElement("div");
    textElement.textContent = "Ujjwal";
    textElement.style.position = "absolute";
    textElement.style.left = "50px";
    textElement.style.top = "50px";
    textElement.style.fontSize = "10px"; // Set font size to 10px
    textElement.style.fontFamily = "Arial, sans-serif";
    textElement.style.cursor = "move";
    textElement.style.color = "black";
  
    canvas.appendChild(textElement);
    saveAction({ type: "add", element: textElement });
  
    makeDraggable(textElement);
  
    currentTextElement = textElement;
  
    updateFontSizeDisplay();
  });

function makeDraggable(element) {
  element.addEventListener("mousedown", (event) => {
    const offsetX = event.clientX - element.offsetLeft;
    const offsetY = event.clientY - element.offsetTop;

    function onMouseMove(e) {
      element.style.left = `${e.clientX - offsetX}px`;
      element.style.top = `${e.clientY - offsetY}px`;
    }

    document.addEventListener("mousemove", onMouseMove);

    document.addEventListener(
      "mouseup",
      () => {
        document.removeEventListener("mousemove", onMouseMove);
        saveAction({ type: "move", element: element });
      },
      { once: true }
    );
  });

  element.addEventListener("click", () => {
    currentTextElement = element;

    updateFontSizeDisplay();
  });
}

// Undo functionality
undoButton.addEventListener("click", () => {
    if (actionStack.length > 0) {
      const lastAction = actionStack.pop();
  
      switch (lastAction.type) {
        case "add":
          canvas.removeChild(lastAction.element);
          break;
        case "move":
        case "style":
          lastAction.element.style = lastAction.prevStyle;
          break;
      }
  
      redoStack.push(lastAction);
  
      if (!currentTextElement) {
        document.getElementById("fontSizeDisplay").textContent = 10;
      }
  
      updateFontSizeDisplay();
    }
  });
  
// Redo functionality
redoButton.addEventListener("click", () => {
  if (redoStack.length > 0) {
    const lastRedo = redoStack.pop();

    switch (lastRedo.type) {
      case "add":
        canvas.appendChild(lastRedo.element);
        break;
      case "move":
      case "style":
        lastRedo.element.style = lastRedo.newStyle;
        break;
    }

    actionStack.push(lastRedo);

    updateFontSizeDisplay();
  }
});

// Change font family
fontSelect.addEventListener("change", () => {
  if (currentTextElement) {
    const prevStyle = currentTextElement.style.cssText;
    currentTextElement.style.fontFamily = fontSelect.value;
    saveAction({
      type: "style",
      element: currentTextElement,
      prevStyle,
      newStyle: currentTextElement.style.cssText,
    });
  }
});

// Increase font size
increaseFontSize.addEventListener("click", () => {
  if (currentTextElement) {
    const prevStyle = currentTextElement.style.cssText;
    let currentSize = parseInt(window.getComputedStyle(currentTextElement).fontSize);
    let newSize = currentSize + 2;
    currentTextElement.style.fontSize = `${newSize}px`;

    updateFontSizeDisplay();

    saveAction({
      type: "style",
      element: currentTextElement,
      prevStyle,
      newStyle: currentTextElement.style.cssText,
    });
  }
});

// Decrease font size
decreaseFontSize.addEventListener("click", () => {
  if (currentTextElement) {
    const prevStyle = currentTextElement.style.cssText;
    let currentSize = parseInt(window.getComputedStyle(currentTextElement).fontSize);
    let newSize = currentSize - 2;
    currentTextElement.style.fontSize = `${newSize}px`;

    updateFontSizeDisplay();

    saveAction({
      type: "style",
      element: currentTextElement,
      prevStyle,
      newStyle: currentTextElement.style.cssText,
    });
  }
});

// Bold text toggle
boldBtn.addEventListener("click", () => {
  if (currentTextElement) {
    const prevStyle = currentTextElement.style.cssText;
    currentTextElement.style.fontWeight =
      currentTextElement.style.fontWeight === "bold" ? "normal" : "bold";
    saveAction({
      type: "style",
      element: currentTextElement,
      prevStyle,
      newStyle: currentTextElement.style.cssText,
    });
  }
});

// Italic text toggle
italicBtn.addEventListener("click", () => {
  if (currentTextElement) {
    const prevStyle = currentTextElement.style.cssText;
    currentTextElement.style.fontStyle =
      currentTextElement.style.fontStyle === "italic" ? "normal" : "italic";
    saveAction({
      type: "style",
      element: currentTextElement,
      prevStyle,
      newStyle: currentTextElement.style.cssText,
    });
  }
});

// Underline text toggle
underlineBtn.addEventListener("click", () => {
  if (currentTextElement) {
    const prevStyle = currentTextElement.style.cssText;
    currentTextElement.style.textDecoration =
      currentTextElement.style.textDecoration === "underline"
        ? "none"
        : "underline";
    saveAction({
      type: "style",
      element: currentTextElement,
      prevStyle,
      newStyle: currentTextElement.style.cssText,
    });
  }
});

// Align text left
alignLeftBtn.addEventListener("click", () => {
    if (currentTextElement) {
        currentTextElement.style.textAlign = "left";
        fontAlignBtn.innerHTML = '<i class="fas fa-align-left"></i>';
    }
    alignOptions.style.display = "none";
});

// Align text center
alignCenterBtn.addEventListener("click", () => {
    if (currentTextElement) {
        currentTextElement.style.textAlign = "center";
        fontAlignBtn.innerHTML = '<i class="fas fa-align-center"></i>';
    }
    alignOptions.style.display = "none";
});

// Align text right
alignRightBtn.addEventListener("click", () => {
    if (currentTextElement) {
        currentTextElement.style.textAlign = "right";
        fontAlignBtn.innerHTML = '<i class="fas fa-align-right"></i>';
    }
    alignOptions.style.display = "none";
});
  