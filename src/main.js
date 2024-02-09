var iDisqus = require('disqus-php-api');
var wx = require('weixin-js-sdk');
var coordtransform = require('coordtransform');
var raphael = require('webpack-raphael');
var flowchart = require('flowchart.js');
var QRCode = require('davidshimjs-qrcodejs');
import './sass/main.scss';
var _hmt = _hmt || [];

Date.prototype.Format = function (fmt) {
  var o = {
    "M+": this.getMonth() + 1, //月份 
    "d+": this.getDate(), //日 
    "h+": this.getHours(), //小时 
    "m+": this.getMinutes(), //分 
    "s+": this.getSeconds(), //秒 
    "q+": Math.floor((this.getMonth() + 3) / 3), //季度 
    "S": this.getMilliseconds() //毫秒 
  };
  if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
  for (var k in o)
    if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
  return fmt;
}

// TimeAgo https://coderwall.com/p/uub3pw/javascript-timeago-func-e-g-8-hours-ago
function timeAgo(selector) {

  var templates = {
    prefix: "",
    suffix: "前",
    seconds: "几秒",
    minute: "1分钟",
    minutes: "%d分钟",
    hour: "1小时",
    hours: "%d小时",
    day: "1天",
    days: "%d天",
    month: "1个月",
    months: "%d个月",
    year: "1年",
    years: "%d年"
  };

  var template = function (t, n) {
    return templates[t] && templates[t].replace(/%d/i, Math.abs(Math.round(n)));
  };

  var timer = function (time) {
    if (!time) return;
    time = time.replace(/\.\d+/, ""); // remove milliseconds
    time = time.replace(/-/, "/").replace(/-/, "/");
    time = time.replace(/T/, " ").replace(/Z/, " UTC");
    time = time.replace(/([\+\-]\d\d)\:?(\d\d)/, " $1$2"); // -04:00 -> -0400
    time = new Date(time * 1000 || time);

    var now = new Date();
    var seconds = ((now.getTime() - time) * .001) >> 0;
    var minutes = seconds / 60;
    var hours = minutes / 60;
    var days = hours / 24;
    var years = days / 365;

    return templates.prefix + (
      seconds < 45 && template('seconds', seconds) || seconds < 90 && template('minute', 1) || minutes < 45 && template('minutes', minutes) || minutes < 90 && template('hour', 1) || hours < 24 && template('hours', hours) || hours < 42 && template('day', 1) || days < 30 && template('days', days) || days < 45 && template('month', 1) || days < 365 && template('months', days / 30) || years < 1.5 && template('year', 1) || template('years', years)) + templates.suffix;
  };

  var elements = document.getElementsByClassName('timeago');
  for (var i in elements) {
    var $this = elements[i];
    if (typeof $this === 'object') {
      $this.innerHTML = timer($this.getAttribute('datetime'));
    }
  }
  // update time every minute
  setTimeout(timeAgo, 60000);
}


// matches & closest polyfill https://github.com/jonathantneal/closest
(function (ElementProto) {
  if (typeof ElementProto.matches !== 'function') {
    ElementProto.matches = ElementProto.msMatchesSelector || ElementProto.mozMatchesSelector || ElementProto.webkitMatchesSelector || function matches(selector) {
      var element = this;
      var elements = (element.document || element.ownerDocument).querySelectorAll(selector);
      var index = 0;

      while (elements[index] && elements[index] !== element) {
        ++index;
      }

      return Boolean(elements[index]);
    };
  }

  if (typeof ElementProto.closest !== 'function') {
    ElementProto.closest = function closest(selector) {
      var element = this;

      while (element && element.nodeType === 1) {
        if (element.matches(selector)) {
          return element;
        }

        element = element.parentNode;
      }

      return null;
    };
  }
})(window.Element.prototype);

function getQuery(variable) {
  var query = window.location.search.substring(1);
  var vars = query.split("&");
  for (var i = 0; i < vars.length; i++) {
    var pair = vars[i].split("=");
    if (pair[0] == variable) { return pair[1]; }
  }
  return (false);
}


