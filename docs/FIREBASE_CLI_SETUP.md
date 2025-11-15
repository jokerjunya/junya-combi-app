# Firebase CLI セットアップガイド

このガイドでは、Firebase CLIを使ってプロジェクトを設定する手順を説明します。

## 📋 前提条件

- Firebase CLIがインストールされていること
- `jokerjunya@gmail.com` でログイン済み（または可能な状態）

## 🚀 セットアップ手順

### 1. Firebase にログイン

ターミナルで以下を実行：

```bash
cd /Users/01062544/Documents/junya-combi-app
firebase login
```

ブラウザが開くので、`jokerjunya@gmail.com` でログインしてください。

### 2. プロジェクト一覧を確認

```bash
firebase projects:list
```

既存のプロジェクトが表示されます。使いたいプロジェクトのIDをメモしてください。

### 3. 新規プロジェクトを作成（必要な場合）

```bash
firebase projects:create junya-combi-app
```

または Firebase Console (https://console.firebase.google.com/) で作成できます。

### 4. プロジェクトを初期化

```bash
firebase init
```

以下の質問に答えてください：

#### Which Firebase features do you want to set up?
- **Firestore** を選択（スペースキーで選択、Enterで確定）
- Hosting は任意（Vercelを使う場合は不要）

#### Select a default Firebase project
- 既存のプロジェクトを選択
- または新規作成

#### Firestore Rules
- `firestore.rules` を使用しますか？ → **Yes**（既に用意済み）

#### Firestore Indexes
- `firestore.indexes.json` を使用しますか？ → **Yes**（既に用意済み）

### 5. 設定確認

初期化が完了すると、以下のファイルが作成/更新されます：

- `.firebaserc` - プロジェクト設定
- `firebase.json` - Firebase設定
- `firestore.rules` - セキュリティルール
- `firestore.indexes.json` - インデックス設定

### 6. Firestore を有効化

Firebase Console にアクセス：

```bash
firebase open
```

または https://console.firebase.google.com/ を開く

1. プロジェクトを選択
2. 「Firestore Database」を選択
3. 「データベースの作成」をクリック
4. **本番環境モード**を選択
5. ロケーションを選択（`asia-northeast1` 推奨）
6. 「有効にする」をクリック

### 7. Firestore ルールをデプロイ

```bash
firebase deploy --only firestore:rules
```

### 8. Authentication を有効化

Firebase Console で：

1. 「Authentication」を選択
2. 「始める」をクリック
3. 「Sign-in method」タブで以下を有効化：
   - **Google**
   - **匿名認証**

### 9. Web アプリの設定を取得

```bash
firebase apps:sdkconfig web
```

または Firebase Console → プロジェクトの設定 → 全般 → マイアプリ → Web アプリ

### 10. 環境変数を設定

`.env.local` ファイルを作成：

```bash
cat > .env.local << 'EOF'
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
EOF
```

Web アプリの設定から取得した値を入力してください。

### 11. 開発サーバーを起動

```bash
npm run dev
```

ブラウザで http://localhost:3000 を開いて確認！

## 🔧 便利なコマンド

### プロジェクト一覧を表示

```bash
firebase projects:list
```

### 現在のプロジェクトを確認

```bash
firebase use
```

### プロジェクトを切り替え

```bash
firebase use <project-id>
```

### Firebase Console を開く

```bash
firebase open
```

### Firestore データを確認

```bash
firebase firestore:collections
```

### ルールをデプロイ

```bash
firebase deploy --only firestore:rules
```

### インデックスをデプロイ

```bash
firebase deploy --only firestore:indexes
```

## 🎯 簡易セットアップスクリプト

用意したスクリプトを使うこともできます：

```bash
./firebase-setup.sh
```

## ❓ トラブルシューティング

### ログインできない

```bash
firebase logout
firebase login --reauth
```

### プロジェクトが見つからない

```bash
firebase projects:list
firebase use --add
```

### 権限エラー

Firebase Console で、アカウントに適切な権限があるか確認してください。

## 📚 参考リンク

- [Firebase CLI リファレンス](https://firebase.google.com/docs/cli)
- [Firestore セキュリティルール](https://firebase.google.com/docs/firestore/security/get-started)

---

セットアップ完了後、`npm run dev` でアプリを起動できます！

