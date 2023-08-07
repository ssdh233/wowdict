中文 / [日本語](README_ja.md)

[演示动画](https://www.bilibili.com/video/BV1Nu411n7sn)

# wowdict

魔兽世界游戏内词典插件，同时支持正式服，经典服和WLK经典服，提供单词查询和浏览查询记录的功能。

默认提供英->中（ECDICT）和英->日（ejdict-hand）两个词典源，支持自定义添加其他词典源，不过需要一些编程能力。

### 下载 & 安装
1. 在 https://github.com/ssdh233/wowdict/releases 页面下载最新版本的zip文件。正式服下wowdict_retail_x.x.x.zip，经典服（包括WLK）下wowdict_classic_x.x.x.zip。
2. 解压缩后，将wowdict文件夹移动到对应版本的`\Interface\AddOns`文件夹下，重启游戏即可。可能需要选择"加载过期插件"。

### 单词查询功能

![image1](https://github.com/ssdh233/wowdict/blob/feature/add-readme/images/1.png)

```
/d 单词

# 例
/d test
/d sample
```

![image2](https://github.com/ssdh233/wowdict/blob/feature/add-readme/images/2.png)


### 浏览查询记录
![image3](https://github.com/ssdh233/wowdict/blob/feature/add-readme/images/3.png)

```
/dictlog
```
输入两次会关闭查询记录的弹窗。如果常用此功能建议给`/dictlog`指令做一个宏并且绑定快捷键。

![image4](https://github.com/ssdh233/wowdict/blob/feature/add-readme/images/4.png)

![image5](https://github.com/ssdh233/wowdict/blob/feature/add-readme/images/5.png)


### （面向开发者）如何添加其他词典源

在dict.lua中可以看到词典源文件的格式，DictSource的结构用typescript来表示，大概就是
```typescript
type DictSourceType = {
  [dictKey: string]: { // dictKey可以任意取
    data: {
      [word: string]: { // 单词
        pron: string; // 单词的发音
        def: string; // 单词的释义
      }
    }[]; // 重要！data是一个数组类型
    noResultText: string; // 用来显示没有找到结果时的文字
    source: string; // 用来显示来源
  }
}
```

因为lua里一个table里加载太多属性会overflow，所以data没有直接用一个简单的table，而是用数组形式将一个大table分段来存储。

词典的音标和释义分别存在pron和def里，是因为wow自带的字体不能很好的表示音标，所以要分开用不同的字体。def里可以使用`\n`换行，也可以用`|cffffffff`的[color mixin](https://wowpedia.fandom.com/wiki/ColorMixin#Global_Colors)来切换字体颜色。

制作好源文件，修改`DictSource`和`DictKey`后，在`wowdict.toc`中去加载源文件，新的词典源就成功添加了。

开发、使用中遇到问题，欢迎在issue区提问。
