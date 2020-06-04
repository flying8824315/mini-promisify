'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

const asyncMethods = [
  'addCard',
  'addPhoneContact',
  'authorize',
  'canvasGetImageData',
  'canvasPutImageData',
  'canvasToTempFilePath',
  'checkIsSoterEnrolledInDevice',
  'checkIsSupportSoterAuthentication',
  'checkSession',
  'chooseAddress',
  'chooseImage',
  'chooseInvoice',
  'chooseInvoiceTitle',
  'chooseLocation',
  'chooseMessageFile',
  'chooseVideo',
  'clearStorage',
  'closeBLEConnection',
  'closeBluetoothAdapter',
  'closeSocket',
  'compressImage',
  'connectSocket',
  'connectWifi',
  'createBLEConnection',
  'downloadFile',
  'getAvailableAudioSources',
  'getBLEDeviceCharacteristics',
  'getBLEDeviceServices',
  'getBackgroundAudioPlayerState',
  'getBatteryInfo',
  'getBeacons',
  'getBluetoothAdapterState',
  'getBluetoothDevices',
  'getClipboardData',
  'getConnectedBluetoothDevices',
  'getConnectedWifi',
  'getExtConfig',
  'getFileInfo',
  'getHCEState',
  'getImageInfo',
  'getLocation',
  'getNetworkType',
  'getSavedFileInfo',
  'getSavedFileList',
  'getScreenBrightness',
  'getSetting',
  'getShareInfo',
  'getStorage',
  'getStorageInfo',
  'getSystemInfo',
  'getUserInfo',
  'getWeRunData',
  'getWifiList',
  'hideLoading',
  'hideNavigationBarLoading',
  'hideShareMenu',
  'hideTabBar',
  'hideTabBarRedDot',
  'hideToast',
  'loadFontFace',
  'login',
  'makePhoneCall',
  'navigateBack',
  'navigateBackMiniProgram',
  'navigateTo',
  'navigateToMiniProgram',
  'notifyBLECharacteristicValueChange',
  'openBluetoothAdapter',
  'openCard',
  'openDocument',
  'openLocation',
  'openSetting',
  'pageScrollTo',
  'pauseBackgroundAudio',
  'pauseVoice',
  'playBackgroundAudio',
  'playVoice',
  'previewImage',
  'reLaunch',
  'readBLECharacteristicValue',
  'redirectTo',
  'removeSavedFile',
  'removeStorage',
  'removeTabBarBadge',
  'request',
  'requestPayment',
  'saveFile',
  'saveImageToPhotosAlbum',
  'saveVideoToPhotosAlbum',
  'scanCode',
  'seekBackgroundAudio',
  'sendHCEMessage',
  'sendSocketMessage',
  'setBackgroundColor',
  'setBackgroundTextStyle',
  'setClipboardData',
  'setEnableDebug',
  'setInnerAudioOption',
  'setKeepScreenOn',
  'setNavigationBarColor',
  'setNavigationBarTitle',
  'setScreenBrightness',
  'setStorage',
  'setTabBarBadge',
  'setTabBarItem',
  'setTabBarStyle',
  'setTopBarText',
  'setWifiList',
  'showActionSheet',
  'showLoading',
  'showModal',
  'showNavigationBarLoading',
  'showShareMenu',
  'showTabBar',
  'showTabBarRedDot',
  'showToast',
  'startAccelerometer',
  'startBeaconDiscovery',
  'startBluetoothDevicesDiscovery',
  'startCompass',
  'startDeviceMotionListening',
  'startGyroscope',
  'startHCE',
  'startLocalServiceDiscovery',
  'startPullDownRefresh',
  'startRecord',
  'startSoterAuthentication',
  'startWifi',
  'stopAccelerometer',
  'stopBackgroundAudio',
  'stopBeaconDiscovery',
  'stopBluetoothDevicesDiscovery',
  'stopCompass',
  'stopDeviceMotionListening',
  'stopGyroscope',
  'stopHCE',
  'stopLocalServiceDiscovery',
  'stopPullDownRefresh',
  'stopRecord',
  'stopVoice',
  'stopWifi',
  'switchTab',
  'updateShareMenu',
  'uploadFile',
  'vibrateLong',
  'vibrateShort',
  'writeBLECharacteristicValue',
];

// polyfill for finally
if (!Promise.prototype.finally) {
  Promise.prototype.finally = function (callback) {
    let P = this.constructor;
    return this.then(
      value => P.resolve(callback()).then(() => value),
      reason => P.resolve(callback()).then(() => {
        throw reason
      })
    )
  };
}

// core method
const promisify = (api) => {
  return (args = {}) => {
    return new Promise((resolve, reject) => {
      api({
        fail: reject,
        success: resolve,
        ...args,
      });
    })
  }
};

const promisifyAll = (methods = asyncMethods, wx = {}, extendAll = true) => {
  const promised = {};
  Object.keys(wx).forEach(key => {
    const fn = wx[key];
    if (asyncMethods.indexOf(key) >= 0) {
      promised[key] = typeof fn === 'function' ? promisify(fn) : fn;
    } else if (extendAll) {
      promised[key] = fn;
    }
  });
  return promised;
};

function miniStorageFactory(wx = {}) {
  const clearStorage = promisify(wx.clearStorage);
  const removeStorage = promisify(wx.removeStorage);
  const getStorageInfo = promisify(wx.getStorageInfo);

  return {
    getSync: wx.getStorageSync,
    setSync: wx.setStorageSync,
    get(key, defaultValue, defaultForAbsentOnly = false) {
      const hasDefaultVal = arguments.length > 1;
      return new Promise(((resolve, reject) => {
        wx.getStorage({
          key,
          success({data}) {
            resolve(defaultForAbsentOnly ? data : (data == null ? defaultValue : data));
          },
          fail(err) {
            if (hasDefaultVal) {
              resolve(defaultValue);
            } else {
              reject(err);
            }
          }
        });
      }))
    },
    set(key, data) {
      return new Promise(((resolve, reject) => {
        wx.setStorage({
          key, data,
          success: resolve,
          fail: reject
        });
      }))
    },
    info: (sync) => sync ? wx.getStorageInfoSync() : getStorageInfo(),
    clear: (sync) => sync ? wx.clearStorageSync(key) : clearStorage(),
    remove: (key, sync) => {
      return sync ? wx.removeStorageSync(key) : removeStorage({key})
    }
  }
}

function webStorageFactory(storage = localStorage) {
  return {
    /**
     * 获取缓存
     * @param key
     * @param defaultValue 当缓存的数据为 null|undefined 时，返回 defaultValue
     */
    get(key, defaultValue) {
      const value = JSON.parse(storage.getItem(key));
      return (value == null && arguments.length > 1) ? defaultValue : value
    },
    set(key, data) {
      storage.setItem(key, JSON.stringify(data || null));
    },
    remove(key) {
      storage.removeItem(key);
    }
  }
}

exports.miniStorageFactory = miniStorageFactory;
exports.promisify = promisify;
exports.promisifyAll = promisifyAll;
exports.webStorageFactory = webStorageFactory;
