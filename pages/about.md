---
layout: page
permalink: /about.html
title: 关于
tags: [关于, 博客, 游钓四方, blog]
---

{% comment %}
<iframe frameborder="no" border="0" marginwidth="0" marginheight="0" height="52" style="width:280px;margin:0;" src="http://music.163.com/outchain/player?type=2&id=165614&auto=0&height=32"></iframe>
好多年前，在某个网站听到这首曲子的背景音乐，听着有感觉，便将其扒了下来（[fmmusic.mid]({{ site.IMG_PATH }}/fmmusic.mid)，当年的文件，MIDI 格式的），听得多了，就感觉对自己来说有某种特殊的意义，后来才知道它的名字及由来。
{% endcomment %}

* atom 订阅：[https://lhasa.icu/atom.xml][1]

请使用 Mozilla Firefox、Google Chrome 等现代浏览器浏览本博客，以免因为兼容性影响阅读体验。

自 2018 年 8 月 31 日起，本站已运行 <span id="days"></span> 天，截至到今天，共写了博文 {{ site.posts.size }} 篇，计{% assign count = 0 %}{% for post in site.posts %}{% assign single_count = post.content | strip_html | strip_newlines | remove: ' ' | size %}{% assign count = count | plus: single_count %}{% endfor %}{% if count > 10000 %}{{ count | divided_by: 10000 }} 万 {{ count | modulo: 10000 }}{% else %}{{ count }}{% endif %} 字。

本博客所有文章采用的授权方式为 [自由转载-非商用-非衍生-保持署名][1]，转载请务必注明出处，谢谢。

内容系本人学习、研究和总结，如有雷同，实属荣幸！

## 博主

<img class="my-photo" src="https://cos.lhasa.icu/assets/images/my-photo.jpg_640">

千禧年小屁孩，代码、计算机纯属个人爱好，怀旧着，记录着 正在的发生美好往昔

长途骑行小学生、野钓路亚、振出并继、萨克斯、提琴、摇滚、蓝调布鲁斯爱好者

- Email: <haibao1027@gmail.com>
- Github：[achuanya][2]

[<img src="https://ghchart.rshah.org/7db9de/achuanya" alt="achuanya's Github chart" />][3]

## 博客进程

* 2018-08-30 fork 云计算大佬 孔令贤的 Jekyll 模板，开始接触个人博客
* 2018-08-31 由 Github Pages 托管，dynadot 购入域名 achuan.io，起名：阿川的个人博客
* 2024-01-23 腾讯云购入 lhasa.icu，博客改名为：游钓四方的博客
* 2024-01-22 因原代码多端交互历史遗留问题，舍弃原有博客，fork fooleap blog
* 2024-01-31 全站css、js图片等静态资源走腾讯 对象储存 COS
* 2024-01-31 域名备案完成，由腾讯云 内容分发网络 CDN 全球加速


[1]: https://lhasa.icu/atom.xml

[2]: https://creativecommons.org/licenses/by-nc-nd/3.0/deed.zh-hans

[3]: https://github.com/achuanya


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
