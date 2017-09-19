var cv = require('opencv')
var Tesseract = require('tesseract.js')
var moment = require('moment')
var request = require('request')

var debugfile = 1
var DEBUG = false

var MORPH_RECT = 0
var MORPH_CROSS = 1
var MORPH_ELLIPSE = 2 

function ImageProcessor(img) {
  this.img = img
  this.debugindex = debugfile++
}

ImageProcessor.prototype.copy = function(deep) {
  var copied = deep ? this.img.clone() : this.img
  return new ImageProcessor(copied)
}

ImageProcessor.prototype.removeAlpha = function() {
  if (this.img.channels() > 3) {
    var channels = this.img.split()
    this.img = new cv.Matrix(this.img.height(), this.img.width(), cv.Constants.CV_32F)
    this.img.merge([channels[0],channels[1],channels[2]])
  }

  return this
}

ImageProcessor.prototype.grayscale = function() {
  var dest = new cv.Matrix(this.img.height(), this.img.width(), cv.Constants.CV_8UC1)
  this.img.convertTo(dest, cv.Constants.CV_8UC1)
  dest.convertGrayscale()
  this.img = dest
  return this
}

ImageProcessor.prototype.blackwhite = function(offset) {
  //this.img.convertGrayscale()
  var max = this.img.minMaxLoc()
  if (!offset) offset = 5

  this.img = this.img.threshold(max.maxVal-offset, 255, 'Binary')
  this.debug('threshold', this.img)
  return this
}

ImageProcessor.prototype.erode = function() {
  var element = cv.imgproc.getStructuringElement(MORPH_RECT, [2, 2] )
  this.img.erode(1, element)
  return this
}

ImageProcessor.prototype.dilate = function() {
  var element = cv.imgproc.getStructuringElement(MORPH_RECT, [2, 2] )
  this.img.dilate(1, element)
  this.debug('dilate', this.img)
  return this
}

ImageProcessor.prototype.opening = function() {
  var element = cv.imgproc.getStructuringElement(MORPH_RECT, [2, 2] )
  this.img.dilate(1, element)
  this.img.erode(1, element)
  this.debug('opening', this.img)
  return this
}

ImageProcessor.prototype.closing = function() {
  var element = cv.imgproc.getStructuringElement(MORPH_RECT, [2, 2] )
  this.img.erode(1, element)
  this.img.dilate(1, element)
  this.debug('closing', this.img)
  return this
}

ImageProcessor.prototype.crop = function(x, y, w, h) {
  this.img = this.img.crop(x*this.img.width(), y*this.img.height(), w*this.img.width(), h*this.img.height())
  return this
}

ImageProcessor.prototype.cropAbs = function(x, y, w, h) {
  this.img = this.img.crop(x, y, w, h)
  return this
}

ImageProcessor.prototype.sharpen = function() {
  var blur = this.img.copy()
  blur.gaussianBlur([31, 31], 3)
  this.debug('blur', blur)
  this.img.addWeighted(this.img, 1.5, blur, -0.5)
  this.debug('sharpen', this.img)
  return this
}

ImageProcessor.prototype.cropLetters = function(size) {
  var rect = max(detect(this.img, size))
  if (rect) {
    this.img = this.img.crop(rect.x, rect.y, rect.width, rect.height)
  }
  this.debug('cropletters', this.img)
  return this
}

ImageProcessor.prototype.canny = function() {
  this.img.canny(5, 300)
  this.debug('canny', this.img)
  return this
}

ImageProcessor.prototype.recognize = function(callback) {
  return new Promise((resolve, reject) => {
    var buffer = this.img.toBuffer()
    Tesseract.recognize(buffer, {
        user_words_file : 'eng',
        user_words_suffix : 'user-words',
      })
      //.progress(p => console.log('progress', p))
      .catch(err => reject(err))
      .then(result => {
        //console.log('result: ', result)
        try {
          var t = result.text.trim().replace(/\n/g, ' ')
          var r = callback ? callback(t) : t
          resolve(r)
        } catch (e) {
          reject(e)
        }
      })
  })
}

