//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");

const app = express();

// for displaying static files by server like images in our local drive
app.use(express.static("public"));
// to parse the body
app.use(bodyParser.urlencoded({
  extended: true
}));


// to send the data requested by browser from our server i.e. get request
app.get("/", function(req, res) {
  res.sendFile(__dirname + "/signup.html");
});

//to get the data sended by browser to our server i.e. post request
app.post("/", function(req, res) {
  var firstName = req.body.fname;
  var lastName = req.body.lname;
  var emailid = req.body.email;
  //console.log(firstName , lastName , emailid);

  var data = {
    members: [{
      email_address: emailid,
      status: "subscribed",
      merge_fields: {
        FNAME: firstName,
        LNAME: lastName
      }
    }]
  };

  var jsonData = JSON.stringify(data);

  var option = {
    url: "https://us4.api.mailchimp.com/3.0/lists/7be82c5b5d",
    method: "POST",
    headers: {
      "Authorization": "Shivam cfb7abebb486bcabf182bb1e81e104af-us4"
    },
   body: jsonData
  };

  request(option, function(error, response, body) {
    if (error) {
      res.sendFile(__dirname + "/failure.html");
    }
    else {
      if (response.statusCode === 200) {
        res.sendFile(__dirname + "/success.html");
      }
       else {
        res.sendFile(__dirname + "/failure.html");
      }
    }
  });

});

//in case of failure the failure page to redirect to home route
app.post("/failure", function(req, res){
  res.redirect("/");
});

// to launch our code on heroku server , as they may not be listening on loabl port 3000
// so we use dynamic port that heroku will determine on the go
app.listen(process.env.PORT || 3000, function() {
  console.log("listening on port 3000.");
});
//API Key
//cfb7abebb486bcabf182bb1e81e104af-us4

//id
//7be82c5b5d
