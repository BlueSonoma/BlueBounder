import { useState } from 'react';

type TreeState = {
  id: string, name: string, children: TreeState[],
};

function getInitialState(state: TreeState) {
  let {
    id, name, children,
  }: TreeState = state;

  state = {
    id: id ?? 'root', name: name ?? 'root', children: children ?? [],
  };

  return state;
}

function useTreeState(initialState: TreeState) {
  const [root, setRoot] = useState(getInitialState(initialState));

  return [root, setRoot];
}

export default useTreeState;