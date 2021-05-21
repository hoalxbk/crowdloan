import moment from "moment";

const useFormatTierToUpdate = (props: any) => {
  const { minTier, tierConfiguration, acceptCurrency } = props;

  let tierConfigurationFomated = JSON.parse(tierConfiguration);
  tierConfigurationFomated = tierConfigurationFomated.map((currency: any, index: number) => {
    const item = {
      ...currency,
      currency: acceptCurrency,
    };
    if (index < minTier) {
      item.maxBuy = 0;
      item.minBuy = 0;
    }

    item.startTime = moment(item.startTime).unix() || null;
    item.endTime = moment(item.endTime).unix() || null;
    return item;
  });

  return {
    tierConfiguration: tierConfigurationFomated
  }
};


export default useFormatTierToUpdate;




