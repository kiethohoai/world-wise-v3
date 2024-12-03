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

  async function createCity(newCity) {
    try {
      setIsLoading(true);
      const res = await fetch(`${API_URL}/cities`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newCity),
      });

      if (!res.ok) throw new Error(`Error while fetching city data.`);
      const data = await res.json();
      setCities((cities) => [...cities, data]);
    } catch (error) {
      alert(error.message);
    } finally {
      setTimeout(() => {
        setIsLoading(false);
      }, 500);
    }
  }

  async function deleteCity(id) {
    try {
      setIsLoading(true);
      await fetch(`${API_URL}/cities/${id}`, {
        method: 'DELETE',
      });
      setCities((cities) => cities.filter((city) => city.id !== id));
    } catch (error) {
      console.error(error.message);
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
    <CitiesContext.Provider
      value={{ cities, isLoading, currentCity, getCity, createCity, deleteCity }}
    >
      {children}
    </CitiesContext.Provider>
  );
}

export { CitiesContext, CitiesProvider };
