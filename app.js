const express = require("express");
const bodyParser = require("body-parser");
const request =require("request");
const https =require("https");
const { response } = require("express");
const app = express();

app.use(express.static("public"));

app.use(bodyParser.urlencoded({extended:true}));

app.get("/",function(req,res)
{
    res.sendFile(__dirname+"/signup.html");
})

app.post("/",function(req,res)
{
    const  firstname=req.body.fname;
     const lastname=req.body.lname;
     const email=req.body.mail;
    var data = {
        members:[
            {
                email_address: email,
                status:"subscribed",
                merge_fields:{
                    FNAME:firstname,
                    LNAME:lastname
                }
            }
        ]
    };

    const jsonData = JSON.stringify(data);

    const url = "https://us1.api.mailchimp.com/3.0/lists/9745e74679";
    const options={
        method:"POST",
        auth:"ishu:61ae1ea33e30e04ea9f8796535bb7541-us1"
    }

    const request =https.request(url, options, function(response)
    {

        var status =response.statusCode;

        if(status===200)
        {
            res.sendFile(__dirname+"/success.html");
        }
        else
        {
            res.sendFile(__dirname+"/failure.html");
        }
        response.on("data" ,function(data)
        {
            console.log(JSON.parse(data));
        })
    })

    //sending data to mailchimp
    request.write(jsonData);
    request.end();
});


app.post("/failure",function(req,res)
{
    res.redirect("/");
});

app.listen(process.env.PORT || 3000,function()
{
    console.log("Server start running on port 3000");
});

//API KEY
//61ae1ea33e30e04ea9f8796535bb7541-us1

//audience list id
//9745e74679