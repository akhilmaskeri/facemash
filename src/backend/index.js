const express = require('express')
const path = require('path')
const generateRandom = require('random-number');
const morgan = require('morgan')

var MongoClient = require('mongodb').MongoClient;
const { response } = require('express');

const DB_USERNAME = process.env.DB_USERNAME
const DB_PASSWORD = process.env.DB_PASSWORD
const DB_HOST     = process.env.DB_HOST
const DB_DATABASE = process.env.DB_DATABASE
const MINIO_ENDPOINT = process.env.MINIO_ENDPOINT
const MINIO_ACCESSKEY = process.env.MINIO_ACCESS_KEY
const MINIO_SECRETKEY = process.env.MINIO_SECRET_KEY

const PORT = process.env.PORT


console.log(MINIO_ENDPOINT, MINIO_ACCESSKEY, MINIO_SECRETKEY)
console.log(DB_HOST, DB_USERNAME, DB_PASSWORD)

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
		hits.updateOne({id:1},{
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

		let img1_url = "/facemash/" + img1.name;
		let img2_url = "/facemash/" + img2.name;

		res.json({
			left : { name: img1.name , src: img1_url },
			right: { name: img2.name , src: img2_url }
		});
		
	});

});


// calculate popularity
app.get('/hit', (req, res) => {

	update_hits();

	var A = req.query.l;
	var B = req.query.r;

	console.log(`left:${A}`, `right:${B}`)

	// f -> selected Image
	// SA ,  SB 
	var SA = (req.query.f == A ) ? 1 : 0;
	var SB = 1-SA;

	console.log(`SA:${SA} SB:${SB}`)

	faces = db.collection("faces");

	faces.findOne({name: A}, (err, left) => {
		
		console.log(left);
		var RA = left.rating; // rating of A

		faces.find({name: B}, (err, right) => {
			
			console.log(right);
			var RB =  right.rating; // rating of B
			
			console.log(`RA:${RA} RB:${RB}`)

			let EA = 1 / (1 + Math.pow(10, (RB-RA)/400));
			let EB = 1 / (1 + Math.pow(10, (RA-RB)/400));
			let _RA = RA + 24 * ( SA - EA );
			let _RB = RB + 24 * ( SB - EB );
			
			console.log("updating : ", A, ":", _RA );
			console.log("updating : ", B, ":", _RB );

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
				let img_url = "/facemash/" + img.name;
				res.json({ image : { name: img.name ,  src: img_url } })

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
		db.hits.updateOne({id:1}, {$set:{time:null, count:0}});
		res.send('ok');
	});
});

app.listen(PORT);