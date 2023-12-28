require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const { SERVER_PORT, rollBarAccessToken } = process.env;
const path = require('path');
let options = require("../server/controller");

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

app.use(express.static(__dirname + '/public'));

app.get(`/letscook/api/search/`, getRecipes);
app.get(`/letscook/api/recipe/`, getRecipeDetails);
app.get(`/letscook/api/list/`, getList);
app.post(`/letscook/api/ingredients/`, addToShoppingList);


app.listen(SERVER_PORT, () => console.log(`Order up on ${SERVER_PORT}`));
