/**
 * slide ui component
 * by: zhangchen
 * weibo: @zhangchen2397
 * blog: blog.huitaoba.com
 * mail: zhangchen2397@gmail.com
 */

( function( root ) {
    var $ = root.$;

    if ( typeof require !== 'undefined' ) {
        $ = require( 'jquery' );
    }

    /**
     * 图片轮播组件
     * 目前支持四种播放效果
     * 支持自定义播放效果
     * --------------------------
     * base 无动画播放，类似tab
     * opacity 淡入淡出播放效果
     * vertical 竖起方向滚动播放
     * horizontal 水平方向滚动播放
     * ---------------------------
     *
     * html结构
     *   <div id="banner">
     *       <ul class="img-list">
     *           <li><a href=""><img src="" /></li>
     *           ......
     *       </ul>
     *
     *       //导航部分html结构可选，如不添加会自动创建
     *       <ul class="play-nav">
     *           <li><a href="">1</li>
     *           ......
     *       </ul>
     *  </div>
     *
     */

    var slide = function( config ) {
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

        this.config = $.extend( true, this.defaultConfig, config || {} );

        this.init.call( this );
    };

    $.extend( slide.prototype, {
        init: function() {
            this._cache();
            this._dynCalSize();
            this._autoPlay();
            this._initEvent();
        },

        _initEvent: function() {
            var me = this;

            $( this.imgUl ).on( 'mouseover', $.proxy( this.stopPlay, this ) );
            $( this.imgUl ).on( 'mouseout', $.proxy( this._autoPlay, this ) );

            this.navUl.delegate( 'li', 'mouseover', function() {
                var item = $( this ),
                    index = item.attr( 'data-idx' ) || me._getItemIdx( item );

                if ( me.nowPage != index ) {
                    me.stopPlay();
                    me.nowPage = index;
                    me._play();
                }
                
            } );
        },

        stopPlay: function() {
            if ( this.autoPlayTimer ) {
                clearInterval( this.autoPlayTimer );
                this.autoPlayTimer = null;
            }
        },

        _autoPlay: function() {
            var me = this,
                config = this.config;

            me.stopPlay();
            this.autoPlayTimer = setInterval( function() {
                me.next();
            }, config.playSpeed );
        },

        _cache: function() {
            var me = this,
                config = this.config,
                tempUl = null;

            config.el = ( $.type( config.el ) === 'string' ) ? $( '#' + config.el ) : config.el;

            tempUl = config.el.children( 'ul' );

            this.imgUl = tempUl[ 0 ];
            this.imgList = $( this.imgUl ).children( 'li' );
            this.totalPage = this.imgList.length;
            this.nowPage = 1;
            this.autoPlayTimer = null;

            //如果页面中没有播放导航，则自动创建
            if ( !config.el.find( '.' + config.playNavClass )[ 0 ] ) {
                this._createNavUl();
            }
        },

        _dynCalSize: function() {
            var me = this,
                config = this.config,
                playType = config.playType,
                imgUl = $( this.imgUl ),
                liItem = $( this.imgList[ 0 ] );

            if ( playType === 'horizontal' ) {
                this.liWidth = liItem.width();
                imgUl.css( 'width', this.liWidth * this.totalPage );
            }

            if ( playType === 'vertical' ) {
                this.liHeight = liItem.height();
                imgUl.css( 'height', this.liHeight * this.totalPage );
            }
        },

        _createNavUl: function() {
            var me = this,
                config = this.config,
                tempLiStr = '';

            for ( var i = 0; i < this.totalPage; i++ ) {
                var idx = i + 1;
                tempLiStr += 
                    '<li data-idx="' + idx + '">' +
                        '<a href="javascript:void(0);">' + idx + '</a>' +
                    '</li>';
            }

            tempLiStr = '<ul class="' + config.playNavClass + '">' + tempLiStr + '</ul>';

            this.navUl = $( tempLiStr );
            this.navList = this.navUl.children( 'li' );
            config.el.append( this.navUl );
            $( this.navList[ 0 ] ).addClass( 'cur' );
        },

        next: function() {
            var me = this,
                config = this.config;

            this.nowPage++;

            if ( this.nowPage > this.totalPage ) {
                this.nowPage = 1;
                $( this ).trigger( 'onPlayLast' );
            }

            this._play();
        },

        pre: function() {
            var me = this,
                config = this.config;

            this.nowPage--;

            if ( this.nowPage < 1 ) {
                this.nowPage = this.totalPage;
                $( this ).trigger( 'onPlayFirst' );
            }

            this._play();
        },

        _play: function() {
            var me = this,
                config = this.config,
                curSwitchImg = $( this.imgList[ this.nowPage - 1 ] ).find( 'img' );

            $( this ).trigger( {
                type: 'onSwitchBefore',
                curImg: curSwitchImg
            } );

            if ( $.isFunction( config.customPlayMethod ) ) {
                config.customPlayMethod.call( me );
            } else {
                switch( config.playType ) {
                    case 'base':
                        me._basePlay();
                        break;
                    case 'opacity':
                        me._opacityPlay();
                        break;
                    case 'vertical':
                        me._verticalPlay();
                        break;
                    case 'horizontal':
                        me._horizontalPlay();
                        break;
                    default:
                        me._basePlay();
                        break;
                }
            }

            me._focusNav();

            $( this ).trigger( {
                type: 'onSwitchAfter',
                curImg: curSwitchImg
            } );
        },

        _basePlay: function() {
            var me = this,
                config = this.config,
                imgList = this.imgList;

            imgList.each( function( index ) {
                $( this ).hide();
            } );

            $( imgList[ this.nowPage - 1 ] ).show();
        },

        _opacityPlay: function() {
            var me = this,
                config = this.config,
                imgList = this.imgList,
                curPlayImg = $( imgList[ me.nowPage - 1 ] );

            curPlayImg.css( 'opacity', 1 );

            imgList.each( function( index ) {
                var item = $( this );
                item.stop();

                if ( index !== me.nowPage - 1 ) {
                    item.animate( {
                        opacity: 0
                    }, 'normal', 'swing', function() {
                        curPlayImg.css( 'zIndex', 9 );
                        item.css( 'zIndex', 1 );
                    } );
                }
            } );
        },

        _horizontalPlay: function() {
            var me = this,
                config = this.config,
                nowPage = this.nowPage,
                imgUl = $( this.imgUl ),
                offsetWidth = -( this.liWidth * ( nowPage - 1 ) );

            imgUl.stop();
            imgUl.animate( {
                left: offsetWidth
            } );
        },

        _verticalPlay: function() {
            var me = this,
                config = this.config,
                nowPage = this.nowPage,
                imgUl = $( this.imgUl ),
                offsetHeight= -( this.liHeight * ( nowPage - 1 ) );

            imgUl.stop();
            imgUl.animate( {
                top: offsetHeight
            } );
        },

        _focusNav: function() {
            var me = this,
                config = this.config,
                navList = this.navList;

            navList.each( function( index ) {
                $( this ).removeClass( 'cur' );
            } );

            $( navList[ this.nowPage - 1 ] ).addClass( 'cur' );
        },

        _getItemIdx: function( curItem ) {
            var me = this,
                itemIdx = 1;

            imgList.each( function( index ) {
                var item = $( this );
                if ( item === curItem ) {
                    itemIdx = ( index + 1 );
                }
            } );

            return itemIdx;
        }
    } );

    if ( typeof exports !== 'undefined' ) {
        exports = slide;
    } else {
        root.slide = slide;
    }

} )( this );

