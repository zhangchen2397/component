# 图片轮播组件

## 组件说明

先来看看[查看demo](http://zhangchen2397.github.io/component/slide/demo/)

图片轮播组件在页面中是最常见的一类UI组件了，图片间的切换方式主要包括：基本的显示/隐藏切换，水平切换，垂直切换，渐隐渐现四种切换方式。本UI组件默认已经支持这四种切换方式，通过配置`playType`可实现不同的切换方式。

水平和垂直方向切换时，当从最后一张图片切换到第一张时，都是将其坐标重置，效果上看起来不是始终向同一个方向切换，如果要实现切换时始终都是往同一个方向切换，需要对组件进入一些改动，有兴趣的同学可以尝试一下。

** html结构 **
```html
    <!-- html结构 -->
   <div id="banner">
       <ul class="img-list">
           <li><a href=""><img src="" /></li>
           ......
       </ul>

       <!-- 导航部分html结构可选，如不添加会自动创建 -->
       <ul class="play-nav">
           <li><a href="">1</li>
           ......
       </ul>
  </div>
```

## 实现过程

主要配置项：
```javascript
this.defaultConfig = {
    /*
     * 容器ID或jq对象
     */
    el: 'banner',

    /*
     * 自动播放速度
     */
    playSpeed: 5000,

    /*
     * 播放类型
     * base 无动画播放，类似tab
     * opacity 淡入淡出播放效果
     * vertical 竖起方向滚动播放
     * horizontal 水平方向滚动播放
     */
    playType: 'opacity',

    /*
     * 播放导航class
     * 如页面中没有添加导航的html结构
     * 可配置导航ul元素的class值
     */
    playNavClass: 'play-nav',

    /*
     * 自定义播放效果
     * 如定义了此配置，会自动忽略playType配置
     * 并按照自定义的方法执行播放效果
     */
    customPlayMethod: null
};

//自定义事件
var slideIns = new slide();

//当切换到最后一张图片时触发
slideIns.on( 'onPlayLast', function() {
	//code here
} );

//当切换到最一张图片时触发
slideIns.on( 'onPlayFirst', function() {
	//code here
} );

//图片切换之前触发，并传入当前的切换的图片
slideIns.on( 'onSwitchBefore', function( event ) {
	var curImg = event.curSwitchImg
	//code here
} );

//图片切换之后触发，并传入当前的切换的图片
slideIns.on( 'onSwitchAfter', function() {
	//code here
} );
```
1. **基本切换**：基本切换的实现思路很简单，将其容器的大小设置了一张图片的大小，超出部分隐藏，当要显示当前图片时，将其它图上设置为`display:none`，当前图片设置为`display:block`即可。

2. **水平/垂直切换**：和基本切换一样，将其容器的大小设置了一张图片的大小，然后将要切换的图片水平/垂直方向上平铺，动态计算水平/垂直方向上的宽度/高度，当图片切换时，通过改变图片的水平坐标/垂直坐标来实现。

3. **渐隐渐现**：这里的实现有一点需要注意，很多网站采用这种切换时，会发现切换时会有空白，包括京东等，原因是它们采用的方式，当切换到当前图片时，直接将其它图片的opacity设置为0，将当前图片的opacity通过动画过渡1，这样opacity转化的过程中就会出现空白。我这里实现的方式时，当切换到当前图片时，首先将其opacity设置为1，z-index为1，然后将其它图片opacity动画过渡到0，并且上一张图片的z-index为9，当opacity过渡到0后，将当前图片的z-index设置为9，其它图片的z-index设置为1，实际上渐变的不是当前的图片，而是上一张图片，这样图片在整个切换的过程中就不会出现空白的时候。


## 使用

```javascript
var slideIns = new slide( {
        el: 'banner1',
        playSpeed: 4000
    } ),
    banner = slideIns.config.el,
    preBtn = $( banner.find( '.nav-btn a.pre' ) ),
    nextBtn = $( banner.find( '.nav-btn a.next' ) ),
    viewWidth = $( document ).width();

banner.on( 'mousemove', function( event ) {
    if ( event.pageX > viewWidth / 2 ) {
        preBtn.css( 'display', 'none' );
        nextBtn.css( 'display', 'block' );
    } else {
        preBtn.css( 'display', 'block' );
        nextBtn.css( 'display', 'none' );
    }
} );

banner.on( 'mouseout', function() {
    preBtn.css( 'display', 'none' );
    nextBtn.css( 'display', 'none' );
} );

preBtn.on( 'click', function() {
    slideIns.stopPlay();
    slideIns.pre();
} );

nextBtn.on( 'click', function() {
    slideIns.stopPlay();
    slideIns.next();
} );

$( slideIns ).on( 'onSwitchBefore', function( event ) {
    var curImg = event.curImg,
        lazyLoadAttr = 'data-slide-src',
        imgSrc = curImg.attr( lazyLoadAttr );

    if ( imgSrc ) {
        curImg.attr( 'src', imgSrc );
        curImg.removeAttr( lazyLoadAttr );
    }
} );
```

[查看demo](http://zhangchen2397.github.io/component/slide/demo/)