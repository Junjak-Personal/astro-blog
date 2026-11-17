import { z } from 'zod';

// JIS code, Japanese name, Korean name, English name, region, visited.
// Visit status comes from the author's list, updated 2026-11-17.
const prefectureRows = [
  ['01', '北海道', '홋카이도', 'Hokkaido', 'hokkaido', true],
  ['02', '青森県', '아오모리', 'Aomori', 'tohoku', true],
  ['03', '岩手県', '이와테', 'Iwate', 'tohoku', false],
  ['04', '宮城県', '미야기', 'Miyagi', 'tohoku', true],
  ['05', '秋田県', '아키타', 'Akita', 'tohoku', true],
  ['06', '山形県', '야마가타', 'Yamagata', 'tohoku', false],
  ['07', '福島県', '후쿠시마', 'Fukushima', 'tohoku', false],
  ['08', '茨城県', '이바라키', 'Ibaraki', 'kanto', false],
  ['09', '栃木県', '도치기', 'Tochigi', 'kanto', false],
  ['10', '群馬県', '군마', 'Gunma', 'kanto', true],
  ['11', '埼玉県', '사이타마', 'Saitama', 'kanto', false],
  ['12', '千葉県', '지바', 'Chiba', 'kanto', false],
  ['13', '東京都', '도쿄', 'Tokyo', 'kanto', true],
  ['14', '神奈川県', '가나가와', 'Kanagawa', 'kanto', true],
  ['15', '新潟県', '니가타', 'Niigata', 'chubu', true],
  ['16', '富山県', '도야마', 'Toyama', 'chubu', true],
  ['17', '石川県', '이시카와', 'Ishikawa', 'chubu', true],
  ['18', '福井県', '후쿠이', 'Fukui', 'chubu', true],
  ['19', '山梨県', '야마나시', 'Yamanashi', 'chubu', true],
  ['20', '長野県', '나가노', 'Nagano', 'chubu', true],
  ['21', '岐阜県', '기후', 'Gifu', 'chubu', true],
  ['22', '静岡県', '시즈오카', 'Shizuoka', 'chubu', true],
  ['23', '愛知県', '아이치', 'Aichi', 'chubu', true],
  ['24', '三重県', '미에', 'Mie', 'kansai', true],
  ['25', '滋賀県', '시가', 'Shiga', 'kansai', true],
  ['26', '京都府', '교토', 'Kyoto', 'kansai', true],
  ['27', '大阪府', '오사카', 'Osaka', 'kansai', true],
  ['28', '兵庫県', '효고', 'Hyogo', 'kansai', true],
  ['29', '奈良県', '나라', 'Nara', 'kansai', true],
  ['30', '和歌山県', '와카야마', 'Wakayama', 'kansai', false],
  ['31', '鳥取県', '돗토리', 'Tottori', 'chugoku', false],
  ['32', '島根県', '시마네', 'Shimane', 'chugoku', false],
  ['33', '岡山県', '오카야마', 'Okayama', 'chugoku', true],
  ['34', '広島県', '히로시마', 'Hiroshima', 'chugoku', true],
  ['35', '山口県', '야마구치', 'Yamaguchi', 'chugoku', true],
  ['36', '徳島県', '도쿠시마', 'Tokushima', 'shikoku', false],
  ['37', '香川県', '가가와', 'Kagawa', 'shikoku', true],
  ['38', '愛媛県', '에히메', 'Ehime', 'shikoku', true],
  ['39', '高知県', '고치', 'Kochi', 'shikoku', true],
  ['40', '福岡県', '후쿠오카', 'Fukuoka', 'kyushu-okinawa', true],
  ['41', '佐賀県', '사가', 'Saga', 'kyushu-okinawa', true],
  ['42', '長崎県', '나가사키', 'Nagasaki', 'kyushu-okinawa', true],
  ['43', '熊本県', '구마모토', 'Kumamoto', 'kyushu-okinawa', true],
  ['44', '大分県', '오이타', 'Oita', 'kyushu-okinawa', true],
  ['45', '宮崎県', '미야자키', 'Miyazaki', 'kyushu-okinawa', false],
  ['46', '鹿児島県', '가고시마', 'Kagoshima', 'kyushu-okinawa', false],
  ['47', '沖縄県', '오키나와', 'Okinawa', 'kyushu-okinawa', false],
] as const;

