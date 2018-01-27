import { connect } from 'react-redux';
import actions from '../actions';
import TaskDetailsScreen from '../../screens/TaskDetailsScreen';

const newTask = (taskId) => {
    return {
        taskId,
        title: '',
        completed: false
    };
};

const mapStateToProps = (state) => {
    return {
        getItem: taskId => state.tasks.find(t => t.taskId === taskId) || newTask(taskId)
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        onSaveTask: (item) => dispatch(actions.tasks.saveTask(item))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(TaskDetailsScreen);
