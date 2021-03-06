import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Settings from '../components/Settings';
import { replaceJobs, stopJob } from '../actions/jobs';

function mapStateToProps(state) {
  return {
    jobs: state.jobs.ids.map(id => state.jobs.entities[id])
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      replaceJobs,
      stopJob
    },
    dispatch
  );
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Settings);
