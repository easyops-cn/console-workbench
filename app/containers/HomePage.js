import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Home from '../components/Home';
import { stopAllJobs } from '../actions/jobs';

function mapStateToProps(state) {
  return {
    jobIds: state.jobs.ids
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      stopAllJobs
    },
    dispatch
  );
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Home);
