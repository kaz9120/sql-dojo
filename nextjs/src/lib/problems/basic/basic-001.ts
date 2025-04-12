import { Problem } from "@/types";

export const problem: Problem = {
  id: "basic_001",
  title: "従業員一覧を取得する",
  description: `
employees テーブルの情報を全て取得する SQL 文を書いてください。
結果は従業員の ID の昇順に並べてください。
  `,
  difficulty: "basic",
  tags: ["SELECT", "ORDER BY"],
  exampleAnswer: `
SELECT
  *
FROM
  employees
ORDER BY
  employees.employeeId ASC
;
  `,
};