export const japanPrefectures = prefectureRows.map(([code, jp, ko, en, region, visited]) => ({
  code,
  name: { ko, en, jp },
  region,
  visited,
}));

const localizedNotes = z.object({
  ko: z.array(z.string().min(1)),
  en: z.array(z.string().min(1)),
  jp: z.array(z.string().min(1)),
});

const visitRecord = z.object({
  visitCount: z.number().int().positive().nullable(),
  cities: localizedNotes,
  activities: localizedNotes,
});

// Records supplied by the author. null means the count is not yet known, never zero.
// A prefecture without a record keeps its confirmed visit status on the map.
export const japanVisitRecords = z.partialRecord(
  z.enum(japanPrefectures.map(({ code }) => code)),
  visitRecord,
).parse({
  '01': {
    visitCount: 2,
    cities: {
      ko: ['오타루', '삿포로', '치토세(공항)', '노보리베츠', '아사히카와', '비에이'],
      en: ['Otaru', 'Sapporo', 'Chitose (airport)', 'Noboribetsu', 'Asahikawa', 'Biei'],
      jp: ['小樽', '札幌', '千歳（空港）', '登別', '旭川', '美瑛'],
    },
    activities: {
      ko: [
        '1회차 · 친구와 자유여행: 오타루, 삿포로, 치토세(공항), 노보리베츠.',
        '2회차 · 가족 패키지여행: 삿포로, 아사히카와, 오타루, 비에이, 「청의폭포」(정확한 명칭 미확인), 소운쿄, 닝구르테라스. 세부 일정은 기억을 바탕으로 정리.',
      ],
      en: [
        '1st visit · Independent trip with a friend: Otaru, Sapporo, Chitose (airport), and Noboribetsu.',
        '2nd visit · Family package tour: Sapporo, Asahikawa, Otaru, Biei, a place recalled as 「Blue Falls」 (exact name unconfirmed), Sounkyo, and Ningle Terrace. This itinerary is reconstructed from memory.',
      ],
      jp: [
        '1回目・友人との個人旅行：小樽、札幌、千歳（空港）、登別。',
        '2回目・家族とのパッケージツアー：札幌、旭川、小樽、美瑛、「青の滝」と記憶している場所（正式名称は未確認）、層雲峡、ニングルテラス。詳しい行程は記憶をもとに整理。',
      ],
    },
  },
  '02': {
    visitCount: 1,
    // Furofushi Onsen is in Fukaura: https://aomori-tourism.com/spot/detail_1107.html
    cities: {
      ko: ['아오모리', '후카우라마치', '히로사키'],
      en: ['Aomori', 'Fukaura', 'Hirosaki'],
      jp: ['青森', '深浦町', '弘前'],
    },
    activities: {
      ko: ['1회차 · 일본 한 달 여행. 후카우라마치의 부로후시 온천(黄金崎不老ふ死温泉) 방문.'],
      en: ['1st visit · Month-long trip around Japan. Visited Koganezaki Furofushi Onsen in Fukaura.'],
      jp: ['1回目・日本を1か月巡る旅。深浦町の黄金崎不老ふ死温泉を訪問。'],
    },
  },
  '04': {
    visitCount: 1,
    cities: {
      ko: ['센다이', '마츠시마'],
      en: ['Sendai', 'Matsushima'],
      jp: ['仙台', '松島'],
    },
    activities: {
      ko: ['1회차 · 일본 한 달 여행. 미야기쿄 증류소 방문.'],
      en: ['1st visit · Month-long trip around Japan. Visited Miyagikyo Distillery.'],
      jp: ['1回目・日本を1か月巡る旅。宮城峡蒸溜所を訪問。'],
    },
  },
  '05': {
    visitCount: 1,
    cities: {
      ko: ['유리혼조시', '아키타시', '가쿠노다테'],
      en: ['Yurihonjo', 'Akita', 'Kakunodate'],
      jp: ['由利本荘市', '秋田市', '角館'],
    },
    activities: {
      ko: ['1회차 · 일본 한 달 여행. 유키노보샤(雪の茅舎) 양조장을 목적으로 유리혼조시 방문.'],
      en: ['1st visit · Month-long trip around Japan. Went to Yurihonjo for the Yukinobosha brewery.'],
      jp: ['1回目・日本を1か月巡る旅。雪の茅舎の酒蔵を目当てに由利本荘市を訪問。'],
    },
  },
});
