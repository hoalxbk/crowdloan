import moment from 'moment'

export const convertTimeToStringFormat = (date: Date) => {
  return moment(date).format("h:mm A, DD MMMM YYYY");
}

export const convertUnixTimeToDateTime = (time: number) => {
  // return moment.unix(time).format("DD/MM/yyyy hh:mm:ss a");
  return moment.unix(time).format("hh:mm:ss A MM/DD/yyyy");
}

export const convertDateTimeToUnix = (time: any): string => {
  if (!time) return "";
  const unixTime = moment(time).format("x");
  return moment(time).format('x').substring(0, unixTime.length - 3);
}

export const buildMomentTimezone = (datetime: any): any => {
  if (!datetime) return '';

  // const momentTimezoneObject = moment(datetime).local();
  const momentTimezoneObject = moment(moment.utc(datetime)).local();
  return momentTimezoneObject;
}

export const convertDateLocalWithTimezone = (datetime: any): string => {
  if (!datetime) return '';
  const date = buildMomentTimezone(datetime).format("hh:mm:ss A");
  return date;
}

export const convertTimeLocalWithTimezone = (datetime: any): string => {
  if (!datetime) return '';
  const time = buildMomentTimezone(datetime).format("MM/DD/YYYY");
  return time;
}

export const unixTimeNow = () => {
  return parseInt((Date.now() / 1000) + '')
}

export const unixTime = (time: any) => {
  return moment(time).unix();
}

export const timeAgo = (time: any) => {
  return moment(time).fromNow()
}
