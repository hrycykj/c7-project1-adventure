

let roomInfo=[
                { roomName: 'me',
                longDescription:    "You are tall, possibly handsome and definitely lanky.  Not sure exactly what you are but lets just say you aren't a troll or a teacher.\n" +
                                    "I think there are some things in your pockets.",
                shortDescription: 'Me!',
                useLongRoomDescription: true,
                inventory: [{inventoryName: 'coins',inventoryLongDescription: 'You seem to have a handful of coins in your pocket.  Wait, are these gold coins?  Nope, just a twoonie and a handful of loonies.',inventoryShortDescription: 'coins',inventoryQuantity: 7, useLongInventoryDescription: true},
                            {inventoryName: 'notebook',inventoryLongDescription:    "When you open the notebook up it looks like it contains some mysterious hieroglyphics.  No wait, thats just your math homework.\n" +
                                                                                    "There's a bite out of the cover from your dog.",inventoryShortDescription: 'notebook',inventoryQuantity: 1, useLongInventoryDescription: true}
                            ],
                roomActions: ['scratch', 'inspect', 'help me', 'end', 'pocket']
                },
                { roomName: 'forest',
                longDescription:    "You find yourself in a dark forest wondering why you are here right now.  You really should be in class working on your math homework.\n" +
                                    "You look around and you see a squirrel running up your leg (he must be thinking there might be nuts or pine cones in your pockets) and\n" +
                                    "lots and lots of pine cones.",
                shortDescription: 'A dark forest',
                useLongRoomDescription: true,
                adjacentRooms: [{direction: 'north' ,adjacentRoomName: 'inFrontOfAHouse'},
                                {direction: 'west' ,adjacentRoomName: 'moreForestLost'},
                                {direction: 'east', adjacentRoomName: 'moreForestLost'},
                                {direction: 'south', adjacentRoomName: 'yourClassroom'}
                                ],
                inventory: [{inventoryName: 'pine cone',inventoryLongDescription: 'There seem to be many pine cones littering the forest floor around your feet.',inventoryShortDescription: 'pine cones',inventoryQuantity: 5, useLongInventoryDescription: true},
                            {inventoryName: 'squirrel',inventoryLongDescription: 'A squirrel is foraging among the pine cones so they can hide food away for winter.',inventoryShortDescription: 'squirrel',inventoryQuantity: 0, useLongInventoryDescription: true},
                            {inventoryName: 'axe',inventoryLongDescription: "wow, this is a really mean looking axe, it really reminds me of the axe that hung above our front door in our suburban front\n" +
                            "garage house.  I think dad called it 'boyfriend slayer'!", inventoryShortDescription: 'badass axe', inventoryQuantity: -2, useLongInventoryDescription: true}
                            ],
                roomActions: ['go','move','get','pick','drop','look', 'help', 'pocket', 'inspect', 'end', 'secret']
                },
                { roomName: 'moreForestLost',
                longDescription:    "Hm, the forest seems much thicker here.  Wait a second, its much darker too.  Ok, now you've done it, your lost in the forest.\n" + 
                                    "The squirrels have followed you here even though there aren't any pine cones around, just pine needles.",
                shortDescription: 'A much darker part of the forest',
                useLongRoomDescription: true,
                adjacentRooms: [{direction: 'up' ,adjacentRoomName: 'upAPineTree'},
                                {direction: 'tree', adjacentRoomName: 'upAPineTree'}
                                ],
                inventory: [{inventoryName: 'pine needle',inventoryLongDescription: "Its pretty dark here but as you feel around at your feet you don't find any pine cones, but lots and lots of pine needles.  Ouch, they're sharp.",inventoryShortDescription: 'pine needles',inventoryQuantity: 0, useLongInventoryDescription: true},
                            {inventoryName: 'squirrel',inventoryLongDescription: "This squirrel looks almost nasty.  Hey wait, those teeth look more like wolf's teeth than squirrel teeth.",inventoryShortDescription: 'squirrel',inventoryQuantity: 0, useLongInventoryDescription: true}
                            ],
                roomActions: ['go','move','get','pick', 'drop', 'look', 'help', 'climb', 'secret']
                },
                { roomName: 'upAPineTree',
                longDescription:    "You've managed to climb up one of the pine trees.  You see above you an eagle's nest, you think you might be able to get there\n" + 
                                    "if your reach a little further but it looks kind of dodgy.  Off in the distance you see a house in a small clearing.  Hanging\n" +
                                    "off one of the branches is a golden necklace.",
                shortDescription: 'Up a pine tree',
                useLongRoomDescription: true,
                adjacentRooms: [{direction: 'down' ,adjacentRoomName: 'forest'},
                                {direction: 'up', adjacentRoomName: 'upAPineTree'}
                                ],
                inventory: [{inventoryName: 'necklace',inventoryLongDescription: "Yep, definitely a gold necklace, probably 16 inches long.",inventoryShortDescription: 'gold necklace',inventoryQuantity: 1, useLongInventoryDescription: true}
                            ],
                roomActions: ['go','move','get','pick', 'drop', 'look', 'help', 'climb', 'secret']
                },
                { roomName: 'yourClassroom',
                longDescription:    "You seem to be back in your classroom and it looks like your teacher is teaching math right now.  Uuugh, this is a fate\n" +
                                    "worse than death.  On the desk is a pencil and your most recent math test.",
                shortDescription: "death (ok math class, looks like you can't escape though)",
                useLongRoomDescription: true,
                adjacentRooms: [{direction: 'west' ,adjacentRoomName: 'yourClassroom'},
                                {direction: 'east' ,adjacentRoomName: 'yourClassroom'},
                                {direction: 'north' ,adjacentRoomName: 'yourClassroom'},
                                {direction: 'south' ,adjacentRoomName: 'yourClassroom'},
                                {direction: 'under desk', adjacentRoomName: 'forest'},
                                {direction: 'under the desk', adjacentRoomName: 'forest'}
                                ],
                inventory: [{inventoryName: 'pencil',inventoryLongDescription: "A fine HB yellow pencil with a few teeth marks",inventoryShortDescription: 'HB pencil',inventoryQuantity: 1, useLongInventoryDescription: true},
                            {inventoryName: 'test',inventoryLongDescription: "It looks like your last partial differential equations exam\n" +
                            "(when did they start teaching PDEs in Grade 3) with a large red F prominently on the front.  You turn it\n"+
                            "over and notice something scrawled on the back 'did you find the axe in the forest?  Its hidden!'  It looks like your handwriting.",inventoryShortDescription: 'PDE Math Test',inventoryQuantity: 1, useLongInventoryDescription: true}
                            ],
                roomActions: ['go','move','get','pick','drop', 'look', 'help', 'secret']
                },
                { roomName: 'inFrontOfAHouse',
                longDescription:    "You are standing in front of a large two story house with a big wrap around porch.  It looks like the main door is open (you can\n" +
                                    "see through the screen door on the porch to the inside).  It reminds you a lot of the farm house your grandma lived in on the\n" +
                                    "prairies.  There is a dog leash hanging from the railing of the front steps and there are a bunch of feathers scattered around on\n" +
                                    "the ground.  A cold breeze seems to be coming from behind the house.",
                shortDescription: 'In front of a two story house.',
                useLongRoomDescription: true,
                adjacentRooms: [{direction: 'north' ,adjacentRoomName: 'inFrontOfAHouse'},
                                {direction: 'west' ,adjacentRoomName: 'moreForestLost'},
                                {direction: 'east', adjacentRoomName: 'moreForestLost'},
                                {direction: 'south', adjacentRoomName: 'forest'}
                                ],
                inventory: [{inventoryName: 'leash',inventoryLongDescription: "The dog leash is approximately 3 feet long, has a loop for a handle and a clasp to attach to a dog's collar.",inventoryShortDescription: 'dog leash',inventoryQuantity: 1, useLongInventoryDescription: true},
                            {inventoryName: 'feather',inventoryLongDescription: 'The feathers look very black, kind of like what a crow would leave behind if they had a scuffle with a cat or a dog.',inventoryShortDescription: 'crow feathers',inventoryQuantity: 3, useLongInventoryDescription: true}
                            ],
                roomActions: ['go','move','get','pick','look', 'drop', 'help', 'secret']
                }
                ];

