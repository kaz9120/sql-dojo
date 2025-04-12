import { Problem } from "@/types";

// 基礎レベルの問題をインポート
import { problem as basic001 } from "./basic/basic-001";
import { problem as basic002 } from "./basic/basic-002";
// 応用レベルの問題をインポート
import { problem as advanced001 } from "./advanced/advanced-001";
// 高度レベルの問題をインポート
import { problem as extreme001 } from "./extreme/extreme-001";

// 全問題リスト
export const problems: Problem[] = [
  basic001,
  basic002,
  advanced001,
  extreme001,
  // 他の問題も追加...
];

// IDによる問題の取得
export function getProblemById(id: string): Problem | undefined {
  return problems.find((problem) => problem.id === id);
}

// 難易度による問題のフィルタリング
export function getProblemsByDifficulty(
  difficulty: Problem["difficulty"]
): Problem[] {
  return problems.filter((problem) => problem.difficulty === difficulty);
}

// すべての問題を取得
export function getAllProblems(): Problem[] {
  return problems;
}
