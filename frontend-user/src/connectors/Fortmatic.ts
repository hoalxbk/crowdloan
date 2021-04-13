import {FortmaticConnector as FortmaticConnectorCore} from '@web3-react/fortmatic-connector'
import {ChainId} from '../constants/network';

const CHAIN_ID_NETWORK_ARGUMENT = {
  [ChainId.MAINNET]: 'mainnet',
  [ChainId.ROPSTEN]: 'ropsten',
  [ChainId.RINKEBY]: 'rinkeby',
  [ChainId.KOVAN]: 'kovan',
}

export const OVERLAY_READY = 'OVERLAY_READY'

type FortmaticSupportedChains = Extract<ChainId, ChainId.MAINNET | ChainId.ROPSTEN | ChainId.RINKEBY | ChainId.KOVAN>

export class FortmaticConnector extends FortmaticConnectorCore {
  async activate() {
    if (!this.fortmatic) {
      //@ts-ignore
      const {default: Fortmatic} = await import('fortmatic');
      const {apiKey, chainId} = this as any;
      if (chainId in ChainId) {
        this.fortmatic = new Fortmatic(apiKey, CHAIN_ID_NETWORK_ARGUMENT[chainId as FortmaticSupportedChains]);
      } else {
        throw new Error(`Unsupported Network ID: ${chainId}`)
      }
    }

    const provider = this.fortmatic.getProvider()

    const pollForOverlayReady = new Promise(resolve => {
      const interval = setInterval(() => {
        if (provider.overlayReady) {
          clearInterval(interval)
          this.emit(OVERLAY_READY)
          resolve(undefined);
        }
      }, 200)
    })

    const [account] = await Promise.all([
      provider.enable().then((accounts: string[]) => accounts[0]),
      pollForOverlayReady
    ])

    return {
      provider: this.fortmatic.getProvider(),
      chainId: (this as any).chainId,
      account
    }
  }
}

