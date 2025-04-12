"use client";

import { useState, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Code, Play } from 'lucide-react';
import { Problem, SQLResult } from '@/types';
import { useTheme } from 'next-themes';

interface SqlEditorProps {
  problem: Problem;
  onResult: (result: SQLResult) => void;
}

// ローカルストレージのキー名
const QUERY_STORAGE_KEY_PREFIX = 'sql_dojo_query_';

export function SqlEditor({ problem, onResult }: SqlEditorProps) {
  const [query, setQuery] = useState('');
  const [isExecuting, setIsExecuting] = useState(false);
  const { theme } = useTheme();

  const editorTheme = theme === 'dark' ? 'vs-dark' : 'light';

  // コンポーネントマウント時に保存されたクエリを読み込む
  useEffect(() => {
    const savedQuery = localStorage.getItem(`${QUERY_STORAGE_KEY_PREFIX}${problem.id}`);
    // savedQueryがnullでない場合のみsetQueryを呼び出す
    if (savedQuery !== null) {
      setQuery(savedQuery);
    }
  }, [problem.id]);

  // クエリが変更されたときに自動保存
  useEffect(() => {
    // 入力中は頻繁に保存されないよう、遅延を設ける
    const saveTimer = setTimeout(() => {
      // 空のクエリも保存する
      localStorage.setItem(`${QUERY_STORAGE_KEY_PREFIX}${problem.id}`, query);
    }, 1000); // 1秒後に保存

    return () => clearTimeout(saveTimer);
  }, [query, problem.id]);

  const handleExecute = async () => {
    if (!query.trim()) return;

    setIsExecuting(true);

    try {
      const response = await fetch('/api/sql', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query,
          problemId: problem.id,
        }),
      });

      const result = await response.json();
      onResult(result);

      // 実行時にも保存
      localStorage.setItem(`${QUERY_STORAGE_KEY_PREFIX}${problem.id}`, query);
    } catch (error) {
      console.error('SQL実行エラー:', error);
      onResult({
        success: false,
        error: '実行中にエラーが発生しました',
      });
    } finally {
      setIsExecuting(false);
    }
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