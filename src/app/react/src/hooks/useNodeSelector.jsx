import { useContext } from 'react';
import NodeSelectorContext from '../contexts/NodeSelectorContext';

export default function useNodeSelector() {
  return useContext(NodeSelectorContext);
}