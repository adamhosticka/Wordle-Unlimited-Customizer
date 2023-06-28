const GUESSES = 6;
const LETTERS = 5;
const HIDE_TILE_CLASS_NAME = "hideTile";


function getGameTile(rowId, colId) {
	return document.getElementsByTagName("game-app").item(0).shadowRoot.children.item(1).getElementsByTagName("div").item(0)
		.getElementsByTagName("div").item(4).getElementsByTagName("game-row").item(rowId).shadowRoot
		.children.item(1).getElementsByTagName("game-tile").item(colId)
}

function getTile(rowId, colId) {
	return getGameTile(rowId, colId).shadowRoot.children.item(1);
}

function init() {
	for(let rowId = 0; rowId < GUESSES; rowId++) {
		for(let colId = 0; colId < LETTERS; colId++) {
			getGameTile(rowId, colId).shadowRoot.children.item(0).sheet.insertRule(
				`.${HIDE_TILE_CLASS_NAME} {background: black !important;}`, 0
			);
		}
	}
}
init();


function hideTile(rowId, colId) {
	getTile(rowId, colId).classList.add(HIDE_TILE_CLASS_NAME);
}

function showTile(rowId, colId) {
	getTile(rowId, colId).classList.remove(HIDE_TILE_CLASS_NAME);
}

function hideColumn(colId) {
	for(let rowId = 0; rowId < GUESSES; rowId++) {
		hideTile(rowId, colId);
	}
}

function showColumn(colId) {
	for(let rowId = 0; rowId < GUESSES; rowId++) {
		showTile(rowId, colId);
	}
}

chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
	if(message.action === "hideColumn") {
		hideColumn(message.colId);	
  	}
	else if(message.action == "showColumn") {
		showColumn(message.colId);
	}
});
