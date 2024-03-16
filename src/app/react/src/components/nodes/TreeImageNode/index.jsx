import { useEffect, useMemo, useState } from 'react';
import '../../../styles/tree.css';
import IconFolderOpened from '../../../resources/icons/folder-opened.png';
import IconFolderClosed from '../../../resources/icons/folder-closed.png';
import useSessionManager from '../../../hooks/useSessionManager';
import { NodeRendererProps } from 'react-arborist';

function TreeImageNode({ style, node, dragHandle, preview }: NodeRendererProps) {
  const { viewports, setActiveViewport, nodes, setNodes } = useSessionManager();
  const [thisNode, setThisNode] = useState(null);
  const treeNodeId = `tree-node__${node.data?.id}`;
  const thumbSrc = node.data.src;
  const thumbnailName = node.data.name;

  useEffect(() => {
    setThisNode(nodes.find((nd) => nd.id === node.data.id));
  }, [node]);

  useEffect(() => {
    const isSelected = node.isSelected;
    document.querySelector(`#${treeNodeId}`).classList.toggle('selected', isSelected);

    if (isSelected) {
      const viewport = viewports.find((vp) => vp.id === node.data.viewport);
      if (typeof viewport !== 'undefined') {
        setActiveViewport(viewport.id);
      }
    }
  }, [node]);

  function renderThumbnail() {
    if (!node.isLeaf) {
      return (<>
        <img
          alt={thumbnailName}
          src={node.isOpen ? IconFolderOpened : IconFolderClosed}
          width={'25px'}
          height={'25px'}
        /></>);
    }

    return (<>
      <input
        type={'checkbox'}
        checked={!thisNode?.hidden}
        onClick={onLeafCheckboxClickHandler}
      />
      <img
        alt={thumbnailName}
        src={thumbSrc}
        width={'25px'}
        height={'25px'}
        style={{ border: 'solid black 1px', borderRadius: '5px' }}
      /></>);
  }

  function onLeafCheckboxClickHandler() {
    setNodes((prev) => prev.map((nd) => {
      if (thisNode.id === nd.id) {
        return {
          ...nd, hidden: !nd.hidden,
        };
      }
      return nd;
    }));
  }

  return (<div className={'tree-node'} id={treeNodeId} style={style} ref={dragHandle}>
    {renderThumbnail()}
    <label style={{ paddingLeft: '5px' }}>{thumbnailName}</label>
  </div>);
}

export default TreeImageNode;