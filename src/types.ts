export interface FoundationOption {
  id: string;
  name: string;
  percentage: number; // e.g. 50 for 50%
}

export interface MaiBtctOption {
  id: string;
  name: string;
  percentage: number; // 30 or 50
}

export interface RoofOption {
  id: string;
  name: string;
  unitPrice: number; // e.g. 500000 VND/m2
}

export interface AdditionalCostItem {
  id: string;
  name: string;
  unit: string;
  quantity: number;
  unitPrice: number;
  note?: string;
}

export interface EstimationData {
  // 1. Thông số đầu vào
  dienTichXayDung: number; // Ground floor area (m2) - e.g. 66
  soTang: number;          // Number of floors - e.g. 2
  dienTichThem: number;    // Extra area (balcony, etc.) - e.g. 23
  maiBtctRate: number;     // Reinforced concrete roof rate % - e.g. 50
  selectedFoundationId: string; // e.g. 'mong_bang'
  donGiaXayDung: number;   // Unit construction cost (VND/m2) - e.g. 5500000

  // 4. Sân vườn lát gạch
  sanVuonDienTich: number; // Area (m2) - e.g. 0
  sanVuonDonGia: number;   // Unit price (VND/m2) - e.g. 1000000

  // 5. Cọc bê tông
  cocChieuDai: number;     // Length (meters) - e.g. 0
  cocDonGia: number;       // Unit price (VND/m) - e.g. 250000

  // 6. Loại mái
  selectedRoofId: string;  // e.g. 'mai_ton'
  customRoofArea?: number; // Optional override, defaults to dienTichXayDung

  // 7. Chi phí phát sinh
  chiPhiPhatSinh: number;  // e.g. 20000000

  // Hạng mục bổ sung tùy chọn (người dùng thêm tự do)
  customItems: AdditionalCostItem[];
}

export interface ProjectInfo {
  projectName: string;
  clientName: string;
  location: string;
  date: string;
  contractorName: string;
  contactPhone: string;
}
