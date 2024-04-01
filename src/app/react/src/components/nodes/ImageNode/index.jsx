import { NodeProps } from '@xyflow/react';
import { memo, useEffect, useState } from 'react';

function ImageNode(props: NodeProps) {
  const {
    id, data,
  } = props;

  const [image, setImage] = useState(null);

  useEffect(() => {
    if (data?.image.src) {
      setImage(data.image.src);
    }
  }, [data?.image.src]);

  if (!data?.image.src) {
    return;
  }

  return (<div id={id}>
    <img src={image} alt={data.label} width={data.image.width} height={data.image.height}/>
  </div>);
}

ImageNode.displaName = 'ImageNode';

export default memo(ImageNode);