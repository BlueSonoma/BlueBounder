import AppStateContext from '../contexts/AppStateContext';
import { useContext } from 'react';

export default function useAppState() {
  return useContext(AppStateContext);
}