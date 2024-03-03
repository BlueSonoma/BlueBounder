import { NodeProps } from '@xyflow/react';
import { memo, useEffect, useState } from 'react';

function ImageNode(props: NodeProps) {
  const {
    id, data, selected, xPos, yPos, type,
  } = props;

  const [image, setImage] = useState(null);

  useEffect(() => {
    if (data?.src) {
      setImage(data.src);
    }
  }, [data?.src]);

  if (!data?.src) {
    return;
  }

  return (<div id={id}>
    <img src={image} alt={`image_${id}`} width={data.width} height={data.height} />
  </div>);
}

ImageNode.displaName = 'ImageNode';

export default memo(ImageNode);