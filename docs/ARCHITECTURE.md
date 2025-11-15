# アーキテクチャドキュメント

このドキュメントでは、Junyaの配属相性診断アプリの技術的なアーキテクチャと設計思想を説明します。

## 📁 プロジェクト構造

```
junya-combi-app/
├── app/                      # Next.js App Router
│   ├── page.tsx             # LP (ランディングページ)
│   ├── test/
│   │   └── page.tsx         # 診断画面
│   ├── gate/
│   │   └── page.tsx         # 認証ゲート
│   ├── result/
│   │   └── [id]/
│   │       └── page.tsx     # 個人結果画面
│   ├── pair/
│   │   └── [token]/
│   │       └── page.tsx     # ペア相性画面
│   ├── layout.tsx           # ルートレイアウト
│   └── globals.css          # グローバルスタイル
│
├── components/              # Reactコンポーネント
│   └── ui/                  # shadcn/ui コンポーネント
│       ├── button.tsx
│       ├── card.tsx
│       ├── progress.tsx
│       └── input.tsx
│
├── lib/                     # ライブラリとユーティリティ
│   ├── diagnosis.ts         # 診断ロジック
│   ├── firebase.ts          # Firebase設定
│   └── utils.ts             # ユーティリティ関数
│
├── hooks/                   # カスタムフック（将来用）
│
└── public/                  # 静的ファイル
```

## 🏗️ 技術スタック

### フロントエンド

- **Framework**: Next.js 16 (App Router)
  - Server Components と Client Components を使い分け
  - 動的ルーティング (`[id]`, `[token]`)
  - 自動コード分割

- **言語**: TypeScript
  - 型安全性の確保
  - インテリセンスの活用

- **スタイリング**: Tailwind CSS v4
  - Utility-first アプローチ
  - カスタムテーマ（Spotify風）
  - レスポンシブデザイン

- **UIコンポーネント**: shadcn/ui
  - アクセシブルなコンポーネント
  - カスタマイズ可能
  - 軽量

- **アニメーション**: Framer Motion
  - 滑らかなページ遷移
  - マイクロインタラクション
  - タイプライター効果

### バックエンド

- **認証**: Firebase Authentication
  - Google OAuth
  - 匿名認証
  - セッション管理

- **データベース**: Cloud Firestore
  - NoSQLドキュメントDB
  - リアルタイム同期（将来的に活用可能）
  - スケーラブル

## 🔄 データフロー

### 1. 診断フロー

```
ユーザー → LP → 診断開始
    ↓
12問の質問 → 回答を localStorage に一時保存
    ↓
認証ゲート → Google認証 or メール入力
    ↓
Firestore に保存 → userId を取得
    ↓
結果画面 (/result/:id) → 6軸スコア表示
```

### 2. 相性診断フロー

```
部下 → 招待リンク生成 → token 生成
    ↓
上司 → リンクにアクセス (/pair/:token)
    ↓
上司が診断実施 → 回答を Firestore に保存
    ↓
相性スコア計算 → 結果表示
```

## 📊 データモデル

### Firestore Collections

#### `profiles` コレクション

```typescript
{
  userId: string              // Firebase Auth UID
  name: string                // ユーザー名
  email: string               // メールアドレス
  answers: number[]           // 12問の回答 (0 or 1)
  scores: {
    logic_empathy: number              // 0-1
    direct_indirect: number            // 0-1
    cooperation: number                // 0-1
    stress_response: number            // 0-1
    planning_improvisation: number     // 0-1
    autonomy_guidance: number          // 0-1
  }
  createdAt: Date             // 作成日時
}
```

#### `invites` コレクション

```typescript
{
  subordinateId: string       // 部下のuserId
  bossId?: string            // 上司のuserId（診断完了後）
  createdAt: Date            // 作成日時
  used: boolean              // 使用済みフラグ
  completedAt?: Date         // 完了日時
}
```

## 🧮 診断アルゴリズム

### スコア計算

各軸は2問の質問から構成され、0-1の範囲で数値化されます。

