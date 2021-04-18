import fs from 'fs';
import rp from 'request-promise';
import path from 'path';

import getConfig from 'next/config'
const { serverRuntimeConfig } = getConfig();


const makeProxyRequest = async (url) => {
  const returnPromise = (error, response, body) => {
    if (!error && response.statusCode == 200) {
      // console.log(response.headers);
      // console.log(body);
      return Promise.resolve(body);
    }
    else {
      // console.log(error, response, body);
      return Promise.resolve(null);
    }
  }

  let proxyRequest = rp.defaults({
      'proxy': 'http://c4008d90e89c4800b345c98249003ddd:@proxy.crawlera.com:8011'
  });

  // console.log('path for proxy cert ', path.join(serverRuntimeConfig.PROJECT_ROOT, './util/eBay/proxy/zyte-proxy-ca.crt'));

  let options = {
    url,
    // ca: fs.readFileSync(path.resolve(__dirname, "./zyte-proxy-ca.crt")),
    ca: fs.readFileSync(path.join(serverRuntimeConfig.PROJECT_ROOT, './util/eBay/proxy/zyte-proxy-ca.crt')),
    requestCert: true,
    rejectUnauthorized: false
  };

  return proxyRequest(options, returnPromise);
}

export { makeProxyRequest }
