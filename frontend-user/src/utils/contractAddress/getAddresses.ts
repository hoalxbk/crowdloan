import { USDT_ADDRESS, USDT_BSC_ADDRESS, USDC_ADDRESS, USDC_BSC_ADDRESS, ETH_CHAIN_ID } from '../../constants/network';

export const getUSDTAddress = (appChainID: string): string => {
  return (appChainID === ETH_CHAIN_ID ? USDT_ADDRESS: USDT_BSC_ADDRESS) as string;
}

export const getUSDCAddress = (appChainID: string) => {
  return (appChainID === ETH_CHAIN_ID ? USDC_ADDRESS: USDC_BSC_ADDRESS) as string;
}


