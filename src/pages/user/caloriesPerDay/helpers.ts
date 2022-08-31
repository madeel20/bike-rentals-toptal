import moment from "moment";

export const getPerDayCalories = (data:any) => {
  let perDayCalories = data.reduce((data:any, each:any) => {
    let date = moment(new Date(each.data()?.date.seconds * 1000)).format(
      "DD MMM YYYY"
    );
    data[date] = data[date]
      ? data[date] + Number(each.data().calories)
      : Number(each.data().calories);

    return data;
  }, {});

  return Object.entries(perDayCalories)
    .map(([date, calories]) => ({
      date,
      calories,
    }))
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};
