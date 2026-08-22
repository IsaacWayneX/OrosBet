"use client";

import { Button } from "@/components/ui/Button";

export function YesNoButtons({ onYes, onNo }: { onYes?: () => void; onNo?: () => void }) {
  return (
    <div className="grid grid-cols-2 gap-3">
      <Button className="w-full" onClick={onYes}>Buy YES</Button>
      <Button className="w-full" variant="secondary" onClick={onNo}>Buy NO</Button>
    </div>
  );
}
