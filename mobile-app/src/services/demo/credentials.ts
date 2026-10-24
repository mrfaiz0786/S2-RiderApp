/** Public simulator fixtures. Never use these to authenticate a real rider. */
export const demoConfig = {
  demoMode: true,
  testPhone: "9999999999",
  demoOtp: "123456",
  pickupPin: "112233",
  deliveryPin: "654321",
  testRiderName: "YBM Test Rider",
  testVehicle: "YBM-TEST-01",
} as const;
