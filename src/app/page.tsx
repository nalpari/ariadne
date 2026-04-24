import { Card } from "@/components/ui/card";

export default function Home() {
  return (
    <div className="grid gap-4">
      <section>
        <h1 className="text-2xl font-semibold">Ariadne</h1>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
          AI 기반 E2E 테스트 자동화의 기반 서비스가 준비되는 중입니다. Sprint 0은 인증, 큐, 워커, Realtime, Docker 실행 경로를 검증합니다.
        </p>
      </section>
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="p-4">
          <div className="text-sm font-medium">Auth</div>
          <p className="mt-2 text-sm text-muted-foreground">Anonymous session bootstrap</p>
        </Card>
        <Card className="p-4">
          <div className="text-sm font-medium">Queue</div>
          <p className="mt-2 text-sm text-muted-foreground">pg-boss worker pipeline</p>
        </Card>
        <Card className="p-4">
          <div className="text-sm font-medium">Realtime</div>
          <p className="mt-2 text-sm text-muted-foreground">Run event stream</p>
        </Card>
      </div>
    </div>
  );
}
