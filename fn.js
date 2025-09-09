function csvToArray(str, delimiter = ";") {
  // прочита csv-то и го връща като редове във формата на array
  const headers = str.slice(0, str.indexOf("\n")).split(delimiter);
  const rows = str.slice(str.indexOf("\n") + 1).split("\n");
  const arr = rows.map(function (row) {
    const values = row.split(delimiter);
    const el = headers.reduce(function (object, header, index) {
      object[header] = values[index];
      return object;
    }, {});
    return el;
  });
  return arr;
}

function isRowValid(row) {
  // валидира стойностите прочетени от реда в csv-то
  return (
    row.title &&
    row.title !== "" &&
    row.ingridients &&
    row.ingridients !== "" &&
    checkDates(row.from_date, row.to_date) &&
    +row.price_25 !== NaN &&
    +row.price_30 !== NaN &&
    +row.price_36 !== NaN &&
    row.currency &&
    row.currency !== ""
  );
}

function convertCurrency(amount, from, to) {
  // преобразува една валута в друга (само bgn и eur)
  // подсигурява връщане на стойност, като при грешка е 0
  if (+amount === NaN) {
    return "0.00";
  } else if (from.toLowerCase() === to.toLowerCase()) {
    return (+amount).toFixed(2);
  } else if (from.toLowerCase() === "bgn" && to.toLowerCase() === "eur") {
    return (+amount / 1.95583).toFixed(2);
  } else if (from.toLowerCase() === "eur" && to.toLowerCase() === "bgn") {
    return (+amount * 1.95583).toFixed(2);
  } else {
    return "0.00";
  }
}

function getDisplayParam() {
  // взема display параметъра и се подсигурява, че е една от трите стойности
  let displayParam = new URL(location.href).searchParams.get("display");
  if (
    displayParam &&
    displayParam !== "" &&
    (displayParam.toLowerCase() === "tv1" ||
      displayParam.toLowerCase() === "tv2")
  )
    return displayParam;
  else return "all";
}

function checkDates(from, to) {
  f = new Date(from);
  t = new Date(to);
  c = new Date();
  return (
    (!isNaN(f) && !isNaN(t) && c >= f && c <= t) ||
    (isNaN(t) && !isNaN(f) && c >= f) ||
    (isNaN(f) && !isNaN(t) && c <= t) ||
    (isNaN(t) && isNaN(t))
  );
}

function insertRow(table, tableIndex, p) {
  let currentRowBGN = table.insertRow(tableIndex);
  let title = currentRowBGN.insertCell(0);
  title.innerHTML = p.title;
  title.style.fontWeight = "bold";
  title.rowSpan = "2";
  title.className = "title";
  let p25bgn = currentRowBGN.insertCell(1);
  p25bgn.innerHTML = `${convertCurrency(p.price_25, p.currency, "bgn")}лв.`;
  p25bgn.style.fontWeight = "bold";
  p25bgn.className = "price";
  let p30bgn = currentRowBGN.insertCell(2);
  p30bgn.innerHTML = `${convertCurrency(p.price_30, p.currency, "bgn")}лв.`;
  p30bgn.style.fontWeight = "bold";
  p30bgn.className = "price";
  let p36bgn = currentRowBGN.insertCell(3);
  p36bgn.innerHTML = `${convertCurrency(p.price_36, p.currency, "bgn")}лв.`;
  p36bgn.style.fontWeight = "bold";
  p36bgn.className = "price";
  tableIndex++;
  let currentRowEUR = table.insertRow(tableIndex);
  let p25eur = currentRowEUR.insertCell(0);
  p25eur.innerHTML = `${convertCurrency(p.price_25, p.currency, "eur")}€`;
  p25eur.style.fontWeight = "bold";
  p25eur.className = "price";
  let p30eur = currentRowEUR.insertCell(1);
  p30eur.innerHTML = `${convertCurrency(p.price_30, p.currency, "eur")}€`;
  p30eur.style.fontWeight = "bold";
  p30eur.className = "price";
  let p36eur = currentRowEUR.insertCell(2);
  p36eur.innerHTML = `${convertCurrency(p.price_36, p.currency, "eur")}€`;
  p36eur.style.fontWeight = "bold";
  p36eur.className = "price";
  tableIndex++;
  // съставки
  let currentRowIngridients = table.insertRow(tableIndex);
  currentRowIngridients.className = "ingridients";
  let ingridients = currentRowIngridients.insertCell(0);
  ingridients.innerHTML = p.ingridients;
  ingridients.colSpan = "4";
  ingridients.style.fontStyle = "italic";
  tableIndex++;
  return tableIndex;
}
