"use client";

import { useState, useEffect, useCallback } from "react";
import { UserProgress, ProblemStatus } from "@/types";
import { toast } from "sonner";

const STORAGE_KEY = "sql_dojo_user_progress";

export function useProblemStatus() {
  const [userProgress, setUserProgress] = useState<UserProgress>({});
  const [loading, setLoading] = useState(true);

  // ローカルストレージから解答状況を読み込む
  useEffect(() => {
    const loadProgress = () => {
      try {
        const savedProgress = localStorage.getItem(STORAGE_KEY);
        if (savedProgress) {
          const parsed = JSON.parse(savedProgress);
          setUserProgress(parsed);
        }
      } catch (error) {
        console.error("進捗データの読み込みエラー:", error);
        toast.error("進捗データの読み込みに失敗しました");
      } finally {
        setLoading(false);
      }
    };

    loadProgress();

    // ストレージイベントリスナーを追加（他のタブでの変更を検知）
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === STORAGE_KEY && event.newValue) {
        try {
          const newProgress = JSON.parse(event.newValue);
          setUserProgress(newProgress);
        } catch (error) {
          console.error("ストレージ変更イベント処理エラー:", error);
        }
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  // 解答状況を更新する関数
  const updateProblemStatus = useCallback(
    (problemId: string, isCorrect: boolean) => {
      setUserProgress((prevProgress) => {
        // 既存の状態を確認
        const existingStatus = prevProgress[problemId];

        // 既に正解している場合は更新しない（一度正解したら常に正解）
        if (existingStatus && existingStatus.isCorrect && !isCorrect) {
          return prevProgress;
        }

        const updatedProgress = {
          ...prevProgress,
          [problemId]: {
            problemId,
            isCorrect,
            solvedAt: new Date().toISOString(),
          },
        };

        // ローカルストレージに保存
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedProgress));
        } catch (error) {
          console.error("進捗データの保存エラー:", error);
          toast.error("進捗データの保存に失敗しました");
        }

        return updatedProgress;
      });
    },
    []
  );

  // 解いた問題の数を取得
  const getSolvedCount = useCallback(() => {
    return Object.values(userProgress).length;
  }, [userProgress]);

  // 正解した問題の数を取得
  const getCorrectCount = useCallback(() => {
    return Object.values(userProgress).filter((status) => status.isCorrect)
      .length;
  }, [userProgress]);

  // 難易度別の進捗状況を取得
  const getProgressByDifficulty = useCallback(
    (difficulty: string) => {
      // difficultyは 'basic' | 'advanced' | 'extreme' が想定される
      // 別途問題一覧を取得してフィルタリングする必要がある
      // ここでは簡易的に全問題数を使用
      return {
        total: 0, // ここは後で実際の問題数に置き換え
        solved: 0,
        correct: 0,
      };
    },
    [userProgress]
  );

  // 進捗データをエクスポート
  const exportProgress = useCallback(() => {
    try {
      const progressData = JSON.stringify(userProgress);
      const blob = new Blob([progressData], { type: "application/json" });
      const url = URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = `sql_dojo_progress_${new Date()
        .toISOString()
        .slice(0, 10)}.json`;
      a.click();

      URL.revokeObjectURL(url);

      toast.success("進捗データをエクスポートしました");
    } catch (error) {
      console.error("進捗データのエクスポートエラー:", error);
      toast.error("進捗データのエクスポートに失敗しました");
    }
  }, [userProgress]);

  // 進捗データをインポート
  const importProgress = useCallback((jsonString: string) => {
    try {
      const importedData = JSON.parse(jsonString) as UserProgress;

      // データの検証（簡易的な検証）
      const isValid = Object.values(importedData).every(
        (item) =>
          typeof item === "object" && "problemId" in item && "isCorrect" in item
      );

      if (!isValid) {
        throw new Error("無効なデータ形式です");
      }

      // 現在の進捗とマージ（既存の正解は保持）
      setUserProgress((prevProgress) => {
        const mergedProgress = { ...prevProgress };

        // インポートデータを反映（既存の正解は上書きしない）
        for (const [id, status] of Object.entries(importedData)) {
          if (!mergedProgress[id] || !mergedProgress[id].isCorrect) {
            mergedProgress[id] = status;
          }
        }

        // ローカルストレージに保存
        localStorage.setItem(STORAGE_KEY, JSON.stringify(mergedProgress));

        return mergedProgress;
      });

      toast.success("進捗データをインポートしました");
    } catch (error) {
      console.error("進捗データのインポートエラー:", error);
      toast.error(
        "進捗データのインポートに失敗しました: " +
          (error instanceof Error ? error.message : "不明なエラー")
      );
    }
  }, []);

  // 進捗データをリセット
  const resetProgress = useCallback(() => {
    try {
      localStorage.removeItem(STORAGE_KEY);
      setUserProgress({});
      toast.success("進捗データをリセットしました");
    } catch (error) {
      console.error("進捗データのリセットエラー:", error);
      toast.error("進捗データのリセットに失敗しました");
    }
  }, []);

  return {
    userProgress,
    loading,
    updateProblemStatus,
    getSolvedCount,
    getCorrectCount,
    getProgressByDifficulty,
    exportProgress,
    importProgress,
    resetProgress,
  };
}
