// main game structure


let adventureFunctions = require('./adventureFunctions');
// let {findCurrentRoomIndexByName,
//     getCurrentRoomDetails,
//     modifyRoomInfo,
//     addRoomInfo,
//     removeRoomInfo} = require('./roomInfo');




// create variables for game, 
// test data is initialized in roominfo.js, eventually data will reside in a database and accessed with server calls
let currentRoom='forest';
let isMeAlive=true;
let whileRoomIsNew=true;

//functions




//main start
async function mainGame() {
    while (isMeAlive) {
      console.log (await adventureFunctions.displayCurrentRoomInfo(currentRoom));
      whileRoomIsNew=false;
      while (!whileRoomIsNew&&isMeAlive) {
        let actionPhrase='';
        actionPhrase = adventureFunctions.waitForUserInput();
        [currentRoom, whileRoomIsNew, isMeAlive, returnedOutputString] = await adventureFunctions.parseAndExecuteActionPhrase (actionPhrase, currentRoom, whileRoomIsNew);
        console.log(returnedOutputString);
      }
    }
  console.log('This is the end, my friend...');
}

mainGame();
