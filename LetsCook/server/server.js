require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const { SERVER_PORT, rollBarAccessToken } = process.env;
let options = require("./controller");
const baseURL = "http://127.0.0.1:8080";

app.use(express.json());
app.use(cors());

const {
  getRecipes,
  getRecipeDetails,
  addToShoppingList,
  getList,
} = require("./controller");

var Rollbar = require("rollbar");
var rollbar = new Rollbar({
  accessToken: rollBarAccessToken,
  captureUncaught: true,
  captureUnhandledRejections: true,
});
rollbar.log("Hello world!");

app.get('/', (req, res) => {
  res.sendFile(__dirname + '../public/index.html');
});
app.get(`/letscook/api/search/`, getRecipes);
app.get(`/letscook/api/recipe/`, getRecipeDetails);
app.get(`/letscook/api/list/`, getList);
app.post(`/letscook/api/ingredients/`, addToShoppingList);


app.listen(SERVER_PORT, () => console.log(`Order up on ${SERVER_PORT}`));
