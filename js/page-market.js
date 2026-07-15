

document.getElementById('header').innerHTML = renderHeader({ searchVModel: 'searchQuery' });
        var hdrCart = document.getElementById('headerCartBtn');
        if (hdrCart) {
            hdrCart.addEventListener('click', function(e) {
                e.preventDefault();
                window.dispatchEvent(new CustomEvent('mkt-toggle-cart'));
            });
        }

        var cartParam = new URLSearchParams(window.location.search).get('cart');
        var autoOpenCart = cartParam === '1';

        document.getElementById('bottomNav').innerHTML = renderNav('market');

        var allImgs = [];
        for (var n = 1; n <= 31; n++) allImgs.push('images/img' + n + '.jpg');
        function rndImg(seed) { return allImgs[seed % 31]; }

        const { createApp, ref, computed, watch, nextTick, onMounted, onUnmounted } = Vue;

        createApp({
            setup() {
                initTheme();

                var activeCatView = ref(null);
                watch(activeCatView, function(v) { if (v !== null && v !== undefined) nextTick(function() { var e = document.querySelector('.page-content'); if (e) e.scrollTop = 0; }); });
                var cartView = ref(autoOpenCart);
                watch(cartView, function(v) { if (v) nextTick(function() { var e = document.querySelector('.page-content'); if (e) e.scrollTop = 0; }); });
                var calculatorView = ref(false);
                watch(calculatorView, function(v) {
                    if (v) nextTick(function() { var e = document.querySelector('.page-content'); if (e) e.scrollTop = 0; });
                    if (!v) { calcDone.value = false; calcLength.value = ''; calcWidth.value = ''; calcHeight.value = ''; totalArea.value = 0; areaWithWaste.value = 0; tileCount.value = 0; matchedProducts.value = []; paintDoors.value = 0; paintWindows.value = 0; paintArea.value = 0; paintNetArea.value = 0; paintLiters.value = 0; paintBuckets.value = 0; paintMatched.value = []; gypsumArea.value = 0; gypsumAreaWithWaste.value = 0; gypsumSheets.value = 0; gypsumMatched.value = []; }
                });
                var checkoutView = ref(false);
                watch(checkoutView, function(v) { if (v) nextTick(function() { var e = document.querySelector('.page-content'); if (e) e.scrollTop = 0; }); });
                var searchQuery = ref('');
                var cart = ref([]);
                loadCart();
                var projTypeOpen = ref(false);
                var selectedProjType = ref('');
                var mktSlide = ref(0);
                var catSlide = ref(0);
                var mktTimer = null;
                var showAllView = ref(false);
                watch(showAllView, function(v) { if (v) nextTick(function() { var e = document.querySelector('.page-content'); if (e) e.scrollTop = 0; }); });
                var showAllSuppliers = ref(false);
                watch(showAllSuppliers, function(v) { if (v) nextTick(function() { var e = document.querySelector('.page-content'); if (e) e.scrollTop = 0; }); });

                window.__openCart = function() {
                    cartView.value = true;
                    productDetailView.value = false;
                };

                var checkoutName = ref('');
                var checkoutPhone = ref('');
                var checkoutGov = ref('');
                var checkoutAddress = ref('');
                var checkoutNotes = ref('');
                var governorates = ref(['بغداد', 'البصرة', 'نينوى', 'أربيل', 'كركوك', 'النجف', 'كربلاء', 'السليمانية', 'ديالى', 'واسط', 'ميسان', 'ذي قار', 'المثنى', 'القادسية', 'بابل', 'صلاح الدين', 'الأنبار', 'دهوك']);

                var selectedProduct = ref(null);
                var selectedColor = ref(0);
                var selectedSize = ref(0);
                var selectedFinish = ref(0);
                var selectedQty = ref(1);
                var modalSlide = ref(0);
                var productDetailView = ref(false);
                watch(productDetailView, function(v) { if (v) nextTick(function() { var e = document.querySelector('.page-content'); if (e) e.scrollTop = 0; }); });

                var viewerOpen = ref(false);
                var viewerImages = ref([]);
                var viewerIndex = ref(0);

                var projTypes = ref(['فيلا سكنية', 'عمارة سكنية', 'محل تجاري', 'مكتب إداري', 'مستودع', 'مسجد']);

                var categories = ref([
                    { name: 'مواد انشائية', icon: 'foundation' },
                    { name: 'اصباغ وديكور', icon: 'format_paint' },
                    { name: 'صحيات', icon: 'plumbing' },
                    { name: 'كهرباء', icon: 'bolt' },
                    { name: 'أبواب ونوافذ', icon: 'door_front' },
                    { name: 'تكييفات', icon: 'air' },
                    { name: 'حدائق', icon: 'yard' },
                    { name: 'أدوات ومعدات', icon: 'handyman' }
                ]);

                var sliderImages = ref([
                    { img: 'images/img1.jpg', title: 'عروض مواد البناء', desc: 'خصومات تصل إلى 40% على جميع المنتجات' },
                    { img: 'images/img6.jpg', title: 'سيراميك وبلاط', desc: 'تشكيلة واسعة من أجود أنواع السيراميك' },
                    { img: 'images/img11.jpg', title: 'أدوات كهربائية', desc: 'جميع الأدوات الكهربائية من أفضل الماركات' },
                    { img: 'images/img16.jpg', title: 'صبغ متميز', desc: 'صبغ داخلية وخارجية بأحدث الألوان' }
                ]);

                function makeProduct(name, price, catIdx, rating, prodIdx, opts) {
                    opts = opts || {};
                    var images = [];
                    for (var j = 0; j < 5; j++) images.push(rndImg((prodIdx + j * 7) % 31));
                    return {
                        name: name, price: price, cat: catIdx, rating: rating,
                        img: rndImg(prodIdx), images: images,
                        colors: opts.colors || [{ name: 'أبيض', hex: '#ffffff' }, { name: 'رمادي', hex: '#9e9e9e' }, { name: 'أسود', hex: '#212121' }], sizes: opts.sizes || ['1 لتر', '4 لتر', '18 لتر'],
                        finishTypes: opts.finishTypes || ['مطفي', 'نصف لامع', 'لامع'],
                        boxes: opts.boxes || '', desc: opts.desc || name + ' من أجود المواد المتاحة في السوق العراقي.',
                        oldPrice: 0, discount: 0,
                        brand: opts.brand || '',
                        supplierName: opts.supplierName || 'متجر بنيان',
                        stock: opts.stock !== undefined ? opts.stock : true,
                        reviewsCount: opts.reviewsCount || 0
                    };
                }

                var allProducts = ref([
                    makeProduct('إسمنت أخضر 50 كجم', 18000, 0, 5, 1, { boxes: 'كيس واحد = 50 كجم', desc: 'إسمنت بورتلاندي أخضر عالي الجودة، مناسب لجميع الأعمال الإنشائية.' }),
                    makeProduct('حديد تسليح 12 مم', 350000, 0, 5, 3, { sizes: ['12 مم', '14 مم', '16 مم'], boxes: 'حزمة = 12 قطعة', desc: 'حديد تسليح عالي المقاومة، مناسب للخرسانة المسلحة.' }),
                    makeProduct('حصى ناعم 1 م³', 95000, 0, 4, 5, { boxes: '1 م³', desc: 'حصى ناعم مناسب للخرسانة والطابوق.' }),
                    makeProduct('رمل ساخن 1 م³', 75000, 0, 4, 7, { boxes: '1 م³', desc: 'رمل ساخن نقي مناسب للبناء والطابوق.' }),
                    makeProduct('طوب أحمر عادي', 45000, 0, 4, 9, { boxes: '1000 طوبة', desc: 'طوب أحمر عالي الجودة للأعمال الإنشائية.' }),
                    makeProduct('بلاط بورسلان 60x60', 22000, 1, 5, 2, {
                        colors: [{ name: 'أبيض', hex: '#f5f5f5' }, { name: 'رمادي', hex: '#9e9e9e' }, { name: 'بيج', hex: '#d4c5a9' }, { name: 'أسود', hex: '#212121' }],
                        sizes: ['60x60', '80x80', '100x100'],
                        boxes: '4 قطع / صندوق = 1.44 م²',
                        desc: 'بلاط بورسلان عالي الجودة بلمعان طبيعي، مناسب للأرضيات.'
                    }),
                    makeProduct('سيراميك أرضي 30x30', 14000, 1, 4, 33, {
                        colors: [{ name: 'بيج', hex: '#d4c5a9' }, { name: 'رمادي', hex: '#9e9e9e' }, { name: 'أبيض', hex: '#f5f5f5' }],
                        sizes: ['30x30'],
                        boxes: '10 قطع / صندوق = 0.9 م²',
                        desc: 'سيراميك أرضي مقاوم للخدش مناسب للممرات والغرف.'
                    }),
                    makeProduct('بلاط بورسلان 120x60', 28000, 1, 5, 34, {
                        colors: [{ name: 'رمادي غامق', hex: '#616161' }, { name: 'بيج', hex: '#d4c5a9' }, { name: 'أبيض', hex: '#fafafa' }],
                        sizes: ['120x60'],
                        boxes: '2 قطع / صندوق = 1.44 م²',
                        desc: 'بلاط بورسلان كبير القياس عصري للصالات والقاعات الفاخرة.'
                    }),
                    makeProduct('دهان جوتن داخلي', 45000, 1, 5, 4, {
                        colors: [{ name: 'أبيض', hex: '#ffffff' }, { name: 'كريمي', hex: '#f5e6cc' }, { name: 'رمادي فاتح', hex: '#e0e0e0' }, { name: 'أزرق فاتح', hex: '#bbdefb' }, { name: 'أخضر فاتح', hex: '#c8e6c9' }],
                        sizes: ['6 لتر', '12 لتر', '18 لتر'],
                        boxes: 'دلو = 20 لتر يكفي 20 م²',
                        desc: 'دهان جوتن داخلي مقاوم للرطوبة، ألوان متعددة.'
                    }),
                    makeProduct('لوح جبس اعتيادي', 18000, 1, 4, 6, {
                        sizes: ['240 × 120 سم'],
                        boxes: 'لوح واحد = 2.88 م²',
                        desc: 'الواح جبس بورد اعتيادي مناسب للأسقف المعلقة والجدران.'
                    }),
                    makeProduct('لوح جبس مقاوم للرطوبة', 24000, 1, 4, 35, {
                        sizes: ['240 × 120 سم'],
                        boxes: 'لوح واحد = 2.88 م²',
                        desc: 'الواح جبس بورد مقاوم للماء مناسب للحمامات والمطابخ.'
                    }),
                    makeProduct('لوح جبس مقاوم للحريق', 28000, 1, 4, 36, {
                        sizes: ['240 × 120 سم'],
                        boxes: 'لوح واحد = 2.88 م²',
                        desc: 'الواح جبس بورد مقاوم للحريق للأماكن التي تتطلب أمان عالي.'
                    }),
                    makeProduct('دهان نيبون ديكوري', 38000, 1, 5, 8, {
                        colors: [{ name: 'ذهبي', hex: '#c9a243' }, { name: 'نحاسي', hex: '#b87333' }, { name: 'فضي', hex: '#c0c0c0' }, { name: 'أبيض لامع', hex: '#f8f8f8' }],
                        sizes: ['6 لتر', '12 لتر', '18 لتر'],
                        boxes: 'دلو = 1 لتر',
                        desc: 'دهان نيبون ديكوري بتأثيرات ميتاليك فاخرة.'
                    }),
                    makeProduct('سيراميك حمام 30x60', 15000, 1, 4, 10, {
                        colors: [{ name: 'أبيض', hex: '#f5f5f5' }, { name: 'أزرق', hex: '#42a5f5' }, { name: 'أخضر', hex: '#66bb6a' }],
                        sizes: ['30x60', '25x40'],
                        boxes: '8 قطع / صندوق = 1.44 م²',
                        desc: 'سيراميك مقاوم للماء مناسب للحمامات والمطابخ.'
                    }),
                    makeProduct('حوض استحمام كربيست', 350000, 2, 5, 12, {
                        colors: [{ name: 'أبيض', hex: '#ffffff' }, { name: 'كريمي', hex: '#f5e6cc' }],
                        boxes: 'حوض واحد',
                        desc: 'حوض استحمام كربيست فاخر بتصميم عصري.'
                    }),
                    makeProduct('خزان مياه بلاستيك', 180000, 2, 4, 14, {
                        sizes: ['500 لتر', '1000 لتر', '2000 لتر'],
                        boxes: 'خزان واحد',
                        desc: 'خزان مياه بلاستيك مقاوم للعوامل الجوية.'
                    }),
                    makeProduct('أنابيب PVC 4 بوصة', 8000, 2, 4, 16, { boxes: 'أنبوب = 6 م', desc: 'أنابيب PVC مناسبة للصرف الصحي.' }),
                    makeProduct('مغسلة حوض', 250000, 2, 5, 18, {
                        colors: [{ name: 'أبيض', hex: '#ffffff' }, { name: 'رمادي', hex: '#9e9e9e' }],
                        boxes: 'حوض واحد',
                        desc: 'مغسلة سيراميك فاخرة بتصميم عصري.'
                    }),
                    makeProduct('شطاف حمام', 95000, 2, 4, 20, { boxes: 'شطاف واحد', desc: 'شطاف حمام بجودة عالية.' }),
                    makeProduct('كابل كهرباء 2.5 مم', 5000, 3, 4, 22, { sizes: ['2.5 مم', '4 مم', '6 مم'], boxes: 'لولب = 100 م', desc: 'كابل نحاسي عالي الجودة.' }),
                    makeProduct('قاطع كهربائي 20 أمبير', 15000, 3, 5, 24, { sizes: ['10 أمبير', '16 أمبير', '20 أمبير', '32 أمبير'], boxes: 'قاطع واحد', desc: 'قاطع دائرة كهربائي أمان عالي.' }),
                    makeProduct('لوحة توزيع 12 مصباح', 180000, 3, 4, 26, { boxes: 'لوحة واحدة', desc: 'لوحة توزيع كهربائي 12 مصباح.' }),
                    makeProduct('مفتاح ربط لاسلكي', 25000, 3, 5, 28, { colors: [{ name: 'أبيض', hex: '#ffffff' }, { name: 'بيج', hex: '#d4c5a9' }], boxes: 'مفتاح واحد', desc: 'مفتاح ربط لاسلكي ذكي.' }),
                    makeProduct('براقة LED 18 واط', 12000, 3, 5, 30, {
                        colors: [{ name: 'أبيض بارد', hex: '#e3f2fd' }, { name: 'أبيض دافئ', hex: '#fff8e1' }],
                        sizes: ['12 واط', '18 واط', '24 واط'],
                        boxes: 'براقة واحدة',
                        desc: 'براقة LED موفرة للطاقة.'
                    }),
                    makeProduct('باب خشب زان', 450000, 4, 5, 0, {
                        colors: [{ name: 'بني غامق', hex: '#5d4037' }, { name: 'بني فاتح', hex: '#8d6e63' }, { name: 'أبيض', hex: '#ffffff' }],
                        sizes: ['90x210', '100x210'],
                        boxes: 'باب + إطار',
                        desc: 'باب خشب زان طبيعي فاخر.'
                    }),
                    makeProduct('نافذة ألمنيوم', 280000, 4, 4, 2, {
                        colors: [{ name: 'فضي', hex: '#c0c0c0' }, { name: 'أسود', hex: '#212121' }, { name: 'بني', hex: '#795548' }],
                        sizes: ['120x120', '150x120'],
                        boxes: 'نافذة كاملة',
                        desc: 'نافذة ألمنيوم بزجاج مزدوج.'
                    }),
                    makeProduct('باب حديد مصفح', 550000, 4, 5, 4, {
                        colors: [{ name: 'بني', hex: '#795548' }, { name: 'كحلي', hex: '#37474f' }, { name: 'أبيض', hex: '#ffffff' }],
                        sizes: ['90x210', '100x210'],
                        boxes: 'باب + إطار + مفصلات',
                        desc: 'باب حديد مصفح مقاوم للسرقة.'
                    }),
                    makeProduct('ستارة ألمنيوم', 120000, 4, 4, 6, { sizes: ['1 م', '1.5 م', '2 م'], boxes: 'ستارة واحدة', desc: 'ستارة ألمنيوم للنوافذ.' }),
                    makeProduct('مفصلة باب', 8000, 4, 4, 8, { colors: [{ name: 'فضي', hex: '#c0c0c0' }, { name: 'ذهبي', hex: '#c9a243' }], boxes: '2 مفصلة', desc: 'مفصلة باب حديدية متينة.' }),
                    makeProduct('تكييف سبليت 1 طن', 850000, 5, 5, 10, { sizes: ['1 طن', '1.5 طن', '2 طن'], boxes: 'وحدة داخلية + خارجية', desc: 'تكييف سبليت موفر للطاقة.' }),
                    makeProduct('مكيف شباك 18000 BTU', 650000, 5, 5, 12, { sizes: ['12000 BTU', '18000 BTU', '24000 BTU'], boxes: 'وحدة واحدة', desc: 'مكيف شباك قوي التبريد.' }),
                    makeProduct('فريون R410A', 45000, 5, 4, 14, { boxes: 'سطل = 10 كجم', desc: 'فريون R410A صديق للبيئة.' }),
                    makeProduct('أنابيب تكييف', 12000, 5, 4, 16, { sizes: ['1/4 بوصة', '3/8 بوصة', '1/2 بوصة'], boxes: 'لولب = 15 م', desc: 'أنابيب نحاسي للتكييف.' }),
                    makeProduct('فلاشة تكييف', 25000, 5, 4, 18, { boxes: 'فلاشة واحدة', desc: 'فلاشة تكييف متعددة الاستخدامات.' }),
                    makeProduct('شلال حدائق', 350000, 6, 5, 20, { boxes: 'شلال واحد', desc: 'شلال ديكوري للحدائق.' }),
                    makeProduct('عشب صناعي 1 م²', 25000, 6, 4, 22, { sizes: ['1 م²', '2 م²', '5 م²'], boxes: '1 لفافة', desc: 'عشب صناعي عالي الجودة.' }),
                    makeProduct('نافورة ديكورية', 180000, 6, 5, 24, { boxes: 'نافورة واحدة', desc: 'نافورة ديكورية متوهجة.' }),
                    makeProduct('إضاءة حدائق LED', 35000, 6, 4, 26, { boxes: '5 مصابيح', desc: 'إضاءة LED مقاومة للماء.' }),
                    makeProduct('خزان مياه زراعي', 95000, 6, 4, 28, { sizes: ['200 لتر', '500 لتر'], boxes: 'خزان واحد', desc: 'خزان مياه للري.' }),
                    makeProduct('مثقف يدوي', 45000, 7, 5, 30, { boxes: 'مثقف واحد', desc: 'مثقف يدوي متعدد الاستخدامات.' }),
                    makeProduct('مفتاح ربط كهربائي', 35000, 7, 4, 1, { sizes: ['30 أمبير', '60 أمبير'], boxes: 'مفتاح واحد', desc: 'مفتاح ربط كهربائي صناعي.' }),
                    makeProduct('شريط قياس 5 متر', 12000, 7, 4, 3, { boxes: 'شريط واحد', desc: 'شريط قياس مرن ومتين.' }),
                    makeProduct('مطرقة', 25000, 7, 5, 5, { boxes: 'مطرقة واحدة', desc: 'مطرقة يدوية متعددة الاستخدامات.' }),
                    makeProduct('منشار يدوي', 35000, 7, 4, 7, { boxes: 'منشار واحد', desc: 'منشار يدوي لقطع الخشب والمعادن.' })
                ]);

                var topProducts = computed(function() {
                    return allProducts.value.filter(function(p) { return p.rating === 5; }).slice(0, 8);
                });
                var allTopProducts = computed(function() {
                    return allProducts.value.filter(function(p) { return p.rating === 5; });
                });

                var catProducts = computed(function() {
                    if (activeCatView.value === null) return [];
                    return allProducts.value.filter(function(p) { return p.cat === activeCatView.value; });
                });

                var showAllOffers = ref(false);
                watch(showAllOffers, function(v) { if (v) nextTick(function() { var e = document.querySelector('.page-content'); if (e) e.scrollTop = 0; }); });
                var selectedSupplier = ref(null);
                var suppliers = ref([
                    { name: 'مؤسسة البناء الحديث', logo: rndImg(3), projects: '1,200+', location: 'بغداد', rating: '4.8', phone: '07711223344', email: 'info@modernbuild.iq', specialties: ['حديد', 'إسمنت', 'مواد عازلة', 'بلاط'], desc: 'مؤسسة رائدة في توريد مواد البناء منذ 25 عاماً.' },
                    { name: 'شركة البصرة للمواد', logo: rndImg(7), projects: '850+', location: 'البصرة', rating: '4.6', phone: '07755667788', email: 'sales@basramaterials.iq', specialties: ['خشب', 'دهانات', 'أدوات صحية', 'سيراميك'], desc: 'شركة متخصصة في توريد مواد البناء والدهانات.' },
                    { name: 'دير الصناعة', logo: rndImg(11), projects: '2,500+', location: 'أربيل', rating: '4.9', phone: '07501234567', email: 'info@deeralsenaa.iq', specialties: ['أدوات كهربائية', 'معدات بناء', 'عدد يدوية', 'إضاءة'], desc: 'الوكيل الحصري لأكبر العلامات التجارية.' },
                    { name: 'مجموعة الفرات للتجارة', logo: rndImg(15), projects: '1,800+', location: 'النجف', rating: '4.7', phone: '07801234567', email: 'info@alfurat.iq', specialties: ['سيراميك', 'بلاط', 'أدوات صحية', 'رخام'], desc: 'مجموعة رائدة في توريد السيراميك والرخام والأدوات الصحية.' },
                    { name: 'شركة الشرق الأوسط للحديد', logo: rndImg(19), projects: '3,200+', location: 'كركوك', rating: '4.9', phone: '07799887766', email: 'info@middleeaststeel.iq', specialties: ['حديد', 'معادن', 'هياكل حديدية', 'أسياخ'], desc: 'أكبر مورد للحديد والمعادن في شمال العراق.' },
                    { name: 'مؤسسة الرافدين للكهرباء', logo: rndImg(23), projects: '950+', location: 'بغداد', rating: '4.5', phone: '07655443322', email: 'info@rafidain.iq', specialties: ['أجهزة كهربائية', 'كابلات', 'مفاتيح', 'إضاءة'], desc: 'متخصصون في توريد الأجهزة الكهربائية والإضاءة.' },
                    { name: 'شركة العمران للدهانات', logo: rndImg(27), projects: '1,500+', location: 'أربيل', rating: '4.8', phone: '07506667788', email: 'info@omranpaints.iq', specialties: ['دهانات', 'معاجين', 'عوازل', 'دهانات ديكورية'], desc: 'وكيل معتمد لأشهر ماركات الدهانات العالمية.' },
                    { name: 'مكتبة البناء الخضراء', logo: rndImg(31), projects: '600+', location: 'السليمانية', rating: '4.4', phone: '07701234599', email: 'info@greenbuild.iq', specialties: ['مواد عازلة', 'طاقة شمسية', 'ألمنيوم', 'زجاج'], desc: 'متخصصون في مواد البناء الخضراء والطاقة المتجددة.' }
                ]);

                var offers = ref([
                    { name: 'دهان جوتن 20 لتر', price: 35000, oldPrice: 50000, discount: 30, rating: 5, img: rndImg(4), cat: 1, images: [rndImg(4), rndImg(5), rndImg(6)], colors: [{ name: 'أبيض', hex: '#ffffff' }, { name: 'كريمي', hex: '#f5e6cc' }], sizes: ['4 لتر', '20 لتر'], finishTypes: ['مطفي', 'نصف لامع'], stock: true, reviewsCount: 0, supplierName: 'متجر بنيان', brand: '' },
                    { name: 'بلاط بورسلان 80x80', price: 28000, oldPrice: 40000, discount: 30, rating: 5, img: rndImg(10), cat: 1, images: [rndImg(10), rndImg(11), rndImg(12)], colors: [{ name: 'أبيض', hex: '#f5f5f5' }, { name: 'رمادي', hex: '#9e9e9e' }], sizes: ['60x60', '80x80'], finishTypes: ['لامع', 'مطفي'], stock: true, reviewsCount: 0, supplierName: 'متجر بنيان', brand: '' },
                    { name: 'تكييف سبليت 1.5 طن', price: 750000, oldPrice: 950000, discount: 21, rating: 5, img: rndImg(15), cat: 5, images: [rndImg(15), rndImg(16), rndImg(17)], colors: [{ name: 'أبيض', hex: '#ffffff' }], sizes: ['1 طن', '1.5 طن', '2 طن'], finishTypes: ['سبليت'], stock: true, reviewsCount: 0, supplierName: 'متجر بنيان', brand: '' },
                    { name: 'حوض استحمام فاخر', price: 280000, oldPrice: 400000, discount: 30, rating: 5, img: rndImg(20), cat: 2, images: [rndImg(20), rndImg(21), rndImg(22)], colors: [{ name: 'أبيض', hex: '#ffffff' }, { name: 'كريمي', hex: '#f5e6cc' }], sizes: ['قياسي'], finishTypes: ['سيراميك'], stock: true, reviewsCount: 0, supplierName: 'متجر بنيان', brand: '' },
                    { name: 'باب خشب زان فاخر', price: 380000, oldPrice: 500000, discount: 24, rating: 5, img: rndImg(0), cat: 4, images: [rndImg(0), rndImg(1), rndImg(2)], colors: [{ name: 'بني غامق', hex: '#5d4037' }, { name: 'بني فاتح', hex: '#8d6e63' }], sizes: ['90x210', '100x210'], finishTypes: ['مطفي', 'لامع'], stock: true, reviewsCount: 0, supplierName: 'متجر بنيان', brand: '' }
                ]);

                function saveCart() {
                    var filtered = cart.value.filter(function(c) { return c && c.qty > 0; });
                    if (filtered.length !== cart.value.length) {
                        cart.value = filtered;
                    }
                    var saveData = filtered.map(function(item) {
                        return {
                            name: item.name,
                            baseName: item.baseName,
                            price: item.price,
                            img: item.img,
                            qty: item.qty,
                            colorIdx: item.colorIdx,
                            colorName: item.colorName,
                            finishIdx: item.finishIdx,
                            finishName: item.finishName,
                            sizeIdx: item.sizeIdx,
                            sizeName: item.sizeName,
                            productName: item.productName
                        };
                    });
                    if (!saveData.length) {
                        localStorage.removeItem('bunean-market-cart');
                        var fc = document.querySelector('.mkt-floating-cart');
                        if (fc) fc.remove();
                    } else {
                        localStorage.setItem('bunean-market-cart', JSON.stringify(saveData));
                        updateFloatingCartBadge(filtered);
                    }
                }

                function updateFloatingCartBadge(items) {
                    var fc = document.querySelector('.mkt-floating-cart');
                    var count = items.length;
                    if (fc) {
                        var badge = fc.querySelector('.mkt-cart-badge');
                        if (badge) badge.textContent = count;
                    } else {
                        initFloatingCart();
                        fc = document.querySelector('.mkt-floating-cart');
                    }
                    if (fc && (cartView.value || checkoutView.value)) {
                        fc.style.display = 'none';
                    }
                }

                function loadCart() {
                    var saved = localStorage.getItem('bunean-market-cart');
                    if (saved) {
                        try { cart.value = JSON.parse(saved); } catch(e) { cart.value = []; }
                    }
                }

                function findOriginalProduct(baseName) {
                    for (var i = 0; i < allProducts.value.length; i++) {
                        if (allProducts.value[i].name === baseName) return allProducts.value[i];
                    }
                    for (var j = 0; j < offers.value.length; j++) {
                        if (offers.value[j].name === baseName) return offers.value[j];
                    }
                    return null;
                }

                watch(cart, function() {
                    saveCart();
                }, { deep: true });

                function selectCat(i) {
                    activeCatView.value = i;
                    catSlide.value = 0;
                }

                function openProduct(p) {
                    selectedProduct.value = p;
                    selectedColor.value = 0;
                    selectedSize.value = 0;
                    selectedFinish.value = 0;
                    selectedQty.value = 1;
                    modalSlide.value = 0;
                    showAllView.value = false;
                    showAllOffers.value = false;
                    showAllSuppliers.value = false;
                    activeCatView.value = null;
                    cartView.value = false;
                    calculatorView.value = false;
                    checkoutView.value = false;
                    productDetailView.value = true;
                }

                function openCalcProduct(p) {
                    openProduct(p);
                    /* ضبط المقاس المختار تلقائياً ليطابق مقاس الحاسبة */
                    var dimMatch = selectedTileLabel.value.replace(' سم', '').replace('×', 'x');
                    if (p.sizes && p.sizes.length) {
                        for (var si = 0; si < p.sizes.length; si++) {
                            if (p.sizes[si].trim() === dimMatch.trim()) {
                                selectedSize.value = si;
                                break;
                            }
                        }
                    }
                    /* ضبط الكمية = عدد الكراتين المحسوبة */
                    var tpb = getTilesPerBox(p, selectedTileLabel.value);
                    var boxes = Math.ceil(tileCount.value / tpb);
                    if (boxes > 0) selectedQty.value = boxes;
                }

                function openFromCart(item) {
                    var orig = findOriginalProduct(item.productName || item.baseName || item.name);
                    if (orig) {
                        openProduct(orig);
                        if (item.colorIdx !== undefined) selectedColor.value = item.colorIdx;
                        if (item.sizeIdx !== undefined) selectedSize.value = item.sizeIdx;
                        if (item.finishIdx !== undefined) selectedFinish.value = item.finishIdx;
                        if (item.qty) selectedQty.value = item.qty;
                    } else {
                        showBrandAlert('لم نتمكن من فتح تفاصيل هذا المنتج');
                    }
                }

                function openSupplier(s) {
                    selectedSupplier.value = s;
                }

                function closeSupplier() {
                    selectedSupplier.value = null;
                }

                function addToCartFromModal() {
                    requireAccount(function() {
                    var p = selectedProduct.value;
                    if (!p) return;
                    var label = p.name;
                    if (p.colors && p.colors.length) label += ' - ' + p.colors[selectedColor.value].name;
                    if (p.sizes && p.sizes.length) label += ' (' + p.sizes[selectedSize.value] + ')';
                    var exists = cart.value.find(function(c) { return c.name === label; });
                    if (exists) { exists.qty += selectedQty.value; }
                    else { cart.value.push({ name: label, price: p.price, img: p.img, qty: selectedQty.value }); }
                    saveCart();
                    selectedProduct.value = null;
                    });
                }

                function addToCart(p) {
                    requireAccount(function() {
                    var exists = cart.value.find(function(c) { return c.name === p.name; });
                    if (exists) { exists.qty++; }
                    else { cart.value.push({ name: p.name, baseName: p.name, price: p.price, img: p.img, qty: 1, productName: p.name }); }
                    saveCart();
                    showBrandAlert('تمت الإضافة إلى السلة ✓');
                    });
                }

                function closeProductDetail() {
                    productDetailView.value = false;
                    selectedProduct.value = null;
                }

                function addToCartFromDetail() {
                    requireAccount(function() {
                    var p = selectedProduct.value;
                    if (!p) return;
                    var label = p.name;
                    var colorName = '';
                    var finishName = '';
                    var sizeName = '';
                    if (p.colors && p.colors.length) { colorName = p.colors[selectedColor.value].name; label += ' - ' + colorName; }
                    if (p.finishTypes && p.finishTypes.length) { finishName = p.finishTypes[selectedFinish.value]; label += ' (' + finishName + ')'; }
                    if (p.sizes && p.sizes.length) { sizeName = p.sizes[selectedSize.value]; label += ' [' + sizeName + ']'; }
                    var exists = cart.value.find(function(c) { return c.name === label; });
                    if (exists) {
                        showBrandAlert('هذا المنتج موجود بالفعل في السلة');
                        return;
                    }
                    cart.value.push({
                        name: label, baseName: p.name, price: p.price, img: p.img,
                        qty: selectedQty.value, productName: p.name,
                        colorIdx: selectedColor.value, colorName: colorName,
                        finishIdx: selectedFinish.value, finishName: finishName,
                        sizeIdx: selectedSize.value, sizeName: sizeName
                    });
                    saveCart();
                    showBrandAlert('تم إضافة المنتج إلى سلة المشتريات ✓');
                    closeProductDetail();
                    });
                }

                var filteredCatProducts = computed(function() {
                    if (activeCatView.value === null) return [];
                    return allProducts.value.filter(function(p) { return p.cat === activeCatView.value; });
                });

                var prodGalleryTouch = (function() {
                    var sx = 0;
                    return {
                        onTouchStart: function(e) { sx = e.touches[0].clientX; },
                        onTouchEnd: function(e) {
                            if (!selectedProduct.value) return;
                            var dx = e.changedTouches[0].clientX - sx;
                            var len = selectedProduct.value.images.length;
                            if (Math.abs(dx) > 40) {
                                modalSlide.value = (modalSlide.value + (dx < 0 ? 1 : -1) + len) % len;
                            }
                        }
                    };
                })();

                var cartCount = computed(function() {
                    return cart.value.length;
                });

                var cartSubtotal = computed(function() {
                    var total = 0;
                    cart.value.forEach(function(c) { total += c.price * c.qty; });
                    return total.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
                });

                var cartTotal = computed(function() {
                    var sub = 0;
                    cart.value.forEach(function(c) { sub += c.price * c.qty; });
                    return sub.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
                });

                /* ---- حاسبة السيراميك - مقاسات ثابتة ---- */
                const TILE_SIZES = [
                    { label: '30×30 سم', value: 30, tilesPerM2: 11.11, tilesPerBox: 10 },
                    { label: '60×60 سم', value: 60, tilesPerM2: 2.75, tilesPerBox: 4 },
                    { label: '80×80 سم', value: 80, tilesPerM2: 1.56, tilesPerBox: 3 },
                    { label: '120×60 سم', value: 120, tilesPerM2: 1.39, tilesPerBox: 2 }
                ];
                function getTilesPerBox(product, sizeLabel) {
                    /* تفضيل القيمة الثابتة من TILE_SIZES حسب المقاس */
                    for (var i = 0; i < TILE_SIZES.length; i++) {
                        if (TILE_SIZES[i].label === sizeLabel) return TILE_SIZES[i].tilesPerBox;
                    }
                    /* محاولة قراءة عدد القطع من product.boxes كاحتياطي */
                    var box = product.boxes || '';
                    var m = box.match(/(\d+)\s*قطع/);
                    if (m) return parseInt(m[1], 10);
                    return 4;
                }

                var calcLength = ref('');
                var calcWidth = ref('');
                var calcHeight = ref('');
                var calcDone = ref(false);
                var selectedCalcType = ref((function() { try { return localStorage.getItem('bunean-calc-type') || 'ceramic'; } catch(e) { return 'ceramic'; } })());
                watch(selectedCalcType, function(v) { try { localStorage.setItem('bunean-calc-type', v); } catch(e) {} });

                function goToCalc() {
                    if (!selectedCalcType.value) return;
                    requireAccount(function() {
                        calculatorView.value = true;
                    });
                }

                /* ---- متغيرات السيراميك ---- */
                var selectedTileLabel = ref(TILE_SIZES[0].label);
                var selectedTilesPerM2 = ref(TILE_SIZES[0].tilesPerM2);
                var wastePercent = ref((function() {
                    try { var c = JSON.parse(localStorage.getItem('bunean-calc-config')); return (c && c.wastePercent) ? c.wastePercent : 10; } catch(e) { return 10; }
                })());
                var totalArea = ref(0);
                var areaWithWaste = ref(0);
                var tileCount = ref(0);
                var matchedProducts = ref([]);

                var ceramicArea = ref(0);
                var ceramicBoxes = ref(0);
                var ceramicWaste = ref(0);
                var ceramicType = ref('floor');
                var paintArea = ref(0);
                var paintNetArea = ref(0);
                var paintLiters = ref(0);
                var paintBuckets = ref(0);
                var paintDoors = ref(0);
                var paintWindows = ref(0);
                var paintMatched = ref([]);
                var paintWaste = ref(0);
                var gypsumArea = ref(0);
                var gypsumAreaWithWaste = ref(0);
                var gypsumSheets = ref(0);
                var gypsumType = ref('ceiling');
                var gypsumMatched = ref([]);
                var gypsumWaste = ref(0);

                function selectTileSize(label) {
                    selectedTileLabel.value = label;
                    for (var i = 0; i < TILE_SIZES.length; i++) {
                        if (TILE_SIZES[i].label === label) {
                            selectedTilesPerM2.value = TILE_SIZES[i].tilesPerM2;
                            break;
                        }
                    }
                }

                function findMatchingTileProducts(sizeValue) {
                    /* sizeValue comes as the label e.g. "30×30 سم" → extract first dim */
                    var dim = sizeValue.split('×')[0].trim();
                    return allProducts.value.filter(function(p) {
                        var name = p.name.toLowerCase();
                        if (!name.includes('سيراميك') && !name.includes('بلاط') && !name.includes('بورسلان')) return false;
                        if (!p.sizes || !p.sizes.length) return false;
                        return p.sizes.some(function(s) {
                            /* s is like "60x60" – normalise both sides */
                            return s.replace('x', '×').startsWith(dim + '×');
                        });
                    });
                }

                function findMatchingPaintProducts() {
                    return allProducts.value.filter(function(p) {
                        var name = p.name.toLowerCase();
                        return name.includes('دهان');
                    });
                }

                function openPaintProduct(p) {
                    openProduct(p);
                    selectedQty.value = paintBuckets.value;
                }

                function findMatchingGypsumProducts() {
                    return allProducts.value.filter(function(p) {
                        var name = p.name.toLowerCase();
                        return name.includes('جبس');
                    });
                }

                function openGypsumProduct(p) {
                    openProduct(p);
                    selectedQty.value = gypsumSheets.value;
                }

                function doCalc() {
                    var l = parseFloat(calcLength.value) || 0;
                    var w = parseFloat(calcWidth.value) || 0;
                    if (l <= 0 || w <= 0) { showBrandAlert('أدخل الأبعاد بشكل صحيح'); return; }

                    var floorArea = l * w;
                    var wallArea = 2 * (l + w) * (parseFloat(calcHeight.value) || 0);
                    var cAreaRaw = ceramicType.value === 'wall' ? wallArea : floorArea;
                    var tpm = selectedTilesPerM2.value;
                    var wp = wastePercent.value / 100;
                    var aww = Math.ceil(cAreaRaw * (1 + wp));
                    var tc = Math.ceil(aww * tpm);

                    totalArea.value = cAreaRaw;
                    areaWithWaste.value = aww;
                    tileCount.value = tc;

                    /* حاسبة السيراميك - باقي الحسابات */
                    var cArea = Math.ceil(cAreaRaw * 1.1);
                    var cBoxes = Math.ceil(cArea / 3);
                    ceramicArea.value = cArea;
                    ceramicBoxes.value = cBoxes;
                    ceramicWaste.value = cArea - cAreaRaw;

                    /* حاسبة الدهان */
                    var h = parseFloat(calcHeight.value) || 0;
                    var wallArea = 2 * (l + w) * h;
                    var doors = parseInt(paintDoors.value) || 0;
                    var windows = parseInt(paintWindows.value) || 0;
                    var doorArea = doors * 2;
                    var windowArea = windows * 1.5;
                    var netArea = wallArea - doorArea - windowArea;
                    if (netArea < 0) netArea = 0;
                    var liters = Math.ceil(netArea / 10);
                    var bucketSize = 20;
                    var buckets = Math.ceil(liters / bucketSize);
                    paintArea.value = Math.ceil(wallArea);
                    paintNetArea.value = Math.ceil(netArea);
                    paintLiters.value = liters;
                    paintBuckets.value = buckets;
                    paintMatched.value = findMatchingPaintProducts();

                    /* حاسبة الجبس */
                    var h = parseFloat(calcHeight.value) || 0;
                    var gArea = 0;
                    if (gypsumType.value === 'ceiling') {
                        gArea = l * w;
                    } else if (gypsumType.value === 'walls') {
                        gArea = 2 * (l + w) * h;
                    } else {
                        gArea = (l * w) + (2 * (l + w) * h);
                    }
                    var gAreaWithWaste = Math.ceil(gArea * 1.1);
                    var gSheets = Math.ceil(gAreaWithWaste / 2.88);
                    gypsumArea.value = Math.ceil(gArea);
                    gypsumAreaWithWaste.value = gAreaWithWaste;
                    gypsumSheets.value = gSheets;
                    gypsumMatched.value = findMatchingGypsumProducts();

                    /* منتجات مقترحة */
                    matchedProducts.value = findMatchingTileProducts(selectedTileLabel.value);

                    calcDone.value = true;
                }

                function copyCalcResult() {
                    var lines = [];
                    if (selectedCalcType.value === 'ceramic') {
                        lines.push('سيراميك - ' + selectedTileLabel.value);
                        lines.push('المساحة الكلية: ' + totalArea.value + ' م²');
                        lines.push('المساحة بعد الهدر (' + wastePercent.value + '%): ' + areaWithWaste.value + ' م²');
                        lines.push('عدد البلاطات المطلوبة: ' + tileCount.value + ' بلاطة');
                    } else if (selectedCalcType.value === 'paint') {
                        lines.push('صبغ');
                        lines.push('مساحة الجدران الكلية: ' + paintArea.value + ' م²');
                        lines.push('المساحة الصافية: ' + paintNetArea.value + ' م²');
                        lines.push('كمية الصبغ: ' + paintLiters.value + ' لتر');
                        lines.push('عدد العبوات: ' + paintBuckets.value + ' دلو (20 لتر)');
                    } else if (selectedCalcType.value === 'gypsum') {
                        lines.push('الالواح جبس: ' + gypsumSheets.value + ' لوح (شامل الهدر)');
                    } else {
                        lines.push('سيراميك: ' + ceramicBoxes.value + ' صندوق (شامل الهدر)');
                        lines.push('صبغ: ' + paintBuckets.value + ' دلو | ' + (paintBuckets.value * 20) + ' لتر');
                        lines.push('الالواح جبس: ' + gypsumSheets.value + ' لوح (شامل الهدر)');
                    }
                    navigator.clipboard.writeText(lines.join('\n')).then(function() {
                        showBrandAlert('تم نسخ النتيجة');
                    }).catch(function() {
                        showBrandAlert('فشل النسخ');
                    });
                }

                function openViewer(idx) {
                    if (!selectedProduct.value) return;
                    viewerImages.value = selectedProduct.value.images;
                    viewerIndex.value = idx || 0;
                    viewerOpen.value = true;
                }
                function nextViewer() { viewerIndex.value = (viewerIndex.value + 1) % viewerImages.value.length; }
                function prevViewer() { viewerIndex.value = (viewerIndex.value - 1 + viewerImages.value.length) % viewerImages.value.length; }

                var viewerTouch = (function() {
                    var sx = 0;
                    return {
                        onTouchStart: function(e) { sx = e.touches[0].clientX; },
                        onTouchEnd: function(e) {
                            var dx = e.changedTouches[0].clientX - sx;
                            if (Math.abs(dx) > 50) { dx < 0 ? nextViewer() : prevViewer(); }
                        }
                    };
                })();

                function cancelCart() {
                    if (cart.value.length === 0) return;
                    var existing = document.querySelector('.brand-alert-overlay');
                    if (existing) existing.remove();
                    var overlay = document.createElement('div');
                    overlay.className = 'brand-alert-overlay';
                    var modal = document.createElement('div');
                    modal.className = 'brand-alert-modal';
                    modal.setAttribute('onclick', 'event.stopPropagation()');
                    var icon = document.createElement('div');
                    icon.className = 'brand-alert-icon-wrap';
                    icon.innerHTML = '<span class="material-symbols-outlined brand-alert-icon" style="color:#e74c3c;">warning</span>';
                    var text = document.createElement('p');
                    text.className = 'brand-alert-text';
                    text.textContent = 'هل أنت متأكد من إلغاء السلة بالكامل؟';
                    var btnRow = document.createElement('div');
                    btnRow.style.cssText = 'display:flex;gap:10px;width:100%;';
                    var cancelBtn = document.createElement('button');
                    cancelBtn.className = 'brand-alert-btn';
                    cancelBtn.textContent = 'إلغاء';
                    cancelBtn.style.cssText = 'flex:1;background:none;border:1px solid var(--border-light);color:var(--text-light);';
                    cancelBtn.setAttribute('onclick', 'this.closest(\'.brand-alert-overlay\').remove()');
                    var confirmBtn = document.createElement('button');
                    confirmBtn.className = 'brand-alert-btn';
                    confirmBtn.textContent = 'نعم';
                    confirmBtn.style.cssText = 'flex:1;background:#e74c3c;';
                    confirmBtn.setAttribute('onclick', 'this.closest(\'.brand-alert-overlay\').remove()');
                    confirmBtn.onclick = function() {
                        overlay.remove();
                        cart.value = [];
                        saveCart();
                        showBrandAlert('تم إلغاء السلة بالكامل');
                    };
                    btnRow.appendChild(cancelBtn);
                    btnRow.appendChild(confirmBtn);
                    modal.appendChild(icon);
                    modal.appendChild(text);
                    modal.appendChild(btnRow);
                    overlay.appendChild(modal);
                    document.body.appendChild(overlay);
                }

                function confirmOrder() {
                    requireAccount(function() {
                    showBrandAlert('تم تأكيد طلبك بنجاح! سيتم التواصل معك قريباً.');
                    cart.value = [];
                    cartView.value = false;
                    checkoutView.value = false;
                    saveCart();
                    });
                }

                function resetMktTimer() {
                    if (mktTimer) clearInterval(mktTimer);
                    mktTimer = setInterval(function() { mktSlide.value = (mktSlide.value + 1) % sliderImages.value.length; }, 3000);
                }

                var sliderTouch = (function() {
                    var sx = 0, sy = 0;
                    return {
                        onTouchStart: function(e) { sx = e.touches[0].clientX; sy = e.touches[0].clientY; },
                        onTouchEnd: function(e) {
                            var dx = e.changedTouches[0].clientX - sx;
                            if (Math.abs(dx) > 40) {
                                var len = sliderImages.value.length;
                                mktSlide.value = (mktSlide.value + (dx < 0 ? 1 : -1) + len) % len;
                                resetMktTimer();
                            }
                        }
                    };
                })();

                var catSliderTouch = (function() {
                    var sx = 0;
                    return {
                        onTouchStart: function(e) { sx = e.touches[0].clientX; },
                        onTouchEnd: function(e) {
                            var dx = e.changedTouches[0].clientX - sx;
                            if (Math.abs(dx) > 40) {
                                var len = catProducts.value.length;
                                catSlide.value = (catSlide.value + (dx < 0 ? 1 : -1) + len) % len;
                            }
                        }
                    };
                })();

                // State preservation on refresh only
                var isReload = false;
                try { isReload = performance.getEntriesByType('navigation')[0].type === 'reload'; } catch(e) {}
                try { if (performance.navigation && performance.navigation.type === 1) isReload = true; } catch(e) {}
                function saveMarketState() {
                    preserveState('market', {
                        cartView: cartView.value,
                        checkoutView: checkoutView.value,
                        calculatorView: calculatorView.value,
                        showAllView: showAllView.value,
                        showAllOffers: showAllOffers.value,
                        showAllSuppliers: showAllSuppliers.value
                    });
                }
                if (isReload) {
                    var savedMarket = restoreState('market');
                    if (savedMarket) {
                        if (savedMarket.cartView) cartView.value = true;
                        if (savedMarket.checkoutView) checkoutView.value = true;
                        if (savedMarket.calculatorView) calculatorView.value = true;
                        if (savedMarket.showAllView) showAllView.value = true;
                        if (savedMarket.showAllOffers) showAllOffers.value = true;
                        if (savedMarket.showAllSuppliers) showAllSuppliers.value = true;
                    }
                }
                window.addEventListener('beforeunload', saveMarketState);

                /* ---- Back Button ---- */
                function handlePopState() {}

                onMounted(function() {
                    PullToRefresh.init();
                    BackNav.init();
                    BackNav.registerCloseHandler(function() {
                        if (viewerOpen && viewerOpen.value) { viewerOpen.value = false; return true; }
                        if (productDetailView && productDetailView.value) { productDetailView.value = false; return true; }
                        if (selectedProduct && selectedProduct.value) { selectedProduct.value = null; return true; }
                        if (checkoutView && checkoutView.value) { checkoutView.value = false; return true; }
                        if (cartView && cartView.value) { cartView.value = false; return true; }
                        if (calculatorView && calculatorView.value) { calculatorView.value = false; return true; }
                        if (showAllView && showAllView.value) { showAllView.value = false; return true; }
                        if (showAllOffers && showAllOffers.value) { showAllOffers.value = false; return true; }
                        if (showAllSuppliers && showAllSuppliers.value) { showAllSuppliers.value = false; return true; }
                        if (activeCatView && activeCatView.value !== null) { activeCatView.value = null; return true; }
                        if (selectedSupplier && selectedSupplier.value) { closeSupplier(); return true; }
                        return false;
                    });
                    resetMktTimer();
                    window.addEventListener('mkt-toggle-cart', function() {
                        if (cartView.value) {
                            cartView.value = false;
                        } else {
                            requireAccount(function() {
                                cartView.value = true;
                                productDetailView.value = false;
                                calculatorView.value = false;
                                checkoutView.value = false;
                            });
                        }
                    });
                    history.pushState({ action: 'init' }, '');
                });
                onUnmounted(function() {
                    if (mktTimer) clearInterval(mktTimer);
                    window.removeEventListener('beforeunload', saveMarketState);
                });

                watch([cartView, checkoutView], function() {
                    var el = document.querySelector('.mkt-floating-cart');
                    if (el && (cartView.value || checkoutView.value)) {
                        el.style.display = 'none';
                    } else if (el) {
                        el.style.display = '';
                    }
                }, { immediate: true });

                return {
                    categories, searchQuery, activeCatView, cartView, calculatorView, checkoutView,
                    sliderImages, mktSlide, sliderTouch, resetMktTimer, catSlide, catSliderTouch,
                    allProducts, topProducts, allTopProducts, suppliers, offers, showAllView, showAllOffers, showAllSuppliers,
                    catProducts, filteredCatProducts, selectCat, openProduct, addToCart,
                    cart, cartCount, cartSubtotal, cartTotal, saveCart,
                    calcLength, calcWidth, calcHeight, calcDone, doCalc, selectedCalcType, goToCalc,
                    TILE_SIZES, selectedTileLabel, selectedTilesPerM2, wastePercent,
                    totalArea, areaWithWaste, tileCount, matchedProducts,
                    selectTileSize, findMatchingTileProducts, getTilesPerBox, openCalcProduct,
                    ceramicArea, ceramicBoxes, ceramicWaste, ceramicType,
                    paintArea, paintNetArea, paintLiters, paintBuckets, paintDoors, paintWindows, paintMatched, paintWaste, findMatchingPaintProducts, openPaintProduct,
                    gypsumArea, gypsumAreaWithWaste, gypsumSheets, gypsumType, gypsumMatched, gypsumWaste, findMatchingGypsumProducts, openGypsumProduct,
                    copyCalcResult, confirmOrder, cancelCart,
                    checkoutName, checkoutPhone, checkoutGov, checkoutAddress, checkoutNotes, governorates,
                    selectedProduct, selectedColor, selectedSize, selectedFinish, selectedQty, modalSlide,
                    addToCartFromModal, openViewer, nextViewer, prevViewer,
                    viewerOpen, viewerImages, viewerIndex, viewerTouch,
                    selectedSupplier, openSupplier, closeSupplier,
                    productDetailView, closeProductDetail, addToCartFromDetail, prodGalleryTouch,
                    openFromCart,
                    fmt,
                    requireAccount, goTo
                };
            }
        }).mount('#app');

initFloatingCart();
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('sw.js')
                .then(function() { console.log('SW registered'); })
                .catch(function() { console.log('SW registration failed'); });
        }