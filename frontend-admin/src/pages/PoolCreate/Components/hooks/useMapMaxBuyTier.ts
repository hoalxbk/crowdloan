import {useEffect, useState} from "react";

const useMapMaxBuyTier = (props: any) => {
  const { poolDetail } = props;
  const [maxBuyTiersMapping, setMaxBuyTiersMapping] = useState<any>([]);
  const [minBuyTiersMapping, setMinBuyTiersMapping] = useState<any>([]);

  useEffect(() => {
    if (poolDetail && poolDetail.tiers && poolDetail.tiers.length > 0) {
      const tiers = poolDetail.tiers;
      const mappingMax: any = {};
      const mappingMin: any = {};

      for (let i = 0; i < tiers.length; i++) {
        mappingMax[tiers[i].level] = tiers[i].max_buy;
        mappingMin[tiers[i].level] = tiers[i].min_buy;
      }
      setMaxBuyTiersMapping(mappingMax);
      setMinBuyTiersMapping(mappingMin);
    }
  }, [poolDetail]);

  return {
    maxBuyTiersMapping,
    minBuyTiersMapping,
  }
};


export default useMapMaxBuyTier;




