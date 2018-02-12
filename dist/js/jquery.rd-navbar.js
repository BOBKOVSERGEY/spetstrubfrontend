/**
 * RD Navbar
 * @version 1.1.0
 * @author Evgeniy Gusarov (Stmechanus | Diversant)
 * @license The MIT License (MIT)
 */
;
(function ($, window, documen, undefined) {
    "use strict";

    var isTouch = "ontouchstart" in window;

    /**
     * Creates a navbar.
     * @class The RD Navbar.
     * @public
     * @param {HTMLElement|jQuery} element - The element to create the navbar for.
     * @param {Object} [options] - The options
     */
    function RDNavbar(element, options) {

        /**
         * Current options set by the caller including defaults.
         * @public
         */
        this.options = $.extend({}, RDNavbar.Defaults, options);

        /**
         * Plugin element.
         * @public
         */
        this.$element = $(element);

        /**
         * Plugin element clone.
         * @public
         */
        this.$clone = undefined;

        /**
         * Contains all temporary statements of navbar
         * @public
         */
        this.states = {
            staticOffset: this.$element.parent().offset().top,
            height: this.$element.outerHeight(),
            loaded: false,
            isStuck: false
        };

        /**
         * References to the running plugins of this Navbar.
         * @protected
         */
        this._plugins = {};

        /**
         * Creates the instances of all attached plugins
         * @protected
         */
        $.each(RDNavbar.Plugins, $.proxy(function (key, plugin) {
            this._plugins[key[0].toLowerCase() + key.slice(1)]
                = new plugin(this);
        }, this));

        this.initialize();
    };

    /**
     * Default options for the Form.
     * @public
     */
    RDNavbar.Defaults = {
        stuckWidth: 768,
        stuckMorph: false,
        stuckLayout: "rd-navbar-static",
        responsive: {
            0: ["rd-navbar-fixed"],
            768: ["rd-navbar-fullwidth"],
            1200: ["rd-navbar-static"]
        }
    };

    /**
     * Contains all registered plugins.
     * @public
     */
    RDNavbar.Plugins = {};

    /**
     * Initializes the Navbar.
     * @protected
     */
    RDNavbar.prototype.initialize = function () {
        var _self = this;

        $(document).on("RDNavEvent", function () {
            _self.options.responsive[1200] = _self.$element.attr("data-rd-navbar-lg").split(" ");
            $(window).trigger("resize");
        });

        _self.resize();
        _self.scroll();

        _self.$element
            .addClass("rd-navbar")
            .addClass("rd-navbar--loading");

        $(window)
            .on("resize", $.proxy(_self.resize, _self))
            .on("resize", function () {
                setTimeout($.proxy(_self.resizeWrap, _self), 350);
            })
            .trigger("resize");

        $(window).on("orientationchange", function () {
            setTimeout($.proxy(_self.resizeWrap, _self), 350);
        });

        if (!isTouch) {
            $(document).on("scroll", $.proxy(_self.scroll, _self));
        } else {
            _self.$element.addClass("rd-navbar--touch");
        }

        if (!_self.options.stuckMorph) {
            _self.$clone = _self.$element.clone(true).insertAfter(_self.$element).attr("class", "rd-navbar rd-navbar--is-clone " + _self.options.stuckLayout).addClass();
        }

        $(window).load(function () {
            setTimeout(function () {
                _self.$element
                    .removeClass("rd-navbar--loading");

                if (_self.$clone) {
                    _self.$clone
                        .removeClass("rd-navbar--loading");
                }

                _self.states.loaded = true;
            }, 600);
        });
    };

    /**
     * Changes $element class attr basing on screen resolution
     * @protected
     */
    RDNavbar.prototype.resize = function (e) {
        var _self = this,
            w = $(window).width(), r, t = ["rd-navbar"];

        if (_self.$element.hasClass('active')) {
            t.push("active");
        }

        if (isTouch) {
            t.push("rd-navbar--touch");
        }

        if (_self.$element.hasClass('rd-navbar--is-stuck')) {
            t.push("rd-navbar--is-stuck");
        }

        if (!_self.states.loaded) {
            t.push("rd-navbar--loading");
        }

        if (_self.$clone) {
            if (!_self.options.stuckMorph && w >= _self.options.stuckWidth) {
                _self.$clone.css("display", "block");
            } else {
                _self.$clone.css("display", "none");
            }
        }

        for (var i in _self.options.responsive) {
            if (i < w) {
                r = i;
            }
        }

        for (var i in _self.options.responsive[r]) {
            t.push(_self.options.responsive[r][i]);
        }

        _self.$element.attr("class", t.join(" "));
    };


    /**
     * Recalculate wrap height for navbar stuck statement
     * @protected
     */
    RDNavbar.prototype.resizeWrap = function (e) {
        var _self = this;

        if (this.$element.hasClass("rd-navbar-sidebar")) {
            $("html").addClass("rd-navbar--has-sidebar");
            this.states.height = 0;
            $(".rd-navbar-wrap").height(this.states.height);
        } else {
            $("html").removeClass("rd-navbar--has-sidebar");
        }

        if (this.$element.hasClass("rd-navbar-fixed")) {
            this.states.height = this.$element.find(".rd-navbar-panel").outerHeight();
            $(".rd-navbar-wrap").height(this.states.height);
        }

        if (!isTouch && !this.$element.hasClass("rd-navbar-sidebar") && !this.$element.hasClass("rd-navbar-fixed")) {
            this.states.staticOffset = this.$element.parent().offset().top;
            _self.states.height = this.$element.outerHeight();
            $(".rd-navbar-wrap").css("height", _self.states.height);
        }
    };

    /**
     * Handles document scroll on sticky event
     * @protected
     */
    RDNavbar.prototype.scroll = function (e) {
        var _self = this,
            scrollTop = $(document).scrollTop();

        var target = _self.options.stuckMorph ? _self.$element : _self.$clone,
            threshold = _self.options.stuckMorph ? _self.states.staticOffset + 1 : _self.states.staticOffset + _self.states.height;

        if ($(window).width() >= _self.options.stuckWidth &&
            target) {
            if (scrollTop >= threshold && !_self.$element.hasClass("rd-navbar--is-stuck")) {
                target.addClass("rd-navbar--is-stuck");
                _self.states.isStuck = true;

                if (_self.$clone) {
                    _self.$clone.css({"overflow": "visible"});
                    _self.$element.css({"overflow": "hidden"});
                }
            }
            else if (scrollTop < threshold &&
                target.hasClass("rd-navbar--is-stuck")) {
                target.removeClass("rd-navbar--is-stuck");
                _self.states.isStuck = false;

                if (_self.$clone) {
                    _self.$clone.css({"overflow": "hidden"});
                    _self.$element.css({"overflow": "visible"});
                }

                setTimeout(function () {
                    _self.resizeWrap();
                }, 350);
            }

            if (!target.hasClass("rd-navbar-sidebar") && !target.hasClass("rd-navbar-fixed")) {
                _self.$element.removeClass("active");
                $(".rd-navbar-toggle").removeClass("active");
                $(".rd-navbar-submenu").removeClass("focus");

                if (_self.$clone) {
                    _self.$clone.removeClass("active");
                }
            }
        }
    };


    /**
     * The jQuery Plugin for the RD Navbar
     * @public
     */
    $.fn.rdnavbar = function (options) {
        return this.each(function () {
            if (!$(this).data('rdnavbar')) {
                $(this).data('rdnavbar', new RDNavbar(this, options));
            }
        });
    };

    /**
     * The constructor for the jQuery Plugin
     * @public
     */
    $.fn.rdnavbar.Constructor = RDNavbar;
})(window.jQuery, window, document);

