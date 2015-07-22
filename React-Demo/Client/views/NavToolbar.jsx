import React from 'react';
import Authenticator from './Authenticator.jsx';

class NavToolbar extends React.Component {
    render() {
        return (
          <div className="_navtoolbar">
            <ul>
              <li><Authenticator/></li>
            </ul>
          </div>
      );
    }
}

export default NavToolbar;
