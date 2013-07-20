# 二级弹出菜单组件

## 组件说明

先来看看[demo](http://zhangchen2397.github.io/component/pop_sub_menu/demo/)

该组件几乎成了电商网站的标配了，天猫、京东、当当、1号店等网站的二级分类展示方式都采用了这种方式，如下截图：

![天猫](http://github.com/zhangchen2397/component/raw/master/pop_sub_menu/demo/images/tmall1.jpg)


初一看这些网站的实现效果没有多大的差异，再看下面截图，看看其中的差异：

![1号店](http://github.com/zhangchen2397/component/raw/master/pop_sub_menu/demo/images/1hd.jpg)

看出其中的差异了吗？发现1号店网站二级菜单并没有完成展示在页面的可视区域内，而京东的展示是完整的，经过对比，我们发现1号店、亚马逊、当当这些网站在某些情况下二级菜单并没有完成展示在页面的可视区域中，而天猫，京东等二级菜单都会完整的展示在页面的可视区域中。所以这些就涉及到一个二级菜单定位的问题，如果这处理这个细节，就会出现展示不完整的现象，对于所求极致用户体验来说，当然就做得不好了。

## 实现过程
主要配置项：

```javascript
	this.defaultConfig = {
	    el: 'category',               //容器元素id
	    cateMenuClass: 'cate-menu',   //一级分类class名
	    subCateClass: 'sub-cate',     //二级分类容器class名
	    subViewClass: 'sub-view',     //二级分类class名

	    delayShow: 80,                //显示延时时间
	    delayHide: 0,                 //隐藏延时时间

	    excursionTop: -3,            //二级分类相对一级分类的偏移量
	    subViewWidth: 327            //二级分类容器的宽度
	};

	//自定义事件
	var popSubMenuIns = new popSubMenu();
	
	$( popSubMenuIns ).on( 'afterShow', function() {
		//code here
	} );

	$( popSubMenuIns ).on( 'afterHide', function() {
		//code here
	} );
```

子分类定位原理：子分类的坐标相对于el容器来定位，默认情况下子分类的top坐标值为当前父类的坐标值
```javascript
	cateTop //当前子分类父类的坐标值
	me.baseTop //el元素的坐标值

	subCateTop = cateTop - me.baseTop
```

当子分类的高度+子分类父类的坐标值>可视区域高度+srollHeight时，为了保证此时子分类的坐标就要坐相应调整，调整后的坐标如下：

```javascript
	excursionTop = ( cateTop + subViewItemHeight ) - ( viewHeight + scrollTop - 10 );
	me.subCate.css( 'top', subCateTop - excursionTop );
```

## 使用

```javascript
	new popSubMenu( {
		delayShow: 120
	} );
```

[查看demo](http://zhangchen2397.github.io/component/pop_sub_menu/demo/)