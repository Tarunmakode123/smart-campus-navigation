import { useEffect, useState } from "react";
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
  const [dataUrl, setDataUrl] = useState<string>("");
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    if (!value) return;
    setFailed(false);

    QRCode.toDataURL(value, {
      width: size,
      margin: 2,
      color: {
        dark: "#12203A",
        light: "#FFFFFF",
      },
      errorCorrectionLevel: "M",
    })
      .then((url) => setDataUrl(url))
      .catch(() => setFailed(true));
  }, [value, size]);

  if (failed) {
    return (
      <div
        className="grid place-items-center rounded-lg border border-dashed border-[#12203A]/20 bg-white p-4 text-center text-xs text-[#5B6472]"
        style={{ width: size, height: size }}
      >
        QR generation failed
      </div>
    );
  }

  if (!dataUrl) {
    return (
      <div
        className="grid place-items-center rounded-lg border border-dashed border-[#12203A]/20 bg-white p-4 text-center text-xs text-[#5B6472]"
        style={{ width: size, height: size }}
      >
        Generating QR...
      </div>
    );
  }

  return (
    <img
      src={dataUrl}
      width={size}
      height={size}
      alt={label ?? "QR code"}
      className="block rounded-lg bg-white shadow-sm"
    />
  );
}
