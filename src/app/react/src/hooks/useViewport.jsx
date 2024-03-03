import { useContext } from 'react';
import ViewportContext from '../contexts/ViewportContext';

export default function useViewport(id) {
  const context = useContext(ViewportContext);
  // Only update set the ID if it has not already been set
  if (typeof context.viewportId === 'undefined' && typeof id !== 'undefined') {
    context.setViewportId(id);
  }
  return context;
}