import request from 'postman-request';
import fs from 'fs';
import rp from 'request-promise';
import axios from 'axios';
import https from 'https';
const path = require("path");

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

  // const httpsAgent = new https.Agent({ ca: fs.readFileSync(path.resolve(__dirname, "./zyte-proxy-ca.crt")), keepAlive: false });

  const callback = (error, response, body) => {
      if (!error && response.statusCode == 200) {
          // console.log(response.headers);
          // console.log(body);
          return Promise.resolve(body);
      }
      else {
          // console.log(error, response, body);
      }
  }

  // NOTE: Figure out how to use async/await
  // let something = await axios.get(url, {
  //   proxy: 'http://c4008d90e89c4800b345c98249003ddd:@proxy.crawlera.com:8011',
  //   httpsAgent
  // });

  return proxyRequest(options, callback);
}

export { makeProxyRequest }
