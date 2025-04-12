import { Problem } from "@/types";

export const problem: Problem = {
  id: "extreme_001",
  title: "アルバムの再生時間でフィルタリングする",
  description: `
albums テーブル、tracks テーブルを使用して、アルバム全体の再生時間（ミリ秒単位）が 60,000,000 ミリ秒を超えるアルバムを特定し、そのアルバムのID、アルバムタイトル、およびアルバム全体の再生時間をミリ秒単位で表示する SQL クエリを書いてください。
結果はアルバム全体の再生時間の降順で、アルバム全体の再生時間が同じ場合にはアルバムのIDの昇順に並べてください。
  `,
  difficulty: "extreme",
  tags: ["集計", "GROUP BY", "HAVING"],
  exampleAnswer: `
SELECT
  a.AlbumId,
  a.Title AS AlbumTitle,
  SUM(t.Milliseconds) AS TotalPlayTime
FROM
  albums a
  JOIN tracks t ON a.AlbumId = t.AlbumId
GROUP BY
  a.AlbumId,
  a.Title
HAVING
  SUM(t.Milliseconds) > 60000000
ORDER BY
  TotalPlayTime DESC,
  a.AlbumId ASC
;
  `,
};
