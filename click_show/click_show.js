/**
 * clickShow ui component
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

    var counter = 1;

    var clickShow = function( config ) {
        this.defaultConfig = {
            /**
             * 触发元素id或jq对象
             */
            trigger: '#tip-target',

            /**
             * 提示内容元素id或jq对象
             * 如element为null，则动态创建提示内容，并配置content使用
             * 否则以element作为提示内容
             */
            element: null,

            /**
             * 配合element使用
             * 如element为null，则动态创建提示内容
             * 否则忽略些配置
             */
            content: '<p>我是提示内容</p>',

            /**
             * 关闭按钮
             * 如dom结构中找不到此按钮，则不显示关闭按钮
             */
            closeBtnClass: '.close-btn',

            /*
             * 是否需要创建iframe
             * 主要为了遮挡select控件及flash
             */
            isNeedIframe: false,

            /**
             * 调整偏移量配置对象
             * left: 水平方向调整
             * top: 垂直方向调整
             */
            excursion: { 
                "left": 0, 
                "top": 0 
            },

            /**
             * 提示内容定位方式
             * lt: 以目标元素的left, top为基准
             * lb: 以目标元素的left, bottom为基准
             */
            positionType: 'lt',

            /**
             * 显示隐藏效果
             * base: 默认配置，直接显示/隐藏tip
             * slide: 滑入滑出tip
             * fade: 淡入淡出tip
             */
            effect: 'base'
        };

        this.counter = counter++;

        this.config = $.extend( true, this.defaultConfig, config || {} );

        this.init.call( this );
    };

    $.extend( clickShow.prototype, {
        init: function() {
            this.canClose = true;

            this._cache();
            this.calculateXY();
            this._initEvent();
        },

        _cache: function() {
            var me = this,
                config = this.config;

            this.trigger = ( $.type( config.trigger === 'string' ) ) ? $( config.trigger ) : config.trigger;
            this.element = ( $.type( config.element === 'string' ) ) ? $( config.element ) : config.element;
            this.closeBtn = this.element.find( config.closeBtnClass );

            this.element.css( {
                display: 'none',
                position: 'absolute'
            } );

            //缓存事件，用于解绑
            this[ 'body' + this.counter ] = $.proxy( this._onBodyClickHandle, this );
            this[ 'window' + this.counter ] = $.proxy( this.calculateXY, this );
        },

        _createIfm: function() {
            var me = this;
            this.ifm = $( document.createElement( 'iframe' ) );
            this.ifm.attr( 'frameborder', 0 );

            this.ifm.css( {
                position: 'absolute',
                width: me.element.outerWidth( false ),
                height: me.element.outerHeight( false )
            } );

            $( document.body ).append( this.ifm );

            this.calculateXY();
        },

        _initEvent: function() {
            var me = this;

            this.trigger.on( 'click', function( event ) {
                me.show();
            } );

            if ( this.closeBtn ) {
                this.closeBtn.on( 'click', function( event ) {
                    event.preventDefault();
                    me.canClose = true;
                    me.hide();
                } );
            }

            this.element.on( 'click', function( event ) {
                event.stopPropagation();
                me.canClose = false;
            } );

            $( this ).on( 'afterShow', function() {
	            $( document.body ).on( 'click', me[ 'body' + me.counter ] );
	            $( window ).on( 'resize', me[ 'window' + me.counter ] );
	            console.log( 'show ' + me.config.trigger );
	            console.log( 'show body' + me.counter );
            } );

            $( this ).on( 'afterClose', function() {
	            $( document.body ).off( 'click', me[ 'body' + me.counter ] );
	            $( window ).off( 'resize', me[ 'window' + me.counter ] );
	            console.log( 'hide' + me.config.trigger );
	            console.log( 'hide body' + me.counter );
            } );
        },

        calculateXY: function() {
            var me = this,
                config = this.config,
                excursion = config.excursion,
                triggerXY = this.trigger.offset(),
                triggerH = this.trigger.height(),
                elementX = triggerXY.left + excursion.left,
                elementY = triggerXY.top + excursion.top,

                ltPos = {
                    "left": elementX,
                    "top": elementY + triggerH
                },

                lbPos = {
                    "left": elementY,
                    "bottom": $( window ).height() - triggerXY.top + excursion.top
                };

            if ( this.positionType === 'lb' ) {
                this.element.css( lbPos );

                if ( this.ifm ) {
                    this.ifm.css( lbPos );
                }
            } else {
                this.element.css( ltPos );

                if ( this.ifm ) {
                    this.ifm.css( ltPos );
                }
            }
        },

        _onBodyClickHandle: function( event ) {
            var target = event.target,
                trigger = this.trigger[ 0 ];

            if ( $.contains( trigger, target ) || target === trigger ) {
                this.canClose = false;
            } else {
                this.canClose = true;
                this.hide();
            }
        },

        show: function() {
            var me = this,
                config = this.config,
                element = this.element;

            switch( config.effect ) {
                case 'slide':
                    element.slideDown();
                    break;
                case 'fade':
                    element.fadeIn();
                    break;
                default:
                    element.show();
                    break;
            }

            if ( !this.ifm && config.isNeedIframe ) {
                this._createIfm();
            }

            $( this ).trigger( 'afterShow' );
        },

        hide: function() {
            var me = this,
                config = this.config,
                element = this.element;

            if ( this.canClose ) {
                switch( config.effect ) {
                    case 'slide':
                        element.slideUp();
                        break;
                    case 'fade':
                        element.fadeOut();
                        break;
                    default:
                        element.hide();
                        break;
                }

                if ( this.ifm ) {
                    this.ifm.remove();
                    this.ifm = null;
                }

				$( this ).trigger( 'afterClose' );
            }
        }
    } );

    if ( typeof exports !== 'undefined' ) {
        exports = clickShow;
    } else {
        root.clickShow = clickShow;
    }

} )( this );

