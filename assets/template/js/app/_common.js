﻿/**
 * @description Основные скрипты
 * version: 1.0.1
 */

$(function () {


    var navigationTooltipsArr = [],
        anchorsArr = [];
    $('.section').each(function(n){
        navigationTooltipsArr[n] = $(this).data('tooltip');  // Берем название секции из атрибута data-tooltip
        anchorsArr[n] = $(this).data('anchor');  // Берем название анкора из атрибута data-anchor
    });

    //решает глюк, когда ссылки не нажимались на телефоне или в браузере
    var scrollOptions = {click: false,  wheelStep: 20, interactiveScrollbars: true};
    if (Modernizr.touch) {
        scrollOptions.click = true;
    }
    $('#fullpage').fullpage({
        lockAnchors:true,
        anchors: anchorsArr,
        sectionsColor: ['#fff', '#fff', '#fff','#fff', '#fff', '#fff','#fff'],
        scrollOverflow: true,
        // scrollOverflowOptions: {
        //     interactiveScrollbars: true,
        //     click: false
        // },
        scrollOverflowOptions: scrollOptions,
        navigation: true,
        navigationPosition: 'right',
        navigationTooltips: navigationTooltipsArr,
        // paddingTop: '222px',
        paddingBottom: '30px',
        loopBottom: true,
        controlArrows: false,
        loopHorizontal: false,
        afterLoad: function(){
            $.fn.fullpage.reBuild(); // чтоб не зависал скролл

            //убирать точки, если слайд только один
            if ( $('#fullpage .section').size()> 1 ){
                $('#fp-nav').show();
            }

        },
        onLeave: function(){

            /* СЧЕТЧИК партнеров на главной - моб.версия */
            try {
                $('.partners-counter-red span').countTo({from: 10, to: 10246, speed: 1000});
                counter_flag =true;
            } catch(err) {

            }
        },
        afterRender: function(){
            //Устанавливает отступ от бокового меню для контента
            contentPadding();

            // класс, чтобы скрывать пункт бокового меню
            $('.section').each(function(n){
                if ( $(this).hasClass('hideTooltip')){
                    $('#fp-nav li').eq(n).addClass('hideTooltip');
                }
            });

        }
    });
    // чтоб не зависал скролл
    setTimeout(function() {
        $.fn.fullpage.reBuild();
    }, 500);


    //Устанавливает отступ от бокового меню для контента
    function contentPadding(){
        var contentPadding, //отступ
            withParametr = ($(document).width() - $('.section .container').outerWidth())/2, //параметр, вычесленный из ширины окна и бокового меню
            rightMenuWidth = $('#fp-nav').width() + 17, //ширина бокового меню без надписей
            rightMenuTooltipWidth = 0; //ширина надписи

        $('#fp-nav .fp-tooltip').each(function() {
            if($(this).width() > rightMenuTooltipWidth){
                rightMenuTooltipWidth = $(this).width();
            }
        });

        if ( withParametr < 265 && $('.fp-tooltip').css('display')==='block' ){
            contentPadding = (rightMenuWidth + rightMenuTooltipWidth + 15) - withParametr;
            $('.section .container').css('paddingRight',contentPadding);
        } else{
            $('.section .container').css('paddingRight',15);
        }
    }
    $( window ).resize(function() {
        contentPadding();
    });
    //Устанавливает отступ от бокового меню для контента


    /* Красная линия в верхнем меню */
    var header_red_line = $('.header-red-line'),
        red_line_current_width, //текущее положение красной линии
        menu_top_active_offset_left;


    if($('.menu-top .active').offset() !== undefined){
        menu_top_active_offset_left = $('.menu-top .active').offset().left + $('.menu-top .active').width();
    } else{
        menu_top_active_offset_left = 0;
    }

    if( $('.menu-top .active').size()==0 ){
        menu_top_active_offset_left = $('.header-part1 .logo').offset().left + $('.header-part1 .logo').width();
    }

    // анимация к активному пункту меню при загрузке страницы
    header_red_line.animate({
        width: menu_top_active_offset_left
    }, 600, function() {
        red_line_current_width = header_red_line.width();
    });

    //ховер
    $('.menu-top li, .header-part1 .logo').hover(
        function() {
            header_red_line.stop().animate({
                width: $(this).offset().left + $(this).width()
            }, 450);
        }, function() {
            header_red_line.stop().animate({
                width: menu_top_active_offset_left
            }, 450);
        }
    );

    function header_red_line_func(){


        //  проверка, сушествует ли отступ
        if($('.menu-top .active').offset() !== undefined){
            menu_top_active_offset_left = $('.menu-top .active').offset().left + $('.menu-top .active').width();
        } else{
            menu_top_active_offset_left = 0;
        }

        //если на главной, то линия к лого
        if( $('.menu-top .active').size()==0 ){
            menu_top_active_offset_left = $('.header-part1 .logo').offset().left + $('.header-part1 .logo').width();
        }
    }

    //пересчет при ресайзе окна
    $( window ).resize(function() {

        //  проверка, сушествует ли отступ
        if($('.menu-top .active').offset() !== undefined) {
            header_red_line.width($('.menu-top .active').offset().left + $('.menu-top .active').width());
        }

        //если на главной, то линия к лого
        if( $('.menu-top .active').size()==0 ){
            header_red_line.width($('.header-part1 .logo').offset().left + $('.header-part1 .logo').width());
        }

        header_red_line_func();
    });
    /* /Красная линия в верхнем меню */


    /* Альтернативное меню второго уровня на стр. Бизнес-портфель и Соц.проекты - с всплыв. кратиким описанием*/
    if( $('.menu-top2-alternative-container').size()>0 ){
        var menu_top2_alternative_description_block = $('.menu-top2-alternative-description-block');

        $('.menu-top2-alternative ul li a').hover( //при наведении на пункт меню
            function() {
                menu_top2_alternative_description_block.html(''); //чистим блок
                menu_top2_alternative_description_block.hide(); // скрываем его
                $(this).parent().find('.hidden-descr .item').clone().prependTo($('.menu-top2-alternative-description-block')); // клонируем в него нужное описание
                $('.menu-top2-alternative-description-block').stop().fadeIn(); //и плавно показываем
                $.fn.fullpage.reBuild(); // произведем пересчет плагина, чтоб была нормальная длина скролла
            },
            function() {
                menu_top2_alternative_description_block.fadeOut(); // плавно скрываем блок
            }
        );
    }
    /* /Альтернативное меню второго уровня на стр. Бизнес-портфель и Соц.проекты - с всплыв. кратиким описанием*/


    /* Адаптивное верхнее меню */
    try {
        var $container = $('body');
        $('.menu-mobile').eq(0).slicknav({
            label: '',
            prependTo: '.header-mobile',
            closeOnClick:true,
            allowParentLinks: true,
            duplicate:false,
            beforeOpen: function(e) {
                if(e.hasClass('slicknav_btn')){
                    $container.addClass('slicknav_open');
                }
            },
            beforeClose: function(e) {
                if(e.hasClass('slicknav_btn')){
                    $container.removeClass('slicknav_open');
                }
            }
        });
    } catch (err) {

    }
    /* /Адаптивное верхнее меню */


    // задаем одинаковую высоту для элементов
    $(".article-list .text-container").matchHeight();
    $(".zakupki-list .item").matchHeight();
    $(".catalog-management .item").matchHeight();
    $(".president .col-sm-4").matchHeight();
    // /задаем одинаковую высоту для элементов


    //SVG Fallback
    if(!Modernizr.svg) {
        $(".menu-top2 img[src*='svg']").attr("src", function() {
            return $(this).attr("src").replace(".svg", ".png");
        });
    }


    // Отменить перетаскивание картинок и ссылок
    $("img, a").on("dragstart", function (event) {
        event.preventDefault();
    });


    /* /fancybox3 beta1 */
    try {
        if ($("a").is(".fancybox-thumb")) {

            /* Подрубаем галерею */
            $(".fancybox-thumb").fancybox({
                openEffect: 'none',
                closeEffect: 'elastic',
                prevEffect: 'fade',
                nextEffect: 'fade',
                //theme : 'dark',
                //locked : false,
                padding: 0,
                caption: {
                    type: 'outside'
                },
                arrows: '!isTouch',
                helpers: {
                    thumbs: {
                        width: 50,
                        height: 50
                    }
                },
                locale: 'ru',
                locales: {
                    'ru': {
                        CLOSE: 'Закрыть',
                        NEXT: 'Следующий',
                        PREV: 'Предыдущий',
                        ERROR: 'Запрашиваемый слайд не может быть загружен.<br/> Пожалуйста, повторите попытку позже.',
                        EXPAND: 'Показать оригинальный размер',
                        SHRINK: 'Вписать в экран',
                        PLAY_START: 'Просмотр слайдшоу',
                        PLAY_STOP: 'Поставить показ слайдов на паузу'
                    }
                },
                // размытие
                beforeLoad: function() {
                    $('header, #fullpage, footer').addClass('blur');



                },
                afterLoad: function() {
                    //счетчик картинок (если их больше чем одна)
                    if ( this.group.length > 1){
                        var fancybox_pic_counter = (this.index + 1) + ' из ' + this.group.length;
                        // this.title =   this.title + '<div class="fancybox_pic_counter">' + fancybox_pic_counter + '</div>';

                        if( $('.fancybox_pic_counter').size() == 0){

                            $('body').append('<div class="fancybox_pic_counter">' + fancybox_pic_counter + '</div>');
                        } else {
                            $('.fancybox_pic_counter').html(fancybox_pic_counter);
                        }
                    }
                },
                beforeClose: function() {
                    $('header, #fullpage, footer').removeClass('blur');
                    $('.fancybox_pic_counter').remove();
                }
            });

            /* Открываем автоматом по id через класс */
            var start_id = window.location.href.indexOf("#");
            if (start_id > 0) {
                var id = window.location.href.substring(start_id + 1);
                $('a.fancybox-thumb.id' + id).click();
            }

            /* обновляем при ресайзе */
            $(window).resize(function () {
                $.fancybox.update();
            });
        }
    } catch (err) {

    }
    /* /fancybox3 beta1 */


    /* Подсчет кол-ва картинок в ленте */
    $('.article-list .item, .article-inner .item, .main-press .item').each(function() {
        var articleImg =  $(this).find('.img-container img').size(), //берем основную картинку
            articleImgLink = $(this).find('.hidden-imgs a').size(); //берем число дополнительных картинок

        $(this).find('.count').html(articleImg + articleImgLink); //скаладываем и записываем
    });
    /* /Подсчет кол-ва картинок в ленте */


    /* Табы */
    $('.tabs-controls > .item').on('click', function (e) {
        e.preventDefault();

        var item = $(this),
            contentItem = $(this).parent().parent().find('.tabs-list > .item'),
            itemPosition = item.index();

        contentItem.eq(itemPosition)
            .add(item)
            .addClass('active')
            .siblings()
            .removeClass('active');

        $.fn.fullpage.reBuild(); // произведем пересчет плагина, чтоб была нормальная длина скролла
    });
    /* /Табы */


    /*file_upload custom*/
    $( ".item-form-element .file_upload" ).each(function( index ) {
        var wrapper = $(this),
            inp = wrapper.find( "input" ),
            btn = wrapper.find( "button" ),
            lbl = wrapper.find( "div" );

        // Crutches for the :focus style:
        btn.focus(function(){
            wrapper.addClass( "focus" );
        }).blur(function(){
            wrapper.removeClass( "focus" );
        });

        // Yep, it works!
        btn.add( lbl ).click(function(){
            inp.click();
        });

        var file_api = ( window.File && window.FileReader && window.FileList && window.Blob ) ? true : false;

        inp.change(function(){

            var file_name;
            if( file_api && inp[ 0 ].files[ 0 ] )
                file_name = inp[ 0 ].files[ 0 ].name;
            else
                file_name = inp.val().replace( "C:\\fakepath\\", '' );
            if( ! file_name.length )
                return;

            if( lbl.is( ":visible" ) ){
                lbl.text( file_name );
                // btn.text( "Выбрать" );
            }else
                btn.text( file_name );
        }).change();
    });


    /* /file_upload custom*/


    /* Всплывающие формы*/
    // закупки
    var popup_number,
        zakupka_title,
        zakupka_city;

    if ( $('.zakupki-list').size()>0 ){
        $( ".pupup-btn" ).click(function(e) {
            e.preventDefault();
            popup_number = $(this).closest('.item').find('.number').text();
            zakupka_title = $(this).closest('.item').find('.title').text();
            zakupka_city = $(this).closest('.item').find('.info').text();

            $('.inner-form-popup').find('.number-programm').text(popup_number);
            $('.inner-form-popup').find('.number-programm-input').val(popup_number);

            $('.inner-form-popup').find('.zakupka-title').text(zakupka_title);
            $('.inner-form-popup').find('.zakupka-title-input').val(zakupka_title);

            $('.inner-form-popup').find('.zakupka-city').text($.trim(zakupka_city));
            $('.inner-form-popup').find('.zakupka-city-input').val($.trim(zakupka_city));
        });
    }

    if ( $('.zakupki-inner').size()>0 ){
        $( ".zakupki-inner .button" ).click(function(e) {
            e.preventDefault();
            popup_number = $(this).closest('.zakupki-inner').find('.number').text();
            zakupka_title = $(this).closest('.zakupki-inner').find('h1').text();
            zakupka_city = $(this).closest('.zakupki-inner').find('.info').text();

            $('.inner-form-popup').find('.number-programm').text(popup_number);
            $('.inner-form-popup').find('.number-programm-input').val(popup_number);

            $('.inner-form-popup').find('.zakupka-title').text(zakupka_title);
            $('.inner-form-popup').find('.zakupka-title-input').val(zakupka_title);

            $('.inner-form-popup').find('.zakupka-city').text($.trim(zakupka_city));
            $('.inner-form-popup').find('.zakupka-city-input').val($.trim(zakupka_city));
        });
    }
    /* /Всплывающие формы*/


    /* Анимированная кнопка-гамбургер для мобильной версии */
    $('.cmn-toggle-switch').click(function(e) {
        e.preventDefault();
        $(this).toggleClass('active');
        $( ".slicknav_btn " ).trigger( "click" );
    });

    //сворачиваеие кнопки при переходе по пункту меню
    $('.slicknav_menu a:not(".slicknav_row, .slicknav_btn")').click(function(e) {
        $('.cmn-toggle-switch').removeClass('active');
    });
    /* /Анимированная кнопка-гамбургер для мобильной версии */


    /* Index Owl Slider */
    $(function() {
        if( $(".index_slider .owl-carousel").is("div") ){

            var owl =  $('.index_slider .owl-carousel');

            owl.owlCarousel({
                items: 1,
                loop: false,
                rewind: true,
                margin: 10,
                autoplay: true,
                autoplayTimeout: 12000,
                autoplayHoverPause: true,
                nav: true,
                navText:  [
                    "",
                    ""
                ],
                dots: false,
                autoHeight: true
            });

            owl.find('.owl-nav .owl-prev').attr('title', 'Предыдущий');
            owl.find('.owl-nav .owl-next').attr('title', 'Следующий');
        }
    });
    /* /Index Owl Slider */


    /* mobile-sections-list */
    $('.mobile-sections-list .item').click(function(e) {

        var faq_mini_item_this = $(this);
        e.preventDefault();

        if ( !faq_mini_item_this.hasClass('selected') ){
            faq_mini_item_this.find('.answer').slideToggle();
            faq_mini_item_this.toggleClass('selected');
        } else {
            faq_mini_item_this.find('.answer').slideUp(function() {
                faq_mini_item_this.toggleClass('selected');
            });
        }
    });
    /* /mobile-sections-list */


    //клик по заголовку
    $('.mobile-design2-page .h1').click(function(e) {

        e.preventDefault();
        $('.razdel_mini_descr_hidden').slideToggle();

    });


}); // END READY


