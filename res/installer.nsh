!macro customInstall
  SetOutPath "$INSTDIR"

  ; Execute the PowerShell script in a visible window and always continue
  ExecWait '"$SYSDIR\WindowsPowerShell\v1.0\powershell.exe" -ExecutionPolicy Bypass -NoProfile -Verb RunAs -File "$INSTDIR\resources\res\checkInstallAll.ps1"'
!macroend
