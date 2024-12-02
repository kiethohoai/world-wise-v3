import { NavLink } from 'react-router-dom';
import styles from './CityItem.module.css';
import useCities from '../contexts/useCities';

const formatDate = (date) =>
  new Intl.DateTimeFormat('en', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    weekday: 'long',
  }).format(new Date(date));

function CityItem({ city }) {
  const { id, cityName, emoji, date, position } = city;
  const { currentCity } = useCities();

  return (
    <li>
      <NavLink
        to={`${id}?lat=${position.lat}&lng=${position.lng}`}
        className={`${styles.cityItem} ${id === currentCity.id ? styles['cityItem--active'] : ''}`}
      >
        <span className={styles.emoji}>{emoji}</span>
        <h3 className={styles.name}>{cityName}</h3>
        <time className={styles.date}>({formatDate(date)})</time>
        <button className={styles.deleteBtn}>✖</button>
      </NavLink>
    </li>
  );
}

export default CityItem;

// active
