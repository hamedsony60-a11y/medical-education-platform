import type { Metadata } from 'next';
import './globals.css';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

export const metadata: Metadata = {
  title: 'پلتفرم آموزش آکادمیک پزشکی',
  description: 'آزمون آنلاین، ویدیو و فایل صوتی آموزشی، فروشگاه کتاب، سمینارهای پزشکی',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fa" dir="rtl">
      <body className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
