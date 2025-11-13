export const formatPrice = (price) => {
  if (typeof price !== 'number' || Number.isNaN(price)) {
    return '';
  }
  return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};
