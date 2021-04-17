const axios = require("axios");
const url =
  "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials";

const access = async (req, res, next) => {
  let buff = Buffer.from("GFLaeINfznCZgALQ2IlDjrQ8rqtUkfll:X5ejdUNKIAUeHN6m");
  let auth = buff.toString("base64");
  const data = await axios.get(url, {
    headers: {
      Authorization: "Basic " + auth,
    },
  });
  req.access_token = data.access_token;
  next();
};

module.exports = access;
