import React from "react";
import PageActions from "../actions/PageActions";

class TextFormGroup extends React.Component {
  constructor(props) {
    super(props);
    this.pageActions = new PageActions();
  }

  handleChange() {
    var el = React.findDOMNode(this.refs.textbox);
    this.pageActions.changeWelcome(this.props.fieldname, el.value);
  }

  render() {
    return (
      <div className="form-group">
        <label htmlFor={this.props.fieldname}>{this.props.label}</label>
        <input onChange={this.handleChange.bind(this)} placeholder={this.props.label} ref="textbox" type="text" value={this.props.value}/>
      </div>
    );
  }
}

TextFormGroup.propTypes = {
  fieldname: React.PropTypes.string.isRequired,
  label: React.PropTypes.string.isRequired,
  value: React.PropTypes.string.isRequired
};

export default TextFormGroup;
