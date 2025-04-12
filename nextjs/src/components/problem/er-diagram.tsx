"use client";

import { useState } from "react";
import { Search, Copy } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { databaseSchema } from "@/lib/db/schema";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

export function ErDiagram() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTable, setSelectedTable] = useState<string | null>(null);

  // テーブル一覧をフィルタリング
  const filteredTables = databaseSchema.tables.filter(
    (table) =>
      table.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      table.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // テーブル名をクリックボードにコピー
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`「${text}」をクリップボードにコピーしました`, {
      duration: 2000,
    });
  };

  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center justify-between">
          <span>データベース構造</span>
          {selectedTable && (
            <Button
              variant="ghost"
              size="sm"
              className="text-xs"
              onClick={() => setSelectedTable(null)}
            >
              一覧に戻る
            </Button>
          )}
        </CardTitle>
        <div className="relative mt-2">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="テーブルを検索..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8 h-9"
          />
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <Tabs defaultValue="tables" className="h-full">
          <TabsList className="mx-4 mb-2">
            <TabsTrigger value="tables">テーブル一覧</TabsTrigger>
            <TabsTrigger value="details">テーブル詳細</TabsTrigger>
          </TabsList>

          <TabsContent value="tables" className="p-4 pt-0">
            <div className="grid grid-cols-1 gap-2">
              {filteredTables.map((table) => (
                <div
                  key={table.name}
                  className="border rounded-md p-3 cursor-pointer hover:border-primary dark:border-slate-700"
                  onClick={() => setSelectedTable(table.name)}
                >
                  <div className="flex justify-between items-center">
                    <h3 className="font-medium text-sm font-mono">{table.name}</h3>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 px-2"
                      onClick={(e) => {
                        e.stopPropagation();
                        copyToClipboard(table.name);
                      }}
                    >
                      <Copy className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">{table.description}</p>
                  <div className="mt-2 flex flex-wrap gap-1">
                    <Badge variant="outline" className="text-xs">
                      {table.columns.length} カラム
                    </Badge>
                    {table.columns.some(col => col.isPrimaryKey) && (
                      <Badge variant="secondary" className="text-xs">
                        主キーあり
                      </Badge>
                    )}
                    {table.columns.some(col => col.isForeignKey) && (
                      <Badge variant="secondary" className="text-xs">
                        外部キーあり
                      </Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="details" className="p-4 pt-0">
            {selectedTable ? (
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-medium font-mono">{selectedTable}</h3>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-7"
                    onClick={() => copyToClipboard(selectedTable)}
                  >
                    テーブル名をコピー
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  {databaseSchema.tables.find(t => t.name === selectedTable)?.description}
                </p>
                <div className="rounded-md border dark:border-slate-700">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-1/4">カラム名</TableHead>
                        <TableHead className="w-1/5">データ型</TableHead>
                        <TableHead>説明</TableHead>
                        <TableHead className="w-16 text-right">アクション</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {databaseSchema.tables
                        .find(t => t.name === selectedTable)
                        ?.columns.map((column) => (
                          <TableRow key={column.name}>
                            <TableCell className="font-mono text-sm">
                              {column.name}
                              {column.isPrimaryKey && (
                                <Badge variant="default" className="ml-2 text-xs">PK</Badge>
                              )}
                              {column.isForeignKey && (
                                <Badge variant="secondary" className="ml-2 text-xs">FK</Badge>
                              )}
                            </TableCell>
                            <TableCell className="text-sm">{column.type}</TableCell>
                            <TableCell className="text-sm">{column.description}</TableCell>
                            <TableCell className="text-right">
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-7 w-7 p-0"
                                onClick={() => copyToClipboard(column.name)}
                              >
                                <Copy className="h-3.5 w-3.5" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                </div>

                {/* リレーション情報 */}
                {databaseSchema.tables
                  .find(t => t.name === selectedTable)
                  ?.columns.some(col => col.isForeignKey) && (
                    <div className="mt-4">
                      <h4 className="font-medium mb-2">リレーション</h4>
                      <div className="rounded-md border dark:border-slate-700">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>カラム名</TableHead>
                              <TableHead>参照先テーブル</TableHead>
                              <TableHead>参照先カラム</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {databaseSchema.tables
                              .find(t => t.name === selectedTable)
                              ?.columns
                              .filter(col => col.isForeignKey && col.references)
                              .map((column) => (
                                <TableRow key={column.name}>
                                  <TableCell className="font-mono text-sm">{column.name}</TableCell>
                                  <TableCell className="font-mono text-sm">{column.references?.table}</TableCell>
                                  <TableCell className="font-mono text-sm">{column.references?.column}</TableCell>
                                </TableRow>
                              ))}
                          </TableBody>
                        </Table>
                      </div>
                    </div>
                  )}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <p>左側のテーブル一覧からテーブルを選択してください</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}