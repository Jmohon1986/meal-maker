// component (with username and password input forms, a login button and a signup button)
import React from 'react';

class Credentials extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      email: "",
      password: ""
    };
  }

  // validateForm() {
  //   return this.state.email.length > 0 && this.state.password.length > 0;
  // }

  // handleChange = event => {
  //   this.setState({
  //     [event.target.id]: event.target.value
  //   });
  // }

  // handleSubmit = event => {
  //   event.preventDefault();
  // }

  render() {



    // <div className="Login">
    //   <form onSubmit={this.handleSubmit}>
    //     Username: <input type="text" name="username"> </input>
    //     Password: <input type="text" name="password"> </input>
    //   </form>
    //   <button type="submit"> Login </button>
    //   <button type="submit"> Sign Up </button>
    // </div>


    return (
      <form>
      <input type="text" name="username" placeholder="Username"/>
      <input type="text" name="password" placeholder="Password" />
        <input type="submit" value="Login" />
        <input type="submit" value="Sign Up" />
      </form>
    );
  }
}
export default Credentials;
