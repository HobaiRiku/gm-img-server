# gm-img-server
一个基于GraphicsMagick的图片服务器,可通过地址栏qurey参数改变图片大小

## 一、运行所需环境
1. `node` , `npm` 
2. 本地安装 `GraphicsMagick` 确保GM命令正常使用

## 二、运行
```
# npm install 
# node img_server
```
## 三、使用
请求图片
```
http://127.0.0.1:4451/danny.jpg?h=100&w=100&o=!
```
参数：
> h: 图片高度  
> w: 图片宽度  
> o: 是否强制压缩宽高,"!"表示强制,忽略表示不强制  

储存：  
图片存放于`picture`文件夹,访问时文件夹以路径隔开如：  
`http://127.0.0.1:4451/topfolder/subfolder01/picture.gif`
## 四、示例
![示例动画](https://img.hobairiku.site/img_server/example.gif)