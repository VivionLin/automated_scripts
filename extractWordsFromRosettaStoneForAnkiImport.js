// ==UserScript==
// @name         Extract words from Rosetta Stone for Anki
// @version      1.0
// @description  Extract words from Rosetta Stone for Anki
// @author       vivionlin@outlook.com
// @match        https://learn.rosettastone.com/course/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    const noteType = 'Basic (and reversed card)';
    const deck = 'English';
    const retryLimit = 12 * 60;


    function getPossibleVariants(word) {
      const possibleVariants = [];

      switch(word) {
        case 'come': possibleVariants.push(['came', '()']);
        case 'fall': possibleVariants.push(['fell', '()']);
        case 'meet': possibleVariants.push(['met', '()']);
        case 'pay': possibleVariants.push(['paid', '()']);
          possibleVariants.push([`${word}s`, '()s']);
          possibleVariants.push([`${word.substring(0, word.length - 1)}ing`, '()ing']);
          break;
        case 'go': possibleVariants.push(['went', '()']);
          possibleVariants.push(['goes', '()']);
          possibleVariants.push(['going', '()']);
          break;
      }

      if(word.endsWith('te')) {
        possibleVariants.push([`${word}d`, '()d']);
        possibleVariants.push([`${word}s`, '()s']);
        possibleVariants.push([`${word.substring(0, word.length - 1)}ing`, '()ing']);
      } else if(word.endsWith('t')) {
        possibleVariants.push([`${word}ed`, '()ed']);
        possibleVariants.push([`${word}s`, '()s']);
        possibleVariants.push([`${word}ing`, '()ing']);
      } else if(word.endsWith('ss')) {
        possibleVariants.push([`${word}ed`, '()ed']);
        possibleVariants.push([`${word}es`, '()es']);
        possibleVariants.push([`${word}ing`, '()ing']);
      } else if(word.endsWith('ne')) {
        possibleVariants.push([`${word}d`, '()d']);
        possibleVariants.push([`${word}s`, '()s']);
        possibleVariants.push([`${word.substring(0, word.length - 1)}ing`, '()ing']);
      }

      possibleVariants.push([word, '()']);
      return possibleVariants;
    }

    function getPossibleParts(word) {
      const possibleParts = [];

      possibleParts.push([word, word.replaceAll(/\w+/gi, '()')]);
      possibleParts.push([word.replaceAll(/\s/gi, '-'), word.replaceAll(/\w+/gi, '()').replaceAll(/\s/gi, '-')]);

      let rest = word, isVerb = false;
      if(word.startsWith('to ')) {
        rest = rest.substring(3);
        isVerb = true;
      }

      while(true) {
        const foundPart = rest.substring(0, rest.lastIndexOf(' '));
        if(foundPart.length == '') {
          if(isVerb) {
            possibleParts.push(...getPossibleVariants(rest));
          } else {
            possibleParts.push([rest, rest.replaceAll(/\w+/gi, '()')]);
          }
          break;
        }

        possibleParts.push([foundPart, foundPart.replaceAll(/\w+/gi, '()')]);
        rest = foundPart;
      }

      return possibleParts;
    }

    function parseExamples(word, wordType, fullExamples) {
      let matchPatterns;
      if(wordType == 'verb') {
        matchPatterns = getPossibleVariants(word)
      } else if(wordType == 'phrase') {
        if(word.includes('(')) {
          const words = word.split('(').map(p => p.trim().replace(')', ''));
          matchPatterns = getPossibleParts(words[0])

          const matchPatterns2 = getPossibleParts(words[1]);
          matchPatterns.splice(2, 0, matchPatterns2[0]);
          matchPatterns.splice(3, 0, matchPatterns2[1]);
          matchPatterns.concat(matchPatterns2.slice(2));
        } else {
          matchPatterns = getPossibleParts(word)
        }
      } else {
        matchPatterns = [[word, '()']];
      }


      return fullExamples.map(fullExample => {
        let example = fullExample;
        matchPatterns.forEach(ptn => example = example.replaceAll(RegExp(ptn[0], 'gi'), ptn[1]));
        return example;
      });
    }

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
    function exportVocabulariesForAnkiImport() {
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
                const wordType = document.querySelector('div[data-qa="VocabWordInfo"] span')?.innerHTML || word.includes(' ') ? 'phrase' : undefined;
                const meaning = document.querySelector('div[data-qa="TermDefinition"] span')?.innerHTML;

                const fullExamples = [...document.querySelectorAll('div[data-qa="Examples"] span')].map(exampleSpan => exampleSpan.innerHTML);
                if(! fullExamples.length) {
                  fullExamples.push(document.querySelector('div[data-qa="TermContent"] span')?.textContent);
                }

                const examples = parseExamples(word, wordType, fullExamples);

                ankiImportContent += `${noteType}   ${deck} ${word} ${wordType ? wordType + '<br>' : ''}${meaning ? meaning + '<br><br>' : ''}${examples.join('<br><br>')}
`;
            }

            const ankiImportFileName = window.location.pathname.replace('/course/', '').replaceAll('/', '-');
            download(ankiImportFileName, ankiImportContent);
        } else if(retryTimes++ < retryLimit) {
            setTimeout(exportVocabulariesForAnkiImport, 5000);
        }
    }

    exportVocabulariesForAnkiImport();
})();