// 微信 SDK
if (browser.wechat && location.origin == site.home) {
  var xhrwesign = new XMLHttpRequest();
  xhrwesign.onreadystatechange = function () {
    if (xhrwesign.readyState == 4 && xhrwesign.status == 200) {
      var signPackage = JSON.parse(xhrwesign.responseText);
      wx.config({
        debug: false,
        appId: signPackage.appId,
        timestamp: signPackage.timestamp,
        nonceStr: signPackage.nonceStr,
        signature: signPackage.signature,
        jsApiList: [
          'chooseImage',
          'previewImage',
          //'setBounceBackground'
        ]
      });
    }
  }
  xhrwesign.open('GET', site.api + '/wechat/jssdk.php?url=' + location.href, true);
  xhrwesign.send();
  wx.ready(function () {
  });
}

window.addEventListener('beforeunload', function (event) {
  document.getElementById('menu').checked = false;
});

document.addEventListener('DOMContentLoaded', function (event) {

  if (browser.mobile) {
    var jdlink = document.querySelector('.jd-ads-link')
    if (jdlink) {
      jdlink.href = jdlink.dataset.mobileUrl
    }
  }

  var disq = new iDisqus('comment', {
    forum: site.forum,
    site: site.home,
    api: site.disqus_api,
    title: page.title,
    url: page.url,
    mode: 2,
    timeout: 3000,
    slug: page.url.slice(1).split('.')[0],
    init: true,
    toggle: 'comment-toggle',
    sort: 'newest',
    emoji_path: site.api + '/emoji/unicode/',
  });

  disq.count();
  timeAgo();

  var curYear = new Date().getFullYear();
  var startYear = Date.parse('01 Jan '+curYear+' 00:00:00');
  var endYear = Date.parse('31 Dec '+curYear+' 23:59:59');
  var yearProgress = (Date.now() - startYear) / (endYear - startYear) * 100;
  var widthProgress = yearProgress.toFixed(2) + '%'
  var styles = document.styleSheets;
  styles[styles.length-1].insertRule('.page-header .page-title:before{width:'+widthProgress+'}',0);
  styles[styles.length-1].insertRule('.page-header .page-title:after{left:'+widthProgress+'}',0);
  styles[styles.length-1].insertRule('.page-header .page-title:after{content:"' + parseInt(yearProgress) + '%"}',0);

  function wxchoose() {
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: function (res) {
        var localIds = res.localIds;
      }
    });
  }

  // 目录
  var toc = document.querySelector('.post-toc');
  var subTitles = document.querySelectorAll('.page-content h2,.page-content h3');
  var clientHeight = document.documentElement.clientHeight;
  function tocShow() {
    var clientWidth = document.documentElement.clientWidth;
    var tocFixed = clientWidth / 2 - 410 - toc.offsetWidth;
    if (tocFixed < 15) {
      toc.style.visibility = 'hidden';
    } else {
      toc.style.visibility = 'visible';
      toc.style.left = tocFixed + 'px';
    }
  }
  function tocScroll() {
    var sectionIds = [];
    var sections = [];
    for (var i = 0; i < subTitles.length; i++) {
      sectionIds.push(subTitles[i].id);
      sections.push(subTitles[i].offsetTop);
    }
    var pos = document.documentElement.scrollTop || document.body.scrollTop;
    var lob = document.body.offsetHeight - subTitles[subTitles.length - 1].offsetTop;
    for (var i = 0; i < sections.length; i++) {
      if (i === subTitles.length - 1 && clientHeight > lob) {
        pos = pos + (clientHeight - lob);
      }
      if (sections[i] <= pos && sections[i] < pos + clientHeight) {
        if (document.querySelector('.active')) {
          document.querySelector('.active').classList.remove('active');
        }
        document.querySelector('[href="#' + sectionIds[i] + '"]').classList.add('active');
      }
    }
  }
  if (!!toc) {
    document.addEventListener('scroll', tocScroll, false);
    window.addEventListener('resize', tocShow, false);
    tocShow();
  }


  // 参考资料、站外链接
  if (document.querySelectorAll('h2')[document.querySelectorAll('h2').length - 1].innerHTML === '参考资料') {
    document.querySelectorAll('h2')[document.querySelectorAll('h2').length - 1].insertAdjacentHTML('afterend', '<ol id="refs"></ol>');
  }
  var links = document.getElementsByTagName('a');
  var noteArr = [];
  for (var i = 0; i < links.length; i++) {
    if (links[i].hostname != location.hostname && /^javascript/.test(links[i].href) === false) {
      var numText = links[i].innerHTML;
      if (/\[[0-9]*\]/.test(numText)) {
        var num = parseInt(numText.slice(1, -1));
        noteArr.push({
          num: num,
          title: links[i].title,
          href: links[i].href
        });
        links[i].classList.add('ref');
        links[i].href = '#note-' + num;
        links[i].id = 'ref-' + num;
      } else {
        links[i].target = '_blank';
      }
    }
  }
  noteArr = noteArr.sort(function (a, b) {
    return +(a.num > b.num) || +(a.num === b.num) - 1;
  })
  for (var i = 0; i < noteArr.length; i++) {
    document.getElementById('refs').insertAdjacentHTML('beforeend', '<li id="note-' + noteArr[i].num + '" class="note"><a href="#ref-' + noteArr[i].num + '">^</a> <a href="' + noteArr[i].href + '" title="' + noteArr[i].title + '" class="exf-text" target="_blank">' + noteArr[i].title + '</a></li>');
  }

  if (page.layout == 'post') {
    var imageArr = document.querySelectorAll('.post-content img[data-src]:not([class="emoji"])')
    var image = {
      src: [],
      thumb: [],
      title: [],
      coord: []
    };
    for (var i = 0; i < imageArr.length; i++) {
      image.thumb[i] = imageArr[i].src;
      image.src[i] = imageArr[i].dataset.src;
      //new RegExp(site.img,'i').test(imageArr[i].src) ? imageArr[i].src.split(/_|\?/)[0] : imageArr[i].src;
    }
    image.jpg = image.src.filter(function (item) {
      return item.indexOf('.jpg') > -1 && new RegExp(site.img, 'i').test(item);
    });
    [].forEach.call(imageArr, function (item, i) {
      image.title[i] = item.title || item.parentElement.textContent.trim() || item.alt;
      item.title = image.title[i];
      item.classList.add('post-image');
      item.parentElement.outerHTML = item.parentElement.outerHTML.replace('<p>', '<figure class="post-figure" data-index=' + i + '>').replace('</p>', '</figure>').replace(item.parentElement.textContent, '');
      var imgdom = document.querySelector('.post-image[data-src="' + image.src[i] + '"]');;
      if (new RegExp(site.img, 'i').test(image.src[i])) {
        imgdom.insertAdjacentHTML('afterend', '<figcaption class="post-figcaption">&#9650; ' + image.title[i] + '</figcaption>');
      }

      imgdom.addEventListener('click', function () {
        if (browser.wechat && browser.mobile) {
          wx.previewImage({
            current: image.src[i],
            urls: image.src
          });
        } else {
          window.open(image.src[i]);
        }
      })
    })

    var getExif = function (index) {
      if (index < image.jpg.length) {
        var item = image.jpg[index];
        var xhrExif = new XMLHttpRequest();
        xhrExif.open('GET', item + '?exif', true);
        xhrExif.onreadystatechange = function () {
          if (this.readyState == 4) {
            if (this.status == 200) {
              var data = JSON.parse(this.responseText);
              var parseVal = function (odata) {
                if (!!odata) {
                  return odata.val;
                } else {
                  return '无';
                }
              }
              if (!!data.DateTimeOriginal) {
                var datetime = data.DateTimeOriginal.val.split(/\:|\s/);
                var date = datetime[0] + '-' + datetime[1] + '-' + datetime[2] + ' ' + datetime[3] + ':' + datetime[4];
                var make = parseVal(data.Make);
                var model = parseVal(data.Model);
                var fnum = parseVal(data.FNumber);
                var extime = parseVal(data.ExposureTime);
                var iso = parseVal(data.ISOSpeedRatings);
                var flength = parseVal(data.FocalLength);
                document.querySelector('.post-image[data-src="' + item + '"]').closest('.post-figure').dataset.exif = '时间: ' + date + ' 器材: ' + (model.indexOf(make) > -1 ? '' : make) + ' ' + model + ' 光圈: ' + fnum + ' 快门: ' + extime + ' 感光度: ' + iso + ' 焦距: ' + flength;
              }
              if (!!data.GPSLongitude) {
                var olat = data.GPSLatitude.val.split(', ');
                var olng = data.GPSLongitude.val.split(', ');
                var lat = 0, lng = 0;
                for (var e = 0; e < olat.length; e++) {
                  lat += olat[e] / Math.pow(60, e);
                  lng += olng[e] / Math.pow(60, e);
                }
                lat = data.GPSLatitudeRef && data.GPSLatitudeRef.val == 'S' ? -lat : lat;
                lng = data.GPSLongitudeRef && data.GPSLongitudeRef.val == 'W' ? -lng : lng;
                image.coord[index] = coordtransform.wgs84togcj02(lng, lat).join(',');
              }
            }
            index++;
            getExif(index);
          }
        }
        xhrExif.send();
      } else {
        var xhrRegeo = new XMLHttpRequest();
        xhrRegeo.open('GET', site.api + '/regeo.php?coords=' + image.coord.filter(function () { return true }).join('|'), true);
        xhrRegeo.onreadystatechange = function () {
          if (this.readyState == 4 && this.status == 200) {
            var data = JSON.parse(this.responseText);
            if (data.info == 'OK') {
              var address, city, dist, town;
              for (var m = 0, n = 0; m < image.jpg.length; m++) {
                address = data.regeocodes[n];
                if (m in image.coord && !!address) {
                  address = address.addressComponent;
                  city = address.city || '';
                  dist = address.district || '';
                  town = address.township || '';
                  document.querySelector('[data-src="' + image.jpg[m] + '"]').title = '摄于' + city + dist + town;
                  n++;
                }
              }
            }
          }
        }
        xhrRegeo.send();
      }
    }

    if (image.jpg.length > 0) {
      getExif(0);
    }

    // 流程图
    var flowArr = document.getElementsByClassName('language-flow');
    [].forEach.call(flowArr, function (item, i) {
      var flowId = 'flow-' + (i + 1);

      var div = document.createElement('div');
      div.classList.add('flow');
      div.id = flowId;

      var pre = item.parentNode;
      pre.insertAdjacentElement('beforebegin', div);
      pre.style.display = 'none';

      var diagram = flowchart.parse(item.innerText);
      diagram.drawSVG(flowId, {
        'yes-text': '是',
        'no-text': '否',
      });
    })

    window.addEventListener('load', function () {
      var linkArr = document.querySelectorAll('.flow a');
      [].forEach.call(linkArr, function (link) {
        if (/^#/i.test(link.href)) {
          link.target = '_self';
        }
      })
    });

    // 相关文章
    var postData;
    var xhrPosts = new XMLHttpRequest();
    xhrPosts.open('GET', '/posts.json', true);
    xhrPosts.onreadystatechange = function () {
      if (xhrPosts.readyState == 4 && xhrPosts.status == 200) {
        postData = JSON.parse(xhrPosts.responseText);
        randomPosts(relatedPosts(page.tags, page.category));
      }
    }
    xhrPosts.send(null);

    function relatedPosts(tags, cat) {
      var posts = [];
      var used = [];
      postData.forEach(function (item, i) {
        if (item.tags.some(function (tag) { return tags.indexOf(tag) > -1; }) && item.url != location.pathname) {
          posts.push(item);
          used.push(i);
        }
      })
      while (posts.length < 5) {
        var index = Math.floor(Math.random() * postData.length);
        var item = postData[index];
        if (used.indexOf(index) == '-1' && item.category == cat && item.url != location.pathname) {
          posts.push(item);
          used.push(index);
        }
      }
      return posts;
    }

    function randomPosts(posts) {
      var used = [];
      var counter = 0;
      var html = '';
      while (counter < 5) {
        var index = Math.floor(Math.random() * posts.length);
        if (used.indexOf(index) == '-1') {
          html += '<li class="post-extend-item"><a class="post-extend-link" href="' + posts[index].url + '" title="' + posts[index].title + '">' + posts[index].title + '</a></li>\n';
          used.push(index);
          counter++;
        }
      }
      document.querySelector('#random-posts').insertAdjacentHTML('beforeend', html);
    }

    // 微信二维码
    var qrcode = new QRCode('qrcode', {
      text: document.getElementById('qrcode').dataset.qrcodeUrl,
      width: 160,
      height: 160,
      colorDark: '#000000',
      colorLight: '#ffffff',
      correctLevel: QRCode.CorrectLevel.L,
      useSVG: false
    });

    var wechatQrcode = document.getElementById('wechat-qrcode');
    if (wechatQrcode) {
      var qrcode = new QRCode('wechat-qrcode', {
        text: document.getElementById('wechat-qrcode').dataset.qrcodeUrl,
        width: 240,
        height: 240,
        colorDark: '#000000',
        colorLight: '#ffffff',
        correctLevel: QRCode.CorrectLevel.L,
        useSVG: false
      });
    }
  }

  if (page.url == '/archive.html') {
    document.querySelector('.page-search-input').addEventListener('keyup', function (e) {
      var archive = document.getElementsByClassName('archive-item-link');
      for (var i = 0; i < archive.length; i++) {
        if (archive[i].title.toLowerCase().indexOf(this.value.toLowerCase()) > -1) {
          archive[i].closest('li').style.display = 'block';
        } else {
          archive[i].closest('li').style.display = 'none';
        }
      }
      if (e.keyCode == 13) {
        location.href = '/search.html?keyword=' + this.value;
      }
    })
  }

  if (page.url == '/search.html') {
    var keyword = getQuery('keyword');
    var searchData;
    var input = document.querySelector('.search-input');
    var result = document.querySelector('.search-result');
    var xhrSearch = new XMLHttpRequest();
    xhrSearch.open('GET', '/search.json', true);
    xhrSearch.onreadystatechange = function () {
      if (xhrSearch.readyState == 4 && xhrSearch.status == 200) {
        searchData = JSON.parse(xhrSearch.responseText);
        if (keyword) {
          input.value = decodeURI(keyword);
          search(decodeURI(keyword));
        }
        input.placeholder = "请输入关键词，Enter搜索";
      }
    }
    xhrSearch.send(null);

    document.querySelector('.search-input').addEventListener('keyup', function (e) {
      if (e.keyCode == 13) {
        search(decodeURI(this.value));
      }
    })

    function search(keyword) {
      result.innerHTML = '';
      var title = '搜索：' + keyword + ' | ' + site.title;
      var url = '/search.html?keyword=' + keyword;
      var total = result.length;
      var html = '';
      searchData.forEach(function (item) {
        var postContent = item.title + item.tags.join('') + item.content;
        if (postContent.toLowerCase().indexOf(keyword.toLowerCase()) > -1) {
          var index = item.content.toLowerCase().indexOf(keyword.toLowerCase());
          var realKeyword = item.content.substr(index, keyword.length);
          var first = index > 75 ? index - 75 : 0;
          var last = first + 150;
          html += '<div class="search-result-item">' +
            '      <i class="search-result-thumb" data-src="' + item.thumb + '" style="background-image:url(' + item.thumb + ')"></i>' +
            '      <div class="search-result-content">' +
            '        <div class="search-result-header">' +
            '           <div class="search-result-title"><a class="search-result-link" target="_blank" href="' + item.url + '">' + item.title + '</a></div>' +
            '           <div class="search-result-comment"></div>' +
            '        </div>' +
            '        <div class="search-result-desc">' + item.content.slice(first, last).replace(new RegExp(realKeyword, 'g'), '<span class="search-result-highlight">' + realKeyword + '</span>') + '</div>' +
            '      </div>' +
            '    </div>';
        }
      })
      result.innerHTML = html;
      document.title = title;
      history.replaceState({
        "title": title,
        "url": url
      }, title, url);
      if (site.home === location.origin && window.parent == window) {
        _hmt.push(['_trackPageview', url]);
      }
    }
  }

  if (page.url == '/tags.html') {
    var keyword = getQuery('keyword');
    var tagsData;
    var xhrPosts = new XMLHttpRequest();
    xhrPosts.open('GET', '/posts.json', true);
    xhrPosts.onreadystatechange = function () {
      if (xhrPosts.readyState == 4 && xhrPosts.status == 200) {
        tagsData = JSON.parse(xhrPosts.responseText);
        if (keyword) {
          tags(decodeURI(keyword));
        }
      }
    }
    xhrPosts.send(null);
    function tags(keyword) {
      var title = '标签：' + keyword + ' | ' + site.title;
      var url = '/tags.html?keyword=' + keyword;
      var tagsTable = document.getElementById('tags-table');
      tagsTable.style.display = 'table';
      tagsTable.querySelector('thead tr').innerHTML = '<th colspan=2>以下是标签含有“' + keyword + '”的所有文章</th>';
      var html = '';
      tagsData.forEach(function (item) {
        if (item.tags.indexOf(keyword) > -1) {
          var date = item.date.slice(0, 10).split('-');
          date = date[0] + ' 年 ' + date[1] + ' 月 ' + date[2] + ' 日';
          html += '<tr><td><time>' + date + '</time></td><td><a href="' + item.url + '" title="' + item.title + '">' + item.title + '</a></td></tr>';
        }
      })
      tagsTable.getElementsByTagName('tbody')[0].innerHTML = html;
      document.title = title;
      history.replaceState({
        "title": title,
        "url": url
      }, title, url);
      if (site.home === location.origin && window.parent == window) {
        _hmt.push(['_trackPageview', url]);
      }
    }
    var tagLinks = document.getElementsByClassName('post-tags-item');
    var tagCount = tagLinks.length;
    for (var i = 0; i < tagCount; i++) {
      tagLinks[i].addEventListener('click', function (e) {
        tags(e.currentTarget.title);
        e.preventDefault();
      }, false);
    }
  }

  var appendZero = function (num) {
    if (!num) {
      return '00'
    }

    if (num < 10) {
      return '0' + num
    }

    return num
  }

  if (page.url == '/tech.html' || page.url == '/life.html' || page.url == '/album.html') {
    var pageNum = !!getQuery('page') ? parseInt(getQuery('page')) : 1;
    var postData, posts = [];
    var xhrPosts = new XMLHttpRequest();
    var category = page.url.slice(1, -5);
    xhrPosts.open('GET', '/posts.json', true);
    xhrPosts.onreadystatechange = function () {
      if (xhrPosts.readyState == 4 && xhrPosts.status == 200) {
        postData = JSON.parse(xhrPosts.responseText);
        postData.forEach(function (item) {
          if (item.category == category) {
            posts.push(item);
          }
        })
        turn(pageNum);
      }
    }
    xhrPosts.send(null);

    function turn(pageNum) {
      var cat = '';
      var postClass = '';
      var pageSize = 10;
      switch (page.url) {
        case '/tech.html':
          cat = '技术';
          postClass = 'post-tech';
          break;
        case '/life.html':
          cat = '生活';
          pageSize = 12;
          postClass = 'post-life';
          break;
        case '/album.html':
          cat = '相册';
          postClass = 'post-album';
          break;
      }
      var title = pageNum == 1 ? cat + ' | ' + site.title : cat + '：第' + pageNum + '页 | ' + site.title;
      var url = pageNum == 1 ? page.url : page.url + '?page=' + pageNum;
      var html = '';
      var total = posts.length;
      var first = (pageNum - 1) * pageSize;
      var last = total > pageNum * pageSize ? pageNum * pageSize : total;
      if (page.url == '/life.html') {
        for (var i = first; i < last; i++) {
          var item = posts[i];
          html += '<article class="post-item">' +
            '    <i class="post-item-thumb" data-src="' + item.image + '" style="background-image:url(' + (item.image.indexOf('svg') > -1 ? item.image : item.image + '?imageView2/1/w/400/h/266') + ')"></i>' +
            '    <section class="post-item-summary">' +
            '    <h3 class="post-item-title"><a class="post-item-link" href="' + item.url + '" title="' + item.title + '">' + item.title + (item.images > 30 && item.category == 'life' ? '[' + item.images + 'P]' : '') + '</a></h3>' +
            '    </section>' +
            '    <section class="post-item-footer"><time class="post-item-date timeago" datetime="' + item.date + '"></time><a class="post-item-cmt" title="查看评论" href="' + item.url + '#comment"><span data-disqus-url="' + item.url + '"></span><span>条评论</span></a></section>' +
            '</article>';
        }
      } else {
        for (var i = first; i < last; i++) {
          var item = posts[i];
          html += '<article class="post-item">' +
            '    <i class="post-item-thumb" data-src="' + item.thumb + '" style="background-image:url(' + item.thumb + ')"></i>' +
            '    <section class="post-item-summary">' +
            '    <h3 class="post-item-title"><a class="post-item-link" href="' + item.url + '" title="' + item.title + '">' + item.title + (item.images > 30 && item.category == 'life' ? '[' + item.images + 'P]' : '') + '</a></h3>' +
            '    <time class="post-item-date timeago" datetime="' + item.date + '"></time>' +
            '    </section>' +
            '    <a class="post-item-comment" title="查看评论" data-disqus-url="' + item.url + '" href="' + item.url + '#comment"></a>' +
            '</article>';
        }
      }

      var totalPage = Math.ceil(total / pageSize);
      var prev = pageNum > 1 ? pageNum - 1 : 0;
      var next = pageNum < totalPage ? pageNum + 1 : 0;
      var prevLink = !!prev ? '<a class="pagination-item-link" href="' + page.url + '?page=' + prev + '" data-page="' + prev + '">较新文章 &raquo;</a>' : '';
      var nextLink = !!next ? '<a class="pagination-item-link" href="' + page.url + '?page=' + next + '" data-page="' + next + '">&laquo; 较旧文章</a>' : '';
      var pagination = '<ul class="pagination-list">' +
        '<li class="pagination-item">' + nextLink + '</li>' +
        '<li class="pagination-item">' + pageNum + ' / ' + totalPage + '</li>' +
        '<li class="pagination-item">' + prevLink + '</li>' +
        '</ul>';

      document.querySelector('.post-list').classList.add(postClass);
      document.querySelector('.post-list').innerHTML = html;
      document.querySelector('.pagination').innerHTML = pagination;
      timeAgo();
      disq.count();
      var link = document.getElementsByClassName('pagination-item-link');
      for (var i = 0; i < link.length; i++) {
        link[i].addEventListener('click', function (e) {
          var pageNum = parseInt(e.currentTarget.dataset.page);
          turn(pageNum);
          e.preventDefault();
        })
      }
      document.title = title;
      history.replaceState({
        "title": title,
        "url": url
      }, title, url);
      if (site.home === location.origin && window.parent == window) {
        _hmt.push(['_trackPageview', url]);
      }
    }
  }

})

