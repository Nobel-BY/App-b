<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# LifeLog 健康日记应用

一个功能强大的健康管理和日记记录应用，帮助用户追踪身体数据、记录日常生活，并通过AI技术提供智能分析和建议。

## 📋 功能亮点

### 健康数据管理
- 记录身高、体重等基本身体数据
- 追踪体脂率、肌肉量、内脏脂肪等详细体成分数据
- 支持历史数据查看和趋势分析
- 性别差异化数据管理

### 日记功能
- 创建和编辑个人日记
- 分类管理不同类型的日记内容
- 直观的日记查看界面

### AI 智能分析
- 集成 Google Gemini API 提供智能分析
- 基于健康数据提供个性化建议
- 智能解读日记内容，提供相关洞察

### 跨平台支持
- 响应式 Web 界面
- 原生 Android 应用支持
- 统一的数据存储和管理

## 🛠️ 技术架构

### 前端技术栈
- **框架**: React 19.2.3 + TypeScript
- **构建工具**: Vite 6.2.0
- **样式方案**: Tailwind CSS
- **状态管理**: React Hooks + localStorage

### 跨平台方案
- **Capacitor 8.0.1**: 提供 Web 到原生平台的桥接
- **Android 支持**: 完整的原生 Android 应用集成

### AI 集成
- **Google Gemini API**: 提供智能分析和建议功能
- **API 密钥管理**: 通过环境变量安全配置

### 数据存储
- **localStorage**: 本地数据持久化
- **结构化数据模型**: 类型安全的数据管理

## 🚀 快速开始

### 前置要求
- Node.js 16.0 或更高版本
- npm 7.0 或更高版本
- Android Studio (如需构建 Android 应用)

### 安装步骤

1. **克隆项目**
   ```bash
   git clone <repository-url>
   cd App-b
   ```

2. **安装依赖**
   ```bash
   npm install
   ```

3. **配置 API 密钥**
   - 复制 `.env.local.example` 文件为 `.env.local`
   - 在 `.env.local` 文件中设置您的 Gemini API 密钥:
     ```
     VITE_GEMINI_API_KEY=your-api-key-here
     ```

4. **运行开发服务器**
   ```bash
   npm run dev
   ```
   应用将在 `http://localhost:5173` 启动

## 📱 构建移动应用

### Android 构建

1. **构建 Web 资源**
   ```bash
   npm run build
   ```

2. **同步到 Android 项目**
   ```bash
   npx cap sync
   ```

3. **在 Android Studio 中打开**
   ```bash
   npx cap open android
   ```

4. **构建和运行**
   - 在 Android Studio 中构建项目
   - 运行应用到模拟器或实际设备

## 📁 项目结构

```
App-b/
├── android/             # Android 原生项目
├── components/          # React 组件
│   ├── DiaryEditor.tsx  # 日记编辑器
│   ├── DiaryView.tsx    # 日记查看器
│   ├── HealthEditor.tsx # 健康数据编辑器
│   ├── HealthView.tsx   # 健康数据查看器
│   └── Navigation.tsx   # 导航组件
├── dist/                # 构建输出目录
├── services/            # 服务层
│   └── geminiService.ts # Gemini API 服务
├── App.tsx              # 应用主组件
├── capacitor.config.ts  # Capacitor 配置
├── index.tsx            # 应用入口
├── package.json         # 项目配置和依赖
├── tsconfig.json        # TypeScript 配置
└── vite.config.ts       # Vite 配置
```

## 🔧 核心功能使用指南

### 健康数据管理

1. **添加/编辑健康数据**
   - 点击应用中的"健康"选项
   - 填写身高、体重等基本信息
   - 可选填写体脂率、肌肉量等详细数据
   - 点击"保存"按钮确认更改

2. **查看历史数据**
   - 应用会自动记录每次更新的健康数据
   - 可查看历史趋势和变化

### 日记管理

1. **创建新日记**
   - 点击应用中的"日记"选项
   - 填写日记内容
   - 保存日记

2. **查看和编辑现有日记**
   - 在日记列表中选择要查看的日记
   - 查看详细内容
   - 点击编辑按钮修改日记

### AI 分析功能

- 应用会自动使用 Gemini API 分析您的健康数据和日记内容
- 提供个性化的健康建议和洞察
- 帮助您更好地了解自己的健康状况和生活习惯

## 🤝 贡献指南

我们欢迎社区贡献！如果您想为项目做出贡献，请按照以下步骤操作：

1. **Fork 项目**
2. **创建功能分支**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **提交更改**
   ```bash
   git commit -m 'Add some amazing feature'
   ```
4. **推送到分支**
   ```bash
   git push origin feature/amazing-feature
   ```
5. **创建 Pull Request**

### 代码规范

- 遵循 TypeScript 最佳实践
- 使用 Prettier 和 ESLint 保持代码风格一致
- 为新功能添加适当的注释和文档
- 确保所有更改都经过测试

## 📄 许可证

本项目采用 MIT 许可证 - 详见 [LICENSE](LICENSE) 文件

## 📞 联系与支持

- **项目链接**: [https://github.com/yourusername/lifelog-app](https://github.com/yourusername/lifelog-app)
- **问题反馈**: [GitHub Issues](https://github.com/yourusername/lifelog-app/issues)
- **技术支持**: 如有问题，请在 GitHub 上创建 issue

## 🙏 致谢

- **Google Gemini API**: 提供强大的 AI 分析能力
- **React 团队**: 提供优秀的前端框架
- **Capacitor 团队**: 实现跨平台支持
- **所有贡献者**: 感谢您的支持和贡献

---

<div align="center">
  <p>Made with ❤️ for a healthier lifestyle</p>
</div>
