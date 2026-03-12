import {
  calculateDiscount,
  validateCoupon,
  applyCoupon,
  applyBulkDiscount,
  formatPrice,
  DiscountResult,
  CouponValidationResult,
} from '../src/example';

describe('calculateDiscount', () => {
  it('should calculate discount correctly', () => {
    const result = calculateDiscount(100, 20);
    expect(result.originalPrice).toBe(100);
    expect(result.discountAmount).toBe(20);
    expect(result.finalPrice).toBe(80);
    expect(result.discountPercent).toBe(20);
  });

  it('should handle zero discount', () => {
    const result = calculateDiscount(100, 0);
    expect(result.finalPrice).toBe(100);
    expect(result.discountAmount).toBe(0);
  });

  it('should handle 100% discount', () => {
    const result = calculateDiscount(100, 100);
    expect(result.finalPrice).toBe(0);
  });

  it('should throw error for negative price', () => {
    expect(() => calculateDiscount(-50, 10)).toThrow(
      'Original price cannot be negative'
    );
  });

  it('should throw error for invalid discount percentage', () => {
    expect(() => calculateDiscount(100, -10)).toThrow(
      'Discount percentage must be between 0 and 100'
    );
    expect(() => calculateDiscount(100, 150)).toThrow(
      'Discount percentage must be between 0 and 100'
    );
  });

  // Coverage gap: decimal prices not thoroughly tested
});

describe('validateCoupon', () => {
  it('should validate known coupon codes', () => {
    const result = validateCoupon('SAVE10');
    expect(result.valid).toBe(true);
    expect(result.discountPercent).toBe(10);
  });

  it('should handle case-insensitive coupon codes', () => {
    const result = validateCoupon('save10');
    expect(result.valid).toBe(true);
    expect(result.discountPercent).toBe(10);
  });

  it('should reject invalid coupon codes', () => {
    const result = validateCoupon('INVALID');
    expect(result.valid).toBe(false);
    expect(result.discountPercent).toBeUndefined();
  });

  it('should reject empty coupon codes', () => {
    const result = validateCoupon('');
    expect(result.valid).toBe(false);
    expect(result.message).toBe('Coupon code cannot be empty');
  });

  // Coverage gap: trimming behavior, all coupon codes not tested
});

describe('applyCoupon', () => {
  it('should apply valid coupon to price', () => {
    const result = applyCoupon(100, 'SAVE20');
    expect(result).toBe(80);
  });

  it('should return original price for invalid coupon', () => {
    const result = applyCoupon(100, 'BADCOUPON');
    expect(result).toBe(100);
  });

  it('should handle negative prices gracefully', () => {
    const result = applyCoupon(-50, 'SAVE10');
    expect(result).toBe(-50);
  });

  // Coverage gap: edge cases and multiple coupon scenarios not tested
});

describe('applyBulkDiscount', () => {
  it('should apply 5% discount for 10+ quantity', () => {
    const result = applyBulkDiscount(10, 10);
    expect(result).toBe(95); // 100 * 0.95
  });

  it('should apply 10% discount for 50+ quantity', () => {
    const result = applyBulkDiscount(50, 10);
    expect(result).toBe(450); // 500 * 0.9
  });

  it('should apply 20% discount for 100+ quantity', () => {
    const result = applyBulkDiscount(100, 10);
    expect(result).toBe(800); // 1000 * 0.8
  });

  it('should throw error for invalid quantity', () => {
    expect(() => applyBulkDiscount(-5, 10)).toThrow(
      'Invalid quantity or price'
    );
    expect(() => applyBulkDiscount(0, 10)).toThrow(
      'Invalid quantity or price'
    );
  });

  it('should throw error for negative price', () => {
    expect(() => applyBulkDiscount(10, -5)).toThrow(
      'Invalid quantity or price'
    );
  });

  // Coverage gap: boundary conditions (9, 49, 99 quantities) not tested
});

describe('formatPrice', () => {
  it('should format price with dollar sign', () => {
    expect(formatPrice(50)).toBe('$50.00');
  });

  it('should format decimal prices', () => {
    expect(formatPrice(99.99)).toBe('$99.99');
  });

  // Coverage gap: negative prices, very large numbers, edge values not tested
});
