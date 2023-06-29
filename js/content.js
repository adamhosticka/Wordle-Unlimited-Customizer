const GUESSES = 6;
const LETTERS = 5;
const SELECTED = "selected";
const NOT_SELECTED = "not-selected";

const HIDE_TILE_CLASS_NAME = "hideTile";

let buttonStates = {
	"valid": false,
	"buttons": [],
}

function getGameThemeManager() {
	return document.getElementsByTagName("game-app").item(0).shadowRoot.children.item(1);
}

function getGameTile(rowId, colId) {
	return getGameThemeManager().getElementsByTagName("div").item(0)
	.getElementsByTagName("div").item(4).getElementsByTagName("game-row").item(rowId).shadowRoot
	.children.item(1).getElementsByTagName("game-tile").item(colId)
}

function getTile(rowId, colId) {
	return getGameTile(rowId, colId).shadowRoot.children.item(1);
}


function hideTile(rowId, colId) {
	getTile(rowId, colId).classList.add(HIDE_TILE_CLASS_NAME);
}

function showTile(rowId, colId) {
	getTile(rowId, colId).classList.remove(HIDE_TILE_CLASS_NAME);
}

function toggleColumn(state, colId) {
	for(let rowId = 0; rowId < GUESSES; rowId++) {
		if(state == SELECTED) {
			hideTile(rowId, colId);
		} else {
			showTile(rowId, colId);
		}
	}
}

function toggleKeyboard(state) {
	let hidden = false;
	if(state == SELECTED) {
		hidden = true;
	}
	getGameThemeManager().getElementsByTagName("game-keyboard").item(0).hidden = hidden;
}

chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
	if(message.action == "getButtonStates") {
		sendResponse({valid: buttonStates.valid, buttons: buttonStates.buttons});
		return;
	}

	if(message.buttons) {
		buttonStates.valid = true;
		buttonStates.buttons = message.buttons
	}
	let buttonId = message.buttonId;
	let state = buttonStates.buttons[buttonId].state;

	if(message.action === "toggleColumn") {
		toggleColumn(state, message.colId);	
  	}
	else if(message.action == "toggleKeyboard") {
		toggleKeyboard(state);
	}
});


function init() {
	for(let rowId = 0; rowId < GUESSES; rowId++) {
		for(let colId = 0; colId < LETTERS; colId++) {
			getGameTile(rowId, colId).shadowRoot.children.item(0).sheet.insertRule(
				`.${HIDE_TILE_CLASS_NAME} {background: black !important; color: white !important;}`, 0
			);
		}
	}
}
init();
