import { SqlError, SqlErrorType } from "@/types";
import { toast } from "sonner";

/**
 * SQLエラーを作成するヘルパー関数
 */
export function createSqlError(
  message: string,
  type: SqlErrorType = SqlErrorType.UNKNOWN_ERROR,
  details?: string
): SqlError {
  const error = new Error(message) as SqlError;
  error.type = type;
  error.details = details;
  return error;
}

/**
 * SQL構文エラーを作成する関数
 */
export function createSyntaxError(message: string, details?: string): SqlError {
  return createSqlError(message, SqlErrorType.SYNTAX_ERROR, details);
}

/**
 * SQL実行エラーを作成する関数
 */
export function createExecutionError(
  message: string,
  details?: string
): SqlError {
  return createSqlError(message, SqlErrorType.EXECUTION_ERROR, details);
}

/**
 * ネットワークエラーを作成する関数
 */
export function createNetworkError(
  message: string,
  details?: string
): SqlError {
  return createSqlError(message, SqlErrorType.NETWORK_ERROR, details);
}

/**
 * エラーをトーストで表示する関数
 */
export function showErrorToast(
  error: Error,
  title: string = "エラーが発生しました"
): void {
  toast.error(title, {
    description: error.message,
    duration: 5000,
  });
}

/**
 * エラー詳細をコンソールに記録する関数
 */
export function logError(
  error: Error,
  context: string = "エラー",
  additionalInfo: Record<string, any> = {}
): void {
  console.error(`[${context}]:`, error);

  if (Object.keys(additionalInfo).length > 0) {
    console.error("追加情報:", additionalInfo);
  }

  if (error.stack) {
    console.debug("エラースタック:", error.stack);
  }
}

/**
 * エラー処理を包括的に行う関数
 */
export function handleError(
  error: Error,
  context: string = "エラー",
  showToast: boolean = true,
  additionalInfo: Record<string, any> = {}
): void {
  logError(error, context, additionalInfo);

  if (showToast) {
    showErrorToast(error, `${context}エラー`);
  }
}
