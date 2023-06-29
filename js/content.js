const GUESSES = 6;
const LETTERS = 5;
const SELECTED = "selected";
const NOT_SELECTED = "not-selected";

const HIDE_TILE_CLASS_NAME = "hideTile";

const KEYBOARD_ROWS = [
	{
		divId: 0,
		startId: 0,
		endId: 9
	},
	{
		divId: 1,
		startId: 0,
		endId: 8
	},
	{
		divId: 4,
		startId: 1,
		endId: 7
	},
]

let buttonStates = {
	"valid": false,
	"buttons": [],
}

function getGameThemeManager() {
	return document.getElementsByTagName("game-app").item(0).shadowRoot.children.item(1);
}

function getKeyboard() {
	return getGameThemeManager().getElementsByTagName("game-keyboard").item(0);
}

function getGameTile(rowId, colId) {
	return getGameThemeManager().getElementsByTagName("div").item(0)
		.getElementsByTagName("div").item(4).getElementsByTagName("game-row").item(rowId).shadowRoot
		.children.item(1).getElementsByTagName("game-tile").item(colId);
}

function getTile(rowId, colId) {
	return getGameTile(rowId, colId).shadowRoot.children.item(1);
}


function addOrRemoveClass(element, className, state) {
	if(state == SELECTED) {
		element.classList.add(className);
	} else {
		element.classList.remove(className);
	}
}

function toggleColumn(state, colId) {
	for(let rowId = 0; rowId < GUESSES; rowId++) {
		addOrRemoveClass(getTile(rowId, colId), HIDE_TILE_CLASS_NAME, state);
	}
}

function toggleKeyboard(state) {
	for(let rowId = 0; rowId < 3; rowId++) {
		toggleKeyboardRow(state, rowId);
	}
}

function toggleKeyboardRow(state, rowId) {
	row = KEYBOARD_ROWS[rowId];
	for(let tileId = row.startId; tileId <= row.endId; tileId++) {
		keyboardEl = getKeyboard().shadowRoot.children.item(1).getElementsByTagName("div").item(row.divId).getElementsByTagName("button").item(tileId); 
		addOrRemoveClass(keyboardEl, HIDE_TILE_CLASS_NAME, state);
	}
}

function clearAll() {
	for(let colId = 0; colId < LETTERS; colId++) {
		toggleColumn(NOT_SELECTED, colId);
	}
	for(let rowId = 0; rowId < KEYBOARD_ROWS.length; rowId++) {
		toggleKeyboard(NOT_SELECTED, rowId);
	}
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
	let state = undefined;
	if(buttonId != -1) {
		state = buttonStates.buttons[buttonId].state;
	}

	if(message.action === "toggleColumn") {
		toggleColumn(state, message.colId);	
  	}
	else if(message.action == "toggleKeyboard") {
		toggleKeyboard(state);
	}
	else if(message.action == "toggleKeyboardRow") {
		toggleKeyboardRow(state, message.rowId);
	}
	else if(message.action == "clearAll") {
		clearAll();
	}
});


function init() {
	blackBgRule = `.${HIDE_TILE_CLASS_NAME} {background: black !important; color: white !important;}`;
	for(let rowId = 0; rowId < GUESSES; rowId++) {
		for(let colId = 0; colId < LETTERS; colId++) {
			getGameTile(rowId, colId).shadowRoot.children.item(0).sheet.insertRule(blackBgRule, 0);
		}
	}
	getKeyboard().shadowRoot.children.item(0).sheet.insertRule(blackBgRule, 0);
}
init();
