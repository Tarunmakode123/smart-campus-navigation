import { useEffect, useRef, useState } from "react";
import QRCode from "qrcode";

export function QrCodeCanvas({
  value,
  size = 256,
  label,
}: {
  value: string;
  size?: number;
  label?: string;
}) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    if (!canvasRef.current || !value) return;

    QRCode.toCanvas(canvasRef.current, value, {
      width: size,
      margin: 2,
      color: {
        dark: "#111827",
        light: "#ffffff",
      },
      errorCorrectionLevel: "M",
    }).catch(() => setFailed(true));
  }, [value, size]);

  if (failed) {
    return (
      <div
        className="grid place-items-center rounded-xl border border-dashed border-border bg-white p-4 text-center text-xs text-muted-foreground"
        style={{ width: size, height: size }}
      >
        QR could not render
      </div>
    );
  }

  return (
    <canvas
      ref={canvasRef}
      width={size}
      height={size}
      aria-label={label ?? "QR code"}
      className="block rounded-lg bg-white"
    />
  );
}
