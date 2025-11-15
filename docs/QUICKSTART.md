# クイックスタートガイド

このガイドでは、Junyaの配属相性診断アプリをローカル環境で素早く起動する手順を説明します。

## 📦 前提条件

- Node.js 18.x 以上
- npm または yarn
- Googleアカウント（Firebase用）

## ⚡ 5分でスタート

### 1. 依存関係のインストール

```bash
npm install
```

### 2. Firebase プロジェクトの設定

詳細は [FIREBASE_SETUP.md](./FIREBASE_SETUP.md) を参照してください。

#### 簡易版:

1. [Firebase Console](https://console.firebase.google.com/) でプロジェクト作成
2. Authentication を有効化（Google + 匿名認証）
3. Firestore Database を有効化
4. Web アプリを追加して設定を取得

### 3. 環境変数の設定

プロジェクトルートに `.env.local` ファイルを作成：

```bash
# .env.local
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

### 4. 開発サーバーを起動

```bash
npm run dev
```

### 5. ブラウザで確認

http://localhost:3000 を開く

## 🎨 主要な画面

### ランディングページ (`/`)
- シンプルなヒーローセクション
- 3つの特徴カード
- 「診断をはじめる」CTA

### 診断画面 (`/test`)
- 12問の質問（タイプライターアニメーション付き）
- 進捗バー
- スムーズな画面遷移

### 認証ゲート (`/gate`)
- Google認証
- メール/名前での登録

### 結果画面 (`/result/:id`)
- 6軸のスコア表示
- 招待リンク生成

### ペア相性画面 (`/pair/:token`)
- 上司の診断実施
- 相性スコア表示

## 📝 開発時の注意点

### ホットリロード

ファイルを編集すると自動的にブラウザがリロードされます。

### Firebaseエミュレーター（オプション）

本番のFirebaseを使用せず、ローカルでテストする場合：

```bash
npm install -g firebase-tools
firebase init emulators
firebase emulators:start
```

### TypeScript型チェック

```bash
npm run type-check
```

### ビルドテスト

```bash
npm run build
```

## 🐛 よくある問題

### Firebase接続エラー

**問題**: "Firebase: Error (auth/configuration-not-found)"

**解決策**:
1. `.env.local` ファイルが存在し、正しい値が設定されているか確認
2. 環境変数名に `NEXT_PUBLIC_` プレフィックスが付いているか確認
3. 開発サーバーを再起動

### ポートが使用中

**問題**: Port 3000 is already in use

**解決策**:
```bash
# 別のポートで起動
npm run dev -- -p 3001
```

### npm install が失敗

**問題**: 依存関係のインストールエラー

**解決策**:
```bash
# キャッシュをクリア
rm -rf node_modules package-lock.json
npm cache clean --force
npm install
```

## 📚 次のステップ

1. **Firebaseセキュリティルールの設定**
   - [FIREBASE_SETUP.md](./FIREBASE_SETUP.md) の「セキュリティルール」セクション参照

2. **質問内容のカスタマイズ**
   - `lib/diagnosis.ts` の `QUESTIONS` 配列を編集

3. **デザインのカスタマイズ**
   - `app/globals.css` でカラーテーマを変更
   - `components/ui/` でUIコンポーネントをカスタマイズ

4. **デプロイ**
   - [README.md](./README.md) の「デプロイ」セクション参照

## 🚀 本番環境へのデプロイ

### Vercel（推奨）

1. GitHubリポジトリにプッシュ
2. [Vercel](https://vercel.com) でインポート
3. 環境変数を設定
4. デプロイ

詳細は [README.md](./README.md) を参照してください。

## 💡 ヒント

- **開発効率化**: VS Code の拡張機能をインストール
  - Tailwind CSS IntelliSense
  - ES7+ React/Redux/React-Native snippets
  - Prettier - Code formatter

- **デバッグ**: React Developer Tools をブラウザにインストール

- **パフォーマンス**: Next.js の built-in Image コンポーネントを活用

---

開発を楽しんでください！ 🎉

