import {createContext, Dispatch, SetStateAction} from "react";

type ErrorContextType = {
  error: string | undefined,
  setError: Dispatch<SetStateAction<string | undefined>>
}

export const ErrorContext = createContext<ErrorContextType>({ error: undefined, setError: () => {} })