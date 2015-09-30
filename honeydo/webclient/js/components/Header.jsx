import React from 'react';
import TaskSyncStatus from './TaskSyncStatus.jsx';
import AddTask from './AddTask.jsx';

/**
 * React Component to render the header bar
 *
 * @class Header
 * @constructor
 */
export default class Header extends React.Component {
  render() {
    return (
      <header>
       <div className="buttons">
         <ul className="left">
          <li><TaskSyncStatus/></li>
         </ul>
       </div>
       <div className="title">
         <div className="headerTitle">
           <div>
             <h1>HoneyDo</h1>
           </div>
         </div>
       </div>
       <div className="buttons">
         <ul className="right">
           <li><AddTask/></li>
         </ul>
       </div>
      </header>
    );
  }
}
