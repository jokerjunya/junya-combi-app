#!/bin/bash

# Firebase セットアップスクリプト
# このスクリプトを実行する前に、firebase login を実行してください

echo "🚀 Firebase プロジェクトのセットアップを開始します..."
echo ""

# Firebase プロジェクト一覧を表示
echo "📋 利用可能なFirebaseプロジェクト一覧:"
firebase projects:list

echo ""
echo "既存のプロジェクトを使用する場合は、プロジェクトIDを入力してください。"
echo "新規プロジェクトを作成する場合は、'new' と入力してください。"
read -p "プロジェクトID (例: junya-combi-app): " PROJECT_ID

if [ "$PROJECT_ID" = "new" ]; then
    read -p "新規プロジェクトのID: " NEW_PROJECT_ID
    echo "📦 新規プロジェクトを作成します: $NEW_PROJECT_ID"
    firebase projects:create "$NEW_PROJECT_ID"
    PROJECT_ID="$NEW_PROJECT_ID"
fi

echo ""
echo "🔧 Firebaseプロジェクトを初期化します: $PROJECT_ID"

# Firebase プロジェクトを使用
firebase use "$PROJECT_ID"

# Firebase 初期化（Firestore, Hosting）
echo ""
echo "📝 Firebase の機能を初期化します..."
echo "以下の機能を選択してください:"
echo "  - Firestore"
echo "  - Hosting (オプション)"
echo ""

firebase init

echo ""
echo "✅ Firebase のセットアップが完了しました！"
echo ""
echo "次のステップ:"
echo "1. .env.local ファイルを作成"
echo "2. Firebase Console で設定を確認"
echo "3. npm run dev で開発サーバーを起動"

