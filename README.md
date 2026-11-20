# 个人学术主页

基于 Astro + Tailwind CSS，由 GitHub Actions 部署到 GitHub Pages：https://zinaxu7.github.io

## 目录结构

```
content/   所有内容。平时只需要改这里
src/       网页代码（布局、样式、页面模板）。更新内容时不用碰
public/    原样发布的静态文件（网站图标）
```

## 内容在哪里改

全部在 `content/` 里，用 Markdown 或 YAML 写，保存后网站会自动按模板渲染。

| 内容 | 文件 |
|---|---|
| 姓名、职位、学校、邮箱、社交链接、研究兴趣（文件头部）；首页个人介绍（正文） | `content/about.md` |
| 博客文章，一篇一个文件 | `content/blog/*.md` |
| 项目案例，一个项目一个文件 | `content/projects/*.md` |
| 论文列表（含摘要） | `content/publications.yaml` |
| CV 页的教育、经历、奖项、技能 | `content/cv.yaml` |
| CV 的 PDF（放了之后 CV 页才显示下载按钮） | `content/cv.pdf` |
| 论文 PDF、slides、poster | `content/papers/` |
| 照片、文章和项目里的图片 | `content/images/` |

### 写一篇博客

在 `content/blog/` 新建一个 `.md` 文件，文件名就是网址：`my-post.md` 发布在 `/blog/my-post/`。

```markdown
---
title: '文章标题'
description: '一句话摘要'
pubDate: 2026-11-19
tags: ['notes']
draft: false        # 改成 true 则不发布
---

正文用普通 Markdown 写。插图放在 content/images/，这样引用：

![图片说明](../images/my-figure.png)
```

### 加一个项目

在 `content/projects/` 新建 `.md` 文件，头部字段：`title`、`summary`、`role`、`period`，可选 `methods`（列表）、`image`（卡片配图，如 `../images/my-project.jpg`）、`category`（分组标题）、`order`（排序，小的在前）。

### 加一篇论文

在 `content/publications.yaml` 里加一条记录。`id` 会作为 BibTeX 的引用键，页面上 "BIB" 按钮的内容由这些字段自动生成，不需要另外维护 `.bib` 文件。

- `abbr`：条目左侧的期刊/会议缩写徽章（如 `JAMIA`）
- `featured: true`：同时显示在首页
- `pdf` / `slides` / `poster`：填完整网址，或者把文件放进 `content/papers/` 后写 `papers/my-paper.pdf`

### 换照片

把照片放到 `content/images/`，在 `content/about.md` 头部写 `photo: ./images/photo.jpg`。

## 本地预览

需要 Node.js 22 或更高版本。

```bash
npm install
npm run dev      # 本地预览 http://localhost:4321，保存文件后自动刷新
npm run build    # 构建到 ./dist；内容格式有错会在这里报出来
```

## 发布

推送到 `main` 分支后，GitHub Actions 会自动构建并发布。

首次设置：仓库 Settings → Pages → Build and deployment → Source 选 **GitHub Actions**。

## 改外观

配色和字体在 `src/styles/global.css` 顶部的 `@theme`。导航栏项目在 `src/lib/site.ts`。
