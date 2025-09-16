import express from 'express';
import OpenAI from 'openai';
import axios from 'axios';

const router = express.Router();
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

const WEATHER_API_KEY = process.env.WEATHER_API_KEY;
const WEATHER_API_URL = process.env.WEATHER_API_URL;

async function getWeatherData(city, days = 7) {
    try {
        const response = await axios.get(`${WEATHER_API_URL}/forecast.json`, {
        params: {
            key: WEATHER_API_KEY,
            q: city,
            days,
            aqi: 'yes',
            alerts: 'yes',
            lang: 'zh_tw'
        },
    });
    return response.data;
    } catch (error) {
        console.error('取得天氣資料失敗:', error);
        throw error;
    }

}

/**
 * POST api/weather/query
 * body: {
 *  query: string,
 * }
 */
router.post('/query', async (req, res) => {
    try {
        const { query } = req.body;
        if (!query) {
            return res.status(400).json({
                error: '請提供查詢城市'
            })
        }
        const tools = [
            {
                type: 'function',
                name: 'get_weather',
                description: '取得指定城市的天氣資訊',
                parameters: {
                    type: 'object',
                    properties: {
                        city: {
                            type: 'string',
                            description: '城市名稱，例如 taipei, tokyo, new york'
                        },
                        days: {
                            type: 'number',
                            description: '預報天數（1-10）'
                        }
                    },
                    required: ['city']
                }
            }
        ]

        const input = [{
            role: 'user',
            content: query
        }]

        const firstResponse = await openai.responses.create({
            model: 'gpt-4o',
            instructions: '你是天氣助手，當用戶問天氣時呼叫 get_weather，並用繁中回答。',
            input: input,
            tools: tools,
            tool_choice: 'auto',
        })
        
        const call = firstResponse.output?.find(o => o.name === 'get_weather')
        if (!call) {
            return res.json({
                query,
                answer: firstResponse.output_text ?? '',
                weatherData: null,
            })
        }

        const city = JSON.parse(call.arguments).city;
        const days = JSON.parse(call.arguments).days;

        const weatherData = await getWeatherData(city, days);

        input.push(call);
        input.push({
            type:'function_call_output',
            call_id: call.call_id,
            output: JSON.stringify(weatherData),
        })

        const finalResponse = await openai.responses.create({
            model: 'gpt-4o',
            instructions: '根據提供的天氣數據，用繁中回答用戶的問題；若問「會不會下雨」，請根據降雨機率與降水量給合理判斷。',
            input,
        })

        return res.json({
            query,
            city,
            answer: finalResponse.output_text ?? '',
            weatherData,
        })

    } catch (error) {
        return res.status(500).json({
            error: error.message || '查詢天氣失敗'
        })
    }
})

export default router;