import BigNumber from 'bignumber.js';
import qs from 'qs';

const currentSearch = () => new URLSearchParams(window.location.search);

export const asyncSearch = (options: Record<string, string>) => {
  const searchParams = currentSearch();
  Object.keys(options).forEach((key) => {
    searchParams.set(key, options[key]);
  });
  const searchString = searchParams.toString();
  const { origin, pathname } = window.location;
  const newHref = `${origin}${pathname}?${searchString}`;
  window.history.pushState({}, '', newHref);
};
export function withBaseRoute(route: any = '') {
  // TODO: add logging/tracing code here

  if (typeof route === 'object' && 'pathname' in route) {
    return {
      ...route,
      pathname: `${route.pathname}`,
    };
  }
  return route;
}

export function getNetwork() {
  const queries = qs.parse(window.location.search, {
    ignoreQueryPrefix: true,
  });
  let network = (queries.network as string) || localStorage.getItem('network');
  const networks = process.env.REACT_APP_STARCOIN_NETWORKS!;
  const networkArr = networks.split(',');
  if (!network) {
    network = networkArr[0];
  }
  localStorage.setItem('network', network);
  asyncSearch({ network });
  return network;
}

export function isHex(num: string) {
  return Boolean(num.match(/^0x[0-9a-f]+$/i));
}

export function formatBalance(num: string | number) {
  const value = new BigNumber(num);
  const convertedValue = value.div(1000000000).toFixed(4);
  return convertedValue;
}

export function toObject(data: {}): string {
  return JSON.stringify(data, (key, value) => {
    if (typeof value === 'bigint') {
      return value.toString();
    }
    return value;
  });
}