// 统计
if (site.home === location.origin && window.parent == window) {
  setTimeout(function () {

    if (site.tongji) {
      var s = document.getElementsByTagName("script")[0];
      var hm = document.createElement('script');
      hm.src = '//hm.baidu.com/hm.js?' + site.tongji;
      s.parentNode.insertBefore(hm, s);
      var bp = document.createElement('script');
      bp.src = 'https://zz.bdstatic.com/linksubmit/push.js';
      s.parentNode.insertBefore(bp, s);
    }

    if (site.analytics) {
      (function (i, s, o, g, r, a, m) {
        i['GoogleAnalyticsObject'] = r;
        i[r] = i[r] || function () {
          (i[r].q = i[r].q || []).push(arguments)
        }, i[r].l = 1 * new Date();
        a = s.createElement(o),
          m = s.getElementsByTagName(o)[0];
        a.async = 1;
        a.src = g;
        m.parentNode.insertBefore(a, m)
      })(window, document, 'script', '//www.google-analytics.com/analytics.js', 'ga');

      ga('create', site.analytics, 'auto');
      ga('send', 'pageview');
    }

    if (site.clarity) {
      (function(c,l,a,r,i,t,y){
          c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
          t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
          y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
      })(window, document, "clarity", "script", site.clarity);
    }
  }, 1000);
}