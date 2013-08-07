# 元素滚动固定组件

## 组件说明

先来看看demo：[查看demo](http://zhangchen2397.github.io/component/el_fix/demo/)

返回顶部组件在页面中使用场景十分常见，当滚动页面时，将需要固定的元素固定在页面中，用得比较多的是左侧的导航菜单及常用菜单的固定滚动时的固定，实现原理和返回顶部组件差不多，不支持`fix`定位的ie6浏览器采用`position:absolute`来定位，并动态计算`top`和`left`的坐标，实际实例如下：

1. [淘宝搜索结果页](http://s.taobao.com/search?initiative_id=staobaoz_20130722&jc=1&q=iphone5&stats_click=search_radio_all%3A1)
2. [美团商品详情页](http://www.meituan.com/deal/5577022.html)

## 实现过程

主要配置项：
```javascript
this.defaultConfig = {
    el: 'fix-con',
    excursion: { 
        "left": 0,       //调整左偏移量
        "top": 0         //调整上偏移量
    }
};

//自定义事件
var elFixIns = new elFix();

//开始固定时的事件监听
elFix.on( 'onStartFix', function( data ) {
    //code here
} );

//取消固定时的事件监听
elFix.on( 'onAfterFix', function( data ) {
    //code here
} );
```

**实现思路**：滚动页面时，当`scrollTop`大于要固定元素的`top`坐标时，则开始固定元素，否则取消固定。示例代码如下：

```javascript
if ( scrollTop > basePos.top ) {
    if ( typeof document.body.style.maxHeight === 'undefined' ) {
        el.css( {
            position: 'absolute',
            top: scrollTop + excursion.top,
            left: basePos.left + excursion.left
        } );
    } else {
        el.css( {
            position: 'fixed',
            top: excursion.top,
            left: basePos.left + excursion.left
        } );
    }

    $( this ).trigger( 'onStartFix' );
} else {
    el[ 0 ].style.cssText = '';
    $( this ).trigger( 'onAfterFix' );
}
```

## 使用

```javascript
new elFix();
```

[查看demo](http://zhangchen2397.github.io/component/el_fix/demo/)
