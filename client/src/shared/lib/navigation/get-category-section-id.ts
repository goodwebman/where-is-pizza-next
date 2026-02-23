import { CategoryId } from '../../config';

export const getCategorySectionId = (category: CategoryId) =>
  `section-${category}`;
