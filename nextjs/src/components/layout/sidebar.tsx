'use client';

import Link from 'next/link';
import { Code, CheckCircle, XCircle, HomeIcon } from 'lucide-react';
import { getProblemsByDifficulty } from '@/lib/problems';
import { useProblemStatus } from '@/hooks/useProblemStatus';
import { Badge } from '@/components/ui/badge';
import { Problem } from '@/types';
import {
  Sidebar,
  SidebarContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from '@/components/ui/sidebar';

interface AppSidebarProps {
  currentProblemId?: string;
}

export function AppSidebar({ currentProblemId }: AppSidebarProps) {
  const basicProblems = getProblemsByDifficulty('basic');
  const advancedProblems = getProblemsByDifficulty('advanced');
  const extremeProblems = getProblemsByDifficulty('extreme');
  const { userProgress, loading } = useProblemStatus();

  const renderProblemList = (problems: Problem[], title: string, badgeLabel: string) => {
    const solvedCount = problems.filter(problem =>
      userProgress[problem.id] && userProgress[problem.id].isCorrect
    ).length;

    return (
      <div className="space-y-1">
        <SidebarGroupLabel className="flex justify-between items-center">
          <span>{title}</span>
          <Badge variant="outline" className="text-xs">
            {solvedCount}/{problems.length}
          </Badge>
        </SidebarGroupLabel>
        <SidebarMenu>
          {problems.map(problem => {
            const status = userProgress[problem.id];
            const icon = !loading && status ? (
              status.isCorrect ? (
                <CheckCircle className="h-4 w-4 text-green-500" />
              ) : (
                <XCircle className="h-4 w-4 text-red-500" />
              )
            ) : (
              <Code className="h-4 w-4" />
            );

            return (
              <SidebarMenuItem key={problem.id}>
                <Link href={`/problem/${problem.id}`} passHref>
                  <SidebarMenuButton
                    isActive={currentProblemId === problem.id}
                    tooltip={problem.title}
                  >
                    {icon}
                    <span>{problem.id}</span>
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </div>
    );
  };

  return (
    <Sidebar>
      <SidebarContent className="py-2">
        <SidebarMenu>
          <SidebarMenuItem>
            <Link href="/dashboard" passHref>
              <SidebarMenuButton isActive={!currentProblemId} tooltip="ダッシュボード">
                <HomeIcon className="h-4 w-4" />
                <span>ダッシュボード</span>
              </SidebarMenuButton>
            </Link>
          </SidebarMenuItem>
        </SidebarMenu>

        {renderProblemList(basicProblems, "基礎レベル", "Basic")}
        {renderProblemList(advancedProblems, "応用レベル", "Advanced")}
        {renderProblemList(extremeProblems, "高度レベル", "Extreme")}
      </SidebarContent>
    </Sidebar>
  );
}