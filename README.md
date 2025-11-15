# Junyaの配属相性診断アプリ

12問のシンプルな診断で、あなたの仕事スタイルと上司との相性がわかるWebアプリです。

## 🎨 デザイン

- **Spotify風ダークテーマ**
- **shadcn/ui** によるモダンなUIコンポーネント
- **Framer Motion** による滑らかなアニメーション

## 🚀 主な機能

- ✅ 12問の診断（6軸分析）
- ✅ 個人の仕事スタイル診断
- ✅ 上司との相性診断
- ✅ 心理安全性を重視した相性スコア算出
- ✅ 招待リンク生成機能
- ✅ レスポンシブデザイン

## 📋 技術スタック

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **UI Components**: shadcn/ui
- **Animation**: Framer Motion
- **Authentication**: Firebase Auth
- **Database**: Cloud Firestore
- **Deployment**: Vercel (推奨)

## 🌐 デモ

**本番環境**: https://junya-combi-96h01bw9m-junyas-projects-98f0b06e.vercel.app

## 📚 ドキュメント

- **[クイックスタート](./docs/QUICKSTART.md)** - 5分で起動する方法
- **[Firebase CLI セットアップ](./docs/FIREBASE_CLI_SETUP.md)** - Firebase CLIを使った設定（推奨）
- **[Firebase Console セットアップ](./docs/FIREBASE_SETUP.md)** - GUIでの設定方法
- **[デプロイガイド](./docs/DEPLOYMENT.md)** - Vercelへのデプロイ方法
- **[アーキテクチャ](./docs/ARCHITECTURE.md)** - 技術仕様とコーディング規約
- **[セットアップ完了](./docs/SETUP_COMPLETE.md)** - 完了後の確認項目

詳細は [docs/README.md](./docs/README.md) を参照してください。

## 📁 プロジェクト構造

```
junya-combi-app/
├── app/                    # Next.js App Router
│   ├── page.tsx           # LP（ランディングページ）
│   ├── test/              # 診断画面
│   ├── gate/              # 認証ゲート
│   ├── result/[id]/       # 結果画面
│   └── pair/[token]/      # ペア相性画面
├── components/            # Reactコンポーネント
│   └── ui/                # shadcn/uiコンポーネント
├── lib/                   # ライブラリ・ロジック
│   ├── diagnosis.ts       # 診断ロジック
│   ├── firebase.ts        # Firebase設定
│   └── utils.ts           # ユーティリティ
├── docs/                  # ドキュメント
├── scripts/               # スクリプト
├── public/                # 静的ファイル
├── firestore.rules        # Firestoreセキュリティルール
└── firebase.json          # Firebase設定
```

詳細な構造は [PROJECT_STRUCTURE.md](./PROJECT_STRUCTURE.md) を参照してください。

## 🛠️ セットアップ

### 1. リポジトリのクローン

```bash
git clone <your-repo-url>
cd junya-combi-app
```

### 2. 依存関係のインストール

```bash
npm install
```

### 3. Firebase プロジェクトの設定

**🚀 Firebase CLI を使う場合（推奨）**: [docs/FIREBASE_CLI_SETUP.md](./docs/FIREBASE_CLI_SETUP.md) を参照

**📋 Firebase Console を使う場合**: 以下の手順に従ってください

#### 3.1 Firebase Console でプロジェクトを作成

