function capitalizeFirst(s: string) {
  if (!s) return "";
  return s.charAt(0).toUpperCase() + s.slice(1);
}

export const StringUtils = {
  capitalizeFirst,
};