/**
 * Submenu Plugin
 * @version 1.0.0
 * @author Evgeniy Gusarov (Stmechanus | Diversant)
 * @license The MIT License (MIT)
 */
;
(function ($, window, document, undefined) {

    var timer,
        isTouch = "ontouchstart" in window;

    /**
     * Creates Dropdown plugin.
     * @class The Dropdown Plugin
     * @param {RDNavbar} navbar - The Navbar
     */
    var Dropdown = $.fn.rdnavbar.Constructor.Plugins.Dropdown = function (form) {
        /**
         * Reference to the core.
         * @protected
         * @type {RDNavbar}
         */
        this._core = form;

        // set default options
        this._core.options = $.extend({}, Dropdown.Defaults, this._core.options);

        this.initialize();
    };

    /**
     * Default options.
     * @public
     */
    Dropdown.Defaults = {
        "dropdown": {}
    };

    /**
     * Initializes the Dropdown plugin.
     * @protected
     */
    Dropdown.prototype.initialize = function () {
        var _self = this;

        _self._core
            .$element
            .find(".rd-navbar-dropdown, .rd-navbar-megamenu")
            .each(function () {
                var $this = $(this);

                if ($this.hasClass("rd-navbar-megamenu")) {
                    $this.parent().addClass("rd-navbar--has-megamenu");
                } else {
                    $this.parent().addClass("rd-navbar--has-dropdown");
                }
            })
            .parents("li")
            .addClass("rd-navbar-submenu")
            .on("mouseleave", {over: _self.over}, _self.out)
            .find("> a")
            .on("mouseenter", function () {
                $.proxy(_self.over, $(this).parent().get(0))();
            })
            .addClass("rd-navbar-submenu-link")
            .each(function (e) {
                var $this = $(this);
                $this
                    .on("touchstart", function (e) {
                        if ($this.parents(".rd-navbar").hasClass("rd-navbar-fixed") ||
                            $this.parents(".rd-navbar").hasClass("rd-navbar-sidebar")) {
                            return;
                        }

                        e.preventDefault();
                        if (!$(this).parent().hasClass('focus')) {
                            $.proxy(_self.over, $(this).parent().get(0))();
                        } else {
                            window.location.href = $(this).attr("href");
                        }
                        return false;
                    })
                    .prepend($("<button/>", {"class": "rd-navbar-submenu-toggle"})
                        .on("click", function (e) {
                            e.preventDefault();
                            e.stopPropagation();
                            $(this).parents(".rd-navbar-submenu").eq(0).toggleClass("focus");
                        }));
            });

        $("body").on(isTouch ? "touchstart" : "click", function (e) {
            $this = $(e.target);

            if (!$this.hasClass("rd-navbar-submenu") && !$this.parents(".rd-navbar-submenu").length) {
                $(".rd-navbar-submenu").removeClass('focus');
            }
        });
    };

    /**
     * Handler mouse enter event
     * @protected
     */
    Dropdown.prototype.over = function (e) {
        var $this = $(this);

        if ($this.parents(".rd-navbar").hasClass("rd-navbar-fixed") ||
            $this.parents(".rd-navbar").hasClass("rd-navbar-sidebar")) {
            return;
        }

        $this.siblings().removeClass("focus");
        $this.addClass("focus");


        if (timer) {
            clearTimeout(timer);
        }
    };

    /**
     * Handler mouse out event
     * @protected
     */
    Dropdown.prototype.out = function (e) {
        var $this = $(this);

        if ($this.parents(".rd-navbar").hasClass("rd-navbar-fixed") ||
            $this.parents(".rd-navbar").hasClass("rd-navbar-sidebar")) {
            return;
        }

        $this.one("mouseenter", function () {
            if (timer) {
                clearTimeout(timer);
            }
        });

        timer = setTimeout(function () {
            $this.removeClass("focus");
        }, 800);
    };


})(window.jQuery, window, document);


