// Helper functions interacting with APIs
// 1) Helper interacting with the Receipe-Food-Nutrition api => retrieving receipes based on a list of ingredients
// 2) Helper interacting with the Youtube api => retrieving a video (top result) based on a search with a name of receipe
// 3) Helper interacting with the MealDB api => retrieving a list of all ingredients available in the MealDB api (optional)

const hash = require('hash-sum');
const axios = require('axios');
const _ = require('lodash');

// where api key was imported from, might need to make your own file
// const keys = require('./keys');
// make .env files locally to assign api keys (see .env.example)

let a;
let b;
// search for videos based on the query

const youTubeApi = (query, callback) => axios({
  method: 'get',
  url: `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&key=${process.env.YOUTUBE_API_KEY}&q=${query}&maxResults=1`,
}).then((searchResults) => {
  // preform a callback with the first object full of video data from the search results
  callback(null, searchResults.data.items[0]);
}).catch((err) => {
  // console.log(err);
  callback(err, null);
});


const findRecipeIdOfUnwantedIngredients = (unwantedIngredients, callback) => {
  if (!callback) {
    return Error('Function requires callback!!!');
  }
  if (!unwantedIngredients) {
    callback(null, undefined);
  }
  return axios({
    method: 'get',
    headers: {
      'X-RapidAPI-Key': '2ec86674c2msh2b69061509e314bp1a1e51jsn9c448f4a87ea',
    },
    url: `https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/recipes/search?excludeIngredients=${unwantedIngredients}&number=100`
    ,
  }).then((result) => {
    // console.log(result.data.results);
    const recipeId = [];
    _.forEach(result.data.results, (recipe) => {
      recipeId.push(recipe.id);
    });
    callback(null, recipeId);
    a = recipeId;
    // console.log(acceptedRecipies, 'apiHelper!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!');
  }).catch(() => {
    console.log(505);
  });
};


const recFoodNutrApi = async (ingredients, callback) => {
  if (!callback) {
    return Error('Function requires callback!!!');
  }
  // get 20 recipies based upon input ingredients
  await axios({
    method: 'get',
    headers: {
      'X-RapidAPI-Key': '2ec86674c2msh2b69061509e314bp1a1e51jsn9c448f4a87ea',
    },
    url: `https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/recipes/searchComplex?includeIngredients=${ingredients}&ranking=1&fillIngredients=true&instructionsRequired=true&addRecipeInformation=true&limitLicense=true&offset=0&number=100`,
  }).then((result) => {
    // return sorted and reversed recipies array
    // console.log(result.data.results.id, '!!!!!!!!!!!!!!!!!!!!??????????????????????????????????????????? apiHelper');
    const recipes = [];
    const acceptedRecipies = [];
    _.forEach(result.data.results, (recipe) => {
      // object to store recipe info
      // console.log(recipe.id, '?????????????????!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!????????????????');
      acceptedRecipies.push(recipe.id);
      //   const recipeInfo = {};
      //   recipeInfo.name = recipe.title;
      //   recipeInfo.recipeId = recipe.id;
      //   recipeInfo.cookTime = recipe.readyInMinutes;
      //   recipeInfo.image = recipe.image;
      //   recipeInfo.instructions = _.map(recipe.analyzedInstructions[0].steps, instruction => instruction.step);
      //   recipeInfo.ingredients = {};
      //   recipeInfo.ingredients.missedIngredients = _.map(recipe.missedIngredients, ingredient => ingredient.originalString);
      //   recipeInfo.ingredients.usedIngredients = _.map(recipe.usedIngredients, ingredient => ingredient.originalString);
      //   recipeInfo.ingredients.unusedIngredients = _.map(recipe.unusedIngredients, ingredient => ingredient.originalString);
      //   recipeInfo.ingredients.allIngredients = [];
      //   _.forEach(recipeInfo.ingredients, (ingredientList, key) => {
      //     if (key !== 'unusedIngredients') {
      //       _.forEach(ingredientList, (ingredient) => {
      //         if (!_.includes(recipeInfo.ingredients.allIngredients, ingredient)) {
      //           recipeInfo.ingredients.allIngredients.push(ingredient);
      //         }
      //       });
      //     }
      //   });

      //   recipeInfo.percentage = Math.round(recipeInfo.ingredients.usedIngredients.length / recipeInfo.ingredients.allIngredients.length * 100);
      //   return youTubeApi(`cook ${recipeInfo.name}`, (err, video) => {
      //     recipeInfo.videoId = video.id.videoId;
      //     recipes.push(recipeInfo);
      //     // console.log(recipes);
      //     if (index === result.data.results.length - 1) {
      //       // return callback(null, recipes);
      //     }
      //   });
      // });
    });
    // console.log(acceptedRecipies, '!!!!!!!!!!!!@2222222222222222!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!');
    callback(null, acceptedRecipies);
    console.log(a);
    return findRecipeIdOfUnwantedIngredients();
  }).catch(err => callback(err, null));
};


