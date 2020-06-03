const platform = (() => {
  if (typeof wx !== 'undefined') return wx
  if (typeof mp !== 'undefined') return mp
  if (typeof tt !== 'undefined') return tt
  if (typeof dd !== 'undefined') return dd
  return {};
})()

function clearUrlLast(url) {
  return url.slice(-1) === '/' ? url.slice(0, -1) : url;
}

function concatUrls(urls) {
  let {length} = urls, resultUrl = clearUrlLast(urls[0]), url
  for (let i = 1; i < length; i++) {
    url = clearUrlLast(urls[i]);
    resultUrl = resultUrl + (url.slice(0, 1) === '/' ? url : '/' + url);
  }
  return resultUrl
}

export function requestFactory(options = {}, wx = platform) {
  const {
    baseURL,
    method: defaultMethod = 'GET',
    header,
    headers,
    ...opts
  } = options
  const headersAll = {...header, ...headers}

  function registry(url, method, config) {

  }

  return {
    registry
  }
}