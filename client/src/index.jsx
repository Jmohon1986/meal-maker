/* eslint-disable class-methods-use-this */
// rendering all components
/* eslint import/extensions: 0 */
import React from 'react';
import ReactDOM from 'react-dom';
// import { BrowserRouter, Route, Link } from 'react-router-dom';
import axios from 'axios';
import Login from './components/login/Login.jsx';
import Recipe from './components/Recipe.jsx';
import sampleData from './example_rfn_data';
import Credentials from './components/login/Credentials.jsx';
import RecipeInstructions from './components/login/RecipeInstructions.jsx';
import VideoPlayer from './components/VideoPlayer.jsx';
import randomRecipe from '../example_random.js';
import Main from './components/main/Main.jsx';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      recipes: [],
      recipeOfTheDay: randomRecipe, // recipe of the day video
      savedRecipes: [],
      ingredients: [],
      userId: 1,
      selectedRecipe: randomRecipe,
      authorized: false,
      show: 'login',
      // show: 'search',
    };
    this.getRandomRecipe = this.getRandomRecipe.bind(this);
    this.getRecipes = this.getRecipes.bind(this);
    this.getSavedRecipes = this.getSavedRecipes.bind(this);
    this.saveRecipe = this.saveRecipe.bind(this);
    this.saveDislikeRecipe = this.saveDislikeRecipe.bind(this);
    this.selectRecipe = this.selectRecipe.bind(this);
    this.signUp = this.signUp.bind(this);
    this.login = this.login.bind(this);
  }

  componentDidMount() {
    // let mainComponent = 'login';
    this.getRandomRecipe();
    // this.getSavedRecipes();
    this.grabIngredients();
    if (this.state.authorized) {
      this.setState({
        show: 'main',
      });
    // } else {
    //   mainComponent = 'login';
    }
  }

  // function to retrieve recipes to display
  getRecipes(ingredients) {
    return axios.get('/food', {
      params: {
        ingredients,
      },
    }) // sends a GET request to serve at endpoint '/food'
      .then((results) => {
        this.setState({ // change the state
          recipes: results.data, // by making the data received back fron the server available
        });
      }).catch((err) => {
        console.log(err, 'error while retrieving data from server');
      });
  }

  getRandomRecipe() {
    return axios.get('/recipeoftheday') // sends get request to server for random recipe
      .then((recipe) => {
        this.setState({
          recipeOfTheDay: recipe.data,
        });
      })
      .catch((err) => {
        console.log(`there was an error retriving random recipe : ${err}`);
      });
  }

  getSavedRecipes() {
    const { userId } = this.state;
    // debugger;
    return axios.get('/savedrecipes', {
      params: {
        userId,
      },
    }) // sends get request to server for saved recipes
      .then((results) => {
        // console.log(results);
        this.setState({
          savedRecipes: results.data,
        });
      })
      .catch((err) => {
        console.log(`there was an error retrieving saved recipes : ${err}`);
      });
  }

  // gets all ingredients saved to db to for autocomplete component
  grabIngredients() {
    // console.log('grabbing');
    axios.get('/ingredients')
      .then((allIngOptions) => {
        console.log(Array.isArray(allIngOptions.data), 'Opt');
        this.setState({
          ingredients: allIngOptions.data,
        });
      })
      .catch((err) => {
        console.log('error in getting all ingredients');
      });
  }

  // sends a POST request to serve at endpoint '/toBeSaved'
  // eslint-disable-next-line class-methods-use-this
  saveRecipe(recipe) {
    const { userId } = this.state;
    return axios.post('/toBeSaved', {
      userId,
      recipeId: recipe.recipeId,
    })
      .then((result) => {
      }).catch((err) => {
        console.log(err, 'error while trying to save recipe into DB');
      });
  }

  // sends a POST request to serve at endpoint '/toBeSaved'
  // eslint-disable-next-line class-methods-use-this
  saveDislikeRecipe(recipe) {
    const { userId } = this.state;
    return axios.post('/toBeSavedDislike', {
      userId,
      recipeId: recipe.recipeId,
    })
      .then((result) => {
        console.log(result);
      }).catch((err) => {
        console.log(err, 'error while trying to save recipe into DB');
      });
  }

  selectRecipe(recipe) {
    this.setState({
      selectedRecipe: recipe,
    })
  }

  signUp(user, pw) {
    console.log(`thank you for signing up, ${user}`);
    console.log(`Hello, ${user}`);
    axios.post('/signup', {
      params: {
        username: user,
        password: pw,
      },
    })
      .then(() => {
        this.setState({
          authorized: true,
        });
      })
      .catch((bool) => {
        console.log('could not log in');
      });
  }

  login(user, pw) {
    console.log('logged in');
    console.log(`Hello, ${user}`);
    axios.post('/login', {
      params: {
        username: user,
        password: pw,
      },
    })
      .then(() => {
        this.setState({
          authorized: true,
        });
      })
      .catch(() => {
        console.log('could not sign up');
      });
  }

  render() {
    console.log(this);
    const { recipeOfTheDay, selectedRecipe, savedRecipes, recipes, ingredients } = this.state;
    return (
      // <BrowserRouter>
      //   <Route path="/login" component={Login} />
      // </BrowserRouter>
      <div>
        <div>
          <Login recipe={recipeOfTheDay} signUp={this.signUp} login={this.login} />
        </div>
        <div>
          <Main
            recipes={recipes}
            recipeOfTheDay={recipeOfTheDay}
            selectedRecipe={selectedRecipe}
            savedRecipes={savedRecipes}
            ingredients={ingredients}
            getRecipes={this.getRecipes}
            saveRecipe={this.saveRecipe}
            saveDislikeRecipe={this.saveDislikeRecipe}
            getSavedRecipes={this.getSavedRecipes}
            selectRecipe={this.selectRecipe}
          />
        </div>
      </div>
    );
  }
}

ReactDOM.render(<App />, document.getElementById('app'));
