// Require the express and jsonwebtoken packages
const express = require("express");
const jwt = require("jsonwebtoken");

// Create an instance of the express application
const app = express();

// Define a route that returns a welcome message
app.get("/api", (req, res) => {
  res.json({
    message: "Welcome to the API",
  });
});

// Define a route that requires a valid JWT token in the authorization header and returns a success or error response
app.post("/api/post", verifyToken, (req, res) => {
  jwt.verify(req.token, "secretkey", (err, authData) => {
    if (err) {
      res.sendStatus(401);
    } else {
      res.status(201).json({
        message: "Post created",
        authData,
      });
    }
  });
});

// Define a route that generates a JWT token for a user
app.post("/api/login", (req, res) => {
  const user = {
    id: 1,
    name: "Jayveer",
    email: "jay@gmail.com",
  };
  jwt.sign({ user }, "secretkey", { expiresIn: "300s" }, (err, token) => {
    if (err) {
      res.sendStatus(500);
    } else {
      res.status(200).json({
        token,
      });
    }
  });
});

// A middleware function that verifies the presence and validity of a JWT token in the authorization header
function verifyToken(req, res, next) {
  const { authorization } = req.headers;

  if (typeof authorization !== "undefined") {
    const bearerToken = authorization.split(" ")[1];
    req.token = bearerToken;
    next();
  } else {
    res.sendStatus(401);
  }
}

// Start the server and listen on port 3004
app.listen(3000, () => {
  console.log("Server has started on port 3000");
});

/* Requests
http://localhost:3002/api/login - to build jwt token after login
http://localhost:3002/api/post - to check token is there in header or not and uin header section key as authorization and in value - Bearer <token key- which we get after login api is run in postman>

Reference - https://www.youtube.com/watch?v=7nafaH9SddU&list=PLillGF-RfqbZ2ybcoD2OaabW2P7Ws8CWu&index=4

*/
