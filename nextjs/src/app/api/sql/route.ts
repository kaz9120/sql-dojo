import { NextRequest, NextResponse } from "next/server";
import { executeSqlQuery, verifySqlAnswer } from "@/lib/db/executor";
import { getProblemById } from "@/lib/problems";
import { auth } from "@/auth";

export async function POST(request: NextRequest) {
  try {
    // ユーザー情報を取得
    const session = await auth();

    const body = await request.json();
    const { query, problemId } = body;

    if (!query) {
      return NextResponse.json(
        { error: "SQLクエリが提供されていません。" },
        { status: 400 }
      );
    }

    // 問題IDが提供されている場合は検証モード
    if (problemId) {
      const problem = getProblemById(problemId);

      if (!problem) {
        return NextResponse.json(
          { error: "指定された問題が見つかりません。" },
          { status: 404 }
        );
      }

      const result = await verifySqlAnswer(
        query,
        problem.exampleAnswer,
        problem.verificationQuery
      );

      return NextResponse.json(result);
    }

    // 問題IDがない場合は通常モード
    const result = await executeSqlQuery(query);
    return NextResponse.json(result);
  } catch (error) {
    console.error("SQL実行エラー:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "内部サーバーエラー",
      },
      { status: 500 }
    );
  }
}
