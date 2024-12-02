import { useContext } from 'react';
import { CitiesContext } from './CitiesContext';

function useCities() {
  const context = useContext(CitiesContext);
  if (context === undefined) throw new Error(`Can't use CitiesContext outside the CitiesProvider`);
  return context;
}

export default useCities;