var expireMinutes = function(text) {
    var time = /(\d{1,2}):(\d{2}):(\d{2})/.exec(text)
    if (time && time.length == 4) {
      return ((parseInt(time[1]) * 60) + parseInt(time[2]))
    } else {
      throw new Error('could not parse expire time: ' + text)
    }
}

var imageTime = function(text) {
    var time = /(\d{1,2}):(\d{2})(:(\d{2}))?\s*([ap][m])?/i.exec(text)
    if (time) {
      var format = 'YYYY-MM-DD ' + 
                   (time[5] ? 'hh' : 'HH') +
                   ':mm' +
                   (time[4] ? ':ss' : '') +
                   (time[5] ? ' a' : '')
      var datetime = moment().format('YYYY-MM-DD') + ' ' + time[0]
      return moment(datetime, format)
    } else {
      throw new Error('could not parse image time: ' + text)
    }
}

var detect = function(im, size) {
    var boundRect = []
    im = im.copy()
    if (!size) {
       size = [50, 20]
    }

    var element = cv.imgproc.getStructuringElement(MORPH_RECT, size)
    im.dilate(1, element)
    im.erode(1, element)
    if (DEBUG) im.save('tmp/morph_close.png')
    var contours = im.findContours()

    for(var i = 0; i < contours.size(); ++i) {
      if (contours.cornerCount(i)>20) { 
        contours.approxPolyDP(i, 3, true)
        var rect = contours.boundingRect(i)
        if (rect.width>rect.height) {
          boundRect.push(rect)
        }
      }
    }
    return boundRect
}

var max = function(rects) {
  var rect = null
  var area = 0
  for (i = 0; i < rects.length; ++i) {
     var a = rects[i].width * rects[i].height
     if (a > area) {
       area = a
       rect = rects[i]
     }
  }
  return rect
}

var recognizeRect = function(image, rect) {
  return image.copy().cropAbs(rect.x, 0, rect.width, image.img.height()).debug('notif').recognize(imageTime)
}

var recognizeRects = function(image, rects, index) {
  if (!rects || index >= rects.length) return

  return recognizeRect(image, rects[index])
    .catch(err => {
      return recognizeRects(image, rects, index + 1)
    })
}

var readFile = function(filename) {
  cv.readImage(filename, function(err, im) {
    if (err) throw err
    readImage(im)
  })
}

var readImage = function(im) {

  var width = im.width()
  var height = im.height()
  if (width < 1 || height < 1) throw new Error('Image has no size')

  var image = new ImageProcessor(im).removeAlpha()
  var notif = image.copy().crop(0, 0, 1, .036).grayscale()
  notif.debug('notif', notif.img)
  var notifTimes = detect(notif.copy(true).canny().img, [10, 2])

  return [
    image.copy().crop(.20, .052, .792, .065).sharpen().grayscale().blackwhite(40).cropLetters().recognize(), // gym
    image.copy().crop(0, .234, 1, .091).grayscale().blackwhite().cropLetters().recognize(), // name
    image.copy().crop(.741, .579, .185, .055).sharpen().grayscale().blackwhite(10).cropLetters([20, 5]).recognize(expireMinutes).catch(err => null), // expire time
    recognizeRects(notif, notifTimes, 0) // image time
  ]
}

ImageProcessor.prototype.debug = function(prefix, img) {
  if (!img) {
    img = this.img
  }
  if (DEBUG) {
    img.save('/tmp/' + prefix + this.debugindex + '.png')
  }
  return this
}

var readUrl = function(url) {
  return new Promise((resolve, reject) => {
    var stream = new cv.ImageDataStream()
    stream.on('load', (im) => {
      Promise.all(readImage(im))
        .then(results => {
          resolve({
            gym : results[0],
            pokemon : results[1],
            minutesLeft : results[2],
            imageTime : results[3]
          })
        })
        .catch(err => reject(err))
      
    })
    request(url).pipe(stream)
  })
}

module.exports = {readUrl}
