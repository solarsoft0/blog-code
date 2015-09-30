import React from 'react';

/**
 * React Component to Absolute Center the containing children.
 *
 * @class AbsoluteCenter
 * @constructor
 */
export default class AbsoluteCenter extends React.Component {
  static propTypes = {
      children: React.PropTypes.any
  };

  render() {
    return (
      <div className="absolutecenter">
        <div>{this.props.children}</div>
      </div>
    );
  }
}
