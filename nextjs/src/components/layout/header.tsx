"use client";

import Link from 'next/link';
import { Database } from 'lucide-react';
import { useSession, signIn, signOut } from "next-auth/react";
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ThemeToggle } from '@/components/theme-toggle';

export function Header() {
  const { data: session, status } = useSession();

  return (
    <header className="border-b bg-background">
      <div className="container flex h-16 items-center px-4 sm:px-6">
        <Link href={session ? "/dashboard" : "/"} className="flex items-center gap-2 font-bold text-xl">
          <Database className="h-6 w-6" />
          <span>SQL道場</span>
        </Link>
        <div className="ml-auto flex items-center gap-4">
          <ThemeToggle />

          {status === 'loading' ? (
            <div className="h-8 w-8 rounded-full bg-muted animate-pulse"></div>
          ) : session ? (
            <DropdownMenu>
              <DropdownMenuTrigger className="focus:outline-none">
                <Avatar>
                  {session.user?.image ? (
                    <AvatarImage
                      src={session.user.image}
                      alt={session.user.name || "ユーザー"}
                    />
                  ) : (
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      {session.user?.name?.charAt(0) || 'U'}
                    </AvatarFallback>
                  )}
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <div className="px-3 py-2 text-sm">
                  <div className="font-medium">{session.user?.name}</div>
                  <div className="text-xs text-muted-foreground truncate">
                    {session.user?.email}
                  </div>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => signOut()}>
                  ログアウト
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button onClick={() => signIn('google')} variant="outline" size="sm">
              Googleでサインイン
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}