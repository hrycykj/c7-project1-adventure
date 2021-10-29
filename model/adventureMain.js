// main game structure


let adventureFunctions = require('./adventureFunctions');
let {roomInfo,
    findCurrentRoomIndexByName,
    modifyRoomInfo} = require('./roomInfo');




// create variables for game, 
// test data is initialized in roominfo.js, eventually data will reside in a database and accessed with server calls
let currentRoom='forest';
let isMeAlive=true;
let whileRoomIsNew=true;

//functions



//main start
function mainGame() {
let action='';
let allowedAction=false;
let allowedMeAction=false;

while (isMeAlive) {
  console.log (adventureFunctions.displayCurrentRoomInfo(currentRoom));
  whileRoomIsNew=false;
  while (!whileRoomIsNew&&isMeAlive) {
    let actionPhrase='';
    let actionNoun='';
    let allowedRoomAction=false;
    let allowedMeAction=false;
    let returnedOutputString='';
    actionPhrase = adventureFunctions.waitForUserInput();
    allowedRoomAction=adventureFunctions.testUserInputAgainstAllowedActions (actionPhrase, currentRoom);
    allowedMeAction=adventureFunctions.testUserInputAgainstAllowedActions (actionPhrase, 'me');
    if (!(allowedRoomAction||allowedMeAction)) {
      returnedOutputString="I'm sorry you'll have to speak up, I didn't hear that";  //add random response generator for actions that aren't allowed
    } 
      else if (allowedMeAction) {
        let meRoom='me'
        // console.log(`${allowedMeAction} - allowed me action found`)
        actionNoun = adventureFunctions.nounToApplyTheAllowedActionTo (actionPhrase, allowedMeAction);
        // console.log(actionNoun);
        [meRoom,whileRoomIsNew,isMeAlive,returnedOutputString] = adventureFunctions[allowedMeAction] (actionNoun,meRoom,whileRoomIsNew)
      }
      else if (allowedRoomAction) {
        // console.log(`${allowedRoomAction} - allowed room action found`)
        actionNoun = adventureFunctions.nounToApplyTheAllowedActionTo (actionPhrase, allowedRoomAction);
        // console.log(actionNoun);
        [currentRoom,whileRoomIsNew,isMeAlive,returnedOutputString] = adventureFunctions[allowedRoomAction] (actionNoun,currentRoom,whileRoomIsNew)
        // find and call allowedRoomAction function
      }
    console.log(returnedOutputString);
    // [currentRoom, whileRoomIsNew] = adventureFunctions[functionCallName](actionNoun, currentRoom);

  }
}
console.log('This is the end, my friend...');

}

mainGame();
