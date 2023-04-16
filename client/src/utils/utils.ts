import spotify from '../assets/spotify.svg';
import netflix from '../assets/netflix.svg';
import prime from '../assets/prime.svg';
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

export function getBrandLogo(name: string) {
  const services: { [s: string]: any } = {
    spotify,
    netflix,
    prime,
  };
  return services[name];
}
