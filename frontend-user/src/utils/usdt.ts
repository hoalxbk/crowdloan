import BigNumber from 'bignumber.js';

export const convertAmountToUsdt = (decimals: any, amount: string) => {
  const decimalsNumber = new BigNumber(`1e+${decimals}`);
  const amountNumber = new BigNumber(amount);
  return amountNumber.multipliedBy(decimalsNumber);
};

export const isAllowanceUsdt = (decimals: any, amount: any, allowanceAmount: any) => {
  const amountNumberConvert = convertAmountToUsdt(decimals, amount);
  const allowanceAmountNumber = new BigNumber(allowanceAmount);

  const resultCompare = allowanceAmountNumber.comparedTo(amountNumberConvert);
  return resultCompare === 1 || resultCompare === 0;
};