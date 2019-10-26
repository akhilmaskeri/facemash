const express = require('express')
const bodyParser = require('body-parser')
const path = require('path')
const mongojs = require('mongojs');
const generateRandom = require('random-number');

const db = mongojs('mongodb://root:admin123@192.168.128.2:27017/facemash',['faces','hits'])

var app = express()

app.set('view engine','ejs');
app.set('views',path.join(__dirname,'src/views'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));
app.use(express.static(path.join(__dirname,'src/public')));

// render index
app.get('/',(req,res)=>{
	res.render('index')
});

app.get('/initDB',(req, res)=>{


});

app.get('/init',(req,res)=>{

	db.hits.find({id:1},(err,r)=>{
		
		let totalCount = (r[0].count) ? r[0].count+1 : 1;
		db.hits.update({id:1},{$set:{time:Date.now(),count:totalCount}});

	});

	db.faces.find((err,faces)=>{

		let options = {
			min: 0,
			max: faces.length-1,
			integer: true
		}

		let r1 = generateRandom(options);
		let r2 = generateRandom(options);

		while(r1 == r2 ) r2 = generateRandom(options); // so both are not same

		var img1 = faces[r1];
		var img2 = faces[r2];

		res.json({
			left : { name: img1.name , src: "/imgs/"+img1.name+".jpg" },
			right: { name: img2.name , src: "/imgs/"+img2.name+".jpg" }
		});

	})

});

app.get('/hit',(req,res)=>{

	db.hits.find({id:1},(err,r)=>{
		let totalCount = (r[0].count)?r[0].count+1:1;
		db.hits.update({id:1},{$set:{time:Date.now(),count:totalCount}});
	});

	let A = req.query.l;
	let B = req.query.r;

	let SA = (req.query.f == A )?1:0;  // f : finalImage
	let SB = 1-SA;                     // SA , SB 

	let RA = 0,RB = 0;

	db.faces.findOne({name:A},function(err,leftResult){
		RA = leftResult.rating;

		db.faces.findOne({name:B},function(err,rightResult){
			RB = rightResult.rating;

			EA = 1 / (1 + Math.pow(10,(RB-RA)/400));
			EB = 1 / (1 + Math.pow(10,(RA-RB)/400));

			_RA = RA + 24 * ( SA - EA );
			_RB = RB + 24 * ( SB - EB );

			db.faces.update({name:A},{$set:{rating:_RA} });
			db.faces.update({name:B},{$set:{rating:_RB} });


			db.faces.find(function(err,faces){

				let options = {min:0,max:faces.length-1,integer:true}
				r1 = rn(options);

				while(faces[r1].name == req.query.f) r1 = rn(options);	

				let img = faces[r1];

				res.json({
					image : { name: img.name , src: "/imgs/"+img.name+".jpg" }
				})

			});

		});

	});
});

app.get('/ranking',function(req,res){
	
	var ordered = {};

	db.faces.find(function(err,result){

		result.sort(function(a,b){
			return parseFloat(b.rating) - parseFloat(a.rating);
		});
		
		let arr = [];
		result.forEach((e)=>{arr.push(e)});
		res.json({rank:arr});

	});

});

app.get('/counts',(req,res)=>{
	db.hits.find((err,data)=>{
		res.json(data);
	})
})

app.get('/resetCounts',(req,res)=>{
	db.hits.find({id:1},(err,r)=>{
		db.hits.update({id:1},{$set:{time:null,count:0}});
		res.send('ok');
	});
});

app.set( 'port',( process.env.PORT || 5000 ));

app.listen( app.get( 'port' ),()=> {});
