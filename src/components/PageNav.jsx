import { NavLink } from 'react-router-dom';
import styles from './PageNav.module.css';
import Logo from './Logo';
import useAuth from '../contexts/useAuth';

function PageNav() {
  const { isAuthenticated } = useAuth();

  return (
    <nav className={styles.nav}>
      <Logo />
      <ul>
        <li>
          <NavLink to="/pricing">Pricing</NavLink>
        </li>
        <li>
          <NavLink to="/product">Product</NavLink>
        </li>
        <li>
          <NavLink to={isAuthenticated ? '/app' : '/login'} className={styles.ctaLink}>
            Login
          </NavLink>
        </li>
      </ul>
    </nav>
  );
}

export default PageNav;
