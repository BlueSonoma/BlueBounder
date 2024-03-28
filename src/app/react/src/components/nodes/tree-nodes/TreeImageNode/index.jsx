import { useEffect, useState } from 'react';
import { NodeRendererProps } from 'react-arborist';
import IconFolderOpened from '../../../../resources/icons/folder-opened.png';
import IconFolderClosed from '../../../../resources/icons/folder-closed.png';
import useNodesManager from '../../../../hooks/useNodesManager';

import '../../../../styles/tree.css';

function TreeImageNode({ style, node: treeNode, dragHandle }: NodeRendererProps) {
  const { nodes, setNodes, selectedNodes } = useNodesManager();
  const [hidden, setHidden] = useState(treeNode.isLeaf ? null : false);
  const id = `tree-node__${treeNode.id}`;
  const tnSrc = treeNode.data.image?.src;
  const tnName = treeNode.data.name;
  const tnWidth = '25px';
  const tnHeight = '25px';

  useEffect(() => {
    let isSelected = false;
    const node = selectedNodes.find((nd) => nd.id === treeNode.id);
    if (node) {
      isSelected = node.selected;
    }
    const selectors = document.querySelectorAll(`#treeNode__${id}`);
    selectors.forEach((selector) => selector?.classList.toggle('selected', isSelected));
  }, [selectedNodes]);

  useEffect(() => {
    if (hidden) {
      for (let i = 0; i < treeNode.children?.length; i++) {
        const nodeVisible = !treeNode.children[i]?.data?.hidden;
        if (nodeVisible) {
          setHidden(false);
          break;
        }
      }
    } else {
      let numHidden = 0;
      for (let i = 0; i < treeNode.children?.length; i++) {
        const nodeHidden = treeNode.children[i]?.data?.hidden;
        if (nodeHidden) {
          numHidden++;
        }
      }
      if (numHidden === treeNode.children?.length) {
        setHidden(true);
      }
    }
  }, [treeNode.children]);

  function onFolderCheckboxClickedHandler(event) {
    event.stopPropagation();

    const shouldHide = !hidden;
    setHidden(shouldHide);

    treeNode.children.forEach((child) => {
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
    if (!treeNode.isLeaf) {
      const isOpen = treeNode.isOpen;
      const isRoot = treeNode.id === 'root__viewports';
      return (<>
        {!isRoot && <input
          type={'checkbox'}
          checked={!hidden}
          onClick={onFolderCheckboxClickedHandler}
          title={`${hidden ? 'Show ' : 'Hide '} all`}
        />}
        <img
          alt={tnName}
          src={isOpen ? IconFolderOpened : IconFolderClosed}
          width={tnWidth}
          height={tnHeight}
          title={`${isOpen ? 'Collapse ' : 'Expand '}`}
        /></>);
    }

    return (<>
      <input
        type={'checkbox'}
        checked={!treeNode.data.hidden}
        onClick={onLeafCheckboxClickHandler}
        title={`${treeNode.data.hidden ? 'Show' : 'Hide'}`}
      />
      {tnSrc && <img
        alt={tnName}
        src={tnSrc}
        width={tnWidth}
        height={tnHeight}
        title={tnName}
        style={{ border: 'solid black 1px', borderRadius: '5px' }}
      />}</>);
  }

  function onLeafCheckboxClickHandler() {
    setNodes((prev) => prev.map((nd) => {
      if (treeNode.id === nd.id) {
        return {
          ...nd, hidden: !nd.hidden,
        };
      }
      return nd;
    }));
  }

  return (<div className={'tree-node'} id={`treeNode__${id}`} style={style} ref={dragHandle}>
    {renderThumbnail()}
    <label style={{
      paddingLeft: '5px', overflow: 'hidden', scrollbarWidth: 'none',
    }}>{tnName}</label>
  </div>);
}

export default TreeImageNode;