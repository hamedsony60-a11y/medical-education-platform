import Link from 'next/link';
import { BookOpen, Book } from 'lucide-react';

export default function StorePage() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold mb-2">فروشگاه کتاب</h1>
      <p className="text-slate-600 mb-10">کتاب‌های چاپی و الکترونیکی پزشکی</p>

      <div className="grid sm:grid-cols-2 gap-6">
        <Link href="/store/print" className="card p-8 hover:shadow-md transition group">
          <div className="w-14 h-14 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-4">
            <Book className="w-7 h-7" />
          </div>
          <h2 className="text-xl font-semibold group-hover:text-primary-600 transition">کتاب چاپی</h2>
          <p className="text-slate-600 mt-2 text-sm">سفارش و ارسال کتاب‌های فیزیکی پزشکی</p>
        </Link>

        <Link href="/store/ebook" className="card p-8 hover:shadow-md transition group">
          <div className="w-14 h-14 rounded-xl bg-violet-100 text-violet-700 flex items-center justify-center mb-4">
            <BookOpen className="w-7 h-7" />
          </div>
          <h2 className="text-xl font-semibold group-hover:text-primary-600 transition">کتاب الکترونیکی</h2>
          <p className="text-slate-600 mt-2 text-sm">خرید و دانلود فوری eBook</p>
        </Link>
      </div>
    </div>
  );
}
