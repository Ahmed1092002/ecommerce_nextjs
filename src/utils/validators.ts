export const validators = {
  email: (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },

  password: (password: string): boolean => {
    // At least 8 characters
    return password.length >= 8;
  },

  phone: (phone: string): boolean => {
    const phoneRegex = /^[0-9]{10,15}$/;
    return phoneRegex.test(phone.replace(/\s/g, ""));
  },

  price: (price: number): boolean => {
    return price > 0;
  },

  stock: (stock: number): boolean => {
    return stock >= 0 && Number.isInteger(stock);
  },
};
