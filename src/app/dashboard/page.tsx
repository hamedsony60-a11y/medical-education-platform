import Link from 'next/link';
import { FileQuestion, Video, ShoppingBag, Calendar } from 'lucide-react';

export default function DashboardPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold mb-8">داشبورد من</h1>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        <div className="card p-4">
          <p className="text-sm text-slate-500">آزمون‌های انجام‌شده</p>
          <p className="text-2xl font-bold mt-1">۱۲</p>
        </div>
        <div className="card p-4">
          <p className="text-sm text-slate-500">ساعت تماشای ویدیو</p>
          <p className="text-2xl font-bold mt-1">۴۸</p>
        </div>
        <div className="card p-4">
          <p className="text-sm text-slate-500">خریدها</p>
          <p className="text-2xl font-bold mt-1">۵</p>
        </div>
        <div className="card p-4">
          <p className="text-sm text-slate-500">سمینارهای ثبت‌نامی</p>
          <p className="text-2xl font-bold mt-1">۲</p>
        </div>
      </div>

      <h2 className="font-semibold text-lg mb-4">دسترسی سریع</h2>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Link href="/exams" className="card p-4 flex items-center gap-3 hover:shadow-md transition">
          <FileQuestion className="w-5 h-5 text-primary-600" />
          <span>آزمون‌های من</span>
        </Link>
        <Link href="/videos" className="card p-4 flex items-center gap-3 hover:shadow-md transition">
          <Video className="w-5 h-5 text-primary-600" />
          <span>ویدیوهای ذخیره‌شده</span>
        </Link>
        <Link href="/store" className="card p-4 flex items-center gap-3 hover:shadow-md transition">
          <ShoppingBag className="w-5 h-5 text-primary-600" />
          <span>سفارش‌های من</span>
        </Link>
        <Link href="/seminars" className="card p-4 flex items-center gap-3 hover:shadow-md transition">
          <Calendar className="w-5 h-5 text-primary-600" />
          <span>رویدادهای من</span>
        </Link>
      </div>
    </div>
  );
}
