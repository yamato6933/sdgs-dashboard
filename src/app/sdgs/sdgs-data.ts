// SDGs目標の共通データ
export interface SdgsGoal {
  id: number;
  title: string;
  color: string;
  bgColor: string;
  description: string;
}

export const SDGS_GOALS: SdgsGoal[] = [
  {
    id: 1,
    title: "貧困をなくそう",
    color: "#E5243B",
    bgColor: "bg-red-500",
    description: "あらゆる場所のあらゆる形態の貧困を終わらせる"
  },
  {
    id: 2,
    title: "飢餓をゼロに",
    color: "#DDA63A",
    bgColor: "bg-yellow-600",
    description: "飢餓を終わらせ、食料安全保障及び栄養改善を実現し、持続可能な農業を促進する"
  },
  {
    id: 3,
    title: "すべての人に健康と福祉を",
    color: "#4C9F38",
    bgColor: "bg-green-500",
    description: "あらゆる年齢のすべての人々の健康的な生活を確保し、福祉を促進する"
  },
  {
    id: 4,
    title: "質の高い教育をみんなに",
    color: "#C5192D",
    bgColor: "bg-red-600",
    description: "すべての人に包摂的かつ公正な質の高い教育を確保し、生涯学習の機会を促進する"
  },
  {
    id: 5,
    title: "ジェンダー平等を実現しよう",
    color: "#FF3A21",
    bgColor: "bg-orange-500",
    description: "ジェンダー平等を達成し、すべての女性及び女児の能力強化を行う"
  },
  {
    id: 6,
    title: "安全な水とトイレを世界中に",
    color: "#26BDE2",
    bgColor: "bg-blue-400",
    description: "すべての人々の水と衛生の利用可能性と持続可能な管理を確保する"
  },
  {
    id: 7,
    title: "エネルギーをみんなに そしてクリーンに",
    color: "#FCC30B",
    bgColor: "bg-yellow-500",
    description: "すべての人々の、安価かつ信頼できる持続可能な近代的エネルギーへのアクセスを確保する"
  },
  {
    id: 8,
    title: "働きがいも経済成長も",
    color: "#A21942",
    bgColor: "bg-red-700",
    description: "包摂的かつ持続可能な経済成長及びすべての人々の完全かつ生産的な雇用と働きがいのある人間らしい雇用を促進する"
  },
  {
    id: 9,
    title: "産業と技術革新の基盤をつくろう",
    color: "#FD6925",
    bgColor: "bg-orange-600",
    description: "強靱なインフラ構築、包摂的かつ持続可能な産業化の促進及び技術革新の推進を図る"
  },
  {
    id: 10,
    title: "人や国の不平等をなくそう",
    color: "#DD1367",
    bgColor: "bg-pink-500",
    description: "各国内及び各国間の不平等を是正する"
  },
  {
    id: 11,
    title: "住み続けられるまちづくりを",
    color: "#FD9D24",
    bgColor: "bg-yellow-700",
    description: "包摂的で安全かつ強靱で持続可能な都市及び人間居住を実現する"
  },
  {
    id: 12,
    title: "つくる責任 つかう責任",
    color: "#BF8B2E",
    bgColor: "bg-orange-700",
    description: "持続可能な生産消費形態を確保する"
  },
  {
    id: 13,
    title: "気候変動に具体的な対策を",
    color: "#3F7E44",
    bgColor: "bg-green-600",
    description: "気候変動及びその影響を軽減するための緊急対策を講じる"
  },
  {
    id: 14,
    title: "海の豊かさを守ろう",
    color: "#0A97D9",
    bgColor: "bg-blue-500",
    description: "持続可能な開発のために海洋・海洋資源を保全し、持続可能な形で利用する"
  },
  {
    id: 15,
    title: "陸の豊かさも守ろう",
    color: "#56C02B",
    bgColor: "bg-green-700",
    description: "陸域生態系の保護、回復、持続可能な利用の促進、持続可能な森林の経営、砂漠化への対処ならびに土地の劣化の阻止・回復及び生物多様性の損失を阻止する"
  },
  {
    id: 16,
    title: "平和と公正をすべての人に",
    color: "#00689D",
    bgColor: "bg-blue-600",
    description: "持続可能な開発のための平和で包摂的な社会を促進し、すべての人々に司法へのアクセスを提供し、あらゆるレベルにおいて効果的で説明責任のある包摂的な制度を構築する"
  },
  {
    id: 17,
    title: "パートナーシップで目標を達成しよう",
    color: "#19486A",
    bgColor: "bg-blue-700",
    description: "持続可能な開発のための実施手段を強化し、グローバル・パートナーシップを活性化する"
  }
];

// 特定の形式でデータを取得するヘルパー関数
export function getSdgsGoalsForChart() {
  return SDGS_GOALS.map(goal => ({
    id: goal.id,
    title: goal.title,
    color: goal.color
  }));
}

export function getSdgsGoalsForUI() {
  return SDGS_GOALS.map(goal => ({
    id: goal.id,
    title: goal.title,
    color: goal.bgColor,
    description: goal.description
  }));
}