import React from "react";

class NavBrand extends React.Component {
    render() {
      return (
        <div className="_navbrand_outer">
          <div className="_navbrand_inner">
            <h1>React Demo</h1>
          </div>
        </div>
      );
    }
}

NavBrand.propTypes = {
  title: React.PropTypes.string.isRequired
};

export default NavBrand;
