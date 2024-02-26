import React, { createContext, useState } from 'react'

export const SessionContext = createContext()


const SessionContextProvider = (props) => {
    const [sessionName, setSessionName] = useState('')

    const Url = "http://localhost:3000"

    const updateSessionName = (newSessionName) => {
        setSessionName(newSessionName)
    }

    return (
        <SessionContext.Provider 
            value={{
                sessionName,
                Url,
                updateSessionName 
            }}>
            {props.children}
        </SessionContext.Provider>
    )
}
export default SessionContextProvider