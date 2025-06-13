  export const bulkDeliveryMethods = [
    { delivery_method: "020", delivery_method_name: "Bulk 3 dagar" },
    { delivery_method: "021", delivery_method_name: "Bulk Fast Dag" },

    { delivery_method: "023", delivery_method_name: "Bulk 2 dagar" },
  ];

  export const packageDeliveryMethods = [
    {
      delivery_method: "010",
      delivery_method_name: "Flak Normal, Lantmännen lossar",
    },
    {
      delivery_method: "011",
      delivery_method_name: "Flak Normal, Kund lossar",
    },
    {
      delivery_method: "012",
      delivery_method_name: "Flak Express, Kund lossar, Område A",
    },
    {
      delivery_method: "013",
      delivery_method_name: "Flak Express Lantmännen lossar Omr A",
    },
    { delivery_method: "040", delivery_method_name: "Egen transport" },
  ];

 export const bulkAddress = [
  { address: "Dybäcksgatan 5, 216 20 Malmö", siloId: 1, addressId: '101' },
  { address: "Dybäcksgatan 5, 216 20 Malmö", siloId: 2, addressId: '101' },
  { address: "Dybäcksgatan 5, 216 20 Malmö", siloId: 3, addressId: '101' },
  { address: "Dybäcksgatan 5, 216 20 Malmö", siloId: 4, addressId: '101' },
  {
    address: "Birger Jarlsgatan 26, 216 12 Limhamn",
    siloId: 4,
    addressId: '202',
  },
  {
    address: "Birger Jarlsgatan 26, 216 12 Limhamn",
    siloId: 5,
    addressId: '202',
  },
  { address: "Lovisas Gata 5, 218 51 Klagshamn", siloId: 7, addressId: '303' },
  { address: "Lovisas Gata 5, 218 51 Klagshamn", siloId: 8, addressId: '303' },
  { address: "Paddelgränd 8, 216 11 Limhamn", siloId: 10, addressId: '404' },
  { address: "Paddelgränd 8, 216 11 Limhamn", siloId: 9, addressId: '404' },
];

export const packageAddresses = [
  { address: "Dybäcksgatan 5, 216 20 Malmö", addressId: '101' },
  { address: "Birger Jarlsgatan 26, 216 12 Limhamn", addressId: '202' },
  { address: "Lovisas Gata 5, 218 51 Klagshamn", addressId: '303' },
  { address: "Paddelgränd 8, 216 11 Limhamn", addressId: '404' },
];