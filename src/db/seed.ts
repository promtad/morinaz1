import "dotenv/config";
import { db } from "./index";
import { ads, adSlots, categories, sessions, settings, users } from "./schema";
import { hashPassword } from "../lib/password";

// ── Stock imagery ─────────────────────────────────────────────
const M = {
  lip: "https://images.pexels.com/photos/1571585/beauty-fashion-background-shop-1571585.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
  palette: "https://images.pexels.com/photos/12955613/pexels-photo-12955613.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
  flatlay: "https://images.pexels.com/photos/7290174/pexels-photo-7290174.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
  dark: "https://images.pexels.com/photos/4938514/pexels-photo-4938514.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
};
const F = {
  boutique: "https://images.pexels.com/photos/8306375/pexels-photo-8306375.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800",
  dresses: "https://images.pexels.com/photos/8386652/pexels-photo-8386652.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800",
  racks: "https://images.pexels.com/photos/12299947/pexels-photo-12299947.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800",
  sandal: "https://images.pexels.com/photos/8387835/pexels-photo-8387835.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800",
};
const S = {
  white: "https://images.pexels.com/photos/7691112/pexels-photo-7691112.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
  towel: "https://images.pexels.com/photos/7691164/pexels-photo-7691164.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
  marble: "https://images.pexels.com/photos/4202321/pexels-photo-4202321.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
  jade: "https://images.pexels.com/photos/8015898/pexels-photo-8015898.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
};
const P = {
  flora: "https://images.pexels.com/photos/9957552/pexels-photo-9957552.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800",
  spray: "https://images.pexels.com/photos/9957568/pexels-photo-9957568.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800",
  dior: "https://images.pexels.com/photos/32630385/pexels-photo-32630385.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800",
  field: "https://images.pexels.com/photos/10536602/pexels-photo-10536602.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800",
};
const B = {
  honey: "https://images.pexels.com/photos/21897141/pexels-photo-21897141.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
  pose: "https://images.pexels.com/photos/21897127/pexels-photo-21897127.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
  mono: "https://images.pexels.com/photos/18601568/pexels-photo-18601568.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
  red: "https://images.pexels.com/photos/20086702/pexels-photo-20086702.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
};
const J = {
  set: "https://images.pexels.com/photos/10944923/pexels-photo-10944923.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
  indian: "https://images.pexels.com/photos/29038003/pexels-photo-29038003.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
  rack: "https://images.pexels.com/photos/13219289/pexels-photo-13219289.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
  heart: "https://images.pexels.com/photos/34399037/pexels-photo-34399037.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
};
const H = {
  black: "https://images.pexels.com/photos/5398968/pexels-photo-5398968.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
  pink: "https://images.pexels.com/photos/7588398/pexels-photo-7588398.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
  stud: "https://images.pexels.com/photos/12173376/pexels-photo-12173376.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
  red: "https://images.pexels.com/photos/3682293/pexels-photo-3682293.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
};
const HA = {
  salon: "https://images.pexels.com/photos/23349900/pexels-photo-23349900.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
  set: "https://images.pexels.com/photos/7440062/pexels-photo-7440062.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
  bottles: "https://images.pexels.com/photos/3993450/pexels-photo-3993450.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
  tools: "https://images.pexels.com/photos/8467976/pexels-photo-8467976.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
};

const STORE = "https://lamsa-beauty.store/products";

