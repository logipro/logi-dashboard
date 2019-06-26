export function getCookie(name: string) {
  const regex = new RegExp(`(?:(?:^|.*;*)${name}*=*([^;]*).*$)|^.*$`);
  return document.cookie.replace(regex, "$1");
}

export const Value2SQLValue = new Map();

const DateTimeConverter = (value: any) => {
  var d = new Date(value);
  return `'${d.toISOString()}'`;
};

Value2SQLValue.set("Date", DateTimeConverter)
  .set("DateTime", DateTimeConverter)
  .set("Time", DateTimeConverter);

Value2SQLValue.set("Number", (value: any) => value);

Value2SQLValue.set("String", (value: any) => `'${value}'`);

Value2SQLValue.set("Boolean", (value: any) => (value ? 1 : 0));
