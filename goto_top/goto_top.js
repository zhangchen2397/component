/**
 * gotoTop ui component
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

    //返回顶部元素模板
    var tpl = [
        '<div class="goto-top" id="goto-top">',
            '<a href="javascript:void(0);">返回顶部</a>',
        '</div>'
    ].join( '' );

    var gotoTop = function( config ) {
        this.defaultConfig = {
            el: 'goto-top',
            containerWidth: 0,          //容器宽度(如果为0，则相对于body定位)
            showBtnScrollHeight: 100,   //显示按钮的最小scollTop值
            minViewWidth: 1024,         //最小可视宽度
            excursion: { 
                "bottom": 20,           //相对于body的底偏移量
                "left": 12,             //相对于容器的左偏移量
                "right": 20             //相对于body的右偏移量
            }
        };

        this.config = $.extend( true, this.defaultConfig, config || {} );

        this.init.call( this );
    };

    $.extend( gotoTop.prototype, {
        init: function() {
            this._createBtnEl();
            this._setBtnLeft();
            this._initEvent();
        },

        _createBtnEl: function() {
            var me = this,
                config = this.config;

            $( document.body ).append( $( tpl ) );

            this.button = $( '#' + config.el );
        },
        
        _initEvent: function(){
            var me = this,
                config = this.config;

            $( window ).on( 'resize', function() {
                me._setBtnLeft();
                me._setBtnTop();
            } );

            $( window ).on( 'scroll', function() {
                me._setShowOrNot();
                me._setBtnTop();
            } );

            this.button.on( 'click', function() {
                window.scrollTo( 0, 0 );

                $( me ).trigger( 'afterScrollTop' );
            } );
        },

        _setShowOrNot: function() {
            var me = this,
                config = this.config,
                button = this.button,
                scrollTop = $( window ).scrollTop();

            if ( scrollTop > 100 ) {
                button.css( 'display', 'block' );
            } else {
                button.css( 'display', 'none' );
            }
        },

        _setBtnLeft: function() {
            var me = this,
                config = this.config,
                containerWidth = config.containerWidth,
                excursion = config.excursion,
                viewportWidth = $( window ).width(),
                leftP = 0;

            if ( containerWidth ) {
                leftP = ( viewportWidth - containerWidth ) / 2 + containerWidth + excursion.left;

                //当显示区域的宽度小于配置的最小宽度时，left坐标有变化
                if ( viewportWidth < config.minViewWidth ) {
                    leftP = viewportWidth - 70;
                }

                this.button.css( 'left', leftP );
            } else {
                this.button.css( 'right', excursion.right );
            }
        },

        _setBtnTop: function() {
            var me = this,
                config = this.config,
                button = this.button,
                excursion = config.excursion,
                viewportHeight = $( window ).height();

            //如果是ie6
            if ( typeof document.body.style.maxHeight === 'undefined' )  {
                button.css( {
                    'position': 'absolute',
                    'top': viewportHeight + $( window ).scrollTop() - excursion.bottom
                } );
            } else {
                button.css( {
                    'position': 'fixed',
                    'bottom': excursion.bottom
                } );
            }
        }
    } );

    if ( typeof exports !== 'undefined' ) {
        exports = gotoTop;
    } else {
        root.gotoTop = gotoTop;
    }

} )( this );

