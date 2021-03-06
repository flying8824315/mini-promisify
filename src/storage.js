import {promisify} from "./promisify"

export function miniStorageFactory(wx = {}) {
  const clearStorage = promisify(wx.clearStorage)
  const removeStorage = promisify(wx.removeStorage)
  const getStorageInfo = promisify(wx.getStorageInfo)

  return {
    getSync: wx.getStorageSync,
    setSync: wx.setStorageSync,
    get(key, defaultValue, defaultForAbsentOnly = false) {
      const hasDefaultVal = arguments.length > 1
      return new Promise(((resolve, reject) => {
        wx.getStorage({
          key,
          success({data}) {
            resolve(defaultForAbsentOnly ? data : (data == null ? defaultValue : data))
          },
          fail(err) {
            if (hasDefaultVal) {
              resolve(defaultValue)
            } else {
              reject(err)
            }
          }
        })
      }))
    },
    set(key, data) {
      return new Promise(((resolve, reject) => {
        wx.setStorage({
          key, data,
          success: resolve,
          fail: reject
        })
      }))
    },
    compute(key, handler, forceCache) {
      const handled = (computed, resolve) => {
        if (computed === false && !forceCache) {
          wx.removeStorage({key, success: resolve})
        } else {
          wx.setStorage({key, data: computed, success: resolve});
        }
      }
      return new Promise(resolve => {
        wx.getStorage({
          key,
          success({data}){
            handled(handler(data, null), resolve)
          },
          fail(err){
            handled(handler(null, err), resolve)
          }
        })
      })
    },
    info: (sync) => sync ? wx.getStorageInfoSync() : getStorageInfo(),
    clear: (sync) => sync ? wx.clearStorageSync(key) : clearStorage(),
    remove: (key, sync) => {
      return sync ? wx.removeStorageSync(key) : removeStorage({key})
    }
  }
}

export function webStorageFactory(storage = localStorage) {
  return {
    /**
     * 获取缓存
     * @param key
     * @param defaultValue 当缓存的数据为 null|undefined 时，返回 defaultValue
     */
    get(key, defaultValue) {
      const value = JSON.parse(storage.getItem(key))
      return (value == null && arguments.length > 1) ? defaultValue : value
    },
    set(key, data) {
      storage.setItem(key, JSON.stringify(data || null))
    },
    remove(key) {
      storage.removeItem(key)
    }
  }
}