export const stringToColor = (str: string): string => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  let color = "#";
  for (let i = 0; i < 3; i++) {
    const value = (hash >> (i * 8)) & 0xff;
    color += ("00" + value.toString(16)).slice(-2);
  }
  return color;
};

export const stringToColorText = (str: string): string => {
  const backgroundColor = stringToColor(str);
  const r = parseInt(backgroundColor.substr(1, 2), 16);
  const g = parseInt(backgroundColor.substr(3, 2), 16);
  const b = parseInt(backgroundColor.substr(5, 2), 16);
  const luminance = (r * 299 + g * 587 + b * 114) / 1000;
  return luminance > 128 ? "#404040" : "#ededed";
};
