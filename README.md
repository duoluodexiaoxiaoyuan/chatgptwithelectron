# 利用ChatGPT接口开发的项目

该项目可以用electron打开，也可以通过网页开发

# 项目启动
1.git clone https://github.com/duoluodexiaoxiaoyuan/chatgptwithelectron.git
2.npm i

## 网页打开
npm start 即可

## electron打开

前提你需要改一下pulic下面的Main.js的文件(下面两个只开一个，另一个注释点)

win.loadURL('http://localhost:3000/')   // 本地开发打开这个
win.loadURL(`file://${path.join(__dirname, '../build/index.html')}`)  // 打包构建electron打开

npm run electron-start
