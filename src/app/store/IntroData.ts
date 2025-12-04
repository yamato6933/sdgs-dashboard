export const introData: IntroData[] = [
    {
        id: 1,
        title: "可視化モード",
        content: "日本全国の市区町村ごとのSDGs（持続可能な開発目標）の達成度をスコアとして可視化し、それぞれの地域における政策の効果や課題を一目で把握できるダッシュボードです。",
        subtitle1:"データ分析",
        subtitle2:"可視化",
        subtitle3:"AI考察",
        subtitle4:"政策提案",
        description1:"各市区町村のSDGsスコアを詳細に分析し、強みと改善点を特定します。",
        description2:"17の目標ごとの詳細な分析とレーダーチャート",
        description3:"AI技術を活用して、データに基づく洞察や考察を提供し、意思決定を支援します。",
        description4:"分析結果に基づき、各市区町村に適した具体的な政策提案を行います。",
        linkText:"ダッシュボードを見る",
        linkUrl:"/sdgs",
        pngUrl:"/sdgs_dashboard.png"
    },
    {
        id: 2,
        title: "政策効果と因果推論",
        content: "上位自治体の政策をAIで調査し、選択した政策の効果を類似群(対照群)と比較。2015年→2020年のスコア変化を用いたDiDで統計的に検証できます。",
        subtitle1:"AI政策調査",
        subtitle2:"類似群の自動選定",
        subtitle3:"因果推論分析",
        subtitle4:"効果の可視化",
        description1:"AIを活用して、上位自治体の成功事例や効果的な政策を自動で調査・抽出します。",
        description2:"2015年の全17ゴールからユークリッド距離で近い自治体を抽出",
        description3:"DiD手法を用いて、政策の因果効果を統計的に分析します。",
        description4:"政策実施前後のスコア変化をわかりやすくグラフで表示し、効果を直感的に理解できます。",
        linkText:"政策効果分析を見る",
        linkUrl:"/compare",
        pngUrl:"/policy_image.png"


    },
    {
        id: 3,
        title: "地域間比較モード",
        content: "複数の市区町村を選択し、SDGsスコアや政策効果を比較分析できるモードです。地域間の違いや共通点を把握し、効果的な政策立案に役立てます。",
        subtitle1:"マルチセレクト",
        subtitle2:"比較分析",
        subtitle3:"視覚化ツール",
        subtitle4:"インサイト抽出",
        description1:"複数の市区町村を同時に選択し、SDGsスコアや政策効果を比較できます。",
        description2:"選択した地域間でのスコアや政策効果の違いを詳細に分析します。",
        description3:"棒グラフやレーダーチャートなど、多様な視覚化ツールを提供し、比較結果をわかりやすく表示します。",
        description4:"比較分析から得られた洞察を基に、各地域に適した政策提案を行います。",
        linkText:"地域間比較を見る",
        linkUrl:"/compare",
        pngUrl:"/compare_image.png"
    },

     ];
export type IntroData = {
    id: number;
    title: string;
    content: string;
    subtitle1?: string;
    subtitle2?: string;
    subtitle3?: string;
    subtitle4?: string;
    description1?: string;
    description2?: string;
    description3?: string;
    description4?: string;
    linkText?: string;
    linkUrl?: string;
    pngUrl?: string;
};