const rfnRandomRecipe = (callback) => {
  // get request for random recipe
  axios({
    method: 'get',
    headers: {
      'X-RapidAPI-Key': process.env.RECIPE_FOOD_NUTRITION_API_KEY
      ,
    },
    url: 'https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/recipes/random?number=1&limitLicense=false',
  }).then((recipe) => {
    // create object for storing vital recipe information
    const receipeInfo = {};
    // get recipe name/title
    receipeInfo.name = recipe.data.recipes[0].title;
    // get recipe id as it is in the rfn api
    receipeInfo.recipeId = recipe.data.recipes[0].id;
    // get recipe cooktime
    receipeInfo.cookTime = recipe.data.recipes[0].readyInMinutes;
    // get recipe instructions
    receipeInfo.instructions = _.map(recipe.data.recipes[0].analyzedInstructions[0].steps, (step, stepNumber) => step.step).join('\n');
    // get recipe ingredients
    receipeInfo.ingredients = _.map(recipe.data.recipes[0].extendedIngredients, (ingredient, index) => ingredient.originalString).join('\n');
    // get recipe image
    receipeInfo.recipeImage = recipe.data.recipes[0].image;
    // do a quick search to get a youtube video on preparation of the dish
    youTubeApi(`cook ${receipeInfo.name}`, (anError, video) => {
      if (anError) {
        return callback(anError, null);
      }
      // store video info and current date then preform the callback
      receipeInfo.videoInfo = video;
      receipeInfo.date = new Date().getDate();
      return callback(null, receipeInfo);
    });
  }).catch((err) => {
    callback(err, null);
  });
};

// request recipe info by id
const rfnSingleRecipe = (recipeId, callback) => axios({
  method: 'get',
  headers: {
    'X-RapidAPI-Key': process.env.RECIPE_FOOD_NUTRITION_API_KEY,
  },
  url: `https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/recipes/${recipeId}/information`,
}).then((recipe) => {
  // object to be returned and that recipe info is stored within
  const recipeInfo = {};
  recipeInfo.name = recipe.data.title;
  recipeInfo.recipeId = recipe.data.id;
  recipeInfo.cookTime = recipe.data.readyInMinutes;
  recipeInfo.image = recipe.data.image;
  recipeInfo.instructions = _.map(recipe.data.analyzedInstructions[0].steps, step => step.step)
    .join('\n');
  recipeInfo.ingredients = _.map(recipe.data.extendedIngredients,
    ingredient => ingredient.originalString);

  // get recipe video and return the recipe info
  youTubeApi(`cook ${recipeInfo.name}`, (youtubeError, video) => {
    if (youtubeError) {
      return callback(youtubeError, null);
    }
    recipeInfo.link = video.id.videoId;
    return callback(null, recipeInfo);
  });
}).catch((err) => {
  callback(err, null);
});
// get all ingredients

const mealDBIngredientSearch = callback => axios({
  method: 'get',
  url: 'https://www.themealdb.com/api/json/v1/1/list.php?i=list',
}).then((ingredients) => {
  // sort ingredients alphabetically
  const arrayOfIngredients = _.sortBy(_.map(ingredients.data.meals, (ingredient, index) => ingredient.strIngredient));
  // return the callback on ingredients
  return callback(null, arrayOfIngredients);
}).catch(err => callback(err, null));

const autoComplete = async (term) => {
  const instantList = await axios({
    method: 'get',
    url: `https://trackapi.nutritionix.com/v2/search/instant?query=${term}`,
    headers:
   {
     'cache-control': 'no-cache',
     'Content-Type': 'application/json',
     'x-remote-user-id': '0',
     'x-app-id': process.env.IX_APP_ID,
     'x-app-key': process.env.NIX_API,
   },
  });
  return instantList;
};


const hasher = password => hash(password);

module.exports = {
  recFoodNutrApi,
  mealDBIngredientSearch,
  youTubeApi,
  rfnRandomRecipe,
  hasher,
  rfnSingleRecipe,
  autoComplete,
  findRecipeIdOfUnwantedIngredients,
};
