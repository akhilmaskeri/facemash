db.createUser({
    user: "user",
    pwd: "admin123",
    roles: [{
        role: "readWrite",
        db: "test"
    }]
})

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

db.faces.insert(init_data,(err, res)=>{
    if (err) throw err;
    console.log("Number of documents inerted : ", res.insertedCount);
});

db.hits.insert({'id':1,'count':0}, (err, res)=>{
    if (err) throw err;
    console.log("reset hit")
    db.close();
});

