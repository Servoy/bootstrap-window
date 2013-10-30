var Window = null;
(function($) {

    "use strict";
    Window = function(options) {
        var _window = this;
        options = options || {};
        _window.title = options.title || 'No Title';
        _window.bodyContent = options.bodyContent || '';
        _window.footerContent = options.footerContent || '';
        this.options = options;
        this.initialize();
        return this;
    };

    Window.prototype.initialize = function() {

        if (!this.options.template) {
            throw new Error("No template specified for window.");
        }

        this.$el = $(this.options.template);
        this.$el.find('.window-title').html(this.title);
        this.$el.find('.window-body').html(this.bodyContent);
        this.$el.find('.window-footer').html(this.footerContent);

        this.$el.hide();
        this.$el.appendTo('body');
        if (!this.options.sticky) {
            this.$el.css('left', ($(window).width() / 2) - (this.$el.width() / 2));
            this.$el.css('top', ($(window).height() / 2) - (this.$el.height() / 2));
        } else {
            this.$el.css('left', ($(window).width() / 2) - (this.$el.width() / 2));
            this.$el.css('top', ($(window).height() / 2) - (this.$el.height() / 2));
        }
        this.initHandlers();
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
        return this.title;
    };

    Window.prototype.getElement = function() {
        return this.$el;
    };

    Window.prototype.setSticky = function(sticky) {
        this.sticky = sticky;
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
        return this.sticky;
    };

    Window.prototype.initHandlers = function() {
        var _this = this;

        this.$el.find('[data-dismiss=window]').on('click', function(event) {
            _this.close();
        });

        this.$el.off('mousedown');
        this.$el.on('mousedown', function() {
            _this.$el.trigger('focused');
        });
        this.$el.find('.window-header').off('mousedown');
        this.$el.find('.window-header').on('mousedown', function(event) {
            _this.moving = true;
            _this.offset = {};
            _this.offset.x = event.pageX - _this.$el.position().left;
            _this.offset.y = event.pageY - _this.$el.position().top;
            $('body > *').addClass('disable-select');
        });
        this.$el.find('.window-header').on('mouseup', function(event) {
            _this.moving = false;
            $('body > *').removeClass('disable-select');
        });

        $('body').on('mousemove', function(event) {
            if (_this.moving) {
                var top = _this.$el.find('.window-header').position().top;
                var left = _this.$el.find('.window-header').position().left;
                _this.$el.css('top', event.pageY - _this.offset.y);
                _this.$el.css('left', event.pageX - _this.offset.x);
            }
        });


    };

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
        $.each(this.windows, function(index, windowHandle) {
            windowHandle.setActive(false);
            if (windowHandle === focused_window) {
                focusedWindowIndex = index;
            }
        });
        this.windows.push(this.windows.splice(focusedWindowIndex, 1)[0]);
        this.resortWindows();
        focused_window.setActive(true);
    };

    WindowManager.prototype.initialize = function(options) {
        this.options = options;
        if (this.options.container) {
            $(this.options.container).addClass('window-pane');
        }
    };

    WindowManager.prototype.createWindow = function(window_options) {
        var _this = this;
        var final_options = Object.create(window_options);
        if (this.options.windowTemplate && !final_options.template) {
            final_options.template = this.options.windowTemplate;
        }

        var newWindow = new Window(final_options);
        var focusedWindowIndex;
        newWindow.getElement().on('focused', function(event) {
            _this.setFocused(newWindow);
        });
        newWindow.getElement().on('close', function() {
            _this.destroyWindow(newWindow);
            if (newWindow.getWindowTab()) {
                newWindow.getWindowTab().remove();
            }
        });

        if (this.options.container) {
            newWindow.setWindowTab($('<span class="label label-default">' + newWindow.getTitle() + '<button class="close">x</button></span>'));
            newWindow.getWindowTab().find('.close').on('click', function(event) {
                newWindow.close();
            });
            newWindow.getWindowTab().on('click', function(event) {
                _this.setFocused(newWindow);
                if (newWindow.getSticky()) {
                    window.scrollTo(0, newWindow.getElement().position().top);
                }

            });

            $(this.options.container).append(newWindow.getWindowTab());
        }

        this.windows.push(newWindow);
        this.setFocused(newWindow);
        return newWindow;
    };
}(jQuery));
