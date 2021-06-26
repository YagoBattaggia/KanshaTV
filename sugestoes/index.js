// O ALGORITMO DE SUGESTÕES NÃO FOI DESENVOLVIDO, VISTO QUE É ALGO BEM COMPLEXO E NÃO TEMOS APIs BOAS.

const express = require('express');
const app = express();
var cors = require('cors');
const axios = require('axios');


app.use(cors());
app.use(express.static(__dirname + '/public'));
app.use(express.json());

animesAssistidos = []
filmesAssistidos = []

app.listen(3002 , async () => {
    console.log(`Sugestões. Listening on port 3002`);
    console.log("Atualizando dados perdidos com o barramento de eventos...");
    axios.put('http://localhost:3003/eventos', {"eventName": "sugestoesOnline", "data":""}).catch(e => console.log(e));
    
})

// Recebendo dados do barramento de eventos
app.put('/eventos', (req, res) => {
    console.log(req.body)
    if(req.body.eventName == 'animeAssistido'){
        animesAssistidos.push(req.body.data)
    } else if (req.body.eventName == 'filmeAssistido'){
        filmesAssistidos.push(req.body.data)
    } else if (req.body.eventName == 'dbAnime'){
        animesAssistidos = req.body.data
    } else if (req.body.eventName == 'dbFilmes'){
        filmesAssistidos = req.body.data
    }
    res.status(200).send({ msg: "ok" });
})

// Endpoint para envio de sugestões com base em animes assistidos
app.get('/animesSugestoes', async (req, res) => {
    responseSuggestionsAnimes = []
    if(animesAssistidos.length > 0){

        // Determinando index para pegar apenas alguns animes
        if(animesAssistidos.length - 1 < 4){
            var y = animesAssistidos.length - 1;
            var y2 = 0;
        } else {
            var y = animesAssistidos.length - 1
            var y2 = (animesAssistidos.length - 4)
        }

        // Iterando em cada anime para pegar os recomendados da api
        for(y; y >= y2; y--){
            await axios.get(`https://api.jikan.moe/v3/anime/${animesAssistidos[y].info.mal_id}/recommendations`).then( (response) => {
                response = response.data
                // Armazenando apenas 4 recomendados
                for (var i = 0; i < 4; i++){
                    responseSuggestionsAnimes.push(response.recommendations[i]);
                }
            })
        }
        res.send(responseSuggestionsAnimes)
    } else {
        // Caso não tenha nenhum anime registrado como assistido
        await axios.get(`https://api.jikan.moe/v3/anime/1/recommendations`).then( (response) => {
                response = response.data
                // Armazenando apenas 4 recomendados
                for (var i = 0; i < 15; i++){
                    responseSuggestionsAnimes.push(response.recommendations[i]);
                }
        })
        res.send(responseSuggestionsAnimes)
    }
})

// Endpoint para envio de sugestões com base em filmes assistidos
app.get('/filmesSugestoes', async (req, res) => {
    res.send(filmesAssistidos)
})


