// main server file where server setup is done using Express and with request handler functions

// 1) Request handler for a GET request from client with ingredients as params => will call Nutrition helper then send back results to client
// 2) Request handler for a GET request from client with a Receipe name (clicked on client side) => will call Youtube helper 
// 3) Request handler for a GET request from client on main page endpoint => compare current date & Ingredients table update date from DB

const axios = require('axios');
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');
const helper = require('../helpers/apiHelpers');
const db = require('../helpers/dbHelpers');
const _ = require('lodash');

const app = express();

// Probably not needed //
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + '../client/'));
// Needed for React at Some Point // 
// app.use(express.static(path.join(__dirname, [REACT DIRECTORY])));

app.get('/', (req, res) => {
  fs.readFile(path.join(__dirname, '../client/src/example_rfn_data.json'), 'utf-8', (err, res2) => {
    res.send(res2);
  });
});

// get recipies depending upon passed in ingredients //
app.get('/food', (req, res) => {
  helper.recFoodNutrApi(req.query.ingredients, (err, recipes) => {
    if (err) {
      res.status(500).send('Something went wrong!');
    }
    // respond with an array of objects which contain recipie information
    res.status(200).send(recipes);
  });
});

// get all ingredients stored in the MealDB //
app.get('/ingredients', (req, res) => {
  helper.mealDBIngredientSearch((err, ingredients) => {
    if (err) {
      res.status(500).send('Something went wrong!');
    }
    // get all current ingredients stored in our own database
    db.selectAllIngredients((tableData) => {
      _.forEach(ingredients, (newIngredient, index) => {
        // see if potential new ingredient already exists in database
        const priorInstances = _.filter(tableData, (oldIngredient, index) => {
          return oldIngredient.ingredient === newIngredient;
        }).length;
        // save if it doesn't
        if (priorInstances === 0) {
          db.saveIngredient(newIngredient);
        } 
      });
    });
    // send back ingredients regardless of whether or not they were new
    res.send(ingredients);
  });
});

// get a random recipe
app.get('/random', (req, res) => {
  helper.rfnRandomRecipe((err, recipe) => {
    if (err) {
      return res.status(500).send('Something Went Wrong!');
    }
    db.selectAllRecipeOfTheDay((err, pastRecipes) => {
      if (err) {
        return res.status(500).send('Something Went Wrong!');
      }
      // if (pastRecipes.length === 0) {
      //   console.log(recipe);
      //   db.saveRecipeOfTheDay(recipe.videoInfo.id.videoId, null, recipe.date);
      // }
    })
    db.selectAllRecipes((err, recipes) => {
      if (err) {
        return res.status(500).send('Something Went Wrong!');
      }
      const priorInstances = _.filter(recipes, (savedRecipe, index) => {
        return savedRecipe.recipe === recipe.name;
      }).length;
      if (priorInstances === 0) {
        return db.saveRecipe(recipe.name, recipe.recipeId, (err, response) => {
          if (err) {
            return res.status(500).send('Something Went Wrong!');
          }
          return res.status(200).send(recipe);
        });
      }
      return res.status(200).send(recipe);
    });
  });
});

// get a single youtube video from a search query
app.get('/search', (req, res) => {
  helper.youTubeApi(req.query.q, (err, searchResult) => {
    if (err) {
      return res.status(500).send("Something went wrong!");
    }
    // send back the video inforamtion
    res.status(200).send(searchResult);
  });
});

// Able to set port and still work //
const port = process.env.PORT || 3001;

// Listen and console log current port //
app.listen(port, () => {
  console.log(`listening on port ${port}!`);
});
