import { DatabaseSchema } from "@/types";

// Chinookデータベースのスキーマ情報
export const databaseSchema: DatabaseSchema = {
  tables: [
    {
      name: "employees",
      description: "従業員情報を格納するテーブル",
      columns: [
        {
          name: "EmployeeId",
          type: "INTEGER",
          description: "従業員ID（主キー）",
          isPrimaryKey: true,
          isForeignKey: false,
        },
        {
          name: "LastName",
          type: "NVARCHAR(20)",
          description: "従業員の姓",
          isPrimaryKey: false,
          isForeignKey: false,
        },
        {
          name: "FirstName",
          type: "NVARCHAR(20)",
          description: "従業員の名",
          isPrimaryKey: false,
          isForeignKey: false,
        },
        {
          name: "Title",
          type: "NVARCHAR(30)",
          description: "従業員の役職",
          isPrimaryKey: false,
          isForeignKey: false,
        },
        {
          name: "ReportsTo",
          type: "INTEGER",
          description: "上司の従業員ID（外部キー）",
          isPrimaryKey: false,
          isForeignKey: true,
          references: {
            table: "employees",
            column: "EmployeeId",
          },
        },
        {
          name: "BirthDate",
          type: "DATETIME",
          description: "生年月日",
          isPrimaryKey: false,
          isForeignKey: false,
        },
        {
          name: "HireDate",
          type: "DATETIME",
          description: "採用日",
          isPrimaryKey: false,
          isForeignKey: false,
        },
        {
          name: "Address",
          type: "NVARCHAR(70)",
          description: "住所",
          isPrimaryKey: false,
          isForeignKey: false,
        },
      ],
    },
    {
      name: "customers",
      description: "顧客情報を格納するテーブル",
      columns: [
        {
          name: "CustomerId",
          type: "INTEGER",
          description: "顧客ID（主キー）",
          isPrimaryKey: true,
          isForeignKey: false,
        },
        {
          name: "FirstName",
          type: "NVARCHAR(40)",
          description: "顧客の名",
          isPrimaryKey: false,
          isForeignKey: false,
        },
        {
          name: "LastName",
          type: "NVARCHAR(20)",
          description: "顧客の姓",
          isPrimaryKey: false,
          isForeignKey: false,
        },
        {
          name: "Company",
          type: "NVARCHAR(80)",
          description: "会社名",
          isPrimaryKey: false,
          isForeignKey: false,
        },
        {
          name: "Email",
          type: "NVARCHAR(60)",
          description: "メールアドレス",
          isPrimaryKey: false,
          isForeignKey: false,
        },
        {
          name: "SupportRepId",
          type: "INTEGER",
          description: "担当の従業員ID（外部キー）",
          isPrimaryKey: false,
          isForeignKey: true,
          references: {
            table: "employees",
            column: "EmployeeId",
          },
        },
      ],
    },
    {
      name: "albums",
      description: "アルバム情報を格納するテーブル",
      columns: [
        {
          name: "AlbumId",
          type: "INTEGER",
          description: "アルバムID（主キー）",
          isPrimaryKey: true,
          isForeignKey: false,
        },
        {
          name: "Title",
          type: "NVARCHAR(160)",
          description: "アルバムタイトル",
          isPrimaryKey: false,
          isForeignKey: false,
        },
        {
          name: "ArtistId",
          type: "INTEGER",
          description: "アーティストID（外部キー）",
          isPrimaryKey: false,
          isForeignKey: true,
          references: {
            table: "artists",
            column: "ArtistId",
          },
        },
      ],
    },
    {
      name: "artists",
      description: "アーティスト情報を格納するテーブル",
      columns: [
        {
          name: "ArtistId",
          type: "INTEGER",
          description: "アーティストID（主キー）",
          isPrimaryKey: true,
          isForeignKey: false,
        },
        {
          name: "Name",
          type: "NVARCHAR(120)",
          description: "アーティスト名",
          isPrimaryKey: false,
          isForeignKey: false,
        },
      ],
    },
    {
      name: "tracks",
      description: "曲情報を格納するテーブル",
      columns: [
        {
          name: "TrackId",
          type: "INTEGER",
          description: "曲ID（主キー）",
          isPrimaryKey: true,
          isForeignKey: false,
        },
        {
          name: "Name",
          type: "NVARCHAR(200)",
          description: "曲名",
          isPrimaryKey: false,
          isForeignKey: false,
        },
        {
          name: "AlbumId",
          type: "INTEGER",
          description: "アルバムID（外部キー）",
          isPrimaryKey: false,
          isForeignKey: true,
          references: {
            table: "albums",
            column: "AlbumId",
          },
        },
        {
          name: "MediaTypeId",
          type: "INTEGER",
          description: "メディアタイプID（外部キー）",
          isPrimaryKey: false,
          isForeignKey: true,
          references: {
            table: "media_types",
            column: "MediaTypeId",
          },
        },
        {
          name: "GenreId",
          type: "INTEGER",
          description: "ジャンルID（外部キー）",
          isPrimaryKey: false,
          isForeignKey: true,
          references: {
            table: "genres",
            column: "GenreId",
          },
        },
        {
          name: "Composer",
          type: "NVARCHAR(220)",
          description: "作曲者",
          isPrimaryKey: false,
          isForeignKey: false,
        },
        {
          name: "Milliseconds",
          type: "INTEGER",
          description: "曲の長さ（ミリ秒）",
          isPrimaryKey: false,
          isForeignKey: false,
        },
        {
          name: "Bytes",
          type: "INTEGER",
          description: "ファイルサイズ（バイト）",
          isPrimaryKey: false,
          isForeignKey: false,
        },
        {
          name: "UnitPrice",
          type: "NUMERIC(10,2)",
          description: "単価",
          isPrimaryKey: false,
          isForeignKey: false,
        },
      ],
    },
    {
      name: "genres",
      description: "ジャンル情報を格納するテーブル",
      columns: [
        {
          name: "GenreId",
          type: "INTEGER",
          description: "ジャンルID（主キー）",
          isPrimaryKey: true,
          isForeignKey: false,
        },
        {
          name: "Name",
          type: "NVARCHAR(120)",
          description: "ジャンル名",
          isPrimaryKey: false,
          isForeignKey: false,
        },
      ],
    },
    {
      name: "invoices",
      description: "請求書情報を格納するテーブル",
      columns: [
        {
          name: "InvoiceId",
          type: "INTEGER",
          description: "請求書ID（主キー）",
          isPrimaryKey: true,
          isForeignKey: false,
        },
        {
          name: "CustomerId",
          type: "INTEGER",
          description: "顧客ID（外部キー）",
          isPrimaryKey: false,
          isForeignKey: true,
          references: {
            table: "customers",
            column: "CustomerId",
          },
        },
        {
          name: "InvoiceDate",
          type: "DATETIME",
          description: "請求日",
          isPrimaryKey: false,
          isForeignKey: false,
        },
        {
          name: "BillingAddress",
          type: "NVARCHAR(70)",
          description: "請求先住所",
          isPrimaryKey: false,
          isForeignKey: false,
        },
        {
          name: "Total",
          type: "NUMERIC(10,2)",
          description: "合計金額",
          isPrimaryKey: false,
          isForeignKey: false,
        },
      ],
    },
    {
      name: "invoice_items",
      description: "請求書明細を格納するテーブル",
      columns: [
        {
          name: "InvoiceLineId",
          type: "INTEGER",
          description: "請求書明細ID（主キー）",
          isPrimaryKey: true,
          isForeignKey: false,
        },
        {
          name: "InvoiceId",
          type: "INTEGER",
          description: "請求書ID（外部キー）",
          isPrimaryKey: false,
          isForeignKey: true,
          references: {
            table: "invoices",
            column: "InvoiceId",
          },
        },
        {
          name: "TrackId",
          type: "INTEGER",
          description: "曲ID（外部キー）",
          isPrimaryKey: false,
          isForeignKey: true,
          references: {
            table: "tracks",
            column: "TrackId",
          },
        },
        {
          name: "UnitPrice",
          type: "NUMERIC(10,2)",
          description: "単価",
          isPrimaryKey: false,
          isForeignKey: false,
        },
        {
          name: "Quantity",
          type: "INTEGER",
          description: "数量",
          isPrimaryKey: false,
          isForeignKey: false,
        },
      ],
    },
  ],
};

// テーブル名でテーブル情報を取得する関数
export function getTableInfo(tableName: string) {
  return databaseSchema.tables.find(
    (table) => table.name.toLowerCase() === tableName.toLowerCase()
  );
}

// すべてのテーブル名を取得する関数
export function getAllTableNames() {
  return databaseSchema.tables.map((table) => table.name);
}
