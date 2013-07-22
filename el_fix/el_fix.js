/**
 * elFix ui component
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

    var elFix = function( config ) {
        this.defaultConfig = {
            el: 'fix-con',
            excursion: { 
                "left": 0,       //调整左偏移量
                "top": 0         //调整上偏移量
            }
        };

        this.config = $.extend( true, this.defaultConfig, config || {} );

        this.init.call( this );
    };

    $.extend( elFix.prototype, {
        init: function() {
            var config = this.config;

            this.el = ( $.type( config.el ) === 'string' ) ? $( '#' + config.el ) : config.el;
            this.basePos = this.el.offset();

            this._fixPosition();
            this._initEvent();
        },

        _initEvent: function() {
            var me = this;

            $( window ).on( 'scroll', $.proxy( me._fixPosition, me ) );
            $( window ).on( 'resize', $.proxy( me._fixPosition, me ) );
        },

        _fixPosition: function() {
            var me = this,
                config = this.config,
                el = this.el,
                basePos = this.basePos,
                excursion = config.excursion,
                scrollTop = $( window ).scrollTop();

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
        }
    } );

    if ( typeof exports !== 'undefined' ) {
        exports = elFix;
    } else {
        root.elFix = elFix;
    }

} )( this );

