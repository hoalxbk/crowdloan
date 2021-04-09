import { createContext } from 'react';

export type AppContextType = {
  binanceAvailable: boolean
}

export const AppContext = createContext<AppContextType>({
  binanceAvailable: false
})
