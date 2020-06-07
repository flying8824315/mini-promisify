import {asyncMethods} from "./methods";

// polyfill for finally
if(!Promise.prototype.finally) {
  Promise.prototype.finally = function(callback) {
    let P = this.constructor
    return this.then(
      value => P.resolve(callback()).then(() => value),
      reason => P.resolve(callback()).then(() => {
        throw reason
      })
    )
  }
}

// core method
export const promisify = (api) => {
  return (args = {}) => {
    return new Promise((resolve, reject) => {
      api({
        fail: reject,
        success: resolve,
        ...args,
      })
    })
  }
}

export const promisifyAll = (wx = {}, methods) => {
  const cachedMethods = {}, names = [...(methods || asyncMethods)];
  return new Proxy(cachedMethods, {
    get(target, p) {
      let method = cachedMethods[p];
      if(!method) {
        method = wx[p];
        if(names.indexOf(p) >= 0 && typeof method === 'function') {
          method = promisify(method)
        }
        cachedMethods[p] = method;
      }
      return method;
    }
  });
}