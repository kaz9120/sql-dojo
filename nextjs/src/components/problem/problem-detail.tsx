'use client';

import { useState, useEffect } from 'react';
import { Problem, SQLResult } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { SqlEditor } from '@/components/sql/sql-editor';
import { ResultViewer } from '@/components/sql/result-viewer';
import { Badge } from '@/components/ui/badge';
import { ErDiagram } from '@/components/problem/er-diagram';
import { useProblemStatus } from '@/hooks/useProblemStatus';
import { useSqlExecution } from '@/hooks/useSqlExecution';
import { BookOpen, Lightbulb, Award } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';

interface ProblemDetailProps {
  problem: Problem;
}

export function ProblemDetail({ problem }: ProblemDetailProps) {
  const [result, setResult] = useState<SQLResult | undefined>();
  const [expectedResult, setExpectedResult] = useState<any[] | null>(null);
  const { updateProblemStatus } = useProblemStatus();

  // SQL実行フックを使用
  const { getExpectedResult, isExecuting } = useSqlExecution();

  // 期待される結果をロード
  useEffect(() => {
    let isMounted = true;

    async function loadExpectedResult() {
      if (!problem.exampleAnswer) return;

      const data = await getExpectedResult(problem.exampleAnswer);
      if (isMounted) {
        setExpectedResult(data);
      }
    }

    loadExpectedResult();

    return () => {
      isMounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [problem.exampleAnswer]);

  const handleResult = (newResult: SQLResult) => {
    setResult(newResult);

    // 正誤判定があれば解答状況を更新
    if (newResult.isCorrect !== undefined) {
      updateProblemStatus(problem.id, newResult.isCorrect);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
      <div className="lg:col-span-2 space-y-6">
        <div>
          <h1 className="text-2xl font-bold mb-2">問題 {problem.id}: {problem.title}</h1>
          <div className="flex flex-wrap gap-2 mt-1">
            <Badge variant="secondary">
              {problem.difficulty === 'basic' ? '基礎レベル' :
                problem.difficulty === 'advanced' ? '応用レベル' : '高度レベル'}
            </Badge>
            {problem.tags.map((tag) => (
              <Badge key={tag} variant="outline">{tag}</Badge>
            ))}
          </div>
        </div>

        <Tabs defaultValue="description">
          <TabsList>
            <TabsTrigger value="description" className="flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              問題
            </TabsTrigger>
            <TabsTrigger value="hint" className="flex items-center gap-2">
              <Lightbulb className="h-4 w-4" />
              ヒント
            </TabsTrigger>
            <TabsTrigger value="expected" className="flex items-center gap-2">
              <Award className="h-4 w-4" />
              期待結果
            </TabsTrigger>
          </TabsList>

          <TabsContent value="description">
            <Card>
              <CardContent className="pt-6">
                <div className="prose dark:prose-invert max-w-none">
                  <pre className="whitespace-pre-wrap text-sm">{problem.description}</pre>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="hint">
            <Card>
              <CardContent className="pt-6">
                <p className="text-muted-foreground">
                  {problem.verificationQuery
                    ? '• このクエリはデータベースを更新します。どのようなテーブルが更新され、どのような結果になるか考えてみましょう。'
                    : '• このクエリはデータを取得します。必要なテーブルとカラム、結合条件を考えてみましょう。'}
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="expected">
            <Card>
              <CardContent className="pt-6">
                <p className="text-muted-foreground mb-4">
                  以下のようなデータが返ることを期待しています。
                </p>

                {isExecuting ? (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">読み込み中...</p>
                  </div>
                ) : expectedResult && expectedResult.length > 0 ? (
                  <div className="rounded-md border dark:border-slate-700">
                    <div className="max-h-96 overflow-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            {Object.keys(expectedResult[0]).map((key) => (
                              <TableHead key={key}>
                                {key}
                              </TableHead>
                            ))}
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {expectedResult.map((row, index) => (
                            <TableRow key={index} className={index % 2 === 1 ? 'bg-muted/50' : ''}>
                              {Object.values(row).map((value, i) => (
                                <TableCell key={i}>
                                  {String(value)}
                                </TableCell>
                              ))}
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </div>
                ) : (
                  <p className="text-center py-4 text-muted-foreground">
                    例はありません。自分で考えてみましょう！
                  </p>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <SqlEditor problem={problem} onResult={handleResult} />
        <ResultViewer result={result} />
      </div>

      <div className="h-full">
        <ErDiagram />
      </div>
    </div>
  );
}