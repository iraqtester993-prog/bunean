

initTheme();
        document.getElementById('header').innerHTML = renderHeader({ title: 'الإشعارات' });
        document.getElementById('bottomNav').innerHTML = renderNav('account');

        const { createApp, ref, computed, nextTick } = Vue;

        createApp({
            setup() {
                initTheme();

                var activeTab = ref('support');
                var showPermissionBanner = ref(BuneanNotif.getPermission() === 'default');

                function enableNotifications() {
                    BuneanNotif.requestPermission(function(permission) {
                        showPermissionBanner.value = (permission === 'default');
                        if (permission === 'granted') {
                            showBrandAlert('تم تفعيل الإشعارات بنجاح');
                            BuneanNotif.playNotifSound();
                        } else {
                            showBrandAlert('لم يتم التفعيل - يمكنك تفعيلها من إعدادات المتصفح');
                        }
                    });
                }

                var userData = JSON.parse(localStorage.getItem('bunean-user-data') || '{}');
                var isCompany = userData.role === 'company';
                var replyText = ref('');
                var replyAmount = ref('');
                var activeNotifReply = ref(null);

                var staticNotifications = computed(function() {
                    if (isCompany) {
                        return [
                            { id: 1, type: 'support', read: false, title: 'تم استلام استفسار جديد', preview: 'تم استلام استفسار من أحد المستخدمين بشأن مشروع بناء', time: 'منذ 30 دقيقة', message: 'تم استلام استفسار من مستخدم بخصوص مشروع بناء سكني. يرجى مراجعة التفاصيل في قسم طلبات العروض.' },
                            { id: 2, type: 'offer', read: false, offerId: 1, title: 'تم قبول عرضك المقدم', preview: 'قام أحد العملاء بقبول عرضك المقدم لمشروع بناء فيلا سكنية بقيمة 95,000,000 دينار.', time: 'منذ ساعة', company: '', price: '95,000,000 د.ع', duration: '', details: 'تم قبول عرضك المقدم لمشروع بناء فيلا سكنية. يرجى التواصل مع العميل لمتابعة الإجراءات.' },
                            { id: 3, type: 'support', read: true, title: 'تحديث حالة تذكرتك', preview: 'تم تحديث حالة تذكرتك الدعم الفني إلى "قيد المعالجة"', time: 'منذ 3 ساعات', message: 'تذكرة الدعم الفني الخاصة بك رقم #BN-2605-77201\nالحالة: قيد المعالجة\n\nسيتم إعلامك فور اكتمال المعالجة.' },
                            { id: 4, type: 'offer', read: false, offerId: 2, title: 'عرض جديد من مستخدم', preview: 'تم استلام طلب عرض سعر جديد من مستخدم لمشروع تشطيب شقة.', time: 'منذ 5 ساعات', company: '', price: '', duration: '', details: 'طلب عرض سعر جديد. يرجى مراجعة التفاصيل في قسم طلبات العروض.' },
                            { id: 5, type: 'support', read: false, title: 'إنشاء تذكرة دعم جديدة', preview: 'تم إنشاء تذكرة دعم فني جديدة من قبل مستخدم', time: 'منذ يوم', message: 'تم إنشاء تذكرة دعم فني جديدة. الرجاء مراجعتها في أقرب وقت.' }
                        ];
                    }
                    return [
                        { id: 1, type: 'support', read: false, title: 'تم الرد على استفسارك', preview: 'شكراً لتواصلك مع بنيان، تم حل مشكلتك وسيتم التواصل معك قريباً لمتابعة التفاصيل.', time: 'منذ 15 دقيقة', message: 'شكراً لتواصلك مع فريق الدعم الفني في بنيان.\n\nنؤكد لك أنه تم حل المشكلة التي أبلغت عنها وسيتم التواصل معك خلال 24 ساعة لمتابعة التفاصيل الكاملة.\n\nمع جزيل الشكر،\nفريق بنيان' },
                        { id: 2, type: 'offer', read: false, offerId: 1, title: 'عرض من شركة المستقبل للمقاولات', preview: 'تقدم شركة المستقبل للمقاولات عرضاً لتنفيذ مشروعك بقيمة 75,000,000 دينار.', time: 'منذ 3 ساعات', company: 'شركة المستقبل للمقاولات', price: '75,000,000 د.ع', duration: '6 أشهر', details: 'يسر شركة المستقبل للمقاولات أن تتقدم إليكم بعرضها لتنفيذ المشروع المطلوب وفق المواصفات المرفقة. تتمتع الشركة بخبرة تزيد عن 15 عاماً في مجال المقاولات العامة وتنفيذ المشاريع السكنية والتجارية.', companyLink: 'company.html' },
                        { id: 3, type: 'offer', read: false, offerId: 2, title: 'عرض من شركة البناء الذكي', preview: 'عرض تنافسي من شركة البناء الذكي لتنفيذ مشروعك بقيمة 82,500,000 دينار.', time: 'منذ 5 ساعات', company: 'شركة البناء الذكي', price: '82,500,000 د.ع', duration: '6 أشهر', details: 'تتشرف شركة البناء الذكي بتقديم عرضها لتنفيذ مشروعكم بأعلى معايير الجودة وباستخدام أحدث التقنيات في مجال البناء.', companyLink: 'company.html' },
                        { id: 4, type: 'service', read: true, title: 'تم استلام طلب عرض سعر', preview: 'تم إرسال طلب عرض سعر الخاصة بك بنجاح، سيتم الرد عليك من قبل المختصين قريباً.', time: 'منذ يوم', message: 'تم استلام طلب عرض سعر الذي أرسلته بنجاح. فريقنا المختص سيقوم بمراجعة طلبك والرد عليك في أقرب وقت ممكن.\n\nشكراً لثقتك ببنيان.' },
                        { id: 5, type: 'support', read: true, title: 'تم تحديث تذكرتك الدعم', preview: 'تم تحديث حالة تذكرتك الدعم الفني رقم #BN-2505-88901', time: 'منذ يومين', message: 'تذكرة الدعم الفني الخاصة بك رقم #BN-2505-88901\nالحالة: قيد المعالجة\n\nسيتم إعلامك فور اكتمال المعالجة.' },
                        { id: 6, type: 'offer', read: true, offerId: 3, title: 'عرض من شركة دار الإنجاز', preview: 'عرض جديد من شركة دار الإنجاز لتنفيذ مشروعك بقيمة 87,000,000 دينار.', time: 'منذ 3 أيام', company: 'شركة دار الإنجاز', price: '87,000,000 د.ع', duration: '7 أشهر', details: 'شركة دار الإنجاز للمقاولات تقدم لكم عرضها المتكامل لتنفيذ المشروع. الشركة متخصصة في المشاريع السكنية والتجارية مع سجل حافل من المشاريع الناجحة.', companyLink: 'company.html' }
                    ];
                });

                function loadQuoteRequestNotifs() {
                    var list = [];
                    if (!isCompany) return list;
                    var reqs = JSON.parse(localStorage.getItem('bunean-quote-requests') || '[]');
                    var readIds = JSON.parse(localStorage.getItem('bunean-qr-read') || '[]');
                    reqs.forEach(function(r) {
                        list.push({
                            id: 'qr_' + r.id,
                            type: 'quote_request',
                            read: readIds.indexOf(r.id) !== -1,
                            title: 'طلب عرض سعر جديد',
                            preview: r.category + ' - ' + r.name,
                            time: timeAgo(r.createdAt),
                            request: r
                        });
                    });
                    return list;
                }

                function timeAgo(iso) {
                    var diff = Date.now() - new Date(iso).getTime();
                    var mins = Math.floor(diff / 60000);
                    if (mins < 60) return 'منذ ' + mins + ' دقيقة';
                    var hrs = Math.floor(mins / 60);
                    if (hrs < 24) return 'منذ ' + hrs + ' ساعة';
                    var days = Math.floor(hrs / 24);
                    return 'منذ ' + days + ' يوم';
                }

                var notifications = computed(function() {
                    var all = [];
                    // Load static notifications
                    var staticList = staticNotifications.value;
                    for (var s = 0; s < staticList.length; s++) {
                        all.push(staticList[s]);
                    }
                    // Load from bunean-notifications (dashboard)
                    try {
                        var dashNotifs = JSON.parse(localStorage.getItem('bunean-notifications') || '[]');
                        var currentUser = localStorage.getItem('bunean-user-auth') || '';
                        var companyAuth = JSON.parse(localStorage.getItem('bunean-company-auth') || 'null');
                        var companyName = companyAuth ? companyAuth.name : '';
                        for (var d = 0; d < dashNotifs.length; d++) {
                            var dn = dashNotifs[d];
                            // Check if this notification is for this user
                            var showForMe = false;
                            if (dn.targetType === 'all' || dn.targetType === undefined) showForMe = true;
                            else if (dn.targetType === 'users' && !isCompany) showForMe = true;
                            else if (dn.targetType === 'companies' && isCompany) showForMe = true;
                            else if (dn.targetType === 'user' && dn.target === currentUser) showForMe = true;
                            else if (dn.targetType === 'company' && companyName && dn.target === companyName) showForMe = true;
                            if (showForMe) {
                                all.push({
                                    id: 'dash_' + dn.id,
                                    type: dn.targetType === 'offer' ? 'offer' : 'support',
                                    read: dn.read || false,
                                    title: dn.title || 'إشعار',
                                    preview: dn.message || '',
                                    time: dn.date || '',
                                    message: dn.message || '',
                                    fromDashboard: true
                                });
                            }
                        }
                    } catch(e) {}
                    // Load quote requests
                    var qr = loadQuoteRequestNotifs();
                    for (var q = 0; q < qr.length; q++) all.push(qr[q]);
                    // Load service requests
                    var sr = loadServiceRequestNotifs();
                    for (var sv = 0; sv < sr.length; sv++) all.push(sr[sv]);
                    // Sort by newest first
                    all.sort(function(a,b){ return (b.id || 0) - (a.id || 0); });
                    return all;
                });

                var filtered = computed(function() {
                    if (activeTab.value === 'all') return notifications.value;
                    return notifications.value.filter(function(n) { return n.type === activeTab.value; });
                });

                function iconName(type) {
                    if (type === 'support') return 'support_agent';
                    if (type === 'offer') return 'request_quote';
                    if (type === 'quote_request') return 'edit_note';
                    if (type === 'service_request') return 'build';
                    return 'handyman';
                }

                function iconBg(type) {
                    if (type === 'support') return '#3b82f6';
                    if (type === 'offer') return 'var(--accent-gold)';
                    if (type === 'quote_request') return '#f59e0b';
                    if (type === 'service_request') return '#f59e0b';
                    return '#4caf50';
                }

                function openNotif(n) {
                    n.read = true;
                    if (n.type === 'offer') {
                        requireAccount(function() { goTo('account.html?section=user-offers&offerId=' + n.offerId); });
                        return;
                    }
                    if (n.type === 'support') {
                        showSupportModal(n);
                    } else if (n.type === 'quote_request') {
                        showQuoteRequestModal(n);
                    } else if (n.type === 'service_request') {
                        showServiceRequestModal(n);
                    } else {
                        showServiceModal(n);
                    }
                }

                function showSupportModal(n) {
                    var overlay = document.createElement('div');
                    overlay.className = 'notif-overlay';
                    overlay.setAttribute('onclick', 'this.remove()');
                    var modal = document.createElement('div');
                    modal.className = 'notif-modal';
                    modal.setAttribute('onclick', 'event.stopPropagation()');
                    modal.innerHTML =
                        '<div style="padding:20px 16px;text-align:center;border-bottom:1px solid var(--border-light);">'
                        + '<div style="width:48px;height:48px;border-radius:14px;background:#3b82f6;display:flex;align-items:center;justify-content:center;margin:0 auto 10px;"><span class="material-symbols-outlined" style="font-size:24px;color:#fff;">support_agent</span></div>'
                        + '<h3 style="color:var(--text-white);font-size:16px;font-weight:700;margin:0;">الدعم الفني</h3>'
                        + '<p style="color:var(--text-muted);font-size:11px;margin:4px 0 0;">' + n.time + '</p>'
                        + '</div>'
                        + '<div style="padding:16px;"><p style="color:var(--text-white);font-size:13px;line-height:1.8;margin:0;white-space:pre-wrap;">' + n.message + '</p></div>'
                        + '<div style="padding:0 16px 16px;display:flex;gap:8px;">'
                        + '<button onclick="this.closest(\'.notif-overlay\').remove()" style="flex:1;padding:10px;border:none;border-radius:12px;background:var(--accent-gold);color:var(--primary-dark);font-size:13px;font-weight:700;font-family:Cairo,sans-serif;cursor:pointer;">حسناً</button>'
                        + '<button onclick="this.closest(\'.notif-overlay\').remove()" style="padding:10px 14px;border:1px solid var(--border-light);border-radius:12px;background:transparent;color:var(--text-muted);font-size:13px;font-family:Cairo,sans-serif;cursor:pointer;"><span class="material-symbols-outlined" style="font-size:18px;vertical-align:middle;">delete</span></button>'
                        + '</div>';
                    overlay.appendChild(modal);
                    document.body.appendChild(overlay);
                }

                function showOfferModal(n) {
                    var overlay = document.createElement('div');
                    overlay.className = 'notif-overlay';
                    overlay.setAttribute('onclick', 'this.remove()');
                    var modal = document.createElement('div');
                    modal.className = 'notif-modal';
                    modal.setAttribute('onclick', 'event.stopPropagation()');
                    modal.innerHTML =
                        '<div style="padding:20px 16px;text-align:center;border-bottom:1px solid var(--border-light);">'
                        + '<div style="width:48px;height:48px;border-radius:14px;background:var(--accent-gold);display:flex;align-items:center;justify-content:center;margin:0 auto 10px;"><span class="material-symbols-outlined" style="font-size:24px;color:var(--primary-dark);">request_quote</span></div>'
                        + '<h3 style="color:var(--text-white);font-size:16px;font-weight:700;margin:0;">عرض جديد</h3>'
                        + '<p style="color:var(--text-muted);font-size:11px;margin:4px 0 0;">' + n.time + '</p>'
                        + '</div>'
                        + '<div style="padding:16px;">'
                        + '<div style="background:var(--bg-input);border-radius:12px;padding:14px;margin-bottom:12px;">'
                        + '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;">'
                        + '<span style="color:var(--text-white);font-size:14px;font-weight:700;">' + n.company + '</span>'
                        + '<svg width="20" height="20" fill="var(--accent-gold)" viewBox="0 0 24 24"><path d="M19,2L14,6.5V9H10V6L5,10.5V22H9V18H15V22H19V2M7,20V12L10,9.3V11H14V8.3L17,5.6V20H15V16H9V20H7Z"></path></svg>'
                        + '</div>'
                        + '<div style="display:flex;justify-content:space-between;align-items:center;padding-top:10px;border-top:1px solid var(--border-light);">'
                        + '<span style="color:var(--text-muted);font-size:12px;">السعر الإجمالي</span>'
                        + '<span style="color:var(--accent-gold);font-size:18px;font-weight:700;">' + n.price + '</span>'
                        + '</div>'
                        + '<div style="display:flex;justify-content:space-between;align-items:center;margin-top:6px;">'
                        + '<span style="color:var(--text-muted);font-size:12px;">مدة التنفيذ</span>'
                        + '<span style="color:#4caf50;font-size:13px;font-weight:600;">' + n.duration + '</span>'
                        + '</div>'
                        + '</div>'
                        + '<p style="color:var(--text-white);font-size:13px;line-height:1.7;margin:0;">' + n.details + '</p>'
                        + '</div>'
                        + '<div style="padding:0 16px 16px;display:flex;flex-direction:column;gap:8px;">'
                        + '<a href="' + n.companyLink + '" style="display:block;text-align:center;padding:10px;border-radius:12px;border:1px solid var(--border-light);color:var(--text-white);font-size:13px;font-weight:600;text-decoration:none;font-family:Cairo,sans-serif;">عرض ملف الشركة</a>'
                        + '<button onclick="this.closest(\'.notif-overlay\').remove()" style="width:100%;padding:10px;border:none;border-radius:12px;background:var(--accent-gold);color:var(--primary-dark);font-size:13px;font-weight:700;font-family:Cairo,sans-serif;cursor:pointer;">إغلاق</button>'
                        + '</div>';
                    overlay.appendChild(modal);
                    document.body.appendChild(overlay);
                }

                function showQuoteRequestModal(n) {
                    var r = n.request;
                    var readIds = JSON.parse(localStorage.getItem('bunean-qr-read') || '[]');
                    if (readIds.indexOf(r.id) === -1) {
                        readIds.push(r.id);
                        localStorage.setItem('bunean-qr-read', JSON.stringify(readIds));
                    }
                    activeNotifReply.value = r;
                    var overlay = document.createElement('div');
                    overlay.className = 'notif-overlay';
                    overlay.id = 'qr-overlay';
                    overlay.setAttribute('onclick', 'this.remove()');
                    var modal = document.createElement('div');
                    modal.className = 'notif-modal';
                    modal.setAttribute('onclick', 'event.stopPropagation()');
                    var replyHtml = '';
                    if (r.replied) {
                        replyHtml = '<div style="background:var(--bg-input);border-radius:12px;padding:12px;margin-top:10px;border-right:3px solid var(--accent-gold);"><p style="color:var(--text-muted);font-size:11px;margin:0 0 4px;">ردك:</p><p style="color:var(--text-white);font-size:13px;line-height:1.6;margin:0;white-space:pre-wrap;">' + r.replyMessage + '</p>' + (r.replyAmount ? '<p style="color:var(--accent-gold);font-size:12px;margin:6px 0 0;font-weight:600;">المبلغ: ' + r.replyAmount + '</p>' : '') + '</div>';
                    }
                    var replyFormHtml = '';
                    if (!r.replied) {
                        replyFormHtml = '<div style="padding:12px 16px;border-top:1px solid var(--border-light);">'
                            + '<input id="notif-reply-amount" type="text" placeholder="المبلغ (مثال: 50,000,000 د.ع)" style="width:100%;padding:10px;border-radius:10px;border:1px solid var(--border-light);background:var(--bg-input);color:var(--text-white);font-size:13px;font-family:Cairo,sans-serif;box-sizing:border-box;margin-bottom:8px;">'
                            + '<textarea id="notif-reply-text" placeholder="اكتب ردك على هذا الطلب..." rows="2" style="width:100%;padding:10px;border-radius:10px;border:1px solid var(--border-light);background:var(--bg-input);color:var(--text-white);font-size:13px;font-family:Cairo,sans-serif;resize:none;box-sizing:border-box;"></textarea>'
                            + '<button onclick="sendNotifReply()" style="width:100%;padding:10px;margin-top:8px;border:none;border-radius:12px;background:var(--accent-gold);color:var(--primary-dark);font-size:13px;font-weight:700;cursor:pointer;font-family:Cairo,sans-serif;">إرسال الرد</button>'
                            + '</div>';
                    }
                    modal.innerHTML =
                        '<div style="padding:20px 16px;text-align:center;border-bottom:1px solid var(--border-light);position:relative;">'
                        + '<button onclick="this.closest(\'.notif-overlay\').remove()" style="position:absolute;top:12px;left:12px;width:32px;height:32px;border-radius:50%;border:none;background:rgba(255,255,255,0.1);color:var(--text-white);display:flex;align-items:center;justify-content:center;cursor:pointer;"><span class="material-symbols-outlined" style="font-size:20px;">close</span></button>'
                        + '<div style="width:48px;height:48px;border-radius:14px;background:#f59e0b;display:flex;align-items:center;justify-content:center;margin:0 auto 10px;"><span class="material-symbols-outlined" style="font-size:24px;color:#fff;">edit_note</span></div>'
                        + '<h3 style="color:var(--text-white);font-size:16px;font-weight:700;margin:0;">طلب عرض سعر</h3>'
                        + '<p style="color:var(--text-muted);font-size:11px;margin:4px 0 0;">' + n.time + '</p>'
                        + '</div>'
                        + '<div style="padding:16px;">'
                        + '<div style="background:var(--bg-input);border-radius:12px;padding:14px;margin-bottom:12px;">'
                        + '<div style="display:flex;justify-content:space-between;margin-bottom:8px;"><span style="color:var(--text-muted);font-size:12px;">الاسم</span><span style="color:var(--text-white);font-size:13px;font-weight:600;">' + r.name + '</span></div>'
                        + '<div style="display:flex;justify-content:space-between;margin-bottom:8px;"><span style="color:var(--text-muted);font-size:12px;">الموقع</span><span style="color:var(--text-white);font-size:13px;font-weight:600;">' + (r.location || 'غير محدد') + '</span></div>'
                        + '<div style="display:flex;justify-content:space-between;margin-bottom:8px;"><span style="color:var(--text-muted);font-size:12px;">الميزانية</span><span style="color:var(--text-white);font-size:13px;font-weight:600;">' + (r.budget || 'غير محددة') + '</span></div>'
                        + '<div style="display:flex;justify-content:space-between;margin-bottom:8px;"><span style="color:var(--text-muted);font-size:12px;">المساحة</span><span style="color:var(--text-white);font-size:13px;font-weight:600;">' + (r.size || 'غير محددة') + '</span></div>'
                        + '<div style="display:flex;justify-content:space-between;margin-bottom:8px;"><span style="color:var(--text-muted);font-size:12px;">التصنيف</span><span style="color:var(--text-white);font-size:13px;font-weight:600;">' + (r.category || 'غير محدد') + '</span></div>'
                        + '<div style="padding-top:10px;border-top:1px solid var(--border-light);"><p style="color:var(--text-muted);font-size:12px;margin:0 0 4px;">التفاصيل:</p><p style="color:var(--text-white);font-size:13px;line-height:1.6;margin:0;">' + (r.details || '—') + '</p></div>'
                        + '</div>'
                        + '<div style="display:flex;justify-content:space-between;align-items:center;padding:8px 0;"><span style="color:var(--text-muted);font-size:12px;">الحالة</span><span style="color:' + (r.replied ? '#4caf50' : '#f59e0b') + ';font-size:13px;font-weight:600;">' + (r.replied ? 'تم الرد' : 'بانتظار الرد') + '</span></div>'
                        + replyHtml
                        + '</div>'
                        + replyFormHtml
                        + '<div style="padding:0 16px 16px;">'
                        + '<button onclick="this.closest(\'.notif-overlay\').remove()" style="width:100%;padding:10px;border:none;border-radius:12px;background:var(--accent-gold);color:var(--primary-dark);font-size:13px;font-weight:700;font-family:Cairo,sans-serif;cursor:pointer;">إغلاق</button>'
                        + '</div>';
                    overlay.appendChild(modal);
                    document.body.appendChild(overlay);
                }

                window.sendNotifReply = function() {
                    requireAccount(function() {
                    var textEl = document.getElementById('notif-reply-text');
                    var amountEl = document.getElementById('notif-reply-amount');
                    var text = textEl ? textEl.value.trim() : '';
                    var amount = amountEl ? amountEl.value.trim() : '';
                    if (!text) { showBrandAlert('اكتب الرد أولاً'); return; }
                    var req = activeNotifReply.value;
                    if (!req) return;
                    // Update the request as replied
                    var qs = JSON.parse(localStorage.getItem('bunean-quote-requests') || '[]');
                    var idx = qs.findIndex(function(q) { return q.id === req.id; });
                    if (idx !== -1) {
                        qs[idx].replied = true;
                        qs[idx].replyMessage = text;
                        qs[idx].replyAmount = amount;
                        localStorage.setItem('bunean-quote-requests', JSON.stringify(qs));
                    }
                    // Create a quote in company's my-quotes
                    var quotes = JSON.parse(localStorage.getItem('bunean-company-quotes') || '[]');
                    quotes.push({
                        id: Date.now(),
                        requestId: req.id,
                        client: req.name || 'عميل',
                        project: req.category || '',
                        amount: amount || '',
                        notes: text,
                        status: 'قيد المراجعة',
                        createdAt: new Date().toISOString()
                    });
                    localStorage.setItem('bunean-company-quotes', JSON.stringify(quotes));
                    // Close modal and show success
                    var overlay = document.getElementById('qr-overlay');
                    if (overlay) overlay.remove();
                    showBrandAlert('✅ تم إرسال الرد وإنشاء العرض');
                    });
                };

                function loadServiceRequestNotifs() {
                    var list = [];
                    if (!isCompany) return list;
                    var reqs = JSON.parse(localStorage.getItem('bunean-service-requests') || '[]');
                    var readIds = JSON.parse(localStorage.getItem('bunean-sr-read') || '[]');
                    reqs.forEach(function(r) {
                        list.push({
                            id: 'sr_' + r.id,
                            type: 'service_request',
                            read: readIds.indexOf(r.id) !== -1,
                            title: 'طلب عرض سعر جديد',
                            preview: (r.consultType || 'خدمة') + ' - ' + r.name,
                            time: timeAgo(r.createdAt),
                            request: r
                        });
                    });
                    return list;
                }

                function showServiceRequestModal(n) {
                    var r = n.request;
                    var readIds = JSON.parse(localStorage.getItem('bunean-sr-read') || '[]');
                    if (readIds.indexOf(r.id) === -1) {
                        readIds.push(r.id);
                        localStorage.setItem('bunean-sr-read', JSON.stringify(readIds));
                    }
                    activeNotifReply.value = r;
                    var overlay = document.createElement('div');
                    overlay.className = 'notif-overlay';
                    overlay.id = 'sr-overlay';
                    overlay.setAttribute('onclick', 'this.remove()');
                    var modal = document.createElement('div');
                    modal.className = 'notif-modal';
                    modal.setAttribute('onclick', 'event.stopPropagation()');
                    var replyHtml = '';
                    if (r.replied) {
                        replyHtml = '<div style="background:var(--bg-input);border-radius:12px;padding:12px;margin-top:10px;border-right:3px solid var(--accent-gold);"><p style="color:var(--text-muted);font-size:11px;margin:0 0 4px;">ردك:</p><p style="color:var(--text-white);font-size:13px;line-height:1.6;margin:0;white-space:pre-wrap;">' + r.replyMessage + '</p>' + (r.replyAmount ? '<p style="color:var(--accent-gold);font-size:12px;margin:6px 0 0;font-weight:600;">المبلغ: ' + r.replyAmount + '</p>' : '') + '</div>';
                    }
                    var replyFormHtml = '';
                    if (!r.replied) {
                        replyFormHtml = '<div style="padding:12px 16px;border-top:1px solid var(--border-light);">'
                            + '<input id="sr-reply-amount" type="text" placeholder="المبلغ (مثال: 50,000,000 د.ع)" style="width:100%;padding:10px;border-radius:10px;border:1px solid var(--border-light);background:var(--bg-input);color:var(--text-white);font-size:13px;font-family:Cairo,sans-serif;box-sizing:border-box;margin-bottom:8px;">'
                            + '<textarea id="sr-reply-text" placeholder="اكتب ردك على هذا الطلب..." rows="2" style="width:100%;padding:10px;border-radius:10px;border:1px solid var(--border-light);background:var(--bg-input);color:var(--text-white);font-size:13px;font-family:Cairo,sans-serif;resize:none;box-sizing:border-box;"></textarea>'
                            + '<button onclick="sendServiceNotifReply()" style="width:100%;padding:10px;margin-top:8px;border:none;border-radius:12px;background:var(--accent-gold);color:var(--primary-dark);font-size:13px;font-weight:700;cursor:pointer;font-family:Cairo,sans-serif;">إرسال الرد</button>'
                            + '</div>';
                    }
                    modal.innerHTML =
                        '<div style="padding:20px 16px;text-align:center;border-bottom:1px solid var(--border-light);position:relative;">'
                        + '<button onclick="this.closest(\'.notif-overlay\').remove()" style="position:absolute;top:12px;left:12px;width:32px;height:32px;border-radius:50%;border:none;background:rgba(255,255,255,0.1);color:var(--text-white);display:flex;align-items:center;justify-content:center;cursor:pointer;"><span class="material-symbols-outlined" style="font-size:20px;">close</span></button>'
                        + '<div style="width:48px;height:48px;border-radius:14px;background:#f59e0b;display:flex;align-items:center;justify-content:center;margin:0 auto 10px;"><span class="material-symbols-outlined" style="font-size:24px;color:#fff;">build</span></div>'
                        + '<h3 style="color:var(--text-white);font-size:16px;font-weight:700;margin:0;">طلب عرض سعر</h3>'
                        + '<p style="color:var(--text-muted);font-size:11px;margin:4px 0 0;">' + n.time + '</p>'
                        + '</div>'
                        + '<div style="padding:16px;">'
                        + '<div style="background:var(--bg-input);border-radius:12px;padding:14px;margin-bottom:12px;">'
                        + '<div style="display:flex;justify-content:space-between;margin-bottom:8px;"><span style="color:var(--text-muted);font-size:12px;">الاسم</span><span style="color:var(--text-white);font-size:13px;font-weight:600;">' + r.name + '</span></div>'
                        + '<div style="display:flex;justify-content:space-between;margin-bottom:8px;"><span style="color:var(--text-muted);font-size:12px;">المحافظة</span><span style="color:var(--text-white);font-size:13px;font-weight:600;">' + (r.gov || 'غير محدد') + '</span></div>'
                        + '<div style="display:flex;justify-content:space-between;margin-bottom:8px;"><span style="color:var(--text-muted);font-size:12px;">نوع الخدمة</span><span style="color:var(--text-white);font-size:13px;font-weight:600;">' + (r.consultType || 'غير محدد') + '</span></div>'
                        + '<div style="padding-top:10px;border-top:1px solid var(--border-light);"><p style="color:var(--text-muted);font-size:12px;margin:0 0 4px;">التفاصيل:</p><p style="color:var(--text-white);font-size:13px;line-height:1.6;margin:0;">' + (r.desc || '—') + '</p></div>'
                        + '</div>'
                        + '<div style="display:flex;justify-content:space-between;align-items:center;padding:8px 0;"><span style="color:var(--text-muted);font-size:12px;">الحالة</span><span style="color:' + (r.replied ? '#4caf50' : '#f59e0b') + ';font-size:13px;font-weight:600;">' + (r.replied ? 'تم الرد' : 'بانتظار الرد') + '</span></div>'
                        + replyHtml
                        + '</div>'
                        + replyFormHtml
                        + '<div style="padding:0 16px 16px;">'
                        + '<button onclick="this.closest(\'.notif-overlay\').remove()" style="width:100%;padding:10px;border:none;border-radius:12px;background:var(--accent-gold);color:var(--primary-dark);font-size:13px;font-weight:700;font-family:Cairo,sans-serif;cursor:pointer;">إغلاق</button>'
                        + '</div>';
                    overlay.appendChild(modal);
                    document.body.appendChild(overlay);
                }

                window.sendServiceNotifReply = function() {
                    requireAccount(function() {
                    var textEl = document.getElementById('sr-reply-text');
                    var amountEl = document.getElementById('sr-reply-amount');
                    var text = textEl ? textEl.value.trim() : '';
                    var amount = amountEl ? amountEl.value.trim() : '';
                    if (!text) { showBrandAlert('اكتب الرد أولاً'); return; }
                    var req = activeNotifReply.value;
                    if (!req) return;
                    var qs = JSON.parse(localStorage.getItem('bunean-service-requests') || '[]');
                    var idx = qs.findIndex(function(q) { return q.id === req.id; });
                    if (idx !== -1) {
                        qs[idx].replied = true;
                        qs[idx].replyMessage = text;
                        qs[idx].replyAmount = amount;
                        localStorage.setItem('bunean-service-requests', JSON.stringify(qs));
                    }
                    var quotes = JSON.parse(localStorage.getItem('bunean-company-quotes') || '[]');
                    quotes.push({
                        id: Date.now(),
                        requestId: req.id,
                        client: req.name || 'عميل',
                        project: req.consultType || 'طلب عرض سعر',
                        amount: amount || '',
                        notes: text,
                        status: 'قيد المراجعة',
                        createdAt: new Date().toISOString()
                    });
                    localStorage.setItem('bunean-company-quotes', JSON.stringify(quotes));
                    var overlay = document.getElementById('sr-overlay');
                    if (overlay) overlay.remove();
                    showBrandAlert('✅ تم إرسال الرد وإنشاء العرض');
                    });
                };

                function showServiceModal(n) {
                    var overlay = document.createElement('div');
                    overlay.className = 'notif-overlay';
                    overlay.setAttribute('onclick', 'this.remove()');
                    var modal = document.createElement('div');
                    modal.className = 'notif-modal';
                    modal.setAttribute('onclick', 'event.stopPropagation()');
                    modal.innerHTML =
                        '<div style="padding:20px 16px;text-align:center;border-bottom:1px solid var(--border-light);">'
                        + '<div style="width:48px;height:48px;border-radius:14px;background:#4caf50;display:flex;align-items:center;justify-content:center;margin:0 auto 10px;"><span class="material-symbols-outlined" style="font-size:24px;color:#fff;">handyman</span></div>'
                        + '<h3 style="color:var(--text-white);font-size:16px;font-weight:700;margin:0;">طلب عرض سعر</h3>'
                        + '<p style="color:var(--text-muted);font-size:11px;margin:4px 0 0;">' + n.time + '</p>'
                        + '</div>'
                        + '<div style="padding:16px;"><p style="color:var(--text-white);font-size:13px;line-height:1.8;margin:0;white-space:pre-wrap;">' + n.message + '</p></div>'
                        + '<div style="padding:0 16px 16px;">'
                        + '<button onclick="this.closest(\'.notif-overlay\').remove()" style="width:100%;padding:10px;border:none;border-radius:12px;background:var(--accent-gold);color:var(--primary-dark);font-size:13px;font-weight:700;font-family:Cairo,sans-serif;cursor:pointer;">حسناً</button>'
                        + '</div>';
                    overlay.appendChild(modal);
                    document.body.appendChild(overlay);
                }

                function switchTab(t) {
                    activeTab.value = t;
                    document.querySelectorAll('.notif-tab').forEach(function(el) {
                        el.classList.toggle('zactive', el.dataset.tab === t);
                    });
                }

                // Initial tab state
                Vue.onMounted(function() {
                    document.querySelectorAll('.notif-tab').forEach(function(el) {
                        el.classList.toggle('zactive', el.dataset.tab === activeTab.value);
                    });
                });

                // Company check
                Vue.onMounted(function() {
                    var ud = JSON.parse(localStorage.getItem('bunean-user-data') || '{}');
                    if (ud.role === 'company') {
                        var qr = document.getElementById('tab-quote-request');
                        if (qr) qr.style.display = '';
                        var sr = document.getElementById('tab-service-request');
                        if (sr) sr.style.display = '';
                        var sv = document.querySelector('.notif-tab[data-tab="service"]');
                        if (sv) sv.style.display = 'none';
                        var of = document.querySelector('.notif-tab[data-tab="offer"]');
                        if (of) of.style.display = 'none';
                        activeTab.value = 'support';
                    }
                });

                return { activeTab, isCompany, notifications, filtered, iconName, iconBg, openNotif, switchTab, replyText, replyAmount, goTo, showPermissionBanner, enableNotifications };
            }
        }).mount('#app');

        initFloatingCart();
        if (typeof BackNav !== 'undefined') BackNav.init();
        if (typeof PullToRefresh !== 'undefined') PullToRefresh.init();
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('sw.js')
                .then(function() { console.log('SW registered'); })
                .catch(function(err) { console.log('SW registration failed'); });
        }