function findCurrentRoomIndexByName(room) {
    return roomInfo.findIndex (el=>el.roomName==room); //returns -1 if the room doesn't match any of the existing rooms
    }

function getCurrentRoomDetails (roomIndex) {
    return roomInfo[roomIndex];
}

/* const getNestedObject = (nestedObj, pathArr) => {//
    return pathArr.reduce((obj, key) =>
        (obj && obj[key] !== 'undefined') ? obj[key] : undefined, nestedObj);
}
 */
/**
 * @obj: the json object to change
 * @access: string dot separates route to value
 * @value: new valu
 */
 function setValue(obj,access,value){ // stolen off the internet, this allows me to change a nested value by supplying an array of attributes to get there
    if (typeof(access)=='string'){ 
        access = access.split('.');  // turns dot notated string into an array
    }
    if (access.length > 1){  // if access array still has more than one item it recursively calls setValue
        setValue(obj[access.shift()],access,value);
    }else{
        obj[access[0]] = value; // once you get down to the last access array item, it sets it to the value
    }
}

function unshiftValue(obj,access,objectValue) {
    if (access.length > 1){
        unshiftValue(obj[access.shift()],access,objectValue);
    } else {
        obj[access].unshift(objectValue);
    }
}

function spliceValue(obj,access,spliceArrayIndex) {
    if (access.length > 1) {
        spliceValue (obj[access.shift()],access,spliceArrayIndex);
    } else {
        obj[access].splice(spliceArrayIndex,1);
    }
}

function modifyRoomInfo (attributeToModifyArray, newValue) {
    setValue(roomInfo,attributeToModifyArray,newValue);
}

function addRoomInfo (attributeToModifyArray, newObjectValue) {
    unshiftValue (roomInfo, attributeToModifyArray, newObjectValue);
}

function removeRoomInfo (attributeToModifyArray, arrayIndexToSplice) {
    spliceValue (roomInfo, attributeToModifyArray, arrayIndexToSplice);
}


module.exports =    {roomInfo,
                    findCurrentRoomIndexByName,
                    getCurrentRoomDetails,
                    modifyRoomInfo,
                    addRoomInfo,
                    removeRoomInfo};