```typescript
// 例: 論理↔共感 の軸
質問1: 選択肢A (0) or 選択肢B (1)
質問2: 選択肢A (0) or 選択肢B (1)
→ 平均値: (answer1 + answer2) / 2
```

### 相性スコア計算

```typescript
総合スコア = 
  心理安全性 × 50% +
  コミュニケーション × 30% +
  補完性 × 20%

// 心理安全性: 協調性とストレス反応の類似度
psychologicalSafety = (cooperationSimilarity + stressSimilarity) / 2

// コミュニケーション: 論理共感と直接間接の類似度
communication = (logicSimilarity + directSimilarity) / 2

// 補完性: 計画性と自律性の適度な違い
complementarity = バランス関数(planningDiff, autonomyDiff)
```

## 🎨 デザインシステム

### カラーパレット

```css
--background: #0b0f10      /* メイン背景 */
--primary: #1DB954         /* Spotify Green */
--card: #121619            /* カード背景 */
--muted: #b3b3b3          /* ミュートテキスト */
--border: #282828          /* ボーダー */
```

### コンポーネント設計

- **Atomic Design** の原則に従う
- 再利用可能なコンポーネント
- Composition over inheritance

### アニメーション原則

- 所要時間: 200-300ms（ページ遷移）
- イージング: ease-in-out
- 目的: フィードバックとガイダンス

## 🔒 セキュリティ

### Firebase Security Rules

```javascript
// 読み取り: 誰でも可能（診断結果は公開情報として扱う）
// 書き込み: 認証済みユーザーのみ
// 更新/削除: 自分のデータのみ
```

### 環境変数

- `.env.local` で管理
- Gitにコミットしない（`.gitignore` で除外）
- Vercelの環境変数で本番管理

## 🚀 パフォーマンス最適化

### Next.js の機能活用

- **Static Generation**: LP、診断画面（静的）
- **Dynamic Rendering**: 結果画面、ペア画面（動的）
- **Code Splitting**: ページごとに自動分割
- **Image Optimization**: next/image（将来的に活用）

### Firestore 最適化

- **インデックス**: 必要に応じて作成
- **キャッシュ**: クライアント側でキャッシュ
- **バッチ処理**: 複数操作を1トランザクションで

## 📱 レスポンシブ対応

### ブレークポイント

```css
sm: 640px   /* スマートフォン（横向き） */
md: 768px   /* タブレット */
lg: 1024px  /* デスクトップ */
xl: 1280px  /* 大画面デスクトップ */
```

### モバイルファースト

- デフォルトはモバイルサイズ
- `md:` や `lg:` で大画面対応

## 🧪 テスト戦略（将来実装）

### 単体テスト

- Jest + React Testing Library
- コンポーネントのテスト
- ロジックのテスト（`lib/diagnosis.ts`）

### E2Eテスト

- Playwright または Cypress
- ユーザーフロー全体のテスト

## 🔮 将来の拡張

### フェーズ2: チーム分析

```typescript
// teams コレクション
{
  teamId: string
  name: string
  members: string[]           // userIds
  averageScores: AxisScores
  compatibility: number
}
```

### フェーズ3: AI推奨

- OpenAI API との統合
- 配属推奨アルゴリズム
- パーソナライズされたアドバイス

### フェーズ4: エンタープライズ

- 組織アカウント
- ダッシュボード
- CSVエクスポート
- 権限管理

## 📖 コーディング規約

### TypeScript

- `any` の使用を避ける
- インターフェースで型定義
- 明示的な戻り値の型

### React

- 関数コンポーネント使用
- `use client` ディレクティブを明示
- Props の型定義

### CSS

- Tailwind のユーティリティクラス優先
- カスタムCSSは最小限に
- BEM記法（カスタムCSS使用時）

## 🛠️ 開発ワークフロー

1. **機能開発**: feature ブランチで実装
2. **型チェック**: `npm run type-check`
3. **ビルド確認**: `npm run build`
4. **コミット**: 変更をコミット
5. **プッシュ**: GitHub へプッシュ
6. **デプロイ**: Vercel が自動デプロイ

---

このアーキテクチャは、スケーラビリティ、保守性、パフォーマンスを考慮して設計されています。

