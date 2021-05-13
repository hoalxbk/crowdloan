
import {useEffect, useState} from "react";
import {debounce} from "lodash";
import {DEFAULT_LIMIT} from "../../../../constants";

const useGetList = (props: any) => {
  const { poolDetail, handleSearchFunction } = props;
  const [rows, setRows] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [totalRecords, setTotalRecords] = useState(1);

  const [query, setQuery] = useState('');
  const [failure, setFailure] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleCampaignSearch = (event: any) => {
    setCurrentPage(1);
    setQuery(event.target.value);
  };
  const searchDelay = debounce(handleCampaignSearch, 500);
  const search = () => {
    console.log('SEARCH Query: ', query );
    if (poolDetail && poolDetail.id) {
      const searchParams = {
        search_term: query,
        page: currentPage,
        limit: DEFAULT_LIMIT,
      };
      handleSearchFunction &&
      handleSearchFunction(poolDetail.id, searchParams)
        .then((res: any) => {
          if (res?.status !== 200) {
            setFailure(true);
            return [];
          } else {
            let response = res.data || {};
            setFailure(false);
            setLastPage(response.lastPage || 1);
            setCurrentPage(response.page || 1);
            setTotalRecords(response.total || 1);

            let newData = response.data || [];
            setRows(newData);

            return newData;
          }
        });
    }
  };

  useEffect(() => {
    search();
  }, [poolDetail, currentPage, query]);

  const handlePaginationChange = (event: any, page: number) => {
    setCurrentPage(page);
  };

  return {
    rows, setRows,
    search, searchDelay,
    failure, loading,
    lastPage, currentPage, totalRecords,
    handlePaginationChange,
  }
};


export default useGetList;