/**
 * Search Plugin
 * @version 1.0.0
 * @author Evgeniy Gusarov (Stmechanus | Diversant)
 * @license The MIT License (MIT)
 */
;
(function ($, window, document, undefined) {

    var isTouch = "ontouchstart" in window;

    /**
     * Creates Search plugin.
     * @class The Search Plugin
     * @param {RDNavbar} navbar - The Navbar
     */
    var Search = $.fn.rdnavbar.Constructor.Plugins.Search = function (form) {
        /**
         * Reference to the core.
         * @protected
         * @type {RDNavbar}
         */
        this._core = form;

        // set default options
        this._core.options = $.extend({}, Search.Defaults, this._core.options);

        this.initialize();
    };

    /**
     * Default options.
     * @public
     */
    Search.Defaults = {
        search: {
            handler: "bat/rd-search.php",
            responsive: {
                0: {
                    toggleable: true
                }
            }
        }
    };


    /**
     * Initializes the Search plugin.
     * @protected
     */
    Search.prototype.initialize = function () {
        var _self = this, results = $(".rd-navbar-search-results");
        $(".rd-navbar-search-toggle")
            .on(isTouch ? "touchstart" : "click", function (e) {
                var w = $(window).width(), r;

                for (var i in _self._core.options.search.responsive) {
                    if (i < w) {
                        r = i;
                    }
                }

                if (!$(this).hasClass("active") && _self._core.options.search.responsive[r].toggleable) {
                    e.preventDefault();
                    $(this).parents(".rd-navbar-search").addClass('active');
                    $(this).parents(".rd-navbar").addClass('rd-navbar--on-search');
                    $(this).addClass('active');
                    setTimeout(function () {
                        var input = $(".rd-navbar-search-form-input").find("input");
                        input.focus();
                        if (input.val() !== "") {
                            $(".rd-navbar-live-search-results").addClass("active");
                        }
                    }, 300);
                }
            });

        $(".rd-navbar-search-form-input")
            .find("input")
            .val("")
            .on("keyup", function () {
                $.get(
                    _self._core.options.search.handler,
                    {
                        s: $(this).val(),
                        liveSearch: "true",
                        liveCount: _self._core.options.search.maxlive,
                        dataType: "html"
                    },
                    onSuccess
                );
                function onSuccess(data) {
                    $(".rd-navbar-live-search-results").html(data).addClass("active");
                }
            });

        if (results.length) {
            var s = location.search.replace(/^\?.*s=([^&]+)/, '$1');

            $.get(
                _self._core.options.search.handler,
                {
                    s: decodeURI(s),
                    liveSearch: "false",
                    dataType: "html"
                },
                onSuccessOut
            );
            function onSuccessOut(data) {
                results.html(data);
            }
        }

        $("body").on(isTouch ? "touchstart" : "click", function (e) {
            $this = $(e.target);


            if (!$this.hasClass("rd-navbar-search") && !$this.parents(".rd-navbar-search").length) {
                $(".rd-navbar-live-search-results").removeClass("active");
                $(".rd-navbar-search-form-input").find("input").blur();

                setTimeout(function () {
                    if ($(".rd-navbar-search-form-input input").val() == "") {
                        $(".rd-navbar-live-search-results").html('');
                    }
                    $(".rd-navbar-search, .rd-navbar-search-toggle").removeClass('active');
                    $(".rd-navbar").removeClass('rd-navbar--on-search');
                }, 300);
            }
        })
    };


})(window.jQuery, window, document);

