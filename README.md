# utf8passwordinput


https://github.com/iapyeh/utf8passwordinput/assets/4695577/57d318e1-205a-4f17-86be-623f2e6ae445


## 專案內容
HTML <input type="password">
element 本身不支援 Unicode 文字輸入。 為了解決此限制，本專案引入了一個 JavaScript class，可將文字輸入欄位轉換為密碼輸入欄位。 此類使網站使用者在創建密碼時能夠使用其母語中的 Unicode 字符，最終改善使用者體驗並可能增強密碼強度。

## What is this
The HTML <input type="password">
element does not inherently support Unicode text entry. To address this limitation, this project introduces a JavaScript class that converts a text input field into a password input field. This class enables website users to utilize Unicode characters from their native languages when creating passwords, ultimately improving the user experience and potentially enhancing password strength.

## このプロジェクトは何のためにあるのか
HTML <input type="password">
要素は本質的に Unicode テキスト入力をサポートしません。 この制限に対処するために、このプロジェクトでは、テキスト入力フィールドをパスワード入力フィールドに変換する JavaScript クラスを導入します。 このクラスを使用すると、Web サイト ユーザーがパスワードを作成するときに母国語の Unicode 文字を利用できるようになり、最終的にユーザー エクスペリエンスが向上し、パスワードの強度が向上する可能性があります。

## 讓網站使用者可以輸入unicode做成的密碼。

好的密碼有三個特性：字數長、變化多且容易記憶。資安專家要求密碼要混合英文字母大小寫、數字、符號，這樣所產生的密碼，只能符合字數夠、變化多的條件，很難記憶，不是好的密碼。人們設定簡單密碼只有一個原因：好記。為了好記憶，人們寧可冒著不安全的風險。可見得「好記」是密碼的關鍵。對於非英語母語者，例如台灣、日本、韓國、中國等，如果使用自己的母語作為密碼，那些產生的密碼就是能符合字數長、變化多且容易記憶的三個特性的好密碼。母語中的詩詞、諺語都是可以當密碼主幹的好素材。

網路伺服器後台的使用者認證處理unicode密碼沒有任何問題，問題是在於使用者在網頁中無法輸入自己母語(unicode)的密碼，原因是HTML當中輸入密碼的欄位不接受unicode的輸入。這個小程式解決了這個問題。讓使用者能在網頁的密碼欄位中輸入母語做成的密碼。它使用一個一般文字欄位模擬密碼欄位的原理，凡是能輸入一般文字欄位的字元都能當成密碼傳送給伺服器後台。

[英國國家資安中心發文](https://www.ncsc.gov.uk/blog-post/the-logic-behind-three-random-words) 主張隨便找三個單字當密碼就是好密碼，如果密碼欄位能接受unicode輸入，非英語國家的人就能運用這個原則從母語中選擇三個詞彙做出一個安全又好記憶的密碼。

## Enable your website users to use their mother tongue (unicode characters) in passwords.

Good passwords have three characteristics: they are long, varied, and easy to remember. Security experts require passwords to be a mixture of uppercase and lowercase letters, numbers, and symbols. However, passwords generated in this way can only meet the conditions of being long and varied, and are difficult to remember, so they are not good passwords. People only set simple passwords for one reason: they are easy to remember. In order to be easy to remember, people would rather take the risk of being insecure. It can be seen that "easy to remember" is the key to passwords. For non-English speakers, such as Taiwanese, Japanese, Korean and Chinese, if they use their own mother tongue as a password, then the generated passwords will be good passwords that meet the three characteristics of being long, varied, and easy to remember. Poems and proverbs in the mother tongue are good sources that can be used as the major part of passwords.

There is no problem with the processing of Unicode passwords by user authentication in the background of a web server. The problem is that users cannot enter their own mother tongue (Unicode) passwords in the web page, because the password input field in HTML does not accept Unicode input. This program solves this problem. It allows users to enter passwords made in their mother tongue in the password field of the web page. It uses the principle of simulating a password field with a general text field. Any character that can be entered in a general text field can be transmitted to the server backend as a password.

## Web サイトのユーザーがパスワードに母国語 (Unicode 文字) を使用できるようにします。

優れたパスワードには、長く、多様で、覚えやすいという 3 つの特徴があります。 セキュリティの専門家は、パスワードには大文字と小文字、数字、記号を組み合わせることを要求しています。 しかし、この方法で生成されたパスワードは、長くて多様であるという条件しか満たせず、覚えにくいため、良いパスワードとは言えません。 人々が単純なパスワードを設定する理由は 1 つだけです。それは、覚えやすいということです。 覚えやすくするために、人々はむしろ不安になるリスクを負います。 パスワードは「覚えやすさ」が鍵であることが分かります。 日本人、台湾人、韓国人、中国人など、英語を話さない人が自分の母国語をパスワードとして使用する場合、生成されるパスワードは、長く、多様で、簡単であるという 3 つの特徴を備えた優れたパスワードになります。 覚えて。母国語の詩やことわざは、パスワードの主要部分として使用できる優れた情報源です。

Webサーバーのバックグラウンドでのユーザー認証によるUnicodeパスワードの処理は問題ありません。 問題は、HTML のパスワード入力フィールドが Unicode 入力を受け付けないため、ユーザーが Web ページに自分の母語 (Unicode) パスワードを入力できないことです。 このプログラムはこの問題を解決します。 これにより、ユーザーは Web ページのパスワード フィールドに母国語で作成したパスワードを入力できるようになります。 これは、パスワード フィールドを一般的なテキスト フィールドでシミュレートするという原理を使用します。 一般的なテキスト フィールドに入力できる文字はすべて、パスワードとしてサーバー バックエンドに送信できます。

- [終わりなきパスワードとの闘い、「定期的な変更は不要」という新常識](https://xtech.nikkei.com/atcl/nxt/column/18/00138/091101366/)


## 安裝與使用
主要程式是 utf8passwordinput.js 。使用方式請參考 demo.html 。這兩個檔案可以下載到同一個目錄下，然後直接點開demo.html，就可以在瀏覽器中作測試。

## Installation and Usage
The main program is utf8passwordinput.js. Please refer to demo.html for usage. These two files can be downloaded to the same directory, and then directly open demo.html to test in the browser.

## インストールと使用方法
メインプログラムは utf8passwordinput.js です。 使用方法については、demo.htmlを参照してください。 これら 2 つのファイルを同じディレクトリにダウンロードし、demo.html を直接開いてブラウザでテストできます。

## History
- 2024/3/18
   * feature: users could set "star" property to change placeholder("*") when inputing password, and the "star" value could be an unicode chareacter.
- 2024/3/13
   * bugfix: set mininum length to 1 for deleteContentForward event
- 2024/3/12 
   * Release

## 💖 ✰
- 如果你喜歡本專案,請惠賜一顆星星,讓我快樂一下。
- If you like this project, please give it a star. I will feel very happy.
- このプロジェクトが気に入ったら、スターを付けてください。 とても幸せな気持ちになります。

