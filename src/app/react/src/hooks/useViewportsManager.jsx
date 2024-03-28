import { useContext } from 'react';
import ViewportsManagerContext from '../contexts/ViewportsManagerContext';

export default function useViewportsManager() {
  return useContext(ViewportsManagerContext);
}