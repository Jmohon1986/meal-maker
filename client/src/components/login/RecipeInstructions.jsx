// component with a list of instructions for the recipe of the day which can be scrolled
import React from 'react';
import Paper from '@material-ui/core/Paper';
import { ListItemText } from '@material-ui/core';
import { inflate } from 'zlib';

class RecipeInstructions extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentVideo: props.recipe,
    };
  }

  // componentDidMount() {
  //   this.setState({
  //     currentVideo: this.props.recipe,
  //   })
  // }

  render() {
    const { currentVideo } = this.state;
    console.log(currentVideo);
    // if (Arrayis)
    let steps;
    if (typeof (currentVideo.instructions) === 'string') {
      steps = currentVideo.instructions.split('\n');
    } else {
      steps = currentVideo[0].instructions;
    }
    console.log(steps, 'here');
    // debugger;
    return (
      <div className="instructions-list">
        <h3>{currentVideo.name}</h3>
        {/* <Paper style={{ maxHeight: 250, overflow: 'auto' }}> */}
          <b>Cook Time: </b>
          {currentVideo.cookTime}
          {' '}
          minutes
          <br />
          <b>Ingredients: </b>
          {currentVideo.ingredients}
          <br />
          {/* {currentVideo.instructions} */}
          <b>Instructions: </b>
          <ul>
            { steps.map(step => <li key={step}>{ step }</li>) }
          </ul>
        {/* </Paper> */}
      </div>
    );
  }
}
export default RecipeInstructions;
