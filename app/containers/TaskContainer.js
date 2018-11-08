import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Task from '../components/Task';
import {
  startJob,
  stopJob,
  clearJobOutput,
  activateJob
} from '../actions/jobs';
import printable from '../utils/printable';

function mapStateToProps(state, ownProps) {
  return {
    job: state.jobs.entities[ownProps.jobId],
    output: state.jobs.outputs[ownProps.jobId] || printable(),
    active: state.jobs.active === ownProps.jobId
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      startJob,
      stopJob,
      clearJobOutput,
      activateJob
    },
    dispatch
  );
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Task);
