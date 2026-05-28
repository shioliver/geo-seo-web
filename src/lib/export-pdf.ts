import type { AnalysisResult } from '@/lib/types';

interface ExportData {
  topic: string;
  goal: string;
  brand: string;
  platforms: string[];
  budget: number;
  result: AnalysisResult;
}

function getScoreColor(score: number): string {
  if (score >= 85) return '#10b981';
  if (score >= 70) return '#06b6d4';
  if (score >= 50) return '#f59e0b';
  return '#ef4444';
}

function getScoreLabel(score: number): string {
  if (score >= 90) return '卓越';
  if (score >= 75) return '优秀';
  if (score >= 60) return '良好';
  if (score >= 40) return '中等';
  return '需优化';
}

function getBudgetColor(level: string): string {
  if (level === '高') return '#ef4444';
  if (level === '中') return '#f59e0b';
  return '#94a3b8';
}

export async function exportToPDF(data: ExportData, filename: string) {
  const html2canvas = (await import('html2canvas')).default;
  const { default: jsPDF } = await import('jspdf');

  const container = document.createElement('div');
  container.style.cssText = 'position:fixed;left:-9999px;top:0;z-index:-1;';
  container.innerHTML = buildReportHTML(data);
  document.body.appendChild(container);

  await new Promise((r) => setTimeout(r, 300));

  try {
    const canvas = await html2canvas(container, {
      scale: 2,
      useCORS: true,
      backgroundColor: '#ffffff',
      logging: false,
      width: container.scrollWidth,
      height: container.scrollHeight,
    });

    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const imgWidth = pageWidth - 16;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    let heightLeft = imgHeight;
    let position = 8;

    pdf.addImage(imgData, 'PNG', 8, position, imgWidth, imgHeight);
    heightLeft -= pageHeight - 16;

    while (heightLeft > 0) {
      position = heightLeft - imgHeight + 8;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 8, position, imgWidth, imgHeight);
      heightLeft -= pageHeight - 16;
    }

    pdf.save(filename);
  } finally {
    document.body.removeChild(container);
  }
}

