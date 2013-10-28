
    var Window = function (options) {
        var _window = this;
        options = options || {};
        _window.title = options.title || 'No Title';
        _window.bodyContent = options.bodyContent || '';
        _window.footerContent = options.footerContent || '';
        var initialize = function () {
            
            if (!_window.options.template) {
                throw new Error("No template specified for window.");
            }
            
            _window.$el = $(_window.options.template);
            _window.$el.find('.window-title').html(_window.title);
            _window.$el.find('.window-body').html(_window.bodyContent);
            _window.$el.find('.window-footer').html(_window.footerContent);
            
            _window.$el.hide();
            _window.$el.appendTo('body');
            if (!_window.options.sticky) {
                _window.$el.css('left', ($(window).width()/2) - (_window.$el.width()/2));
                _window.$el.css('top', ($(window).height()/2) - (_window.$el.height()/2));
            } else {
                _window.$el.css('left', ($(window).width()/2) - (_window.$el.width()/2));
                _window.$el.css('top', ($(window).height()/2) - (_window.$el.height()/2));
            }
            initHandlers();
            _window.$el.show();
            if (_window.options.id) {
                _window.id = _window.options.id;
            } else {
                _window.id = '';
            }

            setSticky(_window.options.sticky);
            
        };

        var close = function () {
            _window.$el.trigger('close');
            _window.$el.remove();
            if (_window.$windowTab) {
                _window.$windowTab.remove();
            }
        };

        var setActive = function (active) {
            if (active) {
                _window.$el.addClass('active');
                if (_window.$windowTab) {
                    _window.$windowTab.addClass('label-primary');
                }
            } else 
            {
                _window.$el.removeClass('active');
                if (_window.$windowTab) {
                    _window.$windowTab.removeClass('label-primary');
                    _window.$windowTab.addClass('label-default');
                }
            }
        };

        var setIndex = function (index) {
            _window.$el.css('zIndex', index);
        };

        var setWindowTab = function (windowTab) {
            _window.$windowTab = windowTab;
        };
        var getWindowTab = function () {
            return _window.$windowTab;
        };

        var getTitle = function () {
            return _window.title;
        };

        var getElement = function () {
            return _window.$el;
        };

        var setSticky = function (sticky) {
            _window.sticky = sticky;
            if (sticky === false) {
                _window.$el.css({'position': 'absolute'});
            } else {
                _window.$el.css({'position': 'fixed'});
            }
        };

        var getSticky = function () {
            return _window.sticky;
        };
        
        var initHandlers = function () {
            _window.$el.find('[data-dismiss=window]').on('click', function (event) {
                close();
            });

            _window.$el.off('mousedown');
            _window.$el.on('mousedown', function () {
                _window.$el.trigger('focused');
            });
            _window.$el.find('.window-header').off('mousedown');
            _window.$el.find('.window-header').on('mousedown', function (event) {
                _window.moving = true;
                _window.offset = {};
                _window.offset.x = event.pageX - _window.$el.position().left;
                _window.offset.y = event.pageY - _window.$el.position().top;
                $('body > *').addClass('disable-select');
            });
            _window.$el.find('.window-header').on('mouseup', function (event) {
                _window.moving = false;
                $('body > *').removeClass('disable-select');
            });

            $('body').on('mousemove', function (event) {
                if (_window.moving) {
                    var top = _window.$el.find('.window-header').position().top;
                    var left = _window.$el.find('.window-header').position().left;
                    _window.$el.css('top', event.pageY - _window.offset.y);
                    _window.$el.css('left', event.pageX - _window.offset.x);
                }
            });


        };
        
        this.options = options;
        initialize();
        return Object.create({
            setActive: setActive,
            setIndex: setIndex,
            getWindowTab: getWindowTab,
            setWindowTab: setWindowTab,
            getTitle: getTitle,
            getElement: getElement,
            setSticky: setSticky,
            getSticky: getSticky,
            close: close
        });
    };
