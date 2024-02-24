import { useContext } from 'react';
import SelectorModeContext from '../contexts/SelectorModeContext';

export default function useSelectorMode() {
  return useContext(SelectorModeContext);
}