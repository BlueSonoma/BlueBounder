import { useContext } from 'react';
import TreeViewContext from '../contexts/TreeViewContext';

function useTreeView() {
  return useContext(TreeViewContext);
}

export default useTreeView;

