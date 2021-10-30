const adventureFunctions = require('../model/adventureFunctions');

const express = require('express')
const router = express.Router()

router.get('/gameHelp', (req, res) => {
    res.send(adventureFunctions.gameHelp());
})

router.get('/startGame', (req, res) => {
    currentRoom='forest';
    isMeAlive=true;
    whileRoomIsNew=true;

    res.send (adventureFunctions.displayCurrentRoomInfo(currentRoom)+'\n');
    whileRoomIsNew=false;
})

router.get('/waitForUserInput', (req, res) => {
    if (isMeAlive) {
        let userInput = req.query.inputAction;
        let outputToScreen = `Hey there, this is what you typed: ${userInput}\n`;
        // res.send(outputToScreen+'\n');
        let returnedOutputString='';
        let newRoomStringOutput='';
        [currentRoom, whileRoomIsNew, isMeAlive, returnedOutputString] = adventureFunctions.parseAndExecuteActionPhrase(userInput,currentRoom,whileRoomIsNew);
        if (!isMeAlive) {
            res.send(outputToScreen+returnedOutputString+'\n'+adventureFunctions.endGame());
            return;
        } else {
            if (whileRoomIsNew) {
                newRoomStringOutput = adventureFunctions.displayCurrentRoomInfo(currentRoom)+'\n';
                whileRoomIsNew=false;
            }
            res.send(outputToScreen+returnedOutputString+'\n'+newRoomStringOutput);
        }
        return;
    } else {
        res.send('Hm, looks like you are already dead, not sure how that happened.\n');
        return;
    }
})

/*router.get('/look', (req, res) => {
    let seekerLocation = hideAndSeek.look()
    let message = 'You are in the ' + seekerLocation.name + '\n'
    message += 'Obvious hiding places are:\n'
    seekerLocation.hidingSpots.forEach((hidingSpot) => {
        message += '  ' + hidingSpot + '\n'
    })
    res.send(message)
})*/

/*router.get('/search', (req, res) => {
    let message
    let spot = req.query.spot  
    let found = hideAndSeek.search(spot)
    if (found) {
        message = 'You just found the hider!'
    }
    else {
       message = 'You search ' + spot + ' and find no-one!'
    }
    res.send(message + '\n')
})*/

router.get('/endGame', (req, res) => {
    res.send (adventureFunctions.endGame()+'\n');
    isMeAlive = false;
    
})

router.get('/', (req, res) => {
    let instructions = 
`Welcome to Adventure (the Game).
    In this game you can type in verbs and nouns to do things.  
    If you need some help, try using /gameHelp.
    Use /startGame to initialize the data for the game.
    Use /waitForUserInput?inputAction=verbs+nouns to enter your commands (use + instead of spaces).
    Use /endGame to stop the game.\n`
    res.send(instructions)
})


module.exports = router