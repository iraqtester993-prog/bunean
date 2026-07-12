window.ProjectDetailComp = {
    props: {
        project: { type: Object, required: true },
        companyName: { type: String, default: '' },
        companyVerified: { type: Boolean, default: false },
        companyLink: { type: String, default: '' },
        showBack: { type: Boolean, default: true },
        showCompanyBtn: { type: Boolean, default: true },
        slideIndex: { type: Number, default: 0 }
    },
    emits: ['close', 'open-viewer', 'slide-change'],
    data: function() {
        return { localSlide: this.slideIndex };
    },
    watch: {
        slideIndex: function(v) { this.localSlide = v; }
    },
    computed: {
        p: function() { return this.project || {}; },
        images: function() { return this.p.images || (this.p.image ? [this.p.image] : []); },
        companyNameText: function() { return this.companyName || this.p.company || ''; },
        locationText: function() { return this.p.governorate || this.p.location || ''; },
        priceText: function() { return this.p.price || this.p.cost || ''; },
        descText: function() { return this.p.details || this.p.desc || ''; },
        linkText: function() {
            if (this.companyLink) return this.companyLink;
            if (this.p.companyLink) return this.p.companyLink;
            if (this.companyNameText) return 'company.html?name=' + encodeURIComponent(this.companyNameText);
            return '#';
        }
    },
    methods: {
        prevSlide: function() { if (this.localSlide > 0) { this.localSlide--; this.$emit('slide-change', this.localSlide); } },
        nextSlide: function() { if (this.localSlide < this.images.length - 1) { this.localSlide++; this.$emit('slide-change', this.localSlide); } },
        goSlide: function(i) { this.localSlide = i; this.$emit('slide-change', i); },
        openViewerAt: function() { this.$emit('open-viewer', this.localSlide); },
        openMatViewer: function(img) {
        }
    },
    template: '<div style="display:flex;flex-direction:column;flex:1;height:100%;min-height:0;">' +
        '<!-- Back Card (fixed, not scrollable) -->' +
        '<div v-if="showBack" style="flex-shrink:0;margin:8px 12px;border-radius:12px;background:var(--bg-card);box-shadow:0 4px 12px rgba(0,0,0,0.2);display:flex;align-items:center;padding:4px 12px;">' +
            '<button @click="$emit(\'close\')" style="background:none;border:none;color:var(--text-light);cursor:pointer;display:flex;align-items:center;gap:4px;font-size:13px;font-weight:500;">' +
                '<span class="material-symbols-outlined" style="font-size:20px;">arrow_forward</span> العودة' +
            '</button>' +
            '<div style="flex:1;text-align:center;"><span style="font-size:15px;font-weight:600;color:var(--accent-gold);">تفاصيل المشروع</span></div>' +
        '</div>' +
        '<div class="hide-scroll" style="flex:1;overflow-y:auto;padding-bottom:180px;min-height:0;">' +

        '<!-- Slider -->' +
        '<div v-if="images.length" data-viewer-gallery style="position:relative;background:#000;margin-bottom:12px;">' +
            '<div style="display:flex;transition:transform 0.3s;" :style="{ transform: \'translateX(-\' + (localSlide * 100) + \'%)\', direction:\'ltr\' }">' +
                '<div v-for="(img, i) in images" :key="i" style="min-width:100%;aspect-ratio:4/3;">' +
                    '<img :src="img" style="width:100%;height:100%;object-fit:cover;display:block;">' +
                '</div>' +
            '</div>' +
            '<div v-if="images.length > 1" style="position:absolute;bottom:8px;left:50%;transform:translateX(-50%);display:flex;gap:4px;">' +
                '<span v-for="(img, i) in images" :key="i"' +
                    ' style="width:6px;height:6px;border-radius:50%;background:rgba(255,255,255,0.5);transition:all 0.3s;cursor:pointer;"' +
                    ' :style="{ background: i === localSlide ? \'#c9a243\' : \'rgba(255,255,255,0.5)\', transform: i === localSlide ? \'scale(1.3)\' : \'\' }"' +
                    ' @click.stop="goSlide(i)"></span>' +
            '</div>' +
            '<div v-if="images.length > 1" style="position:absolute;top:8px;left:8px;background:rgba(0,0,0,0.6);color:#fff;font-size:11px;padding:2px 8px;border-radius:10px;direction:ltr;">' +
                '{{ localSlide + 1 }} / {{ images.length }}' +
            '</div>' +
        '</div>' +

        '<!-- Thumbnails -->' +
        '<div v-if="images.length > 1" data-viewer-ignore="1" style="display:flex;gap:6px;overflow-x:auto;padding:0 12px 12px;" class="hide-scroll">' +
            '<div v-for="(img, i) in images" :key="i"' +
                ' style="flex-shrink:0;width:56px;height:56px;border-radius:8px;overflow:hidden;border:2px solid transparent;transition:border-color 0.2s;cursor:pointer;"' +
                ' :style="{ borderColor: i === localSlide ? \'var(--accent-gold)\' : \'transparent\' }"' +
                ' @click="goSlide(i)">' +
                '<img :src="img" style="width:100%;height:100%;object-fit:cover;display:block;">' +
            '</div>' +
        '</div>' +

        '<!-- Details -->' +
        '<div style="padding:0 12px;">' +
            '<h2 style="font-size:18px;font-weight:700;color:var(--text-white);margin:0 0 8px;">{{ p.title }}</h2>' +

            '<div style="display:flex;align-items:center;gap:6px;margin-bottom:10px;">' +
                '<svg v-if="companyVerified" style="width:16px;height:16px;color:#2196F3;flex-shrink:0;" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>' +
                '<span style="color:var(--accent-gold);font-size:14px;font-weight:600;">{{ companyNameText }}</span>' +
            '</div>' +

            '<div v-if="locationText" style="display:flex;align-items:center;gap:4px;margin-bottom:14px;color:var(--text-muted);font-size:13px;">' +
                '<span class="material-symbols-outlined" style="font-size:16px;color:#4caf50;">location_on</span>' +
                '<span>{{ locationText }}</span>' +
            '</div>' +

            '<div v-if="p.type || priceText || p.area" style="display:flex;padding:12px 14px;border-radius:14px;background:rgba(255,255,255,0.05);border:1px solid var(--border-light);margin-bottom:18px;">' +
                '<div v-if="p.type" style="flex:1;text-align:center;">' +
                    '<div style="font-size:11px;color:var(--text-muted);margin-bottom:4px;">نوع المشروع</div>' +
                    '<div style="font-size:13px;font-weight:700;color:var(--text-white);">{{ p.type }}</div>' +
                '</div>' +
                '<div v-if="p.type && priceText" style="width:1px;background:var(--border-light);margin:0 8px;"></div>' +
                '<div v-if="priceText" style="flex:1;text-align:center;">' +
                    '<div style="font-size:11px;color:var(--text-muted);margin-bottom:4px;">التكلفة التقديرية</div>' +
                    '<div style="font-size:13px;font-weight:700;color:var(--text-white);">{{ priceText }}</div>' +
                '</div>' +
                '<div v-if="priceText && p.area" style="width:1px;background:var(--border-light);margin:0 8px;"></div>' +
                '<div v-if="p.area" style="flex:1;text-align:center;">' +
                    '<div style="font-size:11px;color:var(--text-muted);margin-bottom:4px;">المساحة</div>' +
                    '<div style="font-size:13px;font-weight:700;color:var(--text-white);">{{ p.area }}</div>' +
                '</div>' +
            '</div>' +

            '<div v-if="descText" style="margin-bottom:18px;">' +
                '<h3 style="font-size:14px;font-weight:700;color:var(--text-white);margin:0 0 6px;">وصف المشروع</h3>' +
                '<p style="font-size:13px;color:var(--text-muted);line-height:1.75;margin:0;">{{ descText }}</p>' +
            '</div>' +

            '<div v-if="p.materials && p.materials.length" style="margin-bottom:20px;">' +
                '<h3 style="font-size:14px;font-weight:700;color:var(--text-white);margin:0 0 10px;">' +
                    '<span class="material-symbols-outlined" style="font-size:18px;vertical-align:middle;margin-left:4px;color:var(--accent-gold);">inventory_2</span>' +
                    'المواد المستخدمة' +
                '</h3>' +
                '<div style="display:flex;gap:8px;overflow-x:auto;" class="hide-scroll">' +
                    '<div v-for="(mat, i) in p.materials" :key="i"' +
                        ' style="flex-shrink:0;width:110px;background:var(--card-bg);border-radius:10px;overflow:hidden;border:1px solid var(--border-light);cursor:pointer;"' +
                        ' @click="openMatViewer(mat.image)">' +
                        '<div style="width:110px;height:80px;overflow:hidden;">' +
                            '<img :src="mat.image" style="width:100%;height:100%;object-fit:cover;display:block;">' +
                        '</div>' +
                        '<div style="padding:6px;text-align:center;">' +
                            '<span style="color:var(--text-white);font-size:11px;font-weight:600;">{{ mat.name }}</span>' +
                        '</div>' +
                    '</div>' +
                '</div>' +
            '</div>' +
        '</div>' +

        '<!-- Company Button -->' +
        '<div v-if="showCompanyBtn && companyNameText" style="padding:12px 12px 0;">' +
            '<a :href="linkText" class="pd-company-btn"' +
                ' style="display:flex;align-items:center;justify-content:center;gap:6px;width:100%;padding:14px;background:var(--accent-gold);color:#000;text-align:center;border-radius:12px;font-size:15px;font-weight:700;text-decoration:none;">' +
                '<span class="material-symbols-outlined" style="font-size:20px;">storefront</span> صفحة الشركة' +
            '</a>' +
        '</div>' +
    '</div>' +
'</div>'
};
