// ==UserScript==
// @name         Extract words from Rosetta Stone for Anki
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Extract words from Rosetta Stone for Anki
// @author       vivionlin@outlook.com
// @match        https://learn.rosettastone.com/course/*/2/1
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    const noteType = 'Basic (and reversed card)';
    const deck = 'English';
    const retryLimit = 10;


    function download(filename, text) {
        var element = document.createElement('a');
        element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
        element.setAttribute('download', filename);

        element.style.display = 'none';
        document.body.appendChild(element);

        element.click();

        document.body.removeChild(element);
    }

    let retryTimes = 0;
    function exportWordsForAnkiImport() {
        const isVocabularySession = document.querySelector('div[data-qa="VocabCardContentDiv"]');
        if(isVocabularySession) {
            let ankiImportContent = `#separator:tab
#html:true
#notetype column:1
#deck column:2
#tags column:5
`;
            for(let btn of document.getElementsByClassName('css-qmyty')) {
                btn.click();

                const word = document.querySelector('div[data-qa="VocabWord"] span').innerHTML;
                const type = document.querySelector('div[data-qa="VocabWordInfo"] span').innerHTML;
                const meaning = document.querySelector('div[data-qa="TermDefinition"] span').innerHTML;

                const fullExample = document.querySelector('div[data-qa="Example0"] span').innerHTML;
                let example = fullExample.replaceAll(word, '()');
                if(example.length == fullExample.length) {
                    example = fullExample.replaceAll(word.substring(0, word.indexOf(' ')), '()');
                }

                ankiImportContent += `${noteType}	${deck}	${word}	${type}<br>${meaning}<br><br>${example}
`;
            }

            const ankiImportFileName = window.location.pathname.replace('/course/', '').replaceAll('/', '-');
            download(ankiImportFileName, ankiImportContent);
        } else if(retryTimes++ < retryLimit) {
            setTimeout(exportWordsForAnkiImport, 1000);
        }
    }

    exportWordsForAnkiImport();
})();