function buildReportHTML(data: ExportData): string {
  const r = data.result;
  const scoreColor = getScoreColor(r.overall_score);
  const scoreLabel = getScoreLabel(r.overall_score);
  const now = new Date().toLocaleString('zh-CN');

  const comparisonRows = Object.entries(r.comparison)
    .map(
      ([key, val]) => `
    <tr>
      <td style="padding:10px 14px;border-bottom:1px solid #e2e8f0;font-weight:600;color:#1e293b;width:120px;">${key}</td>
      <td style="padding:10px 14px;border-bottom:1px solid #e2e8f0;width:80px;text-align:center;">
        <span style="display:inline-block;padding:2px 10px;border-radius:12px;font-size:13px;font-weight:700;color:#fff;background:${getScoreColor(val.score)};">${val.score}</span>
      </td>
      <td style="padding:10px 14px;border-bottom:1px solid #e2e8f0;">
        <div style="background:#f1f5f9;border-radius:4px;height:8px;overflow:hidden;margin-bottom:6px;">
          <div style="background:${getScoreColor(val.score)};height:100%;width:${val.score}%;border-radius:4px;"></div>
        </div>
        <span style="color:#64748b;font-size:13px;">${val.suggestion}</span>
      </td>
    </tr>`
    )
    .join('');

  const competitorCards = r.competitors
    .map(
      (c, i) => `
    <div style="border:1px solid #e2e8f0;border-radius:10px;padding:16px;margin-bottom:12px;page-break-inside:avoid;">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;">
        <span style="font-size:16px;font-weight:700;color:#1e293b;">${i + 1}. ${c.name}</span>
        <span style="font-size:12px;padding:2px 10px;border-radius:12px;color:#fff;background:${getBudgetColor(c.budget_level)};">${c.budget_level}预算</span>
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:10px;">
        <div style="font-size:13px;color:#475569;"><b>定位：</b>${c.positioning}</div>
        <div style="font-size:13px;color:#475569;"><b>创意：</b>${c.creative_style}</div>
        <div style="font-size:13px;color:#475569;"><b>人群：</b>${c.target_audience}</div>
        <div style="font-size:13px;color:#475569;"><b>策略：</b>${c.ad_strategy}</div>
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;">
        <div style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:8px;padding:10px;">
          <div style="font-size:12px;font-weight:600;color:#16a34a;margin-bottom:4px;">✓ 竞争优势</div>
          ${c.advantages.map((a) => `<div style="font-size:12px;color:#15803d;padding:1px 0;">· ${a}</div>`).join('')}
        </div>
        <div style="background:#fef2f2;border:1px solid #fecaca;border-radius:8px;padding:10px;">
          <div style="font-size:12px;font-weight:600;color:#dc2626;margin-bottom:4px;">✗ 竞争劣势</div>
          ${c.disadvantages.map((d) => `<div style="font-size:12px;color:#b91c1c;padding:1px 0;">· ${d}</div>`).join('')}
        </div>
      </div>
    </div>`
    )
    .join('');

  return `
<div style="width:794px;font-family:'PingFang SC','Microsoft YaHei','Noto Sans SC',sans-serif;background:#fff;color:#1e293b;line-height:1.6;padding:0;">

  <!-- Cover -->
  <div style="background:linear-gradient(135deg,#1e1b4b 0%,#312e81 100%);color:#fff;padding:60px 48px;text-align:center;">
    <div style="font-size:32px;font-weight:800;margin-bottom:8px;">广告策略优化报告</div>
    <div style="font-size:16px;color:#c4b5fd;margin-bottom:40px;">${data.topic || '未命名计划'}</div>
    <div style="display:inline-block;width:100px;height:100px;border-radius:50%;background:${scoreColor};line-height:100px;font-size:42px;font-weight:900;color:#fff;text-align:center;">${r.overall_score}</div>
    <div style="font-size:20px;color:${scoreColor};margin-top:12px;font-weight:700;">${scoreLabel}</div>
    <div style="margin-top:30px;display:flex;justify-content:center;gap:24px;font-size:14px;color:#a5b4fc;">
      <span>品牌：${data.brand || '未设置'}</span>
      <span>目标：${data.goal || '未设置'}</span>
      <span>平台：${data.platforms.length > 0 ? data.platforms.join(' / ') : '未选择'}</span>
      <span>预算：${data.budget > 0 ? data.budget + ' 元' : '未设置'}</span>
    </div>
  </div>

  <!-- Body -->
  <div style="padding:36px 48px;">

    <!-- 策略总结 -->
    <h2 style="font-size:18px;color:#1e293b;border-bottom:2px solid #6366f1;padding-bottom:6px;margin-bottom:12px;">📊 策略总结</h2>
    <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:8px;padding:16px;font-size:14px;color:#334155;line-height:1.8;white-space:pre-wrap;margin-bottom:28px;">${r.summary}</div>

    <!-- 竞品洞察 -->
    <h2 style="font-size:18px;color:#1e293b;border-bottom:2px solid #f59e0b;padding-bottom:6px;margin-bottom:12px;">🔍 竞品洞察</h2>
    <div style="background:#fffbeb;border:1px solid #fde68a;border-radius:8px;padding:16px;font-size:14px;color:#92400e;line-height:1.8;margin-bottom:28px;">${r.competitor_insight}</div>

    <!-- 参数评分 -->
    <h2 style="font-size:18px;color:#1e293b;border-bottom:2px solid #8b5cf6;padding-bottom:6px;margin-bottom:12px;">📈 参数评分与优化建议</h2>
    <table style="width:100%;border-collapse:collapse;margin-bottom:28px;">
      <thead>
        <tr style="background:#f1f5f9;">
          <th style="padding:10px 14px;text-align:left;font-size:13px;color:#475569;border-bottom:2px solid #e2e8f0;">参数</th>
          <th style="padding:10px 14px;text-align:center;font-size:13px;color:#475569;border-bottom:2px solid #e2e8f0;width:80px;">评分</th>
          <th style="padding:10px 14px;text-align:left;font-size:13px;color:#475569;border-bottom:2px solid #e2e8f0;">进度与建议</th>
        </tr>
      </thead>
      <tbody>${comparisonRows}</tbody>
    </table>

    <!-- 竞品分析 -->
    <h2 style="font-size:18px;color:#1e293b;border-bottom:2px solid #06b6d4;padding-bottom:6px;margin-bottom:12px;">🏢 竞品分析</h2>
    ${competitorCards}

    <!-- Footer -->
    <div style="margin-top:36px;padding-top:16px;border-top:1px solid #e2e8f0;text-align:center;font-size:12px;color:#94a3b8;">
      GEO-SEO 广告策略优化报告 · 生成时间：${now}
    </div>
  </div>
</div>`;
}
