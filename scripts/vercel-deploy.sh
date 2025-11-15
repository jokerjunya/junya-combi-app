#!/bin/bash

# Vercel デプロイスクリプト
# 使い方: ./scripts/vercel-deploy.sh [production|preview]

set -e

# カラー設定
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${BLUE}🚀 Vercel デプロイスクリプト${NC}"
echo ""

# デプロイ環境を確認
DEPLOY_ENV=${1:-preview}

if [ "$DEPLOY_ENV" = "production" ] || [ "$DEPLOY_ENV" = "prod" ]; then
    echo -e "${YELLOW}📦 本番環境にデプロイします...${NC}"
    npx vercel --prod
elif [ "$DEPLOY_ENV" = "preview" ]; then
    echo -e "${YELLOW}📦 プレビュー環境にデプロイします...${NC}"
    npx vercel
else
    echo -e "${YELLOW}使い方: $0 [production|preview]${NC}"
    exit 1
fi

echo ""
echo -e "${GREEN}✅ デプロイ完了！${NC}"

