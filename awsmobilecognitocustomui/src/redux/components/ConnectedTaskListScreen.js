import { connect } from 'react-redux';
import actions from '../actions';
import TaskListScreen from '../../screens/TaskListScreen';

const mapStateToProps = (state) => {
    return {
        items: state.tasks,
        authState: state.auth.authState
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        onDeleteTask: (item) => dispatch(actions.tasks.deleteTask(item)),
        onSaveTask: (item) => dispatch(actions.tasks.saveTask(item)),
        onSetAuthState: (state, data) => dispatch(actions.auth.setAuthState({ state, data }))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(TaskListScreen);
