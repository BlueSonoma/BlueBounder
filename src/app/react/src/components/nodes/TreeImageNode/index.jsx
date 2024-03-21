import { useEffect, useMemo, useState } from 'react';
import '../../../styles/tree.css';
import IconFolderOpened from '../../../resources/icons/folder-opened.png';
import IconFolderClosed from '../../../resources/icons/folder-closed.png';
import useSessionManager from '../../../hooks/useSessionManager';
import { NodeRendererProps } from 'react-arborist';

function TreeImageNode({ style, node, dragHandle, preview }: NodeRendererProps) {
  const { viewports, setActiveViewport, nodes, setNodes } = useSessionManager();
  const [hidden, setHidden] = useState(node.data.hidden ?? false);
  const treeNodeId = `tree-node__${node.id}`;
  const thumbSrc = node.data.src;
  const thumbnailName = node.data.name;

  useEffect(() => {
    const isSelected = node.isSelected;
    document.querySelector(`#treeNode__${treeNodeId}`).classList.toggle('selected', isSelected);

    if (isSelected) {
      const viewport = viewports.find((vp) => vp.id === node.data.viewport);
      if (typeof viewport !== 'undefined') {
        setActiveViewport(viewport.id);
      }
    }
  }, [node]);

  useEffect(() => {
    if (hidden) {
      for (let i = 0; i < node.children?.length; i++) {
        const nodeVisible = !node.children[i]?.data?.hidden;
        if (nodeVisible) {
          setHidden(false);
          break;
        }
      }
    } else {
      let numHidden = 0;
      for (let i = 0; i < node.children?.length; i++) {
        const nodeHidden = node.children[i]?.data?.hidden;
        if (nodeHidden) {
          numHidden++;
        }
      }
      if (numHidden === node.children?.length) {
        setHidden(true);
      }
    }
  }, [node.children]);

  function onFolderCheckboxClickedHandler(event) {
    event.stopPropagation();

    const shouldHide = !hidden;
    setHidden(shouldHide);

    node.children.forEach((child) => {
      const index = nodes.findIndex((nd) => nd.id === child.id);
      if (index !== -1) {
        nodes[index].hidden = shouldHide;
      }
    });

    setNodes(() => nodes.map((nd) => {
      return {
        ...nd,
      };
    }));
  }

  function renderThumbnail() {
    if (!node.isLeaf) {
      const isOpen = node.isOpen;
      return (<>
        <input
          type={'checkbox'}
          checked={!hidden}
          onClick={onFolderCheckboxClickedHandler}
          title={`${hidden ? 'Show ' : 'Hide '} all`}
        />
        <img
          alt={thumbnailName}
          src={isOpen ? IconFolderOpened : IconFolderClosed}
          width={'25px'}
          height={'25px'}
          title={`${isOpen ? 'Collapse ' : 'Expand '}`}
        /></>);
    }

    return (<>
      <input
        type={'checkbox'}
        checked={!node.data.hidden}
        onClick={onLeafCheckboxClickHandler}
        title={`${node.data.hidden ? 'Show' : 'Hide'}`}
      />
      <img
        alt={thumbnailName}
        src={thumbSrc}
        width={'25px'}
        height={'25px'}
        title={thumbnailName}
        style={{ border: 'solid black 1px', borderRadius: '5px' }}
      /></>);
  }

  function onLeafCheckboxClickHandler() {
    setNodes((prev) => prev.map((nd) => {
      if (node.id === nd.id) {
        return {
          ...nd, hidden: !nd.hidden,
        };
      }
      return nd;
    }));
  }

  return (<div className={'tree-node'} id={`treeNode__${treeNodeId}`} style={style} ref={dragHandle}>
    {renderThumbnail()}
    <label style={{ paddingLeft: '5px' }}>{thumbnailName}</label>
  </div>);
}

export default TreeImageNode;