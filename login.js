const mysql=require("mysql2");
const express= require("express");
const { application } = require("express");
//import {alert} from 'node-popup';
const popup = require('node-popup');
const app=express();

app.use(express.urlencoded({
    extended:true
}));
app.use(express.json());
app.use(express.static(__dirname + "/home"));
app.use(express.static(__dirname + "/home1"));
app.use(express.static(__dirname + "/login"));
app.use(express.static(__dirname + "/register"));
app.use(express.static(__dirname + "/customer_details"));
app.use(express.static(__dirname + "/stock_details"));
app.use(express.static(__dirname + "/order"));
app.use(express.static(__dirname + "/ucustomer_details"));
app.use(express.static(__dirname + "/ustock_details"));
app.use(express.static(__dirname + "/stock_analysis"));
app.use(express.static(__dirname + "/chart"));

app.use("/assets",express.static("assets"));
// const connection = mysql.createConnection({
//     host: "localhost",
//     user: "root",
//     password: "rakshi",
//     database: "stock",
// });

const connection = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "rakshi",
    database: "stock",
    // port:this.port
})

connection.getConnection(function(error,connection){
    if(error) {
        console.log(error)
    }
    else console.log("connected to the database")
});

app.get("/",function(req,res){
    res.sendFile(__dirname + "/index.html");
})

app.get("/login",function(req,res){
    res.sendFile(__dirname + "/login.html");
})

app.get("/chart",function(req,res){
    res.sendFile(__dirname + "/chart.html");
})

app.get("/register",function(req,res){
    res.sendFile(__dirname + "/register.html");
})

app.get("/home",function(req,res){
    res.sendFile(__dirname + "/home.html");
})

app.get("/home1",function(req,res){
    res.sendFile(__dirname + "/home1.html");
})

app.get("/stock_details",function(req,res){
    res.sendFile(__dirname + "/stock_details.html");
})

app.get("/ustock_details",function(req,res){
    res.sendFile(__dirname + "/ustock_details.html");
})

app.get("/stock_analysis",function(req,res){
    res.sendFile(__dirname + "/stock_analysis.html");
})

app.get("/customer_details",function(req,res){
    res.sendFile(__dirname + "/customer_details.html");
})

app.get("/order",function(req,res){
    res.sendFile(__dirname + "/order.html");
})

app.get("/ucustomer_details",function(req,res){
    res.sendFile(__dirname + "/ucustomer_details.html");
})

app.post("/login",function(req,res){

    var username = req.body.username;
    var password = req.body.password;

    connection.query("select * from login where username=? and password=?",[username,password],function(error,results,fields){
        if(results.length>0)
        {
            if(username=="admin")
            {
            res.redirect("/home");
            }
            else
            {
                res.redirect("/home1"); 
            }
        }
        else
        {
            res.redirect("/login");
        }
        res.end();
    })
});


app.post("/register",async(req,res)=>{
    console.log("hlo")
    var username = req.body.username;
    var password = req.body.password;
    console.log(username)
    console.log(password)
    if(password.length>=3 && username.length>=3)
    {
    connection.query("INSERT INTO login (username, password) VALUES ('"+username+"','"+password+"')",function(error,results,fields){
        console.log("Successfully registered")
        res.redirect("/login");
        res.end();
    })
   }
   else
   {
    res.redirect("/register");
   }
});

app.post("/customer_details",async(req,res)=>{
    console.log("hlo")
    var companyid = req.body.companyid;
    var companyname= req.body.companyname;
    var address = req.body.address;
    var phone= req.body.phone;
    console.log(companyid)
    console.log(companyname)
    console.log(address)
    console.log(phone)
    connection.query("INSERT INTO company () VALUES ('"+companyid+"','"+companyname+"','"+address+"','"+phone+"')",function(error,results,fields){
        console.log("Company details inserted successfully")
        res.redirect("/customer_details");
        res.end();
    })
});

