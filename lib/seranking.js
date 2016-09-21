var request = require('request');
const md5 = require('md5');

import {config} from './../config/config';
import {array_to_get} from './array_to_get';

const options = {
  api_url: config.seranking.api_url,
  username: config.seranking.username,
  password: config.seranking.password,
  cache_ttl: 120000, // 2 minutes
};

let cache = {};

const _call = ({method, get_array, post_array}) => {
  return new Promise((resolve, reject) => {

    method = method || 'get';
    post_array = post_array || null;
    let uri = `${options.api_url}?${array_to_get({array: get_array})}`;
    request[method](
      uri,
      {
        post_array,
      },
      function (error, response, body) {
        if (error) {
          reject(error);
        } else {
          let parsed_json = {};
          try {
            parsed_json = JSON.parse(body);
          } catch (e) {
            console.error('#f3424f4sg json parse error, seranking result: ', body);
          }
          resolve(parsed_json);
        }
      }
    );

  });
};

const seranking_login = ({username, password}) => {
  return new Promise((resolve, reject) => {

    if (!username || !password) {
      reject('#14f341 error - username or password missing');
    }

    let encoded_pass = md5(password);

    let cache_key = md5(`login-${username}-${password}`);
    if (cache[cache_key]) {
      resolve(cache[cache_key]); // give token from cache
    }

    let get_array = [];
    get_array.push({var: 'method', val: 'login'});
    get_array.push({var: 'login', val: username});
    get_array.push({var: 'pass', val: encoded_pass});

    _call({method: 'get', get_array: get_array})
      .then(result => {

        cache[cache_key] = result;
        setTimeout(() => {
          cache[cache_key] = null;
        }, options.cache_ttl);

        resolve(result);
      })
      .catch(e => {
        console.error('#d4fsf e: ', e);
        reject(e);
      });

  });
};

const seranking_sites = () => {
  return new Promise((resolve, reject) => {

    let cache_key = md5('sites');
    if (cache[cache_key]) {
      resolve(cache[cache_key]); // give token from cache
    }

    seranking_login({username: options.username, password: options.password})
      .then(user => {

        let get_array = [];
        get_array.push({var: 'method', val: 'sites'});
        get_array.push({var: 'token', val: user.token});

        _call({method: 'get', get_array: get_array})
          .then(result => {
            /*
             result is array of objects:
             {
             name: 'example.com',
             id: '123',
             title: 'Example site',
             group_id: '123',
             keysCount: '123',
             process: 99,
             totalUp: 123,
             totalDown: 123,
             todayAvgPosition: 123,
             yesterdayAvgPosition: 123,
             SEs: [ [Object] ]
             },
             */
            cache[cache_key] = result;
            setTimeout(() => {
              cache[cache_key] = null;
            }, options.cache_ttl);
            resolve(result);
          })
          .catch(e => {
            console.error('#d4s45jhjkjf error: ', e);
          });
      })
      .catch(e => {
        console.error('#1f41ds1f error: ', e);
        reject(e);
      });
  });
};

const seranking_siteKeywords = ({site_id}) => {
  return new Promise((resolve, reject) => {

    if (!site_id) {
      reject('#5dfd4s5f54 error - site_id is missing');
    }

    let cache_key = md5(`seranking_siteKeywords-${site_id}`);
    if (cache[cache_key]) {
      resolve(cache[cache_key]);
    }

    seranking_login({username: options.username, password: options.password})
      .then(user => {

        let get_array = [];
        get_array.push({var: 'method', val: 'siteKeywords'});
        get_array.push({var: 'token', val: user.token});
        get_array.push({var: 'siteid', val: site_id});

        _call({method: 'get', get_array: get_array})
          .then(result => {
            /*

             result is array of objects:

             {
             id: '123',
             name: 'some keyword',
             group_id: '123',
             link: null,
             first_check_date: '2016-09-20'
             }

             */
            cache[cache_key] = result;
            setTimeout(() => {
              cache[cache_key] = null;
            }, options.cache_ttl);

            resolve(result);
          })
          .catch(e => {
            console.error('#r4gre5g74 error: ', e);
          });
      })
      .catch(e => {
        console.error('#f5444352g error: ', e);
        reject(e);
      });
  });
};


const seranking_stat = ({site_id, date_start, date_end, se}) => {

  return new Promise((resolve, reject) => {
    if (!site_id) {
      reject('#wg4w5 error - site_id is missing');
    }
    date_start = date_start || null;  // optional
    date_end = date_end || null;      // optional
    se = se || null;                  // optional

    let cache_key = md5(`stat-${site_id}-${date_start || ''}-${date_end || ''}-${se || ''}`);
    if (cache[cache_key]) {
      resolve(cache[cache_key]);
    }

    seranking_login({username: options.username, password: options.password})
      .then(user => {
        let get_array = [];
        get_array.push({var: 'method', val: 'stat'});
        get_array.push({var: 'siteid', val: site_id});
        get_array.push({var: 'token', val: user.token});

        _call({method: 'get', get_array: get_array})
          .then(result => {

            /*
             result is array of objects:

             [
             { seID: 123,
             regionID: null,
             business_name: 'Example Ltd.',
             phone: '(370) 123 45',
             region_name: 'city, country',
             keywords:
             [
             { id: '123',
             positions: [ { date: '2016-09-20', pos: '18', change: 0, price: 0 },
             { date: '2016-09-21', pos: '18', change: 0, price: 0 } ],
             landing_pages: [ { url: 'http://www.example.com/', date: '2016-09-20' } ],
             total_sum: 0 }
             ] }
             ]

             */

            cache[cache_key] = result;
            setTimeout(() => {
              cache[cache_key] = null;
            }, options.cache_ttl);

            resolve(result);
          })
          .catch(e => {
            console.error('#57j78kdh87k error: ', e);
          });
      })
      .catch(e => {
        console.error('#l873qcgghfr error: ', e);
        reject(e);
      });

  });

};

export {
  seranking_login,
  seranking_sites,
  seranking_siteKeywords,
  seranking_stat,
};
