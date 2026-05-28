import Link from 'next/link';
import { Globe } from 'lucide-react';

export function Navbar() {
  return (
    <nav className="border-b border-slate-200 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2">
            <Globe className="w-8 h-8 text-indigo-600" />
            <span className="text-xl font-bold text-slate-900">GEO-SEO</span>
          </Link>
          <div className="flex items-center gap-6">
            <Link
              href="/"
              className="text-slate-600 hover:text-slate-900 font-medium"
            >
              首页
            </Link>
            <Link
              href="/audit"
              className="text-slate-600 hover:text-slate-900 font-medium"
            >
              完整审计
            </Link>
            <Link
              href="/quick"
              className="text-slate-600 hover:text-slate-900 font-medium"
            >
              快速检测
            </Link>
            <Link
              href="/tools"
              className="text-slate-600 hover:text-slate-900 font-medium"
            >
              工具集
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
