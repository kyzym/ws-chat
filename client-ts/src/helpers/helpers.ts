export const getInitials = (name: string) => {
  const splitName = name.toUpperCase().split(' ');

  if (splitName.length === 1) return splitName[0].substring(0, 2);

  return splitName[0].substring(0, 1) + splitName[1].substring(0, 1);
};
