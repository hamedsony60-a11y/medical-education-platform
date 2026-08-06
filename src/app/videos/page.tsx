import Link from 'next/link';
import { Play, Clock } from 'lucide-react';

const mockVideos = [
  {
    id: '1',
    title: 'آناتومی قلب — بخش اول',
    instructor: 'دکتر رضایی',
    duration: '42:15',
    views: 5400,
    category: 'آناتومی',
  },
  {
    id: '2',
    title: 'مبانی الکتروکاردیوگرافی',
    instructor: 'دکتر کریمی',
    duration: '58:30',
    views: 3200,
    category: 'کاردیولوژی',
  },
  {
    id: '3',
    title: 'تفسیر آزمایش‌های خون',
    instructor: 'دکتر محمدی',
    duration: '35:00',
    views: 7800,
    category: 'آزمایشگاه',
  },
];

export default function VideosPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold">ویدیوهای آموزشی</h1>
          <p className="text-slate-600 mt-1">محتوای ویدیویی تخصصی پزشکی</p>
        </div>
        <Link href="/videos/upload" className="btn-primary">
          آپلود ویدیو
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockVideos.map((v) => (
          <Link key={v.id} href={`/videos/${v.id}`} className="card group">
            <div className="aspect-video bg-slate-200 relative flex items-center justify-center">
              <div className="w-14 h-14 rounded-full bg-black/50 flex items-center justify-center group-hover:bg-primary-600 transition">
                <Play className="w-6 h-6 text-white fill-white" />
              </div>
              <span className="absolute bottom-2 left-2 bg-black/70 text-white text-xs px-2 py-0.5 rounded flex items-center gap-1">
                <Clock className="w-3 h-3" /> {v.duration}
              </span>
            </div>
            <div className="p-4">
              <span className="text-xs text-primary-600 font-medium">{v.category}</span>
              <h2 className="font-semibold mt-1 line-clamp-2">{v.title}</h2>
              <p className="text-sm text-slate-500 mt-1">{v.instructor}</p>
              <p className="text-xs text-slate-400 mt-2">{v.views.toLocaleString('fa-IR')} بازدید</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
