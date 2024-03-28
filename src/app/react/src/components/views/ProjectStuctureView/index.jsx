import { useEffect } from 'react';
import type { ViewportType } from '../../../types';
import TreeView from '../../../containers/TreeView';
import useTreeState from '../../../hooks/useTreeState';
import { getFilenameFromPath } from '../../../utils/general';
import useSessionManager from '../../../hooks/useSessionManager';
import TreeImageNode from '../../nodes/tree-nodes/TreeImageNode';

function ProjectStructureView() {
  const [data, setData] = useTreeState();
  const { csvFilePath, ctfFilePath, nodes, setSelectedNodes, createAndAddViewport } = useSessionManager();

  const nextData = [];
  const files = { id: '0', name: 'Files', children: [] };

  useEffect(() => {
    if (csvFilePath.length > 0) {
      files.children = [{
        id: '0a', name: getFilenameFromPath(csvFilePath), path: csvFilePath,
      }];
    }
    if (ctfFilePath.length > 0) {
      files.children = [...files.children, {
        id: '0b', name: getFilenameFromPath(ctfFilePath), path: ctfFilePath,
      }];
    }

    if (files.children.length > 0) {
      nextData.push(files);
    }

    nextData.push({
      id: '1', name: 'Images', children: nodes.map((node) => {
        return {
          id: node.id, name: node.data.file.name, hidden: node.hidden, ...node.data,
        };
      }),
    });

    setData((root) => root.children = nextData);
  }, [csvFilePath, ctfFilePath, nodes]);

  function onDoubleClickHandler(treeNodes) {
    const clickedNodes = [];
    treeNodes.forEach((tn) => {
      for (let i = 0; i < nodes.length; i++) {
        const nd = nodes[i];
        if (nd.type === 'imageNode' && nd.id === tn.id) {
          clickedNodes.push(nd);
          break;
        }
      }
    });

    if (clickedNodes.length === 0) {
      return;
    }

    const newViewport: ViewportType = {
      name: clickedNodes[0].data.file.prefix, nodes: clickedNodes, options: { setActive: true },
    };
    createAndAddViewport(newViewport);

    setSelectedNodes(clickedNodes);
  }

  return (<TreeView
    label={'Project Structure'}
    data={data}
    indent={20}
    onDoubleClick={onDoubleClickHandler}
  >
    {TreeImageNode}
  </TreeView>);
}

export default ProjectStructureView;