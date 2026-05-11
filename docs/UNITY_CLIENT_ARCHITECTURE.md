# Unity Client Architecture Decision

## Decision

Production mobile games should use Unity as the client/runtime layer.

The merge platform, theme contracts, validation tooling, backend services, liveops configuration, and app generation workflow remain separate from Unity. Unity is the presentation and mobile build target, not the source of truth for merge rules or theme contracts.

## Target Shape

```text
theme package + shared platform rules + backend/liveops
  -> validated standalone game definition
  -> Unity client adapter
  -> separate shipped mobile app
```

Each shipped game remains a separate product with its own app identity, save namespace, analytics stream, store metadata, and selected theme package. There is still no runtime theme switcher.

## Unity Owns

- mobile rendering
- board interaction presentation
- animation, particles, sound, and tactile feedback
- mobile input and device integration
- app icons, splash screens, mobile builds, and store packaging
- Unity-specific asset bundles and addressable assets
- final mobile typography, TextMeshPro font assets, canvas scaling, safe-area layout, and render-quality settings

## Platform And Backend Own

- merge rules
- producer rules
- energy, cooldown, order, reward, and progression contracts
- theme data validation
- generated standalone app identity
- economy and liveops configuration
- analytics event schema
- cloud save and account-facing persistence when needed
- monetization and purchase validation when needed

## Backend Language

The current prototype platform is implemented with JavaScript/Node tooling. The architecture should not depend on Unity as a backend.

If production backend services are later implemented in Java, C#, Node, or another runtime, they must preserve the same platform contracts and verification gates. The important boundary is:

```text
Unity client is not authoritative for durable economy or liveops state.
Backend/platform contracts are authoritative when cloud features are introduced.
```

## Prototype Role

The current browser apps remain useful as fast validation harnesses. They let us test engine rules, theme contracts, generated app identity, and first-loop playability without waiting for Unity project setup or mobile builds.

The browser shell is not the final client target. It is a platform proof and regression tool.

## Unity Adapter Requirements

The Unity adapter should load or receive:

- app identity
- theme config
- item chains
- producer definitions
- orders
- world map data
- event definitions
- tuning values
- copy
- generated asset references

The adapter should call shared/platform-backed rules through a narrow interface. If rules are ported into C# for offline play, the JavaScript/Node verification suite remains the contract reference until a cross-runtime parity test exists.

## Mobile UI Rendering Standard

Production-facing Unity UI must be sharp at phone resolution. Text quality is a rendering requirement, not surface polish.

Baseline rules:

- Use TextMeshPro for all gameplay UI text.
- Do not add new legacy `UnityEngine.UI.Text` labels.
- Use SDF font assets with enough sampling, padding, and atlas resolution for small mobile labels.
- Keep text auto-sizing off by default. If labels do not fit, fix layout dimensions, copy length, or hierarchy.
- Keep transforms unrotated and uniformly scaled for text-bearing UI.
- Keep anchored positions and sizes pixel-rounded where practical.
- Avoid nested scaled canvases and non-uniform parent scale on text.
- Keep contrast high and avoid placing small text over noisy icon or glow layers.
- During animations, prefer moving containers without scaling text. If a text element must scale, return it to a stable whole-pixel layout state.

Current proof implementation:

```text
TextMeshProUGUI
TMP SDF runtime font asset
2048 x 2048 dynamic atlas
screen-space overlay canvas
pixel-perfect canvas enabled
412 x 915 reference resolution
whole-pixel RectTransform assignment through SetRect()
```

If a Unity or TextMeshPro package upgrade changes API names, fix the shared text helper and preserve the regression tests in `tests/unity-client-scaffold.test.js`.

## Android SDK Setup Note

Unity Android builds should use the local Android SDK at:

```powershell
C:\Users\badn3\AppData\Local\Android\Sdk
```

When Unity or another project needs the Android command-line tools available in PowerShell, set:

```powershell
$env:ANDROID_HOME="C:\Users\badn3\AppData\Local\Android\Sdk"
$env:ANDROID_SDK_ROOT=$env:ANDROID_HOME
$env:Path="$env:ANDROID_HOME\cmdline-tools\latest\bin;$env:ANDROID_HOME\platform-tools;$env:Path"
```

Required Android packages for the Unity integration:

```powershell
sdkmanager.bat --sdk_root="$env:ANDROID_HOME" "platform-tools" "platforms;android-36" "build-tools;36.0.0" "ndk;27.1.12297006"
sdkmanager.bat --sdk_root="$env:ANDROID_HOME" --licenses
```

Accept the SDK licenses when prompted. The latest recorded setup accepted all licenses from:

```powershell
PS C:\Users\badn3\AppData\Local\Android\Sdk\cmdline-tools>
```

## OneDrive And Build Output Note

Avoid placing Unity projects, APK builds, Gradle outputs, Library folders, caches, and other large/generated Unity artifacts inside OneDrive. OneDrive file sync can interfere with file locks, frequent rewrites, generated metadata, and long build output paths.

Use `E:\Projects` for Unity workspaces and build outputs. Create project-specific directories as needed, for example:

```text
E:\Projects\Merge\Unity\
E:\Projects\Merge\Builds\Android\
E:\Projects\Merge\Exports\
```

APK and AAB outputs should go under an `E:\Projects` build directory, not inside the OneDrive repo path.

## Compatibility Rule

Every engine or contract update must continue to validate:

- existing theme packages
- generated app identities
- playable app first loops
- Unity adapter contract expectations once the Unity client exists

The same rule applies as before: if a new theme needs new behavior, add it to the shared platform deliberately and keep all completed themes working.
