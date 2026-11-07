import { normalizeSearchText } from './search';

describe('Vietnamese book search', () => {
  test.each([
    ['  TÂM LÝ HỌC VỀ TIỀN  ', 'tam ly hoc ve tien'],
    ['Đặng Thái Sơn', 'dang thai son'],
    ['Ngoa\u0323i ngư\u0303', 'ngoai ngu'],
    ['  Robert C. Martin  ', 'robert c. martin'],
    ['   ', ''],
  ])('normalizes %j to %j', (input, expected) => {
    expect(normalizeSearchText(input)).toBe(expected);
  });
});
