# Speculative Editor - 推测编辑器 MVP

一个具有AI推测编辑功能的多文本编辑器，能够根据用户的编辑行为智能预测下一步可能的编辑内容。

## 功能特性

### 核心功能
- **推测编辑**：实时根据用户的编辑行为，推测用户下一步可能会编辑的内容（扩写、删除、替换）
- **Tab确认**：用户可以使用Tab键确认并执行AI的推测建议
- **文件管理**：支持创建、删除、重命名文件和文件夹
- **Markdown支持**：支持简单的Markdown格式（h1-h3、代码块、描述）

### 技术架构
- **信息压缩**：将文件内容进行结构化、层级化、片段化处理
- **智能决策**：结合用户的当前操作与历史操作，生成预测
- **Prompt构建**：多场景下的prompt模板和构建器
- **背景上下文**：智能加载和扩展相关信息

## 技术栈

- **Next.js 14** - React框架
- **TypeScript** - 类型安全
- **Tailwind CSS** - 样式框架
- **Shadcn UI** - UI组件库
- **Vercel AI SDK** - AI集成
- **Radix UI** - 无样式UI组件

## 快速开始

1. 安装依赖：
```bash
npm install
```

2. 启动开发服务器：
```bash
npm run dev
```

3. 打开浏览器访问 [http://localhost:3000](http://localhost:3000)

## 使用说明

1. **创建文件/文件夹**：点击侧边栏顶部的文件/文件夹图标
2. **编辑文件**：点击文件名打开编辑器
3. **推测编辑**：
   - 编辑时会自动显示AI预测的内容
   - 按Tab键接受预测
   - 按Esc键取消预测
4. **文件操作**：鼠标悬停在文件上显示操作按钮（重命名、删除）

## 项目结构

```
speculative-editor/
├── app/                    # Next.js应用目录
├── components/             # React组件
│   ├── ui/                # UI基础组件
│   ├── editor.tsx         # 编辑器组件
│   └── file-tree.tsx      # 文件树组件
├── lib/                   # 核心库
│   ├── ai/               # AI相关模块
│   │   ├── content-compressor.ts    # 内容压缩
│   │   ├── prompt-builder.ts        # Prompt构建
│   │   └── prediction-engine.ts     # 预测引擎
│   └── utils/            # 工具函数
├── hooks/                # React自定义hooks
├── types/                # TypeScript类型定义
└── public/               # 静态资源
```

## 开发计划

- [ ] 集成真实的LLM API（OpenAI/Anthropic）
- [ ] 支持更多文件格式和语法高亮
- [ ] 添加用户偏好设置
- [ ] 实现文件持久化存储
- [ ] 优化预测算法和上下文管理
- [ ] 添加协作编辑功能

## 贡献

欢迎提交Issue和Pull Request！

## 许可证

MIT
