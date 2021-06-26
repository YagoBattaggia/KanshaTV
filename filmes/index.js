
const express = require('express');
const app = express();
const axios = require('axios');
const cors = require('cors');

// NEDB
const Datastore = require('nedb');
let database = {};
database.filmes = new Datastore({ filename: './db/filmes' });
database.filmes.loadDatabase();


app.use(cors());
app.use(express.static(__dirname + '/public'));
app.use(express.json());

app.listen(3001 , () => console.log(`Filmes. Listening on port 3001`));

// Endpoint para receber os eventos do barramento de eventos
app.put('/eventos', (req, res) => {
    console.log(req.body)
    if(req.body.eventName == 'sugestoesOnline'){
        database.filmes.find({}, (err, moviesList) => {
            if (err) {
                return console.log(err)
            }
            axios.put('http://localhost:3003/eventos', {"eventName": "dbFilmes", "data": moviesList}).catch(e => console.log(e))
        });
    }
    res.status(200).send({ msg: "ok" });
})

// Endpoint para adicionar um novo filme na lista de assistidos
app.put('/filmes/:nome', async (req, res) => {
    // A API precisa que os espaços sejam transformados em _
    var nome = req.params.nome.replace(" ", "_")
    // Solicitando dados da api, com o endpoint: /primeiraLetra/NomeDoFilme.json
    await axios.get(`https://v2.sg.media-imdb.com/suggestion/${nome[0].toLowerCase()}/${nome}.json`).then((response) => {
        // Adicionando resposta ao banco de dados
        database.filmes.insert(response.data.d[0] , (err, newMovie) => {
            if (err) {
                console.log(err)
                return res.sendStatus(500);
            }
            // Enviando dados para o barramento de eventos fazer o broadcast
            axios.put('http://localhost:3003/eventos', {"eventName": "filmeAssistido", "data":newMovie}).catch(e => console.log(e))
            return res.status(200).json(newMovie);
        });
    }).catch((e) => console.log(e))

})

// Endpoint para retornar lista de todos os filmes assistidos
app.get('/filmes', (req, res) => {
    database.filmes.find({}, (err, moviesList) => {
        if (err) {
            console.log(err)
            return res.sendStatus(500);
        }
        return res.send(moviesList);
    });
})
