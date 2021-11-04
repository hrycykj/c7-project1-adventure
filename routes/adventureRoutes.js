currentGameName = {gameName: 'Adventure1.0Game'+Math.floor(Math.random() * 100)};
const adventureFunctions = require('../model/adventureFunctions');

const express = require('express')
const router = express.Router()

router.get('/gameHelp', async (req, res) => {
    res.send(await adventureFunctions.gameHelp());
})

router.get('/startGame', async (req, res) => {
    currentRoom='forest';
    isMeAlive=true;
    whileRoomIsNew=true;
    currentGameName.gameName=(req.query.gameName||currentGameName.gameName);

    await adventureFunctions.initializeNewGameDb (currentGameName.gameName);
    res.send (await adventureFunctions.displayCurrentRoomInfo(currentRoom)+'\n'+`your game name is ${currentGameName.gameName}`);
    whileRoomIsNew=false;
})

router.get('/waitForUserInput', async (req, res) => {
    if (isMeAlive) {
        let userInput = (req.query.inputAction||'');
        let outputToScreen = `Hey there, this is what you typed: ${userInput}\n`;
        // res.send(outputToScreen+'\n');
        let returnedOutputString='';
        let newRoomStringOutput='';
        [currentRoom, whileRoomIsNew, isMeAlive, returnedOutputString] = await adventureFunctions.parseAndExecuteActionPhrase(userInput,currentRoom,whileRoomIsNew);
        if (!isMeAlive) {
            res.send(outputToScreen+returnedOutputString+'\n'+adventureFunctions.endGame());
            return;
        } else {
            if (whileRoomIsNew) {
                newRoomStringOutput = await adventureFunctions.displayCurrentRoomInfo(currentRoom)+'\n';
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

router.get('/endGame', (req, res) => {
    res.send (adventureFunctions.endGame()+'\n');
    isMeAlive = false;
    
})

router.get('/', (req, res) => {
    let instructions = 
`Welcome to Adventure (the Game).
    The goal of this game is to find the entrance to the underground collosal cave.
    In this game you can type in verbs and nouns to do things.  
    If you need some help, try using /gameHelp.
    Use /startGame?gameName="name to save your game" to initialize the data for the game (note if this game name exists it will crash the database).
    Use /waitForUserInput?inputAction=verbs+nouns to enter your commands (use + instead of spaces).
    Use /endGame to stop the game.\n`
    res.send(instructions)
})


module.exports = router