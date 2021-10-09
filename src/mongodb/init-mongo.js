
// create user
// db.createUser({
//     user: "user",
//     pwd: "admin123",
//     roles: [{
//         role: "readWrite",
//         db: "test"
//     }]
// })

// // create hits collection
// db.hits.insert({'id':1,'count':0}, (err, res)=>{
//     if (err) throw err;
//     console.log("reset hit")
//     db.close();
// });

// // read files from imgs and create database
// var init_data = Array()
// files = listFiles("/tmp/imgs");
// files.forEach(image => {a
//     init_data.push({
//         "name": image.baseName,
//         "rating": 0
//     });
// });

// db.faces.insert(init_data,(err, res)=>{
//     if (err) throw err;
//     console.log("Number of documents inerted : ", res.insertedCount);
// });
