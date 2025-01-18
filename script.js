// ==UserScript==
// @name         Translation Script
// @namespace    http://tampermonkey.net/
// @version      2024-07-09
// @description  try to take over the world!
// @author       Narmjep
// @match        *://*/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=opera.com
// @grant        none
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    var $ = window.jQuery
    const googleApi = "https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=en&dt=t&q=";

    // CSS for the translate button normal : red, transparent, 15x15px , 1px margin
    $("<style>.translate-button{opacity:0.6;width:10px;height:10px;margin:1px;}</style>").appendTo("head");
    // CSS for the translate button hover : red, not transparent (color), 15x15px , 1px margin
    $("<style>.translate-button-hovered{background-color:red;opacity:1;width:20px;height:20px;margin:1px;}</style>").appendTo("head");

    // CSS for the translated text : black, italic
    $("<style>.translated-text{color:black;font-style:italic;}</style>").appendTo("head");


    // Function to translate text
    function translateText(text, callback) {
        $.get(googleApi + encodeURIComponent(text), function(data) {
            let translatedText = '';
            data[0].forEach(item => {
                translatedText += item[0];
            });
            callback(translatedText);
        });
    }


    // Event handler for the translate button
    function onTranslateBtnClick() {
        const textElement = $(this).next();
        const text = textElement.is('textarea') ? textElement.val() : textElement.text();
        translateText(text, (translated) => {
            textElement.after($("<div class='translated-text'></div>").text(translated));
        });
        //change color back
        textElement.css("color", prevColor);
        //remove btn
        $(this).remove();
    }

    var prevColor;
    // Turns the text of the element the button translates red when hovered
    function onTranslateBtnHover() {
        const textElement = $(this).next();
        prevColor = textElement.css("color");
        textElement.css("color", "red");
        //change btn style
        $(this).addClass("translate-button-hovered");
    }

    // Turns the text of the element the button translates back to its original color when not hovered
    function onTranslateBtnHoverOut() {
        const textElement = $(this).next();
        textElement.css("color", prevColor);
        //btn style
        $(this).removeClass("translate-button-hovered");
    }



    // Function to add the translate button
    function addTranslateButton(element) {
        const button = $("<button class='translate-button'></button>");
        button.insertBefore(element);
        button.on('click', onTranslateBtnClick);
        button.on('mouseover', onTranslateBtnHover);
        button.on('mouseout', onTranslateBtnHoverOut);
    }

    // Function to create translate buttons for all relevant elements
    function createButtons() {
        $("h1, h2, h3, h4, h5, h6, p, textarea, b, i, u, span, div, li, a").each(function() {
            //Dont add if there is another element that can be translated inside this element
            if ($(this).find("h1, h2, h3, h4, h5, h6, p, textarea, b, i, u, span, div, li, a").length > 0) {
                return;
            }

            //Only add if the element has text (not empty and not just whitespace)
            if ($(this).text().trim().length == 0) {
                return;
            }
                //Check if the text is in simplified or traditional Chinese
            if (!/[\u4E00-\u9FA5]/.test($(this).text())) {
                return;
            }
            addTranslateButton($(this));
        });
    }

    // Initialize the script by creating buttons
    createButtons();

})();
