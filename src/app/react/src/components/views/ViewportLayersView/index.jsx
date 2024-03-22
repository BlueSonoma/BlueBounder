import { useEffect, useRef, useState } from 'react';

import useSessionManager from '../../../hooks/useSessionManager';
import { NodeApi, Tree } from 'react-arborist';
import useTreeState from '../../../hooks/useTreeState';
import TreeImageNode from '../../nodes/TreeImageNode';

import '../../../styles/tree.css';
import type { ViewportType } from '../../../types';
import useNodeSelector from '../../../hooks/useNodeSelector';

function ViewportLayersView({}) {
  const [root, setRoot] = useTreeState({ id: 'root__viewports', name: 'Viewports' });
  const { nodes, viewports } = useSessionManager();
  const { selectedNodes, setSelectedNodes } = useNodeSelector();
  const treeRef = useRef();

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

  useEffect(() => {
    let numSelected = 0;
    const selectedIds = treeRef.current?.selectedIds;
    Array.from(selectedIds).forEach((id) => {
      if (selectedNodes.find((nd) => nd.id === id) !== 'undefined') {
        numSelected++;
      }
    });
    // Only update the tree if there has been a selection outside of this component
    if (numSelected !== selectedNodes.length) {
      treeRef.current?.setSelection({
        ids: selectedNodes.map((nd) => nd), anchor: null, mostRecent: null,
      });
    }
  }, [selectedNodes]);

  function onSelectHandler(treeNodes: NodeApi[]) {
    if (treeNodes.length === 0) {
      return;
    }
    const node = treeNodes[0];
    if (!node.isLeaf) {
      node.toggle();
    } else {
      const selected = [];
      treeNodes.forEach((treeNode) => {
        const node = nodes.find((nd) => nd.id === treeNode.id);
        if (typeof node !== 'undefined') {
          selected.push(node);
        }
      });
      setSelectedNodes(selected);
    }
  }

  return (<div>
    <div style={{ marginTop: '5px', padding: '3px', border: '2px groove lightgray' }}>Layers</div>
    <div style={{ overflow: 'hidden', padding: '3px', border: '2px groove lightgray' }}>
      <Tree
        ref={treeRef}
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