import React from 'react';
import { Printer, Download, ArrowLeft, Building2, User, MapPin, Calendar, Phone } from 'lucide-react';
import { EstimationData, FoundationOption, RoofOption, ProjectInfo } from '../types';
import { CalculationResult, formatArea, formatVND, readMoneyInWords } from '../utils/formatters';

interface QuotationPrintViewProps {
  data: EstimationData;
  result: CalculationResult;
  foundations: FoundationOption[];
  roofs: RoofOption[];
  projectInfo: ProjectInfo;
  onUpdateProjectInfo: (info: Partial<ProjectInfo>) => void;
  onClose: () => void;
}

export const QuotationPrintView: React.FC<QuotationPrintViewProps> = ({
  data,
  result,
  foundations,
  roofs,
  projectInfo,
  onUpdateProjectInfo,
  onClose,
}) => {
  const currentFoundation = foundations.find(f => f.id === data.selectedFoundationId) || foundations[0];
  const currentRoof = roofs.find(r => r.id === data.selectedRoofId) || roofs[0];

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Top Action Bar (hidden on print) */}
      <div className="print:hidden flex flex-wrap items-center justify-between gap-3 bg-white p-4 rounded-lg border border-slate-200 shadow-xs">
        <button
          type="button"
          onClick={onClose}
          className="flex items-center gap-1.5 text-sm font-medium text-slate-700 hover:text-slate-900 px-3 py-1.5 rounded-md hover:bg-slate-100 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Quay lại Bảng Tính</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handlePrint}
            className="flex items-center gap-2 px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-md font-medium text-sm transition-colors shadow-xs"
          >
            <Printer className="w-4 h-4" />
            <span>In / Xuất PDF Báo Giá</span>
          </button>
        </div>
      </div>

      {/* Printable Sheet */}
      <div className="bg-white p-8 md:p-12 rounded-lg border border-slate-300 shadow-sm max-w-4xl mx-auto print:border-none print:shadow-none print:p-0">
        
        {/* Header: Company & Title */}
        <div className="border-b-2 border-slate-800 pb-4 mb-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-xl font-bold uppercase tracking-wide text-slate-900">
                {projectInfo.contractorName || 'CÔNG TY TNHH THIẾT KẾ & XÂY DỰNG'}
              </h1>
              <p className="text-xs text-slate-600 mt-0.5">
                Hotline tư vấn: {projectInfo.contactPhone || '090x.xxx.xxx'} • Chuyên nghiệp - Uy tín - Chất lượng
              </p>
            </div>
            <div className="text-right text-xs text-slate-500 font-mono">
              Ngày lập: {projectInfo.date || new Date().toLocaleDateString('vi-VN')}
            </div>
          </div>

          <div className="mt-6 text-center">
            <h2 className="text-xl md:text-2xl font-black uppercase tracking-wider text-amber-900">
              BẢNG DỰ TOÁN KINH PHÍ XÂY DỰNG
            </h2>
            <p className="text-xs text-slate-500 italic mt-1">
              (Áp dụng theo phương pháp diện tích xây dựng quy đổi & đơn giá trọn gói)
            </p>
          </div>
        </div>

        {/* Project Info Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs bg-slate-50 p-4 rounded-md border border-slate-200 mb-6">
          <div>
            <span className="font-semibold text-slate-700">Tên công trình: </span>
            <input
              type="text"
              value={projectInfo.projectName}
              onChange={(e) => onUpdateProjectInfo({ projectName: e.target.value })}
              className="font-bold text-slate-900 bg-transparent border-b border-dashed border-slate-400 focus:outline-none print:border-none"
            />
          </div>
          <div>
            <span className="font-semibold text-slate-700">Chủ đầu tư: </span>
            <input
              type="text"
              value={projectInfo.clientName}
              onChange={(e) => onUpdateProjectInfo({ clientName: e.target.value })}
              className="font-bold text-slate-900 bg-transparent border-b border-dashed border-slate-400 focus:outline-none print:border-none"
            />
          </div>
          <div className="sm:col-span-2">
            <span className="font-semibold text-slate-700">Địa điểm xây dựng: </span>
            <input
              type="text"
              value={projectInfo.location}
              onChange={(e) => onUpdateProjectInfo({ location: e.target.value })}
              className="w-2/3 text-slate-900 bg-transparent border-b border-dashed border-slate-400 focus:outline-none print:border-none"
            />
          </div>
        </div>

        {/* Breakdown Table */}
        <div className="overflow-x-auto mb-6">
          <table className="w-full text-xs border-collapse border border-slate-400">
            <thead>
              <tr className="bg-amber-600 text-white text-center font-bold">
                <th className="border border-slate-400 p-2 w-10">STT</th>
                <th className="border border-slate-400 p-2 text-left">Nội Dung Công Việc / Hạng Mục</th>
                <th className="border border-slate-400 p-2 w-14">ĐVT</th>
                <th className="border border-slate-400 p-2 w-20">Khối Lượng</th>
                <th className="border border-slate-400 p-2 w-28 text-right">Đơn Giá (đ)</th>
                <th className="border border-slate-400 p-2 w-32 text-right">Thành Tiền (đ)</th>
              </tr>
            </thead>
            <tbody>
              {/* PHẦN I */}
              <tr className="bg-slate-100 font-bold">
                <td className="border border-slate-400 p-2 text-center">I</td>
                <td colSpan={4} className="border border-slate-400 p-2 text-slate-900 uppercase">
                  DIỆN TÍCH XÂY DỰNG QUY ĐỔI (SƠ BỘ)
                </td>
                <td className="border border-slate-400 p-2 text-right text-amber-900">
                  {formatVND(result.thanhTienSoBo)}
                </td>
              </tr>
              <tr>
                <td className="border border-slate-400 p-1.5 text-center">1</td>
                <td className="border border-slate-400 p-1.5">
                  Diện tích sàn các tầng ({data.soTang} tầng × {data.dienTichXayDung} m²)
                </td>
                <td className="border border-slate-400 p-1.5 text-center">m²</td>
                <td className="border border-slate-400 p-1.5 text-center font-medium">
                  {formatArea(result.dienTichSanCacTang)}
                </td>
                <td className="border border-slate-400 p-1.5 text-center text-slate-400">-</td>
                <td className="border border-slate-400 p-1.5 text-center text-slate-400">-</td>
              </tr>
              <tr>
                <td className="border border-slate-400 p-1.5 text-center">2</td>
                <td className="border border-slate-400 p-1.5">
                  Diện tích thêm (ban công, giếng trời, ...)
                </td>
                <td className="border border-slate-400 p-1.5 text-center">m²</td>
                <td className="border border-slate-400 p-1.5 text-center font-medium">
                  {formatArea(result.dienTichThem)}
                </td>
                <td className="border border-slate-400 p-1.5 text-center text-slate-400">-</td>
                <td className="border border-slate-400 p-1.5 text-center text-slate-400">-</td>
              </tr>
              <tr>
                <td className="border border-slate-400 p-1.5 text-center">3</td>
                <td className="border border-slate-400 p-1.5">
                  {data.maiBtctRate === 50
                    ? 'Mái BTCT có chống nóng lát gạch tường bao (50%)'
                    : 'Mái bê tông cốt thép (30%)'} ({data.dienTichXayDung} m² × {data.maiBtctRate}%)
                </td>
                <td className="border border-slate-400 p-1.5 text-center">m²</td>
                <td className="border border-slate-400 p-1.5 text-center font-medium">
                  {formatArea(result.dienTichMaiBtct)}
                </td>
                <td className="border border-slate-400 p-1.5 text-center text-slate-400">-</td>
                <td className="border border-slate-400 p-1.5 text-center text-slate-400">-</td>
              </tr>
              <tr>
                <td className="border border-slate-400 p-1.5 text-center">4</td>
                <td className="border border-slate-400 p-1.5">
                  {currentFoundation.name} hệ số {result.foundationPercentage}% ({data.dienTichXayDung} m² × {result.foundationPercentage}%)
                </td>
                <td className="border border-slate-400 p-1.5 text-center">m²</td>
                <td className="border border-slate-400 p-1.5 text-center font-medium">
                  {formatArea(result.dienTichMong)}
                </td>
                <td className="border border-slate-400 p-1.5 text-center text-slate-400">-</td>
                <td className="border border-slate-400 p-1.5 text-center text-slate-400">-</td>
              </tr>
              <tr className="bg-amber-50 font-semibold">
                <td className="border border-slate-400 p-1.5 text-center">-</td>
                <td className="border border-slate-400 p-1.5 text-amber-950">
                  Cộng tổng diện tích quy đổi & Đơn giá xây dựng
                </td>
                <td className="border border-slate-400 p-1.5 text-center">m²</td>
                <td className="border border-slate-400 p-1.5 text-center font-bold text-amber-900">
                  {formatArea(result.tongDienTich)}
                </td>
                <td className="border border-slate-400 p-1.5 text-right font-bold">
                  {formatVND(data.donGiaXayDung)}
                </td>
                <td className="border border-slate-400 p-1.5 text-right font-bold text-amber-900">
                  {formatVND(result.thanhTienSoBo)}
                </td>
              </tr>

              {/* PHẦN II */}
              <tr className="bg-slate-100 font-bold">
                <td className="border border-slate-400 p-2 text-center">II</td>
                <td colSpan={4} className="border border-slate-400 p-2 text-slate-900 uppercase">
                  CÁC HẠNG MỤC BỔ SUNG & HOÀN THIỆN
                </td>
                <td className="border border-slate-400 p-2 text-right text-amber-900">
                  {formatVND(result.thanhTienSanVuon + result.thanhTienCoc + result.thanhTienMai + result.chiPhiPhatSinh + result.thanhTienCustomItems)}
                </td>
              </tr>
              <tr>
                <td className="border border-slate-400 p-1.5 text-center">5</td>
                <td className="border border-slate-400 p-1.5">Sân vườn lát gạch hoàn thiện</td>
                <td className="border border-slate-400 p-1.5 text-center">m²</td>
                <td className="border border-slate-400 p-1.5 text-center">{data.sanVuonDienTich}</td>
                <td className="border border-slate-400 p-1.5 text-right">{formatVND(data.sanVuonDonGia)}</td>
                <td className="border border-slate-400 p-1.5 text-right font-medium">
                  {result.thanhTienSanVuon > 0 ? formatVND(result.thanhTienSanVuon) : '-'}
                </td>
              </tr>
              <tr>
                <td className="border border-slate-400 p-1.5 text-center">6</td>
                <td className="border border-slate-400 p-1.5">Ép cọc bê tông cốt thép gia cố móng</td>
                <td className="border border-slate-400 p-1.5 text-center">m dài</td>
                <td className="border border-slate-400 p-1.5 text-center">{data.cocChieuDai}</td>
                <td className="border border-slate-400 p-1.5 text-right">{formatVND(data.cocDonGia)}</td>
                <td className="border border-slate-400 p-1.5 text-right font-medium">
                  {result.thanhTienCoc > 0 ? formatVND(result.thanhTienCoc) : '-'}
                </td>
              </tr>
              <tr>
                <td className="border border-slate-400 p-1.5 text-center">7</td>
                <td className="border border-slate-400 p-1.5">
                  Phần lợp mái: {currentRoof.name}
                </td>
                <td className="border border-slate-400 p-1.5 text-center">m²</td>
                <td className="border border-slate-400 p-1.5 text-center">{result.roofArea}</td>
                <td className="border border-slate-400 p-1.5 text-right">{formatVND(result.roofUnitPrice)}</td>
                <td className="border border-slate-400 p-1.5 text-right font-medium">
                  {formatVND(result.thanhTienMai)}
                </td>
              </tr>
              <tr>
                <td className="border border-slate-400 p-1.5 text-center">8</td>
                <td className="border border-slate-400 p-1.5">Chi phí dự phòng phát sinh & thủ tục</td>
                <td className="border border-slate-400 p-1.5 text-center">gói</td>
                <td className="border border-slate-400 p-1.5 text-center">1</td>
                <td className="border border-slate-400 p-1.5 text-right">{formatVND(data.chiPhiPhatSinh)}</td>
                <td className="border border-slate-400 p-1.5 text-right font-medium">
                  {formatVND(data.chiPhiPhatSinh)}
                </td>
              </tr>

              {/* Custom Items if any */}
              {data.customItems && data.customItems.map((c, i) => (
                <tr key={c.id}>
                  <td className="border border-slate-400 p-1.5 text-center">{9 + i}</td>
                  <td className="border border-slate-400 p-1.5">{c.name}</td>
                  <td className="border border-slate-400 p-1.5 text-center">{c.unit}</td>
                  <td className="border border-slate-400 p-1.5 text-center">{c.quantity}</td>
                  <td className="border border-slate-400 p-1.5 text-right">{formatVND(c.unitPrice)}</td>
                  <td className="border border-slate-400 p-1.5 text-right font-medium">
                    {formatVND(c.quantity * c.unitPrice)}
                  </td>
                </tr>
              ))}

              {/* GRAND TOTAL */}
              <tr className="bg-amber-500 text-slate-950 font-black text-sm">
                <td colSpan={5} className="border border-slate-500 p-2.5 text-right uppercase tracking-wider">
                  TỔNG CỘNG CHI PHÍ XÂY DỰNG:
                </td>
                <td className="border border-slate-500 p-2.5 text-right text-base text-slate-950">
                  {formatVND(result.tongChiPhi)} đ
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Money in Words */}
        <div className="p-3 bg-slate-100 rounded border border-slate-300 text-xs mb-8">
          <span className="font-bold text-slate-800">Số tiền bằng chữ: </span>
          <span className="italic font-semibold text-slate-900">{readMoneyInWords(result.tongChiPhi)}</span>
        </div>

        {/* Signature Blocks */}
        <div className="grid grid-cols-2 text-center text-xs pt-4 gap-8">
          <div>
            <p className="font-bold uppercase text-slate-800">ĐẠI DIỆN CHỦ ĐẦU TƯ</p>
            <p className="text-slate-500 italic mt-0.5">(Ký và ghi rõ họ tên)</p>
            <div className="h-24"></div>
            <p className="font-bold text-slate-900">{projectInfo.clientName || '.....................................'}</p>
          </div>
          <div>
            <p className="font-bold uppercase text-slate-800">ĐẠI DIỆN ĐƠN VỊ THI CÔNG</p>
            <p className="text-slate-500 italic mt-0.5">(Ký, đóng dấu & ghi rõ họ tên)</p>
            <div className="h-24"></div>
            <p className="font-bold text-slate-900">{projectInfo.contractorName || '.....................................'}</p>
          </div>
        </div>

      </div>
    </div>
  );
};
