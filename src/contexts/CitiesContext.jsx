import { createContext, useEffect, useState } from 'react';

const API_URL = `http://localhost:8000`;
const CitiesContext = createContext();

function CitiesProvider({ children }) {
  const [cities, setCities] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentCity, setCurrentCity] = useState({});

  async function getCity(id) {
    try {
      setIsLoading(true);
      const res = await fetch(`${API_URL}/cities/${id}`);
      if (!res.ok) throw new Error(`Error while fetching city data.`);
      const data = await res.json();
      setCurrentCity(data);
    } catch (error) {
      alert(error.message);
    } finally {
      setTimeout(() => {
        setIsLoading(false);
      }, 500);
    }
  }

  useEffect(function () {
    let id;
    async function fetchCities() {
      try {
        setIsLoading(true);
        const res = await fetch(`${API_URL}/cities`);
        if (!res.ok) throw new Error(`Error while fetching cities data.`);
        const data = await res.json();
        setCities(data);
      } catch (error) {
        alert(error.message);
      } finally {
        id = setTimeout(() => {
          setIsLoading(false);
        }, 1000);
      }
    }

    fetchCities();
    return () => {
      clearTimeout(id);
    };
  }, []);

  return (
    <CitiesContext.Provider value={{ cities, isLoading, currentCity, getCity }}>
      {children}
    </CitiesContext.Provider>
  );
}

export { CitiesContext, CitiesProvider };
