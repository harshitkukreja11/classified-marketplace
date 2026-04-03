"use client";

import { useEffect } from "react";

export default function TrackListingView({ listingId }) {
  useEffect(() => {
    fetch(`/api/analytics/${listingId}/view`, {
      method: "POST",
    }).catch((error) => {
      console.error("View tracking failed:", error);
    });
  }, [listingId]);

  return null;
}