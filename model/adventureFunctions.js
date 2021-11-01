const prompt = require('prompt-sync')({sigint: true}); //run npm install prompt-sync in the terminal to make sure this will work, prompt is used in waitForUserInput function
let {findCurrentRoomIndexByName,
    getCurrentRoomDetails,
    modifyRoomInfo,
    addRoomInfo,
    removeRoomInfo} = require('./roomInfo');

let currentRoom;
let isMeAlive;
let whileRoomIsNew;



  
  async function displayCurrentRoomInfo(currentRoom) { // pulls current room info and outputs a string to display with the room info
    // once datebase is set up, get roomInfo[currentRoom].useLongRoomDescription
    let currentRoomIndex = await findCurrentRoomIndexByName(currentRoom);
    let currentRoomInfo = await getCurrentRoomDetails(currentRoomIndex);
    let returnedRoomInfoString = "I don't really know where you are right now, something has gone terribly wrong..." // default returned string
    if (currentRoomIndex>0) {
      if (currentRoomInfo.useLongRoomDescription) {
        returnedRoomInfoString = currentRoomInfo.longDescription;
        modifyRoomInfo ([currentRoomIndex,'useLongRoomDescription'],false);
        //console.log(roomInfo[currentRoomIndex].useLongRoomDescription)
      } else {
        returnedRoomInfoString = currentRoomInfo.shortDescription;
      }
    }
    return returnedRoomInfoString
  }
  
  async function parseAndExecuteActionPhrase (actionPhrase, currentRoom, whileRoomIsNew) {  
    let isMeAlive = true;
    let actionNoun='';
    let allowedRoomAction=false;
    let allowedMeAction=false;
    let returnedOutputString='';
    // console.log('made it into the parse and execute function');
    allowedRoomAction=await testUserInputAgainstAllowedActions (actionPhrase, currentRoom);
    allowedMeAction=await testUserInputAgainstAllowedActions (actionPhrase, 'me');
    // console.log('made it past testing user input agains the allowed lists', allowedRoomAction, allowedMeAction);
    if (!(allowedRoomAction||allowedMeAction)) {
      returnedOutputString="I'm sorry you'll have to speak up, I didn't hear that";  //add random response generator for actions that aren't allowed
    } 
      else if (allowedMeAction) {
        // console.log('made it into the me action calls')
        let meRoom='me'
        actionNoun = nounToApplyTheAllowedActionTo (actionPhrase, allowedMeAction);
        [meRoom,whileRoomIsNew,isMeAlive,returnedOutputString] = await this[allowedMeAction] (actionNoun,meRoom,whileRoomIsNew)
        // console.log('made it to the end of the me action call')
      }
      else if (allowedRoomAction) {
        // console.log('made it into the room action calls', allowedRoomAction)
        actionNoun = nounToApplyTheAllowedActionTo (actionPhrase, allowedRoomAction);
        // console.log('made it past figuring out the noun', actionNoun, currentRoom, whileRoomIsNew)
        [currentRoom,whileRoomIsNew,isMeAlive,returnedOutputString] = await this[allowedRoomAction] (actionNoun,currentRoom,whileRoomIsNew)
        // console.log('made it to the end of the me action call')
      }
      return [currentRoom,whileRoomIsNew,isMeAlive,returnedOutputString];
    }

  function waitForUserInput() { // not used in server calls version in adventureRoutes.js
    let userInput=prompt('>>');
    console.log(`Hey there, this is what you typed: ${userInput}`);
    return userInput;
  }
  
  async function testUserInputAgainstAllowedActions (proposedActionPhrase, currentRoom) { // see if part of the action phrase input is an allowed room or Me action
    let currentRoomIndex = await findCurrentRoomIndexByName(currentRoom)
    let currentRoomInfo = await getCurrentRoomDetails(currentRoomIndex);
    let allowedActions = currentRoomInfo.roomActions;
    let returnedAction=false;
    let i=0;
    while (i<allowedActions.length) {
      if (proposedActionPhrase.toLowerCase().includes(allowedActions[i])) {
        returnedAction=allowedActions[i];
      }
      i++
    }
    return returnedAction;
  }
  
  function nounToApplyTheAllowedActionTo (proposedActionPhrase, allowedAction) {
    //assumes that the rest of the phrase right after the allowedAction is the noun to apply the allowedAction to
    let returnedNoun=''
    if (proposedActionPhrase.toLowerCase().search(allowedAction)<proposedActionPhrase.length){
      returnedNoun=proposedActionPhrase.toLowerCase().substring((proposedActionPhrase.toLowerCase().search(allowedAction)+allowedAction.length+1),proposedActionPhrase.length);
    }
    return returnedNoun;
  }

