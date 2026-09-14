import { sizeCode } from "@/lib/format";
import type { Frame } from "@/types/frame";

export function FrameMeasurements({ frame }: { frame: Frame }) {
  const m = frame.measurements;
  const items = [
    ["Lens width", m.lensWidth],
    ["Bridge", m.bridge],
    ["Temple", m.templeLength],
    ["Lens height", m.lensHeight],
  ] as const;

  return (
    <div>
      <div className="flex items-baseline justify-between">
        <p className="text-xs font-medium tracking-[0.15em] text-muted uppercase">Frame size</p>
        <p className="font-mono text-sm" title="Lens width □ bridge – temple length, as printed inside the temple">
          {sizeCode(frame)}
        </p>
      </div>
      <dl className="mt-2 grid grid-cols-4 divide-x divide-line rounded-2xl border border-line bg-white/40">
        {items.map(([label, value]) => (
          <div key={label} className="px-1 py-3 text-center">
            <dt className="text-[11px] text-muted">{label}</dt>
            <dd className="font-medium">
              {value}
              <span className="text-xs text-muted"> mm</span>
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
