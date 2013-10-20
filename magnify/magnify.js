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
            lazyLoadAttr: 'data-src',
            preloadHeight: 0,
            loadedCallback: null
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
                config = this.config;

            this.acitonLazy = $.proxy( me._lazy, me );

            $( window ).on( 'scroll', me.acitonLazy );
            $( window ).on( 'resize', me.acitonLazy );
            $( window ).on( 'load', me.acitonLazy );

            $( me ).on( 'afterLoaded', function( event ) {
                me._afterLoaded( event.img );
            } );
        },

        _cache: function() {
            this.lazyImgs = this._getLazyImgs();
            this.lazyImgsLen = this.lazyImgs.length;
            this.acitonLazy = null;
        },

        _getLazyImgs: function() {
            var me = this,
                config = this.config,
                lazyImgs = [],
                item = null;

            $( 'img' ).each( function( index ) {
                item = $( this );
                if ( item.attr( config.lazyLoadAttr ) ) {
                    lazyImgs.push( item );
                }
            } );

            return lazyImgs;
        },

        _lazy: function() {
            var me = this,
                config = this.config,
                lazyLoadAttr = config.lazyLoadAttr,
                preloadHeight = config.preloadHeight,

                win = $( window ),
                scrollTop = win.scrollTop(),
                clientHeight = win.innerHeight(),
                viewOffset = scrollTop + clientHeight + preloadHeight,
                scrollOffset = scrollTop - preloadHeight;


            $.each( this.lazyImgs, function( index, item ) {
                var itemPosY = item.offset().top,
                    itemPosDepY = itemPosY + item.innerHeight(),
                    imgSrc = item.attr( lazyLoadAttr );

                if ( itemPosY < viewOffset && itemPosDepY > scrollOffset && imgSrc ) {
                    item.css( 'display', 'none' );

                    item.attr( 'src', imgSrc );
                    item.removeAttr( lazyLoadAttr );
                    me.lazyImgsLen--;

                    $( me ).trigger( {
                        type: 'afterLoaded',
                        img: item
                    } );
                }
            } );

            me.lazyImgsLen || me._dispose();
        },

        _dispose: function() {
            $( window ).off( 'scroll', this.acitonLazy );
            $( window ).off( 'resize', this.acitonLazy );
        },

        _afterLoaded: function( img ) {
            var me = this,
                config = this.config;

            if ( $.isFunction( config.loadedCallback ) ) {
                config.loadedCallback( img );
            } else {
                img.fadeIn( 'slow' );
            }
        }
    } );

    if ( typeof exports !== 'undefined' ) {
        exports = lazyLoad;
    } else {
        root.lazyLoad = lazyLoad;
    }

} )( this );