// room specific actions

async function lookAt (inspectedObject, currentRoom, newRoomFlag) {
  let alive=true;
  let returnedObjectLookedAtString;
  let currentRoomIndex = await findCurrentRoomIndexByName(currentRoom);
  let currentRoomInfo = await getCurrentRoomDetails(currentRoomIndex);
  let allowedInventoryItems = currentRoomInfo.inventory;
  if (inspectedObject.length>0) {
    for (let i=0; i<allowedInventoryItems.length; i++) {
      if (inspectedObject.includes(allowedInventoryItems[i].inventoryName)) {
        if (allowedInventoryItems[i].inventoryQuantity<0) {
          returnedObjectLookedAtString = `...I can't seem to see a ${allowedInventoryItems[i].inventoryName}`;
          return [currentRoom, newRoomFlag, alive, returnedObjectLookedAtString];
        } else {
          if (allowedInventoryItems[i].useLongInventoryDescription) {
            returnedObjectLookedAtString = allowedInventoryItems[i].inventoryLongDescription;
            let attribute = "[inventory]["+i+"][useLongInventoryDescription]";
            modifyRoomInfo ([currentRoomIndex,'inventory',i,'useLongInventoryDescription'],false);
            //allowedInventoryItems[i].useLongInventoryDescription=false;  // call function to set inventory look to short description
          } else {
            returnedObjectLookedAtString = allowedInventoryItems[i].inventoryShortDescription;
          }
          return [currentRoom, newRoomFlag, alive, returnedObjectLookedAtString];
        }
      }
    }
    returnedObjectLookedAtString = `I can't seem to see a ${inspectedObject}`;
    return [currentRoom, newRoomFlag, alive, returnedObjectLookedAtString];
  }
  await modifyRoomInfo ([currentRoomIndex,'useLongRoomDescription'],true);
  //roomInfo[currentRoomIndex].useLongRoomDescription=true;
  returnedObjectLookedAtString = await displayCurrentRoomInfo(currentRoom); //need to output this to screen from where its called
  return [currentRoom, newRoomFlag, alive,returnedObjectLookedAtString];
}

async function look (inspectedObject, currentRoom, newRoomFlag) {  // same function as lookAt
  let alive = true;
  let returnedInfo;
  returnedInfo = await lookAt (inspectedObject, currentRoom, newRoomFlag);
  //console.log(returnedInfo);
    return [currentRoom, newRoomFlag, alive,returnedInfo[3]];
  }
  
async function inspect (inspectedObject, currentRoom, newRoomFlag) {  // set current room to Me and call lookAt to see something in player's inventory
  let alive = true;
  let returnedInfo;
  returnedInfo = await lookAt (inspectedObject, 'me', newRoomFlag);
  return [currentRoom,newRoomFlag,alive,returnedInfo[3]];
}  

