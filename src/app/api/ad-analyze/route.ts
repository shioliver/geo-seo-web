import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import type { AdFormData, AdStrategy, AnalysisResult } from '@/lib/types';

interface AnalyzeRequest {
  formData: AdFormData;
  strategy: AdStrategy;
  apiKey?: string;
  baseUrl?: string;
  model?: string;
  stream?: boolean;
}

export async function POST(request: Request) {
  try {
    const { formData, strategy, apiKey, baseUrl, model, stream } = await request.json() as AnalyzeRequest;

    if (apiKey && apiKey.trim().length > 0) {
      const finalBaseUrl = (baseUrl || 'https://api.deepseek.com').replace(/\/+$/, '');
      const finalModel = model || 'deepseek-chat';

      const aiClient = new OpenAI({
        baseURL: `${finalBaseUrl}/v1`,
        apiKey: apiKey,
      });

      if (stream) {
        return handleStreamResponse(aiClient, finalModel, formData, strategy);
      }

      try {
        const result = await analyzeWithAI(aiClient, finalModel, formData, strategy);
        return NextResponse.json(result);
      } catch (aiError: any) {
        console.error('AI 分析失败，回退到规则引擎:', aiError?.message || aiError);
        const result = generateRuleBasedResult(formData, strategy);
        result.summary = `⚠️ AI 分析失败（${aiError?.message || '未知错误'}），以下为规则引擎分析结果。\n\n${result.summary}`;
        return NextResponse.json(result);
      }
    }

    const result = generateRuleBasedResult(formData, strategy);
    return NextResponse.json(result);
  } catch (error) {
    console.error('分析失败:', error);
    return NextResponse.json(
      { error: '分析失败，请稍后重试' },
      { status: 500 }
    );
  }
}

