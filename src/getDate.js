const objDate = new Date(),
    getMonth = objDate.getMonth() + 1,
    getDate = objDate.getDate(),
    yy = String(objDate.getFullYear()).substr(2,2),
    mm = getMonth < 10 ? `0${getMonth}` : getMonth,
    dd = getDate < 10 ? `0${getDate}` : getDate,
    date = yy + mm + dd;

export default date;