async function move (direction, currentRoom, newRoomFlag) {
  let alive = true;
  let returnedRoomString='';
  let currentRoomIndex = await findCurrentRoomIndexByName(currentRoom);
  let allowedAdjacentRooms = (await getCurrentRoomDetails(currentRoomIndex)).adjacentRooms;
  for (let i=0; i<allowedAdjacentRooms.length; i++) {
    if (direction.includes(allowedAdjacentRooms[i].direction)) {
        newRoomFlag = true;
        let adjacentRoomIndex=await findCurrentRoomIndexByName(allowedAdjacentRooms[i].adjacentRoomName);
        returnedRoomString =`Moving ${direction} to ${(await getCurrentRoomDetails(adjacentRoomIndex)).shortDescription}`;
        return [allowedAdjacentRooms[i].adjacentRoomName, newRoomFlag, alive,returnedRoomString];
    }
  }
  returnedRoomString =`I don't think I can move ${direction}`;
  return [currentRoom, newRoomFlag, alive,returnedRoomString];
}

async function climb (direction, currentRoom, newRoomFlag) {  // same function call as move
  let newRoom = await move(direction, currentRoom, newRoomFlag);
  return newRoom;
}

async function go (direction, currentRoom, newRoomFlag) {  // same function call as move
  let newRoom = await move(direction, currentRoom, newRoomFlag);
  return newRoom;
}
  

async function listInventory (action, currentRoom, newRoomFlag) {
  let alive=true;
  let currentRoomIndex = await findCurrentRoomIndexByName(currentRoom);
  let returnedInventoryString ='This is what I found:\n'
  // let inventoryLength = (await getCurrentRoomDetails (currentRoomIndex)).inventory.length;
  for (let i=0; i<(await getCurrentRoomDetails(currentRoomIndex)).inventory.length; i++) {
    returnedInventoryString +=`${(await getCurrentRoomDetails(currentRoomIndex)).inventory[i].inventoryQuantity} ${(await getCurrentRoomDetails(currentRoomIndex)).inventory[i].inventoryName}\n`;
  }
  return [currentRoom, newRoomFlag, alive, returnedInventoryString];
}

async function pocket (action, currentRoom, newRoomFlag) {
  let alive = true;
  let returnedString = await listInventory (action, currentRoom, newRoomFlag);
  return [currentRoom, newRoomFlag, alive, returnedString[3]];
}

async function secret (action, currentRoom, newRoomFlag) { //returns the current rooms inventory available to pick up (or not if qty=0)
  let alive = true;
  let returnedString = await listInventory (action, currentRoom, newRoomFlag);
  return [currentRoom, newRoomFlag, alive, returnedString[3]];
}

