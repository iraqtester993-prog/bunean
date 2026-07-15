document.getElementById('header').innerHTML = renderHeader({ searchVModel: 'searchQuery', searchPlaceholder: 'ابحث عن مشاريع، مقاولين، منتجات...' });
        document.getElementById('bottomNav').innerHTML = renderNav('home');

        const { createApp, ref, computed, onMounted, onUnmounted } = Vue;

        var _vueApp = createApp({
            setup() {
                initTheme();

                var myData = (function() { try { return JSON.parse(localStorage.getItem('bunean-user-data')); } catch(e) { return null; } })();
                const isCompany = myData && myData.role === 'company';

                const searchQuery = ref('');
                const currentSlide = ref(0);
                const modalSlide = ref(0);
                const selectedProject = ref(null);
                const projectDetail = ref(null);
                const detailSlide = ref(0);
                const viewerOpen = ref(false);
                const viewerImages = ref([]);
                const viewerIndex = ref(0);
                const modalPullY = ref(0);
                const modalClosing = ref(false);
                const adSlide = ref(0);
                let slideTimer = null;
                let adTimer = null;

                /* ---- Unified Touch Handlers ---- */
                // Modal: horizontal → navigate slides, vertical down → close
                const modalTouch = (() => {
                    let sx = 0, sy = 0;
                    return {
                        onTouchStart(e) {
                            sx = e.touches[0].clientX;
                            sy = e.touches[0].clientY;
                            modalPullY.value = 0;
                        },
                        onTouchMove(e) {
                            const dy = e.touches[0].clientY - sy;
                            if (dy > 0) modalPullY.value = dy * 0.5;
                        },
                        onTouchEnd(e) {
                            const dx = e.changedTouches[0].clientX - sx;
                            const dy = e.changedTouches[0].clientY - sy;
                            if (Math.abs(dy) > Math.abs(dx) && dy > 100) {
                                closeModal();
                            } else if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 40) {
                                if (selectedProject.value) {
                                    const next = modalSlide.value + (dx < 0 ? 1 : -1);
                                    const len = selectedProject.value.images.length;
                                    if (next >= 0 && next < len) modalSlide.value = next;
                                }
                            } else {
                                modalPullY.value = 0;
                            }
                        }
                    };
                })();
                const detailSwipe = (() => {
                    let sx = 0, sy = 0;
                    return {
                        onTouchStart(e) {
                            sx = e.touches[0].clientX;
                            sy = e.touches[0].clientY;
                        },
                        onTouchMove(e) { },
                        onTouchEnd(e) {
                            const dx = e.changedTouches[0].clientX - sx;
                            const dy = e.changedTouches[0].clientY - sy;
                            if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 40) {
                                if (projectDetail.value) {
                                    const next = detailSlide.value + (dx < 0 ? 1 : -1);
                                    const len = projectDetail.value.images.length;
                                    if (next >= 0 && next < len) detailSlide.value = next;
                                }
                            }
                        }
                    };
                })();
                // Hero slider: horizontal swipe only
                const heroSwipe = (() => {
                    let sx = 0, sy = 0;
                    return {
                        onTouchStart(e) { const t = e.touches[0]; sx = t.clientX; sy = t.clientY; },
                        onTouchEnd(e) {
                            const dx = e.changedTouches[0].clientX - sx;
                            const dy = e.changedTouches[0].clientY - sy;
                            if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 40) {
                                const len = slides.value.length;
                                currentSlide.value = (currentSlide.value + (dx < 0 ? 1 : -1) + len) % len;
                            }
                        }
                    };
                })();
                // Ad slider: horizontal swipe only
                const adSwipe = (() => {
                    let sx = 0, sy = 0;
                    return {
                        onTouchStart(e) { const t = e.touches[0]; sx = t.clientX; sy = t.clientY; },
                        onTouchEnd(e) {
                            const dx = e.changedTouches[0].clientX - sx;
                            const dy = e.changedTouches[0].clientY - sy;
                            if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 40) {
                                const len = ads.value.length;
                                adSlide.value = (adSlide.value + (dx < 0 ? 1 : -1) + len) % len;
                                resetAdTimer();
                            }
                        }
                    };
                })();
                const viewerScale = ref(1);
                const viewerPanX = ref(0);
                const viewerPanY = ref(0);
                // Viewer: horizontal → navigate, vertical down → close, pinch→zoom, double-tap→zoom
                const viewerTouch = (() => {
                    let sx = 0, sy = 0, dist0 = 0, isPinch = false, lastTap = 0;
                    return {
                        onTouchStart(e) {
                            if (e.touches.length === 2) {
                                isPinch = true;
                                dist0 = Math.hypot(e.touches[0].clientX - e.touches[1].clientX, e.touches[0].clientY - e.touches[1].clientY);
                                return;
                            }
                            isPinch = false;
                            sx = e.touches[0].clientX;
                            sy = e.touches[0].clientY;
                            const now = Date.now();
                            if (now - lastTap < 300) {
                                if (viewerScale.value > 1.1) { viewerScale.value = 1; viewerPanX.value = 0; viewerPanY.value = 0; }
                                else { viewerScale.value = 2.5; viewerPanX.value = 0; viewerPanY.value = 0; }
                            }
                            lastTap = now;
                        },
                        onTouchMove(e) {
                            if (e.touches.length === 2 && isPinch) {
                                const d = Math.hypot(e.touches[0].clientX - e.touches[1].clientX, e.touches[0].clientY - e.touches[1].clientY);
                                const s = d / (dist0 || 1);
                                viewerScale.value = Math.max(1, Math.min(5, viewerScale.value * (1 + (s - 1) * 0.5)));
                                dist0 = d; return;
                            }
                            if (viewerScale.value > 1.1) {
                                viewerPanX.value += (e.touches[0].clientX - sx);
                                viewerPanY.value += (e.touches[0].clientY - sy);
                                sx = e.touches[0].clientX; sy = e.touches[0].clientY;
                            }
                        },
                        onTouchEnd(e, onClose) {
                            if (isPinch) { isPinch = false; return; }
                            if (viewerScale.value > 1.1) return;
                            const dx = e.changedTouches[0].clientX - sx;
                            const dy = e.changedTouches[0].clientY - sy;
                            if (Math.abs(dy) > Math.abs(dx) && dy > 80) {
                                if (onClose) onClose(); else closeViewer();
                            } else if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 40) {
                                const next = viewerIndex.value + (dx < 0 ? 1 : -1);
                                const len = viewerImages.value.length;
                                if (next >= 0 && next < len) { viewerIndex.value = next; viewerScale.value = 1; viewerPanX.value = 0; viewerPanY.value = 0; }
                            }
                        }
                    };
                })();
                const pullTransform = computed(() => {
                    if (modalClosing.value) return 'translateY(100%)';
                    if (modalPullY.value > 0) return `translateY(${modalPullY.value}px)`;
                    return '';
                });

                /* ---- Back Button (History API) ---- */
                function handlePopState() {}

                /* ---- Data ---- */
                const slides = ref([
                    {
                        title: 'ابنِ مستقبلك مع بنيان',
                        desc: 'منصة متكاملة للبناء والمقاولات ومواد البناء',
                        bg: 'images/img1.jpg'
                    },
                    {
                        title: 'تصميم داخلي احترافي',
                        desc: 'حول مساحتك إلى تحفة مع أفضل المصممين',
                        bg: 'images/img16.jpg'
                    },
                    {
                        title: 'تشطيب بأعلى جودة',
                        desc: 'نضمن لك تشطيب متقن حسب المواصفات',
                        bg: 'images/img6.jpg'
                    },
                    {
                        title: 'سوق مواد البناء',
                        desc: 'أفضل الأسعار من أشهر الموردين',
                        bg: 'images/img11.jpg'
                    },
                    {
                        title: 'استشارات هندسية',
                        desc: 'خبراء في التصميم والإشراف على المشاريع',
                        bg: 'images/img24.jpg'
                    }
                ]);

                const sections = computed(function() {
                    return [
                        isCompany ? { name: 'عروض<br>المستخدمين', icon: 'request_quote', link: 'account.html?section=company-offers' } : { name: 'طلب عرض سعر', icon: 'request_quote', link: 'quotes.html?type=quote' },
                        { name: 'تصميم داخلي', icon: 'chair', link: 'execute.html?cat=تصميم%20داخلي' },
                        { name: 'تشطيب', icon: 'format_paint', link: 'execute.html?cat=تشطيبات%20داخلية' },
                        { name: 'شراء مواد', icon: 'storefront', link: 'market.html' },
                        isCompany ? { name: 'احجز إعلانك', icon: 'campaign', link: 'account.html?section=company-ads' } : { name: 'طلب استشارة', icon: 'engineering', link: 'quotes.html?type=consult' }
                    ];
                });

                function normalizeAd(ad) {
                    var imgs = ad.images && ad.images.length ? ad.images : (ad.image ? [ad.image] : ['images/img1.jpg']);
                    var mat = ad.materials || [];
                    var meta = [];
                    if (ad.location) meta.push({ icon: 'location_on', label: 'الموقع', value: ad.location });
                    if (ad.area) meta.push({ icon: 'straighten', label: 'المساحة', value: ad.area });
                    if (ad.deliveryDate) meta.push({ icon: 'calendar_month', label: 'تاريخ التسليم', value: ad.deliveryDate });
                    return {
                        title: ad.title || 'إعلان',
                        company: ad.company || '',
                        companyLink: ad.company ? 'company.html?id=' + encodeURIComponent(ad.company) : '',
                        bg: imgs[0],
                        images: imgs,
                        details: ad.desc || ad.details || '',
                        meta: meta,
                        materials: mat,
                        type: ad.type || 'مشروع'
                    };
                }
                const loadedAds = (function() {
                    var all = [];
                    // Hardcoded ads
                    all.push(normalizeAd({ type: 'مشروع', title: 'مجمع النخيل السكني', company: 'شركة البناء الحديث', bg: 'images/img1.jpg', images: ['images/img1.jpg','images/img2.jpg','images/img3.jpg','images/img4.jpg','images/img5.jpg'], desc: 'مشروع مجمع سكني متكامل يضم 50 وحدة سكنية بمواصفات عالية الجودة، مع حدائق خاصة ومواقف سيارات ومسابح. تم التنفيذ باستخدام أحدث تقنيات البناء.', location: 'حي النرجس', area: '5000 م²', deliveryDate: '2025', materials: [{ name: 'طابوق عازل', image: 'images/img1.jpg' },{ name: 'سيراميك بورسلين', image: 'images/img2.jpg' },{ name: 'خشب زان', image: 'images/img3.jpg' }] }));
                    all.push(normalizeAd({ type: 'عرض خاص', title: 'فيلا العندس السكنية', company: 'مقاولون العرب', bg: 'images/img6.jpg', images: ['images/img6.jpg','images/img7.jpg','images/img8.jpg','images/img9.jpg','images/img10.jpg'], desc: 'تصميم عصري لفيلا سكنية بمساحة 400 م²، تحتوي على طابقين مع سطح ومسبح خاص. تم استخدام أجود مواد التشطيب.', location: 'الكرادة', area: '400 م²', deliveryDate: '2024', materials: [{ name: 'رخام أرضيات', image: 'images/img6.jpg' },{ name: 'دهان ديكوري', image: 'images/img7.jpg' },{ name: 'زجاج سيكوريت', image: 'images/img8.jpg' },{ name: 'ألمنيوم نوافذ', image: 'images/img9.jpg' }] }));
                    all.push(normalizeAd({ type: 'تخفيض', title: 'مول بغداد التجاري', company: 'شركة الإنشاءات الوطنية', bg: 'images/img11.jpg', images: ['images/img11.jpg','images/img12.jpg','images/img13.jpg','images/img14.jpg','images/img15.jpg'], desc: 'مركز تجاري ضخم يضم أكثر من 100 متجر ومطعم، مع مواقف سيارات تتسع لـ 500 سيارة. تم تنفيذه على مساحة 15000 م².', location: 'المنصور', area: '15000 م²', deliveryDate: '2026', materials: [{ name: 'واجهة زجاجية', image: 'images/img11.jpg' },{ name: 'جرانيت', image: 'images/img12.jpg' },{ name: 'صلب إنشائي', image: 'images/img13.jpg' },{ name: 'خرسانة مسلحة', image: 'images/img14.jpg' }] }));
                    // Load user-submitted ads from company profiles
                    try {
                        Object.keys(localStorage).forEach(function(k) {
                            if (k === 'bunean-company-profile') {
                                var data = JSON.parse(localStorage.getItem(k));
                                if (data && data.ads) {
                                    data.ads.forEach(function(ad) {
                                        if (ad.status === 'مقبول') all.push(normalizeAd(ad));
                                    });
                                }
                            }
                        });
                    } catch(e) {}
                    return all;
                })();
                const ads = ref(loadedAds);

                var latestWorksBase = ref([
                    {
                        title: 'قصر المنصور السكني',
                        type: 'سكني',
                        companyVerified: false,
                        company: 'شركة البناء الحديث',
                        companyLink: 'company.html?id=' + encodeURIComponent('شركة البناء الحديث'),
                        bg: 'images/img16.jpg',
                        images: [
                            'images/img16.jpg',
                            'images/img17.jpg',
                            'images/img18.jpg',
                            'images/img19.jpg'
                        ],
                        details: 'قصر فاخر بمساحة 1000 م² مع تصاميم داخلية مستوحاة من الطراز الأندلسي الحديث.',
                        cost: '750,000,000 د.ع',
                        meta: [
                            { icon: 'location_on', label: 'الموقع', value: 'المنصور' },
                            { icon: 'straighten', label: 'المساحة', value: '1000 م²' }
                        ],
                        materials: [
                            { name: 'رخام كارارا', image: 'images/img16.jpg' },
                            { name: 'خشب زان', image: 'images/img17.jpg' },
                            { name: 'زجاج سيكوريت', image: 'images/img18.jpg' },
                            { name: 'سيراميك بورسلين', image: 'images/img19.jpg' }
                        ]
                    },
                    {
                        title: 'مستشفى السلام',
                        type: 'طبي',
                        companyVerified: false,
                        company: 'مقاولون العرب',
                        companyLink: 'company.html?id=' + encodeURIComponent('مقاولون العرب'),
                        bg: 'images/img20.jpg',
                        images: [
                            'images/img20.jpg',
                            'images/img21.jpg',
                            'images/img22.jpg',
                            'images/img23.jpg'
                        ],
                        details: 'مستشفى بسعة 200 سرير مع أحدث التجهيزات الطبية والمعامل.',
                        cost: '2,500,000,000 د.ع',
                        meta: [
                            { icon: 'location_on', label: 'الموقع', value: 'الرصافة' },
                            { icon: 'straighten', label: 'المساحة', value: '8000 م²' }
                        ],
                        materials: [
                            { name: 'خرسانة مسلحة', image: 'images/img20.jpg' },
                            { name: 'دهان مضاد للبكتيريا', image: 'images/img21.jpg' },
                            { name: 'أرضيات إيبوكسي', image: 'images/img22.jpg' },
                            { name: 'نوافذ ألمنيوم', image: 'images/img23.jpg' }
                        ]
                    },
                    {
                        title: 'برج الأعمال',
                        type: 'تجاري',
                        companyVerified: true,
                        company: 'شركة الإنشاءات الوطنية',
                        companyLink: 'company.html?id=' + encodeURIComponent('شركة الإنشاءات الوطنية'),
                        bg: 'images/img24.jpg',
                        images: [
                            'images/img24.jpg',
                            'images/img25.jpg',
                            'images/img26.jpg',
                            'images/img27.jpg'
                        ],
                        details: 'برج إداري بارتفاع 20 طابقاً مع واجهة زجاجية عصرية.',
                        cost: '5,000,000,000 د.ع',
                        meta: [
                            { icon: 'location_on', label: 'الموقع', value: 'شارع فلسطين' },
                            { icon: 'straighten', label: 'المساحة', value: '12000 م²' }
                        ],
                        materials: [
                            { name: 'واجهة زجاجية', image: 'images/img24.jpg' },
                            { name: 'صلب إنشائي', image: 'images/img25.jpg' },
                            { name: 'جرانيت', image: 'images/img26.jpg' },
                            { name: 'مصاعد أوتيس', image: 'images/img27.jpg' }
                        ]
                    },
                    {
                        title: 'فلل الربيع',
                        type: 'سكني',
                        companyVerified: false,
                        company: 'شركة البناء الحديث',
                        companyLink: 'company.html?id=' + encodeURIComponent('شركة البناء الحديث'),
                        bg: 'images/img28.jpg',
                        images: [
                            'images/img28.jpg',
                            'images/img29.jpg',
                            'images/img30.jpg',
                            'images/img31.jpg'
                        ],
                        details: 'مشروع سكني يضم 30 فيلا مستقلة بتصاميم عصرية وحدائق خاصة.',
                        cost: '3,500,000,000 د.ع',
                        meta: [
                            { icon: 'location_on', label: 'الموقع', value: 'اليرموك' },
                            { icon: 'straighten', label: 'المساحة', value: '3000 م²' }
                        ],
                        materials: [
                            { name: 'طوب عازل', image: 'images/img28.jpg' },
                            { name: 'أسمنت', image: 'images/img29.jpg' },
                            { name: 'بلاط إنترلوك', image: 'images/img30.jpg' },
                            { name: 'دهان خارجي', image: 'images/img31.jpg' }
                        ]
                    },
                    {
                        title: 'مجمع النخيل التجاري',
                        type: 'تجاري',
                        companyVerified: true,
                        company: 'شركة الإنشاءات الوطنية',
                        companyLink: 'company.html?id=' + encodeURIComponent('شركة الإنشاءات الوطنية'),
                        bg: 'images/img1.jpg',
                        images: [
                            'images/img1.jpg',
                            'images/img2.jpg',
                            'images/img3.jpg',
                            'images/img4.jpg'
                        ],
                        details: 'مجمع تجاري متكامل يضم 50 محلاً تجارياً ومطاعم.',
                        cost: '4,000,000,000 د.ع',
                        meta: [
                            { icon: 'location_on', label: 'الموقع', value: 'الكرادة' },
                            { icon: 'straighten', label: 'المساحة', value: '5000 م²' }
                        ],
                        materials: [
                            { name: 'زجاج واجهات', image: 'images/img1.jpg' },
                            { name: 'سيراميك أرضيات', image: 'images/img2.jpg' },
                            { name: 'دهان ديكوري', image: 'images/img3.jpg' },
                            { name: 'ألمنيوم', image: 'images/img4.jpg' }
                        ]
                    },
                    {
                        title: 'عمارة سكنية فاخرة',
                        type: 'سكني',
                        companyVerified: false,
                        company: 'مقاولون العرب',
                        companyLink: 'company.html?id=' + encodeURIComponent('مقاولون العرب'),
                        bg: 'images/img5.jpg',
                        images: [
                            'images/img5.jpg',
                            'images/img6.jpg',
                            'images/img7.jpg',
                            'images/img8.jpg'
                        ],
                        details: 'عمارة سكنية بمساحة 500 م² تحتوي على 12 شقة فاخرة.',
                        cost: '850,000,000 د.ع',
                        meta: [
                            { icon: 'location_on', label: 'الموقع', value: 'الزهراء' },
                            { icon: 'straighten', label: 'المساحة', value: '500 م²' }
                        ],
                        materials: [
                            { name: 'رخام أرضيات', image: 'images/img5.jpg' },
                            { name: 'خشب أبواب', image: 'images/img6.jpg' },
                            { name: 'دهان جدران', image: 'images/img7.jpg' },
                            { name: 'نوافذ UPVC', image: 'images/img8.jpg' }
                        ]
                    },
                    {
                        title: 'فيلا دوبلكس',
                        type: 'سكني',
                        companyVerified: false,
                        company: 'شركة البناء الحديث',
                        companyLink: 'company.html?id=' + encodeURIComponent('شركة البناء الحديث'),
                        bg: 'images/img9.jpg',
                        images: [
                            'images/img9.jpg',
                            'images/img10.jpg',
                            'images/img11.jpg',
                            'images/img12.jpg'
                        ],
                        details: 'فيلا دوبلكس بتصميم عصري مع حديقة خاصة وحوض سباحة.',
                        cost: '600,000,000 د.ع',
                        meta: [
                            { icon: 'location_on', label: 'الموقع', value: 'المنصور' },
                            { icon: 'straighten', label: 'المساحة', value: '600 م²' }
                        ],
                        materials: [
                            { name: 'بلاط حمامات', image: 'images/img9.jpg' },
                            { name: 'أدوات صحية', image: 'images/img10.jpg' },
                            { name: 'دهان مائي', image: 'images/img11.jpg' },
                            { name: 'زجاج شفاف', image: 'images/img12.jpg' }
                        ]
                    },
                    {
                        title: 'مكتب حديث',
                        type: 'مكتبي',
                        companyVerified: true,
                        company: 'شركة الإنشاءات الوطنية',
                        companyLink: 'company.html?id=' + encodeURIComponent('شركة الإنشاءات الوطنية'),
                        bg: 'images/img13.jpg',
                        images: [
                            'images/img13.jpg',
                            'images/img14.jpg',
                            'images/img15.jpg',
                            'images/img16.jpg'
                        ],
                        details: 'مكتب إداري حديث بمساحة 200 م² مع تجهيزات متكاملة.',
                        cost: '350,000,000 د.ع',
                        meta: [
                            { icon: 'location_on', label: 'الموقع', value: 'الرصافة' },
                            { icon: 'straighten', label: 'المساحة', value: '200 م²' }
                        ],
                        materials: [
                            { name: 'قسم داخلي زجاجي', image: 'images/img13.jpg' },
                            { name: 'سقف معلق', image: 'images/img14.jpg' },
                            { name: 'أرضيات خشبية', image: 'images/img15.jpg' },
                            { name: 'إضاءة LED', image: 'images/img16.jpg' }
                        ]
                    }
                ]);

                function normalizeWork(item) {
                    var gov = '', area = '';
                    if (item.meta) {
                        item.meta.forEach(function(m) {
                            if (m.icon === 'location_on') gov = m.value;
                            if (m.icon === 'straighten') area = m.value;
                        });
                    }
                    return {
                        ...item,
                        governorate: item.governorate || gov,
                        area: item.area || area,
                        type: item.type || '',
                        companyVerified: item.companyVerified === true
                    };
                }

                var latestWorks = computed(function() {
                    var base = latestWorksBase.value.map(normalizeWork);
                    var featured = ProjectData.getFeaturedProjects().map(normalizeWork);
                    return base.concat(featured);
                });

                const galleryImages = ref([
                    'images/img1.jpg',
                    'images/img6.jpg',
                    'images/img11.jpg',
                    'images/img16.jpg',
                    'images/img20.jpg',
                    'images/img24.jpg',
                    'images/img28.jpg'
                ]);
                var gallerySlide = ref(0);
                var galleryTimer = null;
                function startGalleryTimer() {
                    stopGalleryTimer();
                    galleryTimer = setInterval(function() {
                        gallerySlide.value = (gallerySlide.value + 1) % galleryImages.value.length;
                    }, 3000);
                }
                function stopGalleryTimer() {
                    if (galleryTimer) { clearInterval(galleryTimer); galleryTimer = null; }
                }
                const gallerySwipe = (() => {
                    var sx = 0, sy = 0, dx = 0, dy = 0;
                    return {
                        onTouchStart: function(e) { sx = e.touches[0].clientX; sy = e.touches[0].clientY; },
                        onTouchEnd: function(e) {
                            dx = e.changedTouches[0].clientX - sx;
                            dy = e.changedTouches[0].clientY - sy;
                            if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 40) {
                                if (dx < 0 && gallerySlide.value < galleryImages.value.length - 1) { gallerySlide.value++; }
                                if (dx > 0 && gallerySlide.value > 0) { gallerySlide.value--; }
                                startGalleryTimer();
                            }
                        }
                    };
                })();

                const partners = ref([
                    { name: 'شركة البناء الحديث', logo: 'images/img1.jpg' },
                    { name: 'مقاولون العرب', logo: 'images/img5.jpg' },
                    { name: 'الإنشاءات الوطنية', logo: 'images/img9.jpg' },
                    { name: 'مكتب السلام', logo: 'images/img13.jpg' },
                    { name: 'مؤسسة الإتقان', logo: 'images/img17.jpg' },
                    { name: 'شركة التطوير', logo: 'images/img21.jpg' },
                    { name: 'مقاولو الخليج', logo: 'images/img25.jpg' },
                    { name: 'بيت العمر', logo: 'images/img29.jpg' }
                ]);
                const partnersTrack = ref(null);
                function startSlideTimer() {
                    slideTimer = setInterval(() => {
                        currentSlide.value = (currentSlide.value + 1) % slides.value.length;
                    }, 2500);
                }

                function stopSlideTimer() {
                    if (slideTimer) {
                        clearInterval(slideTimer);
                        slideTimer = null;
                    }
                }

                function startAdTimer() {
                    stopAdTimer();
                    adTimer = setInterval(() => {
                        adSlide.value = (adSlide.value + 1) % ads.value.length;
                    }, 3500);
                }
                function stopAdTimer() {
                    if (adTimer) { clearInterval(adTimer); adTimer = null; }
                }
                function resetAdTimer() { startAdTimer(); }

                function openProject(project) {
                    stopSlideTimer();
                    modalSlide.value = 0;
                    selectedProject.value = project;
                    history.pushState({ action: 'modal' }, '');
                }

                function closeModal() {
                    if (modalClosing.value) return;
                    modalClosing.value = true;
                    setTimeout(() => {
                        selectedProject.value = null;
                        modalClosing.value = false;
                        modalPullY.value = 0;
                        startSlideTimer();
                    }, 350);
                }

                function showProjectDetail(project) {
                    stopSlideTimer();
                    detailSlide.value = 0;
                    projectDetail.value = project;
                    selectedProject.value = null;
                    modalClosing.value = false;
                    modalPullY.value = 0;
                }

                function closeProjectDetail() {
                    projectDetail.value = null;
                    startSlideTimer();
                }

                function backToPreview() {
                    var proj = projectDetail.value;
                    closeProjectDetail();
                    if (proj) {
                        modalSlide.value = 0;
                        selectedProject.value = proj;
                    }
                }

                function openViewer(index) {
                    if (!selectedProject.value) return;
                    viewerImages.value = selectedProject.value.images;
                    viewerIndex.value = index;
                    viewerScale.value = 1;
                    viewerPanX.value = 0;
                    viewerPanY.value = 0;
                    viewerOpen.value = true;
                    history.pushState({ action: 'viewer' }, '');
                }

                function openDetailViewer(index) {
                    if (!projectDetail.value) return;
                    var imgs = projectDetail.value.images;
                    if (!imgs || !imgs.length) return;
                    if (index < 0 || index >= imgs.length) index = 0;
                    viewerImages.value = imgs;
                    viewerIndex.value = index;
                    viewerScale.value = 1;
                    viewerPanX.value = 0;
                    viewerPanY.value = 0;
                    viewerOpen.value = true;
                }

                function closeViewer() {
                    viewerOpen.value = false;
                    viewerScale.value = 1;
                    viewerPanX.value = 0;
                    viewerPanY.value = 0;
                }

                function nextViewer() {
                    if (viewerIndex.value < viewerImages.value.length - 1) {
                        viewerIndex.value++;
                    }
                }

                function prevViewer() {
                    if (viewerIndex.value > 0) {
                        viewerIndex.value--;
                    }
                }

                // State preservation on refresh only
                var isReload = false;
                try { isReload = performance.getEntriesByType('navigation')[0].type === 'reload'; } catch(e) {}
                try { if (performance.navigation && performance.navigation.type === 1) isReload = true; } catch(e) {}
                if (isReload) {
                    var savedHome = restoreState('home');
                    if (savedHome) {
                        if (savedHome.selectedProject) selectedProject.value = savedHome.selectedProject;
                    }
                }
                function saveHomeState() {
                    preserveState('home', { selectedProject: selectedProject.value });
                }
                window.addEventListener('beforeunload', saveHomeState);

                onMounted(() => {
                    startSlideTimer();
                    startAdTimer();
                    startGalleryTimer();
                    BuneanNotif.updateBadge();
                    PullToRefresh.init();
                    BackNav.init();
                    BackNav.registerCloseHandler(function() {
                        if (viewerOpen.value) { viewerOpen.value = false; return true; }
                        if (selectedProject.value) { selectedProject.value = null; startSlideTimer(); return true; }
                        return false;
                    });
                });

                onUnmounted(() => {
                    stopSlideTimer();
                    stopAdTimer();
                    stopGalleryTimer();
                    window.removeEventListener('beforeunload', saveHomeState);
                });

                return {
                    isCompany, searchQuery, currentSlide, slides, sections, ads, latestWorks, partners,
                    selectedProject, modalSlide,
                    openProject, closeModal,
                    projectDetail, detailSlide,
                    showProjectDetail, closeProjectDetail,
                    viewerOpen, viewerImages, viewerIndex, viewerScale, viewerPanX, viewerPanY,
                    openViewer, openDetailViewer, closeViewer, nextViewer, prevViewer, backToPreview,
                    heroSwipe, adSwipe, modalTouch, viewerTouch, detailSwipe,
                    modalPullY, pullTransform, modalClosing,
                    adSlide, resetAdTimer,
                    partners,
                    galleryImages, gallerySlide, gallerySwipe,
                    requireAccount, goTo
                };
            }
        });
        _vueApp.component('project-detail', ProjectDetailComp);
        _vueApp.mount('#app');

initFloatingCart();
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('sw.js')
                .then(() => console.log('SW registered'))
                .catch(err => console.log('SW registration failed'));
        }