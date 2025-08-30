import { useState } from "react";
import QrScanner from "react-qr-barcode-scanner";

export default function QrScannerPage() {
  const [ticketId, setTicketId] = useState<string | null>(null);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <h1 className="text-2xl font-bold mb-4">Scan Ticket QR</h1>

      <div className="w-80 h-80 border rounded-lg overflow-hidden">
        <QrScanner
          onUpdate={(_, result) => {
            if (result) {
              setTicketId(result.getText()); // ✅ works fine
            }
          }}
        />
      </div>

      {ticketId && (
        <p className="mt-4 text-lg text-green-600">
          🎟 Ticket ID: <span className="font-mono">{ticketId}</span>
        </p>
      )}
    </div>
  );
}
