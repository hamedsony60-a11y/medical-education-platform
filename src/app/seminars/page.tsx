import Link from 'next/link';
import { Calendar, MapPin, Users } from 'lucide-react';

const mockSeminars = [
  {
    id: '1',
    title: 'سمینار تازه‌های کاردیولوژی ۱۴۰۵',
    date: '۱۵ شهریور ۱۴۰۵',
    location: 'تهران — سالن همایش‌های رازی',
    capacity: 200,
    registered: 145,
  },
  {
    id: '2',
    title: 'وبینار مدیریت دیابت نوع ۲',
    date: '۲۲ شهریور ۱۴۰۵',
    location: 'آنلاین',
    capacity: 500,
    registered: 312,
  },
];

export default function SeminarsPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold mb-2">سمینارهای پزشکی</h1>
      <p className="text-slate-600 mb-8">معرفی و ثبت‌نام در سمینارها و وبینارها</p>

      <div className="grid gap-4">
        {mockSeminars.map((s) => (
          <div key={s.id} className="card p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="font-semibold text-lg">{s.title}</h2>
              <div className="flex flex-wrap gap-4 mt-2 text-sm text-slate-500">
                <span className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" /> {s.date}
                </span>
                <span className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" /> {s.location}
                </span>
                <span className="flex items-center gap-1">
                  <Users className="w-4 h-4" /> {s.registered}/{s.capacity} ثبت‌نام
                </span>
              </div>
            </div>
            <Link href={`/seminars/${s.id}`} className="btn-primary whitespace-nowrap">
              جزئیات و ثبت‌نام
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
