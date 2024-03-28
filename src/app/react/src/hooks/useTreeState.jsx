import { useState } from 'react';

type TreeState = {
  id: string, name: string, children: TreeState[],
};

function useTreeState(initialState) {
  const [root, setRoot] = useState(initialState ?? {});
  return [root, setRoot];
}

export default useTreeState;