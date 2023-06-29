const COLUMNS = 5;
const SELECTED = "selected";
const NOT_SELECTED = "not-selected";


let buttons = [];

class Button {
  constructor(parent, message, additionalClasses, innerHTMLNotSelected, innerHTMLSelected, state = NOT_SELECTED) {
    this.id = buttons.length;
    this.element = document.createElement("button");
    this.parent = parent;
    this.message = message;
    this.additionalClasses = additionalClasses;
    this.innerHTMLNotSelected = innerHTMLNotSelected;
    this.innerHTMLSelected = innerHTMLSelected;
    this.state = state;
  }
}


function getButtonStates() {
  return new Promise((resolve, reject) => {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      chrome.tabs.sendMessage(tabs[0].id, {action: "getButtonStates"}, function (response) {
        resolve(response);
      });
    });
  });
}


function sendMessageToContentScript(message, buttonId) {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    message.buttons = buttons.map(({state}) => ({state}));
    message.buttonId = buttonId;
    chrome.tabs.sendMessage(tabs[0].id, message);
  });
}


function initHideColumnsContainer() {
  let hideColumnsContainer = document.getElementById("hide-columns-buttons-container");
  for(let colId = 0; colId < COLUMNS; colId++) {
    let button = new Button(hideColumnsContainer, {action: "toggleColumn", colId: colId}, ["me-2"], colId + 1, colId + 1);
    buttons.push(button);
  }
}

function initHideKeyboardButton() {
  let keyboardControlsContainer = document.getElementById("keyboard-controls-container");
  let hideKeyboardButton = new Button(keyboardControlsContainer, {action: "toggleKeyboard"}, [], "Hide keyboard", "Show keyboard");
  buttons.push(hideKeyboardButton); 
}



function switchButtonState(button, currentState) {
  if(currentState == NOT_SELECTED) {
    button.state = SELECTED;
  } else {
    button.state = NOT_SELECTED;
  }
}

function changeButtonAttributes(button) {
  if(button.state == SELECTED) {
    button.element.innerHTML = button.innerHTMLSelected;
    button.element.classList.add(SELECTED);
    button.element.classList.remove(NOT_SELECTED);
  } else if(button.state == NOT_SELECTED) {
    button.element.innerHTML = button.innerHTMLNotSelected;
    button.element.classList.add(NOT_SELECTED);
    button.element.classList.remove(SELECTED);
  }
  button.element.value = button.state;
}

function createButtonsAndSetListeners() {
  for(let button of buttons) {
    changeButtonAttributes(button);

    for(const className of button.additionalClasses) {
      button.element.classList.add(className);
    }
    button.parent.appendChild(button.element);
  
    button.element.addEventListener("click", function(e) {
      switchButtonState(button, e.target.value);
      changeButtonAttributes(button);
      sendMessageToContentScript(button.message, button.id);
    });
  }
}

async function init() {
  initHideColumnsContainer();
  initHideKeyboardButton();
  
  const buttonStates = await getButtonStates();
  if(buttonStates.valid) {
    for(let buttonId = 0; buttonId < buttonStates.buttons.length; buttonId++) {
      buttons[buttonId].state = buttonStates.buttons[buttonId].state;
      changeButtonAttributes(buttons[buttonId]);
    }
  }
  
  createButtonsAndSetListeners();
}
init();
