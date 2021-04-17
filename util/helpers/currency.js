const currencyMap = {
  AU: 'AUD',
  C: 'CAD',
}

const dollarsPerUnit = {
  AUD: 0.77,
  CAD: 0.79,
  GBP: 1.39,
  EUR: 1.2
}

const convertToUSD = (currency, price) => {
  let exchangeRate = dollarsPerUnit[currency];
  if (exchangeRate) {
    let dollars = price * exchangeRate;
    dollars = Math.round((dollars + Number.EPSILON) * 100) / 100;
    return dollars;
  } else {
    return null;
  }
}



export { currencyMap, convertToUSD }
