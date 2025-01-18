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
    var $ = window.jQuery;
    const googleApi = "https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=en&dt=t&q=";

    // Define unique class names
    const buttonClass = 'my-translate-button';
    const buttonHoverClass = 'my-translate-button-hovered';
    const translatedTextClass = 'my-translated-text';

    // Add CSS rules
    $(`<style>
        .${buttonClass} {
            opacity: 1 !important;
            width: 10px !important;
            height: 10px !important;
            margin: 2px !important;
            background-color: #f0f0f0 !important;
            border: 1px solid #a0a0a0 !important;
            box-shadow: inset 1px 1px #ffffff, inset -1px -1px #808080 !important;
            cursor: pointer !important;
            z-index: 10000 !important;
            font-family: Arial, sans-serif !important;
            font-size: 12px !important;
            color: black !important;
            text-align: center !important;
            line-height: 20px !important;
        }
        .${buttonHoverClass} {
            background-color: #e0e0e0 !important;
            opacity: 1 !important;
            width: 12px !important;
            height: 12px !important;
            box-shadow: inset 1px 1px #808080, inset -1px -1px #ffffff !important;
        }
    </style>`).appendTo("head");

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
            textElement.after($(`<div class='${translatedTextClass}'></div>`).text(translated));
        });
        textElement.css("color", prevColor);
        $(this).remove();
    }

    var prevColor;
    // Turns the text of the element the button translates red when hovered
    function onTranslateBtnHover() {
        const textElement = $(this).next();
        prevColor = textElement.css("color");
        textElement.css("color", "red");
        $(this).addClass(buttonHoverClass);
    }

    // Turns the text of the element the button translates back to its original color when not hovered
    function onTranslateBtnHoverOut() {
        const textElement = $(this).next();
        textElement.css("color", prevColor);
        $(this).removeClass(buttonHoverClass);
    }

    // Function to add the translate button
    function addTranslateButton(element) {
        const button = $(`<button class='${buttonClass}'></button>`);
        button.css({
            "opacity": "0.6",
            "width": "15px",
            "height": "15px",
            "margin": "1px",
            "background-color": "red",
            "border": "none",
            "cursor": "pointer",
            "z-index": "10000"
        });
        button.insertBefore(element);
        button.on('click', onTranslateBtnClick);
        button.on('mouseover', onTranslateBtnHover);
        button.on('mouseout', onTranslateBtnHoverOut);
    }

    // Function to create translate buttons for all relevant elements
    function createButtons() {
        $("h1, h2, h3, h4, h5, h6, p, textarea, b, i, u, span, div, li, a").each(function() {
            if ($(this).find("h1, h2, h3, h4, h5, h6, p, textarea, b, i, u, span, div, li, a").length > 0) {
                return;
            }
            if ($(this).text().trim().length == 0) {
                return;
            }
            if (!/[\u4E00-\u9FA5]/.test($(this).text())) {
                return;
            }
            addTranslateButton($(this));
        });
    }

    // Initialize the script by creating buttons
    createButtons();

})();

