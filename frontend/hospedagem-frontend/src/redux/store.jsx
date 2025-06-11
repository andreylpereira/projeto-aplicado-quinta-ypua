import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./reducers/userReducer";
import clientReducer from "./reducers/clientReducer";
import amenityReducer from "./reducers/amenityReducer";
import accommodationReducer from "./reducers/accommodationReducer";
import reservationReducer from "./reducers/reservationReducer";

const store = configureStore({
  reducer: {
    user: userReducer,
    client: clientReducer,
    amenity: amenityReducer,
    accommodations: accommodationReducer,
    reservation: reservationReducer,
  },
});


export default store;
