
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