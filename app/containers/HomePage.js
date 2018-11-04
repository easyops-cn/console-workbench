import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Home from '../components/Home';
import * as JobsAction from '../actions/jobs';

function mapStateToProps(state) {
  return {
    jobs: state.jobs
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(JobsAction, dispatch);
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Home);
