const COLUMNS = 5;
const SELECTED = "selected";
const NOT_SELECTED = "not-selected";

function sendMessageToContentScript(message) {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    chrome.tabs.sendMessage(tabs[0].id, message);
  });
}


function initHideColumnsContainer() {
  let hideColumnsContainer = document.getElementById("hide-columns-buttons-container");
  for(let colId = 0; colId < COLUMNS; colId++) {
    let button = document.createElement("button");
    button.innerHTML = colId + 1;
    button.classList.add("me-2", "not-selected");
    button.value = "not-selected";
    hideColumnsContainer.appendChild(button);
    button.addEventListener("click", function (e) {
      if(e.target.value == NOT_SELECTED) {
        e.target.value = SELECTED;
        e.target.classList.remove(NOT_SELECTED);
        e.target.classList.add(SELECTED);
        sendMessageToContentScript({ action: "hideColumn", colId: colId });
      } else if(e.target.value == SELECTED) {
        e.target.value = NOT_SELECTED;
        e.target.classList.remove(SELECTED);
        e.target.classList.add(NOT_SELECTED);
        sendMessageToContentScript({ action: "showColumn", colId: colId });
      }
    });
  }
}

function initHideKeyboardButton() {
  let hideKeyboardButton = document.getElementById("hideKeyboard");
  hideKeyboardButton.addEventListener("click", function (e) {
    if(e.target.value == NOT_SELECTED) {
      e.target.value = SELECTED;
      e.target.innerHTML = "Show keyboard";
      e.target.classList.remove(NOT_SELECTED);
      e.target.classList.add(SELECTED);
      sendMessageToContentScript({ action: "toggleKeyboard", hidden: true });
    } else if(e.target.value == SELECTED) {
      e.target.value = NOT_SELECTED;
      e.target.innerHTML = "Hide keyboard";
      e.target.classList.remove(SELECTED);
      e.target.classList.add(NOT_SELECTED);
      sendMessageToContentScript({ action: "toggleKeyboard", hidden: false });
    }
  });
}

function init() {
  initHideColumnsContainer();
  initHideKeyboardButton();
}
init();

