import tierABI from "../../../../abi/Tier.json";
import {getContractInstance} from "../../../../services/web3";

const REACT_APP_SOTATIER = process.env.REACT_APP_SOTATIER || '';

const useCallMultiGetTier = async (props: any) => {
  const { users } = props;


  console.log('THANNNNN======>');

  const campaignContract = getContractInstance(tierABI, REACT_APP_SOTATIER);



  // const userWallet = '0x69a21E10FEBdA6d0904547Da24a2a6d905cc83a3';
  // const userTier = await campaignContract?.methods.getUserTier(userWallet).call();
  // console.log('777=======?', userTier);



  // let tokenSold = campaignContract.methods.tokenSold().call();
  // const token = campaignContract.methods.token().call();
  // const tokenClaimedPromise = campaignContract.methods.tokenClaimed().call();
  //
  // const campaignDetail = await Promise.all([token, tokenSold, tokenClaimedPromise]);

  return users;

  //
  // const campaignContract = getContractInstance(tierABI, '0xf5e3035d6d766f6170dd87e632a35b353c24c164');
  //
  //
  // useEffect(() => {
  //   search();
  // }, [poolDetail, currentPage, query]);
  //
  // return {
  //   search,
  //   rows,
  //   setRows,
  //   searchDelay,
  // }
};


export default useCallMultiGetTier;




