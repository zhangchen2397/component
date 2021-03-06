基于jQuery常用UI组件
=========

## 目的

记得自己刚开始学习做页面的时候，看到很多网站上的一些好的效果，自己也想试图去实现，由于处于初学阶段，没有找到一个好的学习方法，不知如何下手去写，只能用`javascript`写出几个零散的函数。希望在这里利用业余时间，将工作中用到的一些常用UI组件用`jQuery`重写一遍，给那些和我在学习`javascript`路上有同样经历的同学一些参考，同时也是给自己一个总结思考的机会。

## 内容

这里主要介绍的是常用UI组件的实现过程，在代码中我们会推荐一些好的代码书写风格及优化技巧。代码实现过程中我比较注重实现的思路和想法。组件的封装采用`javascript`原生的`prototype`方式来实现继承，如果想利用`requireJs`或`seaJs`的模块化来开发的话，组件内部也做了支持，如下：
```javascript
    if ( typeof require !== 'undefined' ) {
        $ = require( 'jquery' );
    }

    ...

    if ( typeof exports !== 'undefined' ) {
        exports = popSubMenu;
    } else {
        root.popSubMenu = popSubMenu;
    }
```

## 代码结构

这里所列出的所有组件都采用同一种代码书写结构，所有代码都封装在自执行匿名函数中，并将全局对象`this`传入其中，避免全局污染，最后将需要导出的对象挂载在全局`this`对象中。代码结构如下：

```javascript
    ( function( root ) {
        var $ = root.$;

        //判断是否支持采用模块化
        if ( typeof require !== 'undefined' ) {
            $ = require( 'jquery' );
        }

        //构造函数
        var popSubMenu = function( config ) {
            //默认配置对象
            this.defaultConfig = {
                el: 'category',
                cateMenuClass: 'cate-menu',
                subCateClass: 'sub-cate',
                subViewClass: 'sub-view'
            };

            //将自定义配置覆盖默认配置
            this.config = $.extend( true, this.defaultConfig, config || {} );

            //初始化组件
            this.init.call( this );
        };

        //将方法通过extend方法挂载在prototype对象上
        $.extend( popSubMenu.prototype, {
            init: function() {},

            ...

            _initEvent: function() {}
        } );

        //最后导出该对象，如是采用模块化开发，则将其赋值给exports对象
        if ( typeof exports !== 'undefined' ) {
            exports = popSubMenu;
        } else {
            root.popSubMenu = popSubMenu;
        }
    } )( this );
```

这里不会涉及太多与具体业务逻辑耦合的组件，尽量将公共部分抽取出来，实现通用组件与业务组件的分离，与业务相关的逻辑通过组件间的通信来实现，比如pub/sub模式。UI组件的设计思路不讲究大而全，这样往往会造成过度设计，这样做的好处坏处都有，好处是一个组件包含了很多功能，通过配置完成不同的功能，不好的是造成使用者的学习成本，调用过程也变得比较复杂。从我个人实际的项目中来看，这样做没有太大的必要，将一个个的功能颗粒化为一个个小的组件，这样不仅使用起来方便灵活，而且也单个组件的维护，通过组合的模式也可以实现复杂的交互效果！

## 目录结构

``````
+ lib
  |-- jQuery
  |-- bootstrap
  |-- ...
+ dialog
  |-- + demo
        |-- css
        |-- images
        |-- index.html
  |-- dialog.js
  |-- README.md
+ placeholder
  |-- + demo
        |-- css
        |-- images
        |-- index.html
  |-- placeholder.js
  |-- README.md
......
README.md
```
## 组件列表
1. [二级弹出菜单组件](https://github.com/zhangchen2397/component/tree/master/pop_sub_menu)
2. 多级分类联动选择组件
3. 点击出现浮层提示组件
4. 鼠标经过出现浮层提示组件
5. [图片轮播组件](https://github.com/zhangchen2397/component/tree/master/slide)
6. [图片延时加载组件](https://github.com/zhangchen2397/component/tree/master/lazy_load)
7. 表单验证组件
8. placeholder组件
9. [元素固定组件](https://github.com/zhangchen2397/component/tree/master/el_fix)
10. [返回顶部组件](https://github.com/zhangchen2397/component/tree/master/goto_top)
11. 图片遮罩、高亮组件
12. 拖拽排序组件
13. 对话框组件
14. 旋转木马组件
15. 自动提示组件
16. [图片放大镜组件](https://github.com/zhangchen2397/component/tree/master/magnify)