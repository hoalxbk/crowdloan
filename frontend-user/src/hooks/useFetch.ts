import { useState, useEffect } from 'react';
import axios from '../services/axios';

type useFetchReturnType<T> ={
  loading: boolean;
  error: string;
  data: T | undefined
}

const useFetch = <T>(uri: string, suspendRender: any = false): useFetchReturnType<T> => {
  const [loading, setLoading] = useState<boolean>(false);
  const [data, setData] = useState<T | undefined>(undefined);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const fetchDataFromUri = async () => {
      setLoading(true);

      try {
        const response = await axios.get(uri) as any;
        response.data && setData(response.data.data);

        setLoading(false);
      } catch (error: any) {
        setLoading(false);
        setError(error.message);
      }
    }

    uri && (!suspendRender) && fetchDataFromUri();
  }, [uri, suspendRender]);

  return {
    loading, 
    error,
    data
  }
}

export default useFetch;
