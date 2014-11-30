/*!
 * Img preload v0.1
 * https://github.com/zzarcon/img-preload
 *
 * Copyright (c) 2014 @zzarcon <hezarco@gmail.com>
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 *
 * Date: 2014-11-27
 */

(function(exports) {
  var config = {
    path: ''
  };

  Promise.prototype.progress = function(handler) {
    this.progressHandler = handler;
    return this;
  };

  function ImgPreload(images, options) {
    if (!images) {
      return new Error('ImgPreload requires a image or a array of images');
    }

    images = typeof images === 'string' ? [images] : images;

    var promises = images.map(function(img) {
      return preloadImage(img);
    });

    return all(promises);
  }

  ImgPreload.config = function(userConfig) {
    config = userConfig;
  };

  function preloadImage(url) {
    return new Promise(function(resolve, reject) {
      var img = new Image();
      img.src = config.path + url;

      img.onerror = reject;
      img.onload = function() {
        resolve(img);
      };
    });
  }

  function all(promises) {
    var promisesToResolve = promises.length;
    var resolvedPromises = 0;

    return new Promise(function(resolve, reject) {
      var images = [];

      function onFulfillement(img) {
        images.push(img);
        resolvedPromises++;
        resolvedPromises === promisesToResolve && resolve(images);
      }

      function onCatch() {
        reject();
      }

      promises.forEach(function(promise) {
        promise.then(onFulfillement).catch(onCatch);
      });
    });
  }

  exports.ImgPreload = ImgPreload;
})(window);