// src/lib/storage.ts
import { toast } from "sonner";

/**
 * ローカルストレージ操作のためのユーティリティ関数
 */
export const storage = {
  /**
   * 値をローカルストレージに保存
   */
  set: <T>(key: string, value: T): void => {
    try {
      const serialized = JSON.stringify(value);
      localStorage.setItem(key, serialized);
    } catch (error) {
      console.error(`保存エラー [${key}]:`, error);
    }
  },

  /**
   * ローカルストレージから値を取得
   */
  get: <T>(key: string, defaultValue: T | null = null): T | null => {
    try {
      const serialized = localStorage.getItem(key);
      if (serialized === null) return defaultValue;
      return JSON.parse(serialized) as T;
    } catch (error) {
      console.error(`取得エラー [${key}]:`, error);
      return defaultValue;
    }
  },

  /**
   * ローカルストレージから値を削除
   */
  remove: (key: string): void => {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error(`削除エラー [${key}]:`, error);
    }
  },

  /**
   * ファイルとしてエクスポート
   */
  exportToFile: <T>(key: string, filename: string): void => {
    try {
      const value = storage.get<T>(key);
      if (!value) {
        toast.error("エクスポートするデータがありません");
        return;
      }

      const data = JSON.stringify(value);
      const blob = new Blob([data], { type: "application/json" });
      const url = URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      a.click();

      URL.revokeObjectURL(url);
      toast.success("データをエクスポートしました");
    } catch (error) {
      console.error(`エクスポートエラー [${key}]:`, error);
      toast.error("データのエクスポートに失敗しました");
    }
  },

  /**
   * ファイルからインポート
   */
  importFromJson: <T>(
    jsonString: string,
    validator?: (data: any) => boolean
  ): T | null => {
    try {
      const data = JSON.parse(jsonString) as T;

      if (validator && !validator(data)) {
        throw new Error("無効なデータ形式です");
      }

      return data;
    } catch (error) {
      console.error("インポートエラー:", error);
      toast.error(
        "データのインポートに失敗しました: " +
          (error instanceof Error ? error.message : "不明なエラー")
      );
      return null;
    }
  },
};
