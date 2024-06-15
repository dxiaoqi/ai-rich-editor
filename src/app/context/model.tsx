"use client"
import React from "react";
interface ModelContextProps {
  selectedModel?: string;
  setSelectedModel?: React.Dispatch<React.SetStateAction<string>>;
  systemMessage?: string;
  setSystemMessage?:  React.Dispatch<React.SetStateAction<string>>;
}
export const ModelContext = React.createContext<ModelContextProps>({})

export function ModelContextProvider ({children}: { children: React.ReactNode }) {
  const [selectedModel, setSelectedModel] = React.useState<string>("gpt-4");
  const [systemMessage, setSystemMessage] = React.useState<string>("");
  return (
    <ModelContext.Provider value={{
      selectedModel,
      setSelectedModel,
      systemMessage,
      setSystemMessage
    }}>
      {children}
    </ModelContext.Provider>
  )
}