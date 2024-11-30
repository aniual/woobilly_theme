(function ($) {
    var $body = $('body'),
        $doc = $(document),
        $html = $('html'),
        $win = $(window);

    $doc.ready(() => {
        $doc.ajaxStart(() => {
            halo.isAjaxLoading = true;
        });

        $doc.ajaxStop(() => {
            halo.isAjaxLoading = false;
        });

        halo.ready();
    });

    window.onload = function() { 
        halo.init();
    }

    var halo = {
        haloTimeout: null,
        isAjaxLoading: false,

        ready: function (){
            this.loaderScript();
            this.loaderProductBlock();
            
            if (navigator.userAgent.match(/Mac OS X.*(?:Safari|Chrome)/) && ! navigator.userAgent.match(/Chrome/)) {
                document.body.classList.add('safari')
            } else {
                document.body.classList.add('chrome')
            }

            const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
            if (isIOS) document.body.classList.add('iOS')

            if($body.hasClass('template-product')) {
                this.loaderRecommendationsBlock();
                this.scrollToReview();
            }

            if($('[data-product-tab-block]').length) {
                this.clickedActiveProductTabs();
            }

            if ($body.hasClass('product-card-layout-07')) {
                this.calculateTranslateYHeight()
            }
            
            window.sharedFunctions = {
                setLocalStorageProductForWishlist: this.setLocalStorageProductForWishlist,
                checkNeedToConvertCurrency: this.checkNeedToConvertCurrency,
                productBlockSilder: this.productBlockSilder,    
                productBlockScroller: this.productBlockScroller,
                calculateTranslateYHeight: this.calculateTranslateYHeight,
                productCountdownCard: halo.productCountdownCard,
            }
        },
        
        init: function () {
            this.initMultiTab();
            this.initMultiTabMobile();
            this.productBlockInfiniteScroll();
            this.initGlobalCheckbox();
            this.initColorSwatch();
            this.initAddToCart();
            this.initQuickShop();
            this.initQuickCart();
            this.initNotifyInStock();
            this.initCompareProduct();
            this.initWishlist();
            this.initAskAnExpert();
            this.initHeader();
            this.headerLanguageCurrency();
            this.headerMasonry();
            this.initLiveChat();
            this.headerSidebarSearch();
            this.headerStickySearchForm();
            this.initCountdown();
            this.collectionCountdown();
            this.handleScrollDown();
            this.initVideoPopup();
            this.swapHoverVideoProductCard();
            this.initDynamicBrowserTabTitle();
            this.initWarningPopup();
            this.clickIconScrollSection();
            this.specialBanner();
            this.formMessage();
            this.typingAnimation();
            this.spotlightproductSlider();

            if ($('.lookbook-carousel').length) {
                this.lookbookCarousel();
            }

            // Init Quick View 
            if (window.quick_view.show || window.quick_view.show_mb) {
                this.initQuickView();
            }

            // Init Mobile Menu 
            if (window.innerWidth < 1025) {
                this.menuSidebarMobile();
                this.menuSidebarMobileToggle();
            }

            // Check Lazyload Done
            const loadingImages = document.querySelectorAll('.media--loading-effect img')
            const productGrid = document.getElementById('main-collection-product-grid')

            if (loadingImages.length > 0 || productGrid) {
                this.initLazyloadObserver(loadingImages, productGrid);
            }

            if($body.hasClass('show_effect_close')) {
                this.backgroundOverlayHoverEffect();
                this.backgroundOverlayHoverEffect1();
            }

            if (window.innerWidth > 1024) {
                this.productMenuSlider();
            }

            if($body.hasClass('template-cart')) {
                this.updateGiftWrapper();
            }
            
            if($body.hasClass('template-product') || $('.product-details').hasClass('featured-product')) {
                this.initProductView($('.halo-productView'));
                this.initProductBundle();
                this.articleGallery();
                this.toggleSidebarMobile(); 
                this.initCollapseSidebarBlock();    
                this.initCategoryActive();
                this.initProductReviewSection();
                this.productCustomInformation();
                this.iconZoomClickMobile();
                this.productBlockSilderSidebar();
            }

            if($body.hasClass('template-blog') || $body.hasClass('template-article')) {
                this.initCollapseSidebarBlock();
                this.initCategoryActive();
                this.toggleSidebarMobile();
                this.initBlogMasonry();
                this.productBlockSilderSidebar();
                this.productBlockSilderArticle();
            }

            if($body.hasClass('template-article')) {
                this.articleGallery();
            }

            if($body.hasClass('template-collection') || $body.hasClass('template-search')) {
                this.initCollapseSidebarBlock();
                this.initCategoryActive();
                this.toggleSidebarMobile();
                this.productBlockSilderSidebar();
                this.initInfiniteScrolling();
                this.initQuickShopProductList();
            }

            if($body.hasClass('template-list-collections')) {
                this.toggleSidebarMobile();
                this.productBlockSilderSidebar();
            }

            if($body.hasClass('template-collection') && $('.collection-express-order').length) {
                this.toggleVariantsForExpressOrder();
                this.initExpressOrderAddToCart();
            }

            if($body.hasClass('product-card-layout-08')) {
                halo.productCountdownCard();
            }
            
            halo.checkScrollLayoutForRecenlyViewed();
            

            let checkMenuMobile;
            window.innerWidth > 1024 ? checkMenuMobile = true : checkMenuMobile = false;

            $win.on('resize', () => {
                this.headerSidebarSearch();
                this.specialBanner();
                this.specialBannerSlider();
                this.unsymmetricalSlider();
                if (window.innerWidth > 1024) {
                    document.body.classList.remove('menu_open')
                } else if (checkMenuMobile) {
                    checkMenuMobile = false;
                    this.menuSidebarMobile()
                    this.menuSidebarMobileToggle()
                    this.initMultiTab()
                    this.initMultiTabMobile()
                }
            });
        },
        
        checkNeedToConvertCurrency: function () {
            return (window.show_multiple_currencies && typeof Currency != 'undefined' && Currency.currentCurrency != shopCurrency) || window.show_auto_currency;
        },

        loaderScript: function() {
            var load = function(){
                var script = $('[data-loader-script]');

                if (script.length > 0) {
                    script.each((index, element) => {
                        var $this = $(element),
                            link = $this.data('loader-script'),
                            top = element.getBoundingClientRect().top;

                        if (!$this.hasClass('is-load')){
                            if (top < window.innerHeight + 100) {
                                halo.buildScript(link);
                                $('[data-loader-script="' + link + '"]').addClass('is-load');
                            }
                        }
                    })
                }
            }
            
            load();
            window.addEventListener('scroll', load);
        },

        buildScript: function(name) {
            var loadScript = document.createElement("script");
            loadScript.src = name;
            document.body.appendChild(loadScript);
        },

        buildStyleSheet: function(name, $this) {
            if (name == '') return;
            const loadStyleSheet = document.createElement("link");
            loadStyleSheet.rel = 'stylesheet';
            loadStyleSheet.type = 'text/css';
            loadStyleSheet.href = name;
            $this.parentNode.insertBefore(loadStyleSheet, $this);
        },

        loaderProductBlock: function() {
            var isAjaxLoading = false;

            $doc.ajaxStart(() => {
                isAjaxLoading = true;
            });

            $doc.ajaxStop(() => {
                isAjaxLoading = false;
            });

            const handler = (entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const $block = $(entry.target);
                        if ($block.hasClass('ajax-loaded')) return;

                        var url = $block.data('collection'),
                            layout = $block.data('layout'),
                            limit = $block.data('limit'),
                            image_ratio = $block.data('image-ratio'),
                            swipe = $block.data('swipe'),
                            sectionId = $block.attr('sectionId'),
                            hasCountdown = $block.attr('hasCountdown');

                        if(url != null && url != undefined) {
                            $.ajax({
                                type: 'get',
                                url: window.routes.root + '/collections/' + url,
                                cache: false,
                                data: {
                                    view: 'ajax_product_block',
                                    constraint: 'limit=' + limit + '+layout=' + layout + '+sectionId=' + sectionId + '+imageRatio=' + image_ratio + '+swipe=' + swipe + '+hasCountdown=' + hasCountdown
                                },
                                beforeSend: function () {
                                    $block.addClass('ajax-loaded');
                                },
                                success: function (data) {
                                    if (url != '') {
                                        const res = halo.handleResponse($(data), 0, limit);
                                        if (layout == 'grid') {
                                            $block.find('.products-grid').html(res);
                                        } else if (layout == 'slider'){
                                            $block.find('.products-carousel').html(res);
                                        } else if (layout == 'scroll') {
                                            $block.find('.products-flex').html(res);
                                        }
                                       
                                        $block.find('.card-product .variants-popup-content .selector-wrapper .swatch-element').each(function() {
                                            const $input = $(this).find('input');
                                            const $label = $(this).find('label');

                                            $input.attr({
                                                id: ($input.attr('id') || '') + sectionId,
                                                name: ($input.attr('name') || '') + sectionId
                                            });
                                            $label.attr('for', ($label.attr('for') || '') + sectionId);
                                        });

                                        $block.find('.card-product').each(function() {
                                            const $qsForm = $(this).find('.variants-popup-content form');
                                            const $acForm = $(this).find('.card-action form');
                                            const $select = $(this).find('.variants-popup-content select');
                                            const $acButton = $(this).find('.card-action form button');
                                            const $qsButton = $(this).find('.variants-popup-content .product-card__button2 button');

                                            $qsForm.attr('id', ($qsForm.attr('id') || '') + sectionId);
                                            $acForm.attr('id', ($acForm.attr('id') || '') + sectionId);
                                            $select.attr('id', ($select.attr('id') || '') + sectionId);
                                            $acButton.attr('data-form-id', ($acButton.attr('data-form-id') || '') + sectionId);
                                            $qsButton.attr('data-form-id', ($qsButton.attr('data-form-id') || '') + sectionId);
                                        });

                                    }
                                },
                                complete: function () {
                                    if (layout == 'slider') {
                                        halo.productBlockSilder($block);
                                    }

                                    if (layout == 'scroll') {
                                        const enableHover = $block.find('[data-enable-hover]').attr('data-enable-hover')
                                        if (enableHover === 'true') {
                                            halo.productBlockScroller($block);
                                        }
                                    }

                                    if ($block.hasClass('special-banner__product') && layout == 'grid' && window.innerWidth < 1200) {
                                        $block.find('.special-banner__products--grid').addClass('products-carousel');
                                        halo.productBlockSilder($block);
                                    }

                                    if ($block.hasClass("halo-block-unsymmetrical") && layout == 'grid' && window.innerWidth < 1200) {
                                        halo.unsymmetricalSlider($block);
                                    }
                                    
                                    if(window.compare.show){
                                        var $compareLink = $('[data-compare-link]');

                                        halo.setLocalStorageProductForCompare($compareLink);
                                    }

                                    halo.swapHoverVideoProductCard();

                                    if(window.wishlist.show){
                                        halo.setLocalStorageProductForWishlist();
                                    }

                                    if (halo.checkNeedToConvertCurrency()) {
                                        Currency.convertAll(window.shop_currency, $('#currencies .active').attr('data-currency'), 'span.money', 'money_format');
                                    };

                                    if (window.review.show && $('.shopify-product-reviews-badge').length > 0 && window.SPR != null && typeof window.SPR.registerCallbacks === 'functions') {
                                        return window.SPR.registerCallbacks(), window.SPR.initRatingHandler(), window.SPR.initDomEls(), window.SPR.loadProducts(), window.SPR.loadBadges();
                                    }

                                    if ($('body').hasClass('cursor-fixed__show')){
                                        window.sharedFunctionsAnimation.onEnterButton();
                                        window.sharedFunctionsAnimation.onLeaveButton();
                                    }

                                    if($body.hasClass('product-card-layout-08')) {
                                        halo.productCountdownCard();
                                    }
                                }
                            });
                        } else {
                            $block.addClass('ajax-loaded');

                            if (layout == 'slider') {
                                halo.productBlockSilder($block);
                            }

                            if (halo.checkNeedToConvertCurrency()) {
                                Currency.convertAll(window.shop_currency, $('#currencies .active').attr('data-currency'), 'span.money', 'money_format');
                            };
                        }
                    }
                })
            }

            this.productBlock = document.querySelectorAll('[data-product-block]');

            const config = {
                rootMargin: '0px 0px 200px 0px',
            }

            this.observer = new IntersectionObserver(handler, config);
            this.productBlock.forEach(block => {
                this.observer.observe(block);
            });
        },

        handleResponse($res, productToShow, limit) {
            $res = $res.splice(productToShow, limit);
            return $res
        },

        loaderRecommendationsBlock: function(){
            halo.buildRecommendationBlock();
        },

        scrollToReview: function() {
            var $scope = $('.productView-tab');

            if($scope.length){
                $doc.on('click', '.productView-details .halo-productReview', (event)  => {
                    event.preventDefault();

                    $('body,html').animate({
                        scrollTop: $scope.offset().top 
                    }, 1000);
                    var activeTab = $scope.find('[href="#tab-review"]');
                    var activeTabCustom = $scope.find('[href="#tab-customer-reviews"]');
                    var activeTabMb = $scope.find('[href="#tab-review-mobile"]');
                    var activeTabCustomMb = $scope.find('[href="#tab-customer-reviews-mobile"]');
                    if (!activeTab.hasClass('is-open') || !activeTabMb.hasClass('is-open') || !activeTabCustom.hasClass('is-open') || !activeTabCustomMb.hasClass('is-open')) {
                        activeTab[0]?.click();
                        activeTabMb[0]?.click();
                        activeTabCustom[0]?.click();
                        activeTabCustomMb[0]?.click();
                    }
                })
            }
        },

        headerMasonry: function(){
            $('.menu-dropdown__wrapper [data-masonry]').masonry({
              columnWidth: '.grid-sizer',
              itemSelector: '[data-gridItem]'
            });
        },

        initLiveChat: function () {
            var $item_globe = $('.live-wrapper-icon');
            $item_globe.on('click', function (e) {
                $(this).parent().toggleClass('live_help--active');          
            });

            $body.on('click', function (e) {
                if(($('.live_help').hasClass('live_help--active')) && ($(event.target).closest('.live_help').length === 0)){
                    e.preventDefault();
                    $('.live_help').removeClass('live_help--active');
                }
            });
        },

        initHeader: function() {
            const headerAll = document.querySelectorAll('[class*="section-header"]')
            if (headerAll) {
                let index = headerAll.length + 20;
                headerAll.forEach((element) => {
                    if (element.classList.contains('section-header-mobile')) return;
                    element.setAttribute('data-index', index);
                    element.style.zIndex = index;
                    index--
                })

                const headerBasicTransparent = document.querySelector('.header-basic--transparent')
                if (headerBasicTransparent && document.body.classList.contains('template-index')) {
                    const height = headerBasicTransparent.offsetHeight,
                        navTransparent = document.querySelector('.header-navigation[class*="--transparent"]')
                    if (navTransparent) {
                        navTransparent.style.top = `${height}px`
                        navTransparent.classList.add('has-top')
                    }
                }
            }
        },

        headerLanguageCurrency: function() {
            if (!document.querySelector('.header-language_currency')) return;
            const header = document.querySelectorAll('[class*="section-header-"]')

            document.addEventListener('click', (event) => {
                const $target = event.target;
                const $headerLanguageCurrency = $target.closest('.header-language_currency');
                const languageCurrency = $headerLanguageCurrency?.querySelector('.top-language-currency');
                const dropdownCurrency = $headerLanguageCurrency?.querySelector('.dropdown-currency');
                const dropdownLanguage = $headerLanguageCurrency?.querySelector('.dropdown-language');

                if ($target.matches('.header-language_currency') || $target.closest('.header-language_currency')) {
                    if ($target.matches('.icon-languageCurrency') || $target.closest('.icon-languageCurrency')) {
                        languageCurrency?.classList.toggle('show')
                    }
                    else if (($target.matches('.top-language-currency') || $target.closest('.top-language-currency')) && !document.querySelector('.icon-languageCurrency')) {
                        languageCurrency?.classList.toggle('show')
                    }

                    if ($target.matches('.halo-top-currency') || $target.closest('.halo-top-currency')) {
                        dropdownLanguage?.classList.remove('show')
                        dropdownCurrency?.classList.toggle('show')
                    }
                    
                    if ($target.matches('.halo-top-language') || $target.closest('.halo-top-language')) {
                        dropdownCurrency?.classList.remove('show')
                        dropdownLanguage?.classList.toggle('show')
                    }

                    if ($target.matches('.dropdown-menu .dropdown-item')) {
                        dropdownCurrency?.classList.remove('show')
                        dropdownLanguage?.classList.remove('show')
                    }
                }
                else {
                    header.forEach(element => {
                        element.querySelector('.top-language-currency')?.classList.remove('show')
                        element.querySelector('.dropdown-currency')?.classList.remove('show')
                        element.querySelector('.dropdown-language')?.classList.remove('show')
                    })
                }
            })
        },

        headerSidebarSearch: function() {
            var headerSearchPC = $('.header-top .header__search .search_details'),
                headerSearchMB = $('#search-form-mobile .halo-sidebar-wrapper .search_details'),
                headerwraperSearchPC = $('.header-top .header__search'),
                headerwraperSearchMB = $('#search-form-mobile .halo-sidebar-wrapper'),
                searchDetails = $('.search_details'),
                predictiveSearchPC =  $('.header-top .header__search predictive-search'),
                predictiveSearchMB = $('#search-form-mobile .halo-sidebar-wrapper predictive-search');
 
             if (predictiveSearchPC.length === 0) predictiveSearchPC =  $('.header-top .header__search .search_details');
             if (predictiveSearchMB.length === 0) predictiveSearchMB =  $('#search-form-mobile .halo-sidebar-wrapper .search_details');
            if (window.innerWidth < 1025) {
                if($('.header').hasClass('header-01')){
                    predictiveSearchPC.appendTo(headerwraperSearchMB);
                }
                searchDetails.attr('open','true');
                $('[data-search-mobile]').on('click', (event) => {
                    event.preventDefault();
                    $('body').addClass('open_search_mobile');
                });
                $('[data-search-close-sidebar], .background-overlay').on('click', (event) => {
                    event.preventDefault();
                    $('body').removeClass('open_search_mobile');
                });
            }else{
                if($('.header').hasClass('header-01')){
                    predictiveSearchMB.appendTo(headerwraperSearchPC);
                }
                searchDetails.removeAttr('open');

                $('.search-modal__close-button').on('click', (event) => {
                    $('.search_details').removeAttr('open');
                    $('body').removeClass('open_search_menu');
                });

                // Click Search Icon On Header Nav And Sticky Menu
                $('[data-search-menu]').on('click', (event) => {
                    event.preventDefault();
                    $('body').addClass('open_search_menu');
                });
            }
        },

        headerStickySearchForm: function() {
            var iconSearchSlt = '[data-search-sticky-form]';
            var iconSearchMenu = '[data-search-menu-sticky-form] .icon-search';
            var iconSearchMenuCustom = '[data-search-menu-sticky-form] .icon-search-custom';

            if ($(window).width() > 1025) {
                $(document).off('click.toggleSearch', iconSearchSlt).on('click.toggleSearch', iconSearchSlt, function(event) {
                    event.preventDefault();
                    event.stopPropagation();
                    $('body').addClass('sticky-search-open');
                    $('.search_details').attr('open','true');
                });

                $(document).off('click.hideSearch').on('click.hideSearch', function(event) {
                    var formSearch = $('.search-modal__form'),
                        quickSearch = $('.quickSearchResultsWrap');
                    if ($('body').hasClass('sticky-search-open') && !formSearch.has(event.target).length && !quickSearch.has(event.target).length) {
                        $('body').removeClass('sticky-search-open');
                        $('[class*="section-header-"]').removeClass('sticky-search-menu-open');
                        $('.search_details').removeAttr('open');
                    }
                });

                // Click Search Icon On Header Nav And Sticky Menu
                $(document).off('click.toggleSearch', iconSearchMenu).on('click.toggleSearch', iconSearchMenu, function(event) {
                    event.preventDefault();
                    event.stopPropagation();
                    $(event.target).closest('[class*="section-header-"]').addClass('sticky-search-menu-open');
                    $(event.target).closest('.section-header-navigation').css('z-index', '101');
                    $('.search_details').attr('open','true');
                });

                // Click Search Icon On Header Hamburger - Search Dropdown Style Layout Custom
                $(document).off('click.toggleSearch', iconSearchMenuCustom).on('click.toggleSearch', iconSearchMenuCustom, function(event) {
                    $(event.target).closest('[class*="section-header-"]').addClass('sticky-search-menu-custom-open');
                });

                $(document).off('click.hideSearchSticky').on('click.hideSearchSticky', function(event) {
                    var formSearch = $('.header-navigation .search-modal__form'),
                        quickSearch = $('.header-navigation .quickSearchResultsWrap');
                    if ($('[class*="section-header-"]').hasClass('sticky-search-menu-open') && !formSearch.has(event.target).length && !quickSearch.has(event.target).length) {
                        const header = $(iconSearchMenu).closest('.section-header-navigation');
                        const index = header.data('index');

                        $('[class*="section-header-"]').removeClass('sticky-search-menu-open');
                        
                        header.css('z-index', index);
                        $('.header-navigation .search_details').removeAttr('open');
                        if(quickSearch.hasClass('is-show')) {
                            quickSearch.removeClass('is-show').addClass('hidden')
                        }
                    }
                    if (($(event.target).closest('.search-modal__content').length === 0)){
                        $('body').removeClass('open_search_menu');
                        $('[class*="section-header-"]').removeClass('sticky-search-menu-custom-open');
                    }
                });
            }
        },

        menuSidebarMobile: function() {
            var buttonIconOpen = $('.mobileMenu-toggle'),
                buttonClose = $('.halo-sidebar-close, .background-overlay');

            const menuSidebarMobileOpen = () => {
                $body.addClass('menu_open');
                $('.list-menu-loading').remove();
                if(window.mobile_menu == 'default'){
                    if(!$('#navigation-mobile .site-nav-mobile.nav .header__inline-menu').length){
                        $('.header .header__inline-menu').appendTo('#navigation-mobile .site-nav-mobile.nav');
                    }
                }
                if(!$('#navigation-mobile .site-nav-mobile.nav-account .free-shipping-text').length){
                    $('.header-top--wrapper .header-top--right .free-shipping-text').appendTo('#navigation-mobile .site-nav-mobile.nav-account .wrapper-links');
                }
                if(!$('#navigation-mobile .site-nav-mobile.nav-account .customer-service-text').length){
                    $('.header-top--wrapper .header-top--right .customer-service-text').appendTo('#navigation-mobile .site-nav-mobile.nav-account .wrapper-links');
                }
                if(!$('#navigation-mobile .site-nav-mobile.nav-account .header__location').length){
                    $('.header-top--wrapper .header-top--right .header__location').appendTo('#navigation-mobile .site-nav-mobile.nav-account .wrapper-links');
                }
                if(!$('#navigation-mobile .top-language-currency').length){
                    if($('.header').hasClass('header-03')){
                        $('.header .header-bottom-right .top-language-currency').appendTo('#navigation-mobile .site-nav-mobile.nav-currency-language');
                    }else if($('.header').hasClass('header-05')){
                        $('.header .header-top--left .top-language-currency').appendTo('#navigation-mobile .site-nav-mobile.nav-currency-language');
                    }else{
                        $('.header .header-language_currency .top-language-currency').appendTo('#navigation-mobile .site-nav-mobile.nav-currency-language');
                    }
                }
                halo.productMenuSlider();
            }

            if (document.body.matches('.menu_open')) {
                menuSidebarMobileOpen();
            }

            buttonIconOpen.off('click.toggleCurrencyLanguage').on('click.toggleCurrencyLanguage', (event) =>{
                event.preventDefault();
                menuSidebarMobileOpen();
            });

            buttonClose.off('click.toggleCloseCurrencyLanguage').on('click.toggleCloseCurrencyLanguage', () =>{
                $body.removeClass('menu_open');
                $('#navigation-mobile').off('transitionend.toggleCloseMenu').on('transitionend.toggleCloseMenu', () => {
                    if (!$body.hasClass('menu_open')) {

                        if(!$('.header .header__inline-menu').length){
                            if($('.header').hasClass('header-03') || $('.header').hasClass('header-04') || $('.header').hasClass('header-07') || $('.header').hasClass('header-08')){
                                $('#navigation-mobile .site-nav-mobile.nav .header__inline-menu').appendTo('.header .header-bottom--wrapper .header-bottom-left');
                            }else{
                                $('#navigation-mobile .site-nav-mobile.nav .header__inline-menu').appendTo('.header .header-bottom--wrapper');
                            }
                        }
                        if(!$('.header-top--wrapper .header-top--right .free-shipping-text').length){
                            if(!$('.header-04').hasClass('style_2')){
                                $('#navigation-mobile .site-nav-mobile.nav-account .free-shipping-text').insertBefore('.header-top--wrapper .header-top--right .header__group');
                            }
                        }
                        if(!$('.header-top--wrapper .header-top--right .header__location').length){
                            $('#navigation-mobile .site-nav-mobile.nav-account .header__location').insertBefore('.header-top--wrapper .header-top--right .header__group');
                        }
                        if(!$('.header-top--wrapper .header-top--right .customer-service-text').length){
                            if($('.header').hasClass('header-03')){
                                $('#navigation-mobile .site-nav-mobile.nav-account .customer-service-text').insertBefore('.header-top--wrapper .header-top--right .header__group .header__icon--wishlist');
                            }else{
                                $('#navigation-mobile .site-nav-mobile.nav-account .customer-service-text').insertBefore('.header-top--wrapper .header-top--right .top-language-currency');
                            }
                        }
                        if(!$('.header-language_currency .top-language-currency').length){
                            if($('.header').hasClass('header-03')){
                                $('#navigation-mobile .site-nav-mobile .top-language-currency').appendTo('.header .header-bottom--wrapper .header-bottom-right .header-language_currency');
                            }else if($('.header').hasClass('header-04')){
                                $('#navigation-mobile .site-nav-mobile .top-language-currency').appendTo('.header .header-bottom--wrapper .header-bottom-right .header-language_currency');
                            }else if($('.header').hasClass('header-05')){
                                $('#navigation-mobile .site-nav-mobile .top-language-currency').appendTo('.header .header-top--wrapper .header-top--left .header-language_currency');
                            }else{
                                $('#navigation-mobile .site-nav-mobile .top-language-currency').insertBefore('.header .header-language_currency .header__search');
                            }
                        }
                    }
                })
                    
            });

            $doc.on('click', '.halo-sidebar-close', function (e) {
                e.preventDefault();
                e.stopPropagation();
                $body.removeClass('menu_open');
            });
        },

        menuSidebarMobileToggle: function() {
            $body.on('click', '.site-nav-mobile .list-menu .menu_mobile_link', function (e) {
                if(!e.currentTarget.classList.contains('list-menu__item--end')){
                    e.preventDefault();
                    e.stopPropagation();
                    var $target = $(this);
                    var $parent = $target.parent();
                    var $menuDislosure1 = $target.parent().find('ul.list-menu--disclosure-1');
                    var $submenu = $target.parent().find('ul.list-menu--disclosure-mobile-1');

                    // 动态添加一个新的 class
                    $submenu.addClass('custom-menu-class'); // 新增 class 名

                    // 控制显示或隐藏子菜单
                    if ($submenu.is(':visible')) {
                        $submenu.slideUp().removeClass('custom-menu-class');  // 隐藏并移除类
                    } else {
                        $submenu.slideDown().addClass('custom-menu-class');  // 展开并添加类
                        $parent.siblings().find('ul.list-menu--disclosure-1').slideUp().removeClass('custom-menu-class'); // 隐藏其他兄弟菜单的子菜单
                    }

                    // $parent.removeClass('is-hidden').addClass('is-open').removeClass('d-none');
                    // $menuDislosure1.off('transitionend.toggleMenuLink1').on('transitionend.toggleMenuLink1', () => {
                    //     if ($parent.hasClass('is-open') && !$parent.hasClass('is-hidden') && !$parent.hasClass('d-none')) {
                    //         // $parent.addClass('d-none')
                    //         $parent.siblings().removeClass('is-open').addClass('is-hidden').removeClass('d-none');
                    //     }
                    // })

                    // $target.parent().siblings().removeClass('is-open').addClass('is-hidden');
                    // $target.parent().removeClass('is-hidden').addClass('is-open');
                }
            });

            $body.on('click', '.site-nav-mobile .list-menu .menu_mobile_link_2', function (e) {
                e.preventDefault();
                e.stopPropagation();
                var $target = $(this);
                var $target = $(this);
                var $parent = $target.parent().parent();
                var $menuDislosure2 = $target.parent().find('ul.list-menu--disclosure-2');
                var $parentToScroll = $target.parent().parent().parent().parent().parent().parent();

                $parent.removeClass('is-hidden').addClass('is-open').removeClass('d-none');
                $menuDislosure2.off('transitionend.toggleMenuLink2').on('transitionend.toggleMenuLink2', () => {
                    if ($parent.hasClass('is-open') && !$parent.hasClass('is-hidden') && !$parent.hasClass('d-none')) {
                        $parent.addClass('d-none')
                        $parent.siblings().removeClass('is-open').addClass('is-hidden').removeClass('d-none');
                        $parentToScroll.animate({
                            scrollTop: 0
                        }, 0);
                    }
                })

                // if($('.header').hasClass('header-04') || $('.header').hasClass('header-01') || $('.header').hasClass('header-02')){
                    // $target.parent().parent().siblings().removeClass('is-open').addClass('is-hidden');
                    // $target.parent().parent().removeClass('is-hidden').addClass('is-open');
                    // $target.parent().parent().parent().parent().parent().parent().animate({
                    //     scrollTop: 0
                    // }, 0);
                // } else{
                //     $target.parents('.site-nav').siblings().removeClass('is-open').addClass('is-hidden');
                //     $target.parents('.site-nav').removeClass('is-hidden').addClass('is-open');
                //     $target.parents('.menu-dropdown__wrapper').animate({
                //         scrollTop: 0
                //     }, 0);
                // }

                if($('.menu-dropdown').hasClass('megamenu_style_5') || $('.menu-dropdown').hasClass('megamenu_style_4') || $('.menu-dropdown').hasClass('megamenu_style_3') || $('.menu-dropdown').hasClass('megamenu_style_2') || $('.menu-dropdown').hasClass('megamenu_style_1')){
                    $target.parents('.menu-dropdown').animate({
                        scrollTop: 0
                    }, 0);
                }

                $target.parents('.menu-dropdown').addClass('is-overflow');
            });

            $body.on('click', '.nav-title-mobile', function (e) {
                e.preventDefault();
                e.stopPropagation();
                var $target = $(this),
                    $parentLv1 = $target.parent().parent().parent().parent('.is-open'),
                    $parentLv2 = $target.parent().parent().parent('.is-open'),
                    $parentLv3 = $target.parent().parent('.is-open');

                $parentLv1.siblings().removeClass('is-hidden');
                $parentLv1.removeClass('is-open').removeClass('d-none');
                $parentLv2.siblings().removeClass('is-hidden');
                $parentLv2.removeClass('is-open').removeClass('d-none');
                $parentLv3.siblings().removeClass('is-hidden');
                $parentLv3.removeClass('is-open').removeClass('d-none');
                $('.menu-dropdown').removeClass('is-overflow');
            });

            if(window.mobile_menu != 'default'){
                $doc.on('click', '[data-mobile-menu-tab]', (event) => {
                    event.preventDefault();
                    event.stopPropagation();

                    var tabItem = event.currentTarget.closest('li'),
                        tabTarget = event.currentTarget.dataset.target;

                    if(!tabItem.classList.contains('is-active')){

                        document.querySelector('[data-navigation-tab-mobile]').querySelectorAll('li').forEach((element) =>{
                            if(element != tabItem){
                                element.classList.remove('is-active');
                            } else {
                                element.classList.add('is-active');

                                document.querySelectorAll('[id^="MenuMobileListSection-"]').forEach((tab) =>{
                                    if(tab.getAttribute('id') == tabTarget) {
                                        tab.classList.remove('is-hidden');
                                        tab.classList.add('is-visible');
                                    } else {
                                        tab.classList.remove('is-visible');
                                        tab.classList.add('is-hidden');
                                    }
                                });
                            }
                        });
                    }
                });
            };

            $(document).on('click', '[data-navigation-mobile] .no-megamenu .menu-lv-1__action', (event) => {
                const hash = $(event.currentTarget).attr('href').split('#')[1];

                if (hash != undefined && hash != '' && $(`#${hash}`).length) {
                    $('body').removeClass('menu_open');
                    $('html, body').animate({
                        scrollTop: $(`#${hash}`).offset().top
                    }, 700);
                }
            })
        },

        setCookie(cname, cvalue, exdays){
            const d = new Date();
            d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
            const expires = 'expires=' + d.toUTCString();
            document.cookie = cname + '=' + cvalue + ';' + expires + ';path=/';
        },

        initMultiTab: function() {
            let designMode, showMenu, check = true;
            document.body.matches('.shopify-design-mode') ? designMode = true : designMode = false;
            document.body.matches('.menu_open') ? showMenu = true : showMenu = false;
                
            const loadMenuDefault = () => {
                if (check) {
                    check = false;
                    halo.initMobileMenuDefault(url)
                }
            }

            const loadMenuTab = () => {
                if (check) {
                    check = false;
                    halo.initMultiTabMobile()
                }
            }
            
            if($('[data-menu-tab]').length > 0){
                
                var active = $('[data-menu-tab] li.is-active').data('load-page'),
                    url = window.routes.root + `/search?type=product&q=${active}&view=ajax_mega_menu`;
              
                if($body.hasClass('template-index')){
                    if ($win.width() < 1025) {
                        if(window.mobile_menu == 'default'){
                            window.addEventListener('load', () => {
                                if (designMode || showMenu) {
                                    loadMenuDefault();
                                }
                                else {
                                    document.body.addEventListener('click', () => {
                                        loadMenuDefault();
                                    }, false)
                                }
                            }, false)
                        } else {
                            window.addEventListener('load', () => {
                                if (designMode || showMenu) {
                                    loadMenuTab();
                                }
                                else {
                                    document.body.addEventListener('click', () => {
                                        loadMenuTab();
                                    }, false)
                                }
                            }, false)
                        }
                    }
                } else {
                    if ($win.width() < 1025) {
                        if(window.mobile_menu == 'default'){
                            window.addEventListener('load', () => {
                                if (designMode || showMenu) {
                                    loadMenuDefault();
                                }
                                else {
                                    document.body.addEventListener('click', () => {
                                        loadMenuDefault();
                                    }, false)
                                }
                             }, false)
                        } else {
                            window.addEventListener('load', () => {
                                if (designMode || showMenu) {
                                    loadMenuTab();
                                }
                                else {
                                    document.body.addEventListener('click', () => {
                                        loadMenuTab();
                                    }, false)
                                }
                            }, false)
                        }
                    }
                }
            } else {
                var url = window.routes.root + '/search?view=ajax_mega_menu';

                if ($win.width() < 1025) {
                    if (window.mobile_menu == "default") {
                        if (designMode || showMenu) {
                            loadMenuDefault();
                        }
                        else {
                            document.body.addEventListener("click",() => {
                                loadMenuDefault();
                            }, false)
                        }
                    } else {
                        window.addEventListener("load",() => {
                            if (designMode || showMenu) {
                                loadMenuTab();
                            }
                            else {
                                document.body.addEventListener("click",() => {
                                    loadMenuTab();
                                }, false)
                            }
                        }, false)
                    }
                }
            }
        },

        initMobileMenuDefault: function(url) {
            const menuMobile = $('[data-navigation-mobile]');
            const nav = $('#HeaderNavigation [data-navigation]');
            const style = nav.attr('style') != undefined ? nav.attr('style') : nav.closest('#HeaderNavigation').attr('style');
            $('.list-menu-loading').remove();
            menuMobile.append(`<nav class="header__inline-menu" data-navigation role="navigation" style="${style != undefined ? style : ''}">${nav.html() != undefined ? nav.html() : ''}</nav>`);

            const topLanCur = $('.top-language-currency');
            const lanCurMobile = $('#navigation-mobile .nav-currency-language');
            if (lanCurMobile.text().trim() == '' && topLanCur.length > 0) lanCurMobile.append(`<div class="top-language-currency">${topLanCur.html()}</div>`)

            // Menu Mobile Tab on Header Vertical
            const menuVertical = document.querySelector('.header-nav-vertical-menu .vertical-menu .header__menu-vertical')
            if(menuVertical){
              document.querySelector('.halo-sidebar.halo-sidebar_menu').classList.add('has-menu-vertical')

              const menuVerticalTitle = document.querySelector('.header-nav-vertical-menu .vertical-menu .categories-title__button .title').innerHTML
              const navMobile =  document.querySelector('.site-nav-mobile.nav')
              const navMobileTitle =  navMobile.querySelector('.menu-heading-mobile')
              const span = document.createElement('span')
              span.classList.add('title')
              span.innerHTML = menuVerticalTitle;
              navMobileTitle.appendChild(span);
              navMobile.appendChild(menuVertical);
            
              const menuVerticalNav = document.querySelector('.site-nav-mobile.nav .header__menu-vertical')
              menuVerticalNav.classList.add('header__inline-menu')
            
              const tabTitle = document.querySelectorAll('.site-nav-mobile.nav .menu-heading-mobile .title')
              const mobileMenu = document.querySelectorAll('.site-nav-mobile.nav .header__inline-menu')
              tabTitle[0].classList.add('is-active')
              mobileMenu[0].classList.add('is-active')
              
              tabTitle.forEach((item,index) => {
                item.addEventListener('click', ()=> {
                  tabTitle.forEach(e => e.classList.remove('is-active'))
                  item.classList.add('is-active')
                  mobileMenu.forEach(e => e.classList.remove('is-active'))
                  mobileMenu[index].classList.add('is-active')
                })
              })
            }
        },

        initMultiTabMobile: function() {
            if ($win.width() < 1025) {
                if(window.mobile_menu == 'custom'){
                    var chk = true,
                        menuElement = $('[data-section-type="menu"]'),
                        menuMobile = $('[data-navigation-mobile]'),
                        menuTabMobile = $('[data-navigation-tab-mobile]');

                    const loadMenu = () => {
                        if (chk) {
                            chk = false;
                            const content = document.createElement('div');
                            const tab = document.createElement('ul');
                            
                            Object.assign(tab, {
                                className: 'menu-tab list-unstyled'
                            });
                            
                            tab.setAttribute('role', 'menu');
                            
                            menuElement.each((index, element) => {
                                var currentMenu = element.querySelector('template').content.firstElementChild.cloneNode(true);
                                
                                if(index == 0){
                                    currentMenu.classList.add('is-visible'); 
                                } else {
                                    currentMenu.classList.add('is-hidden');
                                }
                                
                                content.appendChild(currentMenu);
                            });

                            content.querySelectorAll('[id^="MenuMobileListSection-"]').forEach((element, index) => {
                                var tabTitle = element.dataset.heading,
                                    tabId = element.getAttribute('id'),
                                    tabElement = document.createElement('li');

                                Object.assign(tabElement, {
                                    className: 'item'
                                });

                                tabElement.setAttribute('role', 'menuitem');

                                if (index == 0) {
                                    tabElement.classList.add('is-active');
                                }

                                tabElement.innerHTML = `<a class="link" href="#" data-mobile-menu-tab data-target="${tabId}">${tabTitle}</a>`;

                                tab.appendChild(tabElement);
                            });

                            $('.list-menu-loading').remove();
                            menuTabMobile.html(tab);
                            menuMobile.html(content.innerHTML);
                        }

                    }

                    if ($('.header-nav-plain .header-language_currency').length > 0){
                        const topLanCur = $('.top-language-currency');
                        const lanCurMobile = $('#navigation-mobile .nav-currency-language');
                        if (lanCurMobile.text().trim() == '' && topLanCur.length > 0) lanCurMobile.append(`<div class="top-language-currency">${topLanCur.html()}</div>`)
                    }

                    if (document.body.matches('.menu_open')) {
                        loadMenu();
                    }

                    document.body.addEventListener('click', () => {
                        loadMenu();
                    }, false);
                }
            }
        },

        initMenu: function(url) {
            if(!$('.header').hasClass('header-04')){
                fetch(url)
                    .then(response => response.text())
                    .then(text => {
                        const html = document.createElement('div');
                        html.innerHTML = text;
                        const navigation = html.querySelector('#HeaderNavigation');
                        if (navigation && navigation.innerHTML.trim().length) {
                            document.querySelector('#HeaderNavigation').innerHTML = navigation.innerHTML;
                        }
                    })
                    .catch(e => {
                        console.error(e);
                    });
            }
        },
        
        clickedActiveProductTabs: function() {
            const handler = (entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const $block = $(entry.target);
                        if ($block.hasClass('ajax-loaded')) return;

                        var listTabs = $block.find('.list-product-tabs'),
                            tabLink = listTabs.find('[data-product-tabTop]'),
                            tabContent = $block.find('[data-product-TabContent]'),
                            limit = $block.data('limit');

                        var linkActive = listTabs.find('.tab-links.active'),
                            activeTab = $block.find('.product-tabs-content .tab-content.active');
                            
                        if (!$block.hasClass('ajax-loaded')) {
                            halo.doAjaxProductTabs(
                                linkActive.data('href'), 
                                activeTab.find('.loading'), 
                                activeTab.find('.products-load'), 
                                $block.attr('sectionid'), 
                                limit,
                                $block
                            );
                        }
                        
                        tabLink.off('click').on('click', function (e) {
                            e.preventDefault();
                            e.stopPropagation();

                            if (!$(this).hasClass('active')) {
                                const curTab = $(this),
                                    curTabContent = $(curTab.data('target'));

                                tabLink.removeClass('active');
                                tabContent.removeClass('active');

                                if (!curTabContent.hasClass('loaded')) halo.doAjaxProductTabs(curTab.data('href'), curTabContent.find('.loading'), curTabContent.find('.products-load'), $block.attr('sectionid'), limit);
                                
                                curTab.addClass('active');
                                curTabContent.addClass('active');
                                curTabContent.find('.slick-slider').slick('refresh');
                            };
                        });
                    }
                })
            }

            this.productBlock = document.querySelectorAll('[data-product-tab-block]');

            const config = {
                threshold: 0.1,
            }

            this.observer = new IntersectionObserver(handler, config);
            this.productBlock.forEach(block => {
                this.observer.observe(block);
            });
        },

        doAjaxProductTabs: function (handle, loadingElm, curTabContent, sectionId, limit, self) {
            $.ajax({
                type: "get",
                url: handle,
                data: {
                    constraint: `sectionId=${handle}+limit=${limit}`
                },

                beforeSend: function () {
                    if (self != undefined) self.addClass('ajax-loaded');
                },

                success: function (data) {
                    curTabContent.parent().addClass('loaded');
                    if (handle == '?view=ajax_product_block') return;
                    
                    if ($(data).text().trim() === '') {
                        noProduct(curTabContent);
                    }
                    else {
                        const res = halo.handleResponse($(data), 0, limit);
                        curTabContent.html(res);

                        if(window.wishlist.show){
                            halo.setLocalStorageProductForWishlist();
                        }

                        if (halo.checkNeedToConvertCurrency()) {
                            Currency.convertAll(window.shop_currency, $('#currencies .active').attr('data-currency'), 'span.money', 'money_format');
                        };
                    }
                },
                complete: function () {
                    if (curTabContent.hasClass('products-carousel')) {
                        halo.productBlockSilder(curTabContent.parent());
                    }
                    else if (curTabContent.hasClass('products-cursor') && curTabContent.data('enable-hover') === 'true') {
                        halo.productBlockScroller(curTabContent);
                    }

                    if (window.review.show && $('.shopify-product-reviews-badge').length > 0 && window.SPR != null && typeof window.SPR.registerCallbacks === 'functions') {
                        return window.SPR.registerCallbacks(), window.SPR.initRatingHandler(), window.SPR.initDomEls(), window.SPR.loadProducts(), window.SPR.loadBadges();
                    }

                    if ($('body').hasClass('cursor-fixed__show')){
                        window.sharedFunctionsAnimation.onEnterButton();
                        window.sharedFunctionsAnimation.onLeaveButton();
                    }
                },
                error: function (xhr, text) {
                    noProduct(curTabContent);
                }
            });
            
            const noProduct = (curTabContent) => {
                curTabContent.html(`<p class="loading center">Sorry, there are no products in this collection</p>`);
            }
        },
        lookbookCarousel: function() {
            var lookbookCarousel = $('.lookbook-carousel'),
                itemToShow = lookbookCarousel.data('item-to-show'),
                itemDots = lookbookCarousel.data('item-dots'),
                itemDotsMb = lookbookCarousel.data('item-dots-mb'),
                itemArrows = lookbookCarousel.data('item-arrows'),
                itemArrowsMb = lookbookCarousel.data('item-arrows-mb');

            if(lookbookCarousel.length > 0) {
                if(lookbookCarousel.not('.slick-initialized')) {
                    lookbookCarousel.slick({
                        mobileFirst: true,
                        adaptiveHeight: true,
                        vertical: false,
                        infinite: true,
                        slidesToShow: itemToShow,
                        slidesToScroll: itemToShow,
                        arrows: itemArrowsMb,
                        dots: itemDotsMb,
                        autoplay: false,
                        nextArrow: window.arrows.icon_next,
                        prevArrow: window.arrows.icon_prev,
                        rtl: window.rtl_slick,
                        responsive: 
                        [
                            {
                                breakpoint: 1024,
                                settings: {
                                    arrows: itemArrows,
                                    dots: itemDots
                                }
                            }
                        ]
                    });
                }
            }

            if (lookbookCarousel.hasClass('enable_counter_number')) {
                var slickNext = lookbookCarousel.find('.slick-next');
                lookbookCarousel.closest('.special-banner__item--lookbook_banner').find('.products-counter-number').appendTo(slickNext);
                lookbookCarousel.on('afterChange', (event) => {
                    var slickIndex = lookbookCarousel.find('.slick-current').data('slick-index');
                    lookbookCarousel.find("#count-image").text(slickIndex + 1);
                });
            }

            if ($('body').hasClass('cursor-fixed__show')){
                window.sharedFunctionsAnimation.onEnterButton();
                window.sharedFunctionsAnimation.onLeaveButton();
            }
        },
        productBlockSilder: function(wrapper) {
            var productGrid = wrapper.find('.products-carousel'),
                itemToShow = productGrid.data('item-to-show'),
                itemDots = productGrid.data('item-dots'),
                itemDotsMb = productGrid.data('item-dots-mb'),
                itemArrows = productGrid.data('item-arrows'),
                itemArrowsMb = productGrid.data('item-arrows-mb'),
                itemInfinite = productGrid.data('infinite'),
                isProductCard06 = document.body.classList.contains('product-card-layout-06');

            if(productGrid.length > 0) {
                if(productGrid.hasClass('slick-initialized')) return;
                if(productGrid.not('.slick-initialized')) {
                    if (isProductCard06) {
                        productGrid.on('init', () => {
                            const selectOptionsHeight = productGrid.find('.product .card-action').eq(0).height();
                            productGrid.find('.slick-list').css('padding-bottom', selectOptionsHeight + 'px');
                            productGrid.attr('data-slider-padding-bottom', selectOptionsHeight)
                        })
                    }

                    if (productGrid.hasClass('enable_progress_bar')) {
                        var progressBar = wrapper.find('.scrollbar-thumb');
                        productGrid.on('init', (event, slick) => {
                            var percent = ((slick.currentSlide / (slick.slideCount - 1)) * 100) + '%';
                            progressBar.css('--percent', percent);
                        });
                    }
                  
                    productGrid.slick({
                        mobileFirst: true,
                        adaptiveHeight: true,
                        vertical: false,
                        infinite: itemInfinite,
                        slidesToShow: 1,
                        slidesToScroll: 1,
                        arrows: itemArrowsMb,
                        dots: itemDotsMb,
                        nextArrow: window.arrows.icon_next,
                        prevArrow: window.arrows.icon_prev,
                        rtl: window.rtl_slick,
                        responsive: 
                        [
                            {
                                breakpoint: 1599,
                                settings: {
                                    arrows: itemArrows,
                                    dots: itemDots,
                                    get slidesToShow() {
                                        if(itemToShow !== undefined && itemToShow !== null && itemToShow !== ''){
                                            return this.slidesToShow = itemToShow;
                                        } else {
                                            return this.slidesToShow = 1;
                                        }
                                    },
                                    get slidesToScroll() {
                                        if(itemToShow !== undefined && itemToShow !== null && itemToShow !== '' && itemToShow !== 2.5 && itemToShow !== 3.5 && itemToShow !== 4.5 && itemToShow !== 5.5){
                                            return this.slidesToScroll = itemToShow;
                                        } else {
                                            return this.slidesToScroll = 1;
                                        }
                                    },
                                    get initialSlide() {
                                        if(itemToShow == 3.5 || itemToShow == 4.5 || itemToShow == 5.5) {
                                            return this.initialSlide = 0.5;
                                        } else {
                                            return this.initialSlide = 0;
                                        }
                                    }
                                }
                            },
                            {
                                breakpoint: 1024,
                                settings: {
                                    arrows: itemArrows,
                                    dots: itemDots,
                                    get slidesToShow() {
                                        if(itemToShow !== undefined && itemToShow !== null && itemToShow !== ''){
                                            if(itemToShow == 5 || itemToShow == 6){
                                                return this.slidesToShow = itemToShow - 1;
                                            } else {
                                                if (productGrid.parents('.collection-column-2').length){
                                                    return this.slidesToShow = 2;
                                                } else{
                                                    return this.slidesToShow = itemToShow;
                                                }
                                               
                                            }
                                        } else {
                                            return this.slidesToShow = 1;
                                        }
                                    },
                                    get slidesToScroll() {
                                        if(itemToShow !== undefined && itemToShow !== null && itemToShow !== '' && itemToShow !== 2.5 && itemToShow !== 3.5 && itemToShow !== 4.5 && itemToShow !== 5.5){
                                            if(itemToShow == 5 || itemToShow == 6){
                                                return this.slidesToScroll = itemToShow - 1;
                                            } else {
                                                if (productGrid.parents('.collection-column-2').length){
                                                    return this.slidesToScroll = 2;
                                                } else{
                                                    return this.slidesToScroll = itemToShow;
                                                }
                                               
                                            }
                                        } else {
                                            return this.slidesToScroll = 1;
                                        }
                                    },
                                    get initialSlide() {
                                        if(itemToShow == 3.5 || itemToShow == 4.5 || itemToShow == 5.5) {
                                            return this.initialSlide = 0.5;
                                        } else {
                                            return this.initialSlide = 0;
                                        }
                                    }
                                }
                            },
                            {
                                breakpoint: 991,
                                settings: {
                                    arrows: itemArrowsMb,
                                    dots: itemDotsMb,
                                    get slidesToShow(){
                                        if (productGrid.hasClass('has__banner_tab') || productGrid.parents('.product-block-has__banner').length){
                                            if (productGrid.parents('.product-block-has__banner').length && productGrid.parents('.product-block-has__banner').data('width-banner') > 40) {
                                                return this.slidesToShow = 2;
                                            }
                                            else {
                                                if(itemToShow == 2.5) {
                                                    return this.slidesToShow = 2;
                                                } else {
                                                    return this.slidesToShow = 3;
                                                }
                                            }
                                        }
                                        else{
                                            if (productGrid.parents('.collection-column-2').length){
                                                return this.slidesToShow = 2;
                                            }
                                            else if (itemToShow == 1) {
                                                return this.slidesToShow = itemToShow;
                                            }
                                            else{
                                                return this.slidesToShow = 4;
                                            }
                                        }
                                    },
                                    get slidesToScroll(){
                                        if (productGrid.hasClass('has__banner_tab') || productGrid.parents('.product-block-has__banner').length){
                                            if (productGrid.parents('.product-block-has__banner').length && productGrid.parents('.product-block-has__banner').data('width-banner') > 40) {
                                                return this.slidesToScroll = 2;
                                            }
                                            else {
                                                if(itemToShow == 2.5) {
                                                    return this.slidesToScroll = 2;
                                                } else {
                                                    return this.slidesToScroll = 3;
                                                }
                                            }
                                        }
                                        else{
                                            if (productGrid.parents('.collection-column-2').length){
                                                return this.slidesToScroll = 2;
                                            }
                                            else if (itemToShow == 1) {
                                                return this.slidesToScroll = itemToShow;
                                            }
                                            else{
                                                return this.slidesToScroll = 4;
                                            }
                                        }
                                    },
                                    get initialSlide() {
                                        if(itemToShow == 3.5 || itemToShow == 4.5 || itemToShow == 5.5) {
                                            return this.initialSlide = 0.5;
                                        } else {
                                            return this.initialSlide = 0;
                                        }
                                    }
                                }
                            },
                            {
                                breakpoint: 767,
                                arrows: itemArrowsMb,
                                dots: itemDotsMb,
                                settings: {
                                    get slidesToShow(){
                                        if (productGrid.hasClass('has__banner_tab') || productGrid.parents('.product-block-has__banner').length){
                                            return this.slidesToShow = 2;
                                        }
                                        else if (itemToShow == 1) {
                                            return this.slidesToShow = itemToShow;
                                        }
                                        else{
                                            return this.slidesToShow = 3;
                                        }
                                    },
                                    get slidesToScroll(){
                                        if (productGrid.hasClass('has__banner_tab') || productGrid.parents('.product-block-has__banner').length){
                                            return this.slidesToScroll = 2;
                                        }
                                        else if (itemToShow == 1) {
                                            return this.slidesToScroll = itemToShow;
                                        }
                                        else{
                                            return this.slidesToScroll = 3;
                                        }
                                    },
                                    get initialSlide() {
                                        if(itemToShow == 3.5 || itemToShow == 4.5 || itemToShow == 5.5) {
                                            return this.initialSlide = 0.5;
                                        } else {
                                            return this.initialSlide = 0;
                                        }
                                    }
                                }
                            },
                            {
                                breakpoint: 320,
                                arrows: itemArrowsMb,
                                dots: itemDotsMb,
                                settings: {
                                    get slidesToShow(){
                                        if (itemToShow == 1) {
                                            if (productGrid.hasClass('special-banner__products--slider') || productGrid.hasClass('special-banner__products--grid')) {
                                                return this.slidesToShow = 2;
                                            } else {
                                                return this.slidesToShow = itemToShow;
                                            }
                                        }
                                        else {
                                            if(itemToShow == 2.5) {
                                                return this.slidesToShow = 1;
                                            } else {
                                                return this.slidesToShow = 2;
                                            }
                                        }

                                    },
                                    get slidesToScroll(){
                                        if (itemToShow == 1) {
                                            return this.slidesToScroll = itemToShow;
                                        }
                                        else {
                                            if(itemToShow == 2.5) {
                                                return this.slidesToScroll = 1;
                                            } else {
                                                return this.slidesToScroll = 2;
                                            }
                                        }
                                    }
                                }
                            }
                        ]
                    });

                    if (productGrid.hasClass('enable_progress_bar')) {
                        productGrid.on('afterChange', (event, slick, nextSlide) => {
                            var percent = ((nextSlide / (slick.slideCount - 1)) * 100) + '%';
                            progressBar.css('--percent', percent);
                        });
                    }
                    if (productGrid.hasClass('enable_counter_number')) {
                        var slickNext = productGrid.find('.slick-next');
                        productGrid.closest('.halo-block, .special-banner__product, .cust-prod-widget__product').find('.products-counter-number').appendTo(slickNext);
                        productGrid.on('afterChange', (event) => {
                            var slickIndex = productGrid.find('.slick-current').data('slick-index');
                            productGrid.find("#count-image").text(slickIndex + 1);
                        });
                    }

                    if ($('body').hasClass('cursor-fixed__show')){
                        window.sharedFunctionsAnimation.onEnterButton();
                        window.sharedFunctionsAnimation.onLeaveButton();
                    }
                }
            }
        },

        productBlockInfiniteScroll: function() {
            var productBlock = $('[data-product-block], [data-product-tab-block]');

            productBlock.each((index, element) => {
                var $block = $(element),
                    showMore = $block.find('[data-product-infinite]');
            
                if (showMore.length > 0) {
                    showMore.find('.button').on('click', (event) => {
                        var showMoreButton = $(event.target);

                        if (!showMoreButton.hasClass('view-all')) {
                            event.preventDefault();
                            event.stopPropagation();

                            // var text = window.button_load_more.loading;

                            showMoreButton.addClass('is-loading');
                            // showMoreButton.text(text);

                            var url = showMoreButton.attr('data-collection'),
                                limit = showMoreButton.attr('data-limit'),
                                swipe = showMoreButton.attr('data-swipe'),
                                total = showMoreButton.attr('data-total'),
                                image_ratio = showMoreButton.attr('data-image-ratio'),
                                sectionId = showMoreButton.attr('sectionId'),
                                page = parseInt(showMoreButton.attr('data-page'));

                            halo.doProductBlockInfiniteScroll(url, total, limit, swipe, image_ratio, sectionId, page, showMoreButton, $block);
                        } else {
                            window.location = showMoreButton.data('href');
                        }
                    });
                }
            });
        },

        doProductBlockInfiniteScroll: function(url, total, limit, swipe, image_ratio, sectionId, page, showMoreButton, $block){
            $.ajax({
                type: 'get',
                url: window.routes.root + '/collections/' + url,
                cache: false,
                data: {
                    view: 'ajax_product_block',
                    constraint: 'limit=' + limit + '+page=' + page + '+sectionId=' + sectionId + '+imageRatio=' + image_ratio + '+swipe=' + swipe
                },
                beforeSend: function () {
                    // halo.showLoading();
                },
                success: function (data) {
                    const $productGrid = showMoreButton.closest('.tab-content').length ? showMoreButton.closest('.tab-content').find('.products-grid') : showMoreButton.closest('.halo-block-content').find('.products-grid');
                    let length = $productGrid.find('.product').length;
                    const res = halo.handleResponse($(data), length, $productGrid.data('products-to-show'));
                    $productGrid.append(res);

                    if(length + res.length < $(data).length) {
                        var text = window.button_load_more.default;

                        showMoreButton.removeClass('is-loading');
                        showMoreButton.attr('data-page', page + 1);
                        showMoreButton.find('span').text(text);
                    } else {
                        if (Number(total) > $(data).length && $(data).length <= length + res.length) {
                            var text = window.button_load_more.view_all;

                            showMoreButton.find('span').text(text);
                            showMoreButton.removeClass('is-loading');
                            showMoreButton.attr('data-href', window.routes.root + '/collections/' + url).addClass('view-all');
                        } else {
                            var text = window.button_load_more.no_more;

                            showMoreButton.find('span').text(text);
                            showMoreButton.removeClass('is-loading');
                            showMoreButton.attr('disabled', 'disabled');
                        }
                    }
                },
                complete: function () {
                    // halo.hideLoading();
                    if (halo.checkNeedToConvertCurrency()) {
                        Currency.convertAll(window.shop_currency, $('#currencies .active').attr('data-currency'), 'span.money', 'money_format');
                    };

                    if (window.review.show && $('.shopify-product-reviews-badge').length > 0 && window.SPR != null && typeof window.SPR.registerCallbacks === 'functions') {
                        return window.SPR.registerCallbacks(), window.SPR.initRatingHandler(), window.SPR.initDomEls(), window.SPR.loadProducts(), window.SPR.loadBadges();
                    }
                }
            });
        },

        productMenuSlider: function(){
            var productGrid = $('.megamenu_style_5');
            if(productGrid.length > 0) {
                productGrid.each((index, el) => {
                    let _self = $(el).find('.products-carousel'),
                        _dataRows = _self.data('row');
                    if(_self.not('.slick-initialized')) {
                        _self.slick({
                            mobileFirst: true,
                            adaptiveHeight: true,
                            vertical: false,
                            infinite: false,
                            slidesToShow: 2,
                            slidesToScroll: 1,
                            arrows: false,
                            dots: true,
                            rtl: window.rtl_slick,
                            responsive: 
                            [
                                {
                                    breakpoint: 1024,
                                    settings: {
                                        slidesToShow: 3,
                                        slidesToScroll: 1,
                                    }
                                },
                                {
                                    breakpoint: 1500,
                                    settings: {
                                        slidesToShow: _dataRows,
                                        slidesToScroll: 1,
                                        dots: false
                                    }
                                }
                            ]
                        });
                    }
                })
            }
        },

        buildRecommendationBlock: function(){
            if (document.querySelector('[data-recommendations-block]') == null) return;

            var $this = document.querySelector('[data-recommendations-block]'),
                layout = $this.dataset.layout;
                swipe = $this.dataset.swipe;

            const config = {
                threshold: 0.25,
            }

            const handleIntersection = (entries, observer) => {
                const recommendationsContainer = $this.querySelector('.wrapper-container');
                if (!entries[0].isIntersecting) return;
                if ($this.innerHTML.trim() != '' && !recommendationsContainer.classList.contains('product-recommendations-loading') && !recommendationsContainer.classList.contains('has-product')) return;
                recommendationsContainer.classList.add('has-product');

                fetch($this.dataset.url)
                .then(response => response.text())
                .then(text => {
                    const html = document.createElement('div');
                    html.innerHTML = text;
                    const recommendations = html.querySelector('[data-recommendations-block]');
                    if (recommendations && recommendations.innerHTML.trim().length) {
                        $this.innerHTML = recommendations.innerHTML;

                        var productItems = $($this).find('.product-item')
                        var firstProductData = productItems.eq(0).data('json-product')
                        if (!firstProductData) return $($this).remove();

                        if (layout == 'slider') {
                            halo.productBlockSilder($($this));
                        } else if (layout == 'scroll') {
                            const enableHover = $($this).find('[data-enable-hover]').attr('data-enable-hover');
                            const wrapper = $($this).find('.products-flex');

                            if (enableHover === 'true' && wrapper.clientWidth < wrapper.scrollWidth) {
                                halo.productBlockScroller($($this));
                            }
                        }

                        var productItems = $($this).find('.product-item')
                        productItems.each(async (index, rawProduct) => {
                            var product = $(rawProduct);
                            var productId = product.data('product-id');
                            var productJson = product.data('json-product');
                            var handle = productJson.handle
                            
                            await  $.ajax({
                                type: 'get',
                                url: window.routes.root + '/products/' + handle + '?view=ajax_variant_quantity',
                                beforeSend: function () {},
                                success: function (data) {
                                    const element = new DOMParser().parseFromString(data, 'text/html')
                                    if (element.querySelector(`[data-quantity-product-id="${productId}"]`)) {
                                        const quantityInfo = JSON.parse(element.querySelector(`[data-quantity-product-id="${productId}"]`).innerHTML)
                                        window[`quick_view_inven_array_${productId}`] = quantityInfo
                                    }
                                },      
                                error: function (xhr, text) {
                                    halo.showWarning($.parseJSON(xhr.responseText).description);
                                },
                                complete: function () {}
                            });
                        }) 

                        const loadingImages = $this.querySelectorAll('.media--loading-effect img');
                        this.observeImageLazyloaded(loadingImages);

                        if(window.compare.show){
                            var $compareLink = $('[data-compare-link]');

                            halo.setLocalStorageProductForCompare($compareLink);
                        }

                        if(window.wishlist.show){
                            halo.setLocalStorageProductForWishlist();
                        }

                        if (window.review.show && $('.shopify-product-reviews-badge').length > 0 && window.SPR != null && typeof window.SPR.registerCallbacks === 'functions') {
                            return window.SPR.registerCallbacks(), window.SPR.initRatingHandler(), window.SPR.initDomEls(), window.SPR.loadProducts(), window.SPR.loadBadges();
                        }

                        if ($('body').hasClass('cursor-fixed__show')){
                            window.sharedFunctionsAnimation.onEnterButton();
                            window.sharedFunctionsAnimation.onLeaveButton();
                        }

                        if($body.hasClass('product-card-layout-08')) {
                            halo.productCountdownCard();
                        }

                        this.calculateTranslateYHeight()
                    }
                })
                .catch(e => {
                    console.error(e);
                });
            }

            new IntersectionObserver(handleIntersection.bind($this), ({}, config)).observe($this);
        },

        initVideoPopup: function (){
            if ($(".video-open-popup").length) {
            } else {return}
            $('.video-open-popup .video-button').off('click').on('click',function(){
                let video_type = $(this).attr('data-type'),
                    video_src = $(this).attr('data-src'),
                    aspect_ratio = $(this).attr('aspect_ratio'),
                    modal = $('[data-popup-video]');

                const $content = `<div class="fluid-width-video-wrapper" style="padding-top: ${aspect_ratio}">
                                    ${video_type == 'youtube' ? 
                                        `<iframe
                                            id="player"
                                            type="text/html"
                                            width="100%"
                                            frameborder="0"
                                            webkitAllowFullScreen
                                            mozallowfullscreen
                                            allowFullScreen
                                            src="https://www.youtube.com/embed/${video_src}?autoplay=1&mute=1">
                                        </iframe>`
                                        :
                                        `<iframe 
                                            src="https://player.vimeo.com/video/${video_src}?autoplay=1&mute=1" 
                                            class="js-vimeo" 
                                            allow="autoplay; 
                                            encrypted-media" 
                                            webkitallowfullscreen 
                                            mozallowfullscreen 
                                            allowfullscreen">
                                        </iframe>`
                                    }
                                </div>`;
                modal.find('.halo-popup-content').html($content);
                $body.addClass('video-show');
            });

            $('[data-popup-video], [data-popup-video] .halo-popup-close, .background-overlay').on('click', function (e) {
                // e.preventDefault();
                // e.stopPropagation();
                let modalContent = $('[data-popup-video] .halo-popup-content');
                if (!modalContent.is(e.target) && !modalContent.has(e.target).length) {
                    $body.removeClass('video-show');
                    $('[data-popup-video] iframe').remove();
                };
            });
        },

        swapHoverVideoProductCard: function () {
            if (window.innerWidth > 1200) {
                $('.product-item .card').mouseenter(function(){
                    var chil = $(this).find('video');
                    var _chil = $(this).find('video').get(0);
                    if (chil.length > 0) {
                        _chil.play();
                    }
                });
                $('.product-item .card').mouseleave(function(){
                    var chil = $(this).find('video');
                    var _chil = $(this).find('video').get(0);
                    if (chil.length > 0) {
                        _chil.pause();
                    }
                })
            }
        },

        initGlobalCheckbox: function() {
            $doc.on('change', '.global-checkbox--input', (event) => {
                var targetId = event.target.getAttribute('data-target');

                if(event.target.checked){
                    $(targetId).attr('disabled', false);
                } else{
                    $(targetId).attr('disabled', true);
                }
            });

            $doc.on('click', '[data-term-condition]', (event) => {
                event.preventDefault();
                event.stopPropagation();
                $body.addClass('term-condition-show');
            });

            $doc.on('click', '[data-close-term-condition-popup]', (event) => {
                event.preventDefault();
                event.stopPropagation();
                $body.removeClass('term-condition-show');
            });

            $doc.on('click', (event) => {
                setTimeout(() => {
                    if ($body.hasClass('cart-sidebar-show')) {
                        if (($(event.target).closest('[data-term-condition-popup]').length === 0)){
                            $body.removeClass('term-condition-show');
                        }
                    }
                    if ($body.hasClass('term-condition-show')) {
                        if ($(event.target).closest('[data-term-condition-popup]').length === 0){
                            $body.removeClass('term-condition-show');
                        }
                    }
                }, 10);
            });
        },
        
        initColorSwatch: function() {
            $doc.ready(function() {
                $('.card .swatch-label.is-active').trigger('click');
            });
            
            $doc.on('click', '.card .swatch-label', (event) => {
                var $target = $(event.currentTarget),
                    title = $target.attr('title').replace(/^\s+|\s+$/g, ''),
                    product = $target.closest('.product-item'),
                    productJson = product.data('json-product'),
                    productTitle = product.find('.card-title'),
                    productAction = product.find('[data-btn-addtocart]'),
                    productAction2 = product.find('.card-product [data-btn-addtocart]'),
                    variantId = $target.data('variant-id'),
                    productHref = product.find('a').attr('href'),
                    oneOption = $target.data('with-one-option'),
                    newImage = $target.data('variant-img'),
                    mediaList = [];



                const $iconAddtocart = '<svg class="icon icon-cart" viewBox="0 0 286.74 356.73">\
                  <g data-name="Layer 1">\
                    <path d="m286.33,277.03l-.17-3.91c-.81-18.73-1.83-37.7-2.83-56.05l-.79-14.51c-.43-8.13-.9-16.26-1.37-24.4l-.24-4.18c-.84-14.79-1.71-30.08-2.35-45.1-.93-21.43-14.62-35.84-34.07-35.86h-20.65c-.42-20.33-5.78-38.81-15.94-54.94C189.14,8.27,157.22-5.8,126.6,2.23c-27.48,7.21-46.98,26.7-57.96,57.94-3.5,9.98-5.33,20.76-5.56,32.86h-9.52c-4.59,0-9.05-.01-12.39,0-16.64.12-30.01,12.35-31.79,29.06-1.42,13.39-2.1,27.29-2.7,39.55-.24,4.97-.5,9.95-.77,14.91-1.22,21.28-2.24,39.94-3.13,57.07-.29,5.45-.6,10.9-.92,16.36l-.02.3c-.82,13.9-1.67,28.28-1.82,42.5-.18,16.51,5.81,32.31,16.86,44.5,11.15,12.29,26.39,19.35,41.81,19.37,22.45.05,49.37.08,82.32.08s60.43-.02,87.24-.08c28.28-.04,53.63-23.49,57.72-53.39,1.19-8.74.78-17.61.37-26.23ZM63.13,130.98c.09,7.97,4.99,13.59,11.92,13.67h.12c6.97,0,11.9-5.57,11.99-13.53.04-3.2.04-6.33.04-9.63v-2.53s112.59,0,112.59,0v10.76c0,4.95,1.26,8.81,3.76,11.51,2.07,2.2,4.95,3.4,8.33,3.45h.11c5.72-.08,11.83-4.11,11.85-15.16v-10.77c.83-.01,1.68-.03,2.55-.04h.62c7.1-.1,15.15-.2,20.48.19,3.7.28,6.59,4.2,6.87,9.32.68,12.51,1.41,26.28,2.28,43.33l.1,2.01c.67,12.86,1.34,25.72,2.04,38.59.31,5.58.6,11.17.87,16.76.91,17.56,1.84,35.72,3.19,53.79,1.49,20.32-4.18,34.05-17.84,43.2-5.16,3.45-10.88,5.2-17.01,5.2h-15.06c-45.58.05-104.28.1-154.01-.02-9.16-.02-18.22-4.27-24.85-11.68-6.63-7.39-10.18-16.92-10-26.83.28-14.29,1.14-29.09,1.9-42.15.31-5.37.62-10.74.91-16.1.54-10.41,1.12-20.81,1.69-31.22l.07-1.28c.21-3.92.43-7.85.65-11.77.22-3.94.44-7.88.65-11.82.15-2.9.3-5.8.45-8.7.15-2.9.3-5.79.45-8.7.51-10.04,1.11-21.71,1.81-33.09.33-5.43,3.75-8.98,8.7-9.05,2.69-.04,6.15-.06,10-.06h11.79v3.83c0,1.68-.01,3.34,0,5h-.06l.04,3.54Zm24.05-38.1c.01-6.61,1.06-13.49,3.19-20.92,4.62-16.13,13.13-28.65,25.29-37.21,18.23-12.86,40.54-12.15,58.21,1.84,15.57,12.32,25.91,35.07,25.84,56.29h-112.53Z"></path>\
                  </g>\
                </svg>';

                $target.parents('.swatch').find('.swatch-label').removeClass('is-active');
                $target.addClass('is-active');
                
                if(productTitle.hasClass('card-title-change')){
                    if($body.hasClass('style_2_text_color_varriant')){
                        productTitle.find('[data-change-title]').text(title);
                    }else{
                        productTitle.find('[data-change-title]').text(' - ' + title);
                    }
                } else {
                    if($body.hasClass('style_2_text_color_varriant')){
                        productTitle.addClass('card-title-change').append('<span data-change-title>' + title + '</span>');
                    }else{
                        productTitle.addClass('card-title-change').append('<span data-change-title> - ' + title + '</span>');
                    }
                }

                const selectedVariant = productJson.variants.find(variant => variant.id === variantId)

                if (selectedVariant.compare_at_price > selectedVariant.price) {
                    product.find('.price').addClass('price--on-sale');
                    product.find('.price__sale .price-item--regular').html(Shopify.formatMoney(selectedVariant.compare_at_price, window.money_format));
                    product.find('.price__sale .price-item--sale').html(Shopify.formatMoney(selectedVariant.price, window.money_format));
                    const labelSale = `(-${Math.round((selectedVariant.compare_at_price - selectedVariant.price) * 100 / selectedVariant.compare_at_price)}%)`;
                    product.find('.price__label_sale .label_sale').html(labelSale);
                } else {
                    product.find('.price__regular .price-item').html(Shopify.formatMoney(selectedVariant.price, window.money_format));

                    if (selectedVariant.compare_at_price == null) {
                        product.find('.price').removeClass('price--on-sale');
                        product.find('.price__sale .price-item--regular').html('');
                    }
                }
  
                product.find('a:not(.single-action):not(.number-showmore)').attr('href', productHref.split('?variant=')[0]+'?variant='+ variantId);

                if (oneOption != undefined) {
                    var quantity = $target.data('quantity');

                    product.find('[name="id"]').val(oneOption);
  
                    if (quantity > 0) {
                        if(window.notify_me.show){
                            productAction
                                .removeClass('is-notify-me')
                                .addClass('is-visible');
                        } else {
                            productAction
                                .removeClass('is-soldout')
                                .addClass('is-visible');
                        }
                    } else {
                       if(window.notify_me.show){
                            productAction
                                .removeClass('is-visible')
                                .addClass('is-notify-me');
                        } else {
                            productAction
                                .removeClass('is-visible')
                                .addClass('is-soldout');
                        }
                    }

                    if(productAction.hasClass('is-soldout') || productAction.hasClass('is-notify-me')){
                        if(productAction.hasClass('is-notify-me')){
                            if ($body.hasClass('product-card-layout-08')) {
                                productAction2
                                    .html($iconAddtocart)
                                    .prop('disabled', false);
                            } else {
                                productAction.text(window.notify_me.button);
                            }
                        } else {
                            if ($body.hasClass('product-card-layout-08')) {
                                productAction2
                                    .html($iconAddtocart)
                                    .prop('disabled', true);
                            } else {
                                productAction
                                    .text(window.variantStrings.soldOut)
                                    .prop('disabled', true);
                            }
                        }
                    } else {
                        if ($body.hasClass('product-card-layout-08')) {
                            productAction2
                                .html($iconAddtocart)
                                .prop('disabled', false);
                        } else {
                            productAction
                                .text(window.variantStrings.addToCart)
                                .prop('disabled', false);
                        }
                    }
                } else {
                    if (productJson != undefined) {
                        if(window.quick_shop.show){
                            halo.checkStatusSwatchQuickShop(product, productJson);
                        }
                    }

                    product.find('.swatch-element[data-value="' + title + '"]').find('.single-label').trigger('click');
                }

                if (productJson.media != undefined) {
                    var mediaList = productJson.media.filter((index, element) => {
                        return element.alt === title;
                    });
                }

                if (mediaList.length > 0) {
                    if (mediaList.length > 1) {
                        var length = 2;
                    } else {
                        var length = mediaList.length;
                    }
                    
                    for (var i = 0; i < length; i++) {
                        product.find('.card-media img:eq('+ i +')').attr('srcset', mediaList[i].src);
                    }
                } else {
                    if (newImage) {
                        product.find('.card-media img:nth-child(1)')
                        .attr('srcset', newImage)
                        .attr('data-srcset', newImage);
                    }
                }
  
                // halo.checkPreOrderOfVariant(selectedVariant, productAction, productJson)
                if (halo.checkNeedToConvertCurrency()) {
                    Currency.convertAll(window.shop_currency, $('#currencies .active').attr('data-currency'), 'span.money', 'money_format');
                }
            });
              
            $doc.on('click', '.item-swatch-more .number-showmore', (event) => {
                if ($(event.target).closest('.swatch').hasClass('show--more')) {
                    $(event.target).closest('.swatch').removeClass('show--more');
                    $(event.target).find('span:eq(0)').text('+');
                } else {
                    $(event.target).closest('.swatch').addClass('show--more');
                    $(event.target).find('span:eq(0)').text('-'); 
                }
            })
        },

        checkPreOrderOfVariant: function(selectedVariant, productAction, productJson) {
            // Check if variant is allowed to sale when out of stock
            const variantId = selectedVariant.id
            const updatePreOrderText = (productAction, selectedVariant, inventoryQuantity) => {
                const product = productAction.parents('.product-item');
                const hasQuickShopPanel = product.find('[data-quickshop-popup]').length > 0;

                if (selectedVariant.inventory_management == null) {
                    productAction
                        .text(hasQuickShopPanel ? window.variantStrings.add : window.variantStrings.addToCart)
                        .prop('disabled', false)
                        .addClass('button--pre-untrack')
                }
                else if (selectedVariant.available && inventoryQuantity <=0 ) {
                    productAction
                        .text(window.variantStrings.preOrder)
                        .prop('disabled', false)
                        .addClass('button--pre-untrack')
                } else {
                    productAction.removeClass('button--pre-untrack');
                    if (inventoryQuantity > 0) {
                        if(window.notify_me.show){
                            productAction
                                .removeClass('is-notify-me')
                                .addClass('is-visible')
                        } else {
                            productAction
                                .removeClass('is-soldout')
                                .addClass('is-visible')
                        }
                    } else {
                      
                       if(window.notify_me.show){
                            productAction
                                .removeClass('is-visible')
                                .addClass('is-notify-me')
                                .prop('disabled', false);
                        } else {
                            productAction
                                .removeClass('is-visible')
                                .addClass('is-soldout').prop('disabled', true);
                        }
                    }

                    if(productAction.hasClass('is-soldout') || productAction.hasClass('is-notify-me')){
                        if(productAction.hasClass('is-notify-me')){

                            productAction.text(window.notify_me.button).prop('disabled', false).removeClass('btn-unavailable');;
                        } else {
                            productAction
                                .text(window.variantStrings.soldOut)
                                .prop('disabled', true);
                        }
                    } else {
                        productAction
                            .text(hasQuickShopPanel ? window.variantStrings.add : window.variantStrings.addToCart)
                            .prop('disabled', false);
                    }
                }
            }
    
            const variantsQuantityInvenText = `quick_view_inven_array_${productJson.id}`
            var arrayInVarName = variantsQuantityInvenText,
                inven_array = window[arrayInVarName]; 
            
            if(inven_array != undefined) {
                var inven_num = inven_array[variantId],
                    inventoryQuantity = parseInt(inven_num);
                    updatePreOrderText(productAction, selectedVariant, inventoryQuantity)
            } else {
                $.ajax({
                    type: 'get',
                    url: window.routes.root + '/products/' + productJson.handle + '?view=ajax_quick_shop_data',
                    beforeSend: function () {},
                    success: function (data) {
                        window[variantsQuantityInvenText] = JSON.parse(data.split('=')[1])
                        var inven_num = window[variantsQuantityInvenText][variantId],
                            inventoryQuantity = parseInt(inven_num);
                        updatePreOrderText(productAction, selectedVariant, inventoryQuantity)   
                    },      
                    error: function (xhr, text) {
                        halo.showWarning($.parseJSON(xhr.responseText).description);
                    },
                    complete: function () {
                        
                    }
                });
            }
        },

        initQuickShop: function() {
            if(window.quick_shop.show) {
                $doc.on('click', '[data-quickshop-popup]', (event) => {
                    event.preventDefault();
                    event.stopPropagation();
                    
                    var $target = $(event.target),
                        product = $target.parents('.product-item'),
                        productJson = product.data('json-product'),
                        variantPopup = product.find('.variants-popup');
                        
                    const $quickView = document.querySelector('.halo-quick-view-popup');
                    if (!document.body.matches('.qv-loaded', '.qs3-loaded') && $quickView) {
                        halo.buildStyleSheet($quickView.dataset.urlStyleProduct, $quickView);
                        document.body.classList.add('qs3-loaded');
                    }

                    if(!product.hasClass('quickshop-popup-show')){
                        $('.product-item').removeClass('quickshop-popup-show');

                        if ($body.hasClass('quick_shop_option_2')) {
                            var height = product.find('.card-media').outerHeight(true);
                            var variantsArray = variantPopup.find('.variants')

                            if ($body.hasClass('product-card-layout-02')){
                                if ($win.width() > 1024) {
                                    variantsArray.css('max-height', (height - 114) + 'px');
                                    variantsArray.css('min-height', (height - 114) + 'px');
                                } else {
                                    variantsArray.css('max-height', (height - 70) + 'px');
                                    variantsArray.css('min-height', (height - 70) + 'px');
                                } 
                            } else if ($body.hasClass('product-card-layout-04')){
                                if ($win.width() > 1024) {
                                    variantsArray.css('max-height', (height - 116) + 'px');
                                    variantsArray.css('min-height', (height - 116) + 'px');
                                } else {
                                    variantsArray.css('max-height', (height - 70) + 'px');
                                    variantsArray.css('min-height', (height - 70) + 'px');
                                } 
                            } else {
                                if ($win.width() > 1024) {
                                    variantsArray.css('max-height', (height - 74) + 'px');
                                    variantsArray.css('min-height', (height - 74) + 'px');
                                } else {
                                    variantsArray.css('max-height', (height - 20) + 'px');
                                    variantsArray.css('min-height', (height - 20) + 'px');
                                } 
                            }

                            if (variantsArray[0].scrollHeight > variantsArray[0].clientHeight) {
                                variantsArray.addClass('scrollable')
                            }

                            if (!$('.productListing').hasClass('productList')){
                                halo.appendProductQuickShopOption2(product);
                            }
                        } else if ($body.hasClass('quick_shop_option_3')) {
                            const handle = $target.data('product-handle');
                            if (!$('.productListing').hasClass('productList')){
                                halo.updateContentQuickshopOption3(handle);
                            }
                            
                            $doc.on('click', '[data-close-quick-shop-popup]', (event) => {
                                event.preventDefault();
                                event.stopPropagation();
                
                                $body.removeClass('quickshop-popup-show');
                            });
                            
                            $doc.off('click.quickShopOverlay').on('click.quickShopOverlay', (event) => {
                                if ($body.hasClass('quickshop-popup-show')) {
                                    if (($(event.target).closest('[data-quickshop-popup-option-3]').length === 0)){
                                        $body.removeClass('quickshop-popup-show');
                                    }
                                }
                            })
                        } 

                        if (!$body.hasClass('quick_shop_option_3')) {
                            if ($win.width() < 767) {
                                if ($('.productListing').hasClass('productList')) {
                                    halo.appendToListViewModal(product)
                                } else {
                                    product.addClass('quickshop-popup-show');
                                }
                            } else {
                                product.addClass('quickshop-popup-show');
                            }
                        } else {
                            if ($('.productListing').hasClass('productList')){
                                if ($win.width() < 767) {
                                    halo.appendToListViewModal(product)
                                } else {
                                    product.addClass('quickshop-popup-show');
                                }
                            }
                        }
                        
                        product.find('.swatch-label.is-active').trigger('click');
                        halo.checkStatusSwatchQuickShop(product, productJson);
                        
                        if($body.hasClass('quick_shop_option_2') || ($('productListing').hasClass('productList') && !$('.card-swatch').hasClass('quick_shop_type_3'))){
                            if ($win.width() < 767) {
                                if (!$('.productListing').hasClass('productList')){
                                    var quickshopVariantPopup = $('#halo-card-mobile-popup .variants-popup');
                                    quickshopVariantPopup.find('.selector-wrapper').each((index, element) => {
                                        $(element).find('.swatch-element:not(.soldout):not(.unavailable)').eq('0').find('.single-label').trigger('click');
                                    });
                                } else {
                                    variantPopup.find('.selector-wrapper').each((index, element) => {
                                        $(element).find('.swatch-element:not(.soldout):not(.unavailable)').eq('0').find('.single-label').trigger('click');
                                    });
                                }
                            } else {
                                variantPopup.find('.selector-wrapper').each((index, element) => {
                                    $(element).find('.swatch-element:not(.soldout):not(.unavailable)').eq('0').find('.single-label').trigger('click');
                                });
                            }
                            if (!$('.productListing').hasClass('productList')){
                                $body.addClass('quick_shop_popup_mobile');
                            }
                        } else {
                            variantPopup.find('.selector-wrapper:not(.option-color)').each((index, element) => {
                                $(element).find('.swatch-element:not(.soldout):not(.unavailable)').eq('0').find('.single-label').trigger('click');
                            });
                        }
                    } else {
                        halo.initAddToCartQuickShop($target, variantPopup);
                    }

                    if (halo.checkNeedToConvertCurrency()) {
                        Currency.convertAll(window.shop_currency, $('#currencies .active').attr('data-currency'), 'span.money', 'money_format');
                    }
                });

                $doc.on('click', '[data-cancel-quickshop-popup]', (event) => {
                    event.preventDefault();
                    event.stopPropagation();

                    var $target = $(event.currentTarget),
                        product = $target.parents('.product-item'),
                        quickshopMobilePopup = $doc.find('#halo-card-mobile-popup');

                    product.removeClass('quickshop-popup-show');
                    var productQuickshopShown = $doc.find('.quickshop-popup-show')
                    productQuickshopShown.removeClass('quickshop-popup-show');
                    $body.removeClass('quickshop-list-view-show');
                     
                    if($body.hasClass('quick_shop_option_2')){
                        $body.removeClass('quick_shop_popup_mobile');
                        quickshopMobilePopup.removeClass('show');
                    }
                });

                $doc.on('click', (event) => {
                    if ($(event.target).closest('[data-quickshop-popup]').length === 0 && $(event.target).closest('.variants-popup').length === 0 && $(event.target).closest('.card-swatch').length === 0 && $(event.target).closest('[data-warning-popup]').length === 0) {
                        $('.product-item').removeClass('quickshop-popup-show');
                        if($body.hasClass('quick_shop_option_2')){
                            $body.removeClass('quick_shop_popup_mobile');
                        }
                    }
                });

                halo.changeSwatchQuickShop();
            }
        },
  
        appendToListViewModal: function(product)  {
            const quickshopMobilePopup = $doc.find('#list-view-popup');
            const quickshopForm = product.clone();
            quickshopMobilePopup.find('.halo-popup-content').empty();
            quickshopMobilePopup.find('.halo-popup-content').append(quickshopForm);

            const form = quickshopMobilePopup.find('[data-quickshop] .card-information .variants-popup form').eq('0');
            const mobilePopupId = form.attr('id') + '-mobile';
            const optionInputs = form.find('.single-option');
            const optionLabels = form.find('.single-label');
            const cardInfoWrapper = quickshopMobilePopup.find('.card-product')
            const variantsPopup = quickshopMobilePopup.find('.variants-popup')
            const submitBtn = quickshopMobilePopup.find('[data-btn-addtocart]')
            variantsPopup.removeClass("card-list__hidden")
            let clicked = {
                selected1: false,
                selected2: false,
                selected3: false
            } 

            form.attr('id', mobilePopupId);
            submitBtn.attr('data-form-id', submitBtn.attr('data-form-id') + '-mobile')

            optionInputs.each((index, optionInput) => {
                $(optionInput).attr('id', $(optionInput).attr('id') + '-mobile');
                $(optionInput).attr('name', $(optionInput).attr('name') + '-mobile');
            })

            optionLabels.each((index, optionLabel) => {
                $(optionLabel).attr('for', $(optionLabel).attr('for') + '-mobile');

                const swatchWrapper = $(optionLabel).closest('.selector-wrapper')
                const swatchElement = $(optionLabel).closest('.swatch-element')
                if (!swatchElement.hasClass('available')) return 
                
                if (swatchWrapper.hasClass('selector-wrapper-1') && !clicked.selected1) {
                    clicked.selected1 = true
                    $(optionLabel).trigger('click')
                } else if (swatchWrapper.hasClass('selector-wrapper-2') && !clicked.selected2) {
                    clicked.selected2 = true 
                    $(optionLabel).trigger('click')
                } else if (swatchWrapper.hasClass('selector-wrapper-3') && !clicked.selected3) {
                    clicked.selected3 = true
                    $(optionLabel).trigger('click')
                }
            })

            $body.addClass('quickshop-list-view-show');

            $('.background-overlay').off('click.closeListViewModal').on('click.closeListViewModal', () => {
                $body.removeClass('quickshop-list-view-show');
            })
        },

        changeSwatchQuickShop: function () {
            $doc.on('change', '[data-quickshop] .single-option', (event) => {
                
                var $target = $(event.target),
                    product = $target.parents('.product-item'),
                    productJson = product.data('json-product'),
                    productAction = product.find('[data-btn-addtocart]'),
                    variantList,
                    optionColor = product.find('.option-color').data('option-position'),
                    optionIndex = $target.closest('[data-option-index]').data('option-index'),
                    swatch = product.find('.swatch-element'),
                    thisVal = $target.val(),
                    selectedVariant,
                    productInput = product.find('[name=id]'),
                    selectedOption1 = product.find('.selector-wrapper-1').find('input:checked').val(),
                    selectedOption2 = product.find('.selector-wrapper-2').find('input:checked').val(),
                    selectedOption3 = product.find('.selector-wrapper-3').find('input:checked').val();

                if ($body.hasClass('quick_shop_option_2') && $('.productListing').hasClass('productList')) {
                    selectedOption1 = product.find('.selector-wrapper-1').eq('1').find('input:checked').val();
                } else {
                    if ($('.productListing').hasClass('productList') && $win.width() < 767) {
                        selectedOption1 = product.find('.selector-wrapper-1').eq('1').find('input:checked').val();
                        selectedOption2 = product.find('[data-option-index="1"]').eq('1').find('input:checked').val();
                    } else {
                        selectedOption1 = product.find('.selector-wrapper-1').eq('0').find('input:checked').val();
                    }
                }

                if (productJson != undefined) {
                    variantList = productJson.variants;
                }

                swatch.removeClass('soldout');
                swatch.find('input[type="radio"]').prop('disabled', false);

                switch (optionIndex) {
                    case 0:
                        var availableVariants = variantList.find((variant) => {
                            if (optionColor == 1) {
                                return variant.option2 == thisVal && variant.option1 == selectedOption2;
                            } else {
                                if (optionColor == 2) {
                                    return variant.option3 == thisVal && variant.option1 == selectedOption2;
                                } else {
                                    return variant.option1 == thisVal && variant.option2 == selectedOption2;
                                }
                            }
                        });

                        if(availableVariants != undefined){
                            selectedVariant =  availableVariants;
                        } else{
                            var altAvailableVariants = variantList.find((variant) => {
                                if (optionColor == 1) {
                                    return variant.option2 == thisVal;
                                } else {
                                    if (optionColor == 2) {
                                        return variant.option3 == thisVal;
                                    } else {
                                        return variant.option1 == thisVal;
                                    }
                                }
                            });

                            selectedVariant =  altAvailableVariants;
                        }

                        break;
                    case 1:
                        var availableVariants = variantList.find((variant) => {
                            if (optionColor == 1) {
                                return variant.option2 == selectedOption1 && variant.option1 == thisVal && variant.option3 == selectedOption2;
                            } else {
                                if (optionColor == 2) {
                                    return variant.option3 == selectedOption1 && variant.option1 == thisVal && variant.option2 == selectedOption2;
                                } else {
                                    return variant.option1 == selectedOption1 && variant.option2 == thisVal && variant.option3 == selectedOption2;
                                }
                            }
                        });

                        if(availableVariants != undefined){
                            selectedVariant =  availableVariants;
                        } else {
                            var altAvailableVariants = variantList.find((variant) => {
                                if (optionColor == 1) {
                                    return variant.option2 == selectedOption1 && variant.option1 == thisVal;
                                } else {
                                    if (optionColor == 2) {
                                        return variant.option3 == selectedOption1 && variant.option1 == thisVal;
                                    } else {
                                        return variant.option1 == selectedOption1 && variant.option2 == thisVal;
                                    }
                                }
                            });

                            selectedVariant =  altAvailableVariants;
                        }

                        break;
                    case 2:
                        var availableVariants = variantList.find((variant) => {
                            if (optionColor == 1) {
                                return variant.option2 == selectedOption1 && variant.option1 == selectedOption2 && variant.option3 == thisVal;
                            } else {
                                if (optionColor == 2) {
                                    return variant.option3 == selectedOption1 && variant.option1 == selectedOption2 && variant.option2 == thisVal;
                                } else {
                                    return variant.option1 == selectedOption1 && variant.option2 == selectedOption2 && variant.option3 == thisVal;
                                }
                            }
                        });

                        if(availableVariants != undefined){
                            selectedVariant =  availableVariants;
                        }

                        break;
                }
                            
                if (selectedVariant == undefined) {
                    return;
                }
                
                productInput.val(selectedVariant.id);
                var value = $target.val();
               

                
                $target.parents('.selector-wrapper').find('.form-label span').text(value);
                if (selectedVariant.available) {
                    product.find('[data-btn-addtocart]').removeClass('btn-unavailable');
                    product.find('[data-quickshop] quickshop-update-quantity').removeClass('disabled');
                    product.find('[data-btn-addtocart]').attr('data-available', 'true')
                      
                } else {
                    product.find('[data-btn-addtocart]').addClass('btn-unavailable');
                    product.find('[data-quickshop] quickshop-update-quantity').addClass('disabled');
                    product.find('[data-btn-addtocart]').attr('data-available', 'false')
                }

                if (halo.checkNeedToConvertCurrency()) {
                    Currency.convertAll(window.shop_currency, $('#currencies .active').attr('data-currency'), 'span.money', 'money_format');
                };

                if (!$body.hasClass('quick_shop_option_2') && !$body.hasClass('quick_shop_option_3') && $win.width() < 767) {
                    
                } 

                if ($body.hasClass('quick_shop_option_2') && $win.width() < 767) {
                    if ($('.halo-popup-wrapper .card-product__wrapper [data-option-index="0"] .swatch-element').length == 1){
                        $('.halo-popup-wrapper .card-product__wrapper [data-option-index="0"] .swatch-element').eq('0').find('.single-label').trigger('click');
                    }
                    if ($('.halo-product-list-view-popup .product-options-wrapper .product-item .card-information [data-option-index="0"] .swatch-element').length == 1) {
                        $('.halo-product-list-view-popup .product-options-wrapper .product-item .card-information [data-option-index="0"] .swatch-element').eq('0').find('.single-label').trigger('click');
                    }
                } 

                halo.checkStatusSwatchQuickShop(product, productJson);
                halo.checkPreOrderOfVariant(selectedVariant, productAction, productJson);
            });
        },

        checkStatusSwatchQuickShop: function(product, productJson){
            var variantPopup = product.find('.card-variant'),
                variantList,
                productOption = product.find('[data-option-index]'),
                optionColor = product.find('.option-color').data('option-position'),
                selectedOption1 = product.find('[data-option-index="0"]').find('input:checked').val(),
                selectedOption2 = product.find('[data-option-index="1"]').find('input:checked').val(),
                selectedOption3 = product.find('[data-option-index="2"]').find('input:checked').val(),
                productId = product.data('product-id');

            
            if ($body.hasClass('quick_shop_option_2')) {
                var height = product.find('.card-media').outerHeight(true);
                if (selectedOption3 != undefined) {
                    if ($body.hasClass('product-card-layout-01')) {
                        if (height < 310) {
                            $('[data-quickshop]').addClass('active_option_3');
                        } else {
                            $('[data-quickshop]').removeClass('active_option_3');
                        }  
                    } else {
                        if (height < 370) {
                            $('[data-quickshop]').addClass('active_option_3');
                        } else {
                            $('[data-quickshop]').removeClass('active_option_3');
                        } 
                    }
                } else {
                    if ($win.width() > 1024) {
                        if ($body.hasClass('product-card-layout-05')) {
                            if (height < 350 && selectedOption2 != undefined) {
                                $('[data-quickshop]').addClass('active_option_3');
                            } else {
                                $('[data-quickshop]').removeClass('active_option_3');
                            }    
                        } else if ($body.hasClass('product-card-layout-01')) {
                            if (height < 310 && selectedOption2 != undefined) {
                                $('[data-quickshop]').addClass('active_option_3');
                            } else {
                                $('[data-quickshop]').removeClass('active_option_3');
                            }  
                        }else {
                            if (height < 370 && selectedOption2 != undefined) {
                                $('[data-quickshop]').addClass('active_option_3');
                            } else {
                                $('[data-quickshop]').removeClass('active_option_3');
                            }   
                        }
                    } else {
                        if ($body.hasClass('product-card-layout-01')) {
                            if (height < 310) {
                                if (selectedOption1 != undefined || selectedOption2 != undefined) {
                                    $('[data-quickshop]').removeClass('active_option_3');
                                } else {
                                    $('[data-quickshop]').addClass('active_option_3');
                                }
                            } else {
                                $('[data-quickshop]').removeClass('active_option_3');
                            }   
                        } else {
                            if (height < 370) {
                                if (selectedOption1 != undefined || selectedOption2 != undefined) {
                                    $('[data-quickshop]').removeClass('active_option_3');
                                } else {
                                    $('[data-quickshop]').addClass('active_option_3');
                                }
                            } else {
                                $('[data-quickshop]').removeClass('active_option_3');
                            }   
                        }
                    }
                }
            }

            if ($body.hasClass('quick_shop_option_2') && $('.productListing').hasClass('productList')) {
                selectedOption1 = product.find('[data-option-index="0"]').eq('1').find('input:checked').val();
            } else {
                if ($('.productListing').hasClass('productList') && $win.width() < 767) {
                    selectedOption1 = product.find('[data-option-index="0"]').eq('1').find('input:checked').val();
                    selectedOption2 = product.find('[data-option-index="1"]').eq('1').find('input:checked').val();
                } else {
                    selectedOption1 = product.find('[data-option-index="0"]').eq('0').find('input:checked').val();
                }
            }
            
            if (productJson != undefined) {
                variantList = productJson.variants;
            }

            productOption.each((index, element) => {
                var optionIndex = $(element).data('option-index'),
                    swatch = $(element).find('.swatch-element');

                switch (optionIndex) {
                    case 0: 
                        swatch.each((idx, elt) => {
                            var item = $(elt),
                                swatchVal = item.data('value');

                            var optionSoldout = variantList.find((variant) => {
                                if (optionColor == 1) {
                                    return variant.option2 == swatchVal && variant.available;
                                } else {
                                    if (optionColor == 2) {
                                        return variant.option3 == swatchVal && variant.available;
                                    } else {
                                        return variant.option1 == swatchVal && variant.available;
                                    }
                                }
                            });

                            var optionUnavailable = variantList.find((variant) => {
                                if (optionColor == 1) {
                                    return variant.option2 == swatchVal;
                                } else {
                                    if (optionColor == 2) {
                                        return variant.option3 == swatchVal;
                                    } else {
                                        return variant.option1 == swatchVal;
                                    }
                                }
                            });

                            if(optionSoldout == undefined){
                                if (optionUnavailable == undefined) {
                                    item.removeClass('soldout available').addClass('unavailable');
                                    item.find('input[type="radio"]').prop('checked', false);
                                } else {
                                    item
                                        .removeClass('unavailable available')
                                        .addClass('soldout')
                                        .find('.single-action')
                                        .attr('data-variant-id', optionUnavailable.title);
                                    item.find('input[type="radio"]').prop('disabled', false);
                                }
                            } else {
                                item.removeClass('soldout unavailable').addClass('available');
                                item.find('input[type="radio"]').prop('disabled', false);
                            }
                        });

                        break;
                    case 1:
                        swatch.each((idx, elt) => {
                            var item = $(elt),
                                swatchVal = item.data('value');

                            var optionSoldout = variantList.find((variant) => {
                                if (optionColor == 1) {
                                    return variant.option2 == selectedOption1 && variant.option1 == swatchVal && variant.available;
                                } else {
                                    if (optionColor == 2) {
                                        return variant.option3 == selectedOption1 && variant.option1 == swatchVal && variant.available;
                                    } else {
                                        return variant.option1 == selectedOption1 && variant.option2 == swatchVal && variant.available;
                                    }
                                }
                            });

                            var optionUnavailable = variantList.find((variant) => {
                                if (optionColor == 1) {
                                    return variant.option2 == selectedOption1 && variant.option1 == swatchVal;
                                } else {
                                    if (optionColor == 2) {
                                        return variant.option3 == selectedOption1 && variant.option1 == swatchVal;
                                    } else {
                                        // CHECK: find the error and value of selectedOption1 
                                        return variant.option1 == selectedOption1 && variant.option2 == swatchVal;
                                    }
                                }
                            });

                            if(optionSoldout == undefined){
                                if (optionUnavailable == undefined) {
                                    item.removeClass('soldout available').addClass('unavailable');
                                    item.find('input[type="radio"]').prop('checked', false);
                                } else {
                                    item
                                        .removeClass('unavailable available')
                                        .addClass('soldout')
                                        .find('.single-action-selector')
                                        .attr('data-variant-id', optionUnavailable.title);
                                    item.find('input[type="radio"]').prop('disabled', false);
                                }
                            } else {
                                item.removeClass('soldout unavailable').addClass('available');
                                item.find('input[type="radio"]').prop('disabled', false);
                            }
                            
                        });
                        break;
                    case 2:
                        swatch.each((idx, elt) => {
                            var item = $(elt),
                                swatchVal = item.data('value');

                            var optionSoldout = variantList.find((variant) => {
                                if (optionColor == 1) {
                                    return variant.option2 == selectedOption1 && variant.option1 == selectedOption2 && variant.option3 == swatchVal && variant.available;
                                } else {
                                    if (optionColor == 2) {
                                        return variant.option3 == selectedOption1 && variant.option1 == selectedOption2 && variant.option2 == swatchVal && variant.available;
                                    } else {
                                        return variant.option1 == selectedOption1 && variant.option2 == selectedOption2 && variant.option3 == swatchVal && variant.available;
                                    }
                                }
                            });

                            var optionUnavailable = variantList.find((variant) => {
                                if (optionColor == 1) {
                                    return variant.option2 == selectedOption1 && variant.option1 == selectedOption2 && variant.option3 == swatchVal;
                                } else {
                                    if (optionColor == 2) {
                                        return variant.option3 == selectedOption1 && variant.option1 == selectedOption2 && variant.option2 == swatchVal;
                                    } else {
                                        return variant.option1 == selectedOption1 && variant.option2 == selectedOption2 && variant.option3 == swatchVal;
                                    }
                                }
                            });

                            if(optionSoldout == undefined){
                                if (optionUnavailable == undefined) {
                                    item.removeClass('soldout available').addClass('unavailable');
                                    item.find('input[type="radio"]').prop('checked', false);
                                } else {
                                    item
                                        .removeClass('unavailable available')
                                        .addClass('soldout')
                                        .find('.single-action-selector')
                                        .attr('data-variant-id', optionUnavailable.title);
                                    item.find('input[type="radio"]').prop('disabled', false);
                                }
                            } else {
                                item.removeClass('unavailable soldout').addClass('available');
                                item.find('input[type="radio"]').prop('disabled', false);
                            }
                        });

                        break;  
                }
            });

            variantPopup.find('.selector-wrapper:not(.option-color)').each((index, element) => {
                var item = $(element);

                if (item.find('.swatch-element').find('input:checked').length < 1) {
                    if (item.find('.swatch-element.available').length > 0) {
                        item.find('.swatch-element.available').eq('0').find('.single-label').trigger('click');
                    } else {
                        item.find('.swatch-element.soldout').eq('0').find('.single-label').trigger('click');
                    }
                }
            });

  
            if ($body.hasClass('quick_shop_option_2')) {
                var variantId = product.find('[data-quickshop]').eq(1).find('[name="id"]').val();
                var arrayInVarName = `quick_view_inven_array_${productId}`,
                    inven_array = window[arrayInVarName]; 
                  
                if(inven_array != undefined) {
                    var inven_num = inven_array[variantId],
                        inventoryQuantity = parseInt(inven_num),
                        quantityInput = product.find('input[name="quantity"]').eq(0);
                    
                    quantityInput.attr('data-inventory-quantity', inventoryQuantity);
                    if (quantityInput.val() > inventoryQuantity) {
                        if (inventoryQuantity > 0) {
                            quantityInput.val(inventoryQuantity)
                        } else {
                            quantityInput.val(1)
                        }
                    }
                }
            }
        },
        
        initAddToCartQuickShop: function($target, popup){
            var variantId = popup.find('[name="id"]').val(),
                qty = 1;

            halo.actionAddToCart($target, variantId, qty);
            
        },

        initAddToCart: function() {
            $doc.off('click.addToCart').on('click.addToCart', '[data-btn-addtocart]', (event) => {
                event.preventDefault();
                event.stopPropagation();

                var $target = $(event.target),
                    product = $target.parents('.product-item'),
                    MobilePopup_Option_2 = $doc.find('#halo-card-mobile-popup'),
                    ProductQuickShopShown_Option_2 = $doc.find('.quickshop-popup-show');

                if($target.closest('product-form').length > 0){
                    var productForm = $target.closest('form');
                    
                    halo.actionAddToCart2($target, productForm);

                } else {
                    if(!$target.hasClass('is-notify-me') && !$target.hasClass('is-soldout')){
                        var form = $target.parents('form'),
                            variantId = form.find('[name="id"]').val(),
                            qty = form.find('[name="quantity"]').val(),
                            input = form.find('[name="quantity"]').eq(0);
                        if(qty == undefined){
                            qty = 1;
                        }

                        if ($('.recipient-form').length > 0) {
                            $('#product-add-to-cart').trigger("click");
                        } else {
                            halo.actionAddToCart($target, variantId, qty, input);
                        }
                    
                    } else if($target.hasClass('is-notify-me')){
                        halo.notifyInStockPopup($target);
                    }
                }
            });
            
            $doc.on('click', '[data-close-add-to-cart-popup]', (event) => {
                event.preventDefault();
                event.stopPropagation();

                $body.removeClass('add-to-cart-show');
            });


            $doc.on('click', (event) => {
                if($body.hasClass('add-to-cart-show')){
                    if (($(event.target).closest('[data-add-to-cart-popup]').length === 0)) {
                        $body.removeClass('add-to-cart-show');
                    }
                }
            });
        },

        actionAddToCart: function($target, variantId, qty, input){
            var originalMessage = window.variantStrings.submit,
                waitMessage = window.variantStrings.addingToCart,
                successMessage = window.variantStrings.addedToCart;
            
            if($target.hasClass('button-text-change')){
                originalMessage = $target.text();
            }

            $target.addClass('is-loading');

            if($body.hasClass('quick-view-show')){
                Shopify.addItem(variantId, qty, $target, () => {
                    // $target.text(successMessage);
                    if (window.after_add_to_cart.type == 'cart') {
                        halo.redirectTo(window.routes.cart);
                    } else {
                        Shopify.getCart((cartTotal) => {
                            $body.addClass('cart-sidebar-show');
                            halo.updateSidebarCart(cartTotal);
                            $body.find('[data-cart-count]').text(cartTotal.item_count);
                            $target.removeClass('is-loading');
                        });
                    }
                }, input);
            } else if($body.hasClass('template-cart')) {
                Shopify.addItem(variantId, qty, $target, () => {
                    // $target.text(successMessage);
                    halo.redirectTo(window.routes.cart);
                }, input);           
            } else {
                Shopify.addItem(variantId, qty, $target, () => {
                    // $target.text(successMessage);
                    $target.removeClass('is-loading');
                    if ($body.hasClass('quickshop-popup-show') && $body.hasClass('quick_shop_option_3')) {
                        $body.removeClass('quickshop-popup-show');
                        
                        $('.quickshop-popup-show').removeClass('quickshop-popup-show');
                    }

                    if ($body.hasClass('quickshop-list-view-show')) {
                        $body.removeClass('quickshop-list-view-show')
                    }

                    if ($body.hasClass('show-mobile-options')) {
                        $body.removeClass('show-mobile-options');
                        $('.background-overlay').addClass('hold');
                    }

                    if ($body.hasClass('quick_shop_popup_mobile') && $body.hasClass('quick_shop_option_2')) {
                        // setTimeout(() => {
                            $body.removeClass('quick_shop_popup_mobile');
                            $doc.find('#halo-card-mobile-popup').removeClass('show');
                            $doc.find('.quickshop-popup-show').each((index, popup) => {
                                $(popup).removeClass('quickshop-popup-show');
                            })
                        // }, 200);
                    }

                    switch (window.after_add_to_cart.type) {
                        case 'cart':
                            halo.redirectTo(window.routes.cart);

                            break;
                        case 'quick_cart':
                            if(window.quick_cart.show){
                                Shopify.getCart((cart) => {
                                    if( window.quick_cart.type == 'popup'){
                                        // $body.addClass('cart-modal-show');
                                        // halo.updateDropdownCart(cart);
                                    } else {
                                        $body.addClass('cart-sidebar-show');
                                        halo.updateSidebarCart(cart);
                                    }

                                    $target.removeClass('is-loading');
                                    $('.background-overlay').removeClass('hold');
                                });
                            } else {
                                halo.redirectTo(window.routes.cart);
                            }

                            break;
                        case 'popup_cart_1':
                            Shopify.getCart((cart) => {
                                halo.updatePopupCart(cart, 1, variantId);
                                halo.updateSidebarCart(cart);
                                $body.addClass('add-to-cart-show');
                                $target.removeClass('is-loading');
                                $('.background-overlay').removeClass('hold');
                            });

                            break;
                    }
                }, input);
            }
        },

        actionAddToCart2: function($target, productForm) {
            const config = fetchConfig('javascript');
            var originalMessage = window.variantStrings.submit,
                waitMessage = window.variantStrings.addingToCart,
                successMessage = window.variantStrings.addedToCart;
            
            if($target.hasClass('button-text-change')){
                originalMessage = $target.text();
            }

            $target.addClass('is-loading');

            let addToCartForm = document.querySelector('[data-type="add-to-cart-form"]');
            let formData = new FormData(addToCartForm);

            const properties = document.querySelectorAll('[name^="properties"]')

            properties.forEach(property => {
              if (property.value == null) return;
                if (property.type == 'file') {
                  formData.append(property.name, property.files[0])
                } else {
                  formData.append(property.name, property.value)
                }
            })

            const enoughInStock = halo.checkSufficientStock(productForm);
            if (!enoughInStock && $body.hasClass('quickshop-popup-show')) {
                alert(window.cartStrings.addProductOutQuantity);
                $target.removeClass('is-loading');
                return 
            }

            const addItemToCart = (variantId) => {
                fetch(window.Shopify.routes.root + 'cart/add.js', {
                    method: 'POST',
                    body: formData
                })
                .then(response => {
                    return response.json();
                })
                .catch((error) => {
                    console.error('Error:', error);
                })
                .finally(() => {
                    if ($body.hasClass('quickshop-popup-show')) {
                        $body.removeClass('quickshop-popup-show');
                    }
    
                    if($body.hasClass('quick-view-show')){
                        if (window.after_add_to_cart.type == 'cart') {
                            halo.redirectTo(window.routes.cart);
                        } else {
                            Shopify.getCart((cartTotal) => {
                                $body.find('[data-cart-count]').text(cartTotal.item_count);
                                $target.removeClass('is-loading');
                            });
                        }
                    } else {
                        switch (window.after_add_to_cart.type) {
                            case 'cart':
                                halo.redirectTo(window.routes.cart);
                            
                                break;
                            case 'quick_cart':
                                if(window.quick_cart.show){
                                    Shopify.getCart((cart) => {
                                        if( window.quick_cart.type == 'popup'){
                                            // $body.addClass('cart-modal-show');
                                            // halo.updateDropdownCart(cart);
                                        } else {
                                            $body.addClass('cart-sidebar-show');
                                            halo.updateSidebarCart(cart);
                                        }
                                        
                                        $target.removeClass('is-loading');
                                    });
                                } else {
                                    halo.redirectTo(window.routes.cart);
                                }
                                
                                break;
                            case 'popup_cart_1':
                                Shopify.getCart((cart) => {
                                    halo.updatePopupCart(cart, 1, variantId);
                                    halo.updateSidebarCart(cart);
                                    $body.addClass('add-to-cart-show');
                                    $target.removeClass('is-loading');
                                });
    
                                break;
                        }
                    }
                });
            }

            fetch(window.Shopify.routes.root + 'cart.js', {
                method: 'GET',
            })
            .then(response => {
                return response.json();
            }).then(response => { 
                const variantId = parseInt($(addToCartForm).serialize().split('id=')[1])
                const item = response.items.find(item => item.variant_id == variantId)
                const currentQuantity = item?.quantity 
                const currentProductId = item?.product_id
                const moreQuantity = parseInt(productForm.find('[data-inventory-quantity]').val()) 
                const maxQuantity = parseInt(productForm.find('[data-inventory-quantity]').data('inventory-quantity'))
                const saleOutStock = document.getElementById('product-add-to-cart').dataset.available === 'true' | false

                if (!currentQuantity || !maxQuantity || saleOutStock) return addItemToCart(variantId)
                var arrayInVarName = `selling_array_${currentProductId}`,
                itemInArray = window[arrayInVarName],
                itemStatus = itemInArray[variantId];
                if(itemStatus == 'deny') {
                    if (currentQuantity + moreQuantity > maxQuantity)  {
                        if(maxQuantity < 0){
                            addItemToCart(variantId);
                        } else {
                            const remainingQuantity = maxQuantity - currentQuantity 
                            throw new Error(`You ${remainingQuantity > 0 ? `can only add ${remainingQuantity}` : 'cannot add'} more of the items into the cart`)
                        }
                    } else {
                        addItemToCart(variantId);
                    }
                } else {
                  addItemToCart(variantId);
                }
            }).catch(err => {
                this.showWarning(err)
            }).finally(() => {
                $target.removeClass('is-loading');
            })
        },

        checkSufficientStock: function(productForm) {
            const maxValidQuantity = productForm.find('[data-inventory-quantity]').data('inventory-quantity')
            const inputQuantity = parseInt(productForm.find('[data-inventory-quantity]').val())
            
            return maxValidQuantity >= inputQuantity
        },  

        updateContentQuickshopOption3: function(handle){
            var quickShopPopup = $('#halo-quickshop-popup-option-3'),
                quickShopPopupContent = quickShopPopup.find('.halo-popup-content');

            $.ajax({
                type: 'get',
                url: window.routes.root + '/products/' + handle + '?view=ajax_quick_shop',
                beforeSend: function () {
                    $('[data-quick-view-popup] .halo-popup-content').empty()
                },
                success: function (data) {
                    quickShopPopupContent.html(data);       
                },
                error: function (xhr, text) {
                    // alert($.parseJSON(xhr.responseText).description);
                    halo.showWarning($.parseJSON(xhr.responseText).description);
                },
                complete: function () {
                    var $scope = quickShopPopup.find('.quickshop');
                    
                    halo.productImageGallery($scope);
                    setTimeout(() => {
                        $body.addClass('quickshop-popup-show');
                    }, 150)
                }
            });
        },
        
        appendProductQuickShopOption2: function(product) {
            //  Append Product Popup Quick Shop 2 Show Mobile
            if (window.innerWidth <= 767) {
                var quickshopMobilePopup = $doc.find('#halo-card-mobile-popup');
                var quickshopForm = product.clone();
                quickshopMobilePopup.find('.halo-popup-content').empty();
                quickshopForm.find('.card-product__group').remove();
                quickshopMobilePopup.find('.halo-popup-content').append(quickshopForm);

                var form = quickshopMobilePopup.find('[data-quickshop] form').eq('0');
                var mobilePopupId = form.attr('id') + 'mobile';
                form.attr('id', mobilePopupId);
                var optionInputs = form.find('.single-option');
                var optionLabels = form.find('.single-label');

                optionInputs.each((index, optionInput) => {
                    $(optionInput).attr('id', $(optionInput).attr('id') + '-mobile');
                })
                
                optionLabels.each((index, optionLabel) => {
                    $(optionLabel).attr('for', $(optionLabel).attr('for') + '-mobile');
                })

                quickshopMobilePopup.addClass('show');

                $doc.on('click', (e) => {
                    var $target = $(e.target)
                    if ($target.hasClass('background-overlay')) {
                        quickshopMobilePopup.removeClass('show');
                        $body.removeClass('quick_shop_popup_mobile');
                        product.removeClass('quickshop-popup-show');
                    }
                })
            } 
        },

        isRunningInIframe: function() {
            try {
                return window.self !== window.top;
            } catch (e) {
                return true;
            }
        },

        redirectTo: function(url){
            if (halo.isRunningInIframe() && !window.iframeSdk) {
                window.top.location = url;
            } else {
                window.location = url;
            }
        },

        initQuickCart: function() {
            if(window.quick_cart.show){
                if(window.quick_cart.type == 'popup'){
                    // halo.initDropdownCart();
                } else {
                    halo.initSidebarCart();
                }
            }

            halo.initEventQuickCart();
        },

        initEventQuickCart: function(){
            halo.removeItemQuickCart();
            halo.updateQuantityItemQuickCart();
            halo.editQuickCart();
        },

        productCollectionCartSlider: function(){
            var productCart = $('[data-product-collection-cart]');

            productCart.each((index, element) => {
                var self = $(element),
                    productGrid = self.find('.products-carousel'),
                    itemDots = productGrid.data('item-dots'),
                    itemArrows = productGrid.data('item-arrows');

                if(productGrid.length > 0){
                    if(!productGrid.hasClass('slick-initialized')){
                        productGrid.slick({
                            mobileFirst: true,
                            adaptiveHeight: false,
                            infinite: false,
                            vertical: false,
                            slidesToShow: 1,
                            slidesToScroll: 1,
                            dots: true,
                            arrows: false,
                            nextArrow: window.arrows.icon_next,
                            prevArrow: window.arrows.icon_prev,
                            rtl: window.rtl_slick,
                            responsive: [
                            {
                                breakpoint: 1025,
                                settings: {
                                    dots: itemDots,
                                    arrows: itemArrows
                                }
                            }]
                        });
                    }
                }
            });
        },

        updatePopupCart: function(cart, layout, variantId) {
            var item = cart.items.filter(item => item.id == variantId)[0],
                popup = $('[data-add-to-cart-popup]'),
                product = popup.find('.product-added'),
                productTitle = product.find('.product-title'),
                productImage = product.find('.product-image'),
                title = item.title || item.product_title,
                image = item.featured_image,
                img = '<img src="'+ image.url +'" alt="'+ image.alt +'" title="'+ image.alt +'"/>';

            productImage.attr('href', item.url).html(img);

            productTitle
                .find('.title')
                .attr('href', item.url)
                .empty()
                .append(title);

            Shopify.getCart((cartTotal) => {
                $body.find('[data-cart-count]').text(cartTotal.item_count);
            });
        },

        initSidebarCart: function() {
            var cartIcon = $('[data-cart-sidebar]');
            let checkInitSideBarCart = true;
            cartIcon.on('click', () => {
                if (!checkInitSideBarCart) return
                checkInitSideBarCart = false
                Shopify.getCart((cart) => {
                    halo.updateSidebarCart(cart);
                })
                if ($('body').hasClass('cursor-fixed__show')){
                    window.sharedFunctionsAnimation.onEnterButton();
                    window.sharedFunctionsAnimation.onLeaveButton();
                }
            })
            if ($body.hasClass('template-cart')) {
                cartIcon.on('click', (event) => {
                    event.preventDefault();
                    event.stopPropagation();

                    $('html, body').animate({
                        scrollTop: 0
                    }, 700);
                });
            } else {
                cartIcon.on('click', (event) => {
                    event.preventDefault();
                    event.stopPropagation();
                    
                    $body.addClass('cart-sidebar-show');
                });
            }

            $doc.on('click', '[data-close-cart-sidebar]', (event) => {
                event.preventDefault();
                event.stopPropagation();

                if ($body.hasClass('cart-sidebar-show')) {
                    $body.removeClass('cart-sidebar-show');
                }
            });

            $body.on('click', '.background-overlay', (event) => {
                if ($body.hasClass('cart-sidebar-show') && !$body.hasClass('edit-cart-show') && !$body.hasClass('term-condition-show') && !$body.hasClass('has-warning')) {
                    if (($(event.target).closest('#halo-cart-sidebar').length === 0) && 
                        ($(event.target).closest('[data-cart-sidebar]').length === 0) && 
                        ($(event.target).closest('[data-edit-cart-popup]').length === 0) && 
                        ($(event.target).closest('[data-warning-popup]').length === 0) && 
                        ($(event.target).closest('[data-term-condition-popup]').length === 0)){
                        $body.removeClass('cart-sidebar-show');
                    }
                }
            })
        },

        updateSidebarCart: function(cart) {
            if(!$.isEmptyObject(cart)){
                const $cartDropdown = $('#halo-cart-sidebar .halo-sidebar-wrapper .previewCart-wrapper');
                const $cartLoading = '<div class="loading-overlay loading-overlay--custom">\
                        <div class="loading-overlay__spinner">\
                            <svg aria-hidden="true" focusable="false" role="presentation" class="spinner" viewBox="0 0 66 66" xmlns="http://www.w3.org/2000/svg">\
                                <circle class="path" fill="none" stroke-width="6" cx="33" cy="33" r="30"></circle>\
                            </svg>\
                        </div>\
                    </div>';
                const loadingClass = 'is-loading';

                $cartDropdown
                    .addClass(loadingClass)
                    .prepend($cartLoading);

                $.ajax({
                    type: 'GET',
                    url: window.routes.root + '/cart?view=ajax_side_cart',
                    cache: false,
                    success: function (data) {
                        var response = $(data);

                        $cartDropdown
                            .removeClass(loadingClass)
                            .html(response);

                        halo.dispatchChangeForShippingMessage();
                    },
                    error: function (xhr, text) {
                        halo.showWarning($.parseJSON(xhr.responseText).description);
                    },
                    complete: function () {
                        $body.find('[data-cart-count]').text(cart.item_count);
                        if (cart.item_count == 1){
                            $body.find('[data-cart-text]').text(window.cartStrings.item);
                        } else {
                            $body.find('[data-cart-text]').text(window.cartStrings.items);
                        }
                        halo.productCollectionCartSlider();
                        halo.updateGiftWrapper();
                        if (halo.checkNeedToConvertCurrency()) {
                          Currency.convertAll(window.shop_currency, $('#currencies .active').attr('data-currency'), 'span.money', 'money_format');
                        };
                        document.dispatchEvent(new CustomEvent('cart-update', { detail: cart }));
                        if ($('body').hasClass('cursor-fixed__show')){
                            window.sharedFunctionsAnimation.onEnterButton();
                            window.sharedFunctionsAnimation.onLeaveButton();
                        }
                    }
                });
            }
        },

        dispatchChangeForShippingMessage: function() {
            document.querySelectorAll('[data-free-shipping-wrapper]').forEach(freeShippingWrapper => {
                const changeEvent = new Event('change', { bubbles: true })
                freeShippingWrapper.dispatchEvent(changeEvent);
            })
        },

        updateGiftWrapper: function() {
            let debounce 
            $('#gift-wrapping').off('click').on('click', (event) => {
                event.stopPropagation()
                event.preventDefault()
                const $target = $(event.currentTarget);
                clearTimeout(debounce)
                debounce = setTimeout(() => {
                    const variantId = event.target.dataset.giftId;
                    Shopify.addItem(variantId, 1, $target, () => {
                        Shopify.getCart((cart) => {
                            halo.updateSidebarCart(cart);
                        });
                    }); 
                }, 250)
            });

            $('#cart-gift-wrapping').off('click').on('click', (event) => {
                event.stopPropagation()
                event.preventDefault()

                var $target = $(event.currentTarget),
                    text = $target.attr('data-adding-text');
                $target.text(text);

                clearTimeout(debounce)
                debounce = setTimeout(() => {
                    const variantId = event.target.dataset.giftId;
                    Shopify.addItem(variantId, 1, $target, () => {
                        Shopify.getCart((cart) => {
                            halo.updateCart(cart)
                        });
                    }); 
                }, 250)
            });
        },

        removeItemQuickCart: function () {
            $doc.on('click', '[data-cart-remove]', (event) => {
                event.preventDefault();
                event.stopPropagation();

                var $target = $(event.currentTarget),
                    productId = $target.attr('data-cart-remove-id'),
                    text = $('#cart-gift-wrapping').attr('data-add-text'),
                    productLine = $target.data('line'),
                    index = $target.data('index');

                $('#cart-gift-wrapping').text(text);

                Shopify.removeItem(productLine, index, (cart) => {
                    if($body.hasClass('template-cart')){
                        halo.updateCart(cart);
                    } else if($body.hasClass('cart-modal-show')){
                        // halo.updateDropdownCart(cart);
                    } else if($body.hasClass('cart-sidebar-show')) {
                        halo.updateSidebarCart(cart);
                    }
                });
            });
        },

        updateCart: function(cart){
            if(!$.isEmptyObject(cart)){
                const $sectionId = $('#main-cart-items').data('id');
                const $cart = $('[data-cart]')
                const $cartContent = $cart.find('[data-cart-content]');
                const $cartTotals = $cart.find('[data-cart-total]');
                const $cartLoading = '<div class="loading-overlay loading-overlay--custom">\
                        <div class="loading-overlay__spinner">\
                            <svg aria-hidden="true" focusable="false" role="presentation" class="spinner" viewBox="0 0 66 66" xmlns="http://www.w3.org/2000/svg">\
                                <circle class="path" fill="none" stroke-width="6" cx="33" cy="33" r="30"></circle>\
                            </svg>\
                        </div>\
                    </div>';
                const loadingClass = 'is-loading';

                $cart
                    .addClass(loadingClass)
                    .prepend($cartLoading);

                $.ajax({
                    type: 'GET',
                    url: `/cart?section_id=${$sectionId}`,
                    cache: false,
                    success: function (data) {
                        var jsPreventedData = data.replaceAll('cart-coupon-discount', 'div');
                        var response = $(jsPreventedData);

                        $cart.removeClass(loadingClass);
                        $cart.find('.loading-overlay').remove();

                        if(cart.item_count > 0){
                            var contentCart =  response.find('[data-cart-content] .cart').html(),
                                subTotal = response.find('[data-cart-total] .cart-total-subtotal').html(),
                                grandTotal = response.find('[data-cart-total] .cart-total-grandtotal').html(),
                                savings = response.find('[data-cart-total] .cart-total-savings').html();

                            $cartContent.find('.cart').html(contentCart);
                            $cartTotals.find('.cart-total-subtotal').html(subTotal);
                            $cartTotals.find('.cart-total-grandtotal').html(grandTotal);
                            $cartTotals.find('.cart-total-savings').html(savings);

                            if(response.find('.haloCalculatorShipping').length > 0){
                                var calculatorShipping = response.find('.haloCalculatorShipping');

                                $cart.find('.haloCalculatorShipping').replaceWith(calculatorShipping);
                            }
                        } else {
                            var contentCart =  response.find('#main-cart-items').html(),
                                headerCart =  response.find('.page-header').html();
                                cartCountdownText1 = response.find('.cart-countdown').data('coundown-text-empty-1');
                                cartCountdownText2 = response.find('.cart-countdown').data('coundown-text-empty-2');
                                cartCountdownProductUrl = response.find('.cart-countdown').data('coundown-prd-empty-url');
                                cartCountdownProductTitle = response.find('.cart-countdown').data('coundown-prd-empty-title');
                            var cartCountdownHtml = cartCountdownText1 + ' <a href="'+ cartCountdownProductUrl +'" class="cart-countdown-product link-effect p-relative"><span class="text">'+ cartCountdownProductTitle +'</span></a> ' + cartCountdownText2;

                            $('#main-cart-items').html(contentCart);
                            $('.page-header').html(headerCart);
                            $('.cart-countdown .text-wrap').html(cartCountdownHtml);
                        }
                    },
                    error: function (xhr, text) {
                        halo.showWarning($.parseJSON(xhr.responseText).description);
                    },
                    complete: function () {
                        $body.find('[data-cart-count]').text(cart.item_count);
                        halo.dispatchChangeForShippingMessage();
                        if (halo.checkNeedToConvertCurrency()) {
                            Currency.convertAll(window.shop_currency, $('#currencies .active').attr('data-currency'), 'span.money', 'money_format');
                        }
                        if ($body.hasClass('template-cart')) {
                            const giftWrapping = document.getElementById('cart-gift-wrapping')
                            const isChecked = giftWrapping?.dataset.isChecked
                            const variantId = giftWrapping?.dataset.giftId
                            if (isChecked === 'true') {
                                $('#is-a-gift').hide()
                                const giftCardRemoveButton = document.querySelector(`[data-cart-remove-id="${variantId}"]`)
                                const giftCardQuantityInput = document.querySelector(`[data-cart-quantity-id="${variantId}"]`)

                                giftCardRemoveButton?.addEventListener('click', () => {
                                    giftWrapping.dataset.isChecked = 'false'
                                })

                                giftCardQuantityInput?.addEventListener('change', (e) => {
                                    const value = Number(e.target.value)
                                    if (value  <= 0) {
                                        giftWrapping.dataset.isChecked = 'false'
                                    }
                                })
                            } else {
                                $('#is-a-gift').show()
                            }
                        }
                        
                        document.dispatchEvent(new CustomEvent('cart-update', { detail: cart }));
                    }
                });
            }
        },

        updateQuantityItemQuickCart: function(){
            $doc.on('change', '[data-cart-quantity]', (event) => {
                event.preventDefault();
                event.stopPropagation();

                var $target = $(event.currentTarget),
                    productId = $target.attr('data-cart-quantity-id'),
                    productLine = $target.data('line'),
                    quantity = parseInt($target.val()),
                    stock = parseInt($target.data('inventory-quantity')),
                    index = $target.data('index');
                let enoughInStock = true;
               
                if (stock < quantity && stock > 0) {
                  var arrayInVarName = `cart_selling_array_${event.currentTarget.closest('cart-update-quantity').dataset.product}`,
                    itemInArray = window[arrayInVarName],
                    itemStatus = itemInArray[event.currentTarget.closest('cart-update-quantity').dataset.variant];
                  if(itemStatus == 'deny') {
                    quantity = stock;
                    enoughInStock = false;
                  }
                }

                Shopify.changeItem(productLine, quantity, index, (cart) => {
                    if($body.hasClass('template-cart')){
                        halo.updateCart(cart);
                    } else if($body.hasClass('cart-modal-show')){
                        // halo.updateDropdownCart(cart);
                    } else if($body.hasClass('cart-sidebar-show')) {
                        halo.updateSidebarCart(cart);
                    }
                    if (!enoughInStock) halo.showWarning(`${ window.cartStrings.addProductOutQuantity.replace('[maxQuantity]', quantity) }`)
                });
            });
        },

        editQuickCart: function() {
            let checkLoadEC = true; 

            $doc.on('click', '[data-open-edit-cart]', (event) => {
                event.preventDefault();
                event.stopPropagation();

                var $target = $(event.currentTarget),
                    url = $target.data('edit-cart-url'),
                    itemId = $target.data('edit-cart-id'),
                    itemLine = $target.data('line'),
                    itemIndex = $target.data('index'),
                    quantity = $target.data('edit-cart-quantity'),
                    option = $target.parents('.previewCartItem').find('previewCartItem-variant').text();

                const modal = $('[data-edit-cart-popup]'),
                    modalContent = modal.find('.halo-popup-content');

                if (checkLoadEC) {
                    checkLoadEC = false;
                    const $editCart = document.querySelector('.halo-edit-cart-popup');
                    const urlStyleEC = $editCart.dataset.urlStyleEditCart;
                    const urlScriptEC = $editCart.dataset.urlScriptEditCart;
    
                    halo.buildStyleSheet(urlStyleEC, $editCart);
                    halo.buildScript(urlScriptEC);
                }

                $.ajax({
                    type: 'get',
                    url: url,
                    cache: false,
                    dataType: 'html',
                    beforeSend: function() {
                        if($body.hasClass('template-cart')){
                            // halo.showLoading();
                        }
                    },
                    success: function(data) {
                        modalContent.html(data);
                        modalContent
                            .find('[data-template-cart-edit]')
                            .attr({
                                'data-cart-update-id': itemId,
                                'data-line': itemLine,
                                'data-index': itemIndex
                            });

                        var productItem = modalContent.find('.product-edit-item');
                        productItem.find('input[name="quantity"]').val(quantity);
                    },
                    error: function(xhr, text) {
                        // alert($.parseJSON(xhr.responseText).description);
                        halo.showWarning($.parseJSON(xhr.responseText).description);
                        if($body.hasClass('template-cart')){
                            // halo.hideLoading();
                        }
                    },
                    complete: function () {
                        $body.addClass('edit-cart-show');

                        if($body.hasClass('template-cart')){
                            // halo.hideLoading();
                        }

                        if (halo.checkNeedToConvertCurrency()) {
                            Currency.convertAll(window.shop_currency, $('#currencies .active').attr('data-currency'), 'span.money', 'money_format');
                        };

                        if ($('body').hasClass('cursor-fixed__show')){
                            window.sharedFunctionsAnimation.onEnterButton();
                            window.sharedFunctionsAnimation.onLeaveButton();
                        }
                    }
                });
            });

            $doc.on('click', '[data-close-edit-cart]', (event) => {
                event.preventDefault();
                event.stopPropagation();

                $body.removeClass('edit-cart-show');
            });

            $doc.on('click', (event) => {
                if ($body.hasClass('edit-cart-show')) {
                    if (($(event.target).closest('[data-edit-cart-popup]').length === 0) && ($(event.target).closest('[data-open-edit-cart]').length === 0)){
                        $body.removeClass('edit-cart-show');
                    }
                }
            });

            halo.addMoreItemEditCart();
            halo.addAllItemCartEdit();
        },

        addMoreItemEditCart: function(){
            $doc.on('click', '[data-edit-cart-add-more]', (event) => {
                event.preventDefault();
                event.stopPropagation();

                var itemWrapper = $('[data-template-cart-edit]'),
                    currentItem = $(event.target).parents('.product-edit-item'),
                    count = parseInt(itemWrapper.attr('data-count')),
                    cloneProduct = currentItem.clone().removeClass('product-edit-itemFirst');
                    cloneProductId = cloneProduct.attr('id') + count;

                cloneProduct.attr('id', cloneProductId);

                halo.updateClonedProductAttributes(cloneProduct, count);

                cloneProduct.insertAfter(currentItem);

                count = count + 1;
                itemWrapper.attr('data-count', count);

                if ($('body').hasClass('cursor-fixed__show')){
                    window.sharedFunctionsAnimation.onEnterButton();
                    window.sharedFunctionsAnimation.onLeaveButton();
                }
            });

            $doc.on('click', '[data-edit-cart-remove]', (event) => {
                event.preventDefault();
                event.stopPropagation();

                var currentItem = $(event.target).parents('.product-edit-item');

                currentItem.remove();
            });
        },

        updateClonedProductAttributes: function(product, count){
            var form = $('.shopify-product-form', product),
                formId = form.attr('id'),
                newFormId = formId + count;

            form.attr('id', newFormId);

            $('.product-form__radio', product).each((index, element) => {
                var formInput = $(element),
                    formLabel = formInput.next(),
                    id = formLabel.attr('for'),
                    newId = id + count,
                    formInputName = formInput.attr('name');

                formLabel.attr('for', newId);

                formInput.attr({
                    id: newId,
                    name: formInputName + count
                });
            });
        },

        addAllItemCartEdit: function() {
            $doc.on('click', '#add-all-to-cart', (event) => {
                event.preventDefault();
                event.stopPropagation();

                var $target = $(event.currentTarget),
                    cartEdit = $('[data-template-cart-edit]'),
                    product = cartEdit.find('.product-edit-item.isChecked'),
                    productId = cartEdit.attr('data-cart-update-id'),
                    productLine = cartEdit.data('line'),
                    index = cartEdit.data('index');

                if(product.length > 0){
                    $target.addClass('is-loading');

                    Shopify.removeItem(productLine, index, (cart) => {
                        if(!$.isEmptyObject(cart)) {
                            var productHandleQueue = [];

                            var ajax_caller = function(data) {
                                return $.ajax(data);
                            }

                            product.each((index, element) => {
                                var item = $(element),
                                    variantId = item.find('input[name="id"]').val(),
                                    qty = parseInt(item.find('input[name="quantity"]').val());

                                productHandleQueue.push(ajax_caller({
                                    type: 'post',
                                    url: window.routes.root + '/cart/add.js',
                                    data: 'quantity=' + qty + '&id=' + variantId,
                                    dataType: 'json',
                                    async: false
                                }));
                            });

                            if(productHandleQueue.length > 0) {
                                $.when.apply($, productHandleQueue).done((event) => {
                                    setTimeout(function(){ 
                                        $target.removeClass('is-loading');
                                    }, 1000);

                                    Shopify.getCart((cart) => {
                                        $body.removeClass('edit-cart-show');

                                        if($body.hasClass('template-cart')){
                                            halo.updateCart(cart);
                                        } else if($body.hasClass('cart-modal-show')){
                                            // halo.updateDropdownCart(cart);
                                        } else if($body.hasClass('cart-sidebar-show')) {
                                            halo.updateSidebarCart(cart);
                                        }
                                    });
                                });
                            }
                        }
                    });
                } else {
                    alert(window.variantStrings.addToCart_message);
                }
            });
        },

        initNotifyInStock: function() {
            $doc.on('click', '[data-open-notify-popup]', (event) => {
                event.preventDefault();
                event.stopPropagation();

                var $target = $(event.currentTarget);

                halo.notifyInStockPopup($target);
            });

            $doc.on('click', '[data-close-notify-popup]', (event) => {
                