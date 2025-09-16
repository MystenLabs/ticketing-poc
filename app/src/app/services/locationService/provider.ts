import toast from "react-hot-toast";

export const LocationService = () => {
  return {
    get: () => {
      return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            resolve(position);
          },
          (error) => {
            reject(error);
          },
        );
      });
    },
    userEntered: () => {
      return new Promise((resolve, reject) => {
        toast.success("User entered geofence");
        // Do some minting here
        // handleUpdate();
      });
    },
    startGeolocation: () => {
      return new Promise((resolve, reject) => {
        // Implement geofencing logic here for production use
        setTimeout(() => {
          LocationService().userEntered();
        }, 5000);
      });
    },
  };
};
