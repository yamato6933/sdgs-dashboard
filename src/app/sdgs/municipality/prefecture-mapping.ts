export function getPrefectureFromMunicipality(municipality: string): string {
  // 東京都特別区
  if (municipality.endsWith('区') && (
    municipality.includes('千代田') || municipality.includes('中央') || municipality.includes('港') ||
    municipality.includes('新宿') || municipality.includes('文京') || municipality.includes('台東') ||
    municipality.includes('墨田') || municipality.includes('江東') || municipality.includes('品川') ||
    municipality.includes('目黒') || municipality.includes('大田') || municipality.includes('世田谷') ||
    municipality.includes('渋谷') || municipality.includes('中野') || municipality.includes('杉並') ||
    municipality.includes('豊島') || municipality.includes('北') || municipality.includes('荒川') ||
    municipality.includes('板橋') || municipality.includes('練馬') || municipality.includes('足立') ||
    municipality.includes('葛飾') || municipality.includes('江戸川')
  )) {
    return '東京都';
  }

  // 北海道（札幌、函館など主要都市）
  if (municipality.includes('札幌') || municipality.includes('函館') || municipality.includes('旭川') || 
      municipality.includes('室蘭') || municipality.includes('釧路') || municipality.includes('帯広') ||
      municipality.includes('北見') || municipality.includes('夕張') || municipality.includes('岩見沢') ||
      municipality.includes('網走') || municipality.includes('留萌') || municipality.includes('苫小牧') ||
      municipality.includes('稚内') || municipality.includes('美唄') || municipality.includes('芦別') ||
      municipality.includes('江別') || municipality.includes('赤平') || municipality.includes('紋別') ||
      municipality.includes('士別') || municipality.includes('名寄') || municipality.includes('三笠') ||
      municipality.includes('根室') || municipality.includes('千歳') || municipality.includes('滝川') ||
      municipality.includes('砂川') || municipality.includes('歌志内') || municipality.includes('深川') ||
      municipality.includes('富良野') || municipality.includes('登別') || municipality.includes('恵庭') ||
      municipality.includes('伊達') || municipality.includes('北広島') || municipality.includes('石狩') ||
      municipality.includes('北斗')) {
    return '北海道';
  }

  // 神奈川県
  if (municipality.includes('横浜') || municipality.includes('川崎') || municipality.includes('相模原') ||
      municipality.includes('横須賀') || municipality.includes('平塚') || municipality.includes('鎌倉') ||
      municipality.includes('藤沢') || municipality.includes('小田原') || municipality.includes('茅ヶ崎') ||
      municipality.includes('逗子') || municipality.includes('厚木') || municipality.includes('大和') ||
      municipality.includes('海老名') || municipality.includes('座間') || municipality.includes('綾瀬')) {
    return '神奈川県';
  }

  // 大阪府
  if (municipality.includes('大阪') || municipality.includes('堺') || municipality.includes('岸和田') ||
      municipality.includes('豊中') || municipality.includes('池田') || municipality.includes('吹田') ||
      municipality.includes('泉大津') || municipality.includes('高槻') || municipality.includes('貝塚') ||
      municipality.includes('守口') || municipality.includes('枚方') || municipality.includes('茨木') ||
      municipality.includes('八尾') || municipality.includes('泉佐野') || municipality.includes('富田林') ||
      municipality.includes('寝屋川') || municipality.includes('河内長野') || municipality.includes('松原') ||
      municipality.includes('大東') || municipality.includes('和泉') || municipality.includes('箕面') ||
      municipality.includes('柏原') || municipality.includes('羽曳野') || municipality.includes('門真') ||
      municipality.includes('摂津') || municipality.includes('高石') || municipality.includes('藤井寺') ||
      municipality.includes('東大阪') || municipality.includes('泉南') || municipality.includes('四條畷') ||
      municipality.includes('交野') || municipality.includes('大阪狭山') || municipality.includes('阪南')) {
    return '大阪府';
  }

  // 愛知県
  if (municipality.includes('名古屋') || municipality.includes('豊橋') || municipality.includes('岡崎') ||
      municipality.includes('一宮') || municipality.includes('瀬戸') || municipality.includes('半田') ||
      municipality.includes('春日井') || municipality.includes('豊川') || municipality.includes('津島') ||
      municipality.includes('碧南') || municipality.includes('刈谷') || municipality.includes('豊田') ||
      municipality.includes('安城') || municipality.includes('西尾') || municipality.includes('蒲郡') ||
      municipality.includes('犬山') || municipality.includes('常滑') || municipality.includes('江南') ||
      municipality.includes('小牧') || municipality.includes('稲沢') || municipality.includes('新城') ||
      municipality.includes('東海') || municipality.includes('大府') || municipality.includes('知多') ||
      municipality.includes('知立') || municipality.includes('尾張旭') || municipality.includes('高浜') ||
      municipality.includes('岩倉') || municipality.includes('豊明') || municipality.includes('日進') ||
      municipality.includes('田原') || municipality.includes('愛西') || municipality.includes('清須') ||
      municipality.includes('北名古屋') || municipality.includes('弥富') || municipality.includes('みよし') ||
      municipality.includes('あま') || municipality.includes('長久手')) {
    return '愛知県';
  }

  // 埼玉県
  if (municipality.includes('さいたま') || municipality.includes('川越') || municipality.includes('熊谷') ||
      municipality.includes('川口') || municipality.includes('行田') || municipality.includes('秩父') ||
      municipality.includes('所沢') || municipality.includes('飯能') || municipality.includes('加須') ||
      municipality.includes('本庄') || municipality.includes('東松山') || municipality.includes('春日部') ||
      municipality.includes('狭山') || municipality.includes('羽生') || municipality.includes('鴻巣') ||
      municipality.includes('深谷') || municipality.includes('上尾') || municipality.includes('草加') ||
      municipality.includes('越谷') || municipality.includes('蕨') || municipality.includes('戸田') ||
      municipality.includes('入間') || municipality.includes('朝霞') || municipality.includes('志木') ||
      municipality.includes('和光') || municipality.includes('新座') || municipality.includes('桶川') ||
      municipality.includes('久喜') || municipality.includes('北本') || municipality.includes('八潮') ||
      municipality.includes('富士見') || municipality.includes('三郷') || municipality.includes('蓮田') ||
      municipality.includes('坂戸') || municipality.includes('幸手') || municipality.includes('鶴ヶ島') ||
      municipality.includes('日高') || municipality.includes('吉川') || municipality.includes('ふじみ野') ||
      municipality.includes('白岡')) {
    return '埼玉県';
  }

  // 千葉県
  if (municipality.includes('千葉') || municipality.includes('銚子') || municipality.includes('市川') ||
      municipality.includes('船橋') || municipality.includes('館山') || municipality.includes('木更津') ||
      municipality.includes('松戸') || municipality.includes('野田') || municipality.includes('茂原') ||
      municipality.includes('成田') || municipality.includes('佐倉') || municipality.includes('東金') ||
      municipality.includes('旭') || municipality.includes('習志野') || municipality.includes('柏') ||
      municipality.includes('勝浦') || municipality.includes('市原') || municipality.includes('流山') ||
      municipality.includes('八千代') || municipality.includes('我孫子') || municipality.includes('鴨川') ||
      municipality.includes('鎌ケ谷') || municipality.includes('君津') || municipality.includes('富津') ||
      municipality.includes('浦安') || municipality.includes('四街道') || municipality.includes('袖ケ浦') ||
      municipality.includes('八街') || municipality.includes('印西') || municipality.includes('白井') ||
      municipality.includes('富里') || municipality.includes('南房総') || municipality.includes('匝瑳') ||
      municipality.includes('香取') || municipality.includes('山武') || municipality.includes('いすみ') ||
      municipality.includes('大網白里')) {
    return '千葉県';
  }

  // 兵庫県
  if (municipality.includes('神戸') || municipality.includes('姫路') || municipality.includes('尼崎') ||
      municipality.includes('明石') || municipality.includes('西宮') || municipality.includes('洲本') ||
      municipality.includes('芦屋') || municipality.includes('伊丹') || municipality.includes('相生') ||
      municipality.includes('豊岡') || municipality.includes('加古川') || municipality.includes('赤穂') ||
      municipality.includes('西脇') || municipality.includes('宝塚') || municipality.includes('三木') ||
      municipality.includes('高砂') || municipality.includes('川西') || municipality.includes('小野') ||
      municipality.includes('三田') || municipality.includes('加西') || municipality.includes('篠山') ||
      municipality.includes('養父') || municipality.includes('丹波') || municipality.includes('南あわじ') ||
      municipality.includes('朝来') || municipality.includes('淡路') || municipality.includes('宍粟') ||
      municipality.includes('加東') || municipality.includes('たつの') || municipality.includes('播磨') ||
      municipality.includes('猪名川') || municipality.includes('多可') || municipality.includes('稲美') ||
      municipality.includes('市川') || municipality.includes('福崎') || municipality.includes('神河') ||
      municipality.includes('太子') || municipality.includes('上郡') || municipality.includes('佐用') ||
      municipality.includes('香美') || municipality.includes('新温泉')) {
    return '兵庫県';
  }

  // 福岡県
  if (municipality.includes('福岡') || municipality.includes('北九州') || municipality.includes('久留米') ||
      municipality.includes('直方') || municipality.includes('飯塚') || municipality.includes('田川') ||
      municipality.includes('柳川') || municipality.includes('八女') || municipality.includes('筑後') ||
      municipality.includes('大川') || municipality.includes('行橋') || municipality.includes('豊前') ||
      municipality.includes('中間') || municipality.includes('小郡') || municipality.includes('筑紫野') ||
      municipality.includes('春日') || municipality.includes('大野城') || municipality.includes('宗像') ||
      municipality.includes('太宰府') || municipality.includes('古賀') || municipality.includes('福津') ||
      municipality.includes('うきは') || municipality.includes('宮若') || municipality.includes('嘉麻') ||
      municipality.includes('朝倉') || municipality.includes('みやま') || municipality.includes('糸島')) {
    return '福岡県';
  }

  // 静岡県
  if (municipality.includes('静岡') || municipality.includes('浜松') || municipality.includes('沼津') ||
      municipality.includes('熱海') || municipality.includes('三島') || municipality.includes('富士宮') ||
      municipality.includes('伊東') || municipality.includes('島田') || municipality.includes('富士') ||
      municipality.includes('磐田') || municipality.includes('焼津') || municipality.includes('掛川') ||
      municipality.includes('藤枝') || municipality.includes('御殿場') || municipality.includes('袋井') ||
      municipality.includes('下田') || municipality.includes('裾野') || municipality.includes('湖西') ||
      municipality.includes('伊豆') || municipality.includes('御前崎') || municipality.includes('菊川') ||
      municipality.includes('伊豆の国') || municipality.includes('牧之原')) {
    return '静岡県';
  }

  // 茨城県
  if (municipality.includes('水戸') || municipality.includes('日立') || municipality.includes('土浦') ||
      municipality.includes('古河') || municipality.includes('石岡') || municipality.includes('結城') ||
      municipality.includes('龍ケ崎') || municipality.includes('下妻') || municipality.includes('常総') ||
      municipality.includes('常陸太田') || municipality.includes('高萩') || municipality.includes('北茨城') ||
      municipality.includes('笠間') || municipality.includes('取手') || municipality.includes('牛久') ||
      municipality.includes('つくば') || municipality.includes('ひたちなか') || municipality.includes('鹿嶋') ||
      municipality.includes('潮来') || municipality.includes('守谷') || municipality.includes('常陸大宮') ||
      municipality.includes('那珂') || municipality.includes('筑西') || municipality.includes('坂東') ||
      municipality.includes('稲敷') || municipality.includes('かすみがうら') || municipality.includes('桜川') ||
      municipality.includes('神栖') || municipality.includes('行方') || municipality.includes('鉾田') ||
      municipality.includes('つくばみらい') || municipality.includes('小美玉')) {
    return '茨城県';
  }

  // 広島県
  if (municipality.includes('広島') || municipality.includes('呉') || municipality.includes('竹原') ||
      municipality.includes('三原') || municipality.includes('尾道') || municipality.includes('福山') ||
      municipality.includes('府中') || municipality.includes('三次') || municipality.includes('庄原') ||
      municipality.includes('大竹') || municipality.includes('東広島') || municipality.includes('廿日市') ||
      municipality.includes('安芸高田') || municipality.includes('江田島')) {
    return '広島県';
  }

  // 宮城県
  if (municipality.includes('仙台') || municipality.includes('石巻') || municipality.includes('塩竈') ||
      municipality.includes('気仙沼') || municipality.includes('白石') || municipality.includes('名取') ||
      municipality.includes('角田') || municipality.includes('多賀城') || municipality.includes('岩沼') ||
      municipality.includes('登米') || municipality.includes('栗原') || municipality.includes('東松島') ||
      municipality.includes('大崎') || municipality.includes('富谷')) {
    return '宮城県';
  }

  // 新潟県
  if (municipality.includes('新潟') || municipality.includes('長岡') || municipality.includes('三条') ||
      municipality.includes('柏崎') || municipality.includes('新発田') || municipality.includes('小千谷') ||
      municipality.includes('加茂') || municipality.includes('十日町') || municipality.includes('見附') ||
      municipality.includes('村上') || municipality.includes('燕') || municipality.includes('糸魚川') ||
      municipality.includes('妙高') || municipality.includes('五泉') || municipality.includes('上越') ||
      municipality.includes('阿賀野') || municipality.includes('佐渡') || municipality.includes('魚沼') ||
      municipality.includes('南魚沼') || municipality.includes('胎内')) {
    return '新潟県';
  }

  // 長野県
  if (municipality.includes('長野') || municipality.includes('松本') || municipality.includes('上田') ||
      municipality.includes('岡谷') || municipality.includes('飯田') || municipality.includes('諏訪') ||
      municipality.includes('須坂') || municipality.includes('小諸') || municipality.includes('伊那') ||
      municipality.includes('駒ヶ根') || municipality.includes('中野') || municipality.includes('大町') ||
      municipality.includes('飯山') || municipality.includes('茅野') || municipality.includes('塩尻') ||
      municipality.includes('佐久') || municipality.includes('千曲') || municipality.includes('東御') ||
      municipality.includes('安曇野')) {
    return '長野県';
  }

  // 京都府
  if (municipality.includes('京都') || municipality.includes('福知山') || municipality.includes('舞鶴') ||
      municipality.includes('綾部') || municipality.includes('宇治') || municipality.includes('宮津') ||
      municipality.includes('亀岡') || municipality.includes('城陽') || municipality.includes('向日') ||
      municipality.includes('長岡京') || municipality.includes('八幡') || municipality.includes('京田辺') ||
      municipality.includes('京丹後') || municipality.includes('南丹') || municipality.includes('木津川')) {
    return '京都府';
  }

  // 残りの都道府県（簡易判定）
  const prefectureMap: { [key: string]: string } = {
    '青森': '青森県', '盛岡': '岩手県', '秋田': '秋田県', '山形': '山形県', '福島': '福島県',
    '宇都宮': '栃木県', '前橋': '群馬県', '甲府': '山梨県', '岐阜': '岐阜県', '津': '三重県',
    '大津': '滋賀県', '奈良': '奈良県', '和歌山': '和歌山県', '鳥取': '鳥取県', '松江': '島根県',
    '岡山': '岡山県', '山口': '山口県', '徳島': '徳島県', '高松': '香川県', '松山': '愛媛県',
    '高知': '高知県', '佐賀': '佐賀県', '長崎': '長崎県', '熊本': '熊本県', '大分': '大分県',
    '宮崎': '宮崎県', '鹿児島': '鹿児島県', '那覇': '沖縄県', '富山': '富山県', '金沢': '石川県',
    '福井': '福井県'
  };

  for (const [key, prefecture] of Object.entries(prefectureMap)) {
    if (municipality.includes(key)) {
      return prefecture;
    }
  }

  // 特殊な地域名の個別マッピング（町村や特殊ケース）
  const specialMappings: { [key: string]: string } = {
    // 北海道の町村
    '音威子府村': '北海道', '中川町': '北海道', '幌加内町': '北海道', '旭川市': '北海道',
    
    // 青森県の町村
    '平内町': '青森県', '今別町': '青森県', '蓬田村': '青森県', '外ヶ浜町': '青森県',
    '鰺ヶ沢町': '青森県', '深浦町': '青森県', '西目屋村': '青森県', '藤崎町': '青森県',
    '大鰐町': '青森県', '田舎館村': '青森県', '板柳町': '青森県', '鶴田町': '青森県',
    '中泊町': '青森県', '野辺地町': '青森県', '七戸町': '青森県', '六戸町': '青森県',
    '横浜町': '青森県', '東北町': '青森県', '六ヶ所村': '青森県', 'おいらせ町': '青森県',
    '大間町': '青森県', '東通村': '青森県', '風間浦村': '青森県', '佐井村': '青森県',
    '三戸町': '青森県', '五戸町': '青森県', '田子町': '青森県', '南部町': '青森県',
    '階上町': '青森県', '新郷村': '青森県',
    
    // 兵庫県の町村
    '播磨町': '兵庫県', '稲美町': '兵庫県', '市川町': '兵庫県', '福崎町': '兵庫県',
    '神河町': '兵庫県', '太子町': '兵庫県', '上郡町': '兵庫県', '佐用町': '兵庫県',
    '香美町': '兵庫県', '新温泉町': '兵庫県', '猪名川町': '兵庫県', '多可町': '兵庫県',
    
    // 奈良県の町村
    '山添村': '奈良県', '平群町': '奈良県', '三郷町': '奈良県', '斑鳩町': '奈良県',
    '安堵町': '奈良県', '川西町': '奈良県', '三宅町': '奈良県', '田原本町': '奈良県',
    '曽爾村': '奈良県', '御杖村': '奈良県', '高取町': '奈良県', '明日香村': '奈良県',
    '上牧町': '奈良県', '王寺町': '奈良県', '広陵町': '奈良県', '河合町': '奈良県',
    '吉野町': '奈良県', '大淀町': '奈良県', '下市町': '奈良県', '黒滝村': '奈良県',
    '天川村': '奈良県', '野迫川村': '奈良県', '十津川村': '奈良県', '下北山村': '奈良県',
    '上北山村': '奈良県', '川上村': '奈良県', '東吉野村': '奈良県',
    
    // 京都府の町村
    '笠置町': '京都府', '和束町': '京都府', '精華町': '京都府', '南山城村': '京都府',
    '京丹波町': '京都府', '伊根町': '京都府', '与謝野町': '京都府',
    
    // 和歌山県の町村
    '紀美野町': '和歌山県', 'かつらぎ町': '和歌山県', '九度山町': '和歌山県', '高野町': '和歌山県',
    '湯浅町': '和歌山県', '広川町': '和歌山県', '有田川町': '和歌山県', '美浜町': '和歌山県',
    '日高町': '和歌山県', '由良町': '和歌山県', '印南町': '和歌山県', 'みなべ町': '和歌山県',
    '日高川町': '和歌山県', '白浜町': '和歌山県', '上富田町': '和歌山県', 'すさみ町': '和歌山県',
    '那智勝浦町': '和歌山県', '太地町': '和歌山県', '古座川町': '和歌山県', '北山村': '和歌山県',
    '串本町': '和歌山県'
  };

  // 特殊マッピングをチェック
  if (specialMappings[municipality]) {
    return specialMappings[municipality];
  }

  // 都道府県名が直接含まれている場合の検索
  const prefectures = [
    '北海道', '青森県', '岩手県', '宮城県', '秋田県', '山形県', '福島県',
    '茨城県', '栃木県', '群馬県', '埼玉県', '千葉県', '東京都', '神奈川県',
    '新潟県', '富山県', '石川県', '福井県', '山梨県', '長野県', '岐阜県',
    '静岡県', '愛知県', '三重県', '滋賀県', '京都府', '大阪府', '兵庫県',
    '奈良県', '和歌山県', '鳥取県', '島根県', '岡山県', '広島県', '山口県',
    '徳島県', '香川県', '愛媛県', '高知県', '福岡県', '佐賀県', '長崎県',
    '熊本県', '大分県', '宮崎県', '鹿児島県', '沖縄県'
  ];

  for (const prefecture of prefectures) {
    const prefectureName = prefecture.replace(/[都道府県]/g, '');
    if (municipality.includes(prefectureName)) {
      return prefecture;
    }
  }

  // デフォルトで北海道を返す（データ上で多くが北海道のため）
  return '北海道';
}