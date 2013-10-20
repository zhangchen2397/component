/**
 * magnify ui component
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

    var magnify = function( config ) {
        this.defaultConfig = {
            el: 'magnify',
            maskClass: '.mask',
            pointerClass: '.pointer',
            zoomWrapClass: '.zoom-wrap'
        };

        this.config = $.extend( true, this.defaultConfig, config || {} );

        this.init.call( this );
    };

    $.extend( magnify.prototype, {
        init: function() {
            this._cache();
            this._initEvent();
        },

        _initEvent: function() {
            var me = this,
                config = this.config,
                mask = this.mask;

            mask.on( 'mouseenter', $.proxy( this._enterHandle, this ) );
            mask.on( 'mouseleave', $.proxy( this._leaveHandle, this ) );
            mask.on( 'mousemove', $.proxy( this._moveHandle, this ) );
        },

        _cache: function() {
            var me = this,
                config = this.config;

            this.el = ( $.type( config.el ) === 'string' ) ? $( '#' + config.el ) : config.el;
            this.mask = this.el.find( config.maskClass );
            this.pointer = this.el.find( config.pointerClass );
            this.zoomWrap = this.el.find( config.zoomWrapClass );
            this.bigImg = this.el.find( config.zoomWrapClass + ' img' );
        },

        _enterHandle: function( event ) {
            var me = this,
                config = this.config;

            this.zoomWrap.show();
            this.pointer.show();
        },

        _leaveHandle: function( event ) {
            var me = this,
                config = this.config;

            this.zoomWrap.hide();
            this.pointer.hide();
        },

        _moveHandle: function( event ) {
            var me = this,
                config = this.config,
                pointerPos = {};

            pointerPos = me._calPointerPos( event );
            me._calBigPos( pointerPos );
        },

        _calPointerPos: function( event ) {
            var me = this,
                mask = this.mask,
                pointer = this.pointer,
                maskPos = mask.offset(),

                maskWidth = mask.width(),
                maskHeight = mask.height(),
                pointerWidth = pointer.width(),
                pointerHeight = pointer.height(),

                posL = event.pageX - maskPos.left - pointerWidth / 2,
                posT = event.pageY - maskPos.top - pointerHeight / 2;

            if ( posL < 0 ) {
                posL = 0;
            } else if ( posL > maskWidth - pointerWidth ) {
                posL = maskWidth - pointerWidth
            }

            if ( posT < 0 ) {
                posT = 0;
            } else if ( posT > maskHeight - pointerHeight ) {
                posT = maskHeight - pointerHeight
            }

            pointer.css( {
                left: posL,
                top: posT
            } );

            return {
                left: posL,
                top: posT
            }
        },

        _calBigPos: function( pointerPos ) {
            var me = this,
                config = this.config,
                mask = this.mask,
                pointer = this.pointer,
                zoomWrap = this.zoomWrap,
                bigImg = this.bigImg,

                percentX = pointerPos.left / ( mask.width() - pointer.width() ),
                percentY = pointerPos.top / ( mask.height() - pointer.height() );

            bigImg.css( {
                left: -percentX * ( bigImg.width() - zoomWrap.width() ),
                top: -percentY * ( bigImg.height() - zoomWrap.height() )
            } );
        }
    } );

    if ( typeof exports !== 'undefined' ) {
        exports = magnify;
    } else {
        root.magnify = magnify;
    }

} )( this );

