# 图片放大镜组件

## 组件说明

先来看看[demo](http://zhangchen2397.github.io/component/magnify/demo/)


图片放大镜组件组件的应用场景非常多，尤其在电子商务网站中，该效果用于查看商品详细细节非常适应，在项目中正好也有这样一个需求，于是也尝试写了一个，实现的原理也很简单。

实现的思路大致有两种可做参考：

1. 大图的实现利用`background`来实现，通过css改变`background-position`来实现大图的定位

2. 大图的实现利用`img`标签来实现，通过绝对定位`position`来动态改变`left`和`top`坐标来定位

这里的demo是根据每二种思路来实现的，当然demo没有做图片的加载优化，比如，当需要放大时才去请求大图的图片。

html结构：
```html
<div id="magnify">
    <div class="small-pic">
        <div class="mask"></div>
        <div class="pointer"></div>
        <img src="./images/gyy_small.jpg" />
    </div>

    <div class="zoom-wrap">
        <img src="./images/gyy_big.jpg" />
    </div>
</div>
```

html结构中有一点需要注意的是，我们在小图上加了两个div层，mask用来显示遮罩的，并设置`zIndex`及`opacity`，`zIndex`的目的是让其浮于小图之前，用于触发mouse的各种事件，`opacity`设置为0的目的是让其完全透明，指示放大的pointer位于中间层，当在mask上触发`mousemove`事件时，可以正常看到pointer层跟随鼠标一起移动。

## 实现过程

主要配置项：
```javascript
this.defaultConfig = {
    el: 'magnify',              //容器id或容器html元素
    maskClass: '.mask',         //遮罩层class值
    pointerClass: '.pointer',   //放大指示层class值
    zoomWrapClass: '.zoom-wrap' //大图外层容器class值
};
```
首先我们需要计算放大指示层`pointer`的坐标值，当`mousemove`时，`pointer`层跟随鼠标一起移动。用当前鼠标的位置坐标减去遮罩层的坐标，为了让鼠标在移动时始终位于放大指示层的中间公位置，还需要减去放大指示层长宽的一半。计算如下：

```javascript
posL = event.pageX - maskPos.left - pointerWidth / 2,
posT = event.pageY - maskPos.top - pointerHeight / 2;
```

最重要的一步就是放大当前的局部位置，算法也很简单，指示放大区域的坐标位置相对于小图的比例等于大图可见区域相对于大图的比例，具体代码如下:

```javascript
percentX = pointerPos.left / ( mask.width() - pointer.width() ),
percentY = pointerPos.top / ( mask.height() - pointer.height() );

bigImg.css( {
    left: -percentX * ( bigImg.width() - zoomWrap.width() ),
    top: -percentY * ( bigImg.height() - zoomWrap.height() )
} );
```

## 使用

```javascript
new magnify();
```

[查看demo](http://zhangchen2397.github.io/component/magnify/demo/)