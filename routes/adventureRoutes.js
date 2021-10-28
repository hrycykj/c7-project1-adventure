const adventureFunctions = require('../model/adventureFunctions');

const express = require('express')
const router = express.Router()

/*router.get('/startGame', (req, res) => {
    mainGame()
    res.send('this is the end, my friend.')
})*/

/* router.get('/help', async (req, res) => {
    res.json(adventureFunctions.help())
})*/

/*router.get('/move', async (req, res) => {
    let room = req.query.room 
    hideAndSeek.move(room)
    res.send('You have moved to the ' + room + '\n')
})*/

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

router.get('/startGame', (req, res) => {
    let currentRoom='forest';
    let isMeAlive=true;
    let whileRoomIsNew=true;

    res.send (adventureFunctions.displayCurrentRoomInfo(currentRoom)+'\n');
    whileRoomIsNew=false;
    
})

router.get('/endGame', (req, res) => {
    res.send (adventureFunctions.endGame()+'\n');
    isMeAlive = false;
    
})

router.get('/', (req, res) => {
    let instructions = 
`Welcome to Adventure (the Game).
    In this game you can type in verbs and nouns to do things.  If you need some help, try using /help`
    res.send(instructions)
})


module.exports = router