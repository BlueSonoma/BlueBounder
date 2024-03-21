import { useEffect } from 'react';

import useSessionManager from '../../../hooks/useSessionManager';
import { NodeApi, Tree } from 'react-arborist';
import useTreeState from '../../../hooks/useTreeState';
import TreeImageNode from '../../nodes/TreeImageNode';

import '../../../styles/tree.css';
import type { ViewportType } from '../../../types/general';
import useNodeSelector from '../../../hooks/useNodeSelector';

function ViewportLayersView({}) {
  const [root, setRoot] = useTreeState({ name: 'Viewports' });
  const { nodes, viewports } = useSessionManager();
  const { setSelectedNodes } = useNodeSelector();

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

  function onSelectHandler(treeNodes: NodeApi[]) {
    if (treeNodes.length === 0) {
      return;
    }
    const node = treeNodes[0];
    if (!node.isLeaf) {
      node.toggle();
    } else {
      const selectedNodes = treeNodes.map((node) => {
        for (let i = 0; i < nodes.length; i++) {
          if (node.id === nodes[i].id) {
            return nodes[i];
          }
        }
        return null;
      }).filter((node) => node);

      setSelectedNodes(selectedNodes);
    }
  }

  return (<div>
    <div style={{ marginTop: '5px', padding: '3px', border: '2px groove lightgray' }}>Layers</div>
    <div style={{ overflow: 'hidden', padding: '3px', border: '2px groove lightgray' }}>
      <Tree
        data={[root]}
        idAccessor={'id'}
        className={'tree'}
        rowClassName={'tree-row'}
        rowHeight={30}
        indent={35}
        onSelect={onSelectHandler}
      >
        {TreeImageNode}
      </Tree>
    </div>
  </div>);
}

export default ViewportLayersView;