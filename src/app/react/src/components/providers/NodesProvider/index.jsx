import { useNodesState } from '@xyflow/react';
import { Provider } from '../../../contexts/NodesContext';
import type { ImageNodeType } from '../../../types';
import {
  createBlobFromText, createImageFromBlob, getFileExtFromPath, getFilenameFromPath, getNextId,
} from '../../../utils/general';
import { imageExists } from '../../../utils/nodes';

function NodesProvider({ children }) {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);

  function createImageNode(image, imageType): ImageNodeType {
    const id = `imageNode_${getNextId(4)}`;

    let data;
    if (typeof image === 'undefined') {
      data = {
        label: id, width: 0, height: 0, viewport: null, image: {
          width: 0, height: 0, src: '', type: imageType,
        },
      };
    } else {
      data = {
        label: image.alt ?? id, width: image.width, height: image.height, viewport: null, image: {
          width: image.width, height: image.height, src: image.src, type: imageType,
        },
      };
    }


    return {
      id: id,
      type: 'imageNode',
      position: { x: 0, y: 0 },
      selectable: true,
      focusable: true,
      draggable: false,
      deletable: false,
      data,
    };
  }

  async function createDefaultImageNode(pathOrFile): ImageNodeType {
    if (typeof pathOrFile === 'undefined') {
      throw new Error(`Missing required arguments: Expected File or filepath.`);
    }
    // console.log("pathOrFile Type: ", pathOrFile)

    let filepath = pathOrFile;
    let imageType;
    if (typeof filepath !== 'string') {
      filepath = pathOrFile.path;
      imageType = pathOrFile.type;
    }
    // console.log("Image Type: ", imageType)

    const node = await createImageNodeFromFilepath(filepath, imageType);
    // Set the reload callback
    node.data.reload = async () => {
      // Create a new image node
      const reNode = await createImageNodeFromFilepath(node.data.file.path, imageType);

      setNodes((prev) => prev.map((nd) => {
        if (nd.id === node.id) {
          // Update and return a newly created node
          return {
            ...nd, data: {
              width: reNode.width, height: reNode.height, ...node.data, image: reNode.data.image,
            },
          };
        }
        return nd;
      }));
    };
    addFilepathToNode(node, filepath);

    return node;
  }

  function addFilepathToNode(node, filepath) {
    const filePrefix = getFilenameFromPath(filepath, true);
    const fileExt = getFileExtFromPath(filepath);
    const filename = filePrefix + '.' + fileExt;
    node.data.file = {
      prefix: filePrefix, name: filename, path: filepath, extension: fileExt,
    };
    node.data.label = filePrefix;
  }

  async function createImageNodeFromFilepath(filepath, imageType) {
    const blob = await createBlobFromText(filepath);
    const altLabel = getFilenameFromPath(filepath);
    return createImageNodeFromBlob(blob, altLabel, imageType);
  }

  async function createImageNodeFromBlob(blob, altLabel, imageType) {
    const image = await createImageFromBlob(blob, altLabel);
    return createImageNode(image, imageType);
  }

  const contextProps = {
    nodes,
    setNodes,
    onNodesChange,
    createImageNodeFromBlob,
    createImageNodeFromFilepath,
    addFilepathToNode,
    createDefaultImageNode,
    createImageNode,
    imageExists,
  };

  return (<Provider value={contextProps}>
    {children}</Provider>);
}

export default NodesProvider;