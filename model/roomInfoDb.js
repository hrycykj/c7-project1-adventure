const { ObjectId } = require('bson')
const db = require('./db');

const masterGameCollection = 'adventureMasterData';
const currentGameCollection = currentGameName.gameName;

async function createNewGameDb(newGameName) { //inputs - new game name used to create new collection, future feature - create collection based on new game name
    let masterRoomCollection = await db.getCollection(masterGameCollection);
    let masterRoomInfoPointer = masterRoomCollection.find({});
    let masterRoomInfoArray = await masterRoomInfoPointer.toArray();
    let currentRoomCollection = await db.getCollection(newGameName); // need to error check if game is existing before writing data
    await currentRoomCollection.insertMany(masterRoomInfoArray);
    return
}

async function findCurrentRoomIdByName (room) { // inputs - room name, look up room name and return document _id 
    let roomCollection = await db.getCollection(currentGameCollection);
    let roomInfo= await roomCollection.findOne ({roomName: room});
    return roomInfo._id;
}

async function findCurrentRoomIndexByName(room) {
    let currentRoom_id = await findCurrentRoomIdByName (room);
    let currentRoomInfo = await findCurrentRoomInfoById (currentRoom_id);
    return [currentRoomInfo.roomIndex, currentRoom_id]

}

async function findCurrentRoomInfoById (id) { // inputs - record _id, outputs room info for that room
    let roomCollection = await db.getCollection (currentGameCollection);
    let roomInfo = await roomCollection.findOne ({ _id: ObjectId(id) });
    return roomInfo;
}

async function getCurrentRoomDetails (roomId) { // inputs - room document ID, return array of Room Info objects
    return await findCurrentRoomInfoById (roomId);
}

async function modifyRoomInfo (attributeToModifyArray, newValue) { // inputs - array of attributes for value to modify, new value

}

async function addRoomInfo (attributeToModifyArray, newObjectValue) { // inputs - array of attributes for value to modify, new object to add in

}

async function removeRoomInfo (attributeToModifyArray, arrayIndexToRemove) { // inputs - array of attributes for value to delete, index of array item to delete

}

//  function testing

async function main() {
    // let roomId = await findCurrentRoomIndexByName('me');
    // console.log(roomId);
    // let roomInfo = await findCurrentRoomInfoById ('61786c4e587aa13d8760b91d')
    // console.log(roomInfo);
    //await createNewGameDb(currentGameCollection);
}

// main();

module.exports = {  createNewGameDb,
                    findCurrentRoomIndexByName,
                    getCurrentRoomDetails,
                    modifyRoomInfo,
                    addRoomInfo,
                    removeRoomInfo
}