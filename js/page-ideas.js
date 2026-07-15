

document.getElementById('header').innerHTML = renderHeader({ searchVModel: 'searchQuery', searchPlaceholder: 'ابحث عن أفكار ومشاريع...' });
        document.getElementById('bottomNav').innerHTML = renderNav('ideas');

        const { createApp, ref, computed, watch, nextTick, onMounted, onUnmounted } = Vue;

        function img(n) { return 'images/img' + n + '.jpg'; }

        function fmtM(n) { return (n / 1000000) + ' مليون'; }

        function parseNum(s) { return parseInt(s.replace(/,/g, ''), 10) || 0; }

        function makeProjects(baseIdx, count, prefix, opts) {
            var names = ['أ', 'ب', 'ج', 'د', 'هـ', 'و', 'ز', 'ح'];
            var govs = ['بغداد', 'البصرة', 'نينوى', 'أربيل', 'كركوك', 'النجف', 'كربلاء', 'السليمانية'];
            var areas = [120, 200, 350, 500, 85, 650, 75, 150];
            var priceVals = [15000000, 25000000, 40000000, 60000000, 12000000, 80000000, 10000000, 35000000];
            var sty = ['كلاسيكي', 'عصري', 'أندلسي', 'بسيط', 'فاخر', 'حديث', 'مودرن', 'عربي'];
            var result = [];
            for (var i = 0; i < count; i++) {
                var idx = (baseIdx + i) % 31;
                var images = [];
                for (var j = 0; j < 5; j++) images.push(img(((idx + j * 7) % 31) + 1));
                var matNames = ['رخام كارارا', 'خشب زان', 'زجاج سيكوريت', 'سيراميك بورسلين', 'دهان خارجي', 'بلاط إنترلوك', 'طوب عازل', 'أسمنت'];
                var matImgs = [img(16), img(17), img(18), img(19), img(28), img(29), img(30), img(31)];
                result.push({
                    title: prefix + ' ' + names[i % 8],
                    company: opts.company || 'شركة البناء الحديث',
                    companyVerified: opts.companyVerified === true,
                    companyLink: 'company.html?id=' + encodeURIComponent(opts.company || 'شركة البناء الحديث'),
                    governorate: govs[i % 8],
                    type: (i % 2 === 0) ? 'سكني' : 'تجاري',
                    year: String(2024 + (i % 3)),
                    style: sty[i % 8],
                    areaNum: areas[i % 8],
                    area: areas[i % 8],
                    priceNum: priceVals[i % 8],
                    price: fmtM(priceVals[i % 8]),
                    images: images,
                    details: prefix + ' من إنجاز شركة ' + (opts.company || 'البناء الحديث') + ' بمساحة ' + areas[i % 8] + ' م² في محافظة ' + govs[i % 8] + '.',
                    materials: [
                        { name: matNames[(i * 2) % 8], image: matImgs[(i * 2) % 8] },
                        { name: matNames[(i * 2 + 1) % 8], image: matImgs[(i * 2 + 1) % 8] },
                        { name: matNames[(i * 2 + 2) % 8], image: matImgs[(i * 2 + 2) % 8] }
                    ],
                    meta: [
                        { icon: 'location_on', label: 'الموقع', value: opts.location || 'حي ' + names[i % 8] },
                        { icon: 'straighten', label: 'المساحة', value: areas[i % 8] + ' م²' },
                        { icon: 'payments', label: 'السعر', value: fmt(priceVals[i % 8]) + ' د.ع' },
                        { icon: 'map', label: 'المحافظة', value: govs[i % 8] }
                    ]
                });
            }
            return result;
        }

        function makeCat(name, icon, cover, baseIdx, opts) {
            return { name: name, icon: icon, cover: cover, projects: makeProjects(baseIdx, 8, name, opts) };
        }

        var _vueApp = createApp({
            setup() {
                initTheme();

                // ===== Auth =====
                var myData = (function() { try { return JSON.parse(localStorage.getItem('bunean-user-data')); } catch(e) { return null; } })();
                var isCompany = ref(myData && myData.role === 'company');
                var companyProfile = ref(null);
                var currentCompanyVerified = ref(false);
                if (isCompany.value) {
                    try { var cp = JSON.parse(localStorage.getItem('bunean-company-profile')); if (cp) { companyProfile.value = cp; currentCompanyVerified.value = !!cp.verified; } } catch(e) {}
                }

                // ===== Add project form =====
                var showAddProject = ref(false);
                var newIdeaProject = ref({ title: '', desc: '', category: '', images: [] });
                var ideaProjectInput = ref(null);
                var ideaProjectCategories = ['بناء سكني', 'بناء تجاري', 'جسور وطرق', 'تشطيبات', 'خرسانة', 'أعمال صحية', 'أعمال كهربائية', 'دهانات', 'أرضيات', 'واجهات', 'حدائق', 'أخرى'];

                function triggerIdeaUpload() { if (ideaProjectInput.value) ideaProjectInput.value.click(); }
                function handleIdeaImages(e) {
                    var files = Array.from(e.target.files || []);
                    var remaining = 5 - newIdeaProject.value.images.length;
                    if (files.length > remaining) files = files.slice(0, remaining);
                    files.forEach(function(file) {
                        if (!file) return;
                        var reader = new FileReader();
                        reader.onload = function(ev) { newIdeaProject.value.images.push(ev.target.result); };
                        reader.readAsDataURL(file);
                    });
                    e.target.value = '';
                }
                function removeIdeaImage(idx) { newIdeaProject.value.images.splice(idx, 1); }

                var submitIdeaProject = function() {
                    if (!newIdeaProject.value.title.trim()) { showBrandAlert('أدخل اسم المشروع'); return; }
                    if (!companyProfile.value) { showBrandAlert('لا يوجد ملف شركة'); return; }
                    var imgs = newIdeaProject.value.images.length ? newIdeaProject.value.images : ['images/img1.jpg'];
                    var userData = (function() { try { return JSON.parse(localStorage.getItem('bunean-user-data')); } catch(e) { return null; } })();
                    var companyName = (userData && userData.name) || 'شركتي';
                    var proj = {
                        title: newIdeaProject.value.title,
                        details: newIdeaProject.value.desc,
                        category: newIdeaProject.value.category,
                        image: imgs[0],
                        images: imgs,
                        company: companyName,
                        companyVerified: currentCompanyVerified.value,
                        companyLink: 'company.html?id=' + encodeURIComponent(companyName),
                        date: new Date().toISOString().split('T')[0]
                    };
                    ProjectData.addProject(proj);
                    newIdeaProject.value = { title: '', desc: '', category: '', images: [] };
                    showAddProject.value = false;
                    showBrandAlert('✅ تم إضافة المشروع\nبانتظار موافقة الأونر');
                };

                var companyProjectList = computed(function() {
                    if (!companyProfile.value || !companyProfile.value.projects) return [];
                    var userData = (function() { try { return JSON.parse(localStorage.getItem('bunean-user-data')); } catch(e) { return null; } })();
                    var companyName = (userData && userData.name) || 'شركتي';
                    return companyProfile.value.projects.map(function(p) {
                        var pType = '';
                        if (p.category) {
                            if (p.category.includes('تجاري')) pType = 'تجاري';
                            else if (p.category.includes('سكني')) pType = 'سكني';
                        }
                        var pYear = '';
                        if (p.date) pYear = p.date.split('-')[0];
                        return {
                            title: p.title,
                            company: companyName,
                            companyVerified: currentCompanyVerified.value,
                            companyLink: 'company.html?id=' + encodeURIComponent(companyName),
                            governorate: '',
                            type: pType,
                            year: pYear,
                            style: '',
                            areaNum: 0,
                            area: 0,
                            priceNum: 0,
                            price: '---',
                            images: p.images || [p.image || 'images/img1.jpg'],
                            details: p.desc || '',
                            materials: p.materials || [],
                            _catName: p.category || 'مشاريع',
                            _isCompanyProject: true
                        };
                    });
                });

                var searchQuery = ref('');
                var activeCategory = ref(null);
                watch(activeCategory, function(v) { nextTick(function() { var e = document.querySelector('.page-content'); if (e) e.scrollTop = 0; }); });
                var selectedProject = ref(null);
                var projectDetail = ref(null);
                var detailSlide = ref(0);
                var activeFilter = ref(null);
                var sortLatest = ref(false);
                var modalSlide = ref(0);
                var viewerOpen = ref(false);
                var viewerImages = ref([]);
                var viewerIndex = ref(0);
                var filters = ref({ gov: '', style: '', budget: '', area: '' });
                var modalPullY = ref(0);
                var modalClosing = ref(false);

                var categories = ref([
                    makeCat('عمارات سكنية', 'apartment', img(16), 0, { company: 'شركة الإنشاءات الوطنية', location: 'حي المنصور', companyVerified: true }),
                    makeCat('حدائق', 'park', img(28), 5, { company: 'حدائق الخضراء', location: 'حي الزهراء' }),
                    makeCat('حمامات', 'bathtub', img(24), 10, { company: 'شركة السباكة المحترفة', location: 'الكرادة', companyVerified: true }),
                    makeCat('مطابخ', 'kitchen', img(20), 15, { company: 'شركة التشطيب الذهبي', location: 'المنصور' }),
                    makeCat('تصميم داخلي', 'living', img(1), 20, { company: 'طرق العراق', location: 'اليرموك', companyVerified: true }),
                    makeCat('واجهات منزل', 'fence', img(11), 25, { company: 'واجهات الحديثة', location: 'الرصافة' })
                ]);

                var governorates = ['بغداد', 'البصرة', 'نينوى', 'أربيل', 'كركوك', 'النجف', 'كربلاء', 'السليمانية', 'ديالى', 'واسط', 'ميسان', 'ذي قار', 'المثنى', 'القادسية', 'بابل', 'صلاح الدين', 'الأنبار', 'دهوك'];
                var styles = ['كلاسيكي', 'عصري', 'أندلسي', 'بسيط', 'فاخر', 'حديث', 'مودرن', 'عربي'];

                var hasActiveFilters = computed(function() {
                    var f = filters.value;
                    return f.gov || f.style || f.budget || f.area;
                });

                var allProjects = computed(function() {
                    var result = [];
                    for (var i = 0; i < categories.value.length; i++) {
                        for (var j = 0; j < categories.value[i].projects.length; j++) {
                            var p = categories.value[i].projects[j];
                            p._catName = categories.value[i].name;
                            result.push(p);
                        }
                    }
                    // Add company projects
                    var cp = companyProjectList.value;
                    for (var k = 0; k < cp.length; k++) {
                        result.push(cp[k]);
                    }
                    // Add approved projects from ProjectData
                    var approved = ProjectData.getApprovedProjects();
                    var _u = (function() { try { return JSON.parse(localStorage.getItem('bunean-user-data')); } catch(e) { return null; } })();
                    var _cn = (_u && _u.name) || '';
                    for (var m = 0; m < approved.length; m++) {
                        if (approved[m].company === _cn) approved[m].companyVerified = currentCompanyVerified.value;
                        else if (approved[m].companyVerified === undefined) approved[m].companyVerified = false;
                        result.push(approved[m]);
                    }
                    return result;
                });

                var sourceProjects = computed(function() {
                    if (activeCategory.value) return activeCategory.value.projects;
                    return allProjects.value;
                });

                var filteredProjects = computed(function() {
                    var list = sourceProjects.value.slice();
                    var q = searchQuery.value.trim().toLowerCase();
                    var f = filters.value;

                    if (q) list = list.filter(function(p) { return p.title.toLowerCase().includes(q) || p.company.toLowerCase().includes(q) || p.governorate.includes(q); });
                    if (f.gov) list = list.filter(function(p) { return p.governorate === f.gov; });
                    if (f.style) list = list.filter(function(p) { return p.style === f.style; });
                    if (f.budget) {
                        var bv = parseNum(f.budget);
                        if (bv) list = list.filter(function(p) { return p.priceNum <= bv; });
                    }
                    if (f.area) {
                        var av = parseInt(f.area, 10) || 0;
                        if (av) list = list.filter(function(p) { return p.areaNum >= av; });
                    }

                    if (sortLatest.value) {
                        list = list.slice().reverse();
                    }

                    return list;
                });

                var modalTouch = (function() {
                    var sx = 0, sy = 0;
                    return {
                        onTouchStart: function(e) { sx = e.touches[0].clientX; sy = e.touches[0].clientY; modalPullY.value = 0; },
                        onTouchMove: function(e) { var dy = e.touches[0].clientY - sy; if (dy > 0) modalPullY.value = dy * 0.5; },
                        onTouchEnd: function(e) {
                            var dx = e.changedTouches[0].clientX - sx;
                            var dy = e.changedTouches[0].clientY - sy;
                            if (Math.abs(dy) > Math.abs(dx) && dy > 100) {
                                closeModal();
                            } else if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 40) {
                                if (selectedProject.value) {
                                    var next = modalSlide.value + (dx < 0 ? 1 : -1);
                                    var len = selectedProject.value.images.length;
                                    if (next >= 0 && next < len) modalSlide.value = next;
                                }
                            } else { modalPullY.value = 0; }
                        }
                    };
                })();
                var detailSwipe = (function() {
                    var sx = 0, sy = 0;
                    return {
                        onTouchStart: function(e) { sx = e.touches[0].clientX; sy = e.touches[0].clientY; },
                        onTouchMove: function(e) { },
                        onTouchEnd: function(e) {
                            var dx = e.changedTouches[0].clientX - sx;
                            var dy = e.changedTouches[0].clientY - sy;
                            if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 40) {
                                if (projectDetail.value) {
                                    var next = detailSlide.value + (dx < 0 ? 1 : -1);
                                    var len = projectDetail.value.images.length;
                                    if (next >= 0 && next < len) detailSlide.value = next;
                                }
                            }
                        }
                    };
                })();
                var viewerScale = ref(1);
                var viewerPanX = ref(0);
                var viewerPanY = ref(0);
                var viewerTouch = (function() {
                    var sx = 0, sy = 0, dist0 = 0, isPinch = false, lastTap = 0;
                    return {
                        onTouchStart: function(e) {
                            if (e.touches.length === 2) {
                                isPinch = true;
                                dist0 = Math.hypot(e.touches[0].clientX - e.touches[1].clientX, e.touches[0].clientY - e.touches[1].clientY);
                                return;
                            }
                            isPinch = false;
                            sx = e.touches[0].clientX; sy = e.touches[0].clientY;
                            var now = Date.now();
                            if (now - lastTap < 300) {
                                if (viewerScale.value > 1.1) { viewerScale.value = 1; viewerPanX.value = 0; viewerPanY.value = 0; }
                                else { viewerScale.value = 2.5; viewerPanX.value = 0; viewerPanY.value = 0; }
                            }
                            lastTap = now;
                        },
                        onTouchMove: function(e) {
                            if (e.touches.length === 2 && isPinch) {
                                var d = Math.hypot(e.touches[0].clientX - e.touches[1].clientX, e.touches[0].clientY - e.touches[1].clientY);
                                var s = d / (dist0 || 1);
                                viewerScale.value = Math.max(1, Math.min(5, viewerScale.value * (1 + (s - 1) * 0.5)));
                                dist0 = d; return;
                            }
                            if (viewerScale.value > 1.1) {
                                viewerPanX.value += (e.touches[0].clientX - sx);
                                viewerPanY.value += (e.touches[0].clientY - sy);
                                sx = e.touches[0].clientX; sy = e.touches[0].clientY;
                            }
                        },
                        onTouchEnd: function(e, onClose) {
                            if (isPinch) { isPinch = false; return; }
                            if (viewerScale.value > 1.1) return;
                            var dx = e.changedTouches[0].clientX - sx;
                            var dy = e.changedTouches[0].clientY - sy;
                            if (Math.abs(dy) > Math.abs(dx) && dy > 80) {
                                if (onClose) onClose();
                            } else if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 40) {
                                var next = viewerIndex.value + (dx < 0 ? 1 : -1);
                                var len = viewerImages.value.length;
                                if (next >= 0 && next < len) { viewerIndex.value = next; viewerScale.value = 1; viewerPanX.value = 0; viewerPanY.value = 0; }
                            }
                        }
                    };
                })();
                var pullTransform = computed(function() {
                    if (modalClosing.value) return 'translateY(100%)';
                    if (modalPullY.value > 0) return 'translateY(' + modalPullY.value + 'px)';
                    return '';
                });

                var projectsTitle = computed(function() {
                    if (activeCategory.value) return 'مشاريع منجزة - ' + activeCategory.value.name;
                    return 'مشاريع منجزة';
                });

                /* ---- Back Button (History API) ---- */
                function handlePopState() {}

                function formatInput(v) {
                    var num = v.replace(/[^0-9]/g, '');
                    if (!num) return '';
                    return fmt(parseInt(num, 10));
                }

                function clearFilters() {
                    filters.value = { gov: '', style: '', budget: '', area: '' };
                    history.replaceState({}, '', window.location.pathname);
                }

                function toggleFilter(name) {
                    activeFilter.value = activeFilter.value === name ? null : name;
                }
                function toggleLatest() {
                    sortLatest.value = !sortLatest.value;
                }

                function selectCategory(cat) {
                    if (activeCategory.value === cat) {
                        activeCategory.value = null;
                    } else {
                        activeCategory.value = cat;
                    }
                }

                function openProject(proj) { modalSlide.value = 0; selectedProject.value = proj; history.pushState({ action: 'modal' }, ''); }
                function closeModal() {
                    if (modalClosing.value) return;
                    modalClosing.value = true;
                    setTimeout(function() {
                        selectedProject.value = null;
                        modalClosing.value = false;
                        modalPullY.value = 0;
                    }, 350);
                }
                function openViewer(index) { if (!selectedProject.value) return; viewerImages.value = selectedProject.value.images; viewerIndex.value = index; viewerOpen.value = true; history.pushState({ action: 'viewer' }, ''); }
                function closeViewer() { viewerOpen.value = false; viewerScale.value = 1; viewerPanX.value = 0; viewerPanY.value = 0; }
                function nextViewer() { if (viewerIndex.value < viewerImages.value.length - 1) viewerIndex.value++; }
                function prevViewer() { if (viewerIndex.value > 0) viewerIndex.value--; }
                function showProjectDetail(proj) { detailSlide.value = 0; projectDetail.value = proj; selectedProject.value = null; modalClosing.value = false; modalPullY.value = 0; }
                function closeProjectDetail() { projectDetail.value = null; }
                function backToPreview() { var p = projectDetail.value; closeProjectDetail(); if (p) { modalSlide.value = 0; selectedProject.value = p; } }
                function openDetailViewer(index) { if (!projectDetail.value) return; var imgs = projectDetail.value.images; if (!imgs || !imgs.length) return; if (index < 0 || index >= imgs.length) index = 0; viewerImages.value = imgs; viewerIndex.value = index; viewerScale.value = 1; viewerPanX.value = 0; viewerPanY.value = 0; viewerOpen.value = true; }

                // State preservation on refresh only
                var isReload = false;
                try { isReload = performance.getEntriesByType('navigation')[0].type === 'reload'; } catch(e) {}
                try { if (performance.navigation && performance.navigation.type === 1) isReload = true; } catch(e) {}
                if (isReload) {
                    var savedIdeas = restoreState('ideas');
                    if (savedIdeas) {
                        if (savedIdeas.selectedProject) selectedProject.value = savedIdeas.selectedProject;
                    }
                }
                function saveIdeasState() {
                    preserveState('ideas', { selectedProject: selectedProject.value });
                }
                window.addEventListener('beforeunload', saveIdeasState);

                onMounted(function() {
                    PullToRefresh.init();
                    BackNav.init();
                    BackNav.registerCloseHandler(function() {
                        if (viewerOpen.value) { viewerOpen.value = false; return true; }
                        if (selectedProject.value) { selectedProject.value = null; return true; }
                        return false;
                    });
                });
                onUnmounted(function() {
                    window.removeEventListener('beforeunload', saveIdeasState);
                });

                return {
                    searchQuery, activeCategory, categories, selectedProject, modalSlide,
                    projectDetail, detailSlide,
                    selectCategory, openProject, closeModal,
                    showProjectDetail, closeProjectDetail, backToPreview, openDetailViewer,
                    viewerOpen, viewerImages, viewerIndex, openViewer, closeViewer, nextViewer, prevViewer,
                    governorates, styles, filters, formatInput,
                    hasActiveFilters, clearFilters,
                    filteredProjects, projectsTitle,
                    modalTouch, detailSwipe, viewerTouch, pullTransform, modalPullY, modalClosing, viewerScale, viewerPanX, viewerPanY,
                    activeFilter, toggleFilter, sortLatest, toggleLatest,
                    isCompany, companyProfile, showAddProject, newIdeaProject, ideaProjectInput,
                    ideaProjectCategories, triggerIdeaUpload, handleIdeaImages, removeIdeaImage, submitIdeaProject
                };
            }
        });
        _vueApp.component('project-detail', ProjectDetailComp);
        _vueApp.mount('#app');

initFloatingCart();
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('sw.js')
                .then(function() { console.log('SW registered'); })
                .catch(function() { console.log('SW registration failed'); });
        }