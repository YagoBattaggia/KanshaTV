
const express = require('express');

const app = express();
const axios = require('axios');



app.use(express.static(__dirname + '/public'));
app.use(express.json());

app.listen(3005 , () => console.log(`Cliente. Listening on port 3005`));


app.put('/', (req, res) => {
    res.sendFile('./index.html')
})
