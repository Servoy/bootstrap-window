var WindowManager = null;
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
