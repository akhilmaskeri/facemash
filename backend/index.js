const express = require('express')
const path = require('path')
const generateRandom = require('random-number');
const morgan = require('morgan')

var MongoClient = require('mongodb').MongoClient;

const DB_USERNAME = process.env.DB_USERNAME
const DB_PASSWORD = process.env.DB_PASSWORD
const DB_HOST     = process.env.DB_HOST
const DB_DATABASE = process.env.DB_DATABASE

const PORT = process.env.PORT

var app = express()
app.use(morgan('tiny'));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'src/public')));

var url = `mongodb://${DB_USERNAME}:${DB_PASSWORD}@${DB_HOST}/${DB_DATABASE}`
var db = null


// connect to mongodb 
MongoClient.connect(url, {useNewUrlParser: true, useUnifiedTopology: true}, (err, client) => {

	if(err) throw err;

	db = client.db(DB_DATABASE);

	if(db){ 
		console.log("****** connected to DB ******");	
	}
	else{
		console.log("****** unable to connect to db ******");
		console.log(err);
	}
});


// updates hits count
function update_hits() {
	
	var hits = db.collection('hits')
	var row = hits.find({id:1});
	
	row.toArray().then((r)=>{
		// update 
		let totalCount = (r[0].count) ? r[0].count+1 : 1;
		hits.update({id:1},{
			$set:{
				time : Date.now(),
				count : totalCount}
			}
		);
	});
}


// first request that sends 2 images
app.get('/init', (req, res)=>{

	update_hits();

	var faces = db.collection('faces').find();

	faces.toArray().then((f)=>{

		let options = {
			min: 0,
			max: f.length-1,
			integer: true
		}

		let r1 = generateRandom(options);
		let r2 = generateRandom(options);

		while(r1 == r2 ) r2 = generateRandom(options); // so both are not same

		var img1 = f[r1];
		var img2 = f[r2];

		res.json({
			left : { name: img1.name , src: "/imgs/"+img1.name+".jpg" },
			right: { name: img2.name , src: "/imgs/"+img2.name+".jpg" }
		});
	});

});


// calculate popularity
app.get('/hit', (req, res) => {

	update_hits();

	let A = req.query.l;
	let B = req.query.r;

	console.log(`left:${A}`, `right:${B}`)

	// f -> selected Image
	// SA ,  SB 
	let SA = (req.query.f == A ) ? 1: 0;
	let SB = 1-SA;

	let RA = 0;
	let RB = 0;

	faces = db.collection("faces");

	faces.findOne({name: A}, (err, left) => {
		
		RA = left.rating; // rating of A

		faces.find({name: B}, (err, right) => {
			
			RB =  right.rating; // rating of B
			
			EA = 1 / (1 + Math.pow(10, (RB-RA)/400));
			EB = 1 / (1 + Math.pow(10, (RA-RB)/400));

			_RA = RA + 24 * ( SA - EA );
			_RB = RB + 24 * ( SB - EB );
			
			faces.updateOne({name:A}, {$set:{rating:_RA} });
			faces.updateOne({name:B}, {$set:{rating:_RB} });

			faces.find().toArray().then((f) => {

				let options = {
					min:0, 
					max:f.length-1,
					integer:true
				}

				let r = generateRandom(options);
			
				while(f[r].name == req.query.l || f[r].name == req.query.r){
					r = generateRandom(options);	
				}

				let img = f[r];
				res.json({ image : { name: img.name ,  src: `/imgs/${img.name}.jpg` } })
			})

		});

	});

});


// get the rankings
app.get('/ranking', function(req, res){

	var ordered = {};

	var faces = db.collection('faces').find();
	faces.toArray().then(function(result){

		result.sort(function(a, b){
			return parseFloat(b.rating) - parseFloat(a.rating);
		});
		
		let arr = [];
		result.forEach((e)=>{arr.push(e)});
		res.json({rank:arr});

	});

});


// get total requests
app.get('/counts', (req, res)=>{
	var hits = db.collection('hits').find()
	hits.toArray().then((err, data)=>{
		res.json(data);
	});
});


// reset hit count to 0
app.get('/resetCounts', (req, res)=>{
	var hits = db.collection('hits').find({id:1});
	hits.then((err, r)=>{
		db.hits.update({id:1}, {$set:{time:null, count:0}});
		res.send('ok');
	});
});

app.listen(PORT);