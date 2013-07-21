# 图片延时加载组件

## 组件说明

先来看看demo

1. [demo1](http://wenku.baidu.com/pay/index)
2. [demo2](http://wenku.baidu.com/vip/index)
3. [demo3](http://wenku.baidu.com/vip/privilege)

图片延时加载组件主要是为了提高页面的性能，加快页面可视区域中图片的加载速度，当页面中存在大量图片时，采用此组件非常适合。其基本原理是，将图片的真实路径不直接写在`src`上，先赋值给一个自定义属性上，如`data-src`，当用户滚动到该图片的可视区域时，通过`data-src`取出图片的真实路径，替换`src`的1X1px的透明小图。

** html结构 **
```html
<img data-src="./images/1.jpg" src="./images/blank.gif" />
```

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

根据以上的实现原理，主要需要计算可视区域内图片，当图片的上边缘的坐标小于scrollTop + viewHeight且图片的下边缘的坐标大于scrollTop时，刚显示该图片。实现代码如下：

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