async function main() {
  console.log("→ Cleaning old data…");
  await db.delete(ads);
  await db.delete(adSlots);
  await db.delete(sessions);
  await db.delete(categories);
  await db.delete(users);
  await db.delete(settings);

  console.log("→ Creating users…");
  const [admin, sara, noura] = await db
    .insert(users)
    .values([
      {
        name: "إدارة لمسة",
        email: "admin@lamsa.app",
        passwordHash: hashPassword("admin123456"),
        role: "admin",
      },
      {
        name: "سارة العتيبي",
        email: "sara@lamsa.app",
        passwordHash: hashPassword("user123456"),
        role: "member",
      },
      {
        name: "نورة القحطاني",
        email: "noura@lamsa.app",
        passwordHash: hashPassword("user123456"),
        role: "member",
      },
    ])
    .returning();

  console.log("→ Creating categories…");
  const cats = await db
    .insert(categories)
    .values([
      {
        nameAr: "مكياج",
        nameEn: "Makeup",
        slug: "makeup",
        description: "أحمر شفاه، ظلال عيون، كريمات أساس وكل مستلزمات التجميل من أرقى الماركات",
        icon: "palette",
        image: M.lip,
      },
      {
        nameAr: "أزياء وملابس",
        nameEn: "Fashion",
        slug: "fashion",
        description: "فساتين سهرة وكاجوال، عبايات، بلوزات وأحدث صيحات الموضة النسائية",
        icon: "shirt",
        image: F.boutique,
      },
      {
        nameAr: "العناية بالبشرة",
        nameEn: "Skincare",
        slug: "skincare",
        description: "سيروم، كريمات ترطيب، ماسكات وروتين العناية الكامل لبشرة مشرقة",
        icon: "droplets",
        image: S.white,
      },
      {
        nameAr: "عطور",
        nameEn: "Perfumes",
        slug: "perfumes",
        description: "عطور فرنسية وشرقية، مسك، عود وبخور — توقيعك العطري الخاص",
        icon: "spray-can",
        image: P.flora,
      },
      {
        nameAr: "حقائب",
        nameEn: "Handbags",
        slug: "handbags",
        description: "حقائب يد وكتف وظهر من الجلد الفاخر وبألوان الموسم",
        icon: "shopping-bag",
        image: B.honey,
      },
      {
        nameAr: "مجوهرات وإكسسوارات",
        nameEn: "Jewelry",
        slug: "jewelry",
        description: "ذهب، ألماس، لؤلؤ وإكسسوارات تكمل إطلالتك في كل مناسبة",
        icon: "gem",
        image: J.heart,
      },
      {
        nameAr: "أحذية",
        nameEn: "Shoes",
        slug: "shoes",
        description: "كعب عالي، صنادل، سنيكرز نسائي وبوتس — راحة وأناقة بكل خطوة",
        icon: "footprints",
        image: H.red,
      },
      {
        nameAr: "العناية بالشعر",
        nameEn: "Haircare",
        slug: "haircare",
        description: "زيوت، شامبو، أجهزة فرد وتصفيف احترافية لشعر صحي ولامع",
        icon: "scissors",
        image: HA.set,
      },
    ])
    .returning();

  const catId = (slug: string) => cats.find((c) => c.slug === slug)!.id;
  const day = 24 * 60 * 60 * 1000;

  console.log("→ Creating ads…");
  await db.insert(ads).values([
    {
      title: "مجموعة أحمر شفاه مات فيلفت — 12 لون ثابت",
      description:
        "مجموعة أحمر الشفاه الأكثر مبيعاً: 12 درجة عصرية من النيود إلى الأحمر الجريء.\nثبات يدوم حتى 12 ساعة، تركيبة مرطبة لا تسبب الجفاف، أصلية 100% مع تغليف هدايا مجاني.\nالتوصيل خلال 2-4 أيام عمل لجميع المدن.",
      price: 89,
      oldPrice: 149,
      productUrl: `${STORE}/velvet-matte-lipstick-set`,
      images: JSON.stringify([M.lip, M.flatlay]),
      categoryId: catId("makeup"),
      userId: sara.id,
      featured: true,
      views: 1843,
      createdAt: new Date(Date.now() - 1 * day),
    },
    {
      title: "باليت ظلال عيون احترافي — 35 لون دافئ",
      description:
        "باليت الظلال المفضل لدى خبيرات التجميل: ألوان دافئة مطفية ولامعة بدرجة تلوين عالية.\nيناسب الإطلالات اليومية والسهرة، مع فرشاة ثنائية هدية.",
      price: 119,
      oldPrice: 189,
      productUrl: `${STORE}/pro-eyeshadow-palette-35`,
      images: JSON.stringify([M.palette, M.flatlay]),
      categoryId: catId("makeup"),
      userId: noura.id,
      featured: true,
      views: 1290,
      createdAt: new Date(Date.now() - 2 * day),
    },
    {
      title: "مجموعة فرش مكياج 24 قطعة بمقابض خشب الورد",
      description:
        "فرش ناعمة كثيفة لا تتساقط شعيراتها، تشمل فرش الوجه والعيون والشفاه.\nتأتي بحقيبة جلدية أنيقة للسفر والتخزين.",
      price: 74,
      oldPrice: 110,
      productUrl: `${STORE}/rosewood-brush-set-24`,
      images: JSON.stringify([M.dark]),
      categoryId: catId("makeup"),
      userId: sara.id,
      featured: false,
      views: 512,
      createdAt: new Date(Date.now() - 3 * day),
    },
    {
      title: "فستان سهرة ساتان ميدي بقصة انسيابية — نعومة ملكية",
      description:
        "فستان سهرة من الساتان الفاخر بقصة ميدي انسيابية تناسب جميع القوام.\nمتوفر بألوان: زهري، عنابي، أخضر زيتي. المقاسات من S إلى XXL.\nتوصيل مجاني للطلبات فوق 300 ريال.",
      price: 320,
      oldPrice: 450,
      productUrl: `${STORE}/satin-midi-evening-dress`,
      images: JSON.stringify([F.boutique, F.dresses]),
      categoryId: catId("fashion"),
      userId: noura.id,
      featured: true,
      views: 2341,
      createdAt: new Date(Date.now() - 1 * day),
    },
    {
      title: "تشكيلة فساتين كاجوال صيفية — قطن 100%",
      description:
        "فساتين يومية خفيفة بألوان صيفية منعشة، قماش قطني مريح يتحمل الغسيل المتكرر.\nموديلات متعددة داخل صفحة المنتج — اختاري المفضل لديك.",
      price: 145,
      oldPrice: 220,
      productUrl: `${STORE}/summer-casual-dresses`,
      images: JSON.stringify([F.dresses, F.sandal]),
      categoryId: catId("fashion"),
      userId: sara.id,
      featured: false,
      views: 876,
      createdAt: new Date(Date.now() - 4 * day),
    },
    {
      title: "بلوزة حرير بأكمام واسعة — 5 ألوان راقية",
      description:
        "بلوزة حرير ناعمة بلمعة هادئة، أكمام واسعة بتصميم عصري.\nتناسب الإطلالات الرسمية والكاجوال، مقاسات S حتى XL.",
      price: 99,
      oldPrice: 160,
      productUrl: `${STORE}/silk-wide-sleeve-blouse`,
      images: JSON.stringify([F.racks]),
      categoryId: catId("fashion"),
      userId: noura.id,
      featured: false,
      views: 431,
      createdAt: new Date(Date.now() - 5 * day),
    },
    {
      title: "سيروم فيتامين C المركز — إشراقة فورية وتوحيد للون",
      description:
        "سيروم مركز بفيتامين C النقي 15% مع حمض الهيالورونيك وفيتامين E.\nيوحد لون البشرة، يخفي التصبغات ويمنح إشراقة فورية خلال أسبوعين.\nنتائج مضمونة أو استرجاع كامل خلال 30 يوماً.",
      price: 135,
      oldPrice: 210,
      productUrl: `${STORE}/vitamin-c-glow-serum`,
      images: JSON.stringify([S.white, S.jade]),
      categoryId: catId("skincare"),
      userId: sara.id,
      featured: true,
      views: 3120,
      createdAt: new Date(Date.now() - 2 * day),
    },
    {
      title: "مجموعة العناية الكاملة — روتين كوري 6 خطوات",
      description:
        "الروتين الكوري الشهير كاملاً: غسول، تونر، إسنس، سيروم، كريم عيون وواقي شمس.\nمناسب لجميع أنواع البشرة بما فيها الحساسة. نتائج ملحوظة خلال 4 أسابيع.",
      price: 249,
      oldPrice: 340,
      productUrl: `${STORE}/korean-skincare-routine-6`,
      images: JSON.stringify([S.towel, S.marble]),
      categoryId: catId("skincare"),
      userId: noura.id,
      featured: true,
      views: 1987,
      createdAt: new Date(Date.now() - 6 * day),
    },
    {
      title: "كريم ترطيب عميق بحمض الهيالورونيك — 72 ساعة",
      description:
        "كريم مرطب غني بحمض الهيالورونيك ثلاثي الوزن والسيراميد.\nترطيب عميق يدوم 72 ساعة بدون ملمس دهني — مثالي تحت المكياج.",
      price: 98,
      oldPrice: 140,
      productUrl: `${STORE}/hyaluronic-deep-moisturizer`,
      images: JSON.stringify([S.marble]),
      categoryId: catId("skincare"),
      userId: sara.id,
      featured: false,
      views: 654,
      createdAt: new Date(Date.now() - 7 * day),
    },
    {
      title: "عطر فلورا روز — أو دو برفيوم نسائي 100 مل",
      description:
        "عطر زهري فاخر بقلب من الورد الدمشقي والفانيليا البيضاء وقاعدة من المسك الدافئ.\nثبات عالٍ يتجاوز 10 ساعات — التوقيع العطري المثالي للمرأة الأنيقة.\nتغليف هدايا فاخر مجاناً.",
      price: 289,
      oldPrice: 380,
      productUrl: `${STORE}/flora-rose-edp-100ml`,
      images: JSON.stringify([P.flora, P.spray]),
      categoryId: catId("perfumes"),
      userId: noura.id,
      featured: true,
      views: 4512,
      createdAt: new Date(Date.now() - 1 * day),
    },
    {
      title: "مسك الطهارة الأبيض — تركيبة فرنسية نقية",
      description:
        "مسك أبيض نقي بتركيبة فرنسية أصلية — رائحة نظيفة ناعمة تدوم طوال اليوم.\nمثالي بعد الاستحمام وللاستخدام اليومي، حجم 30 مل.",
      price: 159,
      oldPrice: null,
      productUrl: `${STORE}/white-musk-tahara`,
      images: JSON.stringify([P.spray]),
      categoryId: catId("perfumes"),
      userId: sara.id,
      featured: false,
      views: 932,
      createdAt: new Date(Date.now() - 8 * day),
    },
    {
      title: "عطر بلومينغ النسائي — باقة الربيع في زجاجة",
      description:
        "عطر أنثوي راقٍ بمزيج الفاوانيا والورد والياسمين.\nالزجاجة المزينة بفيونكة حريرية تجعلها هدية مثالية لمن تحبين.",
      price: 345,
      oldPrice: 420,
      productUrl: `${STORE}/blooming-bouquet-edp`,
      images: JSON.stringify([P.dior, P.field]),
      categoryId: catId("perfumes"),
      userId: noura.id,
      featured: false,
      views: 1204,
      createdAt: new Date(Date.now() - 9 * day),
    },
    {
      title: "حقيبة يد جلد طبيعي فاخرة — لون عسلي دافئ",
      description:
        "حقيبة يد من الجلد الطبيعي 100% بلون عسلي يناسب كل الإطلالات.\nحجم عملي يتسع للجوال والمحفظة والمكياج، مع حزام كتف قابل للتعديل.\nخياطة يدوية متقنة وضمان سنة كاملة.",
      price: 415,
      oldPrice: 520,
      productUrl: `${STORE}/honey-leather-handbag`,
      images: JSON.stringify([B.honey, B.pose]),
      categoryId: catId("handbags"),
      userId: sara.id,
      featured: true,
      views: 2876,
      createdAt: new Date(Date.now() - 2 * day),
    },
    {
      title: "حقيبة كتف عصرية بسلسلة ذهبية — أحمر ملكي",
      description:
        "حقيبة كتف بتصميم عصري جريء وسلسلة ذهبية لامعة.\nتضيف لمسة فخامة فورية لأي إطلالة — متوفرة أيضاً بالأسود والبيج.",
      price: 260,
      oldPrice: 310,
      productUrl: `${STORE}/golden-chain-shoulder-bag`,
      images: JSON.stringify([B.red, B.mono]),
      categoryId: catId("handbags"),
      userId: noura.id,
      featured: false,
      views: 743,
      createdAt: new Date(Date.now() - 10 * day),
    },
    {
      title: "طقم القلب الذهبي — قلادة وأقراط بعلبة مخمل",
      description:
        "طقم ذهبي خلاب بتصميم القلب: قلادة + أقراط مطابقة في علبة مخمل حمراء فاخرة.\nمطلي بالذهب عيار 18 مضاد للحساسية — هدية مثالية للمناسبات.",
      price: 690,
      oldPrice: 850,
      productUrl: `${STORE}/golden-heart-jewelry-set`,
      images: JSON.stringify([J.heart]),
      categoryId: catId("jewelry"),
      userId: noura.id,
      featured: true,
      views: 1654,
      createdAt: new Date(Date.now() - 3 * day),
    },
    {
      title: "طقم ذهب تقليدي بلمسة عصرية — للعروس الأنيقة",
      description:
        "طقم مجوهرات تقليدي فاخر بتفاصيل زهرية دقيقة: قلادة، أقراط، خاتم وخاتم.\nمثالي للأعراس والمناسبات الكبرى — يصل بتغليف هدايا ملكي.",
      price: 540,
      oldPrice: 620,
      productUrl: `${STORE}/heritage-gold-bridal-set`,
      images: JSON.stringify([J.indian, J.set]),
      categoryId: catId("jewelry"),
      userId: sara.id,
      featured: false,
      views: 821,
      createdAt: new Date(Date.now() - 11 * day),
    },
    {
      title: "كعب عالي أحمر كلاسيكي — أناقة وراحة طوال اليوم",
      description:
        "كعب 8 سم بتصميم كلاسيكي خالد مع نعل داخلي مبطن للراحة.\nجلد ناعم عالي الجودة، مقاسات 35 إلى 41 — القطعة التي تكمل خزانتك.",
      price: 230,
      oldPrice: 320,
      productUrl: `${STORE}/classic-red-heels`,
      images: JSON.stringify([H.red]),
      categoryId: catId("shoes"),
      userId: noura.id,
      featured: true,
      views: 1487,
      createdAt: new Date(Date.now() - 4 * day),
    },
    {
      title: "ستيليتو وردي مودرن — إطلالة جريئة",
      description:
        "ستيليتو بلون وردي ناري مع جينز أو فساتين — يصنع إطلالة عصرية جريئة.\nكعب 10 سم بوزن خفيف وثبات ممتاز.",
      price: 175,
      oldPrice: 240,
      productUrl: `${STORE}/modern-pink-stiletto`,
      images: JSON.stringify([H.pink, H.stud]),
      categoryId: catId("shoes"),
      userId: sara.id,
      featured: false,
      views: 598,
      createdAt: new Date(Date.now() - 12 * day),
    },
    {
      title: "مجموعة العناية بالشعر بزيت الأرغان المغربي",
      description:
        "مجموعة متكاملة: شامبو + بلسم + ماسك + زيت الأرغان النقي.\nيعالج التقصف والجفاف ويمنح شعرك لمعاناً حريرياً من أول استخدام.\nخالٍ من السلفات والبارابين.",
      price: 185,
      oldPrice: 260,
      productUrl: `${STORE}/argan-haircare-collection`,
      images: JSON.stringify([HA.set, HA.tools]),
      categoryId: catId("haircare"),
      userId: noura.id,
      featured: true,
      views: 2210,
      createdAt: new Date(Date.now() - 5 * day),
    },
    {
      title: "روتين صالون المنزل — تجربة استرخاء فاخرة",
      description:
        "منتجات عناية فاخرة تحول حمامك إلى صالون تجميل: شامبو مغذٍ وسيروم لمعان.\nنتائج احترافية بدون مواعيد — شعر صحي ولامع كل يوم.",
      price: 140,
      oldPrice: 195,
      productUrl: `${STORE}/home-salon-ritual`,
      images: JSON.stringify([HA.salon, HA.bottles]),
      categoryId: catId("haircare"),
      userId: sara.id,
      featured: false,
      views: 476,
      createdAt: new Date(Date.now() - 13 * day),
    },
  ]);

  console.log("→ Creating ad slots…");
  await db.insert(adSlots).values([
    {
      name: "بنر الهيدر — تخفيضات الجمال الكبرى",
      position: "header",
      imageUrl: M.dark,
      linkUrl: "https://lamsa-beauty.store/offers",
      isActive: true,
    },
    {
      name: "بنر وسط — عرض العطور الحصري",
      position: "middle",
      imageUrl: P.spray,
      linkUrl: "https://lamsa-beauty.store/offers/perfumes",
      isActive: true,
    },
    {
      name: "بنر وسط — وصل حديثاً من الأزياء",
      position: "middle",
      imageUrl: F.dresses,
      linkUrl: "https://lamsa-beauty.store/offers/new-fashion",
      isActive: true,
    },
    {
      name: "بنر جانبي — مجوهرات ذهبية",
      position: "sidebar",
      imageUrl: J.rack,
      linkUrl: "https://lamsa-beauty.store/offers/jewelry",
      isActive: true,
    },
    {
      name: "بنر جانبي — عناية بالشعر",
      position: "sidebar",
      imageUrl: HA.tools,
      linkUrl: "https://lamsa-beauty.store/offers/haircare",
      isActive: true,
    },
    {
      name: "بنر الفوتر — روتين العناية بالبشرة",
      position: "footer",
      imageUrl: S.towel,
      linkUrl: "https://lamsa-beauty.store/offers/skincare",
      isActive: true,
    },
  ]);

  console.log("→ Creating settings…");
  await db.insert(settings).values([
    { key: "siteName", value: "لمسة | LAMSA" },
    { key: "siteTagline", value: "سوق الإعلانات النسائي الأول" },
    {
      key: "siteDescription",
      value:
        "لمسة — منصة الإعلانات النسائية الأولى: مكياج، أزياء، عناية بالبشرة، عطور، حقائب، مجوهرات وكل ما يخص المرأة العصرية بأفضل الأسعار والتخفيضات مع روابط مباشرة للمتاجر.",
    },
    {
      key: "siteKeywords",
      value:
        "إعلانات نسائية، مكياج، أزياء نسائية، عناية بالبشرة، عطور نسائية، حقائب، مجوهرات، أحذية نسائية، تخفيضات، تسوق نسائي",
    },
    { key: "currency", value: "ر.س" },
    { key: "contactEmail", value: "hello@lamsa.app" },
    { key: "instagram", value: "https://instagram.com/lamsa" },
    { key: "twitter", value: "https://x.com/lamsa" },
    {
      key: "adsTxt",
      value: `# ads.txt — لمسة | LAMSA
# سجلات البائعين المعتمدين للإعلانات الرقمية
# Authorized digital sellers — حدّثي هذا الملف من لوحة التحكم ← الإعدادات

# مثال جوجل أدسنس / Google AdSense example:
# google.com, pub-0000000000000000, DIRECT, f08c47fec0942fa0

# مثال شبكة أخرى / Another network example:
# example-network.com, 123456, RESELLER`,
    },
  ]);

  console.log("✓ Seed complete!");
  console.log("  Admin:  admin@lamsa.app / admin123456");
  console.log("  Member: sara@lamsa.app  / user123456");
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
