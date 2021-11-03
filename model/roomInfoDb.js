const { ObjectId } = require('bson')
const db = require('./db');

const masterGameCollection = 'adventureMasterData';
const currentGameCollection = currentGameName.gameName;

async function createNewGameDb(newGameName) { //inputs - new game name used to create new collection, future feature - create collection based on new game name
    let masterRoomCollection = await db.getCollection(masterGameCollection);
    let masterRoomInfoPointer = masterRoomCollection.find({}, { projection: {_id: 0 } });
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
    let roomCollection = await db.getCollection (currentGameCollection);
    let room_id = attributeToModifyArray.shift();
    let dotNotationFromArray = await buildDotNotationFromArray (attributeToModifyArray);
    let setValue ={};
    setValue[dotNotationFromArray] = newValue;
    await roomCollection.updateOne ({_id: ObjectId(room_id)}, {$set: setValue});
}

async function addRoomInfo (attributeToModifyArray, newObjectValue) { // inputs - array of attributes for value to modify, new object to add in
    modifyRoomInfo (attributeToModifyArray,newObjectValue);
}

async function removeRoomInfo (attributeToModifyArray, arrayAttributeMatchToRemove) { // inputs - array of attributes for value to delete, unique attribute and value from array to delete
    let roomCollection = await db.getCollection (currentGameCollection);
    let room_id = attributeToModifyArray.shift();
    let dotNotationFromArray = await (buildDotNotationFromArray (attributeToModifyArray));
    let removeValue = {};
    removeValue[dotNotationFromArray]={[arrayAttributeMatchToRemove[0]]: arrayAttributeMatchToRemove[1]};
    let returnedArray = await roomCollection.updateOne ({_id: ObjectId(room_id)}, {$pull: removeValue});  //{inventory : {'inventoryName': 'notebook'}}});
    // console.log (`the returned array is ${returnedArray}`);
}

async function buildDotNotationFromArray(arrayToChange){
    // console.log (arrayToChange);
    if (arrayToChange.length > 1){  // if access array still has more than one item it recursively calls setValue
        let currentFieldString = arrayToChange.shift();
        // console.log ('shifted string:',currentFieldString);
        currentFieldString += '.' + await buildDotNotationFromArray (arrayToChange);
        // console.log ('concated string:',currentFieldString);
        return currentFieldString;
    }else{
        currentFieldString = arrayToChange[0]
        // console.log ('final element of string:',currentFieldString);
        return currentFieldString; // once you get down to the last access array item, it sets it to the value
    }
}

//  function testing

async function main() {
    // let roomId = await findCurrentRoomIndexByName('me');
    // console.log(roomId);
    // let roomInfo = await findCurrentRoomInfoById ('61786c4e587aa13d8760b91d')
    // console.log(roomInfo);
    // currentGameCollection = 'the-ultimate-test-game';
    // createNewGameDb(currentGameCollection);

    // await removeRoomInfo(['6182b9a79c51b06a24c37788','inventory'],['inventoryName','coins']);
}

// main();

module.exports = {  createNewGameDb,
                    findCurrentRoomIndexByName,
                    getCurrentRoomDetails,
                    modifyRoomInfo,
                    addRoomInfo,
                    removeRoomInfo
}