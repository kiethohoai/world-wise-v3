import { Link } from 'react-router-dom';
import PageNav from '../components/PageNav';

function Homepage() {
  return (
    <div>
      <PageNav />
      <h1>WORLWISE APP</h1>
      <Link to="/app">Go to the APP</Link>
    </div>
  );
}

export default Homepage;
