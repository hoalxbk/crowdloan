
import {useEffect, useState} from "react";
import {debounce} from "lodash";

const useGetList = (props: any) => {
  const { poolDetail, handleSearchFunction } = props;
  const [rows, setRows] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [query, setQuery] = useState('');
  const handleCampaignSearch = (event: any) => {
    setCurrentPage(1);
    setQuery(event.target.value);
  };
  const searchDelay = debounce(handleCampaignSearch, 500);
  const search = () => {
    if (poolDetail && poolDetail.id) {
      const serchParams = {
        search_term: query,
      };
      handleSearchFunction && handleSearchFunction(poolDetail.id, serchParams)
        .then((res: any) => setRows(res.data));
    }
  };

  useEffect(() => {
    search();
  }, [poolDetail, currentPage, query]);

  return {
    search: search,
    rows,
    setRows,
    searchDelay,
  }
};


export default useGetList;




