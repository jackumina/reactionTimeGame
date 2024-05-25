// const fileSystem = require('fs');
// import * as fs from 'fs';
// console.log("choo choo!")
// "type": "module",

const express = require('express');
const app = express();
app.listen(8080, () => console.log("app listening at port 8080"));
app.use(express.static('client'));
app.use(express.json({ limit: '1mb' }));

app.post('/api', (request, response) => {
    console.log(request.body);
    const data = request.body
    response.json({
        status: 'success',
        bestScore: data.bestScore
    });
    // response.send():
});