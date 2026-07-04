/* ===== بيانات الشركات والمشاريع الموحدة ===== */

var img = (function() {
  var pool = [];
  for (var n = 1; n <= 31; n++) pool.push('images/img' + n + '.jpg');
  return function(n) { return pool[(n - 1) % pool.length]; };
})();

function makeProjects(count, base, prefix, areas, prices) {
  var list = [];
  for (var i = 0; i < count; i++) {
    var imgs = [];
    for (var j = 0; j < 4; j++) imgs.push(img(((base + i * 3 + j * 7) % 31) + 1));
    var a = areas ? areas[i % areas.length] : (120 + i * 80);
    var p = prices ? prices[i % prices.length] : (15000000 + i * 5000000);
    var costStr = (p >= 1000000000) ? (p / 1000000000).toFixed(1).replace('.0','') + ',000,000,000 د.ع' : (p / 1000000).toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ',') + ',000,000 د.ع';
    list.push({
      title: prefix + ' ' + (i + 1),
      desc: 'مشروع نموذجي متميز في مجال ' + prefix + ' بمساحة ' + a + ' م² وتصميم عصري.',
      images: imgs,
      cost: costStr,
      area: a + ' م²',
      year: (2023 + i % 3) + '',
      materials: [
        { name: 'خرسانة مسلحة', image: imgs[0] },
        { name: 'حديد تسليح', image: imgs[1] },
        { name: 'طوب بناء', image: imgs[2] },
        { name: 'أسمنت', image: imgs[3] }
      ],
      meta: [
        { icon: 'location_on', label: 'الموقع', value: 'بغداد' },
        { icon: 'straighten', label: 'المساحة', value: a + ' م²' },
        { icon: 'payments', label: 'التكلفة', value: costStr }
      ]
    });
  }
  return list;
}

function makeWorkImages(base, count) {
  var list = [];
  for (var i = 0; i < (count || 6); i++) list.push(img(((base + i * 5) % 31) + 1));
  return list;
}

