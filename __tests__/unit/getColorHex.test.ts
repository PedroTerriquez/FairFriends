import { getColorHex } from '@/services/getColorHex';

describe('getColorHex', () => {
  it('maps each progress bucket to its color', () => {
    expect(getColorHex(0)).toBe('#dc3545');
    expect(getColorHex(20)).toBe('#dc3545');
    expect(getColorHex(21)).toBe('#f7ab3aff');
    expect(getColorHex(40)).toBe('#f7ab3aff');
    expect(getColorHex(41)).toBe('#F2E205');
    expect(getColorHex(60)).toBe('#F2E205');
    expect(getColorHex(61)).toBe('#A8D08D');
    expect(getColorHex(80)).toBe('#A8D08D');
    expect(getColorHex(81)).toBe('#008000');
    expect(getColorHex(100)).toBe('#008000');
  });

  it('treats values below the scale as the lowest bucket', () => {
    expect(getColorHex(-10)).toBe('#dc3545');
  });

  // Guards the gap between the `<= 80` and `>= 81` cases: a fractional value in
  // between falls through to the default color.
  it('falls back to the default color for values between 80 and 81', () => {
    expect(getColorHex(80.5)).toBe('#FF6F61');
  });
});
