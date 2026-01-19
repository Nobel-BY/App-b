# 素迹 - Android 打包指南

## 应用信息
- **应用名称**: 素迹
- **包名**: com.suji.app
- **版本**: 1.0 (versionCode: 1)

## 前提条件

1. **安装 Android Studio**
   - 下载并安装 [Android Studio](https://developer.android.com/studio)
   - 安装 Android SDK (API Level 33 或更高)
   - 配置 JAVA_HOME 环境变量

2. **安装 Java JDK**
   - 需要 JDK 11 或更高版本

## 构建步骤

### 方法一：使用 Android Studio（推荐）

1. **构建 Web 资源并同步**
   ```bash
   npm run build
   npx cap sync
   ```

2. **打开 Android Studio**
   ```bash
   npm run android
   # 或者
   npx cap open android
   ```

3. **在 Android Studio 中构建 APK**
   - 等待 Gradle 同步完成
   - 点击菜单 `Build` → `Build Bundle(s) / APK(s)` → `Build APK(s)`
   - APK 文件将生成在: `android/app/build/outputs/apk/debug/app-debug.apk`

4. **生成签名 APK（发布版本）**
   - 点击菜单 `Build` → `Generate Signed Bundle / APK`
   - 选择 APK
   - 创建或使用现有密钥库（Keystore）
   - 构建完成后，APK 在: `android/app/build/outputs/apk/release/app-release.apk`

### 方法二：使用命令行（Gradle）

1. **构建 Web 资源并同步**
   ```bash
   npm run build
   npx cap sync
   ```

2. **进入 Android 目录并构建**
   ```bash
   cd android
   ./gradlew assembleDebug    # Debug APK
   ./gradlew assembleRelease  # Release APK (需要签名配置)
   ```

3. **APK 位置**
   - Debug: `android/app/build/outputs/apk/debug/app-debug.apk`
   - Release: `android/app/build/outputs/apk/release/app-release.apk`

## 快速命令

项目已配置以下 npm 脚本：

```bash
# 构建并打开 Android Studio
npm run android

# 仅同步（在修改代码后）
npm run cap:sync

# 仅复制文件
npm run cap:copy

# 仅打开 Android Studio
npm run cap:open:android
```

## 应用权限

应用已配置以下权限：
- `INTERNET` - 用于访问网络资源（Gemini API）

## 注意事项

1. **API 密钥**: 确保在生产环境使用环境变量或安全的方式管理 Gemini API 密钥
2. **签名密钥**: 发布到应用商店前，请妥善保管签名密钥库文件
3. **版本更新**: 每次发布新版本时，更新 `android/app/build.gradle` 中的 `versionCode` 和 `versionName`

## 发布到 Google Play Store

1. 生成签名的 Release APK 或 AAB (Android App Bundle)
2. 在 [Google Play Console](https://play.google.com/console) 创建应用
3. 上传 APK/AAB 文件
4. 填写应用信息和截图
5. 提交审核

## 问题排查

如果遇到问题：
- 确保 Android SDK 和构建工具已正确安装
- 检查 Gradle 同步是否成功
- 查看 Android Studio 的 Build 输出日志
