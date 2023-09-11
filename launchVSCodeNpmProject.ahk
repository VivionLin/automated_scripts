#Requires AutoHotkey v2.0-a

/* Here are your variables */
VSCodeExePath := "" ; e.g. C:\xxx\VSCode-win32-x64-1.69.0\Code.exe
projectWorkspace := "" ; e.g. C:\xxx\vue3-project
startProjectCmd := "" ; e.g. npm run dev
ChromeExePath := '' ; e.g. "C:\Program Files\Google\Chrome\Application\chrome.exe" --args --disable-web-security
projectBaseUrl := "" ; e.g. http://localhost:3000/


/* VSCode */
; open specific workspace
Run Format('"{1}" "{2}"', VSCodeExePath, projectWorkspace), , "Max"
if WinWaitActive("Visual Studio Code", , 15000) {
	Sleep 30000

    ; start project
	Send "^+``"
	Sleep 5000
	Send startProjectCmd
	Send "{Enter}"
	Sleep 2000

	/* start mock server (https://marketplace.visualstudio.com/items?itemName=Thinker.mock-server) */
	Send "^+E"
	Sleep 2000
	Send "!{Enter}"

	/* Browser */
	Run Format('"{1}" "{2}"', ChromeExePath, projectBaseUrl), , "Max"

	MsgBox "Project has been launched. You can start the development now!"
} else {
    MsgBox "Wait for VSCode timed out."
}