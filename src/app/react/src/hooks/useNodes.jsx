import { useContext } from 'react';
import NodesContext from '../contexts/NodesContext';

export default function useNodes() {
  return useContext(NodesContext);
}