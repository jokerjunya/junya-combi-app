# デプロイガイド

このドキュメントでは、Junyaの配属相性診断アプリをVercelにデプロイする方法を説明します。

## 🚀 Vercel へのデプロイ

### 前提条件

- Vercelアカウント（jokerjunya@gmail.com）
- GitHubリポジトリ: https://github.com/jokerjunya/junya-combi-app
- Firebase プロジェクト: junya-combi-2025

### デプロイ手順

#### 1. GitHubにプッシュ

```bash
git add .
git commit -m "update: 変更内容"
git push origin main
```

#### 2. Vercel CLIでログイン

```bash
npx vercel login
```

ブラウザでjokerjunya@gmail.comでログインします。

#### 3. 初回デプロイ

```bash
npx vercel --yes
```

自動的に：
- プロジェクトを検出
- GitHubリポジトリと接続
- デプロイを実行

#### 4. 環境変数の設定

Firebaseの設定を追加：

```bash
npx vercel env add NEXT_PUBLIC_FIREBASE_API_KEY production
npx vercel env add NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN production
npx vercel env add NEXT_PUBLIC_FIREBASE_PROJECT_ID production
npx vercel env add NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET production
npx vercel env add NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID production
npx vercel env add NEXT_PUBLIC_FIREBASE_APP_ID production
```

各コマンド実行時に、対応する値を入力します。

#### 5. 本番環境に再デプロイ

環境変数を反映させるため：

```bash
npx vercel --prod
```

### 🌐 デプロイURL

**本番環境**: https://junya-combi-96h01bw9m-junyas-projects-98f0b06e.vercel.app

**Vercelダッシュボード**: https://vercel.com/junyas-projects-98f0b06e/junya-combi-app

## 🔧 Firebase 承認済みドメインの設定

デプロイ後、Firebase Authenticationで承認済みドメインを追加する必要があります。

1. [Firebase Console](https://console.firebase.google.com/project/junya-combi-2025/authentication/settings) を開く
2. 「承認済みドメイン」セクションで「ドメインを追加」
3. Vercelのドメインを追加：
   ```
   junya-combi-96h01bw9m-junyas-projects-98f0b06e.vercel.app
   ```
4. カスタムドメインを設定する場合、そのドメインも追加

## 📊 デプロイ後の確認

### 動作確認

1. デプロイURLにアクセス
2. LP画面が表示されるか確認
3. 「診断をはじめる」をクリック
4. 12問の質問が正しく表示されるか
5. Google認証が動作するか
6. 結果画面が表示されるか

### ログの確認

```bash
npx vercel logs [deployment-url]
```

エラーがある場合、ログで確認できます。

## 🔄 継続的デプロイ

### 自動デプロイの設定

Vercelは自動的にGitHubと連携しているため：

- **mainブランチへのプッシュ** → 本番環境に自動デプロイ
- **PRの作成** → プレビュー環境を自動生成

### 手動デプロイ

特定のコミットをデプロイ：

```bash
git checkout <commit-hash>
npx vercel --prod
```

### ロールバック

以前のデプロイに戻す：

```bash
npx vercel rollback
```

または Vercelダッシュボードから「Rollback」を選択。

## 🎨 カスタムドメインの設定

### Vercelダッシュボードで設定

1. [ドメイン設定](https://vercel.com/junyas-projects-98f0b06e/junya-combi-app/settings/domains) を開く
2. 「Add Domain」をクリック
3. ドメイン名を入力（例: junya-combi.app）
4. DNS設定を追加：
   - A Record: Vercelが提供するIPアドレス
   - CNAME: cname.vercel-dns.com

### Firebase で承認済みドメインに追加

カスタムドメインを設定したら、Firebase Authenticationの承認済みドメインにも追加：

```
your-custom-domain.com
```

## 📝 環境変数の管理

### 環境変数一覧の確認

```bash
npx vercel env ls
```

### 環境変数の更新

```bash
npx vercel env rm VARIABLE_NAME production
npx vercel env add VARIABLE_NAME production
```

### ローカルに環境変数をプル

```bash
npx vercel env pull .env.local
```

## 🐛 トラブルシューティング

### ビルドエラー

**症状**: デプロイ時にビルドが失敗

**解決策**:
```bash
# ローカルでビルドテスト
npm run build

# ログを確認
npx vercel logs [deployment-url]
```

### 環境変数エラー

**症状**: Firebase接続エラー

**解決策**:
1. 環境変数が正しく設定されているか確認
2. 本番環境に再デプロイ
3. Firebase Consoleで承認済みドメインを確認

### 認証エラー

**症状**: Google認証が失敗

**解決策**:
1. Firebase Console → Authentication → Settings
2. 承認済みドメインにVercelドメインがあるか確認
3. なければ追加して数分待つ

## 📚 関連リンク

- [Vercel Documentation](https://vercel.com/docs)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [Firebase Hosting](https://firebase.google.com/docs/hosting)

## 🔔 デプロイ通知

Vercelは自動的に：
- GitHubコミットステータスを更新
- デプロイ完了時に通知

Slackやメールとの連携も可能：
https://vercel.com/docs/concepts/deployments/notifications

---

**デプロイURL**: https://junya-combi-96h01bw9m-junyas-projects-98f0b06e.vercel.app

次回以降のデプロイは `git push` だけで自動的に実行されます！

