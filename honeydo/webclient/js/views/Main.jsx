import React from 'react';

import Header from '../components/Header.jsx';
import TaskList from '../components/TaskList.jsx';

export default class Main extends React.Component {
    render() {
      return (
        <div className="pagehost">
          <Header/>
          <div className="pagecontent">
            <TaskList/>
          </div>
        </div>
      );
    }
}
