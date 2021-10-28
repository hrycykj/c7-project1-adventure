const prompt = require('prompt-sync')({sigint: true}); //run npm install prompt-sync in the terminal to make sure this will work, prompt is used in waitForUserInput function
let {roomInfo,
    findCurrentRoomIndexByName,
    getCurrentRoomDetails,
    modifyRoomInfo} = require('./roomInfo');



  
  function displayCurrentRoomInfo(currentRoom) {
    // once datebase is set up, get roomInfo[currentRoom].useLongRoomDescription
    let currentRoomIndex = findCurrentRoomIndexByName(currentRoom);
    let currentRoomInfo = getCurrentRoomDetails(currentRoomIndex);
    let returnedRoomInfoString = "I don't really know where you are right now, something has gone terribly wrong..." // default returned string
    if (currentRoomIndex>0) {
      if (currentRoomInfo.useLongRoomDescription) {
        returnedRoomInfoString = currentRoomInfo.longDescription;
        modifyRoomInfo (currentRoomIndex,'useLongRoomDescription',false) // create modify roomInfo function for this
      } else {
        returnedRoomInfoString = currentRoomInfo.shortDescription;
      }
    }
    return returnedRoomInfoString
  }
  
  function waitForUserInput() {
    let userInput=prompt('>>');
    console.log(`Hey there, this is what you typed: ${userInput}`);
    return userInput;
  }
  
  function testUserInputAgainstAllowedActions (proposedActionPhrase, currentRoom) {
    let currentRoomIndex = findCurrentRoomIndexByName(currentRoom)
    let allowedActions = roomInfo[currentRoomIndex].roomActions;
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

function lookAt (inspectedObject, currentRoom, newRoomFlag) {
  let alive=true;  
  let currentRoomIndex = findCurrentRoomIndexByName(currentRoom);
  let allowedInventoryItems = roomInfo[currentRoomIndex].inventory;
  for (let i=0; i<allowedInventoryItems.length; i++) {
    if (inspectedObject.includes(allowedInventoryItems[i].inventoryName)) {
      if (allowedInventoryItems[i].inventoryQuantity<0) {
        console.log(`I can't seem to see a ${allowedInventoryItems[i].inventoryName}`);
        return [currentRoom, newRoomFlag, alive];
      } else {
        if (allowedInventoryItems[i].useLongInventoryDescription) {
          console.log(allowedInventoryItems[i].inventoryLongDescription);
          allowedInventoryItems[i].useLongInventoryDescription=false;
        } else {
          console.log(allowedInventoryItems[i].inventoryShortDescription);
        }
        return [currentRoom, newRoomFlag, alive];
      }
    }
  }
  roomInfo[currentRoomIndex].useLongRoomDescription=true;
  console.log(displayCurrentRoomInfo(currentRoom)); //need to output this to screen from where its called
  return [currentRoom, newRoomFlag, alive];
  }

function look (inspectedObject, currentRoom, newRoomFlag) {  // same function as lookAt
    let alive = true;
    lookAt (inspectedObject, currentRoom, newRoomFlag);
    return [currentRoom, newRoomFlag, alive];
  }
  
  function inspect (inspectedObject, currentRoom, newRoomFlag) {  // set current room to Me and call lookAt to see something in player's inventory
    let alive = true;
    lookAt (inspectedObject, 'me', newRoomFlag);
    return [currentRoom,newRoomFlag,alive];
  }  

  function move (direction, currentRoom, newRoomFlag) {
    let alive = true;
    let currentRoomIndex = findCurrentRoomIndexByName(currentRoom);
    let allowedAdjacentRooms = roomInfo[currentRoomIndex].adjacentRooms;
    for (let i=0; i<allowedAdjacentRooms.length; i++) {
      if (direction.includes(allowedAdjacentRooms[i].direction)) {
          newRoomFlag = true;
          let adjacentRoomIndex=findCurrentRoomIndexByName(allowedAdjacentRooms[i].adjacentRoomName);
          console.log (`Moving ${direction} to ${roomInfo[adjacentRoomIndex].shortDescription}`);
          return [allowedAdjacentRooms[i].adjacentRoomName, newRoomFlag, alive];
      }
    }
    console.log(`I don't think I can move ${direction}`);
    return [currentRoom, newRoomFlag, alive];
  }

function climb (direction, currentRoom, newRoomFlag) {  // same function call as move
  let newRoom = move(direction, currentRoom, newRoomFlag);
  return newRoom;
}

function go (direction, currentRoom, newRoomFlag) {  // same function call as move
  let newRoom = move(direction, currentRoom, newRoomFlag);
  return newRoom;
}
  
  function end (action, currentRoom, newRoomFlag) {
    let alive=false;
    return [currentRoom, newRoomFlag, alive]
  }

  function pocket (action, currentRoom, newRoomFlag) {
    let alive=true;

    let currentRoomIndex = findCurrentRoomIndexByName(currentRoom);
    for (let i=0; i<roomInfo[currentRoomIndex].inventory.length; i++) {
      console.log(`${roomInfo[currentRoomIndex].inventory[i].inventoryQuantity} ${roomInfo[currentRoomIndex].inventory[i].inventoryName}`)
    }
    return [currentRoom, newRoomFlag, alive];
  }

  function secret (action, currentRoom, newRoomFlag) {
    let alive = true;
    pocket (action, currentRoom, newRoomFlag);
    return [currentRoom, newRoomFlag, alive];
  }
  
  function get (itemToPickup, currentRoom, newRoomFlag) {
    let alive=true;
    let currentRoomIndex = findCurrentRoomIndexByName(currentRoom);
    let allowedInventoryItems = roomInfo[currentRoomIndex].inventory;
    for (let i=0; i<allowedInventoryItems.length; i++) {
      if (itemToPickup.includes(allowedInventoryItems[i].inventoryName)) {
        if (allowedInventoryItems[i].inventoryQuantity==0) {
          console.log (`I can't seem to pick up the ${allowedInventoryItems[i].inventoryName}, are you sure its actually here?`);
          return [currentRoom, newRoomFlag, alive];
        } else if (allowedInventoryItems[i].inventoryQuantity>0) {
            roomInfo[currentRoomIndex].inventory[i].inventoryQuantity--;
            for (let j=0; j<roomInfo[0].inventory.length; j++) {
              if (roomInfo[0].inventory[j].inventoryName.includes(allowedInventoryItems[i].inventoryName)) {
                roomInfo[0].inventory[j].inventoryQuantity++
                return [currentRoom, newRoomFlag, alive];
              }
            }
            let pickedUpItem ={inventoryName: allowedInventoryItems[i].inventoryName, inventoryLongDescription: allowedInventoryItems[i].inventoryLongDescription,
              inventoryShortDescription: allowedInventoryItems[i].inventoryShortDescription, useLongInventoryDescription: allowedInventoryItems[i].useLongInventoryDescription,
              inventoryQuantity: 1};
            roomInfo[0].inventory.unshift(pickedUpItem);
            return [currentRoom, newRoomFlag, alive];
        } else if (allowedInventoryItems[i].inventoryQuantity<0) {
            roomInfo[currentRoomIndex].inventory[i].inventoryQuantity++; // negative inventory items won't let you look at them, but you can pick them up then look at them
            for (let j=0; j<roomInfo[0].inventory.length; j++) {
              if (roomInfo[0].inventory[j].inventoryName.includes(allowedInventoryItems[i].inventoryName)) {
                roomInfo[0].inventory[j].inventoryQuantity++
                return [currentRoom, newRoomFlag, alive];
              }
            }
            let pickedUpItem ={inventoryName: allowedInventoryItems[i].inventoryName, inventoryLongDescription: allowedInventoryItems[i].inventoryLongDescription,
              inventoryShortDescription: allowedInventoryItems[i].inventoryShortDescription, useLongInventoryDescription: allowedInventoryItems[i].useLongInventoryDescription,
              inventoryQuantity: 1};
            roomInfo[0].inventory.unshift(pickedUpItem);
            return [currentRoom, newRoomFlag, alive];
        }
      }
    }
    
  console.log (`--I can't seem to pick up the ${itemToPickup}, are you sure its actually here?`);
  return [currentRoom, newRoomFlag, alive];
}

function pick (itemToPickup, currentRoom, newRoomFlag) {
  let alive = true;
  get (itemToPickup, currentRoom, newRoomFlag);
  return [currentRoom,newRoomFlag,alive];
}

function drop (itemToDrop, currentRoom, newRoomFlag) {
  let alive=true;
  let currentRoomIndex = findCurrentRoomIndexByName(currentRoom);
  let allowedInventoryItems = roomInfo[0].inventory;
  for (let i=0; i<allowedInventoryItems.length; i++) {
    if (itemToDrop.includes(allowedInventoryItems[i].inventoryName)) {
      if (allowedInventoryItems[i].inventoryQuantity<1) {
        console.log (`I don't seem to have a ${allowedInventoryItems[i].inventoryName}, better check your pockets again`);
        return [currentRoom, newRoomFlag, alive];
      } else {
          roomInfo[0].inventory[i].inventoryQuantity--;
          for (let j=0; j<roomInfo[currentRoomIndex].inventory.length; j++) {
            if (roomInfo[currentRoomIndex].inventory[j].inventoryName.includes(allowedInventoryItems[i].inventoryName)) {
              roomInfo[currentRoomIndex].inventory[j].inventoryQuantity++;
              if (roomInfo[0].inventory[i].inventoryQuantity<1) {
                roomInfo[0].inventory.splice(i,1);
              }
              return [currentRoom, newRoomFlag, alive];
            }
          }
          let pickedUpItem ={inventoryName: allowedInventoryItems[i].inventoryName, inventoryLongDescription: allowedInventoryItems[i].inventoryLongDescription,
            inventoryShortDescription: allowedInventoryItems[i].inventoryShortDescription, useLongInventoryDescription: allowedInventoryItems[i].useLongInventoryDescription,
            inventoryQuantity: 1};
          roomInfo[currentRoomIndex].inventory.unshift(pickedUpItem);
          if (roomInfo[0].inventory[i].inventoryQuantity<1) {
            roomInfo[0].inventory.splice(i,1);
          }
          return [currentRoom, newRoomFlag, alive];
      }
    }
  }
  
console.log (`--I can't seem to find a ${itemToDrop}, are you sure you actually have one?`);
return [currentRoom, newRoomFlag, alive];
}


function help (itemToPickup, currentRoom, newRoomFlag) {
  let helpString='Welcome to Adventure (the Game).  In this game you can type in verbs and nouns to do things.  Some examples of the available verbs are:\n';
  let alive=true;
  let currentRoomIndex = findCurrentRoomIndexByName(currentRoom);
  let currentRoomActions = roomInfo[currentRoomIndex].roomActions;
  for (let i=0; i<currentRoomActions.length-1; i++) {
    helpString=helpString+currentRoomActions[i]+', \n';
  }
  // helpString = helpString+currentRoomActions[i+1]+'\n';
  console.log(helpString);
  return [currentRoom, newRoomFlag, alive];
}

function endGame() {
  return ("Oops, you've passed on somehow (but its probably better than math class).");
}

  module.exports = {displayCurrentRoomInfo,
                    waitForUserInput,
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
                    endGame
                };
