import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Home from '../components/Home';
import { initialJobs, addJob } from '../actions/jobs';

function mapStateToProps(state) {
  return {
    jobs: state.jobs.ids.map(id => state.jobs.entities[id])
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ initialJobs, addJob }, dispatch);
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Home);
