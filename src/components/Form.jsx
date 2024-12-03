// "https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=0&longitude=0"

import { useEffect, useState } from 'react';
import styles from './Form.module.css';
import Button from './Button';
import ButtonBack from './ButtonBack';
import { useUrlPosition } from '../hooks/useUrlPosition';
import Message from './Message';
import Spinner from './Spinner';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import useCities from '../contexts/useCities';
import { useNavigate } from 'react-router-dom';

const BASE_URL = 'https://api.bigdatacloud.net/data/reverse-geocode-client';

/* 
export function convertToEmoji(countryCode) {
  const codePoints = countryCode
    .toUpperCase()
    .split('')
    .map((char) => 127397 + char.charCodeAt());
  return String.fromCodePoint(...codePoints);
} */

function Form() {
  const navigate = useNavigate();
  const [cityName, setCityName] = useState('');
  const [country, setCountry] = useState('');
  const [date, setDate] = useState(new Date());
  const [notes, setNotes] = useState('');
  const [lat, lng] = useUrlPosition();
  const [isLoadingGeocoding, setIsLoadingGeocoding] = useState(false);
  const emoji = '✈';
  const [goecodingError, setGoecodingError] = useState('');
  const { createCity, isLoading } = useCities();

  useEffect(() => {
    if (!lat && !lng) return;

    async function fetchCityData() {
      try {
        setGoecodingError('');
        setIsLoadingGeocoding(true);
        const res = await fetch(`${BASE_URL}?latitude=${lat}&longitude=${lng}`);
        const data = await res.json();

        if (!data.countryCode)
          throw new Error(`That's doesn't seem to be a city. Click somewhere else.`);
        setCityName(data.city || data.locality || '');
        setCountry(data.countryName);
      } catch (error) {
        console.error(`🚀error:`, error);
        setGoecodingError(error.message);
      } finally {
        setIsLoadingGeocoding(false);
      }
    }
    fetchCityData();
  }, [lat, lng]);

  async function handleSubmit(e) {
    // Guard
    e.preventDefault();
    if (!cityName || !date) return;

    // Form Data
    const newCity = {
      cityName,
      country,
      emoji,
      date,
      notes,
      position: { lat, lng },
    };
    await createCity(newCity);
    navigate('/app/cities');
  }

  if (isLoadingGeocoding) return <Spinner />;

  if (goecodingError) return <Message message={goecodingError} />;

  if (!lat && !lng)
    return <Message message={`Start by clicking somewhere else on the map.`} />;

  return (
    <form
      className={`${styles.form} ${isLoading ? styles.loading : ''}`}
      onSubmit={handleSubmit}
    >
      <div className={styles.row}>
        <label htmlFor="cityName">City name</label>
        <input
          id="cityName"
          onChange={(e) => setCityName(e.target.value)}
          value={cityName}
        />
        <span className={styles.flag}>{emoji}</span>
      </div>

      <div className={styles.row}>
        <label htmlFor="date">When did you go to {cityName}?</label>
        <DatePicker
          id="date"
          dateFormat={`dd/MM/yyyy`}
          selected={date}
          onSelect={date}
          onChange={(date) => setDate(date)}
        />

        {/* <input id="date" onChange={(e) => setDate(e.target.value)} value={date} /> */}
      </div>

      <div className={styles.row}>
        <label htmlFor="notes">Notes about your trip to {cityName}</label>
        <textarea id="notes" onChange={(e) => setNotes(e.target.value)} value={notes} />
      </div>

      <div className={styles.buttons}>
        <Button type="primary">Add</Button>
        <ButtonBack />
      </div>
    </form>
  );
}

export default Form;