var companiesData = {

  /* ===== بناء وإنشاء ===== */
  'شركة البناء الحديث': {
    id: 'co1',
    name: 'شركة البناء الحديث',
    category: 'بناء وإنشاء',
    about: 'شركة رائدة في مجال البناء السكني والتجاري. تمتلك خبرة واسعة في تنفيذ المشاريع الكبرى بأعلى معايير الجودة.',
    specs: ['بناء سكني وتجاري', 'خرسانة مسلحة', 'هياكل حديدية'],
    logo: img(3), cover: img(16),
    workImages: makeWorkImages(16),
    location: 'بغداد - الكرادة',
    phone: '+964 770 111 2233',
    email: 'info@modern-construction.com',
    years: 18, workers: 200, engineers: 35, done: 120,
    rating: 5, verified: true,
    projects: [
      { title: 'قصر المنصور السكني', desc: 'قصر فاخر بمساحة 1000 م² مع تصاميم داخلية مستوحاة من الطراز الأندلسي الحديث.', images: [img(16), img(17), img(18), img(19)], cost: '750,000,000 د.ع', area: '1000 م²', year: '2025', materials: [{name:'رخام كارارا',image:img(16)},{name:'خشب زان',image:img(17)},{name:'زجاج سيكوريت',image:img(18)},{name:'سيراميك بورسلين',image:img(19)}], meta: [{icon:'location_on',label:'الموقع',value:'المنصور'},{icon:'straighten',label:'المساحة',value:'1000 م²'},{icon:'payments',label:'التكلفة',value:'750,000,000 د.ع'}] },
      { title: 'فلل الربيع', desc: 'مشروع سكني يضم 30 فيلا مستقلة بتصاميم عصرية وحدائق خاصة.', images: [img(28), img(29), img(30), img(31)], cost: '3,500,000,000 د.ع', area: '3000 م²', year: '2025', materials: [{name:'طوب عازل',image:img(28)},{name:'أسمنت',image:img(29)},{name:'بلاط إنترلوك',image:img(30)},{name:'دهان خارجي',image:img(31)}], meta: [{icon:'location_on',label:'الموقع',value:'اليرموك'},{icon:'straighten',label:'المساحة',value:'3000 م²'},{icon:'payments',label:'التكلفة',value:'3,500,000,000 د.ع'}] },
      { title: 'فيلا دوبلكس', desc: 'فيلا دوبلكس بتصميم عصري مع حديقة خاصة وحوض سباحة.', images: [img(9), img(10), img(11), img(12)], cost: '600,000,000 د.ع', area: '600 م²', year: '2024', materials: [{name:'بلاط حمامات',image:img(9)},{name:'أدوات صحية',image:img(10)},{name:'دهان مائي',image:img(11)},{name:'زجاج شفاف',image:img(12)}], meta: [{icon:'location_on',label:'الموقع',value:'المنصور'},{icon:'straighten',label:'المساحة',value:'600 م²'},{icon:'payments',label:'التكلفة',value:'600,000,000 د.ع'}] }
    ],
    reviews: [
      { name: 'أحمد محمد', rating: 5, text: 'شركة ممتازة، أنجزوا مشروعي بجودة عالية.', time: 'قبل شهر' },
      { name: 'سارة جاسم', rating: 5, text: 'فريق عمل رائع ومبدع.', time: 'قبل شهرين' }
    ]
  },

  'مقاولون العرب': {
    id: 'co2',
    name: 'مقاولون العرب',
    category: 'بناء وإنشاء',
    about: 'من كبرى شركات المقاولات في العراق. نقدم خدمات البناء والتشييد بأعلى معايير الجودة والإتقان. نمتلك فريقاً متكاملاً من المهندسين والكوادر الفنية ذات الخبرة العالية. تأسست منذ 25 عاماً.',
    specs: ['بناء عام', 'هندسة مدنية', 'بنية تحتية', 'تشطيبات', 'ديكور داخلي'],
    logo: img(5), cover: img(11),
    workImages: makeWorkImages(11),
    location: 'بغداد - الكرادة',
    phone: '+964 770 123 4567',
    email: 'info@arabcontractors.com',
    years: 25, workers: 350, engineers: 50, done: 200,
    rating: 4, verified: true,
    projects: [
      { title: 'مستشفى السلام', desc: 'مستشفى بسعة 200 سرير مع أحدث التجهيزات الطبية والمعامل.', images: [img(20), img(21), img(22), img(23)], cost: '2,500,000,000 د.ع', area: '8000 م²', year: '2025', materials: [{name:'خرسانة مسلحة',image:img(20)},{name:'دهان مضاد للبكتيريا',image:img(21)},{name:'أرضيات إيبوكسي',image:img(22)},{name:'نوافذ ألمنيوم',image:img(23)}], meta: [{icon:'location_on',label:'الموقع',value:'الرصافة'},{icon:'straighten',label:'المساحة',value:'8000 م²'},{icon:'payments',label:'التكلفة',value:'2,500,000,000 د.ع'}] },
      { title: 'عمارة سكنية فاخرة', desc: 'عمارة سكنية بمساحة 500 م² تحتوي على 12 شقة فاخرة.', images: [img(5), img(6), img(7), img(8)], cost: '850,000,000 د.ع', area: '500 م²', year: '2024', materials: [{name:'رخام أرضيات',image:img(5)},{name:'خشب أبواب',image:img(6)},{name:'دهان جدران',image:img(7)},{name:'نوافذ UPVC',image:img(8)}], meta: [{icon:'location_on',label:'الموقع',value:'الزهراء'},{icon:'straighten',label:'المساحة',value:'500 م²'},{icon:'payments',label:'التكلفة',value:'850,000,000 د.ع'}] },
      { title: 'فيلا النخيل الفاخرة', desc: 'فيلا سكنية فاخرة بمساحة 500 متر مربع مع حديقة ومسبح.', images: [img(1), img(2), img(3)], cost: '450,000,000 د.ع', area: '500 م²', year: '2024', materials: [{name:'رخام',image:img(1)},{name:'زجاج',image:img(2)},{name:'خشب',image:img(3)}], meta: [{icon:'location_on',label:'الموقع',value:'بغداد'},{icon:'straighten',label:'المساحة',value:'500 م²'},{icon:'payments',label:'التكلفة',value:'450,000,000 د.ع'}] },
      { title: 'مبنى الكرادة التجاري', desc: 'مبنى تجاري متكامل من 7 طوابق في قلب بغداد.', images: [img(4), img(5), img(6)], cost: '1,200,000,000 د.ع', area: '2000 م²', year: '2023', materials: [{name:'زجاج واجهات',image:img(4)},{name:'سيراميك',image:img(5)},{name:'دهان',image:img(6)}], meta: [{icon:'location_on',label:'الموقع',value:'الكرادة'},{icon:'straighten',label:'المساحة',value:'2000 م²'},{icon:'payments',label:'التكلفة',value:'1,200,000,000 د.ع'}] }
    ],
    reviews: [
      { name: 'أحمد محمد', rating: 5, text: 'شركة ممتازة ومحترفة. أنجزوا مشروعي في الوقت المحدد وبجودة عالية جداً.', time: 'قبل أسبوع' },
      { name: 'سارة جاسم', rating: 5, text: 'فريق عمل رائع ومبدع. التصاميم الداخلية كانت أجمل مما توقعت.', time: 'قبل أسبوعين' },
      { name: 'خالد العلي', rating: 4, text: 'عمل جيد بشكل عام. الالتزام بالمواعيد كان جيداً.', time: 'قبل شهر' },
      { name: 'نور الهدى', rating: 5, text: 'أفضل شركة مقاولات تعاملت معها.', time: 'قبل شهرين' },
      { name: 'عمران عبد', rating: 4, text: 'جودة البناء ممتازة والأسعار منافسة.', time: 'قبل 3 أشهر' }
    ]
  },

  'شركة الأساس المتين': {
    id: 'co3',
    name: 'شركة الأساس المتين',
    category: 'بناء وإنشاء',
    about: 'متخصصون في بناء الأساسات والأعمدة والهياكل الخرسانية المسلحة.',
    specs: ['أساسات', 'هياكل خرسانية', 'أعمدة', 'قواعد'],
    logo: img(7), cover: img(21),
    workImages: makeWorkImages(21),
    location: 'بغداد', phone: '+964 770 333 4455',
    email: 'info@almatin.com',
    years: 12, workers: 80, engineers: 15, done: 90,
    rating: 4, verified: true,
    projects: makeProjects(4, 21, 'مشروع أساسات', [200, 400, 600, 300], [25000000, 45000000, 70000000, 35000000]),
    reviews: [{ name: 'مهندس علي', rating: 5, text: 'أساسات متينة واحترافية.', time: 'قبل شهر' }]
  },

  /* ===== تشطيبات داخلية ===== */
  'شركة التشطيب الذهبي': {
    id: 'co4', name: 'شركة التشطيب الذهبي',
    category: 'تشطيبات داخلية',
    about: 'متخصصون في التشطيبات الداخلية والخارجية بأعلى جودة.',
    specs: ['تشطيبات داخلية', 'تشطيبات خارجية', 'ديكور'],
    logo: img(13), cover: img(1),
    workImages: makeWorkImages(1),
    location: 'بغداد', phone: '+964 770 444 5566',
    email: 'info@golden-finish.com',
    years: 10, workers: 60, engineers: 10, done: 150,
    rating: 5, verified: true,
    projects: makeProjects(3, 1, 'تشطيب فاخر', [120, 200, 350], [20000000, 35000000, 55000000]),
    reviews: [{ name: 'أبو أحمد', rating: 5, text: 'تشطيب ذهبي فعلاً.', time: 'قبل أسبوع' }]
  },

  'لمسة الجمال': {
    id: 'co5', name: 'لمسة الجمال',
    category: 'تشطيبات داخلية',
    about: 'تشطيبات فاخرة وتصميم داخلي.',
    specs: ['جبس بورد', 'سيراميك', 'باركيه'],
    logo: img(15), cover: img(23),
    workImages: makeWorkImages(23),
    location: 'بغداد', phone: '+964 770 555 6677',
    email: 'info@touching-beauty.com',
    years: 8, workers: 40, engineers: 8, done: 90,
    rating: 4, verified: true,
    projects: makeProjects(3, 23, 'تصميم داخلي', [80, 150, 250], [15000000, 28000000, 42000000]),
    reviews: []
  },

  /* ===== حدائق ولاندسكيب ===== */
  'حدائق الخضراء': {
    id: 'co6', name: 'حدائق الخضراء',
    category: 'حدائق ولاندسكيب',
    about: 'تصميم وتنفيذ الحدائق واللاندسكيب.',
    specs: ['تصميم حدائق', 'ري آلي', 'إنارة حدائق'],
    logo: img(10), cover: img(10),
    workImages: makeWorkImages(10),
    location: 'بغداد', phone: '+964 770 666 7788',
    email: 'info@green-gardens.com',
    years: 12, workers: 25, engineers: 5, done: 80,
    rating: 5, verified: true,
    projects: makeProjects(3, 10, 'حديقة سكنية', [100, 300, 500], [10000000, 25000000, 40000000]),
    reviews: [{ name: 'أبو سارة', rating: 5, text: 'حديقة جميلة وتصميم رائع.', time: 'قبل 3 أسابيع' }]
  },

  'طبيعة للتنسيق': {
    id: 'co7', name: 'طبيعة للتنسيق',
    category: 'حدائق ولاندسكيب',
    about: 'تنسيق حدائق عامة وخاصة.',
    specs: ['تنسيق حدائق', 'زراعة', 'نوافير'],
    logo: img(12), cover: img(14),
    workImages: makeWorkImages(14),
    location: 'بغداد', phone: '+964 770 777 8899',
    email: 'info@tabeea.com',
    years: 7, workers: 18, engineers: 3, done: 50,
    rating: 4, verified: true,
    projects: makeProjects(2, 14, 'تنسيق حديقة', [200, 400], [18000000, 32000000]),
    reviews: []
  },

  /* ===== مسابح ===== */
  'مسابح الأمل': {
    id: 'co8', name: 'مسابح الأمل',
    category: 'مسابح',
    about: 'تصميم وتنفيذ وصيانة المسابح.',
    specs: ['مسابح خرسانية', 'مسابح فيبر', 'صيانة'],
    logo: img(18), cover: img(8),
    workImages: makeWorkImages(8),
    location: 'بغداد', phone: '+964 770 888 9900',
    email: 'info@alamal-pools.com',
    years: 10, workers: 20, engineers: 4, done: 60,
    rating: 4, verified: true,
    projects: makeProjects(3, 8, 'مسبح', [30, 50, 80], [25000000, 40000000, 65000000]),
    reviews: []
  },

  'مياه رائعة': {
    id: 'co9', name: 'مياه رائعة',
    category: 'مسابح',
    about: 'مسابح سكنية وتجارية بتصاميم عصرية.',
    specs: ['مسابح سكنية', 'مسابح تجارية', 'صيانة'],
    logo: img(20), cover: img(2),
    workImages: makeWorkImages(2),
    location: 'بغداد', phone: '+964 770 999 0011',
    email: 'info@raaea-water.com',
    years: 8, workers: 15, engineers: 3, done: 40,
    rating: 4, verified: true,
    projects: makeProjects(2, 2, 'مسبح', [35, 60], [30000000, 50000000]),
    reviews: []
  },

  /* ===== أعمال كهربائية ===== */
  'شركة الكهرباء الحديثة': {
    id: 'co10', name: 'شركة الكهرباء الحديثة',
    category: 'أعمال كهربائية',
    about: 'متخصصون في التأسيسات الكهربائية وأنظمة الطاقة.',
    specs: ['تأسيس كهرباء', 'أنظمة إنذار', 'كاميرات مراقبة'],
    logo: img(21), cover: img(24),
    workImages: makeWorkImages(24),
    location: 'بغداد', phone: '+964 771 111 2233',
    email: 'info@modern-elect.com',
    years: 14, workers: 45, engineers: 12, done: 200,
    rating: 4, verified: true,
    projects: makeProjects(3, 24, 'مشروع كهرباء', [100, 300, 500], [12000000, 25000000, 40000000]),
    reviews: []
  },

  'النور للكهرباء': {
    id: 'co11', name: 'النور للكهرباء',
    category: 'أعمال كهربائية',
    about: 'حلول كهربائية متكاملة.',
    specs: ['تمديدات كهرباء', 'لوحات توزيع', 'طاقة شمسية'],
    logo: img(23), cover: img(28),
    workImages: makeWorkImages(28),
    location: 'بغداد', phone: '+964 771 222 3344',
    email: 'info@alnoor-elect.com',
    years: 20, workers: 70, engineers: 20, done: 300,
    rating: 5, verified: true,
    projects: makeProjects(3, 28, 'مشروع نور', [80, 250, 400], [10000000, 22000000, 38000000]),
    reviews: []
  },

  /* ===== أعمال سباكة ===== */
  'شركة السباكة المحترفة': {
    id: 'co12', name: 'شركة السباكة المحترفة',
    category: 'أعمال سباكة',
    about: 'خدمات سباكة متكاملة من التأسيس إلى الصيانة.',
    specs: ['تأسيس سباكة', 'تمديدات مياه', 'صرف صحي'],
    logo: img(27), cover: img(20),
    workImages: makeWorkImages(20),
    location: 'بغداد', phone: '+964 771 333 4455',
    email: 'info@pro-plumb.com',
    years: 9, workers: 35, engineers: 7, done: 180,
    rating: 4, verified: true,
    projects: makeProjects(3, 20, 'مشروع سباكة', [80, 200, 350], [8000000, 18000000, 30000000]),
    reviews: []
  },

  'المياه الجوفية': {
    id: 'co13', name: 'المياه الجوفية',
    category: 'أعمال سباكة',
    about: 'متخصصون في أنظمة المياه والسباكة.',
    specs: ['أنظمة مياه', 'سباكة عامة', 'خزانات'],
    logo: img(29), cover: img(6),
    workImages: makeWorkImages(6),
    location: 'بغداد', phone: '+964 771 444 5566',
    email: 'info@ground-water.com',
    years: 6, workers: 20, engineers: 4, done: 100,
    rating: 4, verified: true,
    projects: makeProjects(2, 6, 'نظام مياه', [100, 250], [15000000, 28000000]),
    reviews: []
  },

  /* ===== تكييف وتوفية ===== */
  'تكييفات بغداد': {
    id: 'co14', name: 'تكييفات بغداد',
    category: 'تكييف وتوفية',
    about: 'تركيب وصيانة أنظمة التكييف والتبريد.',
    specs: ['تكييف مركزي', 'سبليت', 'صيانة دورية'],
    logo: img(2), cover: img(14),
    workImages: makeWorkImages(14),
    location: 'بغداد', phone: '+964 771 555 6677',
    email: 'info@baghdad-ac.com',
    years: 12, workers: 30, engineers: 8, done: 250,
    rating: 5, verified: true,
    projects: makeProjects(3, 14, 'تكييف', [50, 150, 300], [5000000, 15000000, 35000000]),
    reviews: [{ name: 'أبو عمر', rating: 5, text: 'تركيب ممتاز وسعر منافس.', time: 'قبل أسبوعين' }]
  },

  'climatech': {
    id: 'co15', name: 'climatech',
    category: 'تكييف وتوفية',
    about: 'حلول تكييف متكاملة بأفضل الأسعار.',
    specs: ['تكييف', 'تبريد', 'تهوية'],
    logo: img(4), cover: img(8),
    workImages: makeWorkImages(8),
    location: 'بغداد', phone: '+964 771 666 7788',
    email: 'info@climatech.com',
    years: 8, workers: 22, engineers: 6, done: 150,
    rating: 4, verified: true,
    projects: makeProjects(2, 8, 'نظام تكييف', [60, 180], [8000000, 22000000]),
    reviews: []
  },

  /* ===== واجهات والمنيوم ===== */
  'واجهات الحديثة': {
    id: 'co16', name: 'واجهات الحديثة',
    category: 'واجهات والمنيوم',
    about: 'تصميم وتنفيذ واجهات زجاجية وألمنيوم.',
    specs: ['واجهات زجاج', 'ألمنيوم', 'كرتونيد'],
    logo: img(6), cover: img(18),
    workImages: makeWorkImages(18),
    location: 'بغداد', phone: '+964 771 777 8899',
    email: 'info@modern-facades.com',
    years: 15, workers: 50, engineers: 10, done: 120,
    rating: 4, verified: true,
    projects: makeProjects(3, 18, 'واجهة', [200, 400, 600], [30000000, 50000000, 80000000]),
    reviews: []
  },

  'زجاج وميتال': {
    id: 'co17', name: 'زجاج وميتال',
    category: 'واجهات والمنيوم',
    about: 'واجهات عصرية بأحدث التصاميم.',
    specs: ['واجهات زجاجية', 'هياكل معدنية', 'ألمنيوم'],
    logo: img(8), cover: img(12),
    workImages: makeWorkImages(12),
    location: 'بغداد', phone: '+964 771 888 9900',
    email: 'info@glass-metal.com',
    years: 10, workers: 35, engineers: 7, done: 80,
    rating: 4, verified: true,
    projects: makeProjects(2, 12, 'واجهة', [150, 300], [25000000, 45000000]),
    reviews: []
  },

  /* ===== تصميم داخلي ===== */
  'طرق العراق': {
    id: 'co18', name: 'طرق العراق',
    category: 'تصميم داخلي',
    about: 'بناء وترميم الطرق والترصيف.',
    specs: ['أعمال ترصيف', 'أسفلت', 'جبس'],
    logo: img(9), cover: img(15),
    workImages: makeWorkImages(15),
    location: 'بغداد', phone: '+964 771 999 0011',
    email: 'info@toroq-iraq.com',
    years: 20, workers: 100, engineers: 15, done: 90,
    rating: 4, verified: true,
    projects: makeProjects(3, 15, 'طريق', [1000, 2000, 500], [80000000, 150000000, 50000000]),
    reviews: []
  },

  'البنية التحتية': {
    id: 'co19', name: 'البنية التحتية',
    category: 'تصميم داخلي',
    about: 'مشاريع البنية التحتية والطرق العامة.',
    specs: ['بنية تحتية', 'طرق', 'جسور'],
    logo: img(11), cover: img(5),
    workImages: makeWorkImages(5),
    location: 'بغداد', phone: '+964 772 111 2233',
    email: 'info@albinya.com',
    years: 15, workers: 80, engineers: 12, done: 60,
    rating: 4, verified: true,
    projects: makeProjects(2, 5, 'مشروع بنية تحتية', [500, 1500], [60000000, 120000000]),
    reviews: []
  },

  /* ===== شركة الإنشاءات الوطنية (مضافة من home.html) ===== */
  'شركة الإنشاءات الوطنية': {
    id: 'co20', name: 'شركة الإنشاءات الوطنية',
    category: 'بناء وإنشاء',
    about: 'شركة رائدة في مجال الإنشاءات والمقاولات العامة، متخصصة في المشاريع التجارية والسكنية الكبرى.',
    specs: ['أبنية تجارية', 'أبراج', 'مشاريع سكنية', 'استشارات هندسية'],
    logo: img(25), cover: img(26),
    workImages: makeWorkImages(26),
    location: 'بغداد - شارع فلسطين',
    phone: '+964 772 222 3344',
    email: 'info@national-const.com',
    years: 22, workers: 280, engineers: 45, done: 180,
    rating: 5, verified: true,
    projects: [
      { title: 'برج الأعمال', desc: 'برج إداري بارتفاع 20 طابقاً مع واجهة زجاجية عصرية.', images: [img(24), img(25), img(26), img(27)], cost: '5,000,000,000 د.ع', area: '12000 م²', year: '2025', materials: [{name:'واجهة زجاجية',image:img(24)},{name:'صلب إنشائي',image:img(25)},{name:'جرانيت',image:img(26)},{name:'مصاعد أوتيس',image:img(27)}], meta: [{icon:'location_on',label:'الموقع',value:'شارع فلسطين'},{icon:'straighten',label:'المساحة',value:'12000 م²'},{icon:'payments',label:'التكلفة',value:'5,000,000,000 د.ع'}] },
      { title: 'مجمع النخيل التجاري', desc: 'مجمع تجاري متكامل يضم 50 محلاً تجارياً ومطاعم.', images: [img(1), img(2), img(3), img(4)], cost: '4,000,000,000 د.ع', area: '5000 م²', year: '2024', materials: [{name:'زجاج واجهات',image:img(1)},{name:'سيراميك أرضيات',image:img(2)},{name:'دهان ديكوري',image:img(3)},{name:'ألمنيوم',image:img(4)}], meta: [{icon:'location_on',label:'الموقع',value:'الكرادة'},{icon:'straighten',label:'المساحة',value:'5000 م²'},{icon:'payments',label:'التكلفة',value:'4,000,000,000 د.ع'}] },
      { title: 'مكتب حديث', desc: 'مكتب إداري حديث بمساحة 200 م² مع تجهيزات متكاملة.', images: [img(13), img(14), img(15), img(16)], cost: '350,000,000 د.ع', area: '200 م²', year: '2024', materials: [{name:'قسم داخلي زجاجي',image:img(13)},{name:'سقف معلق',image:img(14)},{name:'أرضيات خشبية',image:img(15)},{name:'إضاءة LED',image:img(16)}], meta: [{icon:'location_on',label:'الموقع',value:'الرصافة'},{icon:'straighten',label:'المساحة',value:'200 م²'},{icon:'payments',label:'التكلفة',value:'350,000,000 د.ع'}] }
    ],
    reviews: [
      { name: 'علي حسن', rating: 5, text: 'شركة محترفة أنجزت برج الأعمال بجودة ممتازة.', time: 'قبل شهر' },
      { name: 'مها جابر', rating: 5, text: 'تصاميم عصرية وتنفيذ دقيق.', time: 'قبل شهرين' }
    ]
  }

};

