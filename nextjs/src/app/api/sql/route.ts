import { NextRequest, NextResponse } from "next/server";
import { executeSqlQuery, verifySqlAnswer } from "@/lib/db/executor";
import { getProblemById } from "@/lib/problems";
import { auth } from "@/auth";
import { createExecutionError, createSyntaxError } from "@/lib/error-utils";

/**
 * SQLクエリの実行と検証を行うAPIエンドポイント
 */
export async function POST(request: NextRequest) {
  try {
    // ユーザー情報を取得（認証チェック）
    const session = await auth();
    if (!session) {
      return NextResponse.json(
        { success: false, error: "認証が必要です。" },
        { status: 401 }
      );
    }

    // リクエストボディの解析
    const body = await request.json();
    const { query, problemId } = body;

    // バリデーション
    if (!query) {
      return NextResponse.json(
        { success: false, error: "SQLクエリが提供されていません。" },
        { status: 400 }
      );
    }

    // 問題IDが提供されている場合は検証モード
    if (problemId) {
      return await handleProblemVerification(query, problemId);
    }

    // 問題IDがない場合は通常モード（単純実行）
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

/**
 * 問題に対する解答の検証を行う関数
 */
async function handleProblemVerification(query: string, problemId: string) {
  const problem = getProblemById(problemId);

  if (!problem) {
    return NextResponse.json(
      { success: false, error: "指定された問題が見つかりません。" },
      { status: 404 }
    );
  }

  try {
    const result = await verifySqlAnswer(
      query,
      problem.exampleAnswer,
      problem.verificationQuery
    );

    return NextResponse.json(result);
  } catch (error) {
    // エラーの詳細を返す
    let errorMessage = "SQL実行中にエラーが発生しました";
    let statusCode = 500;

    if (error instanceof Error) {
      errorMessage = error.message;

      // 構文エラーなどのメッセージを分析して適切なステータスコードを設定
      if (errorMessage.includes("syntax error")) {
        statusCode = 400;
      }
    }

    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: statusCode }
    );
  }
}
