/*let i = 1;

while (true) {
  const diamond = (1 * i) * 4;
  const gold = (2 * i) * 16;
  const silver = (3 * i) * 30;
  const bronze = (4 * i) * 50;
  const total = diamond + gold + silver + bronze;
  if (total % 4 === 0) {
    console.log(total, diamond, gold, silver, bronze);
    break;
  }
  i++;
}*/

let i = 1;

while (true) {
  const diamond = (1 * i) * 4;
  const gold = (2 * i) * 16;
  const silver = (4 * i) * 30;
  const total = diamond + gold + silver;
  console.log(total, diamond, gold, silver);
  i++;
}
