import { connect } from 'react-redux';
import Home from '../components/Home';

function mapStateToProps(state) {
  return {
    jobIds: state.jobs.ids
  };
}

export default connect(mapStateToProps)(Home);
