import React from "react";
import pageStore from "../stores/PageStore";
import TextFormGroup from "./TextFormGroup.jsx";

class WelcomePage extends React.Component {
  constructor(props) {
    super(props);

    // Initialize the state of the component
    this.state = {
      firstname: pageStore.welcome.firstname,
      lastname: pageStore.welcome.lastname
    };

    // Listen to changes from the store and adjust for changes
    pageStore.listenForChanges(() => { this.handleStateUpdate(); });
  }

  componentDidMount() {
    this.handleStateUpdate();
  }

  handleStateUpdate() {
    if (this.isMounted()) {
      this.setState({
        firstname: pageStore.welcome.firstname,
        lastname: pageStore.welcome.lastname
      });
    }
  }

  onClick() {
    alert(`Hello ${this.state.firstname} ${this.state.lastname}`); //eslint-disable-line no-alert
  }

  render() {
    var fullname = `${this.state.firstname} ${this.state.lastname}`;

    return (
      <section>
        <h2>Welcome to the React Navigation App!</h2>

        <form role="form">
          <TextFormGroup fieldname="firstname" label="First Name" value={this.state.firstname}/>
          <TextFormGroup fieldname="lastname" label="Last Name" value={this.state.lastname}/>
          <div className="form-group">
            <label>Full Name</label>
            <p className="help-block">{fullname}</p>
          </div>
          <button className="btn btn-default" type="submit" onClick={this.onClick.bind(this)}>Submit</button>
        </form>
      </section>
    );
  }
}

export default WelcomePage;
