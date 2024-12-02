import { createContext, useEffect, useState } from 'react';

const API_URL = `http://localhost:8000`;
const CitiesContext = createContext();

function CitiesProvider({ children }) {
  const [cities, setCities] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

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
        }, 1500);
      }
    }

    fetchCities();
    return () => {
      clearTimeout(id);
    };
  }, []);

  return <CitiesContext.Provider value={{ cities, isLoading }}>{children}</CitiesContext.Provider>;
}

export { CitiesContext, CitiesProvider };
