const express= require("express");
const https = require("https");

// To astract the inputs from Index.html
const bodyParser = require("body-parser");

const app = express();

app.use(bodyParser.urlencoded({extended: true }));

app.get("/", function(req, res){
  res.sendFile(__dirname + "/index.html");
});

app.post("/", function(req, res){
  // API
  const query = req.body.cityName;
  const unit = "metric"
  const api_key = "9b12bc8f9a92235d8b85687efe698c3c";
  const url = "https://api.openweathermap.org/data/2.5/weather?q="+ query +"&appid="+ api_key +"&units="+ unit +"";

  https.get(url,function(response){
    console.log(response.statusCode);

  // data keyword need to be small.
    response.on("data", function(data){
      const weatherData = JSON.parse(data);
      const temp = weatherData.main.temp;
      const description = weatherData.weather[0].description;
      const icon = weatherData.weather[0].icon;
      const imageUrl = "http://openweathermap.org/img/wn/"+ icon +"@2x.png"
      // Parse to 3d stringyfy to 1d. main.temp
      // console.log(weatherData);
      // console.log("Temperature " + temp + " Description" + description);

      res.write("<h1> The temp in "+ query +" is " + temp + " degree celcius. </h1>");
      res.write("<p> The temp description is " + description + "</p>");
      res.write("<img src = " + imageUrl + ">");
      res.send();
      // There can only be one response in a method. If
      // Multiple provided its going to crash.
    });
  });

});

app.listen(3000,function(){
  console.log("Server has started running.");
});

//
// app.get("/", function(req, res){
//
// https.get(url,function(response){
//   console.log(response.statusCode);
//
// // data keyword need to be small.
//   response.on("data", function(data){
//     const weatherData = JSON.parse(data);
//     const temp = weatherData.main.temp;
//     const description = weatherData.weather[0].description;
//     const icon = weatherData.weather[0].icon;
//     const imageUrl = "http://openweathermap.org/img/wn/"+ icon +"@2x.png"
//     // Parse to 3d stringyfy to 1d.
//     console.log(weatherData);
//     console.log("Temperature " + temp + " Description" + description);
//     res.write("<h1> The temp is " + temp + " degree celcius. </h1>");
//     res.write("<p> The temp description is " + description + "</p>");
//     res.write("<img src = " + imageUrl + ">");
//     res.send();
//     // There can only be one response in a method. If
//     // Multiple provided its going to crash.
//   });
// });
//   // res.send("Server is up and running");
// });
//
