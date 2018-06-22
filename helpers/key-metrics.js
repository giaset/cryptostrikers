const moment = require('moment');
const request = require('request');

function timeStampToDay(timeStamp) {
  const JUN11 = 1528729200;
  if (timeStamp < JUN11) {
    return 0;
  }

  return 1 + Math.floor((timeStamp - JUN11) / 86400);
}

const url  = 'http://api.etherscan.io/api?module=account&action=txlist&address=0xEB5405E21d07fa5e3B6644d0aE7f391B47F17E27';
request(url, (error, response, body) => {
  const payload = JSON.parse(body);
  console.log(payload.result.length);
  const errorCounts = { 0: 0, 1: 0 };
  const saleCounts = { 0: 0, 25000000000000000: 0, 50000000000000000: 0 };
  const uniqueAddresses = new Set();
  const dailySales = {};
  payload.result.forEach(transaction => {
    //console.log(moment.unix(transaction.timeStamp).format('ddd MMM Do - h:mm a'));
    const day = timeStampToDay(transaction.timeStamp);
    const isError = transaction.isError;
    errorCounts[isError]++;
    if (isError === '0') {
      const value = transaction.value;
      saleCounts[value]++;
      if (value !== '0') {
        uniqueAddresses.add(transaction.from);

        if (!dailySales[day]) {
          dailySales[day] = {};
        }

        if (dailySales[day][value]) {
          dailySales[day][value]++;
        } else {
          dailySales[day][value] = 1;
        }
      }
    }
  });
  console.log('errorCounts', errorCounts);
  console.log('saleCounts', saleCounts);
  console.log('uniqueAddresses', uniqueAddresses.size);
  console.log(dailySales);
});