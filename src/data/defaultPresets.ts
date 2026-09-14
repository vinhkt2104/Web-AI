import { EstimationData, FoundationOption, MaiBtctOption, RoofOption } from '../types';

export const DEFAULT_MAI_BTCT_OPTIONS: MaiBtctOption[] = [
  { id: 'mai_btct_30', name: 'Mái bê tông cốt thép', percentage: 30 },
  { id: 'mai_btct_50', name: 'Mái BTCT có chống nóng lát gạch tường bao', percentage: 50 },
];

export const DEFAULT_FOUNDATIONS: FoundationOption[] = [
  { id: 'mong_don', name: 'Móng đơn', percentage: 30 },
  { id: 'mong_bang', name: 'Móng băng', percentage: 50 },
  { id: 'mong_coc', name: 'Móng cọc', percentage: 40 },
  { id: 'mong_be', name: 'Móng bè', percentage: 80 },
];

export const DEFAULT_ROOFS: RoofOption[] = [
  { id: 'mai_ngoi', name: 'Mái ngói', unitPrice: 650000 },
  { id: 'mai_ton', name: 'Mái tôn', unitPrice: 500000 },
  { id: 'mai_kinh', name: 'Mái kính cường lực', unitPrice: 1200000 },
  { id: 'khong_tinh', name: 'Không tính thêm tiền mái', unitPrice: 0 },
];

export interface ProjectPreset {
  id: string;
  name: string;
  description: string;
  data: EstimationData;
}

export const PRESETS: ProjectPreset[] = [
  {
    id: 'excel_sample',
    name: 'Mẫu chuẩn trong ảnh Excel (66m² x 2 tầng)',
    description: 'Nhà 2 tầng 66m², DT thêm 23m², móng băng 50%, mái tôn 66m², đơn giá 5.5tr',
    data: {
      dienTichXayDung: 66,
      soTang: 2,
      dienTichThem: 23,
      maiBtctRate: 30,
      selectedFoundationId: 'mong_bang',
      donGiaXayDung: 5500000,
      sanVuonDienTich: 0,
      sanVuonDonGia: 1000000,
      cocChieuDai: 0,
      cocDonGia: 250000,
      selectedRoofId: 'mai_ton',
      customRoofArea: 66,
      chiPhiPhatSinh: 20000000,
      customItems: [],
    },
  },
  {
    id: 'nha_pho_3_tang',
    name: 'Nhà phố 3 tầng (75m² x 3 tầng)',
    description: 'Nhà phố 5x15m, 3 tầng, móng cọc 40%, mái ngói, đơn giá trọn gói 6.2tr',
    data: {
      dienTichXayDung: 75,
      soTang: 3,
      dienTichThem: 25,
      maiBtctRate: 50,
      selectedFoundationId: 'mong_coc',
      donGiaXayDung: 6200000,
      sanVuonDienTich: 20,
      sanVuonDonGia: 1000000,
      cocChieuDai: 120,
      cocDonGia: 250000,
      selectedRoofId: 'mai_ngoi',
      customRoofArea: 75,
      chiPhiPhatSinh: 30000000,
      customItems: [
        {
          id: 'preset_extra_1',
          name: 'Hố ga & bể phốt tự hoại',
          unit: 'cái',
          quantity: 1,
          unitPrice: 12000000,
        },
      ],
    },
  },
  {
    id: 'nha_cap_4',
    name: 'Nhà cấp 4 mái tôn / mái Thái (100m²)',
    description: 'Nhà vườn 1 tầng 100m², móng đơn 30%, mái tôn, sân vườn rộng',
    data: {
      dienTichXayDung: 100,
      soTang: 1,
      dienTichThem: 10,
      maiBtctRate: 30,
      selectedFoundationId: 'mong_don',
      donGiaXayDung: 4800000,
      sanVuonDienTich: 50,
      sanVuonDonGia: 850000,
      cocChieuDai: 0,
      cocDonGia: 250000,
      selectedRoofId: 'mai_ton',
      customRoofArea: 100,
      chiPhiPhatSinh: 15000000,
      customItems: [],
    },
  },
  {
    id: 'biet_thu_vuon',
    name: 'Biệt thự tân cổ điển 2 tầng (120m²)',
    description: 'Biệt thự 120m² x 2 tầng, móng bè 80%, mái ngói cao cấp, hoàn thiện VIP',
    data: {
      dienTichXayDung: 120,
      soTang: 2,
      dienTichThem: 40,
      maiBtctRate: 50,
      selectedFoundationId: 'mong_be',
      donGiaXayDung: 7200000,
      sanVuonDienTich: 80,
      sanVuonDonGia: 1200000,
      cocChieuDai: 0,
      cocDonGia: 250000,
      selectedRoofId: 'mai_ngoi',
      customRoofArea: 135,
      chiPhiPhatSinh: 50000000,
      customItems: [
        {
          id: 'preset_extra_villa',
          name: 'Cổng nhôm đúc mỹ thuật & tường rào',
          unit: 'gói',
          quantity: 1,
          unitPrice: 65000000,
        }
      ],
    },
  }
];
