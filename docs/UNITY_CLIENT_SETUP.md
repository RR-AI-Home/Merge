# Unity Client Setup

## Local Layout

Keep the Unity project and generated build output outside OneDrive.

- Repo source: `C:\Users\badn3\OneDrive\Documents\Projects\Merge`
- Unity project: `E:\Projects\Merge\Unity\MergeClient`
- Android builds: `E:\Projects\Merge\Builds\Android`
- Temp work: `E:\tmp`

The Unity project is not the main source of truth. The merge platform repo owns engine code, themes, validation, and app generation. Unity consumes exported theme payloads.

Repo-tracked Unity source files live under:

```text
unity\MergeClient\Assets\MergePlatform
```

Sync those source files into the local Unity project with:

```powershell
npm run unity:sync-source
```

Sync Unity package dependencies with:

```powershell
npm run unity:sync-packages
```

When Unity runtime source or package dependencies change, sync both before testing in the editor:

```powershell
npm run unity:sync-source
npm run unity:sync-packages
npm run unity:export-theme
```

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

If the Unity editor already has the project open, batch mode will refuse to run. In that case, run `npm run unity:sync-source`, let Unity recompile in the open editor, then press Play again.

## Text Rendering Quality

The Unity client uses TextMeshPro for mobile UI text. Do not add new gameplay UI with legacy `UnityEngine.UI.Text`.

Current text quality baseline:

- Unity package `com.unity.textmeshpro` is required in `unity\MergeClient\Packages\manifest.json`.
- First-time Unity projects should import TextMeshPro Essentials when Unity prompts for them. Stop Play Mode first; Unity cannot import TMP Essentials while the game is running. This creates the default TMP resources used by the editor and fallback font loading.
- `MergeClientController` first tries to load a project TMP font asset from `Resources/Fonts & Materials`, then creates a runtime TMP SDF font asset from safe Unity font candidates and the local cyber-readable font stack: Cascadia Code SemiBold, Cascadia Mono, Bahnschrift, Consolas, Arial.
- The runtime font asset uses a high-resolution SDF atlas: 72 sampling point size, 9 padding, 2048 x 2048 atlas, dynamic population, and multi-atlas enabled.
- Canvas rendering is screen-space overlay with `pixelPerfect = true`.
- CanvasScaler uses the 412 x 915 reference resolution with stable match-width scaling and explicit pixel settings.
- Shared `SetRect()` rounds anchored positions and sizes to whole pixels to reduce subpixel softness.
- Text auto-sizing is disabled. Fix layout with explicit boxes and readable font sizes instead of shrinking text.
- TMP wrapping uses `textWrappingMode`, not obsolete `enableWordWrapping`.

If text becomes blurry again, inspect the shared `CreateText()` helper before changing individual labels. The helper is the typography contract for HUD, board items, contracts, and navigation.

## Portrait Visual Target

Use `1080 x 1920` portrait in the Unity Game view for real-device preview. The runtime layout still uses a `412 x 915` logical CanvasScaler reference, with a `352` logical-pixel content column so the 6 x 6 merge board becomes the primary end-to-end screen element.

The current target style is a dark navy cyber UI with compact currency pills, an italic bold title, a large rounded merge board, icon-first item tiles, full-width contract cards, and a floating bottom navigation bar. Keep item labels short and avoid putting long text inside board tiles.

## Current Proof Scope

The current Unity proof loads the exported `cyber-syndicate` theme and renders a Canvas-based production-style board screen. It has a compact portrait HUD, fixed rounded board slots, icon-first item cards, a clickable producer crate, contract cards, energy spend, item generation, drag-to-empty-slot, drag-to-merge, local save/load, producer cooldowns, order completion, district progress, floating bottom navigation, merge feedback, and generated icon treatments.

It does not yet implement backend calls, APK/AAB output, final art assets, final audio, monetization, liveops, analytics delivery, or production store packaging.
