import React, { useState } from 'react';
import {
  ChevronDown,
  Info,
  HelpCircle,
  Plus,
  Trash2,
  Edit2,
  Check,
  RefreshCw,
  TrendingUp,
  Percent,
  Calculator
} from 'lucide-react';
import { EstimationData, FoundationOption, RoofOption } from '../types';
import { CalculationResult, formatArea, formatVND, readMoneyInWords } from '../utils/formatters';
import { AutoClearNumberInput } from './AutoClearNumberInput';

interface ExcelSheetViewProps {
  data: EstimationData;
  onChange: (newData: Partial<EstimationData>) => void;
  result: CalculationResult;
  foundations: FoundationOption[];
  onUpdateFoundations: (newFoundations: FoundationOption[]) => void;
  roofs: RoofOption[];
  onUpdateRoofs: (newRoofs: RoofOption[]) => void;
}

export const ExcelSheetView: React.FC<ExcelSheetViewProps> = ({
  data,
  onChange,
  result,
  foundations,
  onUpdateFoundations,
  roofs,
  onUpdateRoofs,
}) => {
  const [editingLookup, setEditingLookup] = useState(false);
  const [showMobileLookup, setShowMobileLookup] = useState(false);
  const [activeFormulaTooltip, setActiveFormulaTooltip] = useState<string | null>(null);

  // Helper for foundation percentage change
  const handleFoundationPercentageChange = (id: string, newPercentage: number) => {
    onUpdateFoundations(
      foundations.map(f => f.id === id ? { ...f, percentage: newPercentage } : f)
    );
  };

  // Helper for roof price change
  const handleRoofPriceChange = (id: string, newPrice: number) => {
    onUpdateRoofs(
      roofs.map(r => r.id === id ? { ...r, unitPrice: newPrice } : r)
    );
  };

  const currentFoundation = foundations.find(f => f.id === data.selectedFoundationId) || foundations[0];
  const currentRoof = roofs.find(r => r.id === data.selectedRoofId) || roofs[0];
  const tongPhuTro = result.thanhTienSanVuon + result.thanhTienCoc + result.thanhTienMai + result.chiPhiPhatSinh + result.thanhTienCustomItems;

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Top action helper bar (Hidden on mobile) */}
      <div className="hidden sm:flex flex-wrap items-center justify-between gap-3 bg-white px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg border border-slate-200 shadow-xs">
        <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-700">
          <div className="w-3.5 h-3.5 rounded bg-[#f5cbbe] border border-slate-300 shrink-0"></div>
          <span className="font-semibold text-slate-800">Ô màu cam phấn:</span>
          <span className="text-slate-500">Dữ liệu nhập / chọn trực tiếp</span>
        </div>
        
        <div className="hidden lg:flex items-center gap-2">
          <button
            id="toggle-edit-lookup-btn"
            type="button"
            onClick={() => setEditingLookup(!editingLookup)}
            className={`text-xs px-3 py-1.5 rounded font-medium transition-colors flex items-center gap-1.5 ${
              editingLookup 
                ? 'bg-amber-600 text-white shadow-xs' 
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-300'
            }`}
          >
            {editingLookup ? <Check className="w-3.5 h-3.5" /> : <Edit2 className="w-3.5 h-3.5" />}
            {editingLookup ? 'Hoàn tất chỉnh sửa bảng tra' : 'Tùy chỉnh hệ số bảng tra bên phải'}
          </button>
        </div>
      </div>

      {/* Main Excel-like Spreadsheets Container */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* LEFT COLUMN: Main Estimation Sheet (Table 1) */}
        <div className="lg:col-span-8 bg-white border border-slate-300 shadow-sm rounded-lg overflow-hidden">
          {/* Sheet title tab (Hidden on mobile) */}
          <div className="hidden sm:flex bg-slate-100 border-b border-slate-300 px-4 py-2 items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-semibold uppercase tracking-wider text-slate-600 bg-white px-2 py-0.5 rounded border border-slate-300">
                Sheet: Bảng Dự Toán
              </span>
              <span className="text-xs text-slate-500 hidden sm:inline">
                (Click vào các ô màu hồng để nhập khối lượng, số liệu)
              </span>
            </div>
            <div className="text-xs text-slate-500 font-mono">
              Công thức: Excel V3.2
            </div>
          </div>

          <div className="w-full overflow-hidden">
            <table className="w-full table-fixed text-xs sm:text-sm border-collapse">
              <colgroup>
                <col className="w-[70%]" />
                <col className="w-[30%]" />
              </colgroup>
              <thead>
                <tr className="bg-[#e88d30] text-white">
                  <th className="w-[70%] px-3 sm:px-4 py-2 sm:py-2.5 text-left font-bold text-xs sm:text-sm tracking-wide border-r border-amber-600">
                    I. THÔNG SỐ & DIỆN TÍCH QUY ĐỔI
                  </th>
                  <th className="w-[30%] px-2 sm:px-3 py-2 sm:py-2.5 text-right font-bold text-xs sm:text-sm tracking-wide">
                    Khối lượng / Giá trị
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {/* 1. Diện tích xây dựng */}
                <tr className="hover:bg-slate-50 transition-colors">
                  <td className="w-[70%] px-3 sm:px-4 py-2 font-medium text-slate-800 border-r border-slate-200">
                    <span className="font-bold text-slate-900 mr-1.5">1.</span>
                    Diện tích xây dựng (sàn trệt)
                  </td>
                  <td className="w-[30%] p-0 bg-[#f5cbbe]">
                    <AutoClearNumberInput
                      id="input-dien-tich-xd"
                      value={data.dienTichXayDung}
                      onChange={(val) => onChange({ dienTichXayDung: val })}
                      unit="m²"
                      min={1}
                      step={0.5}
                      className="font-semibold text-slate-900"
                      ariaLabel="Diện tích xây dựng sàn trệt"
                    />
                  </td>
                </tr>

                {/* 2. Số tầng */}
                <tr className="hover:bg-slate-50 transition-colors">
                  <td className="w-[70%] px-3 sm:px-4 py-2 font-medium text-slate-800 border-r border-slate-200">
                    <span className="font-bold text-slate-900 mr-1.5">2.</span>
                    Số tầng xây dựng
                  </td>
                  <td className="w-[30%] p-0 bg-[#f5cbbe]">
                    <AutoClearNumberInput
                      id="input-so-tang"
                      value={data.soTang}
                      onChange={(val) => onChange({ soTang: val })}
                      unit="tầng"
                      min={1}
                      max={20}
                      step={1}
                      className="font-semibold text-slate-900"
                      ariaLabel="Số tầng xây dựng"
                    />
                  </td>
                </tr>

                {/* 3. Diện tích thêm */}
                <tr className="hover:bg-slate-50 transition-colors">
                  <td className="w-[70%] px-3 sm:px-4 py-2 font-medium text-slate-800 border-r border-slate-200">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-0.5">
                      <div>
                        <span className="font-bold text-slate-900 mr-1.5">3.</span>
                        <span>Diện tích thêm</span>
                      </div>
                      <span className="text-[11px] text-slate-400 font-normal">
                        (ban công, thông tầng...)
                      </span>
                    </div>
                  </td>
                  <td className="w-[30%] p-0 bg-[#f5cbbe]">
                    <AutoClearNumberInput
                      id="input-dien-tich-them"
                      value={data.dienTichThem}
                      onChange={(val) => onChange({ dienTichThem: val })}
                      unit="m²"
                      min={0}
                      step={0.5}
                      className="font-semibold text-slate-900"
                      ariaLabel="Diện tích thêm"
                    />
                  </td>
                </tr>

                {/* 4. Mái BTCT (Chọn loại 30% hoặc 50%) */}
                <tr className="hover:bg-slate-50 transition-colors">
                  <td className="w-[70%] p-0 bg-[#f5cbbe] border-r border-slate-300">
                    <div className="relative flex items-center px-2.5 sm:px-4 py-1.5">
                      <span className="font-bold text-slate-900 mr-1.5 shrink-0 text-xs sm:text-sm">4.</span>
                      <select
                        id="select-mai-btct"
                        value={data.maiBtctRate}
                        onChange={(e) => onChange({ maiBtctRate: parseInt(e.target.value, 10) || 30 })}
                        aria-label="Chọn loại mái BTCT"
                        className="w-full bg-transparent font-semibold text-slate-900 focus:outline-none cursor-pointer pr-5 py-0.5 text-xs sm:text-sm"
                      >
                        <option value={30} className="bg-white text-slate-900">
                          Mái bê tông cốt thép (30%)
                        </option>
                        <option value={50} className="bg-white text-slate-900">
                          Mái BTCT có chống nóng lát gạch tường bao (50%)
                        </option>
                      </select>
                      <ChevronDown className="w-3.5 h-3.5 text-slate-600 absolute right-2 pointer-events-none" />
                    </div>
                  </td>
                  <td className="w-[30%] px-2 sm:px-3 py-2 text-right font-semibold text-slate-900 bg-slate-50">
                    {formatArea(result.dienTichMaiBtct)} <span className="text-xs text-slate-500 font-normal">m²</span>
                  </td>
                </tr>

                {/* 5. Móng (Dropdown + Calculated Area) */}
                <tr className="hover:bg-slate-50 transition-colors">
                  <td className="w-[70%] p-0 bg-[#f5cbbe] border-r border-slate-300">
                    <div className="relative flex items-center px-2.5 sm:px-4 py-1.5">
                      <span className="font-bold text-slate-900 mr-1.5 shrink-0 text-xs sm:text-sm">5.</span>
                      <select
                        id="select-mong"
                        value={data.selectedFoundationId}
                        onChange={(e) => onChange({ selectedFoundationId: e.target.value })}
                        aria-label="Chọn loại móng công trình"
                        className="w-full bg-transparent font-semibold text-slate-900 focus:outline-none cursor-pointer pr-5 py-0.5 text-xs sm:text-sm"
                      >
                        {foundations.map((f) => (
                          <option key={f.id} value={f.id} className="bg-white text-slate-900">
                            {f.name} ({f.percentage}%)
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="w-3.5 h-3.5 text-slate-600 absolute right-2 pointer-events-none" />
                    </div>
                  </td>
                  <td className="w-[30%] px-2 sm:px-3 py-2 text-right font-semibold text-slate-900 bg-slate-50">
                    {formatArea(result.dienTichMong)} <span className="text-xs text-slate-500 font-normal">m²</span>
                  </td>
                </tr>

                {/* CỘNG TỔNG DIỆN TÍCH QUY ĐỔI */}
                <tr className="bg-slate-100/95 font-semibold border-y border-slate-300">
                  <td className="w-[70%] px-3 sm:px-4 py-2 sm:py-2.5 text-slate-900 border-r border-slate-200">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-0.5">
                      <span className="font-bold text-slate-950 flex items-center gap-1">
                        <span className="text-amber-600 font-black">▶</span> TỔNG DT QUY ĐỔI
                      </span>
                      <span className="text-[10px] sm:text-xs text-slate-500 font-mono">
                        (Sàn×{data.soTang} + Thêm + Mái + Móng)
                      </span>
                    </div>
                  </td>
                  <td className="w-[30%] px-2 sm:px-3 py-2 sm:py-2.5 text-right text-xs sm:text-sm font-bold text-slate-950 bg-slate-100">
                    {formatArea(result.tongDienTich)} <span className="text-xs text-slate-600 font-normal">m²</span>
                  </td>
                </tr>

                {/* 6. Đơn giá xây dựng */}
                <tr className="hover:bg-slate-50 transition-colors">
                  <td className="w-[70%] px-3 sm:px-4 py-2 font-semibold text-slate-800 border-r border-slate-200">
                    <span className="font-bold text-slate-900 mr-1.5">6.</span>
                    Đơn giá xây dựng trọn gói
                  </td>
                  <td className="w-[30%] p-0 bg-[#f5cbbe]">
                    <AutoClearNumberInput
                      id="input-don-gia-xd"
                      value={data.donGiaXayDung}
                      onChange={(val) => onChange({ donGiaXayDung: val })}
                      isCurrency={true}
                      unit="đ/m²"
                      step={50000}
                      className="font-bold text-slate-900"
                      ariaLabel="Đơn giá xây dựng trọn gói"
                    />
                  </td>
                </tr>

                {/* THÀNH TIỀN XÂY DỰNG CƠ BẢN */}
                <tr className="bg-amber-50 font-bold border-y-2 border-amber-300">
                  <td className="w-[70%] px-3 sm:px-4 py-2 sm:py-2.5 text-slate-900 border-r border-amber-300">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-0.5">
                      <span className="text-amber-950 font-bold flex items-center gap-1">
                        <span className="text-amber-700 font-black">▶</span> THÀNH TIỀN SƠ BỘ
                      </span>
                      <span className="text-[10px] sm:text-xs font-normal text-amber-800 font-mono">
                        ({formatArea(result.tongDienTich)} m² × {formatVND(data.donGiaXayDung)} đ)
                      </span>
                    </div>
                  </td>
                  <td className="w-[30%] px-2 sm:px-3 py-2 sm:py-2.5 text-right text-xs sm:text-sm font-bold text-amber-950 bg-amber-50">
                    {formatVND(result.thanhTienSoBo)} <span className="text-xs font-normal">đ</span>
                  </td>
                </tr>

                {/* Header PHẦN II: HẠNG MỤC PHỤ TRỢ & PHÁT SINH */}
                <tr className="bg-[#e88d30] text-white">
                  <th className="w-[70%] px-3 sm:px-4 py-1.5 sm:py-2 text-left font-bold text-xs sm:text-sm tracking-wide border-r border-amber-600">
                    II. HẠNG MỤC PHỤ TRỢ & PHÁT SINH
                  </th>
                  <th className="w-[30%] px-2 sm:px-3 py-1.5 sm:py-2 text-right font-bold text-xs sm:text-sm tracking-wide">
                    Khối lượng / Giá trị
                  </th>
                </tr>

                {/* 7. Sân vườn lát gạch */}
                <tr className="hover:bg-slate-50 transition-colors">
                  <td className="w-[70%] px-3 sm:px-4 py-2 font-medium text-slate-800 border-r border-slate-200">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                      <div>
                        <span className="font-bold text-slate-900 mr-1.5">7.</span>
                        <span>Sân vườn lát gạch</span>
                        <span className="text-slate-400 text-xs ml-1">(1tr/m²)</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-[11px] text-slate-500 font-normal">Thành tiền:</span>
                        <span className={`text-xs font-bold px-1.5 py-0.5 rounded ${result.thanhTienSanVuon > 0 ? 'bg-amber-100 text-amber-900 border border-amber-300' : 'text-slate-400'}`}>
                          {formatVND(result.thanhTienSanVuon)} đ
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="w-[30%] p-0 bg-[#f5cbbe] relative">
                    <AutoClearNumberInput
                      id="input-san-vuon"
                      value={data.sanVuonDienTich}
                      onChange={(val) => onChange({ sanVuonDienTich: val })}
                      unit="m²"
                      min={0}
                      placeholder="0"
                      className="font-medium text-slate-900"
                      ariaLabel="Diện tích sân vườn lát gạch"
                    />
                    {result.thanhTienSanVuon > 0 && (
                      <div className="text-right px-2 pb-1 text-[11px] font-bold text-amber-900 bg-amber-200/40 border-t border-amber-200/60">
                        = {formatVND(result.thanhTienSanVuon)} đ
                      </div>
                    )}
                  </td>
                </tr>

                {/* 8. Cọc bê tông */}
                <tr className="hover:bg-slate-50 transition-colors">
                  <td className="w-[70%] px-3 sm:px-4 py-2 font-medium text-slate-800 border-r border-slate-200">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                      <div>
                        <span className="font-bold text-slate-900 mr-1.5">8.</span>
                        <span>Ép cọc bê tông</span>
                        <span className="text-slate-400 text-xs ml-1">(250k/m)</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-[11px] text-slate-500 font-normal">Thành tiền:</span>
                        <span className={`text-xs font-bold px-1.5 py-0.5 rounded ${result.thanhTienCoc > 0 ? 'bg-amber-100 text-amber-900 border border-amber-300' : 'text-slate-400'}`}>
                          {formatVND(result.thanhTienCoc)} đ
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="w-[30%] p-0 bg-[#f5cbbe] relative">
                    <AutoClearNumberInput
                      id="input-coc"
                      value={data.cocChieuDai}
                      onChange={(val) => onChange({ cocChieuDai: val })}
                      unit="m"
                      min={0}
                      placeholder="0"
                      className="font-bold text-slate-900"
                      ariaLabel="Chiều dài ép cọc bê tông"
                    />
                    {result.thanhTienCoc > 0 && (
                      <div className="text-right px-2 pb-1 text-[11px] font-bold text-amber-900 bg-amber-200/40 border-t border-amber-200/60">
                        = {formatVND(result.thanhTienCoc)} đ
                      </div>
                    )}
                  </td>
                </tr>

                {/* 9. Chi phí loại mái */}
                <tr className="hover:bg-slate-50 transition-colors border-t border-slate-300">
                  <td className="w-[70%] p-0 bg-[#f5cbbe] border-r border-slate-300">
                    <div className="px-2.5 sm:px-4 py-1.5 space-y-0.5">
                      <div className="relative flex items-center">
                        <span className="font-bold text-slate-900 mr-1.5 shrink-0 text-xs sm:text-sm">9.</span>
                        <select
                          id="select-mai"
                          value={data.selectedRoofId}
                          onChange={(e) => onChange({ selectedRoofId: e.target.value })}
                          aria-label="Chọn loại mái công trình"
                          className="w-full bg-transparent font-semibold text-slate-900 focus:outline-none cursor-pointer pr-5 py-0.5 text-xs sm:text-sm"
                        >
                          {roofs.map((r) => (
                            <option key={r.id} value={r.id} className="bg-white text-slate-900">
                              {r.name} ({formatVND(r.unitPrice)} đ/m²)
                            </option>
                          ))}
                        </select>
                        <ChevronDown className="w-3.5 h-3.5 text-slate-600 absolute right-1 pointer-events-none" />
                      </div>
                      <div className="text-[10px] sm:text-xs text-slate-600 flex items-center justify-between pl-4 sm:pl-5">
                        <span>Thành tiền mái:</span>
                        <span className="font-bold text-amber-900">{formatVND(result.thanhTienMai)} đ</span>
                      </div>
                    </div>
                  </td>
                  <td className="w-[30%] p-0 bg-[#f5cbbe] relative">
                    <AutoClearNumberInput
                      id="input-mai-area"
                      value={data.customRoofArea !== undefined ? data.customRoofArea : data.dienTichXayDung}
                      onChange={(val) => onChange({ customRoofArea: val })}
                      unit="m²"
                      min={0}
                      className="font-semibold text-slate-900"
                      ariaLabel="Diện tích tính tiền mái"
                    />
                    {result.thanhTienMai > 0 && (
                      <div className="text-right px-2 pb-1 text-[11px] font-bold text-amber-900 bg-amber-200/40 border-t border-amber-200/60">
                        = {formatVND(result.thanhTienMai)} đ
                      </div>
                    )}
                  </td>
                </tr>

                {/* 10. Chi phí phát sinh */}
                <tr className="hover:bg-slate-50 transition-colors border-t border-slate-300">
                  <td className="w-[70%] px-3 sm:px-4 py-2 font-medium text-slate-800 border-r border-slate-200">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-0.5">
                      <div>
                        <span className="font-bold text-slate-900 mr-1.5">10.</span>
                        <span>Chi phí phát sinh & dự phòng</span>
                      </div>
                      <span className="text-[11px] text-slate-400 font-normal">
                        (thủ tục, hoàn công)
                      </span>
                    </div>
                  </td>
                  <td className="w-[30%] p-0 bg-[#f5cbbe]">
                    <AutoClearNumberInput
                      id="input-chi-phi-phat-sinh"
                      value={data.chiPhiPhatSinh}
                      onChange={(val) => onChange({ chiPhiPhatSinh: val })}
                      isCurrency={true}
                      unit="đ"
                      step={1000000}
                      className="font-bold text-slate-900"
                      ariaLabel="Chi phí phát sinh và dự phòng"
                    />
                  </td>
                </tr>

                {/* Tổng phụ trợ & phát sinh */}
                <tr className="bg-amber-100/70 font-semibold text-slate-900 border-t border-amber-300">
                  <td className="w-[70%] px-3 sm:px-4 py-2 text-xs sm:text-sm tracking-wide border-r border-amber-300">
                    <span className="text-amber-900 font-bold uppercase text-[11px] sm:text-xs">
                      ▶ CỘNG MỤC II (Hạng mục phụ trợ & Phát sinh):
                    </span>
                  </td>
                  <td className="w-[30%] px-2 sm:px-3 py-2 text-right text-xs sm:text-sm font-bold text-amber-950 bg-amber-100/90">
                    {formatVND(tongPhuTro)} <span className="text-xs font-normal">đ</span>
                  </td>
                </tr>

                {/* TỔNG KINH PHÍ DỰ TOÁN */}
                <tr className="bg-[#ea8d35] text-slate-900 font-bold border-t-2 border-amber-600">
                  <td className="w-[70%] px-3 sm:px-4 py-2.5 sm:py-3 tracking-wider text-slate-950 font-extrabold text-sm sm:text-lg border-r border-amber-600">
                    TỔNG CHI PHÍ CÔNG TRÌNH
                  </td>
                  <td className="w-[30%] px-2 sm:px-3 py-2.5 sm:py-3 text-right font-black text-sm sm:text-xl text-slate-950 tracking-tight whitespace-nowrap">
                    {formatVND(result.tongChiPhi)} <span className="text-xs sm:text-sm font-semibold">đ</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Amount in words banner */}
          <div className="p-2.5 sm:p-3 bg-amber-50/80 border-t border-amber-200 text-[11px] sm:text-xs text-slate-800 flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
            <span className="font-bold text-amber-900 shrink-0 uppercase tracking-wide">Số tiền bằng chữ:</span>
            <span className="italic font-medium text-slate-900">{readMoneyInWords(result.tongChiPhi)}</span>
          </div>
        </div>

        {/* RIGHT COLUMN: Reference Tables (Bảng tra hệ số & đơn giá) - Hidden on mobile */}
        <div className="hidden lg:block lg:col-span-4 space-y-5">
          
          {/* Lookup Table 1: Bảng tra hệ số móng */}
          <div className="bg-white border border-slate-300 shadow-xs rounded-lg overflow-hidden">
            <div className="bg-slate-800 text-white px-3.5 py-2 flex items-center justify-between">
              <div className="flex items-center gap-1.5 font-semibold text-xs tracking-wide">
                <Percent className="w-3.5 h-3.5 text-amber-400" />
                <span>BẢNG TRA HỆ SỐ MÓNG</span>
              </div>
              <span className="text-[11px] text-slate-300 font-mono">% diện tích</span>
            </div>
            
            <div className="divide-y divide-slate-200">
              {foundations.map((f) => {
                const isSelected = f.id === data.selectedFoundationId;
                return (
                  <div
                    key={f.id}
                    onClick={() => onChange({ selectedFoundationId: f.id })}
                    className={`flex items-center justify-between px-3.5 py-2.5 transition-colors cursor-pointer text-sm ${
                      isSelected
                        ? 'bg-amber-100/70 font-semibold text-amber-950 border-l-4 border-amber-500'
                        : 'hover:bg-slate-50 text-slate-800'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${isSelected ? 'bg-amber-600' : 'bg-slate-300'}`} />
                      <span>{f.name}</span>
                    </div>

                    {editingLookup ? (
                      <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                        <input
                          type="number"
                          value={f.percentage}
                          onChange={(e) => handleFoundationPercentageChange(f.id, parseInt(e.target.value, 10) || 0)}
                          className="w-16 text-right px-1.5 py-0.5 border border-slate-300 rounded font-bold text-sm bg-white"
                        />
                        <span className="text-xs text-slate-500">%</span>
                      </div>
                    ) : (
                      <div className="text-right font-bold text-slate-900">
                        {f.percentage} <span className="text-xs text-slate-500 font-normal">%</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
            
            <div className="p-2.5 bg-slate-50 border-t border-slate-200 text-xs text-slate-500 flex items-center gap-1.5">
              <Info className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span>Click vào loại móng để áp dụng ngay vào bảng tính bên trái.</span>
            </div>
          </div>

          {/* Lookup Table 2: Bảng tra đơn giá mái */}
          <div className="bg-white border border-slate-300 shadow-xs rounded-lg overflow-hidden">
            <div className="bg-slate-800 text-white px-3.5 py-2 flex items-center justify-between">
              <div className="flex items-center gap-1.5 font-semibold text-xs tracking-wide">
                <Calculator className="w-3.5 h-3.5 text-amber-400" />
                <span>BẢNG TRA ĐƠN GIÁ MÁI</span>
              </div>
              <span className="text-[11px] text-slate-300 font-mono">đ / m²</span>
            </div>
            
            <div className="divide-y divide-slate-200">
              {roofs.map((r) => {
                const isSelected = r.id === data.selectedRoofId;
                return (
                  <div
                    key={r.id}
                    onClick={() => onChange({ selectedRoofId: r.id })}
                    className={`flex items-center justify-between px-3.5 py-2.5 transition-colors cursor-pointer text-sm ${
                      isSelected
                        ? 'bg-amber-100/70 font-semibold text-amber-950 border-l-4 border-amber-500'
                        : 'hover:bg-slate-50 text-slate-800'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${isSelected ? 'bg-amber-600' : 'bg-slate-300'}`} />
                      <span>{r.name}</span>
                    </div>

                    {editingLookup ? (
                      <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                        <input
                          type="text"
                          value={formatVND(r.unitPrice)}
                          onChange={(e) => {
                            const raw = e.target.value.replace(/\D/g, '');
                            handleRoofPriceChange(r.id, parseInt(raw, 10) || 0);
                          }}
                          className="w-24 text-right px-1.5 py-0.5 border border-slate-300 rounded font-bold text-sm bg-white"
                        />
                        <span className="text-xs text-slate-500">đ</span>
                      </div>
                    ) : (
                      <div className="text-right font-bold italic text-slate-900">
                        {formatVND(r.unitPrice)} <span className="text-xs text-slate-500 not-italic font-normal">đ</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
            
            <div className="p-2.5 bg-slate-50 border-t border-slate-200 text-xs text-slate-500 flex items-center gap-1.5">
              <Info className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span>Click vào loại mái để chọn cho công trình.</span>
            </div>
          </div>

          {/* Quick formula summary box */}
          <div className="bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 rounded-lg p-3.5 text-xs text-amber-950 space-y-2">
            <div className="font-bold text-amber-900 flex items-center gap-1.5">
              <HelpCircle className="w-4 h-4 text-amber-600" />
              Công thức diện tích quy đổi:
            </div>
            <p className="font-mono text-[11px] bg-white/80 p-2 rounded border border-amber-200 text-slate-800 leading-relaxed">
              Tổng DT = (Sàn trệt × Số tầng) + DT thêm + Mái BTCT + Móng
              <br />
              = ({data.dienTichXayDung} × {data.soTang}) + {data.dienTichThem} + {formatArea(result.dienTichMaiBtct)} + {formatArea(result.dienTichMong)}
              <br />
              = <strong className="text-amber-800">{formatArea(result.tongDienTich)} m²</strong>
            </p>
          </div>

        </div>

      </div>
    </div>
  );
};