/**
 * Collapse Plugin
 * @version 1.0.0
 * @author Evgeniy Gusarov (Stmechanus | Diversant)
 * @license The MIT License (MIT)
 */
;
(function ($, window, document, undefined) {

    var isTouch = "ontouchstart" in window;

    /**
     * Creates Collapse plugin.
     * @class The Collapse Plugin
     * @param {RDNavbar} navbar - The Navbar
     */
    var Collapse = $.fn.rdnavbar.Constructor.Plugins.Collapse = function (form) {
        /**
         * Reference to the core.
         * @protected
         * @type {RDNavbar}
         */
        this._core = form;

        // set default options
        this._core.options = $.extend({}, Collapse.Defaults, this._core.options);

        this.isSwitched = false;

        this.initialize();
    };

    Collapse.Defaults = {
        collapse: {
            desktopViewWidth: 1366
        }
    };

    /**
     * Initializes the Collapse plugin.
     * @protected
     */
    Collapse.prototype.initialize = function () {
        var _self = this;
        $(".rd-navbar-collapse-toggle")
            .on(isTouch ? "touchstart" : "click", function (e) {
                $(this).parents(".rd-navbar-collapse").toggleClass('active');
                $(this).toggleClass('active');
            });

        $("body").on(isTouch ? "touchstart" : "click", function (e) {
            $this = $(e.target);

            if (!$this.hasClass("rd-navbar-collapse") && !$this.parents(".rd-navbar-collapse").length) {
                $(".rd-navbar-collapse, .rd-navbar-collapse-toggle").removeClass('active');
            }
        });

        if (isTouch && window.self === window.top) {
            $(".rd-navbar-collapse-items")
                .prepend($("<li/>").append($("<a/>", {
                    "class": "rd-navbar--switch-to-desktop fa-desktop",
                    "href": "#",
                    "text": "Show Desktop Version"
                })));

            $(".rd-navbar--switch-to-desktop")
                .on("click", $.proxy(_self.switchDesktopVersion, _self));

            if ($.cookie("rd-show-desktop")) {
                _self.switchDesktopVersion();
            }
        }


    };


    Collapse.prototype.switchDesktopVersion = function (flag) {
        var meta = $('meta[name="viewport"]'),
            content = meta.attr("content"),
            attr = content.split(","), d;

        if (!this.isSwitched) {
            for (var i in attr) {
                if (attr[i].indexOf("width") > -1) {
                    attr[i] = "width=1366";
                }
                else if (attr[i].indexOf("user-scalable") > -1) {
                    attr[i] = "user-scalable=yes";
                }
                else if (attr[i].indexOf("initial-scale") > -1) {
                    attr[i] = "initial-scale=" + (document.documentElement.clientWidth / this._core.options.collapse.desktopViewWidth);
                }
            }
            this.isSwitched = true;
            $(".rd-navbar--switch-to-desktop").removeClass("fa-desktop").addClass("fa-mobile")
                .each(function () {
                    $(this).text("Show Mobile Version");
                });
            $.cookie("rd-show-desktop", true, {expires: 365, path: '/'});
        } else {
            for (var i in attr) {
                if (attr[i].indexOf("width") > -1) {
                    attr[i] = "width=device-width";
                }
                else if (attr[i].indexOf("user-scalable") > -1) {
                    attr[i] = "user-scalable=no";
                }
                else if (attr[i].indexOf("initial-scale") > -1) {
                    attr[i] = "initial-scale=1";
                }
            }
            this.isSwitched = false;
            $(".rd-navbar--switch-to-desktop").removeClass("fa-mobile").addClass("fa-desktop")
                .each(function () {
                    $(this).text("Show Desktop Version");
                });
            $.removeCookie("rd-show-desktop", {path: '/'});
        }

        meta.attr("content", attr.join(","));
        $(window).trigger("resize");
    }

})(window.jQuery, window, document);

