import { Header } from '@/components/layout/header';
import { Database, CheckCircle, Award } from 'lucide-react';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { SignInButton } from '@/components/auth/sign-in-button';

export default async function HomePage() {
  const session = await auth();

  // ログイン済みならダッシュボードへリダイレクト
  if (session) {
    redirect('/dashboard');
  }

  return (
    <>
      <Header />
      <div className="flex-1 overflow-auto">
        <div className="max-w-5xl mx-auto py-12 px-6">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">SQL道場</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              実際のデータベースでSQLスキルを磨き、効率的なデータ操作を学べるプラットフォーム
            </p>
            <div className="mt-8">
              <SignInButton size="lg" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
            <Card className="flex flex-col items-center text-center">
              <CardContent className="flex flex-col items-center pt-6">
                <CheckCircle className="h-12 w-12 text-primary mb-4" />
                <h2 className="text-xl font-semibold mb-2">実践的な環境</h2>
                <p className="text-muted-foreground">実際のデータベースを使って、理論だけでなく実践的なSQLスキルを習得できます。</p>
              </CardContent>
            </Card>
            <Card className="flex flex-col items-center text-center">
              <CardContent className="flex flex-col items-center pt-6">
                <Database className="h-12 w-12 text-primary mb-4" />
                <h2 className="text-xl font-semibold mb-2">様々な難易度</h2>
                <p className="text-muted-foreground">基礎から高度なクエリまで、段階的に学べる多様な問題を用意しています。</p>
              </CardContent>
            </Card>
            <Card className="flex flex-col items-center text-center">
              <CardContent className="flex flex-col items-center pt-6">
                <Award className="h-12 w-12 text-primary mb-4" />
                <h2 className="text-xl font-semibold mb-2">即時フィードバック</h2>
                <p className="text-muted-foreground">クエリを実行するとすぐに結果が表示され、正解との比較で理解が深まります。</p>
              </CardContent>
            </Card>
          </div>

          <div className="mt-16 border-t pt-12">
            <h2 className="text-2xl font-bold text-center mb-8">あなたのSQLスキルを次のレベルへ</h2>
            <div className="flex justify-center">
              <SignInButton size="lg" variant="default" label="無料ではじめる" />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}