import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import JobCreate from '../components/JobCreate';
import { addJob } from '../actions/jobs';

function mapStateToProps(state) {
  return {
    isEdit: false,
    jobs: state.jobs.ids.map(id => state.jobs.entities[id])
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      addJob
    },
    dispatch
  );
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(JobCreate);
