export function formatPrice(price: number): string {
  const priceStr = price.toString();
  let formatedPrice: string = '';
  Array.from(priceStr)
    .reverse()
    .forEach((char, i) => {
      if ((i + 1) % 3 == 0 && i + 1 !== priceStr.length) {
        formatedPrice = formatedPrice + char + ',';
      } else {
        formatedPrice = formatedPrice + char;
      }
    });
  return Array.from(formatedPrice).reverse().join('');
}
