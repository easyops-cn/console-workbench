import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import JobLinks from '../components/JobLinks';
import { updateJob, removeJob } from '../actions/jobs';

function mapStateToProps(state, ownProps) {
  return {
    job: state.jobs.entities[ownProps.match.params.id]
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
)(JobLinks);
