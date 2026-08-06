import Link from 'next/link';
import { Clock, Users, FileQuestion } from 'lucide-react';

const mockExams = [
  {
    id: '1',
    title: 'آزمون فیزیولوژی سیستم قلبی-عروقی',
    specialty: 'فیزیولوژی',
    questions: 40,
    duration: 60,
    participants: 1280,
  },
  {
    id: '2',
    title: 'آزمون پاتولوژی عمومی',
    specialty: 'پاتولوژی',
    questions: 50,
    duration: 75,
    participants: 890,
  },
  {
    id: '3',
    title: 'آزمون فارماکولوژی پایه',
    specialty: 'فارماکولوژی',
    questions: 35,
    duration: 50,
    participants: 2100,
  },
];

export default function ExamsPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold">آزمون‌های آنلاین</h1>
          <p className="text-slate-600 mt-1">آزمون‌های تخصصی پزشکی با نمره‌دهی خودکار</p>
        </div>
        <Link href="/exams/create" className="btn-primary inline-flex items-center gap-2">
          <FileQuestion className="w-4 h-4" />
          ساخت آزمون جدید
        </Link>
      </div>

      <div className="grid gap-4">
        {mockExams.map((exam) => (
          <div key={exam.id} className="card p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-medium text-primary-600 bg-primary-50 px-2 py-0.5 rounded">
                {exam.specialty}
              </span>
              <h2 className="font-semibold text-lg mt-2">{exam.title}</h2>
              <div className="flex flex-wrap gap-4 mt-2 text-sm text-slate-500">
                <span className="flex items-center gap-1">
                  <FileQuestion className="w-4 h-4" /> {exam.questions} سوال
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4" /> {exam.duration} دقیقه
                </span>
                <span className="flex items-center gap-1">
                  <Users className="w-4 h-4" /> {exam.participants.toLocaleString('fa-IR')} شرکت‌کننده
                </span>
              </div>
            </div>
            <Link href={`/exams/${exam.id}`} className="btn-primary whitespace-nowrap">
              شروع آزمون
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
