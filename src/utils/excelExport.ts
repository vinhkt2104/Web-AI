import { EstimationData, FoundationOption, RoofOption } from '../types';
import { CalculationResult, formatArea, formatVND } from './formatters';

export function exportToCSV(
  data: EstimationData,
  result: CalculationResult,
  foundations: FoundationOption[],
  roofs: RoofOption[]
): void {
  const currentFoundation = foundations.find(f => f.id === data.selectedFoundationId) || foundations[0];
  const currentRoof = roofs.find(r => r.id === data.selectedRoofId) || roofs[0];

  const rows: (string | number)[][] = [
    ['BẢNG DỰ TOÁN KINH PHÍ XÂY DỰNG CÔNG TRÌNH'],
    ['(Mẫu tính theo hệ số diện tích xây dựng quy đổi & đơn giá trọn gói)'],
    [''],
    ['I. THÔNG SỐ & DIỆN TÍCH QUY ĐỔI', '', 'Khối lượng / Giá trị', 'ĐVT', '', 'BẢNG TRA HỆ SỐ MÓNG', 'Tỷ lệ %'],
    ['1. Diện tích xây dựng (sàn trệt)', '', data.dienTichXayDung, 'm²', '', 'Móng đơn', 30],
    ['2. Số tầng xây dựng', '', data.soTang, 'tầng', '', 'Móng băng', 50],
    ['3. Diện tích thêm (ban công, lửng...)', '', data.dienTichThem, 'm²', '', 'Móng cọc', 40],
    [`4. ${data.maiBtctRate === 50 ? 'Mái BTCT có chống nóng lát gạch tường bao (50%)' : 'Mái bê tông cốt thép (30%)'}`, '', result.dienTichMaiBtct, 'm²', '', 'Móng bè', 80],
    [`5. Móng quy đổi (${currentFoundation.name})`, '', result.dienTichMong, 'm²', '', '', ''],
    ['▶ TỔNG DIỆN TÍCH QUY ĐỔI', '', result.tongDienTich, 'm²', '', '', ''],
    ['6. Đơn giá xây dựng trọn gói', '', data.donGiaXayDung, 'đ/m²', '', 'BẢNG TRA ĐƠN GIÁ MÁI', 'Đơn giá (đ/m²)'],
    ['▶ THÀNH TIỀN XÂY DỰNG CƠ BẢN', '', result.thanhTienSoBo, 'đ', '', 'Mái ngói', 650000],
    [''],
    ['II. HẠNG MỤC PHỤ TRỢ & PHÁT SINH', '', '', '', '', 'Mái tôn', 500000],
    ['7. Sân vườn lát gạch (1tr/m²)', '', data.sanVuonDienTich, 'm²', result.thanhTienSanVuon > 0 ? result.thanhTienSanVuon : '-', ''],
    ['8. Ép cọc bê tông (250k/m dài)', '', data.cocChieuDai, 'm', result.thanhTienCoc > 0 ? result.thanhTienCoc : '-', ''],
    [`9. Phần mái riêng (${currentRoof.name})`, '', result.roofArea, 'm²', result.thanhTienMai, 'đ'],
    ['10. Chi phí phát sinh & dự phòng', '', data.chiPhiPhatSinh, 'đ', '', '', ''],
    ['TỔNG CỘNG CHI PHÍ DỰ TOÁN', '', result.tongChiPhi, 'đ', '', '', ''],
  ];

  if (data.customItems && data.customItems.length > 0) {
    rows.push(['']);
    rows.push(['HẠNG MỤC BỔ SUNG & PHỤ TRỢ']);
    rows.push(['Tên hạng mục', 'ĐVT', 'Khối lượng', 'Đơn giá (đ)', 'Thành tiền (đ)']);
    data.customItems.forEach((item) => {
      rows.push([item.name, item.unit, item.quantity, item.unitPrice, item.quantity * item.unitPrice]);
    });
  }

  // Convert array to CSV string
  const csvContent = rows
    .map(row => row.map(cell => {
      const cellStr = cell === null || cell === undefined ? '' : String(cell);
      if (cellStr.includes(',') || cellStr.includes('"') || cellStr.includes('\n')) {
        return `"${cellStr.replace(/"/g, '""')}"`;
      }
      return cellStr;
    }).join(','))
    .join('\r\n');

  // Add UTF-8 BOM so Excel correctly renders Vietnamese unicode
  const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `Du_Toan_Xay_Dung_${data.dienTichXayDung}m2_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
