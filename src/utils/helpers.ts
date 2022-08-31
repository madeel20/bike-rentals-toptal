export const getFormattedDate = (date:Date) => {
    let today = new Date(date);
    let dd = today.getDate();
    let mm = today.getMonth() + 1;
    let yyyy = today.getFullYear();
    return yyyy + "-" + mm + "-" + dd;
  };