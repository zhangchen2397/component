# 返回顶部组件

## 组件说明

先来看看demo

1. [查看demo1：相对于body的右下角定位](http://zhangchen2397.github.io/component/goto_top/demo/demo2.html)

2. [查看demo2：相对于容器的右下角定位](http://zhangchen2397.github.io/component/goto_top/demo/)

返回顶部组件主要用于当页面较长时，方便用户返回页面顶部的一个快捷操作，由于ie6不支持fix定位，所以针对ie6作特别的处理，采用`position:absolute`，同时监听`scroll`事件，动态获取`top`坐标。

有另外一种情况可能还需要处理一下，很多网站的footer区域是通栏的色块，当页面滚动到最底部时，返回顶部的按钮就直接固定在了footer区域上，影响整个页面的UE效果，这样就需要在页面滚动到指定的高度后，重新动态计算返回顶部按钮的`bottom`坐标，保证其随滚动条一起滚动，这种情况的示例如下：

1. [文库首页](http://wenku.baidu.com)
2. [美团网首页](http://www.meituan.com)

该组件的功能虽然比较简单，这种小细节的处理我们还是需要注意，保证最佳的用户体验。

**html结构**：通过组件内部动态创建。

## 实现过程

主要配置项：
```javascript
this.defaultConfig = {
    el: 'goto-top',
    containerWidth: 0,          //容器宽度(如果为0，则相对于body定位)
    showBtnScrollHeight: 100,   //显示按钮的最小scollTop值
    minViewWidth: 1024,         //最小可视宽度，用于改变leftP的坐标
    footerEl: null,             //如定了footerEl，页面滚动到底部时，返回顶部按钮会随页面一起滚动
    excursion: { 
        "bottom": 20,           //相对于body的底偏移量
        "left": 12,             //相对于容器的左偏移量
        "right": 20             //相对于body的右偏移量
    }
};

//自定义事件
var gotoTopIns = new goto_top();

//返回到页面顶部时的事件监听
gotoTopIns.on( 'afterScrollTop', function( data ) {
    //code here
} );
```

**实现思路**：这里主要通过计算


## 使用

```javascript
//相对于容器右下角定位，且指定了footer
new gotoTop( {
    containerWidth: 980,
    footer: 'footer',
    excursion: { 
        "bottom": 20,
        "left": 1
    }
} );

//相对于body右下角定位，且指定了footer
new gotoTop( {
    footer: 'footer',
    excursion: { 
        "bottom": 20,
        "right": 20
    }
} );
```

1. [查看demo1：相对于body的右下角定位](http://zhangchen2397.github.io/component/goto_top/demo/demo2.html)

2. [查看demo2：相对于容器的右下角定位](http://zhangchen2397.github.io/component/goto_top/demo/)