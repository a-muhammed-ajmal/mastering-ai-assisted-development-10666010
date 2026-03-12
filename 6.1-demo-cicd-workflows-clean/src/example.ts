/**
 * Example module demonstrating discount and coupon validation logic
 * Used to demonstrate AI-assisted code review and test coverage analysis
 */

export interface DiscountResult {
  originalPrice: number;
  discountAmount: number;
  finalPrice: number;
  discountPercent: number;
}

export interface CouponValidationResult {
  valid: boolean;
  message: string;
  discountPercent?: number;
}

/**
 * Calculates the discount amount and final price for a given original price
 * @param originalPrice The original price in dollars
 * @param discountPercent The discount percentage (0-100)
 * @returns DiscountResult with calculated values
 */
export function calculateDiscount(
  originalPrice: number,
  discountPercent: number
): DiscountResult {
  if (originalPrice < 0) {
    throw new Error('Original price cannot be negative');
  }

  if (discountPercent < 0 || discountPercent > 100) {
    throw new Error('Discount percentage must be between 0 and 100');
  }

  const discountAmount = (originalPrice * discountPercent) / 100;
  const finalPrice = originalPrice - discountAmount;

  return {
    originalPrice,
    discountAmount: Math.round(discountAmount * 100) / 100,
    finalPrice: Math.round(finalPrice * 100) / 100,
    discountPercent,
  };
}

/**
 * Validates a coupon code against predefined coupons
 * @param couponCode The coupon code to validate
 * @returns CouponValidationResult with validity and discount info
 */
export function validateCoupon(couponCode: string): CouponValidationResult {
  const coupons: Record<string, number> = {
    'SAVE10': 10,
    'SAVE20': 20,
    'WELCOME': 15,
    'SUMMER50': 50,
  };

  const normalizedCode = couponCode.toUpperCase().trim();

  if (!normalizedCode) {
    return {
      valid: false,
      message: 'Coupon code cannot be empty',
    };
  }

  if (normalizedCode in coupons) {
    return {
      valid: true,
      message: `Coupon applied successfully`,
      discountPercent: coupons[normalizedCode],
    };
  }

  return {
    valid: false,
    message: 'Coupon code is invalid or expired',
  };
}

/**
 * Applies a coupon to a price and returns the final price
 * @param price The original price
 * @param couponCode The coupon code to apply
 * @returns The final price after applying the coupon, or original price if invalid
 */
export function applyCoupon(price: number, couponCode: string): number {
  if (price < 0) {
    return price;
  }

  const validation = validateCoupon(couponCode);

  if (!validation.valid || validation.discountPercent === undefined) {
    return price;
  }

  const result = calculateDiscount(price, validation.discountPercent);
  return result.finalPrice;
}

/**
 * Checks if a price qualifies for bulk discount
 * @param quantity The quantity being purchased
 * @param pricePerUnit The price per unit
 * @returns The total price with bulk discount applied
 */
export function applyBulkDiscount(
  quantity: number,
  pricePerUnit: number
): number {
  if (quantity <= 0 || pricePerUnit < 0) {
    throw new Error('Invalid quantity or price');
  }

  const subtotal = quantity * pricePerUnit;

  // Bulk discount tiers
  if (quantity >= 100) {
    return Math.round(subtotal * 0.8 * 100) / 100; // 20% off
  } else if (quantity >= 50) {
    return Math.round(subtotal * 0.9 * 100) / 100; // 10% off
  } else if (quantity >= 10) {
    return Math.round(subtotal * 0.95 * 100) / 100; // 5% off
  }

  return subtotal;
}

/**
 * Formats a price value as a currency string
 * @param price The price to format
 * @returns Formatted price string with dollar sign
 */
export function formatPrice(price: number): string {
  return `$${price.toFixed(2)}`;
}
