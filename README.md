# automated_scripts
A collection of scripts to automate some flows using AutoHotkey v2:

| Script | Automate Flow |
---|---
| launchVSCodeNpmProject.ahk | start VSCode -> open specific workspace -> start mock server -> open browser to project home page |
| gitChangesCommitAndTag.bat | pull remote changes to local -> commit local changes -> push commits to remote -> create tag -> push tag to remote |
| extractWordsFromRosettaStoneForAnkiImport.js | learing English vocabularies in RosettaStone -> create note in Anki for each vocabulary |
| skipMicDetectionInRosettaStoneCourse.js | learing in RosettaStone -> close mic detection automatically |

---

## How to use?

1. Download the script you want
2. Update the variables inside the script

### For .ahk script
3. download and install AutoHotkey (https://www.autohotkey.com/)
4. run it by AutoHotkey 
   * you can also use some tools like 'PowerToys Run' or 'Libraries' to quick location the script by keyword when you want to run it

### For .js script
3. install Violentmonkey (https://violentmonkey.github.io/) to browser
4. copy&paste the script to it
