export type RouteCamera = {
  cameraId: string;
  label: string;
};

export type Route = {
  id: string;
  name: string;
  from: string;
  to: string;
  cameras: RouteCamera[];
};

export const routes: Route[] = [
  {
    id: "toa-payoh-sgh",
    name: "Toa Payoh → SGH",
    from: "Toa Payoh",
    to: "Singapore General Hospital",
    cameras: [
      { cameraId: "1001", label: "Toa Payoh Rise" },
      { cameraId: "1002", label: "Braddell Rd" },
      { cameraId: "1003", label: "Moulmein Rd" },
      { cameraId: "1004", label: "Cavenagh Rd" },
      { cameraId: "1005", label: "Outram Rd" },
    ],
  },
  {
    id: "amk-ttsh",
    name: "Ang Mo Kio → TTSH",
    from: "Ang Mo Kio",
    to: "Tan Tock Seng Hospital",
    cameras: [
      { cameraId: "2701", label: "Ang Mo Kio Ave 1" },
      { cameraId: "2702", label: "Ang Mo Kio Ave 8" },
      { cameraId: "4702", label: "Thomson Rd" },
      { cameraId: "4703", label: "Novena Rise" },
      { cameraId: "4704", label: "Moulmein / Balestier" },
    ],
  },
  {
    id: "bedok-changi",
    name: "Bedok → Changi Hospital",
    from: "Bedok",
    to: "Changi General Hospital",
    cameras: [
      { cameraId: "8701", label: "Bedok North Ave" },
      { cameraId: "8702", label: "New Upper Changi Rd" },
      { cameraId: "1501", label: "Tampines Ave 10" },
      { cameraId: "1502", label: "Tampines Ave 5" },
      { cameraId: "1503", label: "Changi Rd" },
    ],
  },
];
