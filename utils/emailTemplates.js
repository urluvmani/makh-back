export const orderConfirmationHTML = ({ name, orderId, total }) => `
  <div style="font-family:Arial;line-height:1.6">
    <h2>Thanks for your order, ${name}!</h2>
    <p>Order ID: <b>${orderId}</b></p>
    <p>Total: <b>Rs. ${total}</b></p>
    <p>We’ll notify you as your order status changes.</p>
    <p>— Makhsoos Store</p>
  </div>
`;

export const orderStatusHTML = ({ name, orderId, status }) => `
  <div style="font-family:Arial;line-height:1.6">
    <h2>Order Update</h2>
    <p>Hi ${name}, your order <b>${orderId}</b> status is now <b>${status}</b>.</p>
    <p>— Makhsoos Store</p>
  </div>
`;
