import { createContext } from 'react';

interface IEditorContext {
  editor?: any;
  setEditor?: Function;
  isAiLoading: boolean;
  aiError?: string | null;
  setIsAiLoading: Function;
  setAiError: Function;
}

export const EditorContext = createContext<IEditorContext>({
  isAiLoading: false,
  aiError: null,
  setIsAiLoading: () => {},
  setAiError: () => {},
});
