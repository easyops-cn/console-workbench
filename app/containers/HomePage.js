import { connect } from 'react-redux';
import Home from '../components/Home';

function mapStateToProps(state) {
  return {
    jobs: state.jobs.ids.map(id => state.jobs.entities[id])
  };
}

export default connect(mapStateToProps)(Home);
