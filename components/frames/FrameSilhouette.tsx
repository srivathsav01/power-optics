import { frameDepth, isMetal, lensOutline, nasalEdgeX, rimThickness, toSvgPath, upperArc } from "@/lib/frame-geometry";
import type { Frame, FrameColor } from "@/types/frame";

/**
 * Front-view SVG of a frame, generated from the same geometry as the 3D model.
 * Used for cards and as the 3D viewer's loading / no-WebGL fallback. Zero image bytes.
 */
export function FrameSilhouette({
  frame,
  color = frame.colors[0],
  className,
}: {
  frame: Frame;
  color?: FrameColor;
  className?: string;
}) {
  const m = frame.measurements;
  const metal = isMetal(frame.material);
  const rim = metal ? rimThickness(frame.material) * 2.2 : rimThickness(frame.material);
  const outline = lensOutline(frame.shape, m.lensWidth, m.lensHeight, 96);
  const lensPath = toSvgPath(outline);
  const rimPath = metal && frame.rim === "half" ? toSvgPath(upperArc(outline), false) : lensPath;
  const cx = m.bridge / 2 + m.lensWidth / 2;
  const halfW = cx + m.lensWidth / 2 + rim + 4;
  const halfH = m.lensHeight / 2 + rim + 6;
  const bridgeY = -(m.lensHeight * 0.18);
  const bridgeX = cx + nasalEdgeX(outline, -bridgeY);
  const lensFill = frame.lensTint ?? "#9fb7c4";
  const lensOpacity = frame.lensTint ? 0.85 : 0.14;
  // clear/crystal acetate would vanish on a light card, so outline it in a soft grey
  const stroke = color.pattern === "crystal" ? "#9aa5ad" : color.hex;
  const hingeY = -(m.lensHeight * 0.28);
  const endX = cx + m.lensWidth / 2 + rim / 2;

  const lens = (side: 1 | -1) => (
    <g transform={`translate(${side * cx} 0) scale(${side} 1)`}>
      <path d={lensPath} fill={lensFill} fillOpacity={lensOpacity} />
      <path
        d={rimPath}
        fill="none"
        stroke={stroke}
        strokeOpacity={color.pattern === "crystal" ? 0.7 : 1}
        strokeWidth={rim}
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    </g>
  );

  return (
    <svg
      viewBox={`${-halfW} ${-halfH} ${halfW * 2} ${halfH * 2}`}
      className={className}
      role="img"
      aria-label={`${frame.name} ${frame.shape} frame in ${color.name}`}
    >
      {lens(1)}
      {lens(-1)}
      <path
        d={`M${-bridgeX} ${bridgeY} Q0 ${bridgeY - 5} ${bridgeX} ${bridgeY}`}
        fill="none"
        stroke={stroke}
        strokeWidth={metal ? rim * 0.8 : rim * 0.9}
        strokeLinecap="round"
      />
      {frame.shape === "aviator" && (
        <path
          d={`M${-(cx - m.lensWidth * 0.3)} ${-m.lensHeight / 2 + 1} L${cx - m.lensWidth * 0.3} ${-m.lensHeight / 2 + 1}`}
          stroke={stroke}
          strokeWidth={rim * 0.7}
        />
      )}
      {[1, -1].map((side) => (
        <rect
          key={side}
          x={side === 1 ? endX - 1 : -endX - frameDepth(frame.material)}
          y={hingeY - 2.5}
          width={frameDepth(frame.material) + 1}
          height={5}
          rx={1.5}
          fill={stroke}
        />
      ))}
    </svg>
  );
}
