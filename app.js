const express = require("express");
const request = require("request");
const bodyParser = require("body-parser");
const https = require("https");
const url = "https://us2.api.mailchimp.com/3.0/lists/0f98bb942d";

const app = express();
app.use(bodyParser.urlencoded({extended: true}));

app.use(express.static("public"));

app.get("/", function(req, res){
  res.sendFile(__dirname + "/Signup.html");
});

app.post("/", function(req, res) {
  const firstName = req.body.firstName;
  const lastName = req.body.lastName;
  const email = req.body.email;
  const data = {
    members: [
      {
        email_address: email,
        status: "subscribed",
        merge_fields: {
          FNAME: firstName,
          LNAME: lastName
        }
      }
    ]
  };

  var jsonData = JSON.stringify(data);

  const options = {
    method: "POST",
    auth: "aman9824:cb411cab26cd94eab14a914898854f01-us2"
  }

  const request = https.request(url, options, function(response) {
    if(response.statusCode === 200) {
      res.sendFile(__dirname+"/success.html");
    }
    else {
      res.sendFile(__dirname+"/failure.html");
    }
    response.on("data", function(data) {
      console.log(JSON.parse(data));
    });
  });

  request.write(jsonData);
  request.end();
  // app.send("<h1> firstName : " + firstName + "<br> lastName : " + lastName + "<br> email: " + email + "</h1>");
});

app.post("/failure", function(req, res) {
  res.redirect("/");
});

app.listen(process.env.PORT || 3000, function() {
  console.log("Server is running");
});

//API Key: cb411cab26cd94eab14a914898854f01-us2
//List id: 0f98bb942d
//   'https://server.api.mailchimp.com/3.0/lists?fields=<SOME_ARRAY_VALUE>&exclude_fields=<SOME_ARRAY_VALUE>&count=10&offset=0&before_date_created=<SOME_STRING_VALUE>&since_date_created=<SOME_STRING_VALUE>&before_campaign_last_sent=<SOME_STRING_VALUE>&since_campaign_last_sent=<SOME_STRING_VALUE>&email=<SOME_STRING_VALUE>&sort_field=<SOME_STRING_VALUE>&sort_dir=<SOME_STRING_VALUE>' \
