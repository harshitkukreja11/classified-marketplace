"use client";

export default function ContactActions({ listingId, phone, whatsapp }) {
  async function trackPhoneClick() {
    try {
      await fetch(`/api/analytics/${listingId}/phone`, {
        method: "POST",
      });
    } catch (error) {
      console.error("Phone tracking failed:", error);
    }
  }

  async function trackWhatsAppClick() {
    try {
      await fetch(`/api/analytics/${listingId}/whatsapp`, {
        method: "POST",
      });
    } catch (error) {
      console.error("WhatsApp tracking failed:", error);
    }
  }

  const whatsappUrl = whatsapp
    ? `https://wa.me/${whatsapp.replace(/\D/g, "")}`
    : null;

  return (
    <div className="flex flex-wrap gap-3 mt-4">
      <a
        href={`tel:${phone}`}
        onClick={trackPhoneClick}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        Call Seller
      </a>

      {whatsappUrl && (
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={trackWhatsAppClick}
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          WhatsApp
        </a>
      )}
    </div>
  );
}