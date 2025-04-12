import Database from "better-sqlite3";
import { SQLResult } from "@/types";
import { v4 as uuidv4 } from "uuid";
import fs from "fs/promises";
import path from "path";

// データベースファイルのパス
const DB_TEMPLATE_PATH = path.join(process.cwd(), "data", "chinook.db");
const TMP_DIR_PATH = path.join(process.cwd(), "tmp");

// SQLite接続のためのヘルパークラス
class DbHelper {
  private readonly dbPath: string;
  private db: Database.Database | null = null;

  constructor(dbPath: string) {
    this.dbPath = dbPath;
  }

  // データベース接続を開く
  async open(): Promise<void> {
    try {
      // tmpディレクトリが存在することを確認
      await fs.mkdir(TMP_DIR_PATH, { recursive: true });

      // テンプレートデータベースをコピー
      await fs.copyFile(DB_TEMPLATE_PATH, this.dbPath);

      this.db = new Database(this.dbPath);
    } catch (error) {
      throw new Error(
        `DB接続エラー: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }

  // データベース接続を閉じる
  close(): void {
    if (this.db) {
      this.db.close();
      this.db = null;
    }
  }

  // 一時ファイルを削除
  async cleanup(): Promise<void> {
    try {
      if (this.db) {
        this.close();
      }
      await fs.unlink(this.dbPath);
    } catch (error) {
      console.error("一時ファイル削除エラー:", error);
    }
  }

  // SQLクエリを実行
  executeQuery<T = any>(query: string): T[] {
    if (!this.db) {
      throw new Error("データベース接続がありません");
    }

    const stmt = this.db.prepare(query);
    return stmt.all() as T[];
  }

  // SQLコマンドを実行（更新系）
  executeCommand(command: string): void {
    if (!this.db) {
      throw new Error("データベース接続がありません");
    }

    this.db.exec(command);
  }
}

// 一時的なDBインスタンスを生成
function createTempDb(): string {
  return path.join(TMP_DIR_PATH, `chinook_${uuidv4()}.db`);
}

// SQLクエリを実行する関数（単純なクエリ実行）
export async function executeSqlQuery(query: string): Promise<SQLResult> {
  const dbPath = createTempDb();
  const db = new DbHelper(dbPath);

  try {
    await db.open();
    const result = db.executeQuery(query);
    const columns = result.length > 0 ? Object.keys(result[0] as object) : [];

    return {
      success: true,
      data: result,
      columns,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : String(error),
    };
  } finally {
    await db.cleanup();
  }
}

// 解答を検証する関数
export async function verifySqlAnswer(
  userQuery: string,
  exampleAnswer: string,
  verificationQuery?: string
): Promise<SQLResult> {
  const exampleDbPath = createTempDb();
  const userDbPath = createTempDb();

  const exampleDb = new DbHelper(exampleDbPath);
  const userDb = new DbHelper(userDbPath);

  try {
    await Promise.all([exampleDb.open(), userDb.open()]);

    let expectedResult: any[];
    let actualResult: any[];
    let columns: string[];

    // 更新系クエリの場合（検証クエリあり）
    if (verificationQuery) {
      // 模範解答を実行
      exampleDb.executeCommand(exampleAnswer);
      // 検証クエリを実行して期待結果を取得
      expectedResult = exampleDb.executeQuery(verificationQuery);

      // ユーザークエリを実行
      try {
        userDb.executeCommand(userQuery);
        // 検証クエリを実行して実際の結果を取得
        actualResult = userDb.executeQuery(verificationQuery);
      } catch (userError) {
        return {
          success: false,
          error:
            userError instanceof Error ? userError.message : String(userError),
          expectedData: expectedResult,
        };
      }
    }
    // 検索系クエリの場合（検証クエリなし）
    else {
      // 模範解答を実行して期待結果を取得
      expectedResult = exampleDb.executeQuery(exampleAnswer);

      // ユーザークエリを実行して実際の結果を取得
      try {
        actualResult = userDb.executeQuery(userQuery);
      } catch (userError) {
        return {
          success: false,
          error:
            userError instanceof Error ? userError.message : String(userError),
          expectedData: expectedResult,
        };
      }
    }

    // カラム情報を取得
    columns = actualResult.length > 0 ? Object.keys(actualResult[0]) : [];

    // 結果を比較してチェック
    const isCorrect = compareResults(expectedResult, actualResult);

    return {
      success: true,
      data: actualResult,
      columns,
      isCorrect,
      expectedData: isCorrect ? undefined : expectedResult,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : String(error),
    };
  } finally {
    await Promise.all([exampleDb.cleanup(), userDb.cleanup()]);
  }
}

// 結果を比較する関数
function compareResults(expected: any[], actual: any[]): boolean {
  // 行数が異なる場合は不一致
  if (expected.length !== actual.length) {
    return false;
  }

  // カラム名が異なる場合は調整（順序や名前の違いを許容）
  if (expected.length > 0 && actual.length > 0) {
    const expectedCols = Object.keys(expected[0]);
    const actualCols = Object.keys(actual[0]);

    // カラム数が一致していない場合は、データの比較方法を工夫する
    if (expectedCols.length !== actualCols.length) {
      // 簡易的な比較：同じ位置の値が一致するかどうか
      return expected.every((expectedRow, rowIdx) => {
        const actualRow = actual[rowIdx];
        const expectedVals = Object.values(expectedRow);
        const actualVals = Object.values(actualRow);

        // 値の数が異なる場合は不一致
        if (expectedVals.length !== actualVals.length) {
          return false;
        }

        // 値を比較
        return expectedVals.every((val, i) => {
          return String(val) === String(actualVals[i]);
        });
      });
    }
  }

  // 値を文字列化して厳密に比較
  const normalizeValue = (val: any) =>
    val === null ? "NULL" : String(val).trim();

  const normalizedExpected = expected
    .map((row) => {
      return Object.values(row).map(normalizeValue);
    })
    .sort((a, b) => a.join(",").localeCompare(b.join(",")));

  const normalizedActual = actual
    .map((row) => {
      return Object.values(row).map(normalizeValue);
    })
    .sort((a, b) => a.join(",").localeCompare(b.join(",")));

  // 配列を比較
  return (
    JSON.stringify(normalizedExpected) === JSON.stringify(normalizedActual)
  );
}
