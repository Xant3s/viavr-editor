!include LogicLib.nsh
!include UAC.nsh

!macro customInstall
  SetOutPath "$INSTDIR"

  ; Run PowerShell as administrator using UAC
  UAC::ExecWait '"$SYSDIR\WindowsPowerShell\v1.0\powershell.exe" -ExecutionPolicy Bypass -NoProfile -File "$INSTDIR\resources\res\checkInstallAll.ps1"' "RunAsAdmin" $0
!macroend
