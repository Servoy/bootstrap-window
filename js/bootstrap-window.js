var Window = null;
(function($) {

    "use strict";
    Window = function(options) {
        options = options || {};
        var defaults = {
                handle: '.window-header',
                parseHandleForTitle: true,
                title: 'No Title',
                bodyContent: '',
                footerContent: ''
            };
        this.options = $.extend(true, defaults, options);
        this.initialize(options);
        return this;
    };

    Window.prototype.initialize = function(options) {

        if (this.options.fromElement) {
            if (this.options.fromElement instanceof jQuery) {
                this.$el = this.options.fromElement;
            } else if (this.options.fromElement instanceof Element) {
                this.$el = $(this.options.fromElement);
            } else if (typeof this.options.fromElement) {
                this.$el = $(this.options.fromElement);
            }
        } else {
            if (!this.options.template) {
                throw new Error("No template specified for window.");
            }
            this.$el = $(this.options.template);
            this.$el.find('.window-title').html(this.options.title);
            this.$el.find('.window-body').html(this.options.bodyContent);
            this.$el.find('.window-footer').html(this.options.footerContent);
        }
        

        this.$el.css('visibility', 'hidden');
        this.$el.appendTo('body');
        var top, left,
            bodyTop = parseInt($('body').position().top, 10) + parseInt($('body').css('paddingTop'), 10),
            maxHeight;
        if (!this.options.sticky) {
            left = ($(window).width() / 2) - (this.$el.width() / 2);
            top = ($(window).height() / 2) - (this.$el.height() / 2);
        } else {
            left = ($(window).width() / 2) - (this.$el.width() / 2);
            top = ($(window).height() / 2) - (this.$el.height() / 2);
        }

        if (top < bodyTop) {
            top = bodyTop;
        }
        maxHeight = (($(window).height() - bodyTop) - (parseInt(this.$el.children('.window-header').css('height'), 10) + parseInt(this.$el.children('.window-footer').css('height'), 10))) - 45;
        this.$el.children('.window-body').css('maxHeight', maxHeight);

        this.$el.css('left', left);
        this.$el.css('top', top);
        this.initHandlers();
        this.$el.hide();
        this.$el.css('visibility', 'visible');
        this.$el.fadeIn();
        if (this.options.id) {
            this.id = this.options.id;
        } else {
            this.id = '';
        }

        this.setSticky(this.options.sticky);

    };

    Window.prototype.close = function() {
        var _this = this;
        this.$el.trigger('close');
        if (this.options.parent) {
            this.options.parent.clearBlocker();
            if (this.options.window_manager) {
                this.options.window_manager.setFocused(this.options.parent);
            }
        } else if (this.options.window_manager && this.options.window_manager.windows.length > 0) {
            this.options.window_manager.setNextFocused();
        }
        this.$el.fadeOut(400, function() {
            _this.$el.remove();
        });
        if (this.$windowTab) {
            this.$windowTab.fadeOut(400, function() {
                _this.$windowTab.remove();
            });
        }

    };

    Window.prototype.setActive = function(active) {
        if (active) {
            this.$el.addClass('active');
            if (this.$windowTab) {
                this.$windowTab.addClass('label-primary');
            }
        } else {
            this.$el.removeClass('active');
            if (this.$windowTab) {
                this.$windowTab.removeClass('label-primary');
                this.$windowTab.addClass('label-default');
            }
        }
    };

    Window.prototype.setIndex = function(index) {
        this.$el.css('zIndex', index);
    };

    Window.prototype.setWindowTab = function(windowTab) {
        this.$windowTab = windowTab;
    };
    Window.prototype.getWindowTab = function() {
        return this.$windowTab;
    };

    Window.prototype.getTitle = function() {
        return this.options.title;
    };

    Window.prototype.getElement = function() {
        return this.$el;
    };

    Window.prototype.setSticky = function(sticky) {
        this.options.sticky = sticky;
        if (sticky === false) {
            this.$el.css({
                'position': 'absolute'
            });
        } else {
            this.$el.css({
                'position': 'fixed'
            });
        }
    };

    Window.prototype.getSticky = function() {
        return this.options.sticky;
    };

    Window.prototype.setManager = function (window_manager) {
        this.options.window_manager = window_manager;
    };

    Window.prototype.initHandlers = function() {
        var _this = this;

        this.$el.find('[data-dismiss=window]').on('click', function(event) {
            if (_this.options.blocker) {
                return;
            }
            _this.close();
        });

        this.$el.off('mousedown');
        this.$el.on('mousedown', function() {
            if (_this.options.blocker) {
                _this.options.blocker.getElement().trigger('focused');
                _this.options.blocker.blink();
                return;
            } else {
                _this.$el.trigger('focused');
            }
            
            if (_this.$el.hasClass('ns-resize') || _this.$el.hasClass('ew-resize')) {
                $('body > *').addClass('disable-select');
                _this.resizing = true;
                _this.offset = {};
                _this.offset.x = event.pageX;
                _this.offset.y = event.pageY;
                _this.window_info = {
                    top: _this.$el.position().top,
                    left: _this.$el.position().left,
                    width: _this.$el.width(),
                    height: _this.$el.height()
                };

                if (event.offsetY < 5) {
                    _this.$el.addClass('north');
                }
                if (event.offsetY > (_this.$el.height() - 5)) {
                    _this.$el.addClass('south');
                }
                if (event.offsetX < 5) {
                    _this.$el.addClass('west');
                }
                if (event.offsetX > (_this.$el.width() - 5)) {
                    _this.$el.addClass('east');
                }
            }
        });

        $('body').on('mouseup', function () {
            _this.resizing = false;
            $('body > *').removeClass('disable-select');
            _this.$el.removeClass('west');
            _this.$el.removeClass('east');
            _this.$el.removeClass('north');
            _this.$el.removeClass('south');

        });
        this.$el.find(this.options.handle).off('mousedown');
        this.$el.find(this.options.handle).on('mousedown', function(event) {
            if (_this.options.blocker) {
                return;
            }
            _this.moving = true;
            _this.offset = {};
            _this.offset.x = event.pageX - _this.$el.position().left;
            _this.offset.y = event.pageY - _this.$el.position().top;
            $('body > *').addClass('disable-select');
        });
        this.$el.find(_this.options.handle).on('mouseup', function(event) {
            _this.moving = false;
            $('body > *').removeClass('disable-select');
        });

        $('body').on('mousemove', function(event) {
            if (_this.moving) {
                var top = _this.$el.find(_this.options.handle).position().top;
                var left = _this.$el.find(_this.options.handle).position().left;
                _this.$el.css('top', event.pageY - _this.offset.y);
                _this.$el.css('left', event.pageX - _this.offset.x);
            }
            if (_this.options.resizable && _this.resizing) {
                if (_this.$el.hasClass("east")) {
                    _this.$el.css('width', event.pageX - _this.window_info.left);
                }
                if (_this.$el.hasClass("west")) {
                    
                    _this.$el.css('left', event.pageX);
                    _this.$el.css('width', _this.window_info.width + (_this.window_info.left  - event.pageX));
                }
                if (_this.$el.hasClass("south")) {
                    _this.$el.css('height', event.pageY - _this.window_info.top);
                }
                if (_this.$el.hasClass("north")) {
                    _this.$el.css('top', event.pageY);
                    _this.$el.css('height', _this.window_info.height + (_this.window_info.top  - event.pageY));
                }
            }
        });

        this.$el.on('mousemove', function (event) {
            if (_this.options.blocker) {
                return;
            }
            if (_this.options.resizable) {
                if (event.offsetY > (_this.$el.height() - 5) || event.offsetY < 5) {
                    _this.$el.addClass('ns-resize');
                } else {
                    _this.$el.removeClass('ns-resize');
                }
                if (event.offsetX > (_this.$el.width() - 5) || event.offsetX < 5) {
                    _this.$el.addClass('ew-resize');

                } else {
                    _this.$el.removeClass('ew-resize');
                }
            }

        });
    };

    Window.prototype.resize = function (options) {
        options = options || {};
        if (options.top) {
            this.$el.css('top', options.top);
        }
        if (options.left) {
            this.$el.css('left', options.left);
        }
        if (options.height) {
            this.$el.css('height', options.height);
        }
        if (options.width) {
            this.$el.css('width', options.width);
        }
    };

    Window.prototype.setBlocker = function (window_handle) {
        this.options.blocker = window_handle;
        this.$el.find('.disable-shade').remove();
        this.$el.find('.window-body').append('<div class="disable-shade"></div>');
        this.$el.find('.window-footer').append('<div class="disable-shade"></div>');
        this.$el.find('.disable-shade').fadeIn();
        if (!this.options.blocker.getParent()) {
            this.options.blocker.setParent(this);
        }
    };


    Window.prototype.getBlocker = function () {
        return this.options.blocker;
    };

    Window.prototype.clearBlocker = function () {
        this.$el.find('.disable-shade').fadeOut(function () {
            this.remove();
        });
        delete this.options.blocker;
    };

    Window.prototype.setParent = function (window_handle) {
        this.options.parent = window_handle;
        if (!this.options.parent.getBlocker()) {
            this.options.parent.setBlocker(this);
        }
    };

    Window.prototype.getParent = function () {
        return this.options.parent;
    };

    Window.prototype.blink = function () {
        var _this = this,
            active = this.$el.hasClass('active');

        var blinkInterval = setInterval(function () {
            _this.$el.toggleClass('active');
        }, 250);
        var blinkTimeout = setTimeout(function () {
            clearInterval(blinkInterval);
            if (active) {
                _this.$el.addClass('active');
            }
        }, 1000);
    };
 
    $.fn.window = function(options) {
        options = options || {};
        var newWindow,
            window_opts = {
                fromElement: this
            };
        if (typeof options === "object") {
            if (options.handle) {
                window_opts.handle = options.handle;
                this.find(options.handle).css('cursor', 'move');
            }
            if (!$(this).hasClass('window')) {
                $(this).addClass('window');
            }
            newWindow = new Window(window_opts);
            this.data('window', newWindow);
            

        } else if (typeof options === "string") {
            switch (options) {
                case "close":
                    this.data('window').close();
                    break;
                default:
                    break;
            }
        }


        return this;
        
    };

    $('[data-window-target]').off('click');
    $('[data-window-target]').on('click', function () {
        var $this = $(this),
            opts = {};
        if ($this.data('windowTitle')) {
            opts.title = $this.data('windowTitle');
        }

        if ($this.data('windowHandle')) {
            opts.handle = $this.data('windowHandle');
        }

        $($this.data('windowTarget')).window(opts); 
    });  

 


}(jQuery));
;var WindowManager = null;
(function($) {
    "use strict";
    WindowManager = function(options) {
        this.windows = [];
        options = options || {};
        this.initialize(options);
        return this;
    };

    WindowManager.prototype.findWindowByID = function(id) {
        var returnValue = null;
        $.each(this.windows, function(index, window) {
            console.log(arguments);
            if (window.id === id) {
                returnValue = window;
            }
        });
        return returnValue;
    };

    WindowManager.prototype.destroyWindow = function(window_handle) {
        var _this = this;
        $.each(this.windows, function(index, window) {
            if (window === window_handle) {
                _this.windows.splice(index, 1);
                _this.resortWindows();
            }
        });
    };

    WindowManager.prototype.resortWindows = function() {
        var startZIndex = 900;
        $.each(this.windows, function(index, window) {

            window.setIndex(startZIndex + index);
        });
    };

    WindowManager.prototype.setFocused = function(focused_window) {
        var focusedWindowIndex;
        while (focused_window.getBlocker()) {
            focused_window = focused_window.getBlocker();
        }
        $.each(this.windows, function(index, windowHandle) {
            windowHandle.setActive(false);
            if (windowHandle === focused_window) {
                focusedWindowIndex = index;
            }
        });
        this.windows.push(this.windows.splice(focusedWindowIndex, 1)[0]);
        

        focused_window.setActive(true);
        this.resortWindows();

    };

    WindowManager.prototype.initialize = function(options) {
        this.options = options;
        if (this.options.container) {
            $(this.options.container).addClass('window-pane');
        }
    };

    WindowManager.prototype.setNextFocused = function () {
        this.setFocused(this.windows[this.windows.length-1]);
    };

    WindowManager.prototype.addWindow = function(window_object) {
        var _this = this;
        window_object.getElement().on('focused', function(event) {
            _this.setFocused(window_object);
        });
        window_object.getElement().on('close', function() {
            _this.destroyWindow(window_object);
            if (window_object.getWindowTab()) {
                window_object.getWindowTab().remove();
            }

        });

        if (this.options.container) {
            window_object.setWindowTab($('<span class="label label-default">' + window_object.getTitle() + '<button class="close">x</button></span>'));
            window_object.getWindowTab().find('.close').on('click', function(event) {
                window_object.close();
            });
            window_object.getWindowTab().on('click', function(event) {
                _this.setFocused(window_object);
                if (window_object.getSticky()) {
                    window.scrollTo(0, window_object.getElement().position().top);
                }

            });

            $(this.options.container).append(window_object.getWindowTab());
        }

        this.windows.push(window_object);
        window_object.setManager(this);
        this.setFocused(window_object);
        return window_object;
    };

    WindowManager.prototype.createWindow = function(window_options) {
        var _this = this;
        var final_options = Object.create(window_options);
        if (this.options.windowTemplate && !final_options.template) {
            final_options.template = this.options.windowTemplate;
        }

        var newWindow = new Window(final_options);
        
        
        return this.addWindow(newWindow);
    };
}(jQuery));
