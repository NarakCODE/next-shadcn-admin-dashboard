import Link from "next/link";

import { ArrowLeft, ShieldCheck } from "lucide-react";

import { APP_CONFIG } from "@/config/app-config";

import { TwoStepsForm } from "../../_components/two-steps-form";

export default function TwoStepsV2() {
  return (
    <>
      <div className="mx-auto flex w-full flex-col justify-center space-y-8 sm:w-87.5">
        <div className="space-y-2 text-center">
          <div className="mb-4 flex items-center justify-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <ShieldCheck className="h-6 w-6 text-primary" />
            </div>
          </div>
          <h1 className="font-medium text-3xl">Two-step verification</h1>
          <p className="text-muted-foreground text-sm">Enter the verification code sent to your email</p>
        </div>
        <div className="space-y-4">
          <TwoStepsForm />
          <div className="space-y-6">
            <div className="text-center text-muted-foreground text-sm">
              Back to{" "}
              <Link prefetch={false} className="text-foreground" href="login">
                Sign in
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-5 flex w-full justify-between px-10">
        <div className="text-sm">{APP_CONFIG.copyright}</div>
        <div className="flex items-center gap-1 text-sm">
          <ArrowLeft className="size-4 text-muted-foreground" />
          <Link href="login" className="text-muted-foreground hover:text-foreground">
            Back to login
          </Link>
        </div>
      </div>
    </>
  );
}
