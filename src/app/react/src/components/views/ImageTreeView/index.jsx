import { memo, useEffect, useState } from 'react';


import useSession from '../../../hooks/useSession';
import { Tree } from 'react-arborist';

const initialLayerState = {
  id: 'root', name: 'Viewports', children: [],
};

function ViewportTreeView({}) {
  const [treeState, setTreeState] = useState([initialLayerState]);
  const { viewports } = useSession();

  useEffect(() => {
    const viewportState = {
      ...initialLayerState,
      children: viewports.map((viewport) => {
        return {
          id: viewport.props.id, name: viewport.label, children: viewport.props.nodes.map((node) => {
            return {
              id: node.id, name: node.data.file?.prefix,
            };
          }),
        };
      }),
    };

    setTreeState([viewportState]);
  }, [viewports]);

  function onTreeStateChange(state, event) {
    setTreeState(state);
  }

  return (<div>
    <div style={{ marginTop: '5px', padding: '3px', border: '2px groove lightgray' }}>Layers</div>
    <Tree data={treeState} />
  </div>);
}

export default memo(ViewportTreeView);