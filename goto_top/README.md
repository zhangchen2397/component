# 图片延时加载组件

## 组件说明

先来看看demo

1. [demo1，相对于指定容器左侧定位](http://zhangchen2397.github.io/component/goto_top/demo/))
2. [demo2，相对于body右下角定位](http://zhangchen2397.github.io/component/goto_top/demo/demo2.html))

返回顶部组件主要是当页面较长时，方便用户返回页面顶部的一个快捷操作，由于ie6不支持fix定位，所以针对ie6作特别的处理，采用`position:absolute`，同时监听`scroll`事件，动态获取`top`坐标。

有另外一种情况可能还需要处理一下，很多网站的footer区域是通栏的色块，当页面滚动到最底部时，返回顶部的按钮就直接固定在了footer区域上，影响整个页面的UE效果，这样就需要在页面滚动到指定的高度后，重新动态计算返回顶部按钮的`bottom`坐标，保证其随滚动条一起滚动，这种情况的示例如下：

1. [文库首页](http://wenku.baidu.com)
2. [美团网首页](http://www.meituan.com)

该组件的功能虽然比较简单，这种小细节的处理我们还是需要注意，保证最佳的用户体验。

**html结构**：通过组件内部动态创建。

## 实现过程

主要配置项：
```javascript
this.defaultConfig = {
    lazyLoadAttr: 'data-src',      //需要延时加载的图片的自定义属性
    preloadHeight: 0,              //预加载高度
    loadedCallback: null           //加载完成后的回调
};

//自定义事件
var lazyLoadIns = new lazyLoad();

//图片加载完成后的事件监听
lazyLoadIns.on( 'afterLoaded', function( data ) {
    var curImg = data.item
    //code here
} );
```

默认情况下，当图片处于可视区域时，采用的是`jQuery`的.fadeIn( 'slow' )来显示图片，如果配置了loadedCallback，则采用用户自定义配置的方式显示图片。

根据以上的实现原理，主要需要计算可视区域内图片，当图片的上边缘的坐标小于scrollTop + viewHeight且图片的下边缘的坐标大于scrollTop时，刚显示该图片（这里只考虑了垂直方向上的计算，如果有水平方向上的滚动，也需要将水平方向上的坐标计算考虑进去）。实现代码如下：

```javascript
$.each( this.lazyImgs, function( index, item ) {
    var itemPosY = item.offset().top,
        itemPosDepY = itemPosY + item.innerHeight(),
        imgSrc = item.attr( lazyLoadAttr );

    if ( itemPosY < viewOffset && itemPosDepY > scrollOffset && imgSrc ) {
        item.css( 'display', 'none' );

        item.attr( 'src', imgSrc );
        item.removeAttr( lazyLoadAttr );
        me.lazyImgsLen--;

        $( me ).trigger( {
            type: 'afterLoaded',
            img: item
        } );
    }
} );
```

## 使用

```javascript
new lazyLoad( {
    lazyLoadAttr: 'data-src',
    preloadHeight: 200
} );
```

[查看demo](http://zhangchen2397.github.io/component/lazy_load/demo/)