app.post("/stock_details",async(req,res)=>{
    console.log("hlo")
    var companyid = req.body.companyid;
    var companyname= req.body.companyname;
    var date = req.body.date;
    var hsncode= req.body.hsncode;
    var qty= req.body.qty;
    var amt= req.body.amt;
    var order=req.body.order;
   
    connection.query("INSERT INTO sales () VALUES ('"+companyid+"','"+companyname+"','"+date+"','"+hsncode+"','"+qty+"','"+amt+"','"+order+"')",function(error,results,fields){
        console.log("sales details inserted successfully")

        console.log(companyid)
        console.log(date)
        console.log(order)

       if(order=="supplied")
       {
        connection.query("UPDATE orders SET orderstatus = ? WHERE companyid = ? AND date= ? ",['supplied',companyid,date],function(error,results,fields){
            console.log("Company details deleted successfully")
        })
        }
        res.redirect("/stock_details");
        res.end();
    })
    
    
});

app.post("/order",async(req,res)=>{
    console.log("hlo")
    var companyid = req.body.companyid;
    var date = req.body.date;
    var qty= req.body.qty;
    var orderstatus=req.body.order;
    connection.query("INSERT INTO orders () VALUES ('"+companyid+"','"+orderstatus+"','"+date+"','"+qty+"')",function(error,results,fields){
        console.log("order details inserted successfully")
        res.redirect("/stock_details");
        res.end();
    })
});


app.post("/ucustomer_details",async(req,res)=>{
    console.log("hlo")
    var companyid = req.body.companyid;
    var companyname= req.body.companyname;
   
    console.log(companyid)
    console.log(companyname)
    
    connection.query("DELETE FROM company WHERE companyid =? and companyname=?",[companyid,companyname],function(error,results,fields){
        console.log("Company details deleted successfully")
        res.redirect("/customer_details");
        res.end();
    })
});

app.post("/ustock_details",async(req,res)=>{
    console.log("hlo")
    var companyid = req.body.companyid;
    var date= req.body.date;
   
    console.log(companyid)
    console.log(date)
    
    connection.query("DELETE FROM sales WHERE companyid =? and date=?",[companyid,date],function(error,results,fields){
        console.log("Company details deleted successfully")
        res.redirect("/ustock_details");
        res.end();
    })
});


app.post('/stock_analysis',(req,res)=>{
    // var date= req.body.date;
    // connection.query("select companyname,amt from sales where date=?",[date],function(error,results,fields){
    //       console.log(results)
    //       res.send(JSON.stringify(results))
    //     })

        res.redirect("/chart")
    
})
app.listen(4000)

const mysql=require("mysql2");
const express= require("express");
const { application } = require("express");
//import {alert} from 'node-popup';
const popup = require('node-popup');
const app=express();

app.use(express.urlencoded({
    extended:true
}));
app.use(express.json());
app.use(express.static(__dirname + "/home"));
app.use(express.static(__dirname + "/home1"));
app.use(express.static(__dirname + "/login"));
app.use(express.static(__dirname + "/register"));
app.use(express.static(__dirname + "/customer_details"));
app.use(express.static(__dirname + "/stock_details"));
app.use(express.static(__dirname + "/order"));
app.use(express.static(__dirname + "/ucustomer_details"));
app.use(express.static(__dirname + "/ustock_details"));
app.use(express.static(__dirname + "/stock_analysis"));
app.use(express.static(__dirname + "/chart"));

app.use("/assets",express.static("assets"));
// const connection = mysql.createConnection({
//     host: "localhost",
//     user: "root",
//     password: "rakshi",
//     database: "stock",
// });

const connection = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "rakshi",
    database: "stock",
    // port:this.port
})

connection.getConnection(function(error,connection){
    if(error) {
        console.log(error)
    }
    else console.log("connected to the database")
});

app.get("/",function(req,res){
    res.sendFile(__dirname + "/index.html");
})

app.get("/login",function(req,res){
    res.sendFile(__dirname + "/login.html");
})

app.get("/chart",function(req,res){
    res.sendFile(__dirname + "/chart.html");
})

app.get("/register",function(req,res){
    res.sendFile(__dirname + "/register.html");
})

app.get("/home",function(req,res){
    res.sendFile(__dirname + "/home.html");
})

app.get("/home1",function(req,res){
    res.sendFile(__dirname + "/home1.html");
})

app.get("/stock_details",function(req,res){
    res.sendFile(__dirname + "/stock_details.html");
})

app.get("/ustock_details",function(req,res){
    res.sendFile(__dirname + "/ustock_details.html");
})

app.get("/stock_analysis",function(req,res){
    res.sendFile(__dirname + "/stock_analysis.html");
})

app.get("/customer_details",function(req,res){
    res.sendFile(__dirname + "/customer_details.html");
})

