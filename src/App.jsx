import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Product from './pages/Product';
import Homepage from './pages/Homepage';
import Pricing from './pages/Pricing';
import PageNotFound from './pages/PageNotFound';
import AppLayout from './pages/AppLayout';
import CityList from './components/CityList';
import { useEffect, useState } from 'react';
import CountryList from './components/CountryList';

const API_URL = `http://localhost:8000`;

function App() {
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
        }, 500);
      }
    }

    fetchCities();
    return () => {
      clearTimeout(id);
    };
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="product" element={<Product />} />
        <Route path="pricing" element={<Pricing />} />
        <Route path="app" element={<AppLayout />}>
          <Route
            index
            element={<CityList cities={cities} isLoading={isLoading} />}
          />
          <Route
            path="cities"
            element={<CityList cities={cities} isLoading={isLoading} />}
          />
          <Route
            path="countries"
            element={<CountryList cities={cities} isLoading={isLoading} />}
          />
          <Route path="form" element={<h1>FORM</h1>} />
        </Route>

        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
