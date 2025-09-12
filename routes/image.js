import express from 'express';
import OpenAI from 'openai';

const router = express.Router();
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

/**
 * POST /image-analysis
 * 分析圖片
 * body:{
 * message?: string,
 * imageUrl: string,
 * }
 */
router.post('/', async (req, res) => {
    try {
        const { message, imageUrl } = req.body;
        if (!imageUrl) {
            return res.status(400).json({
                error: '請提供圖片連結'
            })
        }

        const input = [
            {
                role: 'user',
                content: [
                    {
                        type: 'input_text', text: message || '請分析這張圖片'
                    },
                    {
                        type: 'input_image', image_url: imageUrl
                    }
                ]
            }
        ]

        const response = await openai.responses.create({
            model: 'gpt-4o',
            input: input,
        })

        return res.json({
            response: response.output_text ?? ''
        })
    } catch (error) {
        return res.status(500).json({
            error: error.message || '分析圖片失敗'
        })
    }
})

export default router;