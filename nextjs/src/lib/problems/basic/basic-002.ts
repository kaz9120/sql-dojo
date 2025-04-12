import { Problem } from "@/types";

export const problem: Problem = {
  id: "basic_002",
  title: "特定のジャンルの曲を取得する",
  description: `
tracks テーブルから、ジャンル ID が 1 の全てのトラックの名前と作曲者を選択する SQL 文を書いてください。
結果はトラック名の昇順に並べてください。
  `,
  difficulty: "basic",
  tags: ["SELECT", "WHERE", "ORDER BY"],
  exampleAnswer: `
SELECT Name, Composer FROM tracks WHERE GenreId = 1
ORDER BY Name ASC
;
  `,
};
