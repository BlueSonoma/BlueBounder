import { useNodesState } from '@xyflow/react';
import { Provider } from '../../../contexts/NodesContext';
import type { ImageNodeType } from '../../../types';
import {
  createBlobFromText, createImageFromBlob, getFileExtFromPath, getFilenameFromPath, getNextId,
} from '../../../utils/general';
import { imageExists } from '../../../utils/nodes';
import { createThumbnailFromImage } from '../../../utils/image';

type createImageNodeFromFilepathParams = {
  path: string; name: string; type: string; cached?: boolean; dir?: string;
}

function NodesProvider({ children }) {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);

  async function createImageNode(image, params: { type: string, cached: boolean, name?: string }): ImageNodeType {
    const id = `imageNode_${getNextId(4)}`;
    const { name, ...rest } = params;
    let data;

    const hasImage = typeof image !== 'undefined';
    if (hasImage) {
      const thumbnail = createThumbnailFromImage(image, 25, 25);
      data = {
        label: image.alt ?? id, width: image.width, height: image.height, viewport: null, image: {
          width: image.width, height: image.height, src: image.src, cached: rest.cached, type: rest.type, thumbnail: {
            src: thumbnail.src, alt: thumbnail.alt, width: thumbnail.width, height: thumbnail.height,
          },
        },
      };
    } else {
      data = {
        label: id, width: 0, height: 0, viewport: null, image: {
          width: 0, height: 0, src: '', cached: false, ...rest,
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
      parent: rest.cached ? name : null,
      data,
    };
  }

  async function createDefaultImageNode(pathOrFile): ImageNodeType {
    if (typeof pathOrFile === 'undefined') {
      throw new Error(`Missing required arguments: Expected File or filepath.`);
    }

    const isString = typeof pathOrFile === 'string';
    const params: createImageNodeFromFilepathParams = {
      path: isString ? pathOrFile : pathOrFile.path,
      name: isString ? null : pathOrFile.name,
      dir: isString ? null : pathOrFile.dir,
      type: isString ? null : pathOrFile.type,
      cached: isString ? null : pathOrFile.cached,
    };
    //console.log("Image Type: ", imageType)

    const node = await createImageNodeFromFilepath(params);
    // Set the reload callback
    node.data.reload = async () => {
      // Create a new image node
      const reNode = await createImageNodeFromFilepath({
        name: node.data.file.name,
        path: node.data.file.path,
        dir: node.data.file.dir,
        type: node.data.image.type,
        cached: node.data.image.cached,
      });

      setNodes((prev) => prev.map((nd) => {
        if (nd.id === node.id) {
          // Update and return a newly created node
          return {
            ...node, data: {
              width: reNode.width, height: reNode.height, ...node.data, image: reNode.data.image,
            },
          };
        }
        return nd;
      }));
    };
    addFilepathToNode(node, { path: params.path, dir: params.dir });

    return node;
  }

  function addFilepathToNode(node, params: { path: string, dir?: string, }) {
    const filePrefix = getFilenameFromPath(params.path, true);
    const fileExt = getFileExtFromPath(params.path);
    const filename = filePrefix + '.' + fileExt;
    node.data.file = {
      prefix: filePrefix, name: filename, extension: fileExt, ...params,
    };
    node.data.label = filePrefix;
  }

  async function createImageNodeFromFilepath({ path, ...rest }: createImageNodeFromFilepathParams) {
    const blob = await createBlobFromText(path);
    const altLabel = getFilenameFromPath(path);
    return await createImageNodeFromBlob(blob, altLabel, rest);
  }

  async function createImageNodeFromBlob(blob, altLabel, params: { type: string, cached: boolean }) {
    const image = await createImageFromBlob(blob, altLabel);
    return createImageNode(image, params);
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