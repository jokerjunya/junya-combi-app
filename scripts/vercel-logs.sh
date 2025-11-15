#!/bin/bash

# Vercel ログ表示スクリプト
# 使い方: ./scripts/vercel-logs.sh [deployment-url]

set -e

GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}📋 Vercel ログを表示します${NC}"
echo ""

if [ -z "$1" ]; then
    # URLが指定されていない場合、最新のデプロイメントのログを表示
    npx vercel logs
else
    # URLが指定されている場合
    npx vercel logs "$1"
fi

