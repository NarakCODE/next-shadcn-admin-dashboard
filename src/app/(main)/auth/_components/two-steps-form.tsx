"use client";

import { useEffect, useRef, useState } from "react";

import Link from "next/link";

import { CheckCircle2, Loader2, Mail } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function TwoStepsForm() {
  const [code, setCode] = useState<string[]>(["", "", "", "", "", ""]);
  const [isLoading, setIsLoading] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [countdown, setCountdown] = useState(30);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;

    const newCode = [...code];
    newCode[index] = value.slice(-1);
    setCode(newCode);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").slice(0, 6);
    if (!/^\d+$/.test(pastedData)) return;

    const newCode = [...code];
    for (let i = 0; i < pastedData.length; i++) {
      newCode[i] = pastedData[i];
    }
    setCode(newCode);

    const focusIndex = Math.min(pastedData.length, 5);
    inputRefs.current[focusIndex]?.focus();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const verificationCode = code.join("");
    if (verificationCode.length !== 6) return;

    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsLoading(false);
    setIsVerified(true);
  };

  const handleResend = () => {
    setCode(["", "", "", "", "", ""]);
    setCountdown(30);
    inputRefs.current[0]?.focus();
  };

  if (isVerified) {
    return (
      <div className="flex flex-col items-center justify-center py-4">
        <CheckCircle2 className="mb-4 h-16 w-16 text-green-500" />
        <h3 className="mb-2 font-semibold text-lg">Verification Successful</h3>
        <p className="mb-4 text-center text-muted-foreground text-sm">You have successfully verified your identity.</p>
        <Button className="w-full" asChild>
          <Link href="/dashboard/default">Go to Dashboard</Link>
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <div className="flex justify-center gap-2">
        {code.map((digit, index) => (
          <Input
            key={index}
            ref={(el) => {
              inputRefs.current[index] = el;
            }}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={digit}
            onChange={(e) => handleChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            onPaste={handlePaste}
            className="h-12 w-12 text-center font-semibold text-xl"
          />
        ))}
      </div>

      <Button type="submit" className="w-full" disabled={isLoading || code.join("").length !== 6}>
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Verifying...
          </>
        ) : (
          "Verify"
        )}
      </Button>

      <div className="text-center">
        {countdown > 0 ? (
          <p className="text-muted-foreground text-sm">
            Resend code in <span className="font-medium">{countdown}s</span>
          </p>
        ) : (
          <button
            type="button"
            onClick={handleResend}
            className="flex items-center justify-center gap-2 font-medium text-primary text-sm hover:underline"
          >
            <Mail className="h-4 w-4" />
            Resend code
          </button>
        )}
      </div>
    </form>
  );
}
