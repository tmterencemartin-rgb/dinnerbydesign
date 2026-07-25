const normalisePath = (pathName: string) =>
  pathName.length > 1 ? pathName.replace(/\/+$/, '') : pathName;

export const isPublicGuideRoute = (pathName: string) => {
  const path = normalisePath(pathName);
  return path === '/guides'
    || path.startsWith('/guides/')
    || path.startsWith('/food-costs/')
    || path.startsWith('/dinner-plans/');
};
