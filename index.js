
const express = require('express');
const app = express();
const Datastore = require('nedb');

app.listen(8080, () => console.log("app listening at port 8080"));
app.use(express.static('client'));
app.use(express.json({ limit: '1mb' }));

const database = new Datastore('bestScore.db');
database.loadDatabase();

app.post('/api', (request, response) => {
    // for testing
    console.log(request.body);
    // 
    if(database.count != 0) {
        database.remove({ bestScore: { $exists: true } }, { multi: true });
    }

    const timeStamp = Date.now();
    const data = request.body
    data.timeStamp = timeStamp;
    database.insert(data);
    response.json({
        status: 'success',
        timeStamp: timeStamp,
        bestScore: data.bestScore
    });
});