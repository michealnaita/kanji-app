import moment from 'moment';

export function getRenewalDate() {
  const date = moment().add(1, 'month');
  return date.format('YYYY-MM-DD');
}
