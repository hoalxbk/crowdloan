import BigNumber from 'bignumber.js';

const ARROW_LEFT_KEY_CODE = 37;
const ARROW_RIGHT_KEY_CODE = 39;
const BACKSPACE_KEY_CODE = 8;
const DELETE_KEY_CODE = 46;
const DECIMAL_KEY_CODE = 190;

const A_KEY_CODE = 65;
const V_KEY_CODE = 86;
const C_KEY_CODE = 67;

const START_NUMBER_KEY_CODE = 48;
const END_NUMBER_KEY_CODE = 57;

const INTEGER_NUMBER_KEY_CODE_LIST = [ARROW_LEFT_KEY_CODE, ARROW_RIGHT_KEY_CODE, BACKSPACE_KEY_CODE, DELETE_KEY_CODE];
const FLOAT_NUMBER_KEY_CODE_LIST = [...INTEGER_NUMBER_KEY_CODE_LIST, DECIMAL_KEY_CODE];

export const formatToNumber = (yourNumber: any) => {
  if (yourNumber && !isNaN(Number(yourNumber))) {
    const yourNumberBig = new BigNumber(yourNumber).toString();
    if (yourNumberBig.length !== yourNumber.length) {
      return yourNumberBig;
    }
    return yourNumber;
  }
  return yourNumber;
};

export const getShortNumberBuyDecimals = (balance: any, decimals: number = 8) => {
  const balanceNumber = new BigNumber(balance).toString();
  if (balanceNumber.includes('.')) {
    const balanceSplit = balance.toString().split('.');
    const decimalsString = balanceSplit.pop();
    if (decimalsString.length > decimals) {
      return new BigNumber(balance).toFormat(decimals);
    }
    return new BigNumber(balance).toFormat();;
  }

  return new BigNumber(balance).toFormat();;
};

export const checkNumberByASCIIC = (event: any, isNotFloatNumber: boolean = false) => {
  const keyCode = event.keyCode || event.which;

  const keyCodeList = isNotFloatNumber ? INTEGER_NUMBER_KEY_CODE_LIST : FLOAT_NUMBER_KEY_CODE_LIST;
  if (keyCodeList.includes(keyCode)) {
    return true;
  }

  // Allow: Ctrl+A,Ctrl+C,Ctrl+V, Command+A
  if ((keyCode === A_KEY_CODE || keyCode === V_KEY_CODE || keyCode === C_KEY_CODE) && (event.ctrlKey === true || event.metaKey === true)) {
    return true;
  }

  if (event.shiftKey) {
    return false;
  }

  if (keyCode < START_NUMBER_KEY_CODE || keyCode > END_NUMBER_KEY_CODE) {
    return false;
  }

  return true;
};

export const isNotValidASCIINumber = (keyCode: number, decimalRequired: boolean = false) => {
  const abnormalKeys = [ARROW_LEFT_KEY_CODE, ARROW_RIGHT_KEY_CODE, A_KEY_CODE, C_KEY_CODE, V_KEY_CODE];

  decimalRequired && abnormalKeys.push(DECIMAL_KEY_CODE);

  if (abnormalKeys.indexOf(keyCode) >= 0) {
    return false;
  }

  return keyCode > 31 && (keyCode < 48 || keyCode > 57); 
};

export const isPreventASCIICharacters = (key: string) => {
  const abnormalKeys = ['arrowleft', 'arrowright', 'control', 'a', 'c', 'v'];
  return abnormalKeys.indexOf(key.toLowerCase()) >= 0;
};

export const replaceSpecialCharactersCopy = (str: string) => {
  return str.replaceAll(/[.,\s\D]*/g, '');
}

export const trimLeadingZeros = (input: string): string => {
  return input.replace(/^0+/, '');
}

export const trimEndingZeros = (input: string): string => {
  return input.replace(/0+$/, '');
}

export const trimLeadingZerosWithDecimal = (input: string): string => {

  if (input.includes('.')) {
    let trimEndingZerosString: string = '';
    
    if (input.startsWith('0.')) {
      trimEndingZerosString = trimEndingZeros(input);
    } else if (input.match(/^0{2,}\./)) {
      trimEndingZerosString = `0${trimEndingZeros(trimLeadingZeros(input))}`
    } else {
      trimEndingZerosString = trimEndingZeros(trimLeadingZeros(input))
    }

    if (trimEndingZerosString.length > 0 && trimEndingZerosString.endsWith('.')) {
      return trimEndingZerosString.split('').slice(0, -1).join('');
    }

    return trimEndingZerosString;
  }

  return trimLeadingZeros(input);
};

export const getDigitsAfterDecimals = (input: string): number => {                                                   
  let totalDigits = 0;                                                                                                
                                                                                                                                                                                                                                        
  if (input.includes('.')) {                                                                                          
    const splittedDecimals = input.slice(input.indexOf('.') + 1, input.length);                                       
                                                                                                                      
    totalDigits = splittedDecimals.length;     
  }                                                                       
                                                                                                                      
  return totalDigits;     
}
