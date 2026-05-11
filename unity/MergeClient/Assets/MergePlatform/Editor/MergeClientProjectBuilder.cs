using System.IO;
using UnityEditor;
using UnityEditor.Build;
using UnityEditor.SceneManagement;
using UnityEngine;
using UnityEngine.SceneManagement;

namespace MergePlatform.Client.Editor
{
    public static class MergeClientProjectBuilder
    {
        private const string ScenePath = "Assets/MergePlatform/Scenes/MergeClient.unity";
        private const string AppIdentifier = "com.mergeplatform.unityclient";

        [MenuItem("Merge Platform/Configure Project")]
        public static void ConfigureProject()
        {
            Directory.CreateDirectory("Assets/MergePlatform/Scenes");

            Scene scene = EditorSceneManager.NewScene(NewSceneSetup.EmptyScene, NewSceneMode.Single);
            GameObject cameraObject = new GameObject("Main Camera");
            cameraObject.tag = "MainCamera";
            Camera camera = cameraObject.AddComponent<Camera>();
            camera.transform.position = new Vector3(2.2f, 9.8f, -1.6f);
            camera.transform.rotation = Quaternion.Euler(72f, 0f, 0f);
            camera.orthographic = true;
            camera.orthographicSize = 6.2f;
            camera.backgroundColor = new Color(0.025f, 0.03f, 0.045f);

            GameObject lightObject = new GameObject("Key Light");
            Light light = lightObject.AddComponent<Light>();
            light.type = LightType.Directional;
            light.intensity = 1.1f;
            light.transform.rotation = Quaternion.Euler(50f, -30f, 20f);

            GameObject controllerObject = new GameObject("Merge Client Controller");
            controllerObject.AddComponent<MergeClientController>();

            EditorSceneManager.SaveScene(scene, ScenePath);
            EditorBuildSettings.scenes = new[] { new EditorBuildSettingsScene(ScenePath, true) };

            PlayerSettings.companyName = "Merge Platform";
            PlayerSettings.productName = "Merge Client";
            PlayerSettings.SetApplicationIdentifier(NamedBuildTarget.Android, AppIdentifier);
            PlayerSettings.defaultInterfaceOrientation = UIOrientation.Portrait;
            PlayerSettings.allowedAutorotateToPortrait = true;
            PlayerSettings.allowedAutorotateToPortraitUpsideDown = false;
            PlayerSettings.allowedAutorotateToLandscapeLeft = false;
            PlayerSettings.allowedAutorotateToLandscapeRight = false;
            PlayerSettings.Android.minSdkVersion = AndroidSdkVersions.AndroidApiLevel25;
            PlayerSettings.Android.targetSdkVersion = AndroidSdkVersions.AndroidApiLevelAuto;

            AssetDatabase.SaveAssets();
            Debug.Log($"Configured Merge Unity client scene at {ScenePath}");
        }
    }
}
