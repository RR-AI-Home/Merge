# Unity Client Proof Design

## Goal

Create a basic Unity client proof for the merge platform that can load one exported theme from the existing repo and render a simple themed merge board. The Unity project itself must live outside OneDrive at `E:\Projects\Merge\Unity\MergeClient`.

## Architecture

The JavaScript repo remains the source of truth for merge engine data, app identities, themes, tests, and documentation. A small export script writes a Unity-friendly JSON payload for a selected theme. Unity loads that payload from `Assets/MergePlatform/Resources/Themes` and renders a first proof scene with programmatic primitives.

## Components

- `scripts/export-unity-theme.mjs` exports one existing theme bundle into a single JSON file.
- `tests/unity-theme-export.test.js` verifies the export shape and refusal to overwrite existing output.
- `E:\Projects\Merge\Unity\MergeClient` contains the Unity project, scene builder, runtime controller, and exported theme resource.
- `docs/UNITY_CLIENT_SETUP.md` records the local Unity path, project location, theme export command, and Android build notes.

## Data Flow

Theme files under `themes/<theme-id>` are combined into one payload with `config`, `itemChains`, `producers`, `orders`, `worldMap`, `events`, `tuning`, and `copy`. Unity reads that payload through `Resources.Load<TextAsset>()`, parses it with `JsonUtility`, and uses board dimensions plus item chain data to draw the proof board.

## Scope

This slice proves Unity can consume platform theme data and display the first board. It does not implement full drag, merge, save, backend calls, monetization, or Android APK output yet.

## Verification

Run `npm run verify` from the repo. If Unity batch mode is available, open or build the project with Unity `6000.4.6f1` after the files are scaffolded.
