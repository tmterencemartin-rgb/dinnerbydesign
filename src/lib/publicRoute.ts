const normalisePath = (pathName: string) =>
  pathName.length > 1 ? pathName.replace(/\/+$/, '') : pathName;

export const isPublicGuideRoute = (pathName: string) => {
  const path = normalisePath(pathName);
  return path === '/why-dinnerbydesign'
    || path === '/guides'
    || path === '/contact'
    || path === '/dinner-plans'
    || path === '/recipes'
    || path === '/food-costs'
    || path.startsWith('/guides/')
    || path.startsWith('/recipes/')
    || path.startsWith('/food-costs/')
    || path.startsWith('/dinner-plans/');
};
