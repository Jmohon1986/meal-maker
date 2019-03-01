// component with an input form, a + button and a submit button

import React, { Component, Fragment } from 'react';
import ChatBot from 'react-simple-chatbot';
import VideoPlayer from '../VideoPlayer.jsx';
import RecipeInstructions from '../login/RecipeInstructions.jsx';
import RecipeList from './RecipeList.jsx';
import AutoComplete from './AutoComplete.jsx';


// eslint-disable-next-line react/prefer-stateless-function
class Search extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    const {
      recipeOfTheDay, recipes, getRecipes, ingredients, saveRecipe, saveDislikeRecipe, selectRecipe, changeView, user, unwantedIngredients, wantedIngredients, getRestrictions,
    } = this.props;
    return (
      <div>
        <h2 className="Lobster">
          Welcome,
          {user}
        </h2>
        <ChatBot
          steps={[
            {
              id: 'hello-world',
              message: `Hi ${user}, nice to meet you!`,
              end: true,
            },
          ]}
        />
        <h2 align="center">Search for a recipe</h2>
        <div className="Search-Comp">
          <AutoComplete ingredients={ingredients} addIngredient={this.addIngredient} getRecipes={getRecipes} unwantedIngredients={unwantedIngredients} wantedIngredients={wantedIngredients} getRestrictions={getRestrictions} />
        </div>

        <div className="test">
          <RecipeList recipes={recipes} saveRecipe={saveRecipe} saveDislikeRecipe={saveDislikeRecipe} selectRecipe={selectRecipe} changeView={changeView} />
        </div>

        <h3 id="recipeTitle">Recipe of the day</h3>
        <div className="recipe-of-the-day-container">
          <table>
            <tbody>
              <tr>
                <td className="vidPlayer"><VideoPlayer recipe={recipeOfTheDay} /></td>
                <td className="instructions"><RecipeInstructions recipe={recipeOfTheDay} /></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    );
  }
}

export default Search;