app.get("/order",function(req,res){
    res.sendFile(__dirname + "/order.html");
})

app.get("/ucustomer_details",function(req,res){
    res.sendFile(__dirname + "/ucustomer_details.html");
})

app.post("/login",function(req,res){

    var username = req.body.username;
    var password = req.body.password;

    connection.query("select * from login where username=? and password=?",[username,password],function(error,results,fields){
        if(results.length>0)
        {
            if(username=="admin")
            {
            res.redirect("/home");
            }
            else
            {
                res.redirect("/home1"); 
            }
        }
        else
        {
            res.redirect("/login");
        }
        res.end();
    })
});


app.post("/register",async(req,res)=>{
    console.log("hlo")
    var username = req.body.username;
    var password = req.body.password;
    console.log(username)
    console.log(password)
    if(password.length>=3 && username.length>=3)
    {
    connection.query("INSERT INTO login (username, password) VALUES ('"+username+"','"+password+"')",function(error,results,fields){
        console.log("Successfully registered")
        res.redirect("/login");
        res.end();
    })
   }
   else
   {
    res.redirect("/register");
   }
});

app.post("/customer_details",async(req,res)=>{
    console.log("hlo")
    var companyid = req.body.companyid;
    var companyname= req.body.companyname;
    var address = req.body.address;
    var phone= req.body.phone;
    console.log(companyid)
    console.log(companyname)
    console.log(address)
    console.log(phone)
    connection.query("INSERT INTO company () VALUES ('"+companyid+"','"+companyname+"','"+address+"','"+phone+"')",function(error,results,fields){
        console.log("Company details inserted successfully")
        res.redirect("/customer_details");
        res.end();
    })
});

app.post("/stock_details",async(req,res)=>{
    console.log("hlo")
    var companyid = req.body.companyid;
    var companyname= req.body.companyname;
    var date = req.body.date;
    var hsncode= req.body.hsncode;
    var qty= req.body.qty;
    var amt= req.body.amt;
    var order=req.body.order;
   
    connection.query("INSERT INTO sales () VALUES ('"+companyid+"','"+companyname+"','"+date+"','"+hsncode+"','"+qty+"','"+amt+"','"+order+"')",function(error,results,fields){
        console.log("sales details inserted successfully")

        console.log(companyid)
        console.log(date)
        console.log(order)

       if(order=="supplied")
       {
        connection.query("UPDATE orders SET orderstatus = ? WHERE companyid = ? AND date= ? ",['supplied',companyid,date],function(error,results,fields){
            console.log("Company details deleted successfully")
        })
        }
        res.redirect("/stock_details");
        res.end();
    })
    
    
});

app.post("/order",async(req,res)=>{
    console.log("hlo")
    var companyid = req.body.companyid;
    var date = req.body.date;
    var qty= req.body.qty;
    var orderstatus=req.body.order;
    connection.query("INSERT INTO orders () VALUES ('"+companyid+"','"+orderstatus+"','"+date+"','"+qty+"')",function(error,results,fields){
        console.log("order details inserted successfully")
        res.redirect("/stock_details");
        res.end();
    })
});


app.post("/ucustomer_details",async(req,res)=>{
    console.log("hlo")
    var companyid = req.body.companyid;
    var companyname= req.body.companyname;
   
    console.log(companyid)
    console.log(companyname)
    
    connection.query("DELETE FROM company WHERE companyid =? and companyname=?",[companyid,companyname],function(error,results,fields){
        console.log("Company details deleted successfully")
        res.redirect("/customer_details");
        res.end();
    })
});

app.post("/ustock_details",async(req,res)=>{
    console.log("hlo")
    var companyid = req.body.companyid;
    var date= req.body.date;
   
    console.log(companyid)
    console.log(date)
    
    connection.query("DELETE FROM sales WHERE companyid =? and date=?",[companyid,date],function(error,results,fields){
        console.log("Company details deleted successfully")
        res.redirect("/ustock_details");
        res.end();
    })
});


app.post('/stock_analysis',(req,res)=>{
    // var date= req.body.date;
    // connection.query("select companyname,amt from sales where date=?",[date],function(error,results,fields){
    //       console.log(results)
    //       res.send(JSON.stringify(results))
    //     })

        res.redirect("/chart")
    
})
app.listen(4000)

