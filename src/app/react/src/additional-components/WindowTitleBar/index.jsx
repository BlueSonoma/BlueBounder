import React, { memo } from 'react';

function WindowTitleBar({text}) {

  text = text ?? 'Grain Boundary Detection and Analysis';

  return (
    <head>
      <title>Blue Bounder | {text}</title>
    </head>
  )
}

export default memo(WindowTitleBar)