// imports
const express = require('express');
const app = express();
const Datastore = require('nedb');

// setting up app
app.listen(8080, () => console.log("app listening at port 8080"));
app.use(express.static('client'));
app.use(express.json({ limit: '1mb' }));

// sets up and loads database
const database = new Datastore('bestScore.db');
database.loadDatabase();

// 
// http get method
// 
app.get('/api', (request, response) => {
    // find all data in db (in this case, only one item in db)
    // take that json string as data and send it as json string response to client console
    database.find({}, (err, data) => {
        if(err) {
            response.json({ error: err });
            response.end();
            return;
        }
        response.json({ message: 'item got', item: data });
    });
});

// 
// http post method
// 
app.post('/api', (request, response) => {
    // for testing (will show request body in terminal)
    console.log(request.body);
    //

    // gets request body, adds a timestamp
    // adds data to db and sends it as json string response to the client console
    const data = request.body
    const timeStamp = Date.now();
    data.timeStamp = timeStamp;
    database.insert(data);
    response.json({ message: 'item posted', item: data });
});

// 
// http put method
// 
app.put('/api', (request, response) => {
    // const { _id, bestScore, timeStamp } = request.body;
    const data = request.body
    const timeStamp = Date.now();
    data.timeStamp = timeStamp;

    database.update({}, { $set: { bestScore: data.bestScore, timeStamp: data.timeStamp } }, { multi: true }, (err, numReplaced) => {
        if(err) {
            return response.status(500).json({ message: 'Database error', error: err });
        }
        response.json({ message: numReplaced + ' item put', item: data });
    });
});

// 
// http delete method
// 
app.delete('/api', (request, response) => {
    // remove all data from db
    // send it as json string as response client console
    database.remove({}, { multi: true }, (err, numRemoved) => {
        if (err) {
            response.json({ error: 'Error deleting items:', err });
        } else {
            response.json({ message: `Successfully deleted ${numRemoved} items.` });
        }
    });
});