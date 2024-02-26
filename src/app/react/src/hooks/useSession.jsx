import {  useContext } from 'react';
import SessionContext from '../contexts/SessionContext';

export default function useSession() {
    return useContext(SessionContext)
}
