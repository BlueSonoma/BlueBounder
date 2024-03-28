import { useEffect } from 'react';
import useSessionManager from '../../../hooks/useSessionManager';
import useTreeState from '../../../hooks/useTreeState';
import TreeImageNode from '../../nodes/tree-nodes/TreeImageNode';
import type { ViewportType } from '../../../types';
import TreeView from '../../../containers/TreeView';

function ViewportLayersView({}) {
  const [root, setRoot] = useTreeState({ id: 'root__viewports', name: 'Viewports' });
  const { viewports } = useSessionManager();

  useEffect(() => {
    root.children = viewports.map((viewport: ViewportType) => {
      return {
        id: viewport.props.id, name: viewport.label, children: viewport.props.nodes.map((node) => {
          return {
            id: node.id, name: node.data.label, hidden: node.hidden, ...node.data,
          };
        }),
      };
    });

    // We need to make root a new object to properly update the state
    setRoot({ ...root });
  }, [viewports]);

  return (<TreeView label={'Viewports'} data={root}>
    {TreeImageNode}
  </TreeView>);
}

export default ViewportLayersView;