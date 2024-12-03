import { createContext, useEffect, useReducer } from 'react';

const API_URL = `http://localhost:8000`;
const CitiesContext = createContext();

const initialState = {
  cities: [],
  isLoading: false,
  currentCity: {},
  error: '',
};
const reducer = (state, action) => {
  switch (action.type) {
    case 'loading': {
      return {
        ...state,
        isLoading: true,
      };
    }

    case 'rejected': {
      return {
        ...state,
        isLoading: false,
        error: action.payload,
      };
    }

    case 'cities/loaded': {
      return {
        ...state,
        isLoading: false,
        cities: action.payload,
      };
    }

    case 'city/loaded': {
      return {
        ...state,
        isLoading: false,
        currentCity: action.payload,
      };
    }

    case 'city/created': {
      return {
        ...state,
        isLoading: false,
        cities: [...state.cities, action.payload],
        currentCity: action.payload,
      };
    }

    case 'city/deleted': {
      return {
        ...state,
        isLoading: false,
        cities: state.cities.filter((city) => city.id !== action.payload),
      };
    }

    default: {
      throw new Error('Unknow action');
    }
  }
};

function CitiesProvider({ children }) {
  const [{ cities, isLoading, currentCity, error }, dispatch] = useReducer(
    reducer,
    initialState,
  );

  // GET ALL CITIES
  useEffect(function () {
    let id;
    async function fetchCities() {
      dispatch({ type: 'loading' });
      try {
        const res = await fetch(`${API_URL}/cities`);
        if (!res.ok) throw new Error(`Error while fetching cities data.`);
        const data = await res.json();

        id = setTimeout(() => {
          dispatch({
            type: 'cities/loaded',
            payload: data,
          });
        }, 1000);
      } catch (error) {
        dispatch({ type: 'rejected', payload: error.message });
      }
    }

    fetchCities();
    return () => {
      clearTimeout(id);
    };
  }, []);

  // GET CURRENT CITY
  async function getCity(id) {
    if (+id === +currentCity.id) return;

    dispatch({ type: 'loading' });
    try {
      const res = await fetch(`${API_URL}/cities/${id}`);
      if (!res.ok) throw new Error(`Error while fetching city data.`);
      const data = await res.json();
      setTimeout(() => {
        dispatch({ type: 'city/loaded', payload: data });
      }, 1000);
    } catch (error) {
      dispatch({ type: 'rejected', payload: error.message });
    }
  }

  // CREATE CITY
  async function createCity(newCity) {
    try {
      dispatch({ type: 'loading' });
      const res = await fetch(`${API_URL}/cities`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newCity),
      });

      if (!res.ok) throw new Error(`Error while fetching city data.`);
      const data = await res.json();

      setTimeout(() => {
        dispatch({ type: 'city/created', payload: data });
      }, 1000);
    } catch (error) {
      dispatch({ type: 'rejected', payload: error.message });
    }
  }

  // DELETE CITY
  async function deleteCity(id) {
    try {
      dispatch({ type: 'loading' });
      await fetch(`${API_URL}/cities/${id}`, {
        method: 'DELETE',
      });
      setTimeout(() => {
        dispatch({ type: 'city/deleted', payload: id });
      }, 1000);
    } catch (error) {
      dispatch({ type: 'rejected', payload: error.message });
    }
  }

  return (
    <CitiesContext.Provider
      value={{ cities, isLoading, error, currentCity, getCity, createCity, deleteCity }}
    >
      {children}
    </CitiesContext.Provider>
  );
}

export { CitiesContext, CitiesProvider };
