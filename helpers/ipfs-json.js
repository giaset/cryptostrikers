const csv = require('csvtojson');
const ipfsAPI = require('ipfs-api');

const ipfs = ipfsAPI({
  host: 'ipfs.infura.io',
  port: '5001',
  protocol: 'https'
});

let serialPromise = Promise.resolve('STARTING NOW!');

csv().fromFile('./helpers/metadata.csv').then(json => {
  json.forEach(obj => {
    const player = obj.Player;
    const set = obj.Set;

    const blob = {
      name: `${set} ${player}`,
      image: 'https://ipfs.infura.io/ipfs/'+obj.Image,
      attributes: {
        checklist_ID: `#${obj['Checklist #']}`,
        set,
        player,
        country: obj.Country,
        tier: obj['Rarity Tier'],
        supply: parseInt(obj.Supply),
        stars: parseInt(obj["Star Count"])
      }
    };

    const data = ipfs.types.Buffer.from(JSON.stringify(blob));

    serialPromise = serialPromise.then(result => {
      console.log(result);
      return ipfs.add(ipfs.types.Buffer.from(data));
    });
  });

  serialPromise.then(result => console.log(result));
});
