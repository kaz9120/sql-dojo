'use client';

import { Check, X } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { SQLResult } from '@/types';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';

interface ResultViewerProps {
  result?: SQLResult;
}

export function ResultViewer({ result }: ResultViewerProps) {
  if (!result) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-base">実行結果</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center py-4">
            SQLクエリを実行すると、ここに結果が表示されます
          </p>
        </CardContent>
      </Card>
    );
  }

  if (!result.success) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-base">実行結果</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="p-4 rounded-md border border-red-200 bg-red-50 dark:bg-red-950/20 dark:border-red-900 text-red-800 dark:text-red-300">
            <h3 className="font-medium mb-2">SQLエラー</h3>
            <p className="text-sm">{result.error}</p>
          </div>

          {/* エラー時にも期待される結果を表示（スクロール対応） */}
          {result.expectedData && result.expectedData.length > 0 && (
            <div className="mt-4">
              <h3 className="font-medium mb-2">期待される結果：</h3>
              <div className="rounded-md border dark:border-slate-700">
                <div className="max-h-96 overflow-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        {Object.keys(result.expectedData[0]).map((column) => (
                          <TableHead key={column}>
                            {column}
                          </TableHead>
                        ))}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {result.expectedData.map((row, rowIndex) => (
                        <TableRow key={rowIndex} className={rowIndex % 2 === 1 ? 'bg-muted/50' : ''}>
                          {Object.values(row).map((value, cellIndex) => (
                            <TableCell key={cellIndex}>
                              {String(value)}
                            </TableCell>
                          ))}
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">実行結果</CardTitle>
      </CardHeader>
      <CardContent>
        {result.data && result.data.length > 0 ? (
          <div className="rounded-md border dark:border-slate-700">
            <div className="max-h-96 overflow-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    {result.columns?.map((column) => (
                      <TableHead key={column}>
                        {column}
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {result.data.map((row, rowIndex) => (
                    <TableRow key={rowIndex} className={rowIndex % 2 === 1 ? 'bg-muted/50' : ''}>
                      {Object.values(row).map((value, cellIndex) => (
                        <TableCell key={cellIndex}>
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
          <p className="text-center py-4 text-muted-foreground">結果はありません</p>
        )}

        {/* 正解/不正解メッセージ */}
        {result.isCorrect !== undefined && (
          <div className={`mt-4 p-4 rounded-md border flex items-center gap-3 ${result.isCorrect
              ? 'border-green-200 bg-green-50 dark:bg-green-950/20 dark:border-green-900 text-green-800 dark:text-green-300'
              : 'border-red-200 bg-red-50 dark:bg-red-950/20 dark:border-red-900 text-red-800 dark:text-red-300'
            }`}>
            <div className={`p-1 rounded-full ${result.isCorrect ? 'bg-green-100 dark:bg-green-900' : 'bg-red-100 dark:bg-red-900'
              }`}>
              {result.isCorrect ? (
                <Check className="h-5 w-5 text-green-600 dark:text-green-400" />
              ) : (
                <X className="h-5 w-5 text-red-600 dark:text-red-400" />
              )}
            </div>
            <div>
              <p className="font-medium">
                {result.isCorrect ? '正解です！' : '間違えているようです'}
              </p>
              <p className="text-sm">
                {result.isCorrect
                  ? '期待される結果と一致しました'
                  : '期待される結果と一致しませんでした'}
              </p>
            </div>
          </div>
        )}

        {/* 不正解の場合、期待される結果も表示（スクロール対応） */}
        {result.isCorrect === false && result.expectedData && result.expectedData.length > 0 && (
          <div className="mt-4">
            <h3 className="font-medium mb-2">期待される結果：</h3>
            <div className="rounded-md border dark:border-slate-700">
              <div className="max-h-96 overflow-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      {Object.keys(result.expectedData[0]).map((column) => (
                        <TableHead key={column}>
                          {column}
                        </TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {result.expectedData.map((row, rowIndex) => (
                      <TableRow key={rowIndex} className={rowIndex % 2 === 1 ? 'bg-muted/50' : ''}>
                        {Object.values(row).map((value, cellIndex) => (
                          <TableCell key={cellIndex}>
                            {String(value)}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}