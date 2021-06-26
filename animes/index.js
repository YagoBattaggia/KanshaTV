const express = require('express');
const app = express();
const axios = require('axios');
var cors = require('cors')


// NEDB
const Datastore = require('nedb');
let database = {};
database.animes = new Datastore({ filename: './db/animes' });
database.animes.loadDatabase();

app.use(cors());
app.use(express.static(__dirname + '/public'));
app.use(express.json());

app.listen(3000 , async () => console.log(`Animes. Listening on port 3000`));

animesAssistidos = []



app.put('/animes', async (req, res) => {
    var apiData;

    await axios.get('https://api.jikan.moe/v3/search/anime?q=' + req.body.nome).then(a =>{
        apiData = a.data.results[0]
    })

    database.animes.insert({"nome":req.body.nome, "info":apiData} , (err, newAnime) => {
        if (err) {
            console.log(err)
            return res.sendStatus(500);
        }
        // Enviando dados para o barramento de eventos fazer o broadcast
        axios.put('http://localhost:3003/eventos', {"eventName": "animeAssistido", "data":{"nome":req.body.nome, "info":apiData}}).catch(e => console.log(e))
        return res.status(200).json(newAnime);
    });
})

app.get('/animes', (req, res) => {
    database.animes.find({}, (err, animesList) => {
        if (err) {
            console.log(err)
            return res.sendStatus(500);
        }
        return res.send(animesList);
    });
})

app.put('/eventos', (req, res) => {
    console.log(req.body)
    if(req.body.eventName == 'sugestoesOnline'){
        database.animes.find({}, (err, animesList) => {
            if (err) {
                return console.log(err)
            }
            axios.put('http://localhost:3003/eventos', {"eventName": "dbAnime", "data": animesList}).catch(e => console.log(e))
        });
    }
    res.status(200).send({ msg: "ok" });
})