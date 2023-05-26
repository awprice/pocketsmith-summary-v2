import { ApolloServer } from 'apollo-server-lambda';
import axios from 'axios';
import get from 'lodash/get';
import parseLinkHeader from 'parse-link-header';
import cacache from 'cacache';
import crypto from 'crypto';
import { loadFilesSync } from '@graphql-tools/load-files';

const endpoint = 'https://api.pocketsmith.com';
const pageSize = 100;
const cachePath = '/tmp/cache';

/**
 * @param token
 * @param url
 * @returns {string}
 */
const getRequestKey = (token, url) => crypto.createHash('md5').update(`${token}:${url}`).digest('hex');

/**
 * @param key
 * @returns {Q.Promise<any>}
 */
const getCachedResult = (key) => cacache.get(cachePath, key)
  .then((res) => {
    if (res.metadata.expiry < Date.now()) {
      return null;
    }
    return res.data;
  })
  .catch(() => null);

/**
 * @param key
 * @param value
 * @param expiry
 */
const setCachedResult = (key, value, expiry) => {
  console.log(`Putting key ${key} into cache, expiring in ${expiry} seconds`); // eslint-disable-line
  const expiryTime = Date.now() + (expiry * 1000);
  return cacache.put(cachePath, key, JSON.stringify(value), { metadata: { expiry: expiryTime } });
};

/**
 * @param token
 * @param url
 * @param expiry
 * @returns {Promise<Promise<T | never> | T>}
 */
const pocketsmithGetResult = async (token, url, expiry) => {
  // Generate a key for this request
  const key = getRequestKey(token, url);
  const cachedResult = await getCachedResult(key);
  if (cachedResult !== null) {
    console.log(`Using cached result for ${url}`); // eslint-disable-line
    return JSON.parse(cachedResult.toString());
  }
  const headers = {
    'X-Developer-Key': token,
  };
  console.log(`Sending request to ${url}`); // eslint-disable-line
  const result = await axios(url, { headers });
  const data = { data: result.data, headers: result.headers };
  await setCachedResult(key, data, expiry);
  return data;
};

/**
 * @param parent
 * @param args
 * @param context
 * @returns {Promise<*>}
 */
const user = async (parent, args, context) => {
  const res = await pocketsmithGetResult(context.token, `${endpoint}/v2/me`, 86400);
  return res.data;
};

/**
 * @param parent
 * @param args
 * @param context
 * @returns {Promise<Array|*>}
 */
const transactions = async (parent, {end_date, start_date, page}, context) => { // eslint-disable-line
  if (!end_date.length || !start_date.length) {
    return Promise.reject(new Error('Invalid end_date or start_date argument'));
  }
  const url = `${endpoint}/v2/users/${parent.id}/transactions?per_page=${pageSize}&end_date=${end_date}&start_date=${start_date}&page=${page}`; // eslint-disable-line
  let res;
  try {
    res = await pocketsmithGetResult(context.token, url, 300);
  } catch (err) {
    return {
      transactions: [],
      pageInfo: {
        lastPage: true,
      },
    };
  }
  const links = parseLinkHeader(get(res, 'headers.link', ''));
  const lastLink = get(links, 'last', {});
  const lastPage = get(lastLink, 'page', 1);
  return {
    transactions: res.data,
    pageInfo: {
      lastPage,
    },
  };
};

const budgets = async (parent, args, context) => {
  const url = `${endpoint}/v2/users/${parent.id}/budget`;
  const res = await pocketsmithGetResult(context.token, url, 300);
  return res.data;
};

const resolvers = {
  Query: {
    user,
  },
  User: {
    transactions,
    budgets,
  },
};

const server = new ApolloServer({
  typeDefs: loadFilesSync('schema/schema.graphql'),
  resolvers,
  introspection: true,
  context: ({ event, context }) => ({
    token: get(event, 'headers.x-developer-key', ''),
    event,
    context,
  }),
});

exports.handler = server.createHandler();
