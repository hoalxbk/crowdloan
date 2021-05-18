import moment from 'moment';
import BigNumber from "bignumber.js";

export const renderError = (errors: any, prop: string) => {
  if (errors[prop]) {
    const errorName = prop.split("_").join(' ');
    const errorType = errors[prop].type;

    switch (errorType) {
      case 'required': {
        return 'This field is required';
      }
      case 'greaterOrEqualToday': {
        return `The ${errorName} must be after current date.`;
      }
      case 'greateOrEqualStartTime': {
        return 'This finish time must be after the start time';
      }
      case 'greaterOrEqualFinishTime': {
        return 'This relase time must be after the finish time';
      }
      case 'validAddress': {
        return "Address receive is invalid.";
      }
      case 'invalidToken': {
        return errors[prop].message;
      }
      case 'tokenAlreadyUsed': {
        return 'Token address is already in use.';
      }
    };
  }

  return;
};

export const renderErrorCreatePool = (errors: any, prop: string) => {
  if (errors[prop]) {
    const errorName = prop.split("_").join(' ');
    const errorType = errors[prop].type;

    switch (errorType) {
      case 'required': {
        return 'This field is required';
      }
      case 'greateOrEqualStartJoinPoolTime': {
        return 'This end join pool time must be after the start join pool time';
      }
      case 'greaterOrEqualEndJoinPoolTime': {
        return 'This relase time must be after the finish time';
      }

      case 'greaterOrEqualToday': {
        return `The ${errorName} must be after current date.`;
      }
      case 'greateOrEqualStartTime': {
        return 'This finish time must be after the start time';
      }
      case 'greaterOrEqualFinishTime': {
        return 'This relase time must be after the finish time';
      }

      case 'greaterThanZero': {
        return 'This field must be greater than 0';
      }
      case 'totalSoldCoinGreaterThanZero': {
        return 'Total Sold Coin must be greater than 0.';
      }
      case 'maxBuyGreaterThanZero': {
        return 'Max Buy must be greater than 0.';
      }
      case 'minBuyGreaterMaxBuy': {
        return 'Min Buy must be less than Max Buy.';
      }


      case 'validAddress': {
        return "Address receive is invalid.";
      }
      case 'invalidToken': {
        return errors[prop].message;
      }
      case 'tokenAlreadyUsed': {
        return 'Token address is already in use.';
      }
      case 'networkNotMatch': {
        return 'Your selected network can\'t deploy. Please switch network in MetaMask or change this option';
      }
    };
  }

  return;
};

export const fieldMustBeGreaterThanZero = (value: any) => new BigNumber(value).gt(0);


