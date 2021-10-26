// main game structure


let adventureFunctions = require('./adventureFunctions');
let {roomInfo} = require('./roomInfo');




// create variables for game, 
// test data is initialized in roominfo.js, eventually data will reside in a database and accessed with server calls
let currentRoom='forest';
let isMeAlive=true;
let whileRoomIsNew=true;

//functions



//main start
let action='';
let allowedAction=false;
let allowedMeAction=false;

while (isMeAlive) {
  adventureFunctions.displayCurrentRoomInfo(currentRoom);
  whileRoomIsNew=false;
  while (!whileRoomIsNew&&isMeAlive) {
    let actionPhrase='';
    let actionNoun='';
    let allowedRoomAction=false;
    let allowedMeAction=false;
    actionPhrase = adventureFunctions.waitForUserInput();
    allowedRoomAction=adventureFunctions.testUserInputAgainstAllowedActions (actionPhrase, currentRoom);
    allowedMeAction=adventureFunctions.testUserInputAgainstAllowedActions (actionPhrase, 'me');
    if (!(allowedRoomAction||allowedMeAction)) {
      console.log("I'm sorry you'll have to speak up, I didn't hear that");  //add random response generator for actions that aren't allowed
    } 
      else if (allowedMeAction) {
        let meRoom='me'
        // console.log(`${allowedMeAction} - allowed me action found`)
        actionNoun = adventureFunctions.nounToApplyTheAllowedActionTo (actionPhrase, allowedMeAction);
        // console.log(actionNoun);
        [meRoom,whileRoomIsNew,isMeAlive] = adventureFunctions[allowedMeAction] (actionNoun,meRoom,whileRoomIsNew)
      }
      else if (allowedRoomAction) {
        // console.log(`${allowedRoomAction} - allowed room action found`)
        actionNoun = adventureFunctions.nounToApplyTheAllowedActionTo (actionPhrase, allowedRoomAction);
        // console.log(actionNoun);
        [currentRoom,whileRoomIsNew,isMeAlive] = adventureFunctions[allowedRoomAction] (actionNoun,currentRoom,whileRoomIsNew)
        // find and call allowedRoomAction function
      }
    
    // [currentRoom, whileRoomIsNew] = adventureFunctions[functionCallName](actionNoun, currentRoom);

  }
}
console.log("Oops, you've passed on somehow (but its probably better than math class).")

