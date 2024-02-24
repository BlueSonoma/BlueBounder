import { useState } from 'react';

const DEFAULT_MAX_STACK_SIZE = 10;

const defaultCompareEqualityFn = (s1, s2) => {
  return s1 === s2;
};

function useHistoryState(initialState) {
  const [maxHistorySize, setMaxHistorySize] = useState(DEFAULT_MAX_STACK_SIZE);
  const [history, setHistory] = useState(initialState ? [initialState] : []);
  const [state, _setState] = useState(initialState ?? null);
  const [_stateIndex, _setStateIndex] = useState(initialState ? 0 : -1);
  const [_statesAreEqual, _setStatesAreEqual] = useState(() => defaultCompareEqualityFn);

  function pushState(nextState, index) {
    index = typeof index === 'undefined' ? _stateIndex : history.length - 1;
    index = index < 0 ? 0 : _stateIndex;

    // Place the state in front of the current state and delete anything in front
    history.splice(++index, Infinity, nextState);
    if (index >= maxHistorySize) {
      history.shift();
      index--;
    }
    return index;
  }

  function initHistory(initialState) {
    if (typeof initialState === 'undefined' || !initialState) {
      throw new Error('State object is undefined or null');
    }
    if (Array.isArray(initialState)) {
      const index = initialState.length - 1;
      _setStateIndex(index);
      _setState(initialState.at(index));
      setHistory([...initialState]);
    } else {
      _setStateIndex(0);
      _setState(initialState);
      setHistory([initialState]);
    }
    Debug.log('State history initialized');
  }

  function getEqualityFn() {
    return _statesAreEqual;
  }

  function setEqualityFn(func: Function) {
    if (typeof func !== 'function') {
      throw new Error('Attempted to set an invalid callback');
    }
    _setStatesAreEqual(() => func);
  }

  function getIndexOfState(state) {
    if (_stateIndex >= 0) {
      // Current
      if (_statesAreEqual(history.at(_stateIndex), state)) {
        return _stateIndex;
      }
      // Previous
      if (_statesAreEqual(history.at(_stateIndex - 1), state)) {
        return _stateIndex - 1;
      }
      // Next
      if (_stateIndex < history.length - 1 && _statesAreEqual(history.at(_stateIndex + 1), state)) {
        return _stateIndex + 1;
      }
    }
    return -1;
  }

  function setStateIndex(index) {
    if (index > history.length - 1) {
      _setStateIndex(history.length - 1);
    } else if (index < 0) {
      _setStateIndex(0);
    } else {
      _setStateIndex(index);
    }
  }

  function setState(nextState) {
    if (typeof nextState === 'undefined') {
      throw new Error('Attempted to set an undefined state');
    }
    if (!state) {
      initHistory(nextState);
    } else {
      let index = getIndexOfState(nextState);
      if (index === _stateIndex) return;
      if (index === -1) {
        index = pushState(nextState, _stateIndex);
        setHistory(() => history);
      }
      _setState(nextState);
      setStateIndex(index);

      Debug.log(`State history updated, index: ${index}`);
    }
  }

  function getPreviousState() {
    if (!state) {
      throw new Error('State is not initialized');
    }
    if (history.length > 1 && _stateIndex > 0) {
      return history.at(_stateIndex - 1);
    }
    return null;
  }

  function getNextState() {
    if (!state) {
      throw new Error('State is not initialized');
    }
    if (_stateIndex >= 0 && _stateIndex < history.length - 1) {
      return history.at(_stateIndex + 1);
    }
  }

  function redoState() {
    const state = getNextState();
    if (state) {
      setState(state);
    }
    return state;
  }

  function undoState() {
    const prevState = getPreviousState();
    if (prevState) {
      setState(prevState);
    }
    return prevState;
  }

  return {
    initHistory,
    state,
    setState,
    history,
    setHistory,
    undoState,
    redoState,
    getPreviousState,
    getNextState,
    maxHistorySize,
    setMaxHistorySize,
    getEqualityFn,
    setEqualityFn,
  };
}

export { useHistoryState };