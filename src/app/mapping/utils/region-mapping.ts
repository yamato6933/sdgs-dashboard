export interface RegionData {
  name: string;
  prefectures: string[];
  description: string;
}

export const REGIONS: RegionData[] = [
  {
    name: "北海道",
    prefectures: ["北海道"],
    description: "北海道地方"
  },
  {
    name: "東北",
    prefectures: ["青森県", "岩手県", "宮城県", "秋田県", "山形県", "福島県"],
    description: "東北地方"
  },
  {
    name: "関東",
    prefectures: ["茨城県", "栃木県", "群馬県", "埼玉県", "千葉県", "東京都", "神奈川県"],
    description: "関東地方"
  },
  {
    name: "中部",
    prefectures: ["新潟県", "富山県", "石川県", "福井県", "山梨県", "長野県", "岐阜県", "静岡県", "愛知県"],
    description: "中部地方"
  },
  {
    name: "近畿",
    prefectures: ["三重県", "滋賀県", "京都府", "大阪府", "兵庫県", "奈良県", "和歌山県"],
    description: "近畿地方"
  },
  {
    name: "中国",
    prefectures: ["鳥取県", "島根県", "岡山県", "広島県", "山口県"],
    description: "中国地方"
  },
  {
    name: "四国",
    prefectures: ["徳島県", "香川県", "愛媛県", "高知県"],
    description: "四国地方"
  },
  {
    name: "九州沖縄",
    prefectures: ["福岡県", "佐賀県", "長崎県", "熊本県", "大分県", "宮崎県", "鹿児島県", "沖縄県"],
    description: "九州・沖縄地方"
  }
];

//都道府県から地方を取得する
export function getRegionByPrefecture(prefecture:string): RegionData | null{
    return REGIONS.find(region => region.prefectures.includes(prefecture)) || null;
}

export function getPrefectureByRegion(regionName:string): string[]{
    const region = REGIONS.find(r => r.name ===regionName);
    return region ? region.prefectures: [];
}

export function getAllRegions():RegionData[]{
    return REGIONS;
}

