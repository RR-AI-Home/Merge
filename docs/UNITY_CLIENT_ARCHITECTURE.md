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

## Compatibility Rule

Every engine or contract update must continue to validate:

- existing theme packages
- generated app identities
- playable app first loops
- Unity adapter contract expectations once the Unity client exists

The same rule applies as before: if a new theme needs new behavior, add it to the shared platform deliberately and keep all completed themes working.
