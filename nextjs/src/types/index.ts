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