/**
 * Toggle Plugin
 * @version 1.0.0
 * @author Evgeniy Gusarov (Stmechanus | Diversant)
 * @license The MIT License (MIT)
 */
;
(function ($, window, document, undefined) {

    var isTouch = "ontouchstart" in window;

    /**
     * Creates Toggle plugin.
     * @class The Toggle Plugin
     * @param {RDNavbar} navbar - The Navbar
     */
    var Toggle = $.fn.rdnavbar.Constructor.Plugins.Toggle = function (form) {
        /**
         * Reference to the core.
         * @protected
         * @type {RDNavbar}
         */
        this._core = form;

        // set default options
        this._core.options = $.extend({}, Toggle.Defaults, this._core.options);

        this.initialize();
    };


    /**
     * Initializes the Toggle plugin.
     * @protected
     */
    Toggle.prototype.initialize = function () {
        var _self = this;
        $(".rd-navbar-toggle")
            .on(isTouch ? "touchstart" : "click", function (e) {
                _self._core.$element.toggleClass("active");
                $(this).toggleClass('active');

                if (_self._core.$clone) {
                    _self._core.$clone.toggleClass("active");
                }
            });

        $("body")
            .on(isTouch ? "touchstart" : "click", function (e) {
                $this = $(e.target);

                if (!$this.hasClass("rd-navbar-nav") && !$this.hasClass("rd-navbar-toggle") && !$this.parents(".rd-navbar-toggle").length && !$this.parents(".rd-navbar-nav").length) {
                    $(".rd-navbar, .rd-navbar-toggle").removeClass('active');
                }
            })
    };
})(window.jQuery, window, document);

