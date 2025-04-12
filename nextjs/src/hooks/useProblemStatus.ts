"use client";

import { useState, useEffect, useCallback } from "react";
import { UserProgress, ProblemStatus } from "@/types";
import { toast } from "sonner";
import { storage } from "@/lib/storage";

const STORAGE_KEY = "sql_dojo_user_progress";

export function useProblemStatus() {
  const [userProgress, setUserProgress] = useState<UserProgress>({});
  const [loading, setLoading] = useState(true);

  // ローカルストレージから解答状況を読み込む
  useEffect(() => {
    const loadProgress = () => {
      try {
        const savedProgress = storage.get<UserProgress>(STORAGE_KEY, {});
        setUserProgress(savedProgress || {});
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
        storage.set(STORAGE_KEY, updatedProgress);

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
    (difficulty: string, totalProblems: number) => {
      // difficultyに基づいて特定の難易度の問題を集計
      return {
        total: totalProblems,
        solved: 0, // この値は別途計算が必要
        correct: 0, // この値は別途計算が必要
      };
    },
    [userProgress]
  );

  // 進捗データをエクスポート
  const exportProgress = useCallback(() => {
    storage.exportToFile<UserProgress>(
      STORAGE_KEY,
      `sql_dojo_progress_${new Date().toISOString().slice(0, 10)}.json`
    );
  }, []);

  // 進捗データをインポート
  const importProgress = useCallback((jsonString: string) => {
    // 簡易的な検証関数
    const isValidUserProgress = (data: any): data is UserProgress => {
      return (
        typeof data === "object" &&
        Object.values(data).every(
          (item: any) =>
            typeof item === "object" &&
            "problemId" in item &&
            "isCorrect" in item
        )
      );
    };

    const importedData = storage.importFromJson<UserProgress>(
      jsonString,
      isValidUserProgress
    );

    if (!importedData) return;

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
      storage.set(STORAGE_KEY, mergedProgress);

      toast.success("進捗データをインポートしました");
      return mergedProgress;
    });
  }, []);

  // 進捗データをリセット
  const resetProgress = useCallback(() => {
    storage.remove(STORAGE_KEY);
    setUserProgress({});
    toast.success("進捗データをリセットしました");
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
