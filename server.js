const { default: axios } = require("axios");
const express = require("express");
const app = express();

const CONSUMER_KEY = "GFLaeINfznCZgALQ2IlDjrQ8rqtUkfll";
const CONSUMER_SECRET = "X5ejdUNKIAUeHN6m";

//url for client_credentials
const url =
  "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials";

//generate access token middleware
const access = async (req, res, next) => {
  let buff = Buffer.from(CONSUMER_KEY + ":" + CONSUMER_SECRET);
  let auth = buff.toString("base64");
  const { data } = await axios.get(url, {
    headers: {
      Authorization: "Basic " + auth,
    },
  });
  req.access_token = data.access_token;
  next();
  return data.access_token;
};

//register user
app.get("/register", access, async (req, res) => {
  let url = "https://sandbox.safaricom.co.ke/mpesa/c2b/v1/registerurl";
  //get auth token from access middleware
  let auth = req.access_token;
  const data = JSON.stringify;
});

//Index route
app.get("/", (req, res) => {});

app.get("token", (req, res) => {});
