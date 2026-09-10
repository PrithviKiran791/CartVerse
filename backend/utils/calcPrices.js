// Server-side price calculation — NEVER trust prices sent from the client.
const addDecimals = (num) => Math.round((num + Number.EPSILON) * 100) / 100;

export const calcPrices = (orderItems) => {
  const itemsPrice = addDecimals(
    orderItems.reduce((acc, item) => acc + item.price * item.qty, 0)
  );

  const shippingPrice = addDecimals(itemsPrice > 5000 ? 0 : 99);
  const taxRate = 0.18; // 18% GST
  const taxPrice = addDecimals(itemsPrice * taxRate);
  const totalPrice = addDecimals(itemsPrice + shippingPrice + taxPrice);

  return { itemsPrice, shippingPrice, taxPrice, totalPrice };
}; 