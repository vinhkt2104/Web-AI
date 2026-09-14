import React, { useState } from 'react';
import {
  Building,
  Home,
  HelpCircle,
  Phone,
} from 'lucide-react';
import { EstimationData, FoundationOption, RoofOption, ProjectInfo } from './types';
import { calculateEstimation } from './utils/formatters';
import { DEFAULT_FOUNDATIONS, DEFAULT_ROOFS, PRESETS } from './data/defaultPresets';
import { ExcelSheetView } from './components/ExcelSheetView';
import { CustomItemsSection } from './components/CustomItemsSection';
import { QuotationPrintView } from './components/QuotationPrintView';
import { CostAnalysisCard } from './components/CostAnalysisCard';

export default function App() {
  // Main estimation state initialized to match the user's Excel screenshot exactly
  const [data, setData] = useState<EstimationData>(PRESETS[0].data);
  const [foundations, setFoundations] = useState<FoundationOption[]>(DEFAULT_FOUNDATIONS);
  const [roofs, setRoofs] = useState<RoofOption[]>(DEFAULT_ROOFS);

  // View state: 'excel' | 'print'
  const [activeView, setActiveView] = useState<'excel' | 'print'>('excel');

  // Project Info for formal quotation
  const [projectInfo, setProjectInfo] = useState<ProjectInfo>({
    projectName: 'Nhà phố 2 tầng hiện đại 66m²',
    clientName: 'Anh/Chị Chủ Đầu Tư',
    location: 'TP. Hồ Chí Minh / Hà Nội',
    date: new Date().toLocaleDateString('vi-VN'),
    contractorName: 'CÔNG TY THI CÔNG XÂY DỰNG & KIẾN TRÚC',
    contactPhone: '0988.xxx.xxx',
  });

  // Calculate live estimation results
  const result = calculateEstimation(data, foundations, roofs);

  // Update helper
  const handleDataChange = (updated: Partial<EstimationData>) => {
    setData((prev) => ({ ...prev, ...updated }));
  };

  // Reset to original Excel template
  const handleResetToExcel = () => {
    setData(PRESETS[0].data);
    setFoundations(DEFAULT_FOUNDATIONS);
    setRoofs(DEFAULT_ROOFS);
  };

  // Select preset
  const handleSelectPreset = (presetId: string) => {
    const selected = PRESETS.find((p) => p.id === presetId);
    if (selected) {
      setData(selected.data);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 font-sans">
      
      {/* Top Application Header (Hidden in print) */}
      <header className="print:hidden bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 gap-3">
            
            {/* Logo and App Title */}
            <div className="flex items-center gap-2.5 sm:gap-3">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-amber-500 flex items-center justify-center text-slate-950 shadow-xs shrink-0">
                <Home className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <div>
                <h1 className="text-base sm:text-lg lg:text-xl font-black tracking-tight text-slate-900 leading-tight">
                  DỰ TOÁN XÂY DỰNG
                </h1>
              </div>
            </div>

            {/* Thay vào đó là NguyenVinh-0917.382.147 */}
            <div className="flex items-center">
              <a
                id="contact-nguyenvinh-header"
                href="tel:0917382147"
                className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-4 py-1.5 sm:py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold text-xs sm:text-sm rounded-lg shadow-xs transition-colors"
                title="Liên hệ NguyenVinh: 0917.382.147"
              >
                <Phone className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-950 shrink-0" />
                <span className="tracking-tight sm:tracking-normal">NguyenVinh-0917.382.147</span>
              </a>
            </div>

          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8 py-2 sm:py-6 space-y-4 sm:space-y-6">
        
        {/* Preset Selector Banner (Hidden on mobile & in print) */}
        {activeView === 'excel' && (
          <div className="print:hidden hidden sm:flex bg-white p-3.5 rounded-lg border border-slate-200 shadow-xs flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-xs text-slate-700 font-medium">
              <Building className="w-4 h-4 text-amber-600 shrink-0" />
              <span>Chọn mẫu công trình nhanh:</span>
            </div>

            <div className="flex flex-wrap items-center gap-1.5">
              {PRESETS.map((p) => {
                const isActive = data.dienTichXayDung === p.data.dienTichXayDung && data.soTang === p.data.soTang;
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => handleSelectPreset(p.id)}
                    className={`text-xs px-2.5 py-1 rounded transition-colors font-medium ${
                      isActive
                        ? 'bg-amber-500 text-slate-950 font-bold shadow-xs'
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300'
                    }`}
                  >
                    {p.name.split(' (')[0]}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Cost Analysis / KPI Cards (Hidden on mobile & in print) */}
        {activeView === 'excel' && (
          <div className="print:hidden hidden sm:block">
            <CostAnalysisCard data={data} result={result} />
          </div>
        )}

        {/* Main Content Area */}
        {activeView === 'excel' ? (
          <div className="space-y-4 sm:space-y-6">
            {/* Primary Excel Sheet View */}
            <ExcelSheetView
              data={data}
              onChange={handleDataChange}
              result={result}
              foundations={foundations}
              onUpdateFoundations={setFoundations}
              roofs={roofs}
              onUpdateRoofs={setRoofs}
            />

            {/* Custom Extra Items Section (Hidden on mobile) */}
            <div className="hidden sm:block">
              <CustomItemsSection
                items={data.customItems || []}
                onChange={(items) => handleDataChange({ customItems: items })}
              />
            </div>

            {/* Explanatory Guide Box (Hidden on mobile) */}
            <div className="hidden sm:block bg-white rounded-lg border border-slate-200 p-5 shadow-xs text-xs text-slate-600 space-y-3">
              <div className="flex items-center gap-2 font-bold text-slate-800 text-sm">
                <HelpCircle className="w-4 h-4 text-amber-600" />
                Hướng dẫn cách tính & Quy ước chuẩn trong ngành xây dựng:
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 leading-relaxed">
                <div className="p-3 bg-slate-50 rounded border border-slate-200">
                  <span className="font-bold text-slate-800 block mb-1">1. Phần Móng Công Trình:</span>
                  Tính bằng % diện tích sàn trệt. Móng đơn (30%), móng cọc (40%), móng băng (50%), móng bè (80%). Tùy điều kiện địa chất để lựa chọn móng phù hợp.
                </div>
                <div className="p-3 bg-slate-50 rounded border border-slate-200">
                  <span className="font-bold text-slate-800 block mb-1">2. Phần Sàn & Mái BTCT:</span>
                  Sàn các tầng tính 100% diện tích sàn. Mái bê tông cốt thép thường tính 30% diện tích sàn trệt. Ban công, thông tầng có thể đưa vào ô "Diện tích thêm".
                </div>
                <div className="p-3 bg-slate-50 rounded border border-slate-200">
                  <span className="font-bold text-slate-800 block mb-1">3. Đơn Giá & Phần Mái:</span>
                  Đơn giá xây dựng thông thường gồm nhân công + vật tư thô hoặc trọn gói. Mái tôn hoặc ngói tính riêng theo đơn giá m² bảng tra tương ứng.
                </div>
              </div>
            </div>
          </div>
        ) : (
          <QuotationPrintView
            data={data}
            result={result}
            foundations={foundations}
            roofs={roofs}
            projectInfo={projectInfo}
            onUpdateProjectInfo={(info) => setProjectInfo((prev) => ({ ...prev, ...info }))}
            onClose={() => setActiveView('excel')}
          />
        )}

      </main>
      
      {/* Footer (Hidden on mobile & in print) */}
      <footer className="print:hidden hidden sm:block border-t border-slate-200 bg-white py-4 mt-12 text-center text-xs text-slate-500">
        <p>Ứng dụng Dự Toán Xây Dựng • Đồng bộ công thức bảng tính Excel tự động 100%</p>
      </footer>

    </div>
  );
}
