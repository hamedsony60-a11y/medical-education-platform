import Link from 'next/link';

export function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 mt-auto">
      <div className="max-w-6xl mx-auto px-4 py-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
          <div>
            <h4 className="text-white font-semibold mb-3">آموزش</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/exams" className="hover:text-white">آزمون‌ها</Link></li>
              <li><Link href="/videos" className="hover:text-white">ویدیوها</Link></li>
              <li><Link href="/audio" className="hover:text-white">فایل صوتی</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-3">فروشگاه</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/store/print" className="hover:text-white">کتاب چاپی</Link></li>
              <li><Link href="/store/ebook" className="hover:text-white">کتاب الکترونیک</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-3">رویدادها</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/seminars" className="hover:text-white">سمینارها</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-3">حساب کاربری</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/dashboard" className="hover:text-white">داشبورد</Link></li>
              <li><Link href="/login" className="hover:text-white">ورود</Link></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-slate-700 pt-6 text-sm text-center text-slate-500">
          © {new Date().getFullYear()} پلتفرم آموزش آکادمیک پزشکی
        </div>
      </div>
    </footer>
  );
}
