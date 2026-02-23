export const formatIngredients = (ingredients: string | string[]) => {
  if (Array.isArray(ingredients)) return ingredients.join(', ');
  try {
    return JSON.parse(ingredients).join(', ');
  } catch {
    return '';
  }
};
