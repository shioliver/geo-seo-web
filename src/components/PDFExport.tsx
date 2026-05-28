'use client';

import { jsPDF } from 'jspdf';
import { Button } from './ui/Button';
import { Download } from 'lucide-react';

interface AuditResult {
  url: string;
  overallScore: number;
  categories: any;
  details: any;
  timestamp: Date;
}

export default function PDFExport({ result }: { result: AuditResult }) {
  const generatePDF = () => {
    const doc = new jsPDF();
    
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 20;
    let yPos = 30;

    doc.setFontSize(24);
    doc.setTextColor(63, 81, 181);
    doc.text('GEO-SEO 审计报告', pageWidth / 2, yPos, { align: 'center' });
    
    yPos += 15;
    doc.setFontSize(10);
    doc.setTextColor(128, 128, 128);
    doc.text(`审计时间: ${new Date(result.timestamp).toLocaleString('zh-CN')}`, pageWidth / 2, yPos, { align: 'center' });
    
    yPos += 10;
    doc.text(`审计网站: ${result.url}`, pageWidth / 2, yPos, { align: 'center' });
    
    yPos += 20;
    doc.setFillColor(63, 81, 181);
    doc.roundedRect(margin, yPos, pageWidth - margin * 2, 30, 5, 5, 'F');
    
    yPos += 18;
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(20);
    doc.text(`总体评分: ${result.overallScore}/100`, pageWidth / 2, yPos, { align: 'center' });
    
    yPos += 25;
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(14);
    
    const categories = Object.entries(result.categories);
    
    categories.forEach(([key, category], index) => {
      if (yPos > 260) {
        doc.addPage();
        yPos = 30;
      }
      
      const cat = category as any;
      
      doc.setFontSize(12);
      doc.setTextColor(63, 81, 181);
      doc.text(`${index + 1}. ${cat.label}`, margin, yPos);
      
      yPos += 8;
      doc.setFontSize(10);
      doc.setTextColor(0, 0, 0);
      
      const score = cat.score;
      doc.text(`评分: ${score}`, margin + 5, yPos);
      
      yPos += 6;
      doc.setDrawColor(score >= 80 ? 76 : score >= 60 ? 255 : 244, score >= 80 ? 175 : score >= 60 ? 193 : 67, score >= 80 ? 80 : score >= 60 ? 7 : 54);
      doc.setFillColor(score >= 80 ? 76 : score >= 60 ? 255 : 244, score >= 80 ? 175 : score >= 60 ? 193 : 67, score >= 80 ? 80 : score >= 60 ? 7 : 54);
      doc.rect(margin, yPos, (score / 100) * (pageWidth - margin * 2), 5, 'F');
      
      yPos += 15;
      
      if (cat.items && cat.items.length > 0) {
        cat.items.forEach((item: any, i: number) => {
          if (yPos > 270) {
            doc.addPage();
            yPos = 30;
          }
          
          let icon = '!';
          if (item.status === 'pass') icon = '✓';
          if (item.status === 'warning') icon = '⚠';
          if (item.status === 'fail') icon = '✗';
          
          doc.setFontSize(9);
          doc.setTextColor(0, 0, 0);
          doc.text(`  ${icon} ${item.name}`, margin, yPos);
          yPos += 6;
          doc.setTextColor(100, 100, 100);
          doc.text(`    ${item.description}`, margin, yPos);
          yPos += 8;
        });
      }
    });
    
    if (result.details) {
      if (yPos > 220) {
        doc.addPage();
        yPos = 30;
      }
      
      doc.setFontSize(14);
      doc.setTextColor(63, 81, 181);
      doc.text('优化建议', margin, yPos);
      yPos += 12;
      
      let suggestions: string[] = [];
      
      if (result.details.schema && result.details.schema.recommendations) {
        suggestions = suggestions.concat(result.details.schema.recommendations);
      }
      
      if (result.details.content && result.details.content.recommendations) {
        suggestions = suggestions.concat(result.details.content.recommendations);
      }
      
      if (suggestions.length === 0) {
        suggestions.push('定期更新内容，保持内容新鲜度');
        suggestions.push('添加详细的Schema标记');
        suggestions.push('优化网站结构，改善导航');
        suggestions.push('添加更多高质量的内部链接');
      }
      
      suggestions.forEach((suggestion, index) => {
        if (yPos > 270) {
          doc.addPage();
          yPos = 30;
        }
        
        doc.setFontSize(9);
        doc.setTextColor(0, 0, 0);
        doc.text(`${index + 1}. ${suggestion}`, margin, yPos);
        yPos += 8;
      });
    }
    
    doc.addPage();
    yPos = 30;
    
    doc.setFontSize(14);
    doc.setTextColor(63, 81, 181);
    doc.text('关于本报告', margin, yPos);
    
    yPos += 12;
    doc.setFontSize(10);
    doc.setTextColor(80, 80, 80);
    doc.text('本报告由 GEO-SEO 工具生成，旨在帮助您优化网站以适应AI搜索引擎。', margin, yPos);
    
    yPos += 8;
    doc.text('报告中所有评分和建议仅供参考，实际效果可能因多种因素而异。', margin, yPos);
    
    yPos += 8;
    doc.text('© 2026 GEO-SEO - 为AI时代优化', margin, yPos);
    
    doc.save(`geo-seo-audit-${result.url.replace(/[^a-zA-Z0-9]/g, '-')}-${new Date().toISOString().split('T')[0]}.pdf`);
  };

  return (
    <Button variant="outline" onClick={generatePDF}>
      <Download className="w-4 h-4 mr-2" />
      导出 PDF
    </Button>
  );
}
