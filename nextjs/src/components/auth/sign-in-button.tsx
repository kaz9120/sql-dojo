"use client";

import { Button } from '@/components/ui/button';
import { signIn } from "next-auth/react";
import { VariantProps } from "class-variance-authority";
import { buttonVariants } from "@/components/ui/button";

interface SignInButtonProps extends VariantProps<typeof buttonVariants> {
  label?: string;
}

export function SignInButton({
  size,
  variant = "default",
  label = "Googleでサインイン"
}: SignInButtonProps) {
  return (
    <Button
      onClick={() => signIn('google')}
      size={size}
      variant={variant}
    >
      {label}
    </Button>
  );
}