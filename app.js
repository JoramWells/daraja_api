const express = require("express");
const axios = require("axios");
const bodyParser = require("body-parser");
const app = express();
const dateFormat = require("dateformat");
const PORT = process.env.PORT || 5000;

const consumer_key = "GFLaeINfznCZgALQ2IlDjrQ8rqtUkfll";
const consumer_secret = "X5ejdUNKIAUeHN6m";
const str = consumer_key + ":" + consumer_secret;
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const url =
  "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials";

app.get("/", (req, res) => {
  res.send(200);
  console.log("data");
});
const access = async (req, res, next) => {
  let buff = Buffer.from(consumer_key + ":" + consumer_secret);
  let auth = buff.toString("base64");
  const { data } = await axios.get(url, {
    headers: {
      Authorization: "Basic " + auth,
    },
  });
  console.log(data.access_token);
  req.access_token = data.access_token;
  next();
  return data.access_token;
};

app.get("/access_token", access, (req, res) => {
  console.log(req.access_token);
  res.end();
});

app.get("/register", access, async (req, res) => {
  let url = "https://sandbox.safaricom.co.ke/mpesa/c2b/v1/registerurl";
  let auth = req.access_token;
  const data = JSON.stringify({
    ShortCode: "600383",
    ResponseType: "Complete",
    ConfirmationURL: "http://192.168.0.29:5000/confirmation",
    ValidationURL: "http://192.168.0.29:5000/validation_url",
  });
  await axios
    .post(url, data, {
      headers: {
        Authorization: "Bearer " + auth,
        "Content-Type": "application/json",
      },
    })
    .then((response) => {
      res.send(response.data);
    })
    .catch((err) => console.log(err));
});

app.post("/confirmation", (req, res) => {
  console.log("________________________validation__________________________");
  console.log(req.body);
});
app.post("/validation_url", (req, res) => {
  console.log("________________________validation__________________________");
  console.log(req.body);
});

app.get("/simulate", access, async (req, res) => {
  const url = "https://sandbox.safaricom.co.ke/mpesa/c2b/v1/simulate";
  let auth = "Bearer " + req.access_token;
  const data = JSON.stringify({
    ShortCode: "600383",
    CommandID: "CustomerPayBillOnline",
    Amount: 100,
    Msisdn: "254799980846",
    BillRefNumber: "Test API ",
  });
  await axios
    .post(url, data, {
      headers: {
        Authorization: auth,
        "Content-Type": "application/json",
      },
    })
    .then((response) => {
      console.log(req.body);
      res.status(200).json(response.data);
    })
    .catch((err) => console.log(err));
});

app.get("/balance", access, async (req, res) => {
  const url = "https://sandbox.safaricom.co.ke/mpesa/accountbalance/v1/query";
  let auth = "Bearer " + req.access_token;
  const data = JSON.stringify({
    SecurityCredential: " ",
    CommandID: "AccountBalance",
    PartyA: "600383",
    IdentifierType: "4",
    Remarks: "Remarks",
    QueueTimeOutURL: "http://192.168.0.29:3000/timeout_url",
    ResultURL: "http://192.168.0.29:3000/result_url",
  });
  await axios.post(url, data, {
    headers: {
      Authorization: auth,
      "Content-Type": "application/json",
    },
  });
});

app.get("/stk", access, async (req, res) => {
  const url = "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest",
    auth = "Bearer " + req.access_token;
  let date = new Date();
  const timestamp = dateFormat(date, "yyyymmddhhmmss");

  let buff = Buffer.from(
    "174379" +
      "bfb279f9aa9bdbcf158e97dd71a467cd2e0c893059b10f78e6b72ada1ed2c919" +
      timestamp
  );
  const password = buff.toString("base64");
  console.log(timestamp);

  const data = JSON.stringify({
    BusinessShortCode: "174379",
    Password: password,
    Timestamp: timestamp,
    TransactionType: "CustomerPayBillOnline",
    Amount: "1",
    PartyA: "254716437799",
    PartyB: "174379",
    PhoneNumber: "254799980846",
    CallBackURL: "http://192.168.0.29:5000/stk_callback",
    AccountReference: "Test",
    TransactionDesc: "TestPay",
  });
  await axios
    .post(url, data, {
      headers: {
        Authorization: auth,
        "Content-Type": "application/json",
      },
    })
    .then((response) => {
      res.send(response.data);
    })
    .catch((err) => console.log(err));
});
app.post("/stk_callback", (req, res) => {
  console.log("data");
  console.log(req.body.Body.stkCallback.CallbackMetadata);
});

app.listen(PORT, () => {
  console.log(`Process running on http://localhost:${PORT}`);
});
