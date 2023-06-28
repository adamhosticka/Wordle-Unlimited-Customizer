const COLUMNS = 5;


function sendMessageToContentScript(message) {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    chrome.tabs.sendMessage(tabs[0].id, message);
  });
}



function init() {
  buttonsContainer = document.getElementById("hide-columns-buttons-container");
  for(let colId = 0; colId < COLUMNS; colId++) {
    let button = document.createElement("button");
    button.innerHTML = colId + 1;
    button.classList.add("me-2", "not-selected");
    button.value = "not-selected";
    buttonsContainer.appendChild(button);
    button.addEventListener("click", function (e) {
      if(e.target.value == "not-selected") {
        e.target.value = "selected";
        e.target.classList.remove("not-selected");
        e.target.classList.add("selected");
        sendMessageToContentScript({ action: "hideColumn", colId: colId });
      } else {
        e.target.value = "not-selected";
        e.target.classList.remove("selected");
        e.target.classList.add("not-selected");
        sendMessageToContentScript({ action: "showColumn", colId: colId });
      }
    });
  }
}
init();

