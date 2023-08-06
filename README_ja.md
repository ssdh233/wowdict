[中文](README.md) / 日本語

# wowdict

World of Warcraftの辞書AddOnです。

デフォルトでは英和（ejdict-hand）、英中（ECDICT）の辞書ソースが含まれております。プログラミングの知識があればソースの追加が可能です。

### ダウンロード
1. https://github.com/ssdh233/wowdict/releases からzipファイルをダウンロード。retailはwowdict_retail_x.x.x.zip、クラシック（WotLK含む）はwowdict_classic_x.x.x.zipをダウンロードしてください。
2. unzip後、wowdictフォルダを適切なバージョンの`\Interface\AddOns`フォルダに移動すればOK。Load out of date AddOnsを選ぶ必要があるかもしれません。

### 単語を調べる

![image1](https://github.com/ssdh233/wowdict/blob/feature/add-readme/images/1.png)

```
/d 調べたい単語

# 例
/d test
/d sample
```

![image2](https://github.com/ssdh233/wowdict/blob/feature/add-readme/images/2.png)


### ログを見る
![image3](https://github.com/ssdh233/wowdict/blob/feature/add-readme/images/3.png)

```
/dictlog
```

※ このコマンドをよく使うのであれば、`/dictlog`のマクロを作ってショットカートを付けることをおすすめします。

![image4](https://github.com/ssdh233/wowdict/blob/feature/add-readme/images/4.png)

![image5](https://github.com/ssdh233/wowdict/blob/feature/add-readme/images/5.png)


### （デベロッパー向け）辞書ソースを追加する

dict.luaでは辞書のソースファイルの構造が確認できます。typescriptで表現すると
```typescript
type DictSourceType = {
  [dictKey: string]: { // dictKeyは任意
    data: {
      [word: string]: { // 単語
        pron: string; // 単語の発音
        def: string; // 単語の意味
      }
    }[]; // 重要！dataはArray型です
    noResultText: string; // 結果が見つからない時のテキスト
    source: string; // 辞書のソースを表すテキスト
  }
}
```

luaにtableが大きすぎるとoverflowになってしまうため、dataはシンプルなtable型ではなく、Array of tableの形で一つの大きなtableを分けています。

単語の発音に使うフォントが特殊なので、辞書の発音と意味をpron、defにそれぞれ保存しています。
defはシンプルな文字列以外、`\n`で改行したり、`|cffffffff`の[color mixin](https://wowpedia.fandom.com/wiki/ColorMixin#Global_Colors)でフォントカラーを変えたりすることができます。

ソースファイルを作成した後、`DictSource`と`DictKey`を更新して、`wowdict.toc`でソースファイルをロードすれば、新しい辞書ソースの追加が閑静です。

開発、使用中に問題がありましたら、GitHubのissueで質問してください。
