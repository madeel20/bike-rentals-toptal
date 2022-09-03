import moment from "moment";

export const getFormattedDate = (date:any) => {
  return moment(new Date(date?.seconds * 1000)).format("MMMM d, h:mm a")
  };
