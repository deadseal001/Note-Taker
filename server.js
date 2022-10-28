const fs=require('fs');
const express=require('express');
const path=require('path');
const app=express();
const PORT=process.env.PORT || 3001;
const daba=require('./db/db.json');

function addNote(db,path,note) {
    let highestID=0
    if(db.length >0){
        for (let i=0; i<daba.length; i++){
            if(db[i].id>highestID){
                highestID=db[i].id;
            }
        }
    }
    highestID++;
    note.id=highestID;
    db.push(note);
    fs.writeFile(path,JSON.stringify(db,null,2),(err)=>{
        if (err){
            console.log(err);
            return;
        }
        return;
    });
}

app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(express.static('public'));


app.get('/',(req,res)=>res.sendFile(path.join(__dirname,'/public/index.html')));
app.get('/notes',(req,res)=>{
    res.sendFile(path.join(__dirname,'/public/notes.html'));
})
app.get('/api/notes',(req,res)=>{
    res.json(daba);
});

app.post('/api/notes',(req,res)=>{
    const jsonPath=path.join(__dirname,"/db/db.json");
    const newNote=req.body;
    addNote(daba,jsonPath,newNote);
    res.json({message: 'note saved'});
});

app.delete("/api/notes/:id", (req,res)=>{
    const jsonPath = path.join(__dirname, "/db/db.json");
    let delID=daba.findIndex(e=>e.id==req.params.id);
    daba.splice(delID,1);
    fs.writeFile(jsonPath,JSON.stringify(daba,null,2),(err)=>{
        if(err){
            console.log(err);
            return;
        } else {
            console.log("Selected note deleted.");
            res.json({message:'note deleted'});
        }
    });
});

app.listen(PORT, function () {
    console.log("App listening on PORT " + PORT);
});
