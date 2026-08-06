'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Menu, X, User } from 'lucide-react';

const navItems = [
  { href: '/exams', label: 'آزمون‌ها' },
  { href: '/videos', label: 'ویدیوها' },
  { href: '/audio', label: 'صوت' },
  { href: '/store', label: 'فروشگاه' },
  { href: '/seminars', label: 'سمینارها' },
];

export function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="font-bold text-lg text-primary-700">
          مد‌ادو
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-slate-600 hover:text-primary-600 text-sm font-medium transition"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href="/dashboard"
            className="hidden sm:flex items-center gap-2 text-sm text-slate-600 hover:text-primary-600"
          >
            <User className="w-4 h-4" />
            داشبورد
          </Link>
          <button
            type="button"
            className="md:hidden p-2"
            onClick={() => setOpen(!open)}
            aria-label="منو"
          >
            {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {open && (
        <nav className="md:hidden border-t border-slate-100 bg-white px-4 py-3 flex flex-col gap-2">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="py-2 text-slate-700"
              onClick={() => setOpen(false)}
            >
              {item.label}
            </Link>
          ))}
          <Link href="/dashboard" className="py-2 text-slate-700" onClick={() => setOpen(false)}>
            داشبورد
          </Link>
        </nav>
      )}
    </header>
  );
}
