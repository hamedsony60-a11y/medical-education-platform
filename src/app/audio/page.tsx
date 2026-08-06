import Link from 'next/link';
import { Headphones, Clock } from 'lucide-react';

const mockAudio = [
  {
    id: '1',
    title: 'مروری بر سیستم ایمنی',
    instructor: 'دکتر نوری',
    duration: '28:40',
    category: 'ایمونولوژی',
  },
  {
    id: '2',
    title: 'اصول تجویز آنتی‌بیوتیک',
    instructor: 'دکتر حسینی',
    duration: '45:12',
    category: 'فارماکولوژی',
  },
];

export default function AudioPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold">فایل‌های صوتی آموزشی</h1>
          <p className="text-slate-600 mt-1">پادکست و فایل صوتی تخصصی</p>
        </div>
        <Link href="/audio/upload" className="btn-primary">
          آپلود فایل صوتی
        </Link>
      </div>

      <div className="grid gap-3">
        {mockAudio.map((a) => (
          <Link
            key={a.id}
            href={`/audio/${a.id}`}
            className="card p-4 flex items-center gap-4 hover:shadow-md transition"
          >
            <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
              <Headphones className="w-6 h-6" />
            </div>
            <div className="flex-1 min-w-0">
              <span className="text-xs text-primary-600">{a.category}</span>
              <h2 className="font-semibold truncate">{a.title}</h2>
              <p className="text-sm text-slate-500">{a.instructor}</p>
            </div>
            <span className="text-sm text-slate-400 flex items-center gap-1 shrink-0">
              <Clock className="w-4 h-4" /> {a.duration}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
