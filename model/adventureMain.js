// main game structure
currentGameName = {gameName: 'Adventure1.0Game'+Math.floor(Math.random() * 100)};

let adventureFunctions = require('./adventureFunctions');




// create variables for game, 
// test data is initialized in roominfo.js, eventually data will reside in a database and accessed with server calls
let currentRoom='forest';
let isMeAlive=true;
let whileRoomIsNew=true;


//functions




//main start
async function mainGame() {
  await adventureFunctions.initializeNewGameDb (currentGameName.gameName);
  console.log (`Your current game is saved under ${currentGameName.gameName}`);
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
