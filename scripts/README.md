# スクリプト一覧

このフォルダには、開発やデプロイを便利にするスクリプトが含まれています。

## 🚀 Vercel デプロイスクリプト

### デプロイ

#### 本番環境にデプロイ
```bash
npm run deploy
# または
./scripts/vercel-deploy.sh production
```

#### プレビュー環境にデプロイ
```bash
npm run deploy:preview
# または
./scripts/vercel-deploy.sh preview
```

### ログ確認

#### 最新のデプロイメントのログを表示
```bash
npm run vercel:logs
# または
./scripts/vercel-logs.sh
```

#### 特定のデプロイメントのログを表示
```bash
./scripts/vercel-logs.sh <deployment-url>
```

### 環境変数管理

#### 環境変数一覧を表示
```bash
npm run vercel:env
# または
./scripts/vercel-env.sh list
```

#### 環境変数をローカルに取得
```bash
npm run vercel:env:pull
# または
./scripts/vercel-env.sh pull
```

これで `.env.local` ファイルが更新されます。

#### 環境変数を追加
```bash
./scripts/vercel-env.sh add VARIABLE_NAME
```

実行後、値を入力するプロンプトが表示されます。

#### 環境変数を削除
```bash
./scripts/vercel-env.sh remove VARIABLE_NAME
```

## 🔧 Firebase セットアップスクリプト

### Firebase プロジェクトの初期化

```bash
./scripts/firebase-setup.sh
```

このスクリプトは：
1. 既存のFirebaseプロジェクトを一覧表示
2. プロジェクトの選択または新規作成
3. Firebase の初期化を実行

## 📝 使用例

### デプロイフロー

```bash
# 1. コードを変更
git add .
git commit -m "feat: 新機能追加"

# 2. プレビュー環境で確認
npm run deploy:preview

# 3. 問題なければ本番環境にデプロイ
npm run deploy

# 4. ログを確認
npm run vercel:logs
```

### 環境変数の更新フロー

```bash
# 1. 環境変数を追加
./scripts/vercel-env.sh add NEW_VARIABLE

# 2. 本番環境に再デプロイ（環境変数を反映）
npm run deploy

# 3. ローカル開発用に環境変数を取得
npm run vercel:env:pull
```

## 🔍 トラブルシューティング

### スクリプトの実行権限エラー

```bash
chmod +x scripts/*.sh
```

### Vercel CLIが見つからない

```bash
npx vercel login
```

## 💡 Tips

### エイリアスを設定（オプション）

`.zshrc` または `.bashrc` に以下を追加すると便利：

```bash
# Vercel エイリアス
alias vdeploy='npm run deploy'
alias vpreview='npm run deploy:preview'
alias vlogs='npm run vercel:logs'
alias venv='npm run vercel:env'
```

再読み込み：
```bash
source ~/.zshrc
```

これで `vdeploy` だけで本番デプロイできます。

---

各スクリプトの詳細な使い方は、スクリプトファイル内のコメントを参照してください。

