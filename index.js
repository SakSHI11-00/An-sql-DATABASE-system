const { faker } = require("@faker-js/faker");
const mysql = require('mysql2');
const express = require("express");
const app = express();
const path= require("path");
const methodOverride = require ("method-override")

app.use(methodOverride("_method"));
app.use(express.urlencoded({extended :true}));



app.set("view engine","ejs");
app.set("views", path.join(__dirname, "/views"));
const connection =  mysql.createConnection({
  host: 'localhost',
  user: 'root',
  database: 'delta_app',
  password : '300412',
});
let getRandomUser = () => {
  return [
    faker.string.uuid(),
     faker.internet.username(),
     faker.internet.email(),
     faker.internet.password(),

]  };

//inserting new data
let q = "INSERT INTO user (id, username, email, password) VALUES ?";
let data=[];
for(let i =1; i<=100 ; i++){
  data.push(getRandomUser());
}




app.get("/",(req , res)=>{
  let q = ` SELECT count(*) FROM user`;
   try{
    connection.query(q, (err,result) =>{
    if (err) throw err;
    let count = result[0]["count(*)"] ;
    res.render("home.ejs",{count});
    });
   
} catch(err) {
    console.log(err);
    res.render("some error in db");
}

});



app.get("/user",(req , res)=>{
      let q = `SELECT * FROM user `;
  
   try{
    connection.query(q, (err, users) =>{
    if (err) throw err ;
    
    res.render("showusers.ejs",{users});
    
    });
} catch(err) {
    console.log(err);
    res.send("some error in db");
}

});

app.get("/user/:id/edit",(req , res)=>{
  let {id} = req.params;
  let q =`SELECT * FROM user WHERE id ='${id}'`;

   try{
    connection.query(q, (err, result) =>{
    if (err) throw err ;
    let user = result[0];
    console.log(result);
    res.render("editform.ejs",{user});
    
    });
} catch(err) {
    console.log(err);
    res.send("some error in db");
}

  
});


//UPDATE
app.patch("/user/:id",(req, res)=>{
    let {id} = req.params;
    let { password : formpass , username : newusername } = req.body;
  let q =`SELECT * FROM user WHERE id ='${id}'`;

   try{
    connection.query(q, (err, result) =>{
    if (err) throw err ;
    let user = result[0];
    if(formpass != user.password){
      res.send("Wrong password entered");
    }else{
      let q2 =`UPDATE user SET username='${newusername}' WHERE id ='${id}'`;
      connection.query(q2 ,(err, result) => {
        if(err) throw err;
        res.redirect("/user");
      });
    }
    
    });
} catch(err) {
    console.log(err);
    res.send("some error in db");
}

});

app.get("/user/:id/changepass",(req,res)=>{
  let {id} =req.params;
     let q =`SELECT * FROM user WHERE id ='${id}'`;

   try{
    connection.query(q, (err, result) =>{
    if (err) throw err ;
    let user = result[0];
    console.log(result);
    res.render("changepass.ejs",{user});
    
    });
} catch(err) {
    console.log(err);
    res.send("some error in db");
}

  
});

app.get("/user/:id/deleteacc",(req,res)=>{
  let {id} =req.params;
     let q =`SELECT * FROM user WHERE id ='${id}'`;

   try{
    connection.query(q, (err, result) =>{
    if (err) throw err ;
    let user = result[0];
    console.log(result);
    res.render("deleteacc.ejs",{user});
    
    });
} catch(err) {
    console.log(err);
      res.send("erroe in db")
}

  
});

app.delete("/user/:id/deleteacc",(req, res)=>{
    let {id} = req.params;
    let { password : formpass ="" , username : formuser =""} = req.body;
  let q =`SELECT * FROM user WHERE id ='${id}'`;
   try{
    connection.query(q, [id] ,(err, result) =>{
    if (err) throw err ;
    let user = result && result[0];
    if(formpass != user.password || formuser != user.username){
      res.send("Wrong password entered or wrong username entered");
      
    }else{
      let q2 =`DELETE FROM user  WHERE id ='${id}'`;
      connection.query(q2 ,[id] ,(err, result) => {
        if(err) throw err;
          res.redirect("/user");
      });
    }
    
    });
} catch(err) {
    console.log(err);
      res.send("error in db")
}

});

//CHANGE PASSWORD

app.patch("/user/:id/changepass",(req, res)=>{
    let {id} = req.params;
    let { oldpass, newpass } = req.body;
  let q =`SELECT * FROM user WHERE id ='${id}'`;

   try{
    connection.query(q, [id],(err, result) =>{
    if (err) throw err ;
    let user = result[0];
    if(  oldpass !== user.password){
      return res.send("Wrong password or username entered ");
    }else{
      let q2 =`UPDATE user SET password='${newpass}' WHERE id ='${id}'`;
      connection.query(q2 ,[id],(err, result) => {
        if(err) throw err;
        res.redirect("/user");
      });
    }
    
    });
} catch(err) {
    console.log(err);
    res.send("some error in db");
}

});


app.listen("8089",()=>{
  console.log("server is listening to port 8089");
});


