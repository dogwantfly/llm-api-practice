import express from 'express';
import OpenAI from 'openai';

const router = express.Router();
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});
const VALID_SIZES = ['1024x1024', '1024x1792', '1792x1024'];

router.post('/', async (req, res) => {
    try {
        const { prompt, size } = req.body
        if (!prompt) {
            return res.status(400).json({
                error: '請提供圖片描述提示文字'
            })
        }

        const imageSize = size && VALID_SIZES.includes(size) ? size : '1024x1024';

        const result = await openai.images.generate({
            model: 'dall-e-3',
            prompt: prompt,
            n: 1,
            size: imageSize,
            quality: 'standard',
        })

        if (!result.data?.length) throw new Error('生成圖片失敗');
        const { url, revised_prompt} = result.data[0];
        return res.json({
            success: true,
            url,
            revised_prompt
        })
    } catch (error) {
        return res.status(500).json({
            error: error.message || '生成圖片失敗'
        })
    }
})
export default router;