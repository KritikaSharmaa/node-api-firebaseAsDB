const functions = require("firebase-functions");
const express = require("express");
const cors=require("cors");
const app=express();

const admin=require('firebase-admin');
admin.initializeApp();

app.use(cors());

//Get all data of users
app.get('/',async(req,res)=>{
    const userData=await admin.firestore().collection("users").get();
    let tempData=[];
    userData.forEach((doc)=>{
        let id=doc.id;
        let data=doc.data();
        tempData.push({id,...data});
    })
    res.status(200).send(JSON.stringify(tempData));
})

//Get data by Id (single user)
app.get('/:id',async(req,res)=>{
    const userData=await admin.firestore().collection("users").doc(req.params.id).get();
        let id=userData.id;
        let data=userData.data();
        res.status(200).send(JSON.stringify({id,...data}));
})

//create user
app.post('/',async(req,res) => {
    const user=req.body;
    await admin.firestore().collection("users").add(user);
    res.status(201).send();
});

//Updata user By Id
app.put('/:id',async(req,res)=>{
    const upData=req.body;
    await admin.firestore().collection("users").doc(req.params.id).update({
        ...upData
    });
    res.status(200).send();
})

//Delete data by Id
app.delete('/:id',async(req,res)=>{
    await admin.firestore().collection("users").doc(req.params.id).delete();
    res.status(200).send();
})

exports.user=functions.https.onRequest(app);
