/**
 * The card, drawn in CSS: Tabby's mark, "Visa" as plain text, no network
 * logo. Illustrative art, not Tabby's card design (NOTES.md R4). Once
 * issued it shows a masked mock number and the persona's name.
 */

import TabbyMark from "@/components/ui/TabbyMark";

export default function CardVisual({ issued = false }: { issued?: boolean }) {
  return (
    <div className="app-card" dir="ltr">
      <div className="flex items-center justify-between">
        <TabbyMark size={32} />
        <span className="text-label font-semibold">Visa</span>
      </div>
      <div className="flex items-end justify-between">
        <span className="tnum text-lead font-semibold">{issued ? "•••• 4821" : "•••• ••••"}</span>
        {issued ? <span className="text-label font-medium">REEM</span> : null}
      </div>
    </div>
  );
}
