const express = require('express');
const {MongoClient, ObjectId} = require('mongodb');


const app = express();
const port = 8000;

app.use(express.json())
app.use(express.static('public'));

async function getDbCollectoin(dbAddress, dbName, dbCollectionName){
	const client = new MongoClient(dbAddress);
	await client.connect();
	const db = client.db(dbName);
	return db.collection(dbCollectionName);
}

app.get('/zakaz', async function(req, res){
	const collection = await getDbCollectoin('mongodb://127.0.0.1','todo', 'zakaz');
	const data = await collection.find({}).toArray();
	res.send(data);
});

app.get('/zakaz/:id', async function(req, res){
	const collection = await getDbCollectoin('mongodb://127.0.0.1','todo', 'zakaz');
	const data = await collection.findOne({_id: new ObjectId(req.params.id)});
	res.send(data);
});

app.post('/zakaz', async function(req, res){
	const task={...req.body, done: false}
	const collection = await getDbCollectoin('mongodb://127.0.0.1','todo', 'zakaz');
	await collection.insertOne(task);
	res.send(task);
});

app.patch('/zakaz/:id', async function(req, res){
	const collection = await getDbCollectoin('mongodb://127.0.0.1','todo', 'zakaz');
	const data = await collection.updateOne({_id: new ObjectId(req.params.id)}, {'$set': req.body});
	res.send({});
});

app.delete('/zakaz/:id', async function(req, res){
	const collection = await getDbCollectoin('mongodb://127.0.0.1','todo', 'zakaz');
	await collection.deleteOne({_id: new ObjectId(req.params.id)});
	res.send({});
});

app.listen(port, function() {
	console.log('Server is started!');
});
