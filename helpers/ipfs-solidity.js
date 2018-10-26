const csv = require('csvtojson');

csv().fromFile('./helpers/metadata2.csv').then(json => {
  json.forEach(obj => {
    console.log(obj.JSON);
    //console.log(`checklistIdURIs[${parseInt(obj['Checklist #'])}] = "${obj.JSON}"; // ${obj.Player}`);
  });
});
