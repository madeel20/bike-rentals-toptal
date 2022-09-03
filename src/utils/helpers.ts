import moment from "moment";

export const getFormattedDate = (date:any) => {
  return moment(new Date(date.toDate())).format("MMMM DD, h:mm a");
  };
