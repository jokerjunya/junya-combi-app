# プロジェクト構造

このドキュメントでは、整理されたプロジェクトのフォルダ構造を説明します。

## 📁 フォルダ構成

```
junya-combi-app/
├── .vscode/                  # VSCode設定
│   └── settings.json         # エディタ設定
│
├── app/                      # Next.js App Router
│   ├── page.tsx              # LP（ランディングページ）
│   ├── layout.tsx            # ルートレイアウト
│   ├── globals.css           # グローバルスタイル
│   ├── test/                 # 診断画面
│   │   └── page.tsx
│   ├── gate/                 # 認証ゲート画面
│   │   └── page.tsx
│   ├── result/[id]/          # 個人結果画面（動的ルート）
│   │   └── page.tsx
│   └── pair/[token]/         # ペア相性画面（動的ルート）
│       └── page.tsx
│
├── components/               # Reactコンポーネント
│   └── ui/                   # shadcn/ui コンポーネント
│       ├── button.tsx        # ボタンコンポーネント
│       ├── card.tsx          # カードコンポーネント
│       ├── input.tsx         # 入力コンポーネント
│       └── progress.tsx      # プログレスバー
│
├── lib/                      # ライブラリとロジック
│   ├── diagnosis.ts          # 診断ロジック（質問、計算、相性）
│   ├── firebase.ts           # Firebase設定
│   └── utils.ts              # ユーティリティ関数（cn等）
│
├── docs/                     # ドキュメント📚
│   ├── README.md             # ドキュメント一覧
│   ├── QUICKSTART.md         # クイックスタートガイド
│   ├── FIREBASE_CLI_SETUP.md # Firebase CLI セットアップ
│   ├── FIREBASE_SETUP.md     # Firebase Console セットアップ
│   ├── ARCHITECTURE.md       # アーキテクチャドキュメント
│   └── SETUP_COMPLETE.md     # セットアップ完了チェックリスト
│
├── scripts/                  # スクリプト🔧
│   └── firebase-setup.sh     # Firebase セットアップスクリプト
│
├── public/                   # 静的ファイル
│   ├── next.svg              # Next.js ロゴ
│   └── vercel.svg            # Vercel ロゴ
│
├── firebase.json             # Firebase設定
├── firestore.rules           # Firestoreセキュリティルール
├── firestore.indexes.json    # Firestoreインデックス
├── .firebaserc               # Firebaseプロジェクト設定
│
├── package.json              # npm依存関係
├── tsconfig.json             # TypeScript設定
├── next.config.ts            # Next.js設定
├── components.json           # shadcn/ui設定
│
├── .gitignore                # Git除外設定
├── .env.local                # 環境変数（Git除外）
│
└── README.md                 # メインREADME
```

## 🗂️ フォルダの役割

### `/app` - Next.js App Router
すべてのページとルーティングを管理。ファイルベースルーティング。

### `/components` - 再利用可能なコンポーネント
- `/ui` - shadcn/uiベースのUIコンポーネント
- 将来的に独自コンポーネントも追加予定

### `/lib` - ビジネスロジックとユーティリティ
- `diagnosis.ts` - 診断の核となるロジック
- `firebase.ts` - Firebase初期化とエクスポート
- `utils.ts` - 汎用ヘルパー関数

### `/docs` - プロジェクトドキュメント
すべてのドキュメントを一元管理。セットアップから運用まで。

### `/scripts` - 自動化スクリプト
セットアップやデプロイを支援するスクリプト。

### `/public` - 静的アセット
画像、フォント、その他の静的ファイル。

## 📝 命名規則

### ファイル命名
- **Reactコンポーネント**: PascalCase (`Button.tsx`)
- **ページ**: 小文字 (`page.tsx`)
- **ユーティリティ**: camelCase (`diagnosis.ts`)
- **設定ファイル**: kebab-case (`next.config.ts`)

### フォルダ命名
- **動的ルート**: `[param]` (`[id]`, `[token]`)
- **通常フォルダ**: 小文字 (`test`, `gate`)
- **コンポーネント**: 小文字 (`ui`, `components`)

## 🔍 ファイルの探し方

### 診断ロジックを編集したい
→ `lib/diagnosis.ts`

### 質問内容を変更したい
→ `lib/diagnosis.ts` の `QUESTIONS` 配列

### デザイン・スタイルを変更したい
→ `app/globals.css`（カラーテーマ）
→ `components/ui/` (個別コンポーネント)

### ページを編集したい
→ `app/[ページ名]/page.tsx`

### Firebaseの設定を変更したい
→ `lib/firebase.ts`（クライアント設定）
→ `firestore.rules`（セキュリティルール）

### ドキュメントを読みたい
→ `docs/README.md` から開始

## 🚫 `.gitignore` で除外されるもの

- `node_modules/` - npm依存関係
- `.next/` - Next.jsビルド出力
- `.env.local` - 環境変数（機密情報）
- `.firebase/` - Firebaseキャッシュ
- `*.log` - ログファイル

## 💡 ベストプラクティス

1. **新しいページ追加**: `app/` 配下に新しいフォルダを作成
2. **再利用コンポーネント**: `components/ui/` に追加
3. **ビジネスロジック**: `lib/` に追加
4. **ドキュメント**: `docs/` に追加
5. **スクリプト**: `scripts/` に追加

## 🔄 構造の変更履歴

### 2024年 - 初期整理
- ドキュメントを `docs/` に集約
- スクリプトを `scripts/` に移動
- 不要な `public/` ファイルを削除
- VSCode設定を追加
- プロジェクト構造を明確化

---

この構造は、保守性、スケーラビリティ、チーム開発を考慮して設計されています。


