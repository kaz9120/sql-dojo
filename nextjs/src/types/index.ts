export type ProblemDifficulty = "basic" | "advanced" | "extreme";

export type Problem = {
  id: string;
  title: string;
  description: string;
  difficulty: ProblemDifficulty;
  tags: string[];
  exampleAnswer: string;
  verificationQuery?: string;
};

export type SQLResult = {
  success: boolean;
  data?: any[];
  error?: string;
  columns?: string[];
  isCorrect?: boolean;
  expectedData?: any[];
};

// SQL実行関連のエラータイプ
export enum SqlErrorType {
  SYNTAX_ERROR = "syntax_error",
  EXECUTION_ERROR = "execution_error",
  NETWORK_ERROR = "network_error",
  AUTH_ERROR = "auth_error",
  UNKNOWN_ERROR = "unknown_error",
}

// SQLエラーの拡張型
export interface SqlError extends Error {
  type: SqlErrorType;
  details?: string;
}

// 問題の解答状況を表す型
export type ProblemStatus = {
  problemId: string;
  isCorrect: boolean;
  solvedAt: string;
};

// ユーザーの進捗状況を表す型
export type UserProgress = {
  [problemId: string]: ProblemStatus;
};

// 難易度ごとの進捗状況
export type DifficultyProgress = {
  total: number;
  solved: number;
  correct: number;
  percentage: number;
};

// 総合進捗状況
export type OverallProgress = {
  [key in ProblemDifficulty]?: DifficultyProgress;
} & {
  total: DifficultyProgress;
};

// テーブル情報型（ER図表示用）
export type TableInfo = {
  name: string;
  description: string;
  columns: ColumnInfo[];
};

export type ColumnInfo = {
  name: string;
  type: string;
  description: string;
  isPrimaryKey: boolean;
  isForeignKey: boolean;
  references?: {
    table: string;
    column: string;
  };
};

export type DatabaseSchema = {
  tables: TableInfo[];
};
