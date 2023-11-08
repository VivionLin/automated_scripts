// ==UserScript==
// @name         Skip mic detection in Rosetta Stone's course
// @version      1.0
// @description  Skip mic detection in Rosetta Stone's course if you don't want to finish the speaking part
// @author       vivionlin@outlook.com
// @match        https://learn.rosettastone.com/course/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    const retryLimit = 12 * 60;

    let retryTimes = 0;
    function hideMicDetectionDiv() {
        const isVocabularySession = document.querySelector('div[data-qa="VocabCardContentDiv"]');
        if(isVocabularySession) {
            const micDetectionDivSuspects = document.querySelectorAll('#root>div>div');
            if(micDetectionDivSuspects.length == 2) {
                micDetectionDivSuspects[0].style.visibility = 'hidden';
                return;
            }
        }

        if(retryTimes++ < retryLimit) {
            setTimeout(hideMicDetectionDiv, 5000);
        }
    }

    hideMicDetectionDiv();
})();