/* ===== التصنيفات (للتنقل في صفحة تنفيذ) ===== */
var categoriesList = [
  { name: 'بناء وإنشاء', image: img(1), companies: ['شركة البناء الحديث', 'مقاولون العرب', 'شركة الأساس المتين'] },
  { name: 'تشطيبات داخلية', image: img(6), companies: ['شركة التشطيب الذهبي', 'لمسة الجمال'] },
  { name: 'حدائق ولاندسكيب', image: img(16), companies: ['حدائق الخضراء', 'طبيعة للتنسيق'] },
  { name: 'مسابح', image: img(17), companies: ['مسابح الأمل', 'مياه رائعة'] },
  { name: 'أعمال كهربائية', image: img(18), companies: ['شركة الكهرباء الحديثة', 'النور للكهرباء'] },
  { name: 'أعمال سباكة', image: img(19), companies: ['شركة السباكة المحترفة', 'المياه الجوفية'] },
  { name: 'تكييف وتوفية', image: img(20), companies: ['تكييفات بغداد', 'climatech'] },
  { name: 'واجهات والمنيوم', image: img(21), companies: ['واجهات الحديثة', 'زجاج وميتال'] },
  { name: 'تصميم داخلي', image: img(22), companies: ['طرق العراق', 'البنية التحتية'] }
];

/* ===== وظائف البحث ===== */
function getCompanyByName(name) {
  return companiesData[name] || null;
}

function getCompanyProjects(name) {
  var c = getCompanyByName(name);
  return c ? (c.projects || []) : [];
}
