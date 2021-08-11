const express = require('express')
const bodyParser = require('body-parser')
const path = require('path')
const generateRandom = require('random-number');
const morgan = require('morgan')

var MongoClient = require('mongodb').MongoClient;

const DB_USERNAME = process.env.DB_USERNAME
const DB_PASSWORD = process.env.DB_PASSWORD
const DB_HOST     = process.env.DB_HOST
const DB_DATABASE = process.env.DB_DATABASE

const PORT = process.env.PORT

var url = `mongodb://${DB_USERNAME}:${DB_PASSWORD}@${DB_HOST}/${DB_DATABASE}`
var db = null

MongoClient.connect(url, {useNewUrlParser: true, useUnifiedTopology: true}, (err, mongodb_obj) => {

	if(err) throw err;

	db = mongodb_obj.db(DB_DATABASE);

	if(db){ 
		console.log("**** connected to DB ******");	
	}
	else{
		console.log("**** unable to connect to db ****");
		console.log(err);
	}

});

var app = express()

app.use(morgan('tiny'))
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));
app.use(express.static(path.join(__dirname, 'src/public')));

app.get('/init', (req, res)=>{

	console.log("hits", db);

	var row = db.collection('hits').find({id:1});
	
	row.toArray().then((r)=>{
		let totalCount = (r[0].count) ? r[0].count+1 : 1;
		db.collection('hits').update({id:1},{$set:{time:Date.now(),count:totalCount}});

		console.log('***** hits updated *******')

	});

	var faces = db.collection('faces').find();

	faces.toArray().then((f)=>{

		console.log(f);

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

	var row = db.collection('hits').find({id:1});
	
	row.toArray().then((r) => {
		let totalCount = (r[0].count) ? r[0].count+1 : 1;
		db.collection('hits').update({id:1},{$set:{time:Date.now(),count:totalCount}});
		console.log('***** hits updated *******')
	});

	let A = req.query.l;
	let B = req.query.r;

	console.log(A)
	console.log(B)

	let SA = (req.query.f == A )?1:0;  // f : finalImage
	let SB = 1-SA;                     // SA ,  SB 

	let RA = 0, RB = 0;

	db.collection('faces').findOne({name:A}, function(err, leftResult){

		RA = leftResult.rating;

		db.collection('faces').findOne({name:B}, function(err, rightResult){

			RB = rightResult.rating;

			EA = 1 / (1 + Math.pow(10, (RB-RA)/400));
			EB = 1 / (1 + Math.pow(10, (RA-RB)/400));

			_RA = RA + 24 * ( SA - EA );
			_RB = RB + 24 * ( SB - EB );

			db.collection('faces').update({name:A}, {$set:{rating:_RA} });
			db.collection('faces').update({name:B}, {$set:{rating:_RB} });

			var faces = db.collection('faces').find();

			faces.toArray().then((f)=>{
				let options = {
					min:0, 
					max:f.length-1,
					integer:true
				}

				console.log(options);

				r1 = generateRandom(options);
			
				while(f[r1].name == req.query.f){
					r1 = generateRandom(options);	
				}

				let img = f[r1];
				res.json({ image : { name: img.name ,  src: "/imgs/"+img.name+".jpg" } })
			});

		});

	});
});

// get the rankings
app.get('/ranking', function(req, res){
	
	console.log("hits", db);

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
})

// rest hit count to 0
app.get('/resetCounts', (req, res)=>{
	var hits = db.collection('hits').find({id:1});
	hits.then((err, r)=>{
		db.hits.update({id:1}, {$set:{time:null, count:0}});
		res.send('ok');
	});
});

app.listen(PORT);