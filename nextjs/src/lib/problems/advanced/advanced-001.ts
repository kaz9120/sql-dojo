import { Problem } from "@/types";

export const problem: Problem = {
  id: "advanced_001",
  title: "アーティスト名とアルバムを取得する",
  description: `
albums テーブルと artists テーブルを JOIN し、アーティスト名とそれに対応するアルバムタイトルをリストする SQL 文を書いてください。
結果はアーティスト名の昇順で、アーティスト名が同じ場合にはアルバムタイトルの昇順に並べてください。
  `,
  difficulty: "advanced",
  tags: ["JOIN", "ORDER BY"],
  exampleAnswer: `
SELECT
  artists.Name,
  albums.Title
FROM
  albums
  JOIN artists ON albums.ArtistId = artists.ArtistId
ORDER BY
  1 ASC,
  2 ASC;
  `,
};
