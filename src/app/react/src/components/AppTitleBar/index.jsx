import React, { memo } from 'react';

function AppTitleBar({text}) {

  text = text ?? 'Grain Boundary Detection and Analysis';

  return (
    <head>
      <title>Blue Bounder | {text}</title>
    </head>
  )
}

export default memo(AppTitleBar)