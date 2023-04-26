import moment from 'moment';

export function getRenewalDate(now?: moment.Moment) {
  const date = moment(now).add(1, 'month');
  return date.format('YYYY-MM-DD');
}
