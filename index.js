// Import packages
const express = require("express");
const path = require("path");
const request = require('request');


// Middlewares
const app = express();
app.use(express.json());
app.use(express.static(__dirname + "/frontend/"));

const redirect_uri = "https://node-express-vercel-production.up.railway.app/callback"; //whitelisted redirect uri via developer dashboard
const client_id = "bc138b8d2f814b4d881e26d13cccbf72"; //client id from developer dashboard
const client_secret = "dd8bea225a2041c28b59846c68adee10"; //client secret from developer dashboard

global.access_token;

// Routes
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "frontend", "login.html"));
});

//authorize the user by getting a code
app.get("/authorize", (req, res) => {
//     res.set({
//     "Access-Control-Allow-Origin": "https://node-express-vercel-production.up.railway.app"
//   });
  var auth_query_parameters = new URLSearchParams({
    response_type: "code",
    client_id: client_id,
    scope: "user-top-read",
    redirect_uri: redirect_uri,
  });

  res.redirect(
    "https://accounts.spotify.com/authorize?" + auth_query_parameters.toString()
  );

});

//get the access token from the code
// app.get("/callback", async (req, res) => {
//   const code = req.query.code;
//   console.log("poopy" + code);

// //   var body = new URLSearchParams({
// //     code: code,
// //     redirect_uri: redirect_uri,
// //     grant_type: "authorization_code",
// //   });
//     request.post({
//     headers: {
//         'Content-type': 'application/x-www-form-urlencoded',
//         'Authorization': 'Basic ' + Buffer.from(client_id + ':' + client_secret).toString('base64')
//     },
//     url: 'https://accounts.spotify.com/api/token',
//     body: 'code=' + code + '&redirect_uri=' + redirect_uri + '&grant_type=authorization_code'
//     }, (error, response, body) => {
//     const data = body;
//   global.access_token = data.access_token;
//     });
  
//   res.sendFile(path.join(__dirname, "frontend", "dashboard.html"));
// });

// const request = require('request');

app.get("/callback", async (req, res) => {
  const code = req.query.code;

  var body = new URLSearchParams({
    code: code,
    redirect_uri: redirect_uri,
    grant_type: "authorization_code",
  });

  const response = await fetch("https://accounts.spotify.com/api/token", {
    method: "post",
    body: body,
    headers: {
      "Content-type": "application/x-www-form-urlencoded",
      Authorization:
        "Basic " +
        Buffer.from(client_id + ":" + client_secret).toString("base64"),
    },
  });

  const data = await response.json();
  global.access_token = data.access_token;
  
  res.sendFile(path.join(__dirname, "frontend", "dashboard.html"));

  
});


// app.get("/callback", (req, res) => {
//   const code = req.query.code;
//   console.log(code);

//   var body = new URLSearchParams({
//     code: code,
//     redirect_uri: redirect_uri,
//     grant_type: "authorization_code",
//   });

//   const hi = request.post({
//     url: "https://accounts.spotify.com/api/token",
//     form: body,
//     headers: {
//       "Content-type": "application/x-www-form-urlencoded",
//       Authorization:
//         "Basic " +
//         Buffer.from(client_id + ":" + client_secret).toString("base64"),
//     },
//   },
//   (error, response, body) => {
//       const data = JSON.parse(body);
//       global.access_token = data.access_token;
//       console.log(data + "data");
//       console.log(global.access_token  + "access token");
      
//       res.sendFile(path.join(__dirname, "frontend", "dashboard.html"));
//   });
// });


//   const response = await fetch("https://accounts.spotify.com/api/token", {
//     method: "post",
//     body: body,
//     headers: {
//       "Content-type": "application/x-www-form-urlencoded",
//       Authorization:
//         "Basic " +
//         Buffer.from(client_id + ":" + client_secret).toString("base64"),
//     },
//   });


// //generalized function to get data from the spotify api
async function getData(endpoint) {
   
  return new Promise((resolve, reject) => {
     console.log(global.access_token + "access token2");
    request(
      {
        url: "https://api.spotify.com/v1" + endpoint,
        method: "GET",
        headers: {
          Authorization: "Bearer " + global.access_token,
        },
      },
      (error, response, body) => {
        if (error) {
          return reject(error);
        }
        resolve(JSON.parse(body));
      }
    );
  });
}

// //get the photos of the top 100 tracks albums
app.get("/tracksShort", async (req, res) => {
    console.log("WE GOT HERE BITCHES");
    const userInfo = await getData("/me");
    const tracksShort = await getData("/me/top/tracks?time_range=short_term&limit=50");

  res.json({ user: userInfo, 
    tracksShort: tracksShort.items
  });
});

// app.get("/tracksMedium", async (req, res) => {
//   const userInfo = await getData("/me");
//   const tracksMedium = await getData("/me/top/tracks?time_range=medium_term&limit=50");

//   res.json({ user: userInfo, 
//     tracksMedium: tracksMedium.items});
// });


// app.get("/tracksLong", async (req, res) => {
//   const userInfo = await getData("/me");
//   const tracksLong = await getData("/me/top/tracks?time_range=long_term&limit=50");

//   res.json({ user: userInfo, 
//      tracksLong: tracksLong.items,});
// });

// // connection
const port = process.env.PORT || 9001;
app.listen(port, () => console.log(`Listening to port ${port}`));