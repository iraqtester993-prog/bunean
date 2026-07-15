

document.getElementById('header').innerHTML = renderHeader({ userNameVue: true });
        document.getElementById('bottomNav').innerHTML = renderNav('account');

        const { createApp, ref, computed, watch, nextTick } = Vue;

        function loadFromStorage(key, def) {
            try { var v = JSON.parse(localStorage.getItem(key)); return v !== null ? v : def; } catch(e) { return def; }
        }

        createApp({
            setup() {
                initTheme();

                // ===== Auth detection =====
                var myAuth = loadFromStorage('bunean-user-auth', null);
                var myData = loadFromStorage('bunean-user-data', null);
                var isCompany = ref(myData && myData.role === 'company');
                var companyProfileExists = ref(!!localStorage.getItem('bunean-company-profile'));
                var hasCompanyProfile = computed(function() {
                    return isCompany.value && companyProfileExists.value;
                });

                var user = ref(myData ? {
                    name: myData.name,
                    ownerName: myData.ownerName || '',
                    phone: myData.phone || '+964 770 123 4567',
                    governorate: myData.governorate || '',
                    address: myData.address || '',
                    role: myData.role || 'user'
                } : {
                    name: 'ضيف عراق تكنو',
                    ownerName: '',
                    phone: '+964 770 123 4567',
                    governorate: '',
                    address: ''
                });

                // Set user name for header
                if (myData && myData.name) {
                    localStorage.setItem('bunean-user', myData.name);
                } else if (!localStorage.getItem('bunean-user')) {
                    localStorage.setItem('bunean-user', user.value.name);
                }

                var menuItems = computed(function() {
                    if (isCompany.value) {
                        var items = [
                            { label: 'طلباتي', link: 'order-tracking.html',
                                icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--accent-gold)" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>' },
                            { label: 'عروض المستخدمين', section: 'company-offers',
                                icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--accent-gold)" stroke-width="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>' },
                            { label: 'إعلاناتي', section: 'company-ads',
                                icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--accent-gold)" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>' },
                            { label: 'الدعم الفني', section: 'support',
                                icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--accent-gold)" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>' }
                        ];
                        if (hasCompanyProfile.value) {
                            items.push(
                                { label: 'تعديل ملف الشركة', section: 'edit-company-profile',
                                    icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--accent-gold)" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>' }
                            );
                        }
                        items.push(
                            { label: 'الملف الشخصي', link: 'profile.html',
                                icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--accent-gold)" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>' },
                            { label: 'الإشعارات', link: 'notifications.html',
                                icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--accent-gold)" stroke-width="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>' }
                        );
                        return items;
                    }
                    return [
                        { label: 'طلباتي', link: 'order-tracking.html',
                            icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--accent-gold)" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>' },
                        { label: 'عروض الأسعار', section: 'user-offers',
                            icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--accent-gold)" stroke-width="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>' },
                        { label: 'الدعم الفني', section: 'support',
                            icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--accent-gold)" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>' },
                        { label: 'الملف الشخصي', link: 'profile.html',
                            icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--accent-gold)" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>' },
                        { label: 'الإشعارات', link: 'notifications.html',
                            icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--accent-gold)" stroke-width="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>' }
                    ];
                });

                var isLightMode = ref(document.documentElement.classList.contains('light-mode'));

                var themeIcon = computed(function() {
                    return isLightMode.value
                        ? '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--accent-gold)" stroke-width="2"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>'
                        : '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--accent-gold)" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>';
                });

                var handleToggleTheme = function() {
                    document.documentElement.classList.toggle('light-mode');
                    isLightMode.value = document.documentElement.classList.contains('light-mode');
                    localStorage.setItem('bunean-theme', isLightMode.value ? 'light' : 'dark');
                };

                // ===== Company status =====
                var companyAuthData = loadFromStorage('bunean-company-auth', null);
                var companyStatus = ref(companyAuthData ? companyAuthData.status : 'قيد المراجعة');

                // ===== بيانات تجريبية للمستخدمين الجدد =====
                (function seedDemoData() {
                    var seedVersion = 3;
                    var currentVersion = parseInt(localStorage.getItem('bunean-seed-version') || '0');
                    if (currentVersion < seedVersion) {
                        localStorage.setItem('bunean-quote-requests', JSON.stringify([
                            { id: 1, name: 'أحمد علي', phone: '07701234567', location: 'بغداد', size: '300 متر مربع', budget: '200,000,000 د.ع', category: 'بناء سكني', details: 'أريد بناء فيلا بمساحة 300 متر مربع، طابقين مع سرداب', images: [], replied: false, replyMessage: '', createdAt: '2026-06-28' },
                            { id: 2, name: 'محمد حسن', phone: '07707654321', location: 'أربيل', size: '150 متر', budget: '50,000,000 د.ع', category: 'تشطيبات', details: 'تشطيب كامل لشقة 150 متر، دهانات وأرضيات وسباكة وكهرباء', images: [], replied: false, replyMessage: '', createdAt: '2026-06-30' },
                            { id: 3, name: 'سعد جاسم', phone: '07801239999', location: 'البصرة', size: '1000 متر', budget: '500,000,000 د.ع', category: 'بناء تجاري', details: 'مجمع تجاري من 3 طوابق بمساحة 1000 متر مع مواقف سيارات', images: [], replied: true, replyMessage: 'نشكركم على تواصلكم، يسعدنا تقديم عرض سعر مناسب. يرجى التواصل معنا.', createdAt: '2026-06-25' },
                            { id: 4, name: 'فاطمة الزهراء', phone: '07809876543', location: 'نينوى', size: '200 متر', budget: '', category: 'تشطيبات', details: 'تشطيب شقة سكنية كاملة في حي الكرادة، 4 غرف نوم و3 حمامات', images: [], replied: false, replyMessage: '', createdAt: '2026-07-01' },
                            { id: 5, name: 'عمر المحمدي', phone: '07705551234', location: 'النجف', size: '450 متر مربع', budget: '350,000,000 د.ع', category: 'بناء سكني', details: 'بناء فيلا فاخرة بتصميم حديث، مسبح خارجي وحديقة', images: [], replied: false, replyMessage: '', createdAt: '2026-07-02' },
                            { id: 6, name: 'زينب كريم', phone: '07901112233', location: 'كركوك', size: '80 متر', budget: '15,000,000 د.ع', category: 'دهانات', details: 'طلاء داخلي وخارجي لشقة جديدة بألوان حديثة', images: [], replied: false, replyMessage: '', createdAt: '2026-07-03' }
                        ]));
                    }
                    if (!localStorage.getItem('bunean-company-quotes') || JSON.parse(localStorage.getItem('bunean-company-quotes')).length === 0) {
                        localStorage.setItem('bunean-company-quotes', JSON.stringify([
                            { id: 1, client: 'عمارة الفيحاء السكنية', project: 'بناء 12 وحدة سكنية', amount: '450,000,000 د.ع', notes: 'يشمل كافة المواد والعمالة، مدة التنفيذ 8 أشهر.', status: 'قيد المراجعة' },
                            { id: 2, client: 'مشروع مول بغداد', project: 'تشطيب واجهات', amount: '125,000,000 د.ع', notes: 'تشطيب واجهات زجاجية وألمنيوم', status: 'تم قبول العرض' },
                            { id: 3, client: 'فيلا خاصة - كربلاء', project: 'بناء فيلا', amount: '95,000,000 د.ع', notes: 'عرض سعر أولي قابل للتفاوض', status: 'تم رفض العرض' }
                        ]));
                    }
                    var compProfile = loadFromStorage('bunean-company-profile', {});
                    // Only seed ads/projects if the company profile was intentionally created (has a name)
                    if (compProfile.name) {
                        var changed = false;
                        if (!compProfile.ads || compProfile.ads.length === 0) {
                            compProfile.ads = [
                                { id: 1, title: 'تشطيبات فاخرة بأسعار منافسة', desc: 'نقدم أفضل خدمات التشطيب بكفاءة عالية', image: 'images/img2.jpg', type: 'تشطيبات داخلية', company: 'شركة التشطيب الذهبي', phone: '07701234567', status: 'مقبول' },
                                { id: 2, title: 'بناء فلل وقصور', desc: 'خبرة 15 عاماً في بناء الفلل', image: 'images/img1.jpg', type: 'بناء وإنشاء', company: 'شركة البناء المتقن', phone: '07707654321', status: 'قيد المراجعة' }
                            ];
                            changed = true;
                        }
                        if (!compProfile.projects || compProfile.projects.length === 0) {
                            compProfile.projects = [
                                { title: 'مجمع السكني النموذجي', desc: 'بناء مجمع سكني متكامل من 50 وحدة', category: 'بناء سكني', image: 'images/img3.jpg', date: '2026-05-15', status: 'مكتمل' },
                                { title: 'مول بغداد الجديد', desc: 'تشطيب واجهات وأعمال داخلية', category: 'بناء تجاري', image: 'images/img4.jpg', date: '2026-03-20', status: 'مكتمل' },
                                { title: 'جسر الزوار', desc: 'أعمال خرسانية وإنشائية', category: 'جسور وطرق', image: 'images/img5.jpg', date: '2026-01-10', status: 'قيد المراجعة' }
                            ];
                            changed = true;
                        }
                        if (changed) localStorage.setItem('bunean-company-profile', JSON.stringify(compProfile));
                    }
                    localStorage.setItem('bunean-seed-version', seedVersion);
                })();

                // Quote requests
                var companyOffersTab = ref('incoming');
                var quoteRequests = ref(loadFromStorage('bunean-quote-requests', []));
                var activeRequest = ref(null);
                var replyText = ref('');
                var replyAmount = ref('');

                var sendReply = function() {
                    if (!replyText.value.trim()) { showBrandAlert('اكتب الرد أولاً'); return; }
                    var req = activeRequest.value;
                    if (!req) return;
                    var qs = loadFromStorage('bunean-quote-requests', []);
                    var idx = qs.findIndex(function(q) { return q.id === req.id; });
                    if (idx !== -1) {
                        qs[idx].replied = true;
                        qs[idx].replyMessage = replyText.value.trim();
                        localStorage.setItem('bunean-quote-requests', JSON.stringify(qs));
                        quoteRequests.value = qs;
                    }
                    // Create a quote in company's my-quotes
                    var quotes = loadFromStorage('bunean-company-quotes', []);
                    quotes.push({
                        id: Date.now(),
                        requestId: req.id,
                        client: req.name || 'عميل',
                        project: req.category || '',
                        amount: replyAmount.value.trim() || '',
                        notes: replyText.value.trim(),
                        status: 'قيد المراجعة',
                        createdAt: new Date().toISOString()
                    });
                    localStorage.setItem('bunean-company-quotes', JSON.stringify(quotes));
                    myQuotes.value = quotes;
                    activeRequest.value = null;
                    replyText.value = '';
                    replyAmount.value = '';
                    showBrandAlert('✅ تم إرسال الرد وإنشاء العرض');
                };

                // ===== طلبات الخدمة =====
                var serviceRequests = ref(loadFromStorage('bunean-service-requests', []));
                var activeServiceRequest = ref(null);
                var serviceReplyText = ref('');
                var serviceReplyAmount = ref('');

                var sendServiceReply = function() {
                    if (!serviceReplyText.value.trim()) { showBrandAlert('اكتب الرد أولاً'); return; }
                    var req = activeServiceRequest.value;
                    if (!req) return;
                    var qs = loadFromStorage('bunean-service-requests', []);
                    var idx = qs.findIndex(function(q) { return q.id === req.id; });
                    if (idx !== -1) {
                        qs[idx].replied = true;
                        qs[idx].replyMessage = serviceReplyText.value.trim();
                        qs[idx].replyAmount = serviceReplyAmount.value.trim();
                        localStorage.setItem('bunean-service-requests', JSON.stringify(qs));
                        serviceRequests.value = qs;
                    }
                    var quotes = loadFromStorage('bunean-company-quotes', []);
                    quotes.push({
                        id: Date.now(),
                        requestId: req.id,
                        client: req.name || 'عميل',
                        project: req.consultType || 'طلب عرض سعر',
                        amount: serviceReplyAmount.value.trim() || '',
                        notes: serviceReplyText.value.trim(),
                        status: 'قيد المراجعة',
                        createdAt: new Date().toISOString()
                    });
                    localStorage.setItem('bunean-company-quotes', JSON.stringify(quotes));
                    myQuotes.value = quotes;
                    activeServiceRequest.value = null;
                    serviceReplyText.value = '';
                    serviceReplyAmount.value = '';
                    showBrandAlert('✅ تم إرسال الرد وإنشاء العرض');
                };

                // User quotes (my-quotes)
                var myQuotes = ref(loadFromStorage('bunean-company-quotes', []));

                var getStatusStyle = function(s) {
                    if (s === 'تم قبول العرض') return 'background:rgba(46,204,113,0.1);color:#2ecc71;border:1px solid rgba(46,204,113,0.2)';
                    if (s === 'تم رفض العرض') return 'background:rgba(231,76,60,0.1);color:#e74c3c;border:1px solid rgba(231,76,60,0.2)';
                    return 'background:rgba(255,136,0,0.1);color:#FF8800;border:1px solid rgba(255,136,0,0.2)';
                };

                // My Quotes edit
                var selectedMyQuote = ref(null);
                var myQuoteEdit = ref({ client: '', project: '', amount: '', notes: '', status: '' });
                var editMyQuote = function(mq) {
                    selectedMyQuote.value = mq;
                    myQuoteEdit.value = {
                        client: mq.client || '',
                        project: mq.project || '',
                        amount: mq.amount || '',
                        notes: mq.notes || '',
                        status: mq.status || 'قيد المراجعة'
                    };
                };
                var saveMyQuote = function() {
                    var ed = myQuoteEdit.value;
                    if (!ed.client.trim() || !ed.project.trim() || !ed.amount.trim()) { showBrandAlert('املأ الحقول المطلوبة'); return; }
                    var qs = loadFromStorage('bunean-company-quotes', []);
                    var idx = qs.findIndex(function(q) { return q.id === selectedMyQuote.value.id; });
                    if (idx !== -1) {
                        qs[idx].client = ed.client.trim();
                        qs[idx].project = ed.project.trim();
                        qs[idx].amount = ed.amount.trim();
                        qs[idx].notes = ed.notes.trim();
                        qs[idx].status = ed.status;
                        localStorage.setItem('bunean-company-quotes', JSON.stringify(qs));
                        myQuotes.value = qs;
                        selectedMyQuote.value = null;
                        showBrandAlert('✅ تم حفظ التعديلات');
                    }
                };

                // Ads
                var profile = ref(loadFromStorage('bunean-company-profile', { ads: [] }));
                var myAds = ref(profile.value.ads || []);
                var adFormPage = ref(false);
                var editingAdId = ref(null);
                var selectedAd = ref(null);
                var adInput = ref(null);
                var adMatInput = ref(null);
                var adMatIdx = ref(-1);
                var newAd = ref({ 
                    title: '', desc: '', images: [], type: '', 
                    location: '', area: '', deliveryDate: '',
                    materials: [],
                    company: (profile.value.name || user.value.name || ''),
                    phone: (profile.value.phone || user.value.phone || '')
                });

                function handleAdImages(e) {
                    var files = Array.from(e.target.files || []);
                    var remaining = 5 - newAd.value.images.length;
                    if (files.length > remaining) files = files.slice(0, remaining);
                    files.forEach(function(file) {
                        if (!file) return;
                        var reader = new FileReader();
                        reader.onload = function(ev) { newAd.value.images.push(ev.target.result); };
                        reader.readAsDataURL(file);
                    });
                    e.target.value = '';
                }

                function removeAdImage(idx) {
                    newAd.value.images.splice(idx, 1);
                }

                function addAdMaterial() {
                    newAd.value.materials.push({ name: '', image: '' });
                }
                function removeAdMaterial(idx) {
                    newAd.value.materials.splice(idx, 1);
                }
                function triggerAdMatUpload(idx) {
                    adMatIdx.value = idx;
                    if (adMatInput.value) adMatInput.value.click();
                }
                function handleAdMatImage(e) {
                    var file = e.target.files && e.target.files[0];
                    if (!file || adMatIdx.value < 0) return;
                    var reader = new FileReader();
                    reader.onload = function(ev) { 
                        if (newAd.value.materials[adMatIdx.value]) {
                            newAd.value.materials[adMatIdx.value].image = ev.target.result;
                        }
                    };
                    reader.readAsDataURL(file);
                    e.target.value = '';
                    adMatIdx.value = -1;
                }

                function saveAds() {
                    var p = loadFromStorage('bunean-company-profile', {});
                    p.ads = myAds.value;
                    localStorage.setItem('bunean-company-profile', JSON.stringify(p));
                }

                function openAdForm() {
                    editingAdId.value = null;
                    newAd.value = { 
                        title: '', desc: '', images: [], type: '',
                        location: '', area: '', deliveryDate: '',
                        materials: [],
                        company: (profile.value.name || user.value.name || ''),
                        phone: (profile.value.phone || user.value.phone || '')
                    };
                    adFormPage.value = true;
                }

                function closeAdForm() {
                    adFormPage.value = false;
                    editingAdId.value = null;
                }

                function viewAd(ad) {
                    selectedAd.value = ad;
                }

                function editAd(ad) {
                    selectedAd.value = null;
                    editingAdId.value = ad.id;
                    newAd.value = {
                        title: ad.title || '',
                        desc: ad.desc || '',
                        images: ad.images ? ad.images.slice() : (ad.image ? [ad.image] : []),
                        type: ad.type || '',
                        location: ad.location || '',
                        area: ad.area || '',
                        deliveryDate: ad.deliveryDate || '',
                        materials: ad.materials ? ad.materials.map(function(m) { return { name: m.name, image: m.image }; }) : [],
                        company: ad.company || (profile.value.name || user.value.name || ''),
                        phone: ad.phone || (profile.value.phone || user.value.phone || '')
                    };
                    adFormPage.value = true;
                }

                function deleteAd(ad) {
                    showBrandConfirm('هل أنت متأكد من حذف هذا الإعلان؟', function() {
                        var idx = myAds.value.findIndex(function(a) { return a.id === ad.id; });
                        if (idx !== -1) myAds.value.splice(idx, 1);
                        saveAds();
                        selectedAd.value = null;
                        showBrandAlert('✅ تم حذف الإعلان');
                    });
                }

                var submitAd = function() {
                    if (!newAd.value.title.trim()) { showBrandAlert('أدخل عنوان الإعلان'); return; }
                    if (!newAd.value.type) { showBrandAlert('اختر نوع الإعلان'); return; }
                    if (!newAd.value.company.trim()) { showBrandAlert('اسم الشركة مطلوب'); return; }
                    if (!newAd.value.phone.trim()) { showBrandAlert('رقم الهاتف مطلوب'); return; }
                    if (editingAdId.value) {
                        var idx = myAds.value.findIndex(function(a) { return a.id === editingAdId.value; });
                        if (idx !== -1) {
                            myAds.value[idx].title = newAd.value.title;
                            myAds.value[idx].desc = newAd.value.desc;
                            myAds.value[idx].images = newAd.value.images.length ? newAd.value.images : ['images/img1.jpg'];
                            myAds.value[idx].type = newAd.value.type;
                            myAds.value[idx].location = newAd.value.location;
                            myAds.value[idx].area = newAd.value.area;
                            myAds.value[idx].deliveryDate = newAd.value.deliveryDate;
                            myAds.value[idx].materials = newAd.value.materials.filter(function(m) { return m.name.trim(); });
                            myAds.value[idx].company = newAd.value.company;
                            myAds.value[idx].phone = newAd.value.phone;
                        }
                        saveAds();
                        adFormPage.value = false;
                        editingAdId.value = null;
                        showBrandAlert('✅ تم حفظ التعديلات');
                    } else {
                        myAds.value.push({ 
                            id: Date.now(),
                            title: newAd.value.title, 
                            desc: newAd.value.desc, 
                            images: newAd.value.images.length ? newAd.value.images : ['images/img1.jpg'],
                            type: newAd.value.type,
                            location: newAd.value.location,
                            area: newAd.value.area,
                            deliveryDate: newAd.value.deliveryDate,
                            materials: newAd.value.materials.filter(function(m) { return m.name.trim(); }),
                            company: newAd.value.company,
                            phone: newAd.value.phone,
                            status: 'قيد المراجعة' 
                        });
                        saveAds();
                        adFormPage.value = false;
                        showBrandAlert('✅ تم إرسال طلب الحجز\nسيتم مراجعة الطلب من قبل الدعم الفني');
                    }
                };

                // Projects
                var myProjects = ref(profile.value.projects || []);
                var newProject = ref({ title: '', desc: '', category: '', images: [], date: '' });
                var categories = ['بناء سكني', 'بناء تجاري', 'جسور وطرق', 'تشطيبات', 'خرسانة', 'أعمال صحية', 'أعمال كهربائية', 'دهانات', 'أرضيات', 'واجهات', 'حدائق', 'أخرى'];
                var projectTab = ref('add');

                // Image upload helpers
                var logoInput = ref(null);
                var coverInput = ref(null);
                var workInput = ref(null);
                var projectInput = ref(null);

                function triggerUpload(type) {
                    if (type === 'logo' && logoInput.value) logoInput.value.click();
                    else if (type === 'cover' && coverInput.value) coverInput.value.click();
                    else if (type === 'work' && workInput.value) workInput.value.click();
                    else if (type === 'project' && projectInput.value) projectInput.value.click();
                    else if (type === 'ad' && adInput.value) adInput.value.click();
                }

                function handleUpload(e, type) {
                    var file = e.target.files && e.target.files[0];
                    if (!file) return;
                    var reader = new FileReader();
                    reader.onload = function(ev) {
                        if (type === 'logo') editProfile.value.logo = ev.target.result;
                        else if (type === 'cover') editProfile.value.cover = ev.target.result;
                    };
                    reader.readAsDataURL(file);
                    e.target.value = '';
                }

                function handleWorkImages(e) {
                    var files = Array.from(e.target.files || []);
                    var remaining = 5 - editProfile.value.workImages.length;
                    if (files.length > remaining) files = files.slice(0, remaining);
                    files.forEach(function(file) {
                        if (!file) return;
                        var reader = new FileReader();
                        reader.onload = function(ev) {
                            editProfile.value.workImages.push(ev.target.result);
                        };
                        reader.readAsDataURL(file);
                    });
                    e.target.value = '';
                }

                function removeWorkImage(idx) {
                    editProfile.value.workImages.splice(idx, 1);
                }

                function handleProjectImages(e) {
                    var files = Array.from(e.target.files || []);
                    var remaining = 5 - newProject.value.images.length;
                    if (files.length > remaining) files = files.slice(0, remaining);
                    files.forEach(function(file) {
                        if (!file) return;
                        var reader = new FileReader();
                        reader.onload = function(ev) {
                            newProject.value.images.push(ev.target.result);
                        };
                        reader.readAsDataURL(file);
                    });
                    e.target.value = '';
                }

                function removeProjectImage(idx) {
                    newProject.value.images.splice(idx, 1);
                }

                var submitProject = function() {
                    if (!newProject.value.title.trim()) { showBrandAlert('أدخل اسم المشروع'); return; }
                    var imgs = newProject.value.images.length ? newProject.value.images : ['images/img1.jpg'];
                    myProjects.value.push({
                        title: newProject.value.title,
                        desc: newProject.value.desc,
                        category: newProject.value.category,
                        images: imgs,
                        image: imgs[0],
                        date: newProject.value.date || new Date().toISOString().split('T')[0],
                        status: 'قيد المراجعة'
                    });
                    var p = loadFromStorage('bunean-company-profile', {});
                    p.projects = myProjects.value;
                    localStorage.setItem('bunean-company-profile', JSON.stringify(p));
                    newProject.value = { title: '', desc: '', category: '', images: [], date: '' };
                    showBrandAlert('✅ تم إضافة المشروع\nسيتم مراجعة الطلب من قبل الدعم الفني');
                };

                // My Projects management
                var previewData = ref(null);
                var detailSlide = ref(0);
                var projectDetail = ref(null);
                var detailSlide2 = ref(0);
                var viewerImg = ref(null);
                var viewerOpen = ref(false);
                var viewerIndex = ref(0);
                var viewerScale = ref(1);
                var viewerPanX = ref(0);
                var viewerPanY = ref(0);
                var viewerImages = ref([]);
                var isPinch = ref(false);
                var editProjectData = ref(null);
                var editProjectIndex = ref(-1);
                var editProjectInput = ref(null);
                var editProjectNewImages = ref([]);

                function previewProject(p) {
                    previewData.value = p;
                    detailSlide.value = 0;
                }

                var userCompanyLink = computed(function() {
                    try {
                        var ud = JSON.parse(localStorage.getItem('bunean-user-data'));
                        if (ud && ud.role === 'company') {
                            return 'company.html?id=' + encodeURIComponent(ud.companyName || ud.name || '');
                        }
                    } catch(e) {}
                    return null;
                });

                /* Modal touch (swipe slides + pull down to close) */
                var pSX = 0, pSY = 0;
                var modalTouch = {
                    onTouchStart: function(e) { pSX = e.touches[0].clientX; pSY = e.touches[0].clientY; },
                    onTouchMove: function(e) {},
                    onTouchEnd: function(e, onClose) {
                        var dx = e.changedTouches[0].clientX - pSX;
                        var dy = e.changedTouches[0].clientY - pSY;
                        if (Math.abs(dy) > Math.abs(dx) && dy > 100) { if (onClose) onClose(); }
                        else if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 40) {
                            var imgs = previewData.value ? (previewData.value.images || [previewData.value.image]) : [];
                            if (imgs.length < 2) return;
                            var next = detailSlide.value + (dx < 0 ? 1 : -1);
                            if (next >= 0 && next < imgs.length) detailSlide.value = next;
                        }
                    }
                };

                /* Detail modal swipe */
                var dSX = 0, dSY = 0;
                var detailSwipe = {
                    onTouchStart: function(e) { dSX = e.touches[0].clientX; dSY = e.touches[0].clientY; },
                    onTouchMove: function(e) {},
                    onTouchEnd: function(e) {
                        var dx = e.changedTouches[0].clientX - dSX;
                        var dy = e.changedTouches[0].clientY - dSY;
                        if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 40) {
                            var imgs = projectDetail.value ? (projectDetail.value.images || [projectDetail.value.image]) : [];
                            if (imgs.length < 2) return;
                            var next = detailSlide2.value + (dx < 0 ? 1 : -1);
                            if (next >= 0 && next < imgs.length) detailSlide2.value = next;
                        }
                    }
                };

                function openViewerPrev(idx) {
                    if (!previewData.value) return;
                    viewerImages.value = previewData.value.images || [previewData.value.image];
                    viewerIndex.value = idx || 0;
                    viewerScale.value = 1; viewerPanX.value = 0; viewerPanY.value = 0;
                    viewerOpen.value = true;
                }

                function showProjectDetail(p) {
                    savedPreview = previewData.value;
                    previewData.value = null;
                    projectDetail.value = p;
                    detailSlide2.value = 0;
                }
                function closeProjectDetail() {
                    projectDetail.value = null;
                    previewData.value = null;
                }
                var savedPreview = null;
                function backToPreview() {
                    projectDetail.value = null;
                    if (savedPreview) {
                        previewData.value = savedPreview;
                        savedPreview = null;
                    }
                }
                function openDetailViewer(idx) {
                    if (!projectDetail.value) return;
                    viewerImages.value = projectDetail.value.images || [projectDetail.value.image];
                    viewerIndex.value = idx || 0;
                    viewerScale.value = 1; viewerPanX.value = 0; viewerPanY.value = 0;
                    viewerOpen.value = true;
                }

                /* Viewer touch (swipe + pinch-zoom + double-tap) */
                var vSX = 0, vSY = 0, vDist0 = 0, vPinch = false, vLastTap = 0;
                var viewerTouch = {
                    onTouchStart: function(e) {
                        if (e.touches.length === 2) { vPinch = true; vDist0 = Math.hypot(e.touches[0].clientX - e.touches[1].clientX, e.touches[0].clientY - e.touches[1].clientY); return; }
                        vPinch = false; vSX = e.touches[0].clientX; vSY = e.touches[0].clientY;
                        var now = Date.now();
                        if (now - vLastTap < 300) {
                            if (viewerScale.value > 1.1) { viewerScale.value = 1; viewerPanX.value = 0; viewerPanY.value = 0; }
                            else { viewerScale.value = 2.5; viewerPanX.value = 0; viewerPanY.value = 0; }
                        }
                        vLastTap = now;
                    },
                    onTouchMove: function(e) {
                        if (e.touches.length === 2 && vPinch) {
                            var d = Math.hypot(e.touches[0].clientX - e.touches[1].clientX, e.touches[0].clientY - e.touches[1].clientY);
                            var s = d / (vDist0 || 1);
                            viewerScale.value = Math.max(1, Math.min(5, viewerScale.value * (1 + (s - 1) * 0.5)));
                            vDist0 = d; return;
                        }
                        if (viewerScale.value > 1.1) {
                            viewerPanX.value += (e.touches[0].clientX - vSX); viewerPanY.value += (e.touches[0].clientY - vSY);
                            vSX = e.touches[0].clientX; vSY = e.touches[0].clientY;
                        }
                    },
                    onTouchEnd: function(e, onClose) {
                        if (vPinch) { vPinch = false; return; }
                        if (viewerScale.value > 1.1) return;
                        var dx = e.changedTouches[0].clientX - vSX; var dy = e.changedTouches[0].clientY - vSY;
                        if (Math.abs(dy) > Math.abs(dx) && dy > 80) { if (onClose) onClose(); }
                        else if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 40) {
                            var len = viewerImages.value.length;
                            if (len < 2) return;
                            var next = viewerIndex.value + (dx < 0 ? 1 : -1);
                            if (next >= 0 && next < len) { viewerIndex.value = next; viewerScale.value = 1; viewerPanX.value = 0; viewerPanY.value = 0; }
                        }
                    }
                };

                function closeViewer() { viewerOpen.value = false; viewerScale.value = 1; viewerPanX.value = 0; viewerPanY.value = 0; }
                function nextViewer() {
                    if (viewerIndex.value < viewerImages.value.length - 1) { viewerIndex.value++; viewerScale.value = 1; viewerPanX.value = 0; viewerPanY.value = 0; }
                }
                function prevViewer() {
                    if (viewerIndex.value > 0) { viewerIndex.value--; viewerScale.value = 1; viewerPanX.value = 0; viewerPanY.value = 0; }
                }

                function editProject(idx) {
                    var p = myProjects.value[idx];
                    editProjectIndex.value = idx;
                    editProjectData.value = {
                        title: p.title,
                        desc: p.desc || '',
                        category: p.category || '',
                        date: p.date || '',
                        images: (p.images || [p.image]).slice()
                    };
                    editProjectNewImages.value = [];
                }

                function closeEditProject() {
                    editProjectData.value = null;
                    editProjectIndex.value = -1;
                    editProjectNewImages.value = [];
                }

                function saveEditProject() {
                    var ed = editProjectData.value;
                    if (!ed.title.trim()) { showBrandAlert('أدخل اسم المشروع'); return; }
                    var idx = editProjectIndex.value;
                    if (idx === -1) return;
                    var p = myProjects.value[idx];
                    p.title = ed.title.trim();
                    p.desc = ed.desc.trim();
                    p.category = ed.category;
                    p.date = ed.date;
                    p.images = ed.images.slice();
                    p.image = p.images[0] || 'images/img1.jpg';
                    var profileData = loadFromStorage('bunean-company-profile', {});
                    profileData.projects = myProjects.value;
                    localStorage.setItem('bunean-company-profile', JSON.stringify(profileData));
                    closeEditProject();
                    showBrandAlert('✅ تم حفظ التعديلات');
                }

                function deleteProject(idx) {
                    showBrandConfirm('حذف المشروع؟', function() {
                        myProjects.value.splice(idx, 1);
                        var profileData = loadFromStorage('bunean-company-profile', {});
                        profileData.projects = myProjects.value;
                        localStorage.setItem('bunean-company-profile', JSON.stringify(profileData));
                        showBrandAlert('✅ تم حذف المشروع');
                    });
                }

                function handleEditProjectImages(e) {
                    var files = Array.from(e.target.files || []);
                    var remaining = 5 - editProjectData.value.images.length;
                    if (files.length > remaining) files = files.slice(0, remaining);
                    files.forEach(function(file) {
                        if (!file) return;
                        var reader = new FileReader();
                        reader.onload = function(ev) {
                            editProjectData.value.images.push(ev.target.result);
                        };
                        reader.readAsDataURL(file);
                    });
                    e.target.value = '';
                }

                function removeEditImage(idx) {
                    editProjectData.value.images.splice(idx, 1);
                }

                // Edit profile
                var editProfile = ref({
                    name: profile.value.name || '',
                    about: profile.value.about || '',
                    specs: (profile.value.specs || []).slice(),
                    location: profile.value.location || '',
                    logo: profile.value.logo || 'images/img3.jpg',
                    cover: profile.value.cover || 'images/img16.jpg',
                    workImages: (profile.value.workImages || []).slice(),
                    years: profile.value.years || '',
                    done: profile.value.done || '',
                    workers: profile.value.workers || '',
                    engineers: profile.value.engineers || ''
                });

                function addSpec() { editProfile.value.specs.push(''); }
                function removeSpec(idx) { editProfile.value.specs.splice(idx, 1); }

                var saveProfileEdit = function() {
                    var isNew = !hasCompanyProfile.value;
                    var p = loadFromStorage('bunean-company-profile', {});
                    var wasEmpty = Object.keys(p).length === 0;
                    p.name = editProfile.value.name;
                    p.about = editProfile.value.about;
                    p.specs = editProfile.value.specs.filter(function(s) { return s.trim(); });
                    p.location = editProfile.value.location;
                    p.logo = editProfile.value.logo || 'images/img3.jpg';
                    p.cover = editProfile.value.cover || 'images/img16.jpg';
                    p.workImages = editProfile.value.workImages.slice();
                    p.years = parseInt(editProfile.value.years) || 0;
                    p.done = parseInt(editProfile.value.done) || 0;
                    p.workers = parseInt(editProfile.value.workers) || 0;
                    p.engineers = parseInt(editProfile.value.engineers) || 0;
                    p.status = 'قيد المراجعة';
                    if (!p.projects) p.projects = [];
                    if (!p.ads) p.ads = [];
                    localStorage.setItem('bunean-company-profile', JSON.stringify(p));
                    if (isNew || wasEmpty) {
                        localStorage.setItem('bunean-company-auth', JSON.stringify({ name: p.name, status: p.status }));
                    }
                    companyProfileExists.value = true;
                    showBrandAlert('✅ ' + (isNew ? 'تم تسجيل الشركة بنجاح' : 'تم حفظ التعديلات') + '\nسيتم مراجعة الطلب من قبل الدعم الفني');
                    if (isNew) {
                        activeUserSection.value = '';
                    }
                };

                var deleteCompanyProfile = function() {
                    showBrandConfirm('هل أنت متأكد من حذف ملف الشركة؟\nسيتم حذف جميع البيانات (المشاريع، الإعلانات، إلخ)', function() {
                        localStorage.removeItem('bunean-company-profile');
                        localStorage.removeItem('bunean-company-auth');
                        companyProfileExists.value = false;
                        editProfile.value = { name: '', about: '', specs: [], location: '', logo: 'images/img3.jpg', cover: 'images/img16.jpg', workImages: [], years: '', done: '', workers: '', engineers: '' };
                        activeUserSection.value = '';
                        showBrandAlert('✅ تم حذف ملف الشركة');
                    });
                };

                var handleLogout = function() {
                    showBrandConfirm('تسجيل الخروج؟', function() {
                        localStorage.removeItem('bunean-user-auth');
                        localStorage.removeItem('bunean-user-data');
                        localStorage.removeItem('bunean-company-auth');
                        localStorage.removeItem('bunean-company-profile');
                        localStorage.removeItem('bunean-remember-me');
                        localStorage.removeItem('bunean-user');
                        window.location.href = 'index.html';
                    });
                };

                // ===== User sections =====
                var isReload = false;
                try { isReload = performance.getEntriesByType('navigation')[0].type === 'reload'; } catch(e) {}
                try { if (performance.navigation && performance.navigation.type === 1) isReload = true; } catch(e) {}
                var activeUserSection = ref(isReload ? restoreState('account', '') : '');
                function saveAccountState() { preserveState('account', activeUserSection.value); }
                watch(activeUserSection, function(v) { if (v) nextTick(function() { var e = document.querySelector('.page-content'); if (e) e.scrollTop = 0; }); saveAccountState(); });
                window.addEventListener('beforeunload', saveAccountState);
                var supportMessage = ref('');

                function submitSupport() {
                    if (!supportMessage.value.trim()) { showBrandAlert('اكتب رسالتك أولاً'); return; }
                    var msgs = JSON.parse(localStorage.getItem('bunean-support-messages') || '[]');
                    msgs.push({ text: supportMessage.value.trim(), date: new Date().toISOString() });
                    localStorage.setItem('bunean-support-messages', JSON.stringify(msgs));
                    supportMessage.value = '';
                    showBrandAlert('✅ تم إرسال رسالتك\nسيتم الرد عليك قريباً');
                }

                // ===== Offers (عروض الأسعار من الشركات) =====
                var userOffers = ref([
                    { id:1, company:'شركة المستقبل للمقاولات', price:'75,000,000 د.ع', duration:'6 أشهر', location:'بابل', rating:4.6, reviews:125, accepted:false, companyLink:'company.html?id=1',
                        reply:'بسم الله الرحمن الرحيم، نحن في شركة المستقبل للمقاولات يسعدنا تقديم عرضنا لمشروعكم. السعر يشمل كافة الأعمال الإنشائية والتشطيبات الأساسية وأعمال الكهرباء والسباكة. مدة التنفيذ 6 أشهر من تاريخ التوقيع. نضمن جودة العمل والالتزام بالمواصفات المتفق عليها.' },
                    { id:2, company:'شركة البناء الذكي', price:'82,500,000 د.ع', duration:'6 أشهر', location:'بابل', rating:4.4, reviews:95, accepted:false, companyLink:'company.html?id=2',
                        reply:'نشكركم على ثقتكم بشركة البناء الذكي. نقدم لكم عرضاً بقيمة 82,500,000 د.ع يشمل التصميم والتنفيذ والإشراف الهندسي. مدة التنفيذ 6 أشهر مع ضمان لمدة 5 سنوات على الأعمال.' },
                    { id:3, company:'شركة دار الإنجاز', price:'87,000,000 د.ع', duration:'7 أشهر', location:'النجف', rating:4.5, reviews:110, accepted:false, companyLink:'company.html?id=3',
                        reply:'شركة دار الإنجاز تقدم عرضها التنافسي لمشروعكم. يتضمن العرض الأعمال الهيكلية والتشطيبات الداخلية والخارجية. خبرتنا في المجال تضمن لكم أفضل النتائج بأعلى جودة.' },
                    { id:4, company:'شركة الإعمار الحديث', price:'92,000,000 د.ع', duration:'7 أشهر', location:'النجف', rating:4.3, reviews:76, accepted:false, companyLink:'company.html?id=4',
                        reply:'عرضنا يشمل تنفيذ المشروع حسب المخططات المقدمة مع توفير كافة المواد. نتميز بفريق هندسي متكامل وخبرة تتجاوز 15 عاماً في مجال المقاولات.' },
                    { id:5, company:'شركة النخبة للمقاولات', price:'95,500,000 د.ع', duration:'8 أشهر', location:'الحلة', rating:4.7, reviews:142, accepted:false, companyLink:'company.html?id=5',
                        reply:'يسر شركة النخبة للمقاولات أن تقدم لكم أفضل عروضها. نعدكم بالالتزام بأعلى معايير الجودة والمواصفات المطلوبة مع أفضل فريق عمل. عرضنا يشمل كافة التفاصيل المذكورة.' },
                ]);
                var selectedOffer = ref(null);

                function viewOfferDetail(off) {
                    selectedOffer.value = off;
                }

                function acceptOffer(off) {
                    if (!off.accepted) {
                        var hasPrev = userOffers.value.some(function(o) { return o.accepted; });
                        var msg = hasPrev ? 'سيتم إلغاء اختيار العرض السابق. هل أنت متأكد من اختيار هذا العرض؟' : 'هل أنت متأكد من اختيار هذا العرض؟';
                        showBrandConfirm(msg, function() {
                            var accepted = JSON.parse(localStorage.getItem('bunean-accepted-offers') || '[]');
                            userOffers.value.forEach(function(o) {
                                if (o.accepted) {
                                    o.accepted = false;
                                    var idx = accepted.indexOf(o.id);
                                    if (idx !== -1) accepted.splice(idx, 1);
                                }
                            });
                            off.accepted = true;
                            if (accepted.indexOf(off.id) === -1) {
                                accepted.push(off.id);
                            }
                            localStorage.setItem('bunean-accepted-offers', JSON.stringify(accepted));
                            selectedOffer.value = null;
                            showBrandAlert('✅ تم اختيار العرض بنجاح');
                        });
                    }
                }

                function revokeOffer(off) {
                    showBrandConfirm('الغاء اختيار هذا العرض؟', function() {
                        off.accepted = false;
                        var accepted = JSON.parse(localStorage.getItem('bunean-accepted-offers') || '[]');
                        var idx = accepted.indexOf(off.id);
                        if (idx !== -1) accepted.splice(idx, 1);
                        localStorage.setItem('bunean-accepted-offers', JSON.stringify(accepted));
                        showBrandAlert('✅ تم إلغاء اختيار العرض');
                    });
                }

                // Load persisted accepted states
                (function loadAccepted() {
                    var accepted = JSON.parse(localStorage.getItem('bunean-accepted-offers') || '[]');
                    userOffers.value.forEach(function(o) {
                        if (accepted.indexOf(o.id) !== -1) o.accepted = true;
                    });
                })();

                // Handle URL params (navigation from notifications / home)
                (function() {
                    var params = new URLSearchParams(window.location.search);
                    var section = params.get('section');
                    var offerId = params.get('offerId');
                    if (section === 'company-ads') {
                        activeUserSection.value = 'company-ads';
                    } else if (section === 'company-offers') {
                        activeUserSection.value = 'company-offers';
                    } else if (section === 'user-offers' && offerId) {
                        activeUserSection.value = 'user-offers';
                        var off = userOffers.value.find(function(o) { return o.id === parseInt(offerId); });
                        if (off) {
                            setTimeout(function() {
                                selectedOffer.value = off;
                                var el = document.getElementById('offer-' + off.id);
                                if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                            }, 400);
                        }
                    }
                })();

                return {
                    user, menuItems, isCompany, hasCompanyProfile, companyProfileExists, isLightMode, themeIcon, handleToggleTheme,
                    companyStatus,
                    companyOffersTab, quoteRequests, activeRequest, replyText, replyAmount, sendReply,
                    serviceRequests, activeServiceRequest, serviceReplyText, serviceReplyAmount, sendServiceReply,
                    myQuotes, getStatusStyle,
                    selectedMyQuote, myQuoteEdit, editMyQuote, saveMyQuote,
                    myAds, adFormPage, editingAdId, selectedAd, newAd, adInput, adMatInput, handleAdImages, removeAdImage, addAdMaterial, removeAdMaterial, triggerAdMatUpload, handleAdMatImage, submitAd, openAdForm, closeAdForm, viewAd, editAd, deleteAd,
                    myProjects, newProject, submitProject, categories,
                    projectTab,
                    logoInput, coverInput, workInput, projectInput,
                    triggerUpload, handleUpload, handleWorkImages, removeWorkImage, handleProjectImages, removeProjectImage,
                    previewData, viewerImg, detailSlide, projectDetail, detailSlide2,
                    previewProject,
                    modalTouch, detailSwipe,
                    userCompanyLink,
                    openViewerPrev, showProjectDetail, closeProjectDetail, backToPreview, openDetailViewer,
                    viewerOpen, viewerIndex, viewerScale, viewerPanX, viewerPanY, viewerImages, isPinch,
                    viewerTouch, closeViewer, nextViewer, prevViewer,
                    editProjectData, editProjectInput,
                    editProject, closeEditProject, saveEditProject,
                    deleteProject,
                    handleEditProjectImages, removeEditImage,
                    editProfile, addSpec, removeSpec, saveProfileEdit, deleteCompanyProfile, handleLogout,
                    activeUserSection, userOffers, selectedOffer, viewOfferDetail, acceptOffer, revokeOffer,
                    supportMessage, submitSupport,
                    requireAccount, goTo
                };
            }
        }).mount('#app');

/* ---- Back Button ---- */
        (function() {
            var appEl = document.getElementById('app');
            if (!appEl || !appEl.__vue_app__) return;
            PullToRefresh.init();
            BackNav.init();
            BackNav.registerCloseHandler(function() {
                var vm = appEl.__vue_app__._instance.setupState;
                if (vm.viewerOpen && vm.viewerOpen.value) { vm.viewerOpen.value = false; return true; }
                if (vm.activeUserSection && vm.activeUserSection.value) { vm.activeUserSection.value = ''; return true; }
                return false;
            });
            history.pushState({ action: 'init' }, '');
        })();

        initFloatingCart();
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('sw.js')
                .then(function() { console.log('SW registered'); })
                .catch(function(err) { console.log('SW registration failed'); });
        }