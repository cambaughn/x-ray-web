import fs from 'fs';
import rp from 'request-promise';
import path from 'path';

const makeProxyRequest = async (url) => {
  let proxyRequest = rp.defaults({
      'proxy': 'http://c4008d90e89c4800b345c98249003ddd:@proxy.crawlera.com:8011'
  });

  let options = {
      url,
      ca: fs.readFileSync(path.resolve(__dirname, "./zyte-proxy-ca.crt")),
      requestCert: true,
      rejectUnauthorized: false
  };

  const callback = (error, response, body) => {
      if (!error && response.statusCode == 200) {
        // console.log(response.headers);
        // console.log(body);
        return Promise.resolve(body);
      }
      else {
        console.log(error, response, body);
      }
  }

  return proxyRequest(options, callback);
}

export { makeProxyRequest }
