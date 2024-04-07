const mongoose = require('mongoose')
const express = require('express')
const path=require('path')
const {listen} = require("express/lib/application");
const port= 3000


const app=express()

app.use(express.json())

app.use(express.static(__dirname))
app.use(express.urlencoded({encoded:false}))

mongoose.connect("mongodb://localhost:27017/ParkHere_Parking_Space_Data")
.then(()=>{
        console.log("Database connection successfull")
})
.catch(()=>{
        console.log("Database not connected")
})

const schema = new mongoose.Schema({
    username:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    }
})

const collection = new mongoose.model('users',schema )

app.get('/',(req,res)=>{
    res.sendFile(path.join(__dirname,'index.html'))
})


app.post('/post', async (req,res) => {
    const user = new collection({
        username:req.body.username,
        password:req.body.password
    });
    const existingUser = await collection.findOne({ username: user.username });
    const existingPass = await collection.findOne({ password: user.password });
    if (existingUser && existingPass) {
        res.redirect("./api/Main_Screen.html")
        // res.send('User already exists. Please choose a different username.');
    }
    else{
        res.send('Not a verified parking assistant')

        // await user.save();
        // console.log(user);
        // res.send("Form Submitted");
    }

});

app.listen(port,()=>{
    console.log("Server Started")
})

