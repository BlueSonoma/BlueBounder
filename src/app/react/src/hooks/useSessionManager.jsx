import {  useContext } from 'react';
import SessionManagerContext from '../contexts/SessionManagerContext';

export default function useSessionManager() {
    return useContext(SessionManagerContext)
}
