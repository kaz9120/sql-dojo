"use client";

import { useState, useEffect, useCallback } from 'react';
import Editor from '@monaco-editor/react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Code, Play } from 'lucide-react';
import { Problem, SQLResult } from '@/types';
import { useTheme } from 'next-themes';
import { useSqlExecution } from '@/hooks/useSqlExecution';
import { storage } from '@/lib/storage';

interface SqlEditorProps {
  problem: Problem;
  onResult: (result: SQLResult) => void;
}

// ローカルストレージのキー名
const QUERY_STORAGE_KEY_PREFIX = 'sql_dojo_query_';

export function SqlEditor({ problem, onResult }: SqlEditorProps) {
  const [query, setQuery] = useState('');
  const { theme } = useTheme();
  const editorTheme = theme === 'dark' ? 'vs-dark' : 'light';

  // ストレージキーの取得
  const getStorageKey = useCallback((problemId: string) =>
    `${QUERY_STORAGE_KEY_PREFIX}${problemId}`, []);

  // SQLクエリ実行フックを使用
  const { executeSql, isExecuting } = useSqlExecution({
    problemId: problem.id,
    onSuccess: onResult,
    onError: (error) => {
      onResult({
        success: false,
        error: error.message || '実行中にエラーが発生しました',
      });
    }
  });

  // コンポーネントマウント時に保存されたクエリを読み込む
  useEffect(() => {
    const savedQuery = storage.get<string>(getStorageKey(problem.id), '');
    if (savedQuery) {
      setQuery(savedQuery);
    }
  }, [problem.id, getStorageKey]);

  // クエリが変更されたときに自動保存
  useEffect(() => {
    if (!query.trim()) return; // 空クエリは保存しない

    // 入力中は頻繁に保存されないよう、遅延を設ける
    const saveTimer = setTimeout(() => {
      storage.set(getStorageKey(problem.id), query);
    }, 1000); // 1秒後に保存

    return () => clearTimeout(saveTimer);
  }, [query, problem.id, getStorageKey]);

  const handleExecute = async () => {
    if (!query.trim()) return;

    // 実行と同時に保存
    storage.set(getStorageKey(problem.id), query);
    await executeSql(query);
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <Code className="h-5 w-5" />
          SQLを入力
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-60 border rounded-md overflow-hidden mb-4 dark:border-slate-700">
          <Editor
            height="100%"
            language="sql"
            value={query}
            onChange={(value) => setQuery(value || '')}
            theme={editorTheme}
            options={{
              minimap: { enabled: false },
              scrollBeyondLastLine: false,
              fontSize: 14,
              wordWrap: "on",
              tabSize: 2,
              automaticLayout: true,
              lineNumbers: "on",
              renderLineHighlight: "all",
              selectOnLineNumbers: true,
              quickSuggestions: true,
            }}
          />
        </div>
        <div className="flex justify-end">
          <Button
            onClick={handleExecute}
            disabled={isExecuting || !query.trim()}
            className="flex items-center gap-2"
          >
            <Play className="h-4 w-4" />
            {isExecuting ? '実行中...' : '実行する'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}