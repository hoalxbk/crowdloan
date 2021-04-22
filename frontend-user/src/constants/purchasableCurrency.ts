export enum PurchaseCurrency {
  USDT = "USDT",
  USDC = "USDC",
  ETH = "ETH"
}

export type purchaseCurrency = Extract<PurchaseCurrency, PurchaseCurrency.ETH | PurchaseCurrency.USDC | PurchaseCurrency.USDT>;
