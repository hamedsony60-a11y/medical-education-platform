# پلتفرم آموزش آکادمیک پزشکی | Medical Academic Education Platform

پلتفرم تخصصی برای آموزش پزشکی شامل:

- **آزمون آنلاین** — ساخت، آپلود و برگزاری آزمون‌های تخصصی پزشکی
- **ویدیوهای آموزشی** — آپلود، پخش و مدیریت محتوای ویدیویی
- **فایل‌های صوتی آموزشی** — پادکست و فایل صوتی تخصصی
- **فروشگاه کتاب چاپی** — فروش کتاب‌های پزشکی فیزیکی
- **فروشگاه کتاب الکترونیکی** — دانلود و مطالعه eBook
- **سمینارهای پزشکی** — معرفی، ثبت‌نام و نمایش سمینارها و وبینارها

---

## 🌐 نسخه آنلاین (GitHub Pages)

بعد از فعال‌سازی Pages، سایت در این آدرس در دسترس است:

**https://hamedsony60-a11y.github.io/medical-education-platform/**

### فعال‌سازی یک‌بار (حتماً انجام بده):

1. برو به ریپو → **Settings** → **Pages**
2. در بخش **Source** گزینه **GitHub Actions** را انتخاب کن
3. صبر کن تا Workflow سبز شود (تب Actions)

هر بار که روی `main` پوش کنی، سایت خودکار آپدیت می‌شود.

---

## توسعه محلی

```bash
npm install
npm run dev
```

باز کردن: http://localhost:3000

برای بیلد استاتیک:

```bash
npm run build
```

خروجی در پوشه `out/` قرار می‌گیرد.

---

## ساختار پروژه

```
medical-education-platform/
├── .github/workflows/   # دیپلوی خودکار به GitHub Pages
├── public/
├── src/
│   ├── app/             # صفحات (App Router)
│   ├── components/
│   └── types/
└── docs/
```

## تکنولوژی

- Next.js 14 (Static Export)
- React + TypeScript
- Tailwind CSS
- GitHub Pages

## مجوز

MIT
