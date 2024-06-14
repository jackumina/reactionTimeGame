const express = require('express');
const Datastore = require('nedb');

const app = express();
const port = 8080;
app.listen(port, () => console.log(`app listening at port ${port}`));

const database = new Datastore('database.db');
database.loadDatabase();

// get data when loading or updating page
app.get('/api', (req, res) => {
    database.find({}, (err, data) => {
        if(err){
            res.end();
            console.log(err);
            return;
        }
        res.json(data);
        console.log(data);
    });
});

// creating data after a reset
app.post('/api', (req, res) => {
    const data = req.body;
    const timestamp = Date.now();
    data.timestamp = timestamp;
    database.insert(data);
    res.json(data);
});

// updating data after a new high score
app.put('/api', (req, res) => {
    const data = req.body;
    const timestamp = Date.now();
    data.timestamp = timestamp;

    database.update({}, { $set: {bestScore: data.bestScore, timeStamp: data.timeStamp} }, { multi: true }, (err, numReplaced) => {
        if(err) {
            return res.status(500).json({ message: 'Database error', error: err });
        }
        res.json({ message: numReplaced + ' item put', item: data });
    });
});

// deleting data after a reset
app.delete('/api', (req, res) => {
    database.remove({}, { multi: true }, (err, numDeleted) => {
        if(err){
            return res.status(500).json({ message: 'Database error', error: err });
        }
        res.json({ message: `Successfully deleted ${numDeleted} items.` });
    });
});