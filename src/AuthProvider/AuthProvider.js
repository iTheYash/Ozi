import React, { createContext, useContext, useState } from 'react';

// Create the context
export const AppContext = createContext();

// Create the provider component
export const AppContextProvider = ({ children }) => {

    const [isRegistered, setIsRegistered] = useState(false);
    const [registeredData, setRegisteredData] = useState('');

    return (
        <AppContext.Provider value={{isRegistered, setIsRegistered,registeredData,setRegisteredData}}>
            {children}
        </AppContext.Provider>
    );
};

// Custom hook to use the context
export const useAppContext = () => {
    return useContext(AppContext);
};
