import { EstimationData, FoundationOption, RoofOption } from '../types';

export function formatVND(value: number, includeUnit = false): string {
  if (value === undefined || value === null || isNaN(value)) return '0' + (includeUnit ? ' đ' : '');
  const formatted = Math.round(value).toLocaleString('vi-VN');
  return includeUnit ? `${formatted} đ` : formatted;
}

export function formatArea(value: number): string {
  if (value === undefined || value === null || isNaN(value)) return '0';
  // Check if integer or float
  if (Number.isInteger(value)) {
    return value.toString();
  }
  return Number(value.toFixed(2)).toString().replace('.', ',');
}

export function parseNumberInput(val: string | number): number {
  if (typeof val === 'number') return isNaN(val) ? 0 : val;
  if (!val) return 0;
  // Remove all non-digit, dot or comma
  // Support both dot as thousand and comma as decimal, or standard numbers
  const cleaned = val.toString().replace(/\s/g, '').replace(/đ/gi, '');
  // If format like 1.250.000 (dots as thousand)
  if (cleaned.includes('.') && !cleaned.includes(',')) {
    const parts = cleaned.split('.');
    if (parts.length > 2 || (parts.length === 2 && parts[1].length === 3)) {
      return parseFloat(cleaned.replace(/\./g, '')) || 0;
    }
  }
  // If comma as decimal
  const normalized = cleaned.replace(/\./g, '').replace(',', '.');
  const num = parseFloat(normalized);
  return isNaN(num) ? 0 : num;
}

export interface CalculationResult {
  // Diện tích
  dienTichSanCacTang: number; // dienTichXayDung * soTang
  dienTichThem: number;
  dienTichMaiBtct: number;     // dienTichXayDung * (maiBtctRate / 100)
  foundationPercentage: number;
  dienTichMong: number;        // dienTichXayDung * (foundationPercentage / 100)
  tongDienTich: number;        // dienTichSanCacTang + dienTichThem + dienTichMaiBtct + dienTichMong

  // Thành tiền sơ bộ
  thanhTienSoBo: number;       // tongDienTich * donGiaXayDung

  // Các chi phí khác
  thanhTienSanVuon: number;    // sanVuonDienTich * sanVuonDonGia
  thanhTienCoc: number;        // cocChieuDai * cocDonGia
  
  // Loại mái
  roofArea: number;
  roofUnitPrice: number;
  thanhTienMai: number;        // roofArea * roofUnitPrice

  // Chi phí phát sinh
  chiPhiPhatSinh: number;

  // Hạng mục bổ sung tự do
  thanhTienCustomItems: number;

  // TỔNG CỘNG
  tongChiPhi: number;
}

