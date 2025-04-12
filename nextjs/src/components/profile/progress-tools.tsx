"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Download, Upload, RotateCcw } from "lucide-react";
import { useProblemStatus } from "@/hooks/useProblemStatus";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { toast } from "sonner";

export function ProgressTools() {
  const { exportProgress, importProgress, resetProgress } = useProblemStatus();
  const [isResetDialogOpen, setIsResetDialogOpen] = useState(false);
  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImportClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        importProgress(content);
        setIsImportDialogOpen(false);

        // ファイル入力をリセット
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      } catch (error) {
        toast.error("ファイルの読み込みに失敗しました");
      }
    };
    reader.readAsText(file);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">進捗管理ツール</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <Button
          variant="outline"
          className="flex items-center gap-2"
          onClick={exportProgress}
        >
          <Download className="h-4 w-4" />
          <span>進捗をエクスポート</span>
        </Button>

        {/* インポートダイアログ */}
        <Dialog open={isImportDialogOpen} onOpenChange={setIsImportDialogOpen}>
          <DialogTrigger asChild>
            <Button
              variant="outline"
              className="flex items-center gap-2"
            >
              <Upload className="h-4 w-4" />
              <span>進捗をインポート</span>
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>進捗データのインポート</DialogTitle>
              <DialogDescription>
                以前にエクスポートした進捗データをインポートします。
                既存のデータとマージされますが、現在の正解状態が優先されます。
              </DialogDescription>
            </DialogHeader>
            <div className="flex flex-col items-center justify-center py-4">
              <input
                type="file"
                ref={fileInputRef}
                accept=".json"
                onChange={handleFileChange}
                className="hidden"
              />
              <Button onClick={handleImportClick}>
                JSONファイルを選択
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* リセットダイアログ */}
        <Dialog open={isResetDialogOpen} onOpenChange={setIsResetDialogOpen}>
          <DialogTrigger asChild>
            <Button
              variant="outline"
              className="flex items-center gap-2 text-destructive hover:text-destructive"
            >
              <RotateCcw className="h-4 w-4" />
              <span>進捗をリセット</span>
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>進捗データのリセット</DialogTitle>
              <DialogDescription>
                すべての進捗データがリセットされます。この操作は元に戻せません。
                続行してもよろしいですか？
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="flex justify-between sm:justify-between mt-4">
              <Button
                variant="outline"
                onClick={() => setIsResetDialogOpen(false)}
              >
                キャンセル
              </Button>
              <Button
                variant="destructive"
                onClick={() => {
                  resetProgress();
                  setIsResetDialogOpen(false);
                }}
              >
                リセットする
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}