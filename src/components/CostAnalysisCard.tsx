import React from 'react';
import { PieChart, DollarSign, Home, ShieldAlert, Sparkles, Copy, Check } from 'lucide-react';
import { CalculationResult, formatArea, formatVND, readMoneyInWords } from '../utils/formatters';
import { EstimationData } from '../types';

interface CostAnalysisCardProps {
  data: EstimationData;
  result: CalculationResult;
}

export const CostAnalysisCard: React.FC<CostAnalysisCardProps> = ({ data, result }) => {
  const [copied, setCopied] = React.useState(false);

  const realUsableArea = (data.dienTichXayDung * data.soTang) + data.dienTichThem;
  const costPerUsableArea = realUsableArea > 0 ? Math.round(result.tongChiPhi / realUsableArea) : 0;

  const pctSoBo = result.tongChiPhi > 0 ? ((result.thanhTienSoBo / result.tongChiPhi) * 100).toFixed(1) : '0';
  const pctMai = result.tongChiPhi > 0 ? ((result.thanhTienMai / result.tongChiPhi) * 100).toFixed(1) : '0';
  const pctPhatSinh = result.tongChiPhi > 0 ? ((result.chiPhiPhatSinh / result.tongChiPhi) * 100).toFixed(1) : '0';
  const pctOther = result.tongChiPhi > 0 ? (((result.thanhTienSanVuon + result.thanhTienCoc + result.thanhTienCustomItems) / result.tongChiPhi) * 100).toFixed(1) : '0';

  const copySummaryToClipboard = () => {
    const text = `📊 BẢNG DỰ TOÁN CHI PHÍ XÂY DỰNG
- Diện tích xây dựng trệt: ${data.dienTichXayDung} m²
- Số tầng: ${data.soTang} tầng
- Diện tích thêm: ${data.dienTichThem} m²
- ${data.maiBtctRate === 50 ? 'Mái BTCT có chống nóng lát gạch tường bao (50%)' : 'Mái bê tông cốt thép (30%)'}: ${formatArea(result.dienTichMaiBtct)} m²
- Móng quy đổi: ${formatArea(result.dienTichMong)} m²
- Tổng diện tích tính toán: ${formatArea(result.tongDienTich)} m²
- Đơn giá xây dựng: ${formatVND(data.donGiaXayDung)} đ/m²
------------------------------
1. Thành tiền sơ bộ: ${formatVND(result.thanhTienSoBo)} đ
2. Sân vườn lát gạch: ${formatVND(result.thanhTienSanVuon)} đ
3. Ép cọc bê tông: ${formatVND(result.thanhTienCoc)} đ
4. Chi phí loại mái: ${formatVND(result.thanhTienMai)} đ
5. Chi phí phát sinh: ${formatVND(result.chiPhiPhatSinh)} đ
${result.thanhTienCustomItems > 0 ? `6. Phụ trợ bổ sung: ${formatVND(result.thanhTienCustomItems)} đ\n` : ''}------------------------------
👉 TỔNG CỘNG: ${formatVND(result.tongChiPhi)} đ
(Bằng chữ: ${readMoneyInWords(result.tongChiPhi)})`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* Metric 1: Tổng chi phí */}
      <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-xs flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between text-xs text-slate-500 font-semibold mb-1">
            <span>TỔNG KINH PHÍ DỰ TOÁN</span>
            <DollarSign className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-xl lg:text-2xl font-black text-slate-900 tracking-tight">
            {formatVND(result.tongChiPhi)} <span className="text-xs font-semibold text-slate-500">VNĐ</span>
          </div>
        </div>

        <button
          type="button"
          onClick={copySummaryToClipboard}
          className="mt-3 flex items-center justify-center gap-1.5 text-xs font-medium py-1.5 px-2.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
          <span>{copied ? 'Đã sao chép tóm tắt!' : 'Sao chép nhanh gửi Zalo'}</span>
        </button>
      </div>

      {/* Metric 2: Diện tích sàn & đơn giá thực tế */}
      <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-xs flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between text-xs text-slate-500 font-semibold mb-1">
            <span>DIỆN TÍCH SỬ DỤNG THỰC TẾ</span>
            <Home className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-xl lg:text-2xl font-black text-slate-900 tracking-tight">
            {formatArea(realUsableArea)} <span className="text-xs font-semibold text-slate-500">m² sử dụng</span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Đơn giá thực tế: <strong className="text-slate-800 font-bold">{formatVND(costPerUsableArea)} đ/m²</strong>
          </p>
        </div>
        <div className="text-[11px] text-slate-400 mt-2 font-mono">
          Diện tích quy đổi tính tiền: {formatArea(result.tongDienTich)} m²
        </div>
      </div>

      {/* Metric 3: Cơ cấu tỷ trọng */}
      <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-xs flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between text-xs text-slate-500 font-semibold mb-2">
            <span>CƠ CẤU CHI PHÍ</span>
            <PieChart className="w-4 h-4 text-amber-500" />
          </div>

          {/* Progress bar */}
          <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden flex mb-2">
            <div style={{ width: `${pctSoBo}%` }} className="bg-amber-500" title={`Xây thô & hoàn thiện: ${pctSoBo}%`} />
            <div style={{ width: `${pctMai}%` }} className="bg-sky-500" title={`Phần mái: ${pctMai}%`} />
            <div style={{ width: `${pctPhatSinh}%` }} className="bg-emerald-500" title={`Phát sinh: ${pctPhatSinh}%`} />
            <div style={{ width: `${pctOther}%` }} className="bg-purple-500" title={`Khác: ${pctOther}%`} />
          </div>

          <div className="grid grid-cols-2 gap-1 text-[11px] text-slate-600">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-amber-500" />
              <span>Xây cơ bản: <strong>{pctSoBo}%</strong></span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-sky-500" />
              <span>Phần mái: <strong>{pctMai}%</strong></span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>Dự phòng: <strong>{pctPhatSinh}%</strong></span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-purple-500" />
              <span>Phụ trợ/Sân: <strong>{pctOther}%</strong></span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
