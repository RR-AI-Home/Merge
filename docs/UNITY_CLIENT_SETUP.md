# Unity Client Setup

## Local Layout

Keep the Unity project and generated build output outside OneDrive.

- Repo source: `C:\Users\badn3\OneDrive\Documents\Projects\Merge`
- Unity project: `E:\Projects\Merge\Unity\MergeClient`
- Android builds: `E:\Projects\Merge\Builds\Android`
- Temp work: `E:\tmp`

The Unity project is not the main source of truth. The merge platform repo owns engine code, themes, validation, and app generation. Unity consumes exported theme payloads.

## Unity Version

Use Unity `6000.4.6f1`.

Editor executable:

```powershell
C:\Program Files\Unity\Hub\Editor\6000.4.6f1\Editor\Unity.exe
```

## Android SDK

Use the Android SDK path already configured for this machine:

```powershell
$env:ANDROID_HOME="C:\Users\badn3\AppData\Local\Android\Sdk"
$env:ANDROID_SDK_ROOT=$env:ANDROID_HOME
$env:Path="$env:ANDROID_HOME\cmdline-tools\latest\bin;$env:ANDROID_HOME\platform-tools;$env:Path"
```

Installed target packages:

```powershell
sdkmanager.bat --sdk_root="$env:ANDROID_HOME" "platform-tools" "platforms;android-36" "build-tools;36.0.0" "ndk;27.1.12297006"
sdkmanager.bat --sdk_root="$env:ANDROID_HOME" --licenses
```

## Export Theme Data

From the repo:

```powershell
npm run unity:export-theme
```

This writes:

```text
E:\Projects\Merge\Unity\MergeClient\Assets\MergePlatform\Resources\Themes\cyber-syndicate.json
```

The payload is built from `themes\cyber-syndicate` and includes config, item chains, producers, orders, world map, events, tuning, and copy.

## Configure Unity Project

Run Unity in batch mode after changing Unity C# files or recreating the project:

```powershell
& "C:\Program Files\Unity\Hub\Editor\6000.4.6f1\Editor\Unity.exe" -batchmode -quit -projectPath "E:\Projects\Merge\Unity\MergeClient" -executeMethod MergePlatform.Client.Editor.MergeClientProjectBuilder.ConfigureProject -logFile "E:\Projects\Merge\Unity\MergeClient\Logs\configure.log"
```

Generated scene:

```text
E:\Projects\Merge\Unity\MergeClient\Assets\MergePlatform\Scenes\MergeClient.unity
```

## Current Proof Scope

The current Unity proof loads the exported `cyber-syndicate` theme and renders a simple board with programmatic primitives. It proves the platform-to-Unity data bridge. It does not yet implement drag-to-merge, saves, backend calls, APK output, or production UI.
