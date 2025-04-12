import { useState, useCallback } from "react";
import { SQLResult } from "@/types";
import { toast } from "sonner";

export interface UseSqlExecutionOptions {
  onSuccess?: (result: SQLResult) => void;
  onError?: (error: Error) => void;
  problemId?: string;
}

export function useSqlExecution(options: UseSqlExecutionOptions = {}) {
  const [isExecuting, setIsExecuting] = useState(false);
  const [result, setResult] = useState<SQLResult | undefined>();

  const executeSql = useCallback(
    async (query: string) => {
      if (!query.trim()) {
        toast.error("SQLクエリが空です");
        return;
      }

      setIsExecuting(true);

      try {
        const response = await fetch("/api/sql", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            query,
            problemId: options.problemId,
          }),
        });

        const data: SQLResult = await response.json();

        setResult(data);

        if (data.success) {
          options.onSuccess?.(data);
        } else {
          throw new Error(data.error || "不明なエラーが発生しました");
        }

        return data;
      } catch (error) {
        console.error("SQL実行エラー:", error);

        const errorMessage =
          error instanceof Error
            ? error.message
            : "実行中にエラーが発生しました";

        options.onError?.(
          error instanceof Error ? error : new Error(errorMessage)
        );

        toast.error(errorMessage);
      } finally {
        setIsExecuting(false);
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    },
    [options.problemId]
  );

  // 期待される結果を取得する関数
  const getExpectedResult = useCallback(
    async (exampleAnswer: string): Promise<any[] | null> => {
      if (!exampleAnswer) return null;

      setIsExecuting(true);

      try {
        const response = await fetch("/api/sql", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            query: exampleAnswer,
          }),
        });

        const data = await response.json();

        if (data.success && data.data) {
          return data.data;
        }

        return null;
      } catch (error) {
        console.error("期待結果の取得エラー:", error);
        return null;
      } finally {
        setIsExecuting(false);
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    },
    []
  );

  return {
    executeSql,
    getExpectedResult,
    isExecuting,
    result,
  };
}
