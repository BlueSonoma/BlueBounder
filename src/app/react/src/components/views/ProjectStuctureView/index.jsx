import { useEffect } from 'react';
import type { ViewportType } from '../../../types';
import TreeView from '../../../containers/TreeView';
import useTreeState from '../../../hooks/useTreeState';
import { getFilenameFromPath } from '../../../utils/general';
import useSessionManager from '../../../hooks/useSessionManager';
import TreeImageNode from '../../nodes/tree-nodes/TreeImageNode';

function ProjectStructureView() {
  const [data, setData, set] = useTreeState();
  const {
    csvFilePath, ctfFilePath, nodes, setSelectedNodes, createAndAddViewport, setActiveViewport,
  } = useSessionManager();

  const nextData = [];
  const files = { id: '0', name: 'Files', children: [] };

  useEffect(() => {
    if (csvFilePath.length > 0) {
      files.children = [{
        id: '0a', name: getFilenameFromPath(csvFilePath), path: csvFilePath,
      }];
    }

    if (files.children.length > 0) {
      nextData.push(files);
    }

    const cachedImages = nodes.filter((node) => node.data.image.cached);
    cachedImages.sort((a, b) => a.data.file.dir === b.data.file.dir);

    const cacheCategories = new Map();
    for (let i = 0; i < cachedImages.length; i++) {
      const node = cachedImages[i];
      let dir = node.data.file.dir;
      if (typeof dir === 'undefined') {
        dir = node.data.file.name;
      }
      if (!cacheCategories.has(dir)) {
        cacheCategories.set(dir, [node]);
      } else {
        cacheCategories.get(dir).push(node);
      }
    }

    const notEdited = nodes.filter((node) => !node.data.image.cached);
    const images = {
      id: '1', name: 'Images', children: notEdited.map((node) => {
        return {
          id: node.id, name: node.data.file.name, hidden: node.hidden, ...node.data,
        };
      }),
    };

    if (cacheCategories.size > 0) {
      const editedImages = {
        id: '1a', name: 'Edited', children: [],
      };
      let id = 3;
      for (const [category, editedNodes] of cacheCategories.entries()) {
        editedImages.children.push({
          id: `${id++}`, name: category, children: editedNodes.map((node) => {
            return {
              id: node.id, name: node.parent, hidden: node.hidden, ...node.data,
            };
          }),
        });
      }
      images.children = [...images.children, editedImages];
    }
    nextData.push(images);

    setData((root) => root.children = nextData);
  }, [csvFilePath, ctfFilePath, nodes]);

  function onDoubleClickHandler(treeNodes) {
    const clickedNodes = [];
    let viewportId = null;
    treeNodes.forEach((tn) => {
      for (let i = 0; i < nodes.length; i++) {
        const nd = nodes[i];
        if (nd.type === 'imageNode' && nd.id === tn.id) {
          if (nd.data.viewport) {
            viewportId = nd.data.viewport;
          }
          clickedNodes.push(nd);
          break;
        }
      }
    });

    if (clickedNodes.length === 0) {
      return;
    }

    if (viewportId) {
      setActiveViewport(viewportId);
    } else {
      const newViewport: ViewportType = {
        label: clickedNodes[0].data.label, nodes: clickedNodes, options: { setActive: true },
      };
      createAndAddViewport(newViewport);
    }

    setSelectedNodes(clickedNodes);
  }

  return (<TreeView
    label={'Project Structure'}
    data={data}
    indent={20}
    onDoubleClick={onDoubleClickHandler}
    showCheckBox={false}
    // openByDefault={false}
  >
    {TreeImageNode}
  </TreeView>);
}

export default ProjectStructureView;