function handleStreamResponse(
  client: OpenAI,
  model: string,
  formData: AdFormData,
  strategy: AdStrategy,
) {
  const prompt = buildPrompt(formData, strategy);

  const encoder = new TextEncoder();

  const readable = new ReadableStream({
    async start(controller) {
      const sendEvent = (type: string, content: string) => {
        controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type, content })}\n\n`));
      };

      try {
        const stream = await client.chat.completions.create({
          model,
          messages: [
            {
              role: 'system',
              content: '你是中国数字营销广告策略专家。只返回 JSON，不含任何额外文字、代码块标记或解释。',
            },
            { role: 'user', content: prompt },
          ],
          temperature: 0.7,
          max_tokens: 4000,
          stream: true,
        });

        let fullContent = '';

        for await (const chunk of stream) {
          const delta = chunk.choices[0]?.delta;

          if (!delta) continue;

          if ('reasoning_content' in delta && (delta as any).reasoning_content) {
            sendEvent('thinking', (delta as any).reasoning_content);
          }

          if (delta.content) {
            fullContent += delta.content;
            sendEvent('content', delta.content);
          }
        }

        const jsonMatch = fullContent.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          try {
            const parsed = JSON.parse(jsonMatch[0]);
            const result: AnalysisResult = {
              overall_score: clamp(Math.round(parsed.overall_score || 75), 0, 100),
              summary: parsed.summary || 'AI 分析完成。',
              competitor_insight: parsed.competitor_insight || '暂无竞品洞察。',
              competitors: Array.isArray(parsed.competitors) ? parsed.competitors.slice(0, 5) : generateFallbackCompetitors(),
              comparison: normalizeComparison(parsed.comparison || {}),
            };
            sendEvent('done', JSON.stringify(result));
          } catch {
            sendEvent('done', JSON.stringify(generateRuleBasedResult(formData, strategy)));
          }
        } else {
          sendEvent('done', JSON.stringify(generateRuleBasedResult(formData, strategy)));
        }
      } catch (aiError: any) {
        console.error('流式 AI 分析失败:', aiError?.message);
        const fallback = generateRuleBasedResult(formData, strategy);
        fallback.summary = `⚠️ AI 分析失败（${aiError?.message || '未知错误'}），以下为规则引擎分析结果。\n\n${fallback.summary}`;
        sendEvent('error', aiError?.message || '未知错误');
        sendEvent('done', JSON.stringify(fallback));
      }

      controller.close();
    },
  });

  return new Response(readable, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    },
  });
}

function buildPrompt(formData: AdFormData, strategy: AdStrategy): string {
  const creativeLabel = getCreativeLabel(strategy.creative_form);
  const deliveryLabel = getDeliveryLabel(strategy.delivery_method);
  const heatingLabel = getHeatingLabel(strategy.heating_target);
  const platforms = formData.platforms.length > 0 ? formData.platforms.join('、') : '未选择';
  const budget = formData.budget > 0 ? `${formData.budget}元` : '未设置';
  const dailyBudget = strategy.custom_budget || strategy.daily_budget || '未设置';
  const period = strategy.delivery_period === 'long_term' ? '长期投放' : '固定日期';
  const region = strategy.target_audience.region || '不限';
  const gender = strategy.target_audience.gender === 'male' ? '男性' :
    strategy.target_audience.gender === 'female' ? '女性' : '不限';
  const age = strategy.target_audience.age || '不限';

  return `你是一名资深广告投放策略分析师。请根据以下广告信息进行深度分析，输出完整 JSON。

## 广告基本信息
- 主题：${formData.ad_topic || '未设置'}
- 目标：${formData.ad_goal || '未设置'}
- 计划：${formData.ad_plan || '无'}
- 品牌：${formData.brand_info.name || '未知'} · ${formData.brand_info.positioning || '未知定位'}
- 受众描述：${formData.brand_info.target_audience || '无'}
- 平台：${platforms}
- 总预算：${budget}

## 策略参数
- 创意形式：${creativeLabel}
- 投放方式：${deliveryLabel}
- 加热目标：${heatingLabel}
- 周期：${period}
- 日预算：${dailyBudget}元/天
- 地域：${region} | 性别：${gender} | 年龄：${age}

请严格返回以下 JSON（不要 markdown 标记，纯 JSON）：

{
  "overall_score": 数字0-100,
  "summary": "综合策略分析，150字以上，涵盖创意、投放、预算、受众评价",
  "competitor_insight": "竞品洞察，100字以上",
  "competitors": [
    {"name":"竞品名","budget_level":"高/中/低","creative_style":"风格","positioning":"定位","target_audience":"人群","ad_strategy":"策略","advantages":["优1"],"disadvantages":["劣1"]}
  ],
  "comparison": {
    "创意形式":{"score":数字,"suggestion":"建议20字+"},
    "投放方式":{"score":数字,"suggestion":"建议20字+"},
    "加热目标":{"score":数字,"suggestion":"建议20字+"},
    "投放时间":{"score":数字,"suggestion":"建议20字+"},
    "日预算":{"score":数字,"suggestion":"建议20字+"},
    "目标受众":{"score":数字,"suggestion":"建议20字+"}
  }
}`;
}

async function analyzeWithAI(
  client: OpenAI,
  model: string,
  formData: AdFormData,
  strategy: AdStrategy,
): Promise<AnalysisResult> {
  const prompt = buildPrompt(formData, strategy);

  const response = await client.chat.completions.create({
    model,
    messages: [
      {
        role: 'system',
        content: '你是中国数字营销广告策略专家。只返回 JSON，不含任何额外文字、代码块标记或解释。',
      },
      { role: 'user', content: prompt },
    ],
    temperature: 0.7,
    max_tokens: 4000,
  });

  const content = response.choices[0]?.message?.content || '';
  console.log(`AI (${model}) 响应长度: ${content.length}`);

  const jsonMatch = content.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error('AI 未返回有效 JSON');
  }

  const parsed = JSON.parse(jsonMatch[0]);

  if (!parsed.competitors || !Array.isArray(parsed.competitors)) {
    parsed.competitors = generateFallbackCompetitors();
  }
  if (!parsed.comparison || typeof parsed.comparison !== 'object') {
    parsed.comparison = {};
  }

  return {
    overall_score: clamp(Math.round(parsed.overall_score || 75), 0, 100),
    summary: parsed.summary || 'AI 分析完成。',
    competitor_insight: parsed.competitor_insight || '暂无竞品洞察。',
    competitors: parsed.competitors.slice(0, 5),
    comparison: normalizeComparison(parsed.comparison),
  };
}

function clamp(v: number, min: number, max: number) {
  return Math.max(min, Math.min(max, v));
}

function normalizeComparison(comparison: Record<string, any>) {
  const keys = ['创意形式', '投放方式', '加热目标', '投放时间', '日预算', '目标受众'];
  const result: Record<string, { score: number; suggestion: string }> = {};
  for (const key of keys) {
    const data = comparison[key];
    result[key] = {
      score: typeof data?.score === 'number' ? clamp(Math.round(data.score), 0, 100) : 70,
      suggestion: typeof data?.suggestion === 'string' && data.suggestion.length > 0
        ? data.suggestion
        : '建议根据数据持续优化。',
    };
  }
  return result;
}

function getCreativeLabel(form: string) {
  const m: Record<string, string> = { live_stream: '直投直播间', video: '视频引流', image: '图文推广', interactive: '互动玩法' };
  return m[form] || form;
}
function getDeliveryLabel(method: string) {
  const m: Record<string, string> = { cost_control: '控成本投放', volume: '放量投放', uniform: '匀速投放', accelerate: '加速投放' };
  return m[method] || method;
}
function getHeatingLabel(target: string) {
  const m: Record<string, string> = { popularity: '直播间人气提升', view: '有效观看提升', interaction: '互动率提升', conversion: '转化提升' };
  return m[target] || target;
}

function generateRuleBasedResult(formData: AdFormData, strategy: AdStrategy): AnalysisResult {
  const scores: Record<string, number> = {
    creative_form: calcCreative(strategy.creative_form),
    delivery_method: calcDelivery(strategy.delivery_method),
    heating_target: calcHeating(strategy.heating_target),
    delivery_time: calcTime(strategy),
    daily_budget: calcBudget(strategy, formData),
    target_audience: calcAudience(strategy.target_audience),
  };
  const avg = Math.round(Object.values(scores).reduce((a, b) => a + b, 0) / 6);

  const platformText = formData.platforms.length > 0
    ? `已选择 ${formData.platforms.join('、')} 平台投放。`
    : '建议至少选择一个投放平台。';

  const budgetText = formData.budget > 0
    ? `总预算 ${formData.budget} 元，日均约 ${Math.round(formData.budget / 30)} 元。`
    : '未设置总预算。';

  const summary = `「${formData.ad_topic || '未命名计划'}」策略分析：

${platformText}${budgetText}
创意「${getCreativeLabel(strategy.creative_form)}」+ 投放「${getDeliveryLabel(strategy.delivery_method)}」+ 目标「${getHeatingLabel(strategy.heating_target)}」。
综合评估：${avg >= 85 ? '优秀' : avg >= 70 ? '良好' : avg >= 55 ? '中等' : '需优化'}。

💡 配置 DeepSeek API Key 即可启用 AI 实时深度分析，获得精准策略建议。`;

  return {
    overall_score: avg,
    summary,
    competitor_insight: `同类广告主主要集中在${formData.platforms.includes('抖音') ? '抖音' : '小红书'}平台，以短视频引流+直播转化为主要模式。建议差异化定位。\n\n💡 配置 DeepSeek API Key 可获得实时竞品洞察。`,
    competitors: generateFallbackCompetitors(),
    comparison: {
      '创意形式': { score: scores.creative_form, suggestion: getCreativeSug(strategy.creative_form) },
      '投放方式': { score: scores.delivery_method, suggestion: getDeliverySug(strategy.delivery_method) },
      '加热目标': { score: scores.heating_target, suggestion: getHeatingSug(strategy.heating_target) },
      '投放时间': { score: scores.delivery_time, suggestion: getTimeSug(strategy) },
      '日预算': { score: scores.daily_budget, suggestion: getBudgetSug(strategy, formData) },
      '目标受众': { score: scores.target_audience, suggestion: getAudSug(strategy.target_audience) },
    },
  };
}

function calcCreative(f: string) { return ({ live_stream: 85, video: 90, image: 75, interactive: 80 } as any)[f] || 70; }
function calcDelivery(m: string) { return ({ cost_control: 85, volume: 80, uniform: 75, accelerate: 70 } as any)[m] || 70; }
function calcHeating(t: string) { return ({ popularity: 75, view: 85, interaction: 80, conversion: 90 } as any)[t] || 70; }
function calcTime(s: AdStrategy) {
  let sc = 60;
  if (s.delivery_period === 'fixed' && s.start_date && s.end_date) sc += 15;
  if (s.time_grid) {
    const n = s.time_grid.flat().filter(Boolean).length;
    if (n >= 8) sc += 15; else if (n >= 4) sc += 10;
  }
  return Math.min(sc, 95);
}
function calcBudget(s: AdStrategy, fd: AdFormData) {
  const d = s.custom_budget || Number(s.daily_budget) || 0;
  if (d >= 1000) return 90;
  if (d >= 500) return 80;
  if (d >= 100) return 70;
  if (fd.budget >= 10000) return 85;
  if (fd.budget >= 5000) return 75;
  return 60;
}
function calcAudience(a: any) {
  let sc = 50;
  if (a.region) sc += 10;
  if (a.gender !== 'all') sc += 10;
  if (a.age) sc += 15;
  if (a.platform !== 'all') sc += 5;
  return Math.min(sc, 95);
}

function getCreativeSug(f: string) {
  const m: Record<string, string> = {
    live_stream: '直投直播间适合实时互动，配合直播时段投放效果更佳。',
    video: '视频引流效果好，建议高质量短视频突出卖点。',
    image: '图文推广成本低，适合种草转化，优化图文质量。',
    interactive: '互动玩法增强粘性，设计有趣活动促进参与。',
  };
  return m[f] || '根据产品特性选择合适创意形式。';
}
function getDeliverySug(m: string) {
  const s: Record<string, string> = {
    cost_control: '控成本适合预算有限场景，设置合理转化出价。',
    volume: '放量适合品牌曝光阶段，配合优质内容效果好。',
    uniform: '匀速适合长期稳定投放，持续优化效果。',
    accelerate: '加速适合新品推广，注意预算消耗速度。',
  };
  return s[m] || '根据目标选择投放方式。';
}
function getHeatingSug(t: string) {
  const s: Record<string, string> = {
    popularity: '配合引流活动增加直播间热度。',
    view: '优化直播内容，增加有效观看时长。',
    interaction: '设计互动话题和福利活动提升互动率。',
    conversion: '优化产品介绍和下单引导流程。',
  };
  return s[t] || '明确投放目标，针对性优化。';
}
function getTimeSug(s: AdStrategy) {
  if (!s.time_grid || s.time_grid.flat().filter(Boolean).length === 0) return '建议设置投放时段。';
  return '时段设置合理，根据数据持续优化。';
}
function getBudgetSug(s: AdStrategy, fd: AdFormData) {
  const d = s.custom_budget || Number(s.daily_budget) || 0;
  if (d < 100) return '日预算偏低，建议适当增加。';
  if (fd.budget < 1000) return '总预算有限，聚焦核心平台投放。';
  return '预算合理，根据效果动态调整。';
}
function getAudSug(a: any) {
  const s: string[] = [];
  if (!a.region) s.push('设置地域定向精准触达市场。');
  if (a.gender === 'all') s.push('可设置性别定向提高效率。');
  if (!a.age) s.push('设置年龄段精准匹配用户。');
  return s.length > 0 ? s.join(' ') : '受众定位合理，持续优化。';
}

function generateFallbackCompetitors() {
  return [
    { name: '竞品A', budget_level: '高' as const, creative_style: '短视频+直播组合', positioning: '高端定位', target_audience: '25-35岁高消费女性', ad_strategy: '头部达人+信息流', advantages: ['品牌知名度高', '内容质量优秀'], disadvantages: ['价格偏高', '创新不足'] },
    { name: '竞品B', budget_level: '中' as const, creative_style: '图文种草为主', positioning: '性价比路线', target_audience: '18-28岁年轻用户', ad_strategy: '腰部达人+直播带货', advantages: ['价格优势', '用户粘性高'], disadvantages: ['品牌力弱', '内容参差'] },
    { name: '竞品C', budget_level: '低' as const, creative_style: 'UGC内容传播', positioning: '小众品牌', target_audience: '特定兴趣群体', ad_strategy: '内容营销+私域', advantages: ['用户忠诚高', '成本可控'], disadvantages: ['规模有限', '增长慢'] },
  ];
}
