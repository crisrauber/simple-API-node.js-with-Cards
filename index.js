const express = require('express');
const database = require('./database');
require('dotenv').config()

const server = express();

server.use(express.json());

server.use((req, res, next) =>{
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next(); 
});

async function  lastId(req, res, next) {
    await database.query(`SELECT MAX(id) AS id FROM cards`, { type: database.QueryTypes.SELECT } )
    .then(results => {
        nextId = results[0].id;
    });
    next();
};

function checkCard(req, res, next){
    const {id} = req.params;
    const card = cards.find(card => card.id == id);

    if (!card){
        return res.json({error: "Card not found"});
    }
    next();
};

let nextId = 0;
let cards = [];

//ROUTES
server.get("/",(req, res) => {
  return  res.json({result: "simple-API-NODE.JS-WITH-CARDS"});
});

server.get("/cards", async (req, res) =>{
   await database.query(`SELECT * FROM cards`, { type: database.QueryTypes.SELECT })
    .then(results => {
        cards = results;
    });
    return res.json(cards);
});

server.get("/cards/:id", async (req, res) =>{
    const {id} = req.params;
    await database.query(`SELECT * FROM cards WHERE id = ${id}`, { type: database.QueryTypes.SELECT })
     .then(results => {
         cards = results;
     });
     return res.json(cards);
 });
 

server.post("/cards", lastId, (req, res) =>{
    nextId ++
    const {title, content} = req.body;
    const card = {
        id: nextId,
        title,
        content
    };

    database.query(`INSERT INTO cards VALUES (${nextId},'${title}','${content}');`, 
        { type: database.QueryTypes.INSERT } )
    .then(results => {
    });

    cards.push(card);

    return res.json(card);
});

server.put("/cards/:id", checkCard, (req, res) =>{
    const {id} = req.params;
    const {title, content} = req.body;

    if(title && content){
        database.query(`UPDATE cards SET title='${title}', content='${content}' WHERE id=${id};`, 
        { type: database.QueryTypes.UPDATE } )
        .then(results => {
    });
    }

    return res.json(card);
});

server.delete("/cards/:id", checkCard, (req, res) =>{
    const {id} = req.params;

    database.query(`DELETE FROM cards WHERE id = ${id};`, 
        { type: database.QueryTypes.INSERT } )
    .then(results => {
        console.log(results)
    });

    res.json(cards);
});

server.listen(process.env.PORT);
