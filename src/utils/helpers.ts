import moment, { Moment } from "moment";

export const getFormattedDate = (date: Moment) => {
  return moment(new Date(date.toDate())).format("MMMM DD, h:mm a");
  };
