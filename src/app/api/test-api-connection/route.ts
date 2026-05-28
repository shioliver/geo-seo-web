import { NextResponse } from 'next/server';
import OpenAI from 'openai';

export async function POST(request: Request) {
  try {
    const { apiKey, baseUrl, model } = await request.json() as {
      apiKey: string;
      baseUrl: string;
      model: string;
    };

    if (!apiKey || apiKey.trim().length === 0) {
      return NextResponse.json(
        { success: false, message: 'API Key 不能为空' },
        { status: 400 }
      );
    }

    const finalBaseUrl = (baseUrl || 'https://api.deepseek.com').replace(/\/+$/, '');
    const finalModel = model || 'deepseek-chat';

    const client = new OpenAI({
      baseURL: `${finalBaseUrl}/v1`,
      apiKey: apiKey,
    });

    const startTime = Date.now();

    const response = await client.chat.completions.create({
      model: finalModel,
      messages: [
        { role: 'user', content: '你好，请用一句话回复确认连接正常。' },
      ],
      max_tokens: 50,
      temperature: 0,
    });

    const latency = Date.now() - startTime;
    const reply = response.choices[0]?.message?.content || '无响应';

    return NextResponse.json({
      success: true,
      message: `连接成功！模型: ${finalModel}`,
      latency: `${latency}ms`,
      reply: reply.trim(),
      model: finalModel,
    });
  } catch (error: any) {
    console.error('API 测试失败:', error?.message);

    let message = '连接失败';
    if (error?.status === 401) {
      message = 'API Key 无效或已过期';
    } else if (error?.status === 429) {
      message = '请求频率超限，请稍后重试';
    } else if (error?.status === 404) {
      message = '模型不存在，请检查模型名称';
    } else if (error?.code === 'ENOTFOUND' || error?.code === 'ECONNREFUSED') {
      message = '无法连接到 API 服务器，请检查 Base URL';
    } else if (error?.message) {
      message = error.message.slice(0, 200);
    }

    return NextResponse.json(
      { success: false, message },
      { status: 200 }
    );
  }
}
