import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import JobCreate from '../components/JobCreate';
import { updateJob, removeJob } from '../actions/jobs';

function mapStateToProps(state, ownProps) {
  return {
    job: state.jobs.entities[ownProps.match.params.id],
    isEdit: true
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      updateJob,
      removeJob
    },
    dispatch
  );
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(JobCreate);
