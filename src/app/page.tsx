import Link from 'next/link';
import { BookOpen, Video, Headphones, FileQuestion, Calendar, ShoppingBag } from 'lucide-react';

const features = [
  {
    title: 'آزمون آنلاین',
    description: 'برگزاری آزمون‌های تخصصی پزشکی با نمره‌دهی خودکار و گزارش عملکرد',
    href: '/exams',
    icon: FileQuestion,
    color: 'bg-blue-100 text-blue-700',
  },
  {
    title: 'ویدیوهای آموزشی',
    description: 'محتوای ویدیویی تخصصی با زیرنویس و پیگیری پیشرفت',
    href: '/videos',
    icon: Video,
    color: 'bg-violet-100 text-violet-700',
  },
  {
    title: 'فایل صوتی',
    description: 'پادکست و فایل‌های صوتی آموزشی پزشکی',
    href: '/audio',
    icon: Headphones,
    color: 'bg-amber-100 text-amber-700',
  },
  {
    title: 'فروشگاه کتاب',
    description: 'کتاب چاپی و الکترونیکی پزشکی',
    href: '/store',
    icon: ShoppingBag,
    color: 'bg-emerald-100 text-emerald-700',
  },
  {
    title: 'سمینارهای پزشکی',
    description: 'معرفی و ثبت‌نام در سمینارها و وبینارهای تخصصی',
    href: '/seminars',
    icon: Calendar,
    color: 'bg-rose-100 text-rose-700',
  },
  {
    title: 'کتابخانه',
    description: 'دسترسی به منابع و مطالب آکادمیک',
    href: '/library',
    icon: BookOpen,
    color: 'bg-cyan-100 text-cyan-700',
  },
];

export default function HomePage() {
  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-bl from-primary-700 via-primary-600 to-teal-600 text-white">
        <div className="max-w-6xl mx-auto px-4 py-16 md:py-24">
          <h1 className="text-3xl md:text-5xl font-bold mb-4 leading-tight">
            پلتفرم تخصصی آموزش آکادمیک پزشکی
          </h1>
          <p className="text-lg md:text-xl text-primary-100 max-w-2xl mb-8">
            آزمون آنلاین، ویدیو و صوت آموزشی، فروشگاه کتاب و سمینارهای پزشکی — همه در یک جا
          </p>
          <div className="flex flex-wrap gap-3">
            <Link href="/exams" className="bg-white text-primary-700 px-6 py-3 rounded-lg font-semibold hover:bg-primary-50 transition">
              شروع آزمون
            </Link>
            <Link href="/videos" className="border border-white/40 text-white px-6 py-3 rounded-lg font-semibold hover:bg-white/10 transition">
              مشاهده ویدیوها
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-6xl mx-auto px-4 py-12 md:py-16">
        <h2 className="text-2xl font-bold text-center mb-10">بخش‌های پلتفرم</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f) => (
            <Link
              key={f.href}
              href={f.href}
              className="card p-6 hover:shadow-md transition group"
            >
              <div className={`w-12 h-12 rounded-xl ${f.color} flex items-center justify-center mb-4`}>
                <f.icon className="w-6 h-6" />
              </div>
              <h3 className="font-semibold text-lg mb-2 group-hover:text-primary-600 transition">
                {f.title}
              </h3>
              <p className="text-slate-600 text-sm leading-relaxed">{f.description}</p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
