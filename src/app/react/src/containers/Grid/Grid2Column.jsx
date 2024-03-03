import React, { memo, useMemo } from 'react';

import '../../styles/grid.css';

type GridData = {
  label: string; content: string;
}

const DEFAULT_LABEL_WIDTH = 110;

export const Grid2Column = memo(({ data }) => {
  const labelWidth = useMemo(() => {
    if (!Array.isArray(data)) {
      data = [data];
    }

    if (data.length === 0) {
      return DEFAULT_LABEL_WIDTH;
    }

    let maxLength = -Number.MAX_VALUE;
    data?.forEach((item) => {
      const length = item.label.length;
      if (length > maxLength) {
        maxLength = length;
      }
    });

    return maxLength * 9;
  }, [data]);

  if (typeof data === 'undefined') {
    return <></>;
  }

  return (<div className='grid-container'>
    {data.map((item, index) => (<div key={index} className='row'>
      <div style={{ width: `${labelWidth}px` }} className='label'>{item.label}</div>
      <div className='content'>{item.content}</div>
    </div>))}
  </div>);
});

