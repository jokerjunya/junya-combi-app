# Firebase セットアップガイド

このガイドでは、Junyaの配属相性診断アプリで使用するFirebaseの詳細な設定方法を説明します。

## 📋 前提条件

- Googleアカウント
- Firebase Console へのアクセス権限

## 🚀 ステップ1: Firebase プロジェクトの作成

1. [Firebase Console](https://console.firebase.google.com/) にアクセス
2. 「プロジェクトを追加」をクリック
3. プロジェクト名を入力（例: `junya-combi-app`）
4. Google アナリティクスの有効化（オプション、推奨は有効化）
5. 「プロジェクトを作成」をクリック

## 🔐 ステップ2: Authentication の設定

### 2.1 Authentication を有効化

1. 左サイドバーから「Authentication」を選択
2. 「始める」ボタンをクリック
3. 「Sign-in method」タブに移動

### 2.2 Google 認証を有効化

1. 「新しいプロバイダを追加」をクリック
2. 「Google」を選択
3. 有効化のトグルをオンにする
4. プロジェクトのサポートメールを選択
5. 「保存」をクリック

### 2.3 匿名認証を有効化

1. 「新しいプロバイダを追加」をクリック
2. 「匿名」を選択
3. 有効化のトグルをオンにする
4. 「保存」をクリック

## 💾 ステップ3: Cloud Firestore の設定

### 3.1 Firestore を有効化

1. 左サイドバーから「Firestore Database」を選択
2. 「データベースの作成」をクリック
3. **本番環境モード**を選択（後でルールを設定します）
4. ロケーションを選択：
   - 推奨: `asia-northeast1`（東京）
   - または: `asia-northeast2`（大阪）
5. 「有効にする」をクリック

### 3.2 セキュリティルールの設定

1. Firestore Database 画面で「ルール」タブを選択
2. 以下のルールをコピー＆ペースト：

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // プロフィールコレクション
    match /profiles/{profileId} {
      // 読み取りは誰でも可能
      allow read: if true;
      // 書き込みは認証済みユーザーのみ
      allow create: if request.auth != null;
      // 更新は自分のプロフィールのみ
      allow update: if request.auth != null && request.auth.uid == profileId;
      // 削除は自分のプロフィールのみ
      allow delete: if request.auth != null && request.auth.uid == profileId;
    }
    
    // 招待コレクション
    match /invites/{inviteId} {
      // 読み取りは誰でも可能
      allow read: if true;
      // 作成は認証済みユーザーのみ
      allow create: if request.auth != null;
      // 更新は認証済みユーザーのみ
      allow update: if request.auth != null;
      // 削除は招待を作成したユーザーのみ
      allow delete: if request.auth != null;
    }
  }
}
```

3. 「公開」をクリック

### 3.3 インデックスの作成（オプション）

必要に応じて、以下のインデックスを作成できます：

1. 「インデックス」タブを選択
2. 「複合」タブで「インデックスを追加」

**プロフィール用インデックス:**
- コレクション: `profiles`
- フィールド:
  - `createdAt` - 降順
  - `userId` - 昇順

## ⚙️ ステップ4: Web アプリの設定

### 4.1 アプリを追加

1. プロジェクトの概要画面（ホーム）に戻る
2. 「</> (Web)」アイコンをクリック
3. アプリのニックネームを入力（例: `Junya Combi Web App`）
4. 「Firebase Hosting も設定します」はチェック不要（Vercelを使用）
5. 「アプリを登録」をクリック

### 4.2 設定情報を取得

表示される Firebase SDK の設定をコピーします：

```javascript
const firebaseConfig = {
  apiKey: "AIza...",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc..."
};
```

### 4.3 環境変数ファイルを作成

プロジェクトルートに `.env.local` ファイルを作成し、以下を記述：

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

⚠️ **重要**: `.env.local` ファイルは `.gitignore` に含まれているため、Gitにコミットされません。

## 🧪 ステップ5: 動作確認

### 5.1 開発サーバーを起動

```bash
npm run dev
```

### 5.2 テスト手順

1. http://localhost:3000 にアクセス
2. 「診断をはじめる」をクリック
3. 12問の質問に答える
4. 「Google で続行」または名前/メールを入力
5. Firestore Console で `profiles` コレクションにデータが作成されたか確認

### 5.3 Firestore でデータを確認

1. Firebase Console → Firestore Database
2. `profiles` コレクションを選択
3. 診断結果が保存されているか確認

## 🚀 本番環境へのデプロイ

### Vercel での環境変数設定

1. Vercel プロジェクトの Settings → Environment Variables
2. `.env.local` の各変数を追加：
   - `NEXT_PUBLIC_FIREBASE_API_KEY`
   - `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
   - `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
   - `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
   - `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
   - `NEXT_PUBLIC_FIREBASE_APP_ID`
3. すべての環境（Production, Preview, Development）にチェック
4. 「Save」をクリック

### 認証ドメインの設定

1. Firebase Console → Authentication → Settings
2. 「承認済みドメイン」セクションで「ドメインを追加」
3. Vercel のデプロイURL（例: `your-app.vercel.app`）を追加
4. カスタムドメインがある場合、それも追加

## 📊 使用量の監視

### 無料枠の確認

Firebase Spark プラン（無料）の制限：

- **Firestore**: 
  - 1日あたり5万件の読み取り
  - 1日あたり2万件の書き込み
  - 1日あたり2万件の削除
  - 1GBのストレージ

- **Authentication**:
  - 無制限（匿名認証含む）

### 使用量の確認方法

1. Firebase Console → 左下の「使用量と料金」
2. 各サービスの使用状況を確認
3. 必要に応じて Blaze プラン（従量課金）にアップグレード

## 🔒 セキュリティのベストプラクティス

1. **API キーの管理**
   - `.env.local` はGitにコミットしない
   - Vercelなどのデプロイ先で環境変数を設定

2. **Firestore ルール**
   - 定期的にルールを見直す
   - テストツールで検証

3. **認証の制限**
   - 必要に応じて、特定ドメインからのみ認証を許可

## ❓ トラブルシューティング

### Firebase接続エラー

**症状**: "Firebase: Error (auth/configuration-not-found)"

**解決策**:
1. `.env.local` ファイルが存在するか確認
2. 環境変数名が正しいか確認（`NEXT_PUBLIC_` プレフィックス必須）
3. 開発サーバーを再起動

### 認証エラー

**症状**: Google認証時にエラー

**解決策**:
1. Firebase Console → Authentication → Sign-in method で Google が有効化されているか確認
2. 承認済みドメインにlocalhostが含まれているか確認

### Firestore 書き込みエラー

**症状**: "Missing or insufficient permissions"

**解決策**:
1. Firestore のセキュリティルールを確認
2. ユーザーが正しく認証されているか確認

## 📚 参考リンク

- [Firebase Documentation](https://firebase.google.com/docs)
- [Firestore Security Rules](https://firebase.google.com/docs/firestore/security/get-started)
- [Firebase Authentication](https://firebase.google.com/docs/auth)

---

セットアップ完了後、アプリが正常に動作することを確認してください！

