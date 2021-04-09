import React, { SetStateAction, Dispatch } from 'react';
import { AbstractConnector } from '@web3-react/abstract-connector'

export type HeaderContextType = {
  agreedTerms: boolean,
  setAgreedTerms: Dispatch<SetStateAction<boolean>>,
  handleProviderChosen?: (name: string, connector: AbstractConnector) => void,
  walletName: (string | undefined)[],
  connectWalletLoading: boolean
}

export const HeaderContext = React.createContext<HeaderContextType>({
  agreedTerms: false,
  setAgreedTerms: () => {},
  walletName: [],
  connectWalletLoading: false,
  handleProviderChosen: () => {}
});
