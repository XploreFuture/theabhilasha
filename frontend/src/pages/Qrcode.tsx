import { useState, useRef } from "react";
import { QRCodeCanvas } from "qrcode.react";

export default function QRCodeGenerator() {
  const [url] = useState("https://theabhilasha.in");
  const qrRef = useRef<HTMLDivElement>(null);

  const downloadQRCode = () => {
    if (!qrRef.current) return;

    // Get the canvas element
    const canvas = qrRef.current.querySelector("canvas");
    if (!canvas) return;

    // Convert canvas to data URL
    const pngUrl = canvas.toDataURL("image/png");

    // Create a temporary link and trigger download
    const downloadLink = document.createElement("a");
    downloadLink.href = pngUrl;
    downloadLink.download = "qr_code.png";
    downloadLink.click();
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
     

      <div
        ref={qrRef}
        className="p-4 border rounded-lg bg-white flex items-center justify-center"
      >
        <QRCodeCanvas
          value={url}
          size={200}
          bgColor="#ffffff"
          fgColor="#000000"
          level="H"
          includeMargin={true}
        />
      </div>

      <button
        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        onClick={downloadQRCode}
      >
        Download QR Code
      </button>

      <p className="mt-4 text-center text-gray-700">
        Scan this QR code to visit: <br /> <span className="font-mono">{url}</span>
      </p>
    </div>
  );
}
