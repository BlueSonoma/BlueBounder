import { NodeProps } from '@xyflow/react';
import { memo, useEffect, useState } from 'react';

function ImageNode(props: NodeProps) {
  const {
    id, data, selected, xPos, yPos, type,
  } = props;

  const [image, setImage] = useState(null);

  useEffect(() => {
    if (data?.url) {
      setImage(data.url);
    }
  }, [data?.url]);

  if (!data?.url) {
    return;
  }

  return (<div id={id}>
    <img src={image} alt={`image_${id}`} />
  </div>);
}

ImageNode.displaName = 'ImageNode';

export default memo(ImageNode);