( function( exports ) {

    function popSubMenu( config ) {
        this.defaultConfig = {
            el: 'category',
            cateMenuClass: 'cate-menu',
            subCateClass: 'sub-cate',
            subViewClass: 'sub-view',

            delayShow: 80,
            delayHide: 0,

            excursionTop: -3,
            subViewWidth: 327
        };

        this.init.call( this, config );
    }

    popSubMenu.prototype = {
        init: function( config ) {
            this.config = $.extend( true, this.defaultConfig, config || {} );

            this._cache();
            this._initEvent();
        },

        _cache: function() {
            var me = this,
                config = this.config;

            this.el = ( $.type( config.el ) === 'string' ) ? $( '#' + config.el ) : config.el;
            this.cateMenu = this.el.find( '.' + config.cateMenuClass );
            this.cateList = this.cateMenu.find( 'ul>li' );
            this.subCate = this.el.find( '.' + config.subCateClass );
            this.subView = this.subCate.find( '.' + config.subViewClass );

            this.baseTop = this.el.offset().top;
            
            this.showTimer = null;
            this.hideTimer = null;

            this.tempDocHandle = $.proxy( this._onDocHandle, this );
        },
        
        _initEvent: function(){
            var me = this,
                config = this.config;

            this.cateMenu.delegate( 'ul>li', 'mouseover', function( event ) {
                event.stopPropagation();
                var item = $( this ),
                    cateIndex = me._getIndex( 'cateList', this ),
                    subViewItem = me.subView[ cateIndex ],
                    subViewItemHeight = $( subViewItem ).height(),

                    cateTop = item.offset().top,
                    viewHeight = viewportWidth = $( window ).height(),
                    scrollTop = $( window ).scrollTop(),

                    subCateTop = cateTop - me.baseTop,
                    excursionTop = ( cateTop + subViewItemHeight ) - ( viewHeight + scrollTop - 10 );

                me.showTimer = setTimeout( function() {
                    //调整subCate坐标，让其显示在页面的可视范围内
                    if ( excursionTop > 0 ) {
                        me.subCate.css( 'top', subCateTop - excursionTop );
                    } else {
                        //默认与当前元素顶部对齐
                        me.subCate.css( 'top', subCateTop + config.excursionTop );
                    }

                    me._hideSubView();
                    item.addClass( 'cur' );
                    me._showSubView( subViewItem );

                    $( me ).trigger( 'afterShow' );
                }, config.delayShow );
                
            } );

            this.cateMenu.delegate( 'ul>li', 'mouseout', function( event ) {
                event.stopPropagation();

                clearTimeout( me.showTimer );
            } );

            this.subCate.delegate( '.' + config.subViewClass, 'mouseover', function( event ) {
                event.stopPropagation();

                var subIndex = me._getIndex( 'subView', this );
                $( me.cateList[ subIndex ] ).addClass( 'cur' );
            } );
        },

        _onDocHandle: function() {
            this._hideSubView( true );
        },

        /*
         * 获取当前dom元素索引值
         * @para type nodeList 类型
         * @para el 当前dom元素
         */
        _getIndex: function( type, el ) {
            var curIndex = '',
                elList = this[ type ];

            elList.each( function( index ) {
                if ( el === this ) {
                    curIndex = index;
                }
            } );

            return curIndex;
        },

        /*
         * 是否直接关闭子菜单
         * @para type 是否直接关闭
         */
        _hideSubView: function( isDelay ) {
            var me = this,
                config = this.config;

            if ( isDelay ) {
                if ( this.hideTimer ) {
                    clearTimeout( this.hideTimer );
                }
                
                this.hideTimer = setTimeout( function() {
                    me._resetSubView();
                }, config.delayHide );
            } else {
                me._resetSubView();
            }
        },

        _resetSubView: function() {
            this.subView.each( function( index ) {
                $( this ).addClass( 'hide' );
            } );

            $( this.subCate ).css( 'width', 0 );

            this.cateList.each( function( index ) {
                $( this ).removeClass( 'cur' );
            } );

            $( this ).trigger( 'afterHide' );
        },

        _showSubView: function( curSub ) {
            var me = this,
                config = this.config;

            $( me.subCate ).css( 'width', config.subViewWidth );
            $( curSub ).removeClass( 'hide' );

            $( document ).on( 'mouseover', this.tempDocHandle );
        }
    }

    exports.popSubMenu = popSubMenu;

} )( window );

