import {alertSuccess} from "../../../../store/actions/alert";
import {useDispatch} from "react-redux";

const useDeleteItem = (props: any) => {
  const dispatch = useDispatch();
  const { poolDetail, handleSearchFunction, handleDeleteFunction } = props;

  const deleteItem = async (e: any, row: any, index: number) => {
    console.log('ROW: ', row, index);
    // eslint-disable-next-line no-restricted-globals
    if (!confirm('Do you want delete this item?')) {
      return false;
    }

    // Delete
    if (handleDeleteFunction) {
      const response = await handleDeleteFunction(poolDetail?.id, { wallet_address: row.wallet_address })
      if (response?.status === 200) {
        dispatch(alertSuccess('Delete Success'));
        await handleSearchFunction();
      }
    }
  };

  return {
    deleteItem
  }
};


export default useDeleteItem;




