[toc]

# 搭建开发环境

## 安装 Node.js

1. 进入[Node.js官网](https://nodejs.org/en/download/)下载 msi 安装包进行安装
2. 安装完成后在 `cmd`（使用 `WIN + R` 打开运行窗口，输入 `cmd` 打开控制台）中分别输入 `node -v` 和 `npm -v` ，如果都返回一个版本号就表示安装成功了
3. 修改依赖包安装源：进入系统目录：`C:\Users\[用户名]`，找到文件 `.npmrc`（如果没有则新建一个），打开修改文件内容如下：

```
registry=https://registry.npm.taobao.org
ELECTRON_MIRROR=http://npm.taobao.org/mirrors/electron/
sass_binary_site=https://npm.taobao.org/mirrors/node-sass/
phantomjs_cdnurl=http://npm.taobao.org/mirrors/phantomjs
chromedriver_cdnurl=https://npm.taobao.org/mirrors/chromedriver
```

## 安装 Git

[点击下载](https://git-scm.com/download/win) Git 安装程序 (下载过程可能比较慢，请耐心等待)。安装完成后在命令行中输入git，如果输出了使用说明表示安装成功。

## 安装 VS Code

[下载地址](https://code.visualstudio.com/)

### 安装 VS Code 插件

1. Auto Close Tag
2. Auto Rename Tag
3. Better Comments
4. Chinese（Simplified）Language Pack for Visual Studio Code
5. EditorConfig for VS Code
6. ESLint
7. GitLens - Git supercharged
8. npm Intellisense
9. Path Intellisense
10. Prettier - Code formatter
11. TODO Highglight
12. Vetur
13. vscode-icons

## 安装浏览器插件

### Chrome 插件

* Vue Devtools

# 准备开发

## 检出项目代码

```
git clone http://192.168.23.55/soda/fizz.git
```

## 切换到开发分支

使用 VS Code 打开项目后，点击左下角 `master` ，在弹出窗口中选择 `origin/dev` 即可切换到开发分支，此后不需再做任何设置。

## 安装项目依赖
```
npm install
```

# 运行项目

### 启动开发环境
```
npm run serve
```

### 打包发布
```
npm run build
```

### 运行测试
```
npm run test
```

### 执行代码校验
```
npm run lint
```

### 执行端到端测试
```
npm run test:e2e
```

### 执行单元测试
```
npm run test:unit
```
