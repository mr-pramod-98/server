require('dotenv').config()

const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Users = require('../models/Users');


function authenticateToken(req, res, next) {
    const authHeder = req.headers.authorization;
    const token = authHeder && authHeder.split(' ')[1];

    if(token == null) return res.status(401).json({ msg: "no access"});

    jwt.verify(token, process.env.ACCESS_TOKEN_SCERET, (err, user) => {
        if(err) return res.status(403).json({ msg: "token expired" });

        req.user = user;
        next()
    });
}


router.get('/', (req, res) => {
    Users.find({}, (err, users) => {
        res.send(users);
    })
});
  
// Route for login
router.post('/', async (req, res) => {
    const currentUser = {
        username: req.body.username,
        password: req.body.password
    };
  
    try{
        const user = await Users.findOne(currentUser).exec();
    
        if(user){
            res.status(200).json({ msg: "user logged in successfully", user });
        }else{
            res.status(400).json({ msg: "user does not exist"});
        }

    }catch(err){
        console.log(`error: ${err}`)
        res.status(500).json({ msg: "server error" });
    }
});
  
// Route for sign-up
router.post('/sign-up', async (req, res) => {
    const newUser = {
        username: req.body.username,
        email: req.body.email,
        password: req.body.password
    };

    try{
        const user = await Users.findOne({ username: newUser.username }).exec();

        if(user){
            console.log("user exist")
            res.status(400).json({ msg: "user already exist"});
        }else{
            const user = new Users(newUser);
            await user.save();
            console.log("user created")
            res.json(newUser);
        }

    }catch(err){
        console.log("error", err)
        res.status(500).json({ msg: "server error" });
    }

});

  
// Route to delete user
router.delete('/:username/delete', (req, res) => {

    const username = req.params.username;
    Users.findOneAndDelete({ username }, (err, user) => {
        if(err){
            res.status(500).json({ msg: "server error", err });
        }else if(!user){
            res.status(400).json({ msg: "user does not exist"});
        }else{
            res.status(200).json({msg: "user deleted", user});
        }
    });
  
});


module.exports = router;



/*

router.post('/sign-up', (req, res) => {
    const newUser = {
        username: req.body.username,
        email: req.body.email,
        password: req.body.password
    };

    const userExist = users.filter(user => user.username === newUser.username).length !== 0;
    if(userExist){
        res.status(400).json({ msg: "user already exist"});
    }else{
        users.push(newUser);

        // create access-token
        
        const token = jwt.sign(newUser, process.env.ACCESS_TOKEN_SCERET)
        res.status(200).json({ msg: "user created", accessToken: token});
    }
  
});

*/