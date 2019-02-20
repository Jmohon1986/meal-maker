// main page view which contains
// 1) a search component (with an input form, a + button and a submit button)
// 2) a saved recipes button that makes the saved recipe component drawer appear (with a saved recipes list and a saved recipe list item component)
// 3) text : 'Here a 10 great recipes for you!'
// 4) a recipe list component (with a recipe list item component) 

// login view which contains
// 1) a credential component (with username and password input forms, a login button and a signup button)
// 2) a recipe of the day video player component
// 3) a recipe instructions component (with a scrolling list of instructions)
import React from 'react';
import VideoPlayer from '../VideoPlayer.jsx';
import RecipeList from './RecipeList.jsx';
import SavedRecipes from './SavedRecipes.jsx';
import Search from './Search.jsx';
import RecipeInstructions from '../login/RecipeInstructions.jsx';

class Main extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      ingredients: ['apples', 'bananas', 'bread', 'crab', 'eggs', 'brocoli']
    };
  }

  render() {
    return (
      <div>
        <div className="logo">
          <img></img>
        </div>
        <h2>Hello Main</h2>
        <div className="search">
          <Search ingredientList={this.state.ingredients}></Search>
        </div>
        <div className="recipe-list">
          <RecipeList recipes={this.props.recipes}></RecipeList>
        </div>
        <div className="saved-recipes">
          <SavedRecipes savedRecipes={this.props.savedRecipes}></SavedRecipes>
        </div>
        <div className="recipe-of-the-day-container">
          <table>
            <tbody>
              <tr>
                <td className="vidPlayer"><VideoPlayer recipe={this.props.recipe}></VideoPlayer> </td>
                <td className="instructions"><RecipeInstructions recipe={this.props.recipe}></RecipeInstructions></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    );
  }
}

export default Main;
