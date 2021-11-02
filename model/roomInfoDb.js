const { ObjectId } = require('bson')
const db = require('./db')

const masterGameCollection = 'adventureMasterData';
const currentGameCollection = 'adventureGame1';
'
async function createNewGameDB(newGameName) { //inputs - new game name used to create new collection

}

async function findCurrentRoomIdByName (room) { // inputs - room name, look up room name and return document ID 

}

async function getCurrentRoomDetails (roomId) { // inputs - room document ID, return array of Room Info objects

}

async function modifyRoomInfo (attributeToModifyArray, newValue) { // inputs - array of attributes for value to modify, new value

}

async function addRoomInfo (attributeToModifyArray, newObjectValue) { // inputs - array of attributes for value to modify, new object to add in

}

async function removeRoomInfo (attributeToModifyArray, arrayIndexToRemove) { // inputs - array of attributes for value to delete, index of array item to delete

}