import { forwardRef, useCallback, useEffect, useRef, useState } from 'react';
import Frame from '../Frame';
import { NodeApi, Tree } from 'react-arborist';
import useNodesManager from '../../hooks/useNodesManager';
import { TreeProps } from 'react-arborist/dist/main/types/tree-props';

import '../../styles/tree.css';

function TreeView({
                    label,
                    data,
                    idAccessor = 'id',
                    className = '',
                    rowClassName = '',
                    rowHeight = 30,
                    indent = 35,
                    children,
                    onDoubleClick,
                    ...rest
                  }: TreeProps, ref) {
  const treeRef = useRef(ref);
  const { selectedNodes, setSelectedNodes } = useNodesManager();
  const [lastSelected, setLastSelected] = useState(null);
  const clickCountRef = useRef(0);
  const timeoutRef = useRef(null);

  const isArray = Array.isArray(data);
  data = isArray ? data : [data];

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  function handleClick(treeNodes: NodeApi[]) {
    if (treeNodes.length === 0) {
      return;
    }

    clickCountRef.current += 1;
    const isLastNode = lastSelected && lastSelected.id === treeNodes[0].id;
    if (clickCountRef.current === 1) {
      timeoutRef.current = setTimeout(() => {
        clickCountRef.current = 0;
      }, 500);
    } else if (clickCountRef.current === 2) {
      clearTimeout(timeoutRef.current);
      clickCountRef.current = 0;

      if (isLastNode) {
        onDoubleClick?.(treeNodes);
      }
    }
  }

  const onSelectHandler = useCallback((treeNodes: NodeApi[]) => {
    // Update the click number value (checking double click)
    if (treeNodes.length === 0) {
      setLastSelected(null);
      return;
    }

    handleClick(treeNodes);

    const node = treeNodes[0];
    if (!node.isLeaf) {
      node.toggle();
      setSelectedNodes([]);
    } else {
      setSelectedNodes(treeNodes.map((treeNode) => treeNode.id));
    }
    rest.onSelect?.(treeNodes);

    setLastSelected(() => treeNodes[0]);
  }, [selectedNodes]);

  return (<Frame label={label}>
    <Tree
      ref={treeRef}
      data={data}
      idAccessor={idAccessor}
      className={'tree ' + className}
      rowClassName={'tree-row ' + rowClassName}
      rowHeight={rowHeight}
      indent={indent}
      onSelect={onSelectHandler}
      {...rest}
    >
      {children}
    </Tree>
  </Frame>);
}

export default forwardRef(TreeView);