
// Original Array - structure is an array of rooms with an array of inventory items, which are each objects
// Goal is to add inventory item 'pine cone' to room 0 and decouple inventory quantities between room 0 and room 1
let roomInfo = [{room:  'zero',
                inventory: [{inventoryName: 'coins', inventoryQuantity: 7},
                            {inventoryName: 'notebook',inventoryQuantity: 1}
                ]},
                {room: 'one',
                inventory: [{inventoryName: 'pine cone',inventoryQuantity: 5},
                            {inventoryName: 'squirrel',inventoryQuantity: 0},
                            {inventoryName: 'axe',inventoryQuantity: -1}
]}];

// Cloning Array to try to decouple inventory link between room 0 and room 1 with same items after pine cones are added to room 0
let dataToClone = [];
dataToClone.unshift(roomInfo[1].inventory[0]);
console.log('data to clone', dataToClone);
let clone = dataToClone.map(a => {return {...a}})
clone[0].inventoryQuantity = 1; // set room 0 inventory to 1
roomInfo[0].inventory.unshift(clone[0]);


roomInfo[1].inventory[0].inventoryQuantity --; // reduce room 1 inventory to account for inventory added to room 0


console.log('Room 1', roomInfo[1].inventory)
console.log('Room 0', roomInfo[0].inventory)

roomInfo[0].inventory[0].inventoryQuantity++; // now increase room 0 inventory to see if it impacts room 1
console.log('Room 1', roomInfo[1].inventory[0])
console.log('Room 0', roomInfo[0].inventory[0])

roomInfo[0].inventory[0].inventoryQuantity++; // now increase room 0 inventory to see if it impacts room 1
console.log('Room 1', roomInfo[1].inventory[0])
console.log('Room 0', roomInfo[0].inventory[0])