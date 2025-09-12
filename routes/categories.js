import express from 'express';
import OpenAI from 'openai';

const router = express.Router();
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

const PRODUCT_CATEGORIES = [
    '男裝','女裝','鞋子','3C','玩具','遊戲','菸酒','家具'
]
router.post('/', async (req , res) => {
    try {
        const { imageUrl } = req.body;
        if (!imageUrl) {
            return res.status(400).json({
                error: '請提供圖片連結'
            })
        }

        const tools = [
            {
                type: 'function',
                name: 'select_product_category',
                description: '從預定義的商品分類標籤中選擇最適合的標籤，所有回應必須使用繁體中文',
                parameters: {
                    type: 'object',
                    properties: {
                        product_name:{
                            type: 'string',
                            description: '商品名稱'
                        },
                        product_description: {
                            type: 'string',
                            description: '商品簡短描述'
                        },
                        categories: {
                            type: 'array',
                            description: '最多 5 個最相關標籤',
                            items: {
                                type: 'string',
                                enum: PRODUCT_CATEGORIES
                            },
                            maxItems: 5,
                        },
                    },
                    required: ['product_name', 'product_description', 'categories']
                }
            }
        ]
        const input = [
            {
                role: 'user',
                content: [
                    {type: 'input_text', text: '請分析這張產品圖片，從預定義的商品分類標籤中選擇最適合的標籤，最多 5 個，並以繁中提供名稱與描述。'},
                    {
                        type: 'input_image',
                        image_url: imageUrl
                    }
                ]
            }
        ]

        const response = await openai.responses.create({
            model: 'gpt-4o',
            input: input,
            tools: tools,
            tool_choice: 'auto',
        })

        const call = response.output?.find(o => o.name === 'select_product_category')
        if (!call) {
            return res.status(500).json({
                success: false,
                error: '沒有找到適合的商品分類標籤'
            })
        }

        const data = call.arguments;
        return res.json({
            success: true,
            data
        })

    } catch (error) {
        return res.status(500).json({
            error: error.message || '分類商品失敗'
        })
    }
})
export default router;