1. [Firebase Console](https://console.firebase.google.com/) にアクセス
2. 「プロジェクトを追加」をクリック
3. プロジェクト名を入力（例: junya-combi-app）
4. プロジェクトを作成

#### 3.2 Firebase Authentication を有効化

1. Firebase Console で「Authentication」を選択
2. 「始める」をクリック
3. 「Sign-in method」タブで以下を有効化：
   - Google
   - 匿名認証（Anonymous）

#### 3.3 Cloud Firestore を有効化

1. Firebase Console で「Firestore Database」を選択
2. 「データベースの作成」をクリック
3. 本番環境モードで開始
4. ロケーションを選択（asia-northeast1 推奨）

#### 3.4 Firebase 設定を取得

1. プロジェクトの設定（歯車アイコン）→「プロジェクトの設定」
2. 「全般」タブの下部で、ウェブアプリを追加
3. アプリのニックネームを入力
4. 表示される設定をコピー

### 4. 環境変数の設定

プロジェクトルートに `.env.local` ファイルを作成：

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

### 5. Firestore セキュリティルール

Firebase Console の Firestore Database → ルールで以下を設定：

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // プロフィール - 読み取りは誰でも、書き込みは認証済みユーザーのみ
    match /profiles/{profileId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    
    // 招待 - 読み取りは誰でも、書き込みは認証済みユーザーのみ
    match /invites/{inviteId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

### 6. 開発サーバーの起動

```bash
npm run dev
```

ブラウザで [http://localhost:3000](http://localhost:3000) を開く

## 📱 画面一覧

### 1. LP（ランディングページ）- `/`
- シンプルな説明
- 「診断をはじめる」CTA

### 2. 診断画面 - `/test`
- 12問の質問
- タイプライターアニメーション
- スムーズな画面遷移
- 進捗バー

### 3. 認証ゲート - `/gate`
- Google認証
- メール/名前入力オプション
- 結果保存

### 4. 結果画面 - `/result/[id]`
- 6軸バーチャート
- スコア表示
- 上司招待リンク生成

### 5. ペア相性診断 - `/pair/[token]`
- 上司の診断実施
- 相性スコア表示
- 詳細分析（心理安全性、コミュニケーション、補完性）
- アドバイス表示

## 🎯 診断ロジック

### 6つの軸

1. **論理 ↔ 共感**: 意思決定スタイル
2. **直接 ↔ 間接**: コミュニケーション方法
3. **協調性**: チーム志向 vs 個人志向
4. **ストレス反応**: プレッシャーへの対処
5. **計画性 ↔ 即興性**: 仕事の進め方
6. **自律 ↔ 伴走希望**: サポート希望度

### 相性スコア計算

```
総合スコア = 心理安全性(50%) + コミュニケーション(30%) + 補完性(20%)
```

- **心理安全性**: 協調性とストレス反応の類似度
- **コミュニケーション**: 論理共感と直接間接の類似度
- **補完性**: 計画性と自律性の適度な違い

## 🚀 デプロイ

### Vercel へのデプロイ（推奨）

1. [Vercel](https://vercel.com) にサインアップ
2. リポジトリを接続
3. 環境変数を設定（`.env.local` の内容）
4. デプロイ

```bash
npm run build  # ビルドテスト
```

### その他のデプロイ先

- Netlify
- Firebase Hosting
- AWS Amplify

## 🛠️ 便利なコマンド

### 開発

```bash
npm run dev           # 開発サーバー起動
npm run build         # プロダクションビルド
npm run start         # 本番サーバー起動
npm run type-check    # TypeScript型チェック
```

### デプロイ

```bash
npm run deploy            # 本番環境にデプロイ
npm run deploy:preview    # プレビュー環境にデプロイ
npm run vercel:logs       # デプロイログを確認
npm run vercel:env:pull   # 環境変数をローカルに取得
```

詳細は [scripts/README.md](./scripts/README.md) を参照してください。

## 📊 データ構造

### Firestore Collections

#### `profiles` コレクション
```typescript
{
  userId: string
  name: string
  email: string
  answers: number[]  // 0-11の質問に対する回答（0 or 1）
  scores: {
    logic_empathy: number
    direct_indirect: number
    cooperation: number
    stress_response: number
    planning_improvisation: number
    autonomy_guidance: number
  }
  createdAt: Date
}
```

#### `invites` コレクション
```typescript
{
  subordinateId: string  // 部下のuserId
  bossId?: string  // 上司のuserId（診断完了後）
  createdAt: Date
  used: boolean
  completedAt?: Date
}
```

## 🎨 カスタマイズ

### カラーテーマの変更

`app/globals.css` の CSS変数を編集：

```css
:root {
  --background: #0b0f10;  /* 背景色 */
  --primary: #1DB954;     /* アクセントカラー（Spotify Green） */
  /* ... */
}
```

### 質問内容の変更

`lib/diagnosis.ts` の `QUESTIONS` 配列を編集

## 🔧 トラブルシューティング

### Firebase の接続エラー

- `.env.local` ファイルが正しく設定されているか確認
- Firebase Console で Authentication と Firestore が有効になっているか確認

### ビルドエラー

```bash
rm -rf .next
npm install
npm run dev
```

## 📝 ライセンス

MIT

## 👥 作者

Junya

---

**注意**: このアプリは診断結果を保存するため、Firebase プロジェクトの設定が必須です。