async function get (itemToPickup, currentRoom, newRoomFlag) {
  let alive=true;
  let stringToReturn='';
  let currentRoomIndex = await findCurrentRoomIndexByName(currentRoom);
  let allowedInventoryItems = (await getCurrentRoomDetails(currentRoomIndex)).inventory;
  for (let i=0; i<allowedInventoryItems.length; i++) {
    if (itemToPickup.includes(allowedInventoryItems[i].inventoryName)) {
      if (allowedInventoryItems[i].inventoryQuantity==0) {
        stringToReturn = `I can't seem to pick up the ${allowedInventoryItems[i].inventoryName}, are you sure its actually here?`;
        return [currentRoom, newRoomFlag, alive, stringToReturn];
      } else if (allowedInventoryItems[i].inventoryQuantity>0) {
        let roomQuantity = allowedInventoryItems[i].inventoryQuantity - 1;
        modifyRoomInfo ([currentRoomIndex,'inventory',i,'inventoryQuantity'],roomQuantity);
        for (let j=0; j<(await getCurrentRoomDetails(0)).inventory.length; j++) {
          if ((await getCurrentRoomDetails(0)).inventory[j].inventoryName.includes(allowedInventoryItems[i].inventoryName)) { //change to get roomInfo for Me
            let meQuantity = (await getCurrentRoomDetails(0)).inventory[j].inventoryQuantity+1;
            modifyRoomInfo ([0,'inventory',j,'inventoryQuantity'],meQuantity);
            stringToReturn = `you've picked up the ${allowedInventoryItems[i].inventoryName}\n`;
            return [currentRoom, newRoomFlag, alive, stringToReturn];
          }
        }
        let pickedUpItem ={inventoryName: allowedInventoryItems[i].inventoryName, inventoryLongDescription: allowedInventoryItems[i].inventoryLongDescription,
          inventoryShortDescription: allowedInventoryItems[i].inventoryShortDescription, useLongInventoryDescription: allowedInventoryItems[i].useLongInventoryDescription,
          inventoryQuantity: 1};
          addRoomInfo ([0,'inventory'],pickedUpItem);
          // roomInfo[0].inventory.unshift(pickedUpItem);
          stringToReturn = `.you've picked up the ${allowedInventoryItems[i].inventoryName}\n`;
          return [currentRoom, newRoomFlag, alive, stringToReturn];
      } else if (allowedInventoryItems[i].inventoryQuantity<0) {
        let roomQuantity = allowedInventoryItems[i].inventoryQuantity + 1; // negative inventory items won't let you look at them, but you can pick them up then look at them
        modifyRoomInfo ([currentRoomIndex,'inventory',i,'inventoryQuantity'],roomQuantity);
        // roomInfo[currentRoomIndex].inventory[i].inventoryQuantity++; // modified to use modifyRoomInfo function
        for (let j=0; j<(await getCurrentRoomDetails(0)).inventory.length; j++) {
          if ((await getCurrentRoomDetails(0)).inventory[j].inventoryName.includes(allowedInventoryItems[i].inventoryName)) {
            let meQuantity = (await getCurrentRoomDetails(0)).inventory[j].inventoryQuantity+1;
            modifyRoomInfo ([0,'inventory',j,'inventoryQuantity'],meQuantity);
            stringToReturn = `..you've picked up the ${allowedInventoryItems[i].inventoryName}\n`;
            //roomInfo[0].inventory[j].inventoryQuantity++ //use modifyRoomInfo function
            return [currentRoom, newRoomFlag, alive, stringToReturn];
          }
        }
        let pickedUpItem ={inventoryName: allowedInventoryItems[i].inventoryName, inventoryLongDescription: allowedInventoryItems[i].inventoryLongDescription,
          inventoryShortDescription: allowedInventoryItems[i].inventoryShortDescription, useLongInventoryDescription: allowedInventoryItems[i].useLongInventoryDescription,
          inventoryQuantity: 1};
          addRoomInfo ([0,'inventory'],pickedUpItem);
          // roomInfo[0].inventory.unshift(pickedUpItem);
          stringToReturn = `...you've picked up the ${allowedInventoryItems[i].inventoryName}\n`;
          return [currentRoom, newRoomFlag, alive,stringToReturn];
        }
        }
      }
      
      stringToReturn = `--I can't seem to pick up the ${itemToPickup}, are you sure its actually here?`;
      return [currentRoom, newRoomFlag, alive, stringToReturn];
    }
    
    async function pick (itemToPickup, currentRoom, newRoomFlag) {
      let alive = true;
      let returnedString = await get (itemToPickup, currentRoom, newRoomFlag);
      return [currentRoom,newRoomFlag,alive,returnedString[3]];
    }
    
    async function drop (itemToDrop, currentRoom, newRoomFlag) {
      let alive=true;
      let stringToReturn = '';
      let currentRoomIndex = await findCurrentRoomIndexByName(currentRoom);
      let allowedInventoryItems = (await getCurrentRoomDetails(0)).inventory;
      for (let i=0; i<allowedInventoryItems.length; i++) {
        if (itemToDrop.includes(allowedInventoryItems[i].inventoryName)) {
          if (allowedInventoryItems[i].inventoryQuantity<1) {
            stringToReturn = `I don't seem to have a ${allowedInventoryItems[i].inventoryName}, better check your pockets again`;
            return [currentRoom, newRoomFlag, alive,stringToReturn];
          } else {
            let meQuantity = allowedInventoryItems[i].inventoryQuantity-1;
            modifyRoomInfo ([0,'inventory',i,'inventoryQuantity'],meQuantity);
            //roomInfo[0].inventory[i].inventoryQuantity--;
            let stringToReturn = `You've dropped a ${allowedInventoryItems[i].inventoryName} here in ${(await getCurrentRoomDetails(currentRoomIndex)).shortDescription}.`;
            let currentRoomInventoryItems = (await getCurrentRoomDetails (currentRoomIndex)).inventory;
            for (let j=0; j<currentRoomInventoryItems.length; j++) {
              if (currentRoomInventoryItems[j].inventoryName.includes(allowedInventoryItems[i].inventoryName)) {
                let roomQuantity = currentRoomInventoryItems[j].inventoryQuantity + 1;
                modifyRoomInfo ([currentRoomIndex, 'inventory',j,'inventoryQuantity'], roomQuantity);
                // roomInfo[currentRoomIndex].inventory[j].inventoryQuantity++;
                if ((await getCurrentRoomDetails(0)).inventory[i].inventoryQuantity<1) { // roomInfo[0].inventory[i].inventoryQuantity<1) {
                  removeRoomInfo ([0,'inventory'],i);
                  // roomInfo[0].inventory.splice(i,1);
                }
                return [currentRoom, newRoomFlag, alive, stringToReturn];
              }
            }
            let droppedItem ={inventoryName: allowedInventoryItems[i].inventoryName, inventoryLongDescription: allowedInventoryItems[i].inventoryLongDescription,
              inventoryShortDescription: allowedInventoryItems[i].inventoryShortDescription, useLongInventoryDescription: allowedInventoryItems[i].useLongInventoryDescription,
              inventoryQuantity: 1};
              addRoomInfo ([currentRoomIndex,'inventory'],droppedItem);
              // roomInfo[currentRoomIndex].inventory.unshift(pickedUpItem);
              if (allowedInventoryItems[i].inventoryQuantity<1) {
                removeRoomInfo ([0,'inventory'],i);
                // roomInfo[0].inventory.splice(i,1);
              }
              return [currentRoom, newRoomFlag, alive, stringToReturn];
            }
          }
        }
        
        stringToReturn = `--I can't seem to find a ${itemToDrop}, are you sure you actually have one?`;
        return [currentRoom, newRoomFlag, alive, stringToReturn];
      }
      
      
      async function help (itemToPickup, currentRoom, newRoomFlag) {
        let helpString='Welcome to Adventure (the Game).  In this game you can type in verbs and nouns to do things.  Some examples of the available verbs are:\n';
        let alive=true;
        let currentRoomIndex = await findCurrentRoomIndexByName(currentRoom);
        let currentRoomInfo = await getCurrentRoomDetails(currentRoomIndex);
        let currentRoomActions = currentRoomInfo.roomActions;
        for (let i=0; i<currentRoomActions.length-1; i++) { // don't show the last action verb since its secret and only for trouble shooting
          helpString=helpString+currentRoomActions[i]+', \n';
        }
        helpString = helpString.slice (0,helpString.length-3)+'\n'
        return [currentRoom, newRoomFlag, alive, helpString];
      }
      
      async function gameHelp () {
        let helpRoom = 'forest'
        let helpString = await help ('',helpRoom,false);
        return (helpString[3]);
      }

      function endGame() {
        return ("Oops, you've passed on somehow (but its probably better than math class).");
      }
      
      function end (action, currentRoom, newRoomFlag) {
        let alive=false;
        let endGameString = endGame();
        return [currentRoom, newRoomFlag, alive, endGameString]
      }
      
      module.exports = {displayCurrentRoomInfo,
                    waitForUserInput,
                    parseAndExecuteActionPhrase,
                    testUserInputAgainstAllowedActions,
                    nounToApplyTheAllowedActionTo,
                    lookAt,
                    look,
                    inspect,
                    move,
                    go,
                    end,
                    pocket,
                    get,
                    pick,
                    help,
                    climb,
                    drop,
                    secret,
                    pick,
                    endGame,
                    gameHelp
                };