/*file_upload custom*/
$( window ).resize(function(){
    $( ".file_upload input" ).triggerHandler( "change" );
});
/*file_upload custom*/


var Load = function (url, param) { // Функция для стандартизации общения с сервером
    $.post(
        url,
        param,
        function (data) {
            var sc_ = '';
            if (data['script']) {
                sc_ = data['script'];
                delete data['script'];
            }
            for (i in data) {
                $(i).html(data[i]);
            }
            eval(sc_);
        },
        'json'
    );
};


var Message = function (message) { // Всплывающее сообщение на базе наработки standart_window

    $('.window.message').remove();
    /* Удалилил старое окно */
    /* Добавлеяем новое окно */
    $('body').append(
        '<div class="window message">' +
        '<div class="window-popup-overflower"></div>' +
        '    <div class="window_body">' +
        '        <div class="close">x</div>' +
        '        <div class="content">' +
        '            <div class="block">' +
        message +
        '            </div>' +
        '        </div>' +
        '    </div>' +
        '</div>');

    $('.window.message').standart_window();
};


//очистить высплывающую форму при открытии
function clearForm($form) {
    $form[0].reset();
    $form.find('input').removeClass('error');
    $form.find('.file_upload > div').html('Добавить файл (doc, .pdf, .jpg и .png)');
}


/* /Красная линия в верхнем меню (mobile) */
$(window).on('load', function () {
    setTimeout(function() {
        $('.header-red-line-mobile').animate({
            width: '100%'
        }, 600);
    }, 500);
});
/* /Красная линия в верхнем меню (mobile) */