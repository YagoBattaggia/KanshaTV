const express = require('express');
const app = express();
const axios = require('axios');



app.use(express.static(__dirname + '/public'));
app.use(express.json());

app.listen(3003 , () => console.log(`Barramento de Eventos. Listening on port 3003`));

const eventos = []

app.put('/eventos', (req, res) => {
    const evento = req.body;

    eventos.push(evento);
    // Animes
    axios.put('http://localhost:3000/eventos', evento);
    // Filmes
    axios.put('http://localhost:3001/eventos', evento);
    // Sugestoes
    axios.put('http://localhost:3002/eventos', evento);

    res.status(200).send({ msg: "ok" });

})

app.get('/eventos', (req, res) => {
    res.send(eventos)
})