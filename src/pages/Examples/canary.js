import { Canary } from "../../components/Canary";

export function CanaryPage() {
  return (
    <div className="max-w-screen-2xl mx-auto flex justify-center">
      <Canary url="/api" />
    </div>
  );
}
