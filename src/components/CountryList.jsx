import styles from './CountryList.module.css';
import CountryItem from './CountryItem';
import Message from './Message';
import Spinner from './Spinner';

function CountryList({ cities, isLoading }) {
  if (isLoading) return <Spinner />;

  if (!cities.length)
    return <Message message="Add your first city by clicking on a city on the map." />;

  const countries = cities.reduce((arr, city) => {
    if (arr.map((el) => el.country).includes(city.country)) return arr;
    else return [...arr, { emoji: city.emoji, country: city.country }];
  }, []);

  return (
    <ul className={styles.countryList}>
      {countries.map((country, i) => (
        <CountryItem country={country} key={`country-${i}`} />
      ))}
    </ul>
  );
}

export default CountryList;
