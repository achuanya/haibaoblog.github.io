---
layout: page
permalink: /about.html
title: 关于
tags: [关于, 博客, fooleap, blog]
---

{% comment %}
<iframe frameborder="no" border="0" marginwidth="0" marginheight="0" height="52" style="width:280px;margin:0;" src="http://music.163.com/outchain/player?type=2&id=165614&auto=0&height=32"></iframe>
好多年前，在某个网站听到这首曲子的背景音乐，听着有感觉，便将其扒了下来（[fmmusic.mid]({{ site.IMG_PATH }}/fmmusic.mid)，当年的文件，MIDI 格式的），听得多了，就感觉对自己来说有某种特殊的意义，后来才知道它的名字及由来。
{% endcomment %}


请使用 Mozilla Firefox、Google Chrome 等现代浏览器浏览本博客，以免因为兼容性影响阅读体验。


自 2018 年 8 月 31 日起，本站已运行 <span id="days"></span> 天，截至 {{ site.time | date: "%Y 年 %m 月 %d 日" }}，写了博文 {{ site.posts.size }} 篇，{% assign count = 0 %}{% for post in site.posts %}{% assign single_count = post.content | strip_html | strip_newlines | remove: ' ' | size %}{% assign count = count | plus: single_count %}{% endfor %}{% if count > 10000 %}{{ count | divided_by: 10000 }} 万 {{ count | modulo: 10000 }}{% else %}{{ count }}{% endif %} 字。


本博客所有文章采用的授权方式为 [自由转载-非商用-非衍生-保持署名][1]，转载请务必注明出处，谢谢。

内容系本人学习、研究和总结，如有雷同，实属荣幸！

## 博主

千禧年小屁孩，代码、计算机纯属个人爱好，怀旧着，记录着 正在的发生美好往昔

长途骑行小学生、野钓路亚、振出并继、萨克斯、提琴、摇滚、蓝调布鲁斯爱好者


* Email: haibao1027@gmail.com


## 博客进程

* 2018-08-31 Jekyll + Github Pages托管建立，域名 achuan.io，名字为 "阿川的个人博客"
* 2024-01-23 域名更改为 lhasa.icu，改名为 "游钓四方的博客"
* 2024-01-24 国内域名解析 腾讯云 DNSPod，全站资源腾讯 COS
* 2024-01-25 使用 Disqus API 反向代理解决评论问题
* 2024-01-25 使用 WebPack 打包前端资源



[1]: https://creativecommons.org/licenses/by-nc-nd/3.0/deed.zh-hans


<script>
var days = 0, daysMax = Math.floor((Date.now() / 1000 - {{ "2011-02-09" | date: "%s" }}) / (60 * 60 * 24));
(function daysCount(){
    if(days > daysMax){
        document.getElementById('days').innerHTML = daysMax;
        return;
    } else {
        document.getElementById('days').innerHTML = days;
        days += 10;
        setTimeout(daysCount, 1); 
    }
})();
</script>
