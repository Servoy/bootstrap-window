
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
;
    var WindowManager = function (options) {
        this.windows = [];
        var _windowmanager = this;
        options = options || {};

        var findWindowByID = function (id) {
            var returnValue = null;
            $.each(_windowmanager.windows, function (index, window) {
                console.log(arguments);
                if (window.id === id) {
                    returnValue = window;
                }
            });
            return returnValue;
        };

        var destroyWindow = function (window_handle) {
            $.each(_windowmanager.windows, function (index, window) {
                if (window === window_handle) {
                    _windowmanager.windows.splice(index, 1);
                    resortWindows();
                }
            });
        };

        var resortWindows = function () {
            var startZIndex = 900;
            $.each(_windowmanager.windows, function (index, window) {
                
                window.setIndex(startZIndex + index);
            });
        };

        var setFocused = function (focused_window) {
            var focusedWindowIndex;
            $.each(_windowmanager.windows, function (index, windowHandle) {
                windowHandle.setActive(false);
                if (windowHandle === focused_window) {
                    focusedWindowIndex = index;
                }
            });
            _windowmanager.windows.push(_windowmanager.windows.splice(focusedWindowIndex, 1)[0]);
            resortWindows();
            focused_window.setActive(true);
        };

        var initialize = function () {
            _windowmanager.options = options;
            if (_windowmanager.options.container) {
                $(_windowmanager.options.container).addClass('window-pane');
            }
        };

        var createWindow = function (window_options) {
            var final_options = Object.create(window_options);
            if (options.windowTemplate && !final_options.template) {
                final_options.template = _windowmanager.options.windowTemplate;
            }
            
            var newWindow = new Window(final_options);
            var focusedWindowIndex;
            newWindow.getElement().on('focused', function (event) {
                setFocused(newWindow);
            });
            newWindow.getElement().on('close', function () {
                destroyWindow(newWindow);
                if (newWindow.getWindowTab()) {
                    newWindow.getWindowTab().remove();
                }
            });

            if (_windowmanager.options.container) {
                newWindow.setWindowTab($('<span class="label label-default">' + newWindow.getTitle() + '<button class="close">x</button></span>'));
                newWindow.getWindowTab().find('.close').on('click', function (event) {
                    newWindow.close();
                });
                newWindow.getWindowTab().on('click', function (event) {
                    setFocused(newWindow);
                    if (newWindow.getSticky()) {
                        window.scrollTo(0, newWindow.getElement().position().top);    
                    }
                    
                });
                
                $(options.container).append(newWindow.getWindowTab());
            }

            _windowmanager.windows.push(newWindow);
            setFocused(newWindow);
            return newWindow;
        };



        initialize();

        return {
            setFocused: setFocused,
            createWindow: createWindow,
            resortWindows: resortWindows,
            findWindowByID: findWindowByID
        };
    };