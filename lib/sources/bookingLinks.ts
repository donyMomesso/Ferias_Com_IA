export interface BookingLinks {
  booking: string;
  airbnb: string;
  googleFlights: string;
  skyscanner: string;
  tripadvisor: string;
  googleHotels: string;
  googleMaps: string;
}

const MONTHS_PT: Record<string, number> = {
  janeiro: 1, fevereiro: 2, março: 3, abril: 4, maio: 5, junho: 6,
  julho: 7, agosto: 8, setembro: 9, outubro: 10, novembro: 11, dezembro: 12
};

function parseTripDates(datas: string): { checkIn?: string; checkOut?: string } {
  // "10 a 17 de julho" | "10 a 17 de julho de 2026"
  const m = datas.match(/(\d{1,2})\s+a\s+(\d{1,2})\s+de\s+(\w+)(?:\s+de\s+(\d{4}))?/i);
  if (!m) return {};
  const [, d1, d2, mon, yr] = m;
  const month = MONTHS_PT[mon.toLowerCase()];
  if (!month) return {};
  const year = yr || new Date().getFullYear().toString();
  const mm = String(month).padStart(2, "0");
  return {
    checkIn: `${year}-${mm}-${d1.padStart(2, "0")}`,
    checkOut: `${year}-${mm}-${d2.padStart(2, "0")}`
  };
}

function parseAdults(pessoas: string): number {
  const m = pessoas.match(/(\d+)\s*(?:adulto|pessoa|viajante)/i);
  return m ? parseInt(m[1]) : 2;
}

export function generateBookingLinks(params: {
  destination: string;
  datas?: string;
  pessoas?: string;
}): BookingLinks {
  const { destination, datas = "", pessoas = "" } = params;
  const dest = encodeURIComponent(destination);
  const { checkIn, checkOut } = parseTripDates(datas);
  const adults = parseAdults(pessoas);

  const bookingParams = new URLSearchParams({ ss: destination, group_adults: String(adults) });
  if (checkIn) bookingParams.set("checkin", checkIn);
  if (checkOut) bookingParams.set("checkout", checkOut);

  const airbnbParams = new URLSearchParams({ adults: String(adults) });
  if (checkIn) airbnbParams.set("checkin", checkIn);
  if (checkOut) airbnbParams.set("checkout", checkOut);

  return {
    booking: `https://www.booking.com/searchresults.html?${bookingParams.toString()}`,
    airbnb: `https://www.airbnb.com.br/s/${destination.replace(/\s+/g, "-")}/homes?${airbnbParams.toString()}`,
    googleFlights: `https://www.google.com/travel/flights?q=${encodeURIComponent("voos para " + destination)}`,
    skyscanner: `https://www.skyscanner.com.br/flights-to/${dest.toLowerCase().replace(/%20/g, "-")}/voos-baratos-para-${dest.toLowerCase().replace(/%20/g, "-")}.html`,
    tripadvisor: `https://www.tripadvisor.com.br/Search?q=${dest}`,
    googleHotels: `https://www.google.com/travel/hotels?q=${encodeURIComponent("hotéis em " + destination)}`,
    googleMaps: `https://www.google.com/maps/search/${dest}+pontos+turisticos`
  };
}
