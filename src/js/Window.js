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

    Window.prototype.initHandlers = function() {
        var _this = this;

        this.$el.find('[data-dismiss=window]').on('click', function(event) {
            _this.close();
        });

        this.$el.off('mousedown');
        this.$el.on('mousedown', function() {
            _this.$el.trigger('focused');
        });
        this.$el.find(this.options.handle).off('mousedown');
        this.$el.find(this.options.handle).on('mousedown', function(event) {
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
        });


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
            if (!this.hasClass('window')) {
                this.addClass('window');
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