/**
 * OnePage Navigation Plugin
 * @version 1.0.0
 * @author Evgeniy Gusarov (Stmechanus | Diversant)
 * @license The MIT License (MIT)
 */
;
(function ($, window, document, undefined) {

    var isTouch = "ontouchstart" in window;

    /**
     * Creates OnePage Navigation plugin.
     * @class The OnePage Navigation Plugin
     * @param {RDNavbar} navbar - The Navbar
     */
    var OnePage = $.fn.rdnavbar.Constructor.Plugins.OnePage = function (form) {
        /**
         * Reference to the core.
         * @protected
         * @type {RDNavbar}
         */
        this._core = form;

        // set default options
        this._core.options = $.extend({}, OnePage.Defaults, this._core.options);

        this.initialize();
    };

    OnePage.Defaults = {
        onepage: {
            enable: false,
            offset: 0,
            speed: 400
        }
    };

    /**
     * Initializes the OnePage Navigation plugin.
     * @protected
     */
    OnePage.prototype.initialize = function () {
        var _self = this;

        if (!_self._core.options.onepage.enable) {
            return;
        }

        $('.rd-navbar-nav').each(function () {
            var $this = $(this);

            $this.find('a[href^="#"]').on('click', function (e) {
                e.preventDefault();
                $(this).addClass('active');

                var target = this.hash,
                    menu = target;
                $target = $(target);
                $('html, body').stop().animate({
                    'scrollTop': $target.offset().top + 2
                }, _self._core.options.onepage.speed, 'swing', function () {
                    if (history.state) {
                        if (history.state.id !== target) {
                            history.replaceState({"id": target}, null, target);
                        }
                    } else {
                        history.pushState({"id": target}, null, target);
                    }
                });
            });
        });

        $(document).on("scroll", {offset: _self._core.options.onepage.offset}, _self.scroll);
    };

    OnePage.prototype.scroll = function (e) {
        var scrollPos = $(document).scrollTop();

        if (((scrollPos + $(window).height()) > ($(document).height() - 100)) &&
            $($('.rd-navbar-nav > li:last-child > a').attr('href')).length > 0
        ) {
            $('.rd-navbar-nav li').removeClass("active");
            $('.rd-navbar-nav li:last-child').addClass("active");
            return;
        }

        $('.rd-navbar-nav').find('a').each(function () {
            var currLink = $(this);
            var refElement = $(currLink.attr("href"));

            if (refElement.length > 0) {
                if ((refElement.position().top - 20 + e.data.offset) <= scrollPos && refElement.position().top + refElement.height() > scrollPos) {
                    currLink.parent().parent().find('li').removeClass("active");
                    currLink.parent().addClass("active");
                    if (history.state) {
                        if (history.state.id !== currLink.get(0).hash) {
                            history.replaceState({"id": currLink.get(0).hash}, null, currLink.get(0).hash);
                        }
                    } else {
                        history.pushState({"id": currLink.get(0).hash}, null, currLink.get(0).hash);
                    }
                }
            }
        });
    };

})(window.jQuery, window, document);
