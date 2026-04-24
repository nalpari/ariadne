"use client";

import { Component, type ErrorInfo, type ReactNode } from "react";
import * as Sentry from "@sentry/nextjs";
import { Button } from "@/components/ui/button";

type State = { error: Error | null };

export class ErrorBoundary extends Component<{ children: ReactNode }, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    Sentry.captureException(error, { extra: { componentStack: info.componentStack } });
  }

  render() {
    if (this.state.error) {
      return (
        <main className="flex min-h-screen items-center justify-center p-6">
          <div className="max-w-md rounded-md border border-border bg-surface p-6">
            <h1 className="text-lg font-semibold">화면을 렌더링하지 못했습니다</h1>
            <p className="mt-2 text-sm text-muted-foreground">{this.state.error.message}</p>
            <Button className="mt-4" onClick={() => window.location.reload()}>
              새로고침
            </Button>
          </div>
        </main>
      );
    }

    return this.props.children;
  }
}
