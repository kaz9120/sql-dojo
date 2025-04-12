import { getProblemById } from '@/lib/problems';
import { ProblemDetail } from '@/components/problem/problem-detail';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { notFound } from 'next/navigation';

export default async function Page({ params }: { params: { id: string } }) {
  const problem = getProblemById(params.id);

  if (!problem) {
    notFound();
  }

  return (
    <DashboardLayout currentProblemId={params.id}>
      <div className="p-6 overflow-auto">
        <ProblemDetail problem={problem} />
      </div>
    </DashboardLayout>
  );
}