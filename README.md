# 远程控制遥控玩具车辆 App

这是一个基于 React Native 开发的移动应用程序，用于远程控制玩具车辆。通过集成杰峰云 SDK，我们实现了 WebRTC 技术的实时视频流显示，同时通过 UDP 通信实现了对车辆的实时控制。

## 功能概述

- **远程控制**：通过 UDP 协议实时发送控制指令，对车辆的方向、速度等进行控制。
- **实时视频流**：利用杰峰云 SDK 和 WebRTC 技术，实时获取玩具车辆的摄像头画面，以低延迟的方式显示在手机屏幕上。
- **直观的控制界面**：友好的用户界面，便于用户轻松控制车辆并观看视频流。

## 环境配置

### 系统要求

- Node.js: v14.x 或更高版本
- npm: v6.x 或更高版本
- React Native CLI: 最新版本
- Android Studio (适用于安卓开发)
- Xcode (适用于iOS开发，需 macOS 环境)

### 依赖安装

1. 克隆项目到本地：

   ```bash
   git clone <项目地址>
   cd <项目目录>
   ```

2. 安装项目依赖：

   ```bash
   yarn insyarn
   ```

3. 确保已安装 React Native CLI：

   ```bash
   npm install -g react-native-cli
   ```

### 配置视频流与 UDP 控制

1. **视频流**：进行杰峰云 SDK 的相关配置，根据官方文档获取直播流链接，并配置 WebRTC 视频流显示。
2. **UDP 通信**：设置 UDP 通信所需的 IP 和端口，以便发送控制指令。

## 启动应用

### Android

1. 启动 Android 模拟器，或连接 Android 设备。
2. 执行以下命令启动应用：

   ```bash
   npx react-native run-android
   ```

### iOS

1. 确保安装了 Xcode，并已配置开发证书。
2. 执行以下命令启动应用：

   ```bash
   npx react-native run-ios
   ```

## 许可证

该项目采用 MIT 许可证。
