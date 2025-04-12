'use client';

import { getAllProblems } from '@/lib/problems';
import Link from 'next/link';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useSession } from "next-auth/react";
import { useProblemStatus } from '@/hooks/useProblemStatus';
import { CheckCircle, XCircle, BarChart } from 'lucide-react';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { ProgressTools } from '@/components/profile/progress-tools';

export default function DashboardPage() {
  const { data: session } = useSession();
  const problems = getAllProblems();
  const { userProgress, loading, getSolvedCount, getCorrectCount } = useProblemStatus();

  const renderStatusIcon = (problemId: string) => {
    if (loading) return null;

    const status = userProgress[problemId];
    if (!status) {
      return <span className="text-muted-foreground text-sm">未回答</span>;
    }

    return status.isCorrect ? (
      <div className="flex items-center justify-center">
        <CheckCircle className="h-5 w-5 text-green-500" />
        <span className="sr-only">正解</span>
      </div>
    ) : (
      <div className="flex items-center justify-center">
        <XCircle className="h-5 w-5 text-red-500" />
        <span className="sr-only">不正解</span>
      </div>
    );
  };

  return (
    <DashboardLayout>
      <div className="flex-1 p-6 overflow-auto">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">SQL道場</h1>
          <p className="text-lg text-muted-foreground mb-8">
            ようこそ {session?.user?.name} さん！SQL問題に挑戦して、スキルを磨きましょう。
          </p>

          {/* 進捗状況サマリー */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">全問題数</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{problems.length}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">解答済み</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{getSolvedCount()}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">正解数</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{getCorrectCount()}</div>
              </CardContent>
            </Card>
          </div>

          <div className="mb-8">
            <ProgressTools />
          </div>

          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">問題一覧</h2>
            <Badge variant="outline" className="flex items-center gap-1">
              <BarChart className="h-3.5 w-3.5" />
              <span>進捗状況: {!loading ? Math.round((getSolvedCount() / problems.length) * 100) : 0}%</span>
            </Badge>
          </div>

          <div className="rounded-md border dark:border-slate-700">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">ID</TableHead>
                  <TableHead>タイトル</TableHead>
                  <TableHead className="w-[100px]">難易度</TableHead>
                  <TableHead className="w-[150px]">タグ</TableHead>
                  <TableHead className="w-[80px] text-center">状態</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {problems.map((problem) => (
                  <TableRow key={problem.id}>
                    <TableCell>{problem.id}</TableCell>
                    <TableCell>
                      <Link href={`/problem/${problem.id}`} className="hover:underline text-primary">
                        {problem.title}
                      </Link>
                    </TableCell>
                    <TableCell>
                      <Badge variant={
                        problem.difficulty === 'basic' ? 'secondary' :
                          problem.difficulty === 'advanced' ? 'default' : 'destructive'
                      }>
                        {problem.difficulty === 'basic' ? '基礎' :
                          problem.difficulty === 'advanced' ? '応用' : '高度'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {problem.tags.map((tag) => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      {renderStatusIcon(problem.id)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}