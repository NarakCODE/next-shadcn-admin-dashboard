"use client";

import { useState } from "react";

import { CheckCircle2, Loader2, Mail } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsLoading(false);
    setIsSubmitted(true);
  };

  if (isSubmitted) {
    return (
      <div className="flex flex-col items-center justify-center py-4">
        <CheckCircle2 className="mb-4 h-16 w-16 text-green-500" />
        <h3 className="mb-2 font-semibold text-lg">Check your email</h3>
        <p className="mb-4 text-center text-muted-foreground text-sm">
          We sent a password reset link to <span className="font-medium">{email}</span>
        </p>
        <Button variant="outline" className="w-full" onClick={() => setIsSubmitted(false)}>
          Resend email
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <Label htmlFor="email">Email Address</Label>
        <div className="relative">
          <Mail className="absolute top-2.5 left-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            id="email"
            type="email"
            placeholder="name@example.com"
            className="pl-9"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
      </div>
      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Sending...
          </>
        ) : (
          "Send reset link"
        )}
      </Button>
    </form>
  );
}
