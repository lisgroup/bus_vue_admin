# vue-admin
> 这是一个极简的 vue admin 管理后台。它只包含了 Element UI & axios & iconfont & permission control & lint，这些搭建后台必要的东西。

目前版本基于 `vue-cli` 进行构建

## 安装

```bash

# 切换目录
cd vue-admin

# 安装 npm 包
npm install

# npm 下载速度慢的可以使用
npm config set registry https://registry.npmmirror.com/
npm install --registry=https://registry.npmmirror.com/

# 启动测试服务，默认 http://localhost:9090
npm run dev

# Build for production with minification
npm run build

# Build for production and view the bundle analyzer report
npm run build --report
```


浏览器访问 [http://localhost:9090/](http://localhost:9090/)

## 发布

```bash
# 构建测试环境
npm run build:stage

# 构建生产环境
npm run build
```

## 其它

```bash
# 预览发布环境效果
npm run preview

# 预览发布环境效果 + 静态资源分析
npm run preview -- --report

# 代码格式检查
npm run lint

# 代码格式检查并自动修复
npm run lint -- --fix
```

> 注意："node-sass": "^4.14.1", 需要node版本为 14.20.1

> Windows环境下，如果安装node-sass失败，以管理员身份打开命令提示行运行：

                npm install -g windows-build-tools
> 然后再 `npm i` 下载依赖