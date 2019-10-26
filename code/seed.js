const mongojs = require('mongojs');
var db = mongojs('mongodb://root:admin123@127.0.0.1:27017/facemash',['faces','hits']);

if( db.faces.find().count() > 0 ) return;

var init_data = [
    {"name":"Amy_Adams","rating":0},
    {"name":"Arielle_Kebbel","rating":0},
    {"name":"Irena_Ponaroshku","rating":0},
    {"name":"Karen_Gillan","rating":0},
    {"name":"Katy_B","rating":0},
    {"name":"Rose_Mciver","rating":0},
    {"name":"Scarlett_Jhonsson","rating":0},
    {"name":"Shruthi_Hassan","rating":0},
    {"name":"Yvonne_Strahovski","rating":0}
];

db.collection("faces").insertMany(init_data,(err, res)=>{
    if (err) throw err;
    console.log("Number of documents inerted : ", res.insertedCount);
    db.close();
});
