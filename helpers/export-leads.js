const leadsJson = require('./cryptostrikers-prod-leads-export');
const allEmails = Object.values(leadsJson).map(lead => lead.email);
const uniqEmails = Array.from(new Set(allEmails));
console.log(uniqEmails);
