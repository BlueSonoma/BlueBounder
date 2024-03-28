import { useContext } from 'react';
import NodesManagerContext from '../contexts/NodesManagerContext';

export default function useNodesManager() {
  return useContext(NodesManagerContext);
}