export function calculateEstimation(
  data: EstimationData,
  foundations: FoundationOption[],
  roofs: RoofOption[]
): CalculationResult {
  const currentFoundation = foundations.find(f => f.id === data.selectedFoundationId) || foundations[0];
  const foundationPercentage = Number(currentFoundation?.percentage) || 50;

  const currentRoof = roofs.find(r => r.id === data.selectedRoofId) || roofs[0];
  const roofUnitPrice = Number(currentRoof?.unitPrice) || 0;

  const dienTichXayDung = Number(data.dienTichXayDung) || 0;
  const soTang = Number(data.soTang) || 1;
  const dienTichThem = Number(data.dienTichThem) || 0;
  const maiBtctRate = Number(data.maiBtctRate) || 30;
  const donGiaXayDung = Number(data.donGiaXayDung) || 0;

  const sanVuonDienTich = Number(data.sanVuonDienTich) || 0;
  const sanVuonDonGia = Number(data.sanVuonDonGia) || 1000000;

  const cocChieuDai = Number(data.cocChieuDai) || 0;
  const cocDonGia = Number(data.cocDonGia) || 250000;

  const dienTichSanCacTang = dienTichXayDung * soTang;
  const dienTichMaiBtct = dienTichXayDung * (maiBtctRate / 100);
  const dienTichMong = dienTichXayDung * (foundationPercentage / 100);

  const tongDienTich = dienTichSanCacTang + dienTichThem + dienTichMaiBtct + dienTichMong;
  const thanhTienSoBo = tongDienTich * donGiaXayDung;

  const thanhTienSanVuon = sanVuonDienTich * sanVuonDonGia;
  const thanhTienCoc = cocChieuDai * cocDonGia;

  const rawRoofArea = data.customRoofArea !== undefined ? Number(data.customRoofArea) : dienTichXayDung;
  const roofArea = isNaN(rawRoofArea) ? dienTichXayDung : rawRoofArea;
  const thanhTienMai = roofArea * roofUnitPrice;

  const chiPhiPhatSinh = Number(data.chiPhiPhatSinh) || 0;

  const thanhTienCustomItems = (data.customItems || []).reduce(
    (acc, item) => acc + ((Number(item.quantity) || 0) * (Number(item.unitPrice) || 0)),
    0
  );

  const tongChiPhi = thanhTienSoBo + thanhTienSanVuon + thanhTienCoc + thanhTienMai + chiPhiPhatSinh + thanhTienCustomItems;

  return {
    dienTichSanCacTang,
    dienTichThem,
    dienTichMaiBtct,
    foundationPercentage,
    dienTichMong,
    tongDienTich,
    thanhTienSoBo,
    thanhTienSanVuon,
    thanhTienCoc,
    roofArea,
    roofUnitPrice,
    thanhTienMai,
    chiPhiPhatSinh,
    thanhTienCustomItems,
    tongChiPhi,
  };
}

// Chuyển đổi số tiền thành chữ tiếng Việt chuẩn xác
const VIETNAMESE_DIGITS = ['không', 'một', 'hai', 'ba', 'bốn', 'năm', 'sáu', 'bảy', 'tám', 'chín'];

function readTriple(triple: number, showZeroHundred: boolean): string {
  const hundreds = Math.floor(triple / 100);
  const remainder = triple % 100;
  const tens = Math.floor(remainder / 10);
  const units = remainder % 10;

  let result = '';

  if (hundreds > 0 || showZeroHundred) {
    result += VIETNAMESE_DIGITS[hundreds] + ' trăm ';
  }

  if (tens > 1) {
    result += VIETNAMESE_DIGITS[tens] + ' mươi ';
    if (units === 1) result += 'mốt ';
    else if (units === 5) result += 'lăm ';
    else if (units > 0) result += VIETNAMESE_DIGITS[units] + ' ';
  } else if (tens === 1) {
    result += 'mười ';
    if (units === 5) result += 'lăm ';
    else if (units > 0) result += VIETNAMESE_DIGITS[units] + ' ';
  } else if (tens === 0 && units > 0) {
    if (hundreds > 0 || showZeroHundred) {
      result += 'lẻ ' + VIETNAMESE_DIGITS[units] + ' ';
    } else {
      result += VIETNAMESE_DIGITS[units] + ' ';
    }
  }

  return result;
}

export function readMoneyInWords(num: number): string {
  if (!num || isNaN(num) || num === 0) return 'Không đồng';

  num = Math.abs(Math.round(num));
  const scales = ['', 'nghìn', 'triệu', 'tỷ', 'nghìn tỷ', 'triệu tỷ'];
  const groups: number[] = [];

  let temp = num;
  while (temp > 0) {
    groups.push(temp % 1000);
    temp = Math.floor(temp / 1000);
  }

  let result = '';
  for (let i = groups.length - 1; i >= 0; i--) {
    const group = groups[i];
    if (group > 0) {
      const showZero = i < groups.length - 1;
      const groupText = readTriple(group, showZero);
      result += groupText + scales[i] + ' ';
    }
  }

  result = result.trim() + ' đồng chẵn.';
  return result.charAt(0).toUpperCase() + result.slice(1);
}
