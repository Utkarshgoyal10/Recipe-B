const router = require("express").Router();
const jwt = require('jsonwebtoken');
const User = require('../models/modal.js').user;
// const helpers = require('../Helpers/helpers.js');
const bcrypt = require("bcrypt");
const middleware = require('../Helpers/auth_middleware.js').session;
// TO SIGNUP USER
router.post('/register', async (request, response) => {
    // console.log(request.body);
    const {userName, email, password, gender, DOB, createdAt} = request.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    try {

        let user1 =await  User.findOne({email});
        let user2 =await  User.findOne({userName});
    // console.log(user);
        if(user1){
            return response.status(400).json({ errors: 'the user with this email already exist'});
    }
    if(user2){
        return response.status(400).json({ errors: 'the user with this username already exist'});
}
        const profile = User.create({
            userName: userName,
            email:email,
            password: hashedPassword,
            gender:gender,
            DOB:DOB,
            createdAt:createdAt,
        });
        response.send({userRegistered:"User registered successfully"});
    } catch (error) {
        console.log(error.message);
        res.status(500).send("Some error occured");
    }
    
})


router.post('/login', async (req, res) => {
    const {userName, email, password} = req.body;
  
  try {
    let user1 =await  User.findOne({email});
    let user2 =await  User.findOne({userName});
    let user=user1?user1:user2
    if(!user){
      return res.status(400).json({ errors: 'sorry the user does not exixt'});
    }
    const passwordComp =await  bcrypt.compare(password,user.password);
    if(!passwordComp){
      return res.status(400).json({ errors: 'Please try to login with correct credentials'});
    }
    const data = {
        username: user.userName
    }
    const jwtToken= jwt.sign(data, "reciperover69420");
    // res.json({authtoken})
    console.log(jwtToken)
    res.status(200);
    res.send({jwtToken});
      
    
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Some internal error occured");
  }
});

module.exports = router;
