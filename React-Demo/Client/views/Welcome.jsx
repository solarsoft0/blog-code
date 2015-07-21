import React from 'react';

class Welcome extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            firstname: 'John',
            lastname: 'Doe'
        };
    }

    onSubmit() {
        alert(`Hello ${this.fullname}`); // eslint-disable-line no-alert
    }

    onChange() {
        this.setState({
            firstname: React.findDOMNode(this.refs.fn).value,
            lastname: React.findDOMNode(this.refs.ln).value
        });
    }

    get fullname() {
        return `${this.state.firstname} ${this.state.lastname}`;
    }

    render() {
        let submitHandler = event => { return this.onSubmit(event); };
        let changeHandler = event => { return this.onChange(event); };

        return (
          <section id="welcome">
            <h2>Welcome</h2>

            <form role="form" onSubmit={submitHandler}>
              <div className="form-group">
                <label htmlFor="firstname">First Name</label>
                <input className="form-control" onChange={changeHandler} placeholder="First Name" type="text" value={this.state.firstname} ref="fn"/>
              </div>
              <div className="form-group">
                <label htmlFor="lastname">Last Name</label>
                <input className="form-control" onChange={changeHandler} placeholder="Last Name" type="text" value={this.state.lastname} ref="ln"/>
              </div>
              <div className="form-group">
                <label>Full Name</label>
                <p className="help-block">{this.fullname}</p>
              </div>
              <button type="submit" className="btn btn-default">Submit</button>
            </form>
          </section>
      );
    }
}

export default Welcome;
