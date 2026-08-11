// Routes of the transportation stack defined in CreateTransportationScreen,
// along with the params each one is navigated to with.
export type TransportStackParamList = {
  CreateTransportation: undefined;
  CreatePregnancyTransportation: undefined;
  CreateOtherTransportation: undefined;
  StartTransportation: { reason: string };
  StopTransportation: { reason: string };
  TransportationSummary: { duration: string; distance: string };
};
