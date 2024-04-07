import { useState } from 'react';

type TreeState = {
  id: string, name: string, children: TreeState[],
};

function getInitialState({ id, name, children }: TreeState) {
  return {
    id: id ?? 'root', name: name ?? 'root', children: children ?? [],
  };
}

function useTreeState(initialState: TreeState) {
  const [root, setRoot] = useState(getInitialState(initialState ?? {}));
  return [root, setRoot];
}

export default useTreeState;