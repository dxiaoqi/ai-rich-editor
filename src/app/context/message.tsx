"use client"
import React, { useState } from "react";
interface MessageContextProps {
  value?: string;
  setValue?: React.Dispatch<React.SetStateAction<string>>
}
export const MessageContext = React.createContext<MessageContextProps>({})

export function MessageContextProvider ({children}: { children: React.ReactNode }) {
  const [value, setValue] = useState('');
  return (
    <MessageContext.Provider value={{
      value,
      setValue
    }}>
      {children}
    </MessageContext.Provider>
  )
}