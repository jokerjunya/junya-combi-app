# ✅ セットアップ完了！

Junyaの配属相性診断アプリのセットアップが完了しました！🎉

## 📋 完了した項目

### ✅ Firebase プロジェクト
- **プロジェクトID**: `junya-combi-2025`
- **プロジェクト番号**: `194424830232`
- **リージョン**: `asia-northeast1`（東京）

### ✅ Firebase サービス
- **Firestore Database**: 有効化済み
  - セキュリティルール: デプロイ済み
  - インデックス: 設定済み
- **Authentication**: 設定完了
  - Google認証: 有効化
  - 匿名認証: 有効化
- **Web App**: 作成済み
  - App ID: `1:194424830232:web:e9d75266ca05ea2893c66d`

### ✅ ローカル環境
- **Next.js**: インストール済み
- **依存関係**: すべてインストール済み
- **環境変数**: `.env.local` 作成済み
- **開発サーバー**: 起動中（http://localhost:3000）

## 🚀 アプリの使い方

### 開発サーバー起動

```bash
npm run dev
```

### ビルド

```bash
npm run build
```

### 本番サーバー起動

```bash
npm run start
```

## 🌐 アクセスURL

- **開発環境**: http://localhost:3000
- **Firebase Console**: https://console.firebase.google.com/project/junya-combi-2025/overview
- **Firestore**: https://console.firebase.google.com/project/junya-combi-2025/firestore
- **Authentication**: https://console.firebase.google.com/project/junya-combi-2025/authentication

## 📱 画面フロー

1. **LP** (`/`) → 診断開始
2. **診断** (`/test`) → 12問の質問
3. **認証ゲート** (`/gate`) → Google認証 or メール入力
4. **結果** (`/result/:id`) → 6軸スコア + 招待リンク生成
5. **ペア相性** (`/pair/:token`) → 上司診断 + 相性スコア

## 🔧 Firebase CLI コマンド

### プロジェクト確認

```bash
firebase use
```

### Firestore ルールをデプロイ

```bash
firebase deploy --only firestore:rules
```

### Firestore データを確認

```bash
firebase firestore:collections
```

### Firebase Console を開く

```bash
firebase open
```

## 📊 データベース構造

### `profiles` コレクション
- `userId`: string
- `name`: string
- `email`: string
- `answers`: number[] (12問の回答)
- `scores`: object (6軸のスコア)
- `createdAt`: timestamp

### `invites` コレクション
- `subordinateId`: string
- `bossId`: string (optional)
- `createdAt`: timestamp
- `used`: boolean
- `completedAt`: timestamp (optional)

## 🎨 カスタマイズ

### カラーテーマ変更

`app/globals.css` の CSS変数を編集：

```css
--primary: #1DB954;  /* Spotify Green */
```

### 質問内容変更

`lib/diagnosis.ts` の `QUESTIONS` 配列を編集

## 🚢 デプロイ

### Vercel へのデプロイ（推奨）

1. GitHubにプッシュ
2. Vercel でインポート
3. 環境変数を設定（`.env.local` の内容）
4. デプロイ

詳細は [README.md](./README.md) を参照

## 📞 サポート

問題が発生した場合：

1. [QUICKSTART.md](./QUICKSTART.md) でトラブルシューティング確認
2. [FIREBASE_SETUP.md](./FIREBASE_SETUP.md) で設定を再確認
3. Firebase Console でサービスの状態を確認

---

**🎉 開発を楽しんでください！**

素晴らしいプロダクトになることを願っています。

