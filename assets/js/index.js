/**
 * Main JS file for Casper behaviours
 */

/* globals jQuery, document */
(function ($, sr, undefined) {
    "use strict";

    var $document = $(document),

        // debouncing function from John Hann
        // http://unscriptable.com/index.php/2009/03/20/debouncing-javascript-methods/
        debounce = function (func, threshold, execAsap) {
            var timeout;

            return function debounced () {
                var obj = this, args = arguments;
                function delayed () {
                    if (!execAsap) {
                        func.apply(obj, args);
                    }
                    timeout = null;
                }

                if (timeout) {
                    clearTimeout(timeout);
                } else if (execAsap) {
                    func.apply(obj, args);
                }

                timeout = setTimeout(delayed, threshold || 100);
            };
        },
        menuToggle = function (){
            $('body').toggleClass('open-nav');
            $('.tag-nav').css('top', $document.scrollTop());
            $('.open-nav-btn i').toggleClass('icon-close');
            $('.open-nav-btn i').toggleClass('icon-menu');
        }

    $document.ready(function () {

        $('.scroll-down').arctic_scroll();

        $('.main-header').loopGallery();

        $('.post-grid img').unveil(400);

        $('.open-nav-btn').bind('click', function (e){
            menuToggle();

            e.stopPropagation();
        });
        $document.bind('click', function(){
            if(this.body.classList.contains('open-nav')) {
                menuToggle();
            }
        })
    });

    $.fn.loopGallery = function () {
        var container = $(this),
            firstPhoto = container.find('figure').first(),
            onStage = firstPhoto,
            onStageClass = 'on-stage',
            images = container.find('img'),


            galleryReady = function (){
                window.setInterval( function (){
                    loopCallback(onStage.next())
                }, 10000);

                loopCallback(firstPhoto);
            },

            loopCallback = function (figure){

                onStage.removeClass(onStageClass);

                if (!figure.length) {
                    onStage = firstPhoto;
                } else {
                    onStage = figure;
                }

                onStage.addClass(onStageClass);
            },

            maxOutDimensions = function (){
                var containerHeight = container.outerHeight(),
                    containerWidth = container.outerWidth(),
                    containerRatio = containerWidth / containerHeight,
                    imgRatio = this.width / this.height,
                    scaledImgWidth = containerHeight * imgRatio;

                if(containerRatio < imgRatio) {
                    this.classList.add('full-height');
                } else if(scaledImgWidth > containerWidth){
                    this.classList.add('full-height');
                } else {
                    this.classList.add('full-width');
                }
            },
            loadedHelper = function (img, callback){
                if(img.complete) {
                    callback.call(img);
                } else {
                    img.addEventListener('load', callback);
                }
            };

        images.each(function (){
            loadedHelper(this, maxOutDimensions);
        });

        if(images.length > 1) {
            loadedHelper(firstPhoto.find('img')[0], galleryReady);
        }
    };

    // smartresize
    jQuery.fn[sr] = function(fn) { return fn ? this.bind('resize', debounce(fn)) : this.trigger(sr); };

    // Arctic Scroll by Paul Adam Davis
    // https://github.com/PaulAdamDavis/Arctic-Scroll
    $.fn.arctic_scroll = function (options) {

        var defaults = {
            elem: $(this),
            speed: 500
        },

        allOptions = $.extend(defaults, options);

        allOptions.elem.click(function (event) {
            event.preventDefault();
            var $this = $(this),
                $htmlBody = $('html, body'),
                offset = ($this.attr('data-offset')) ? $this.attr('data-offset') : false,
                position = ($this.attr('data-position')) ? $this.attr('data-position') : false,
                toMove;

            if (offset) {
                toMove = parseInt(offset);
                $htmlBody.stop(true, false).animate({scrollTop: ($(this.hash).offset().top + toMove) }, allOptions.speed);
            } else if (position) {
                toMove = parseInt(position);
                $htmlBody.stop(true, false).animate({scrollTop: toMove }, allOptions.speed);
            } else {
                $htmlBody.stop(true, false).animate({scrollTop: ($(this.hash).offset().top) }, allOptions.speed);
            }
        });

    };
})(jQuery, 'smartresize');
