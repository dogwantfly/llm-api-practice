# LLM API 練習專案

一個整合多種 AI 功能的 Node.js API 服務，包含圖片辨識、電商商品分類、圖片生成和天氣預報等功能。

## 🚀 功能特色

- **圖片辨識分析** - 使用 GPT-4 Vision 分析圖片內容
- **電商商品分類** - 自動將商品圖片分類到預定義的類別
- **AI 圖片生成** - 使用 DALL-E 3 根據文字描述生成圖片
- **智能天氣預報** - 整合天氣 API 提供自然語言天氣查詢

## 📋 系統需求

- Node.js 18+ 
- npm 或 yarn
- OpenAI API Key
- 天氣 API Key (https://www.weatherapi.com)

## 🛠 安裝步驟

1. **複製專案**
```bash
git clone <repository-url>
cd llm-api-practice
```

2. **安裝依賴套件**
```bash
npm install
```

3. **設定環境變數**
創建 `.env` 檔案並填入以下變數：
```env
OPENAI_API_KEY=your_openai_api_key_here
WEATHER_API_KEY=your_weather_api_key_here
WEATHER_API_URL=https://api.weatherapi.com/v1
PORT=3000
```

4. **啟動服務**
```bash
# 開發模式
npm run dev

# 生產模式
npm start
```

服務將在 `http://localhost:3000` 啟動

## 🔧 技術架構

- **框架：** Express.js
- **AI 模型：** OpenAI GPT-4o, DALL-E 3
- **天氣服務：** Weatherapi.com
- **語言：** JavaScript (ES6+)
- **運行環境：** Node.js

## 📁 專案結構

```
llm-api-practice/
├── routes/
│   ├── image.js          # 圖片辨識路由
│   ├── categories.js     # 商品分類路由
│   ├── gen-image.js      # 圖片生成路由
│   └── weather.js        # 天氣預報路由
├── server.js             # 主服務器檔案
├── package.json          # 專案配置
└── README.md            # 專案說明
```

## 🚦 使用範例

### 圖片辨識
```bash
curl -X POST http://localhost:3000/image-analysis \
  -H "Content-Type: application/json" \
  -d '{
    "message": "這張圖片裡有什麼？",
    "imageUrl": "https://example.com/image.jpg"
  }'
```

### 商品分類
```bash
curl -X POST http://localhost:3000/product-categories \
  -H "Content-Type: application/json" \
  -d '{
    "imageUrl": "https://example.com/product.jpg"
  }'
```

### 生成圖片
```bash
curl -X POST http://localhost:3000/image-generation \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "一隻可愛的橘色貓咪",
    "size": "1024x1024"
  }'
```

### 天氣查詢
```bash
curl -X POST http://localhost:3000/api/weather/query \
  -H "Content-Type: application/json" \
  -d '{
    "query": "台北今天天氣如何？"
  }'
```

## ⚠️ 注意事項

1. **API 金鑰安全：** 請勿將 API 金鑰提交到版本控制系統
2. **圖片 URL：** 確保提供的圖片 URL 可以公開存取
3. **API 限制：** OpenAI API 有使用限制，請注意用量
4. **錯誤處理：** 所有 API 都有完整的錯誤處理機制

## 📕參考資源
https://hackmd.io/@hexschool/HyxfvU_SCkl