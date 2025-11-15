#!/bin/bash

# Vercel 環境変数管理スクリプト
# 使い方: 
#   ./scripts/vercel-env.sh list           - 環境変数一覧
#   ./scripts/vercel-env.sh pull           - 環境変数をローカルに取得
#   ./scripts/vercel-env.sh add <name>     - 環境変数を追加

set -e

GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${BLUE}⚙️  Vercel 環境変数管理${NC}"
echo ""

ACTION=${1:-list}

case $ACTION in
    list|ls)
        echo -e "${YELLOW}📋 環境変数一覧:${NC}"
        npx vercel env ls
        ;;
    pull)
        echo -e "${YELLOW}⬇️  環境変数をローカルに取得:${NC}"
        npx vercel env pull .env.local
        echo -e "${GREEN}✅ .env.local に保存しました${NC}"
        ;;
    add)
        if [ -z "$2" ]; then
            echo -e "${YELLOW}使い方: $0 add <変数名>${NC}"
            exit 1
        fi
        echo -e "${YELLOW}➕ 環境変数を追加: $2${NC}"
        npx vercel env add "$2" production
        ;;
    rm|remove)
        if [ -z "$2" ]; then
            echo -e "${YELLOW}使い方: $0 remove <変数名>${NC}"
            exit 1
        fi
        echo -e "${YELLOW}🗑️  環境変数を削除: $2${NC}"
        npx vercel env rm "$2" production
        ;;
    *)
        echo -e "${YELLOW}使い方:${NC}"
        echo "  $0 list              - 環境変数一覧"
        echo "  $0 pull              - 環境変数をローカルに取得"
        echo "  $0 add <変数名>      - 環境変数を追加"
        echo "  $0 remove <変数名>   - 環境変数を削除"
        exit 1
        ;;
esac

