var dashboard = {
  currentSection: 'overview',
  currentTab: {},

  data: {
    stats: { users: 0, companies: 0, products: 0, orders: 0 },
    users: [],
    companies: [],
    products: [],
    orders: [],
    projects: [],
    ads: [],
    messages: [],
    quotes: [],
    serviceReqs: [],
    sliders: [],
    socialLinks: { whatsapp: '', facebook: '', instagram: '', tiktok: '' },
    notifications: [],
    categories: [],
    suppliers: []
  },

  init: function() {
    this.initTheme();
    this.loadData();
    this.renderSidebar();
    this.navigate('overview');
    this.bindEvents();
    // Set correct theme icon
    var isLight = document.documentElement.classList.contains('light-mode');
    var themeBtn = document.querySelector('.toggle-theme');
    if (themeBtn) themeBtn.textContent = isLight ? '🌙' : '☀️';
  },

  initTheme: function() {
    var saved = localStorage.getItem('bunean-dash-theme');
    var prefers = window.matchMedia('(prefers-color-scheme: light)').matches;
    if (saved === 'light' || (!saved && prefers)) {
      document.documentElement.classList.add('light-mode');
    }
  },

  toggleTheme: function() {
    var html = document.documentElement;
    html.classList.toggle('light-mode');
    localStorage.setItem('bunean-dash-theme', html.classList.contains('light-mode') ? 'light' : 'dark');
  },

  toggleSidebar: function() {
    var sidebar = document.querySelector('.sidebar');
    sidebar.classList.toggle('collapsed');
    var btn = document.querySelector('.toggle-sidebar');
    if (btn) btn.textContent = sidebar.classList.contains('collapsed') ? '▶' : '◀';
  },

  toggleMobileSidebar: function() {
    document.querySelector('.sidebar').classList.toggle('mobile-open');
  },

  loadData: function() {
    var saved = localStorage.getItem('bunean-dashboard');
    if (saved) {
      try { var d = JSON.parse(saved); for (var k in d) this.data[k] = d[k]; } catch(e) {}
    }
    // Load users from main app
    var usersData = localStorage.getItem('bunean-user-data');
    if (usersData) {
      try { this.data.users = [JSON.parse(usersData)]; } catch(e) {}
    }
    var allUsers = localStorage.getItem('bunean-all-users');
    if (allUsers) {
      try { this.data.users = JSON.parse(allUsers); } catch(e) {}
    }
    // Load products from market
    var products = localStorage.getItem('bunean-products');
    if (products) {
      try { this.data.products = JSON.parse(products); } catch(e) {}
    }
    // Load notifications
    var notifs = localStorage.getItem('bunean-notifications');
    if (notifs) {
      try { this.data.notifications = JSON.parse(notifs); } catch(e) {}
    }
    // Load social links
    var social = localStorage.getItem('bunean-social-links');
    if (social) {
      try { this.data.socialLinks = JSON.parse(social); } catch(e) {}
    }
    // Load sliders
    var sliders = localStorage.getItem('bunean-sliders');
    if (sliders) {
      try { this.data.sliders = JSON.parse(sliders); } catch(e) {}
    }
    // Load quote requests
    var quotes = localStorage.getItem('bunean-quote-requests');
    if (quotes) {
      try { this.data.quotes = JSON.parse(quotes); } catch(e) {}
    }
    // Load service requests
    var services = localStorage.getItem('bunean-service-requests');
    if (services) {
      try { this.data.serviceReqs = JSON.parse(services); } catch(e) {}
    }
    this.data.stats.users = this.data.users.length;
    this.data.stats.companies = this.data.companies.length;
    this.data.stats.products = this.data.products.length;
    this.data.stats.orders = this.data.orders.length;
    this.saveData();
  },

  saveData: function() {
    localStorage.setItem('bunean-dashboard', JSON.stringify(this.data));
  },

  renderSidebar: function() {
    var nav = document.getElementById('sidebarNav');
    var sections = [
      { label: 'العامة', items: [
        { id: 'overview', icon: '📊', name: 'نظرة عامة' }
      ]},
      { label: 'الإدارة', items: [
        { id: 'users', icon: '👥', name: 'المستخدمون' },
        { id: 'companies', icon: '🏢', name: 'الشركات', badge: this.getPendingCount('companies') },
        { id: 'products', icon: '📦', name: 'المنتجات' },
        { id: 'orders', icon: '🛒', name: 'الطلبات' }
      ]},
      { label: 'المحتوى', items: [
        { id: 'projects', icon: '🏗️', name: 'المشاريع', badge: this.getPendingCount('projects') },
        { id: 'ads', icon: '📢', name: 'الإعلانات', badge: this.getPendingCount('ads') },
        { id: 'sliders', icon: '🎠', name: 'السلايدر' }
      ]},
      { label: 'التواصل', items: [
        { id: 'messages', icon: '💬', name: 'الرسائل والاستشارات' },
        { id: 'quotes', icon: '💰', name: 'عروض الأسعار' },
        { id: 'services', icon: '📞', name: 'طلبات الخدمة' },
        { id: 'social', icon: '🔗', name: 'روابط التواصل' }
      ]},
      { label: 'أخرى', items: [
        { id: 'notifications', icon: '🔔', name: 'الإشعارات' },
        { id: 'settings', icon: '⚙️', name: 'الإعدادات' }
      ]}
    ];
    var html = '';
    for (var g = 0; g < sections.length; g++) {
      var group = sections[g];
      html += '<div class="nav-section-label">' + group.label + '</div>';
      for (var i = 0; i < group.items.length; i++) {
        var item = group.items[i];
        html += '<a class="nav-item" data-section="' + item.id + '" onclick="dashboard.navigate(\'' + item.id + '\')">'
          + '<span class="icon">' + item.icon + '</span>'
          + item.name
          + (item.badge ? '<span class="badge">' + item.badge + '</span>' : '')
          + '</a>';
      }
    }
    nav.innerHTML = html;
  },

  getPendingCount: function(type) {
    var count = 0;
    if (type === 'companies') {
      for (var i = 0; i < this.data.companies.length; i++) {
        if (this.data.companies[i].status === 'pending') count++;
      }
    }
    if (type === 'projects') {
      for (var i = 0; i < this.data.projects.length; i++) {
        if (this.data.projects[i].status === 'pending') count++;
      }
    }
    if (type === 'ads') {
      for (var i = 0; i < this.data.ads.length; i++) {
        if (this.data.ads[i].status === 'pending') count++;
      }
    }
    return count || null;
  },

  navigate: function(section) {
    this.currentSection = section;
    var items = document.querySelectorAll('.nav-item');
    for (var i = 0; i < items.length; i++) {
      items[i].classList.toggle('active', items[i].dataset.section === section);
    }
    var titles = {
      overview: 'نظرة عامة', users: 'المستخدمون', companies: 'الشركات',
      products: 'المنتجات', orders: 'الطلبات', projects: 'المشاريع',
      ads: 'الإعلانات', messages: 'الرسائل والاستشارات', quotes: 'عروض الأسعار',
      services: 'طلبات الخدمة', social: 'روابط التواصل',
      notifications: 'الإشعارات', sliders: 'السلايدر', settings: 'الإعدادات'
    };
    document.getElementById('pageTitle').textContent = titles[section] || section;
    document.getElementById('breadcrumb').textContent = titles[section] || section;
    this.renderContent(section);
    // Close mobile sidebar
    document.querySelector('.sidebar').classList.remove('open');
  },

  renderContent: function(section) {
    var el = document.getElementById('pageContent');
    if (typeof this['render_' + section] === 'function') {
      el.innerHTML = this['render_' + section]();
    } else {
      el.innerHTML = this.renderPlaceholder(section);
    }
    if (typeof this['afterRender_' + section] === 'function') {
      this['afterRender_' + section]();
    }
  },

  renderPlaceholder: function(section) {
    return '<div class="card"><div class="card-body"><div class="empty-state"><div class="icon">🚧</div><p>قسم ' + section + ' قيد التطوير</p></div></div></div>';
  },

  bindEvents: function() {
    var self = this;
    document.querySelector('.toggle-sidebar').onclick = function() { self.toggleSidebar(); };
    document.querySelector('.toggle-mobile').onclick = function() { self.toggleMobileSidebar(); };
    document.querySelector('.toggle-theme').onclick = function() {
      self.toggleTheme();
      // update button icon
      var isLight = document.documentElement.classList.contains('light-mode');
      this.textContent = isLight ? '🌙' : '☀️';
    };
    // Close mobile sidebar on nav click
    document.addEventListener('click', function(e) {
      var sidebar = document.querySelector('.sidebar');
      if (window.innerWidth <= 768 && sidebar.classList.contains('mobile-open') && !sidebar.contains(e.target) && !e.target.closest('.toggle-mobile')) {
        sidebar.classList.remove('mobile-open');
      }
    });
  },

  // ===== Sections =====

  // ---- Overview ----
  render_overview: function() {
    var d = this.data;
    return '<div class="stats-grid">'
      + this.statCard('المستخدمون', d.stats.users, '👥', 'gold')
      + this.statCard('الشركات', d.stats.companies, '🏢', 'blue')
      + this.statCard('المنتجات', d.stats.products, '📦', 'green')
      + this.statCard('الطلبات', d.stats.orders, '🛒', 'red')
      + '</div>'
      + this.quickActions();
  },

  statCard: function(label, count, icon, color) {
    return '<div class="stat-card">'
      + '<div class="stat-icon ' + color + '">' + icon + '</div>'
      + '<div class="stat-info"><h3>' + count + '</h3><p>' + label + '</p></div>'
      + '</div>';
  },

  quickActions: function() {
    return '<div class="card"><div class="card-header"><h3>إجراءات سريعة</h3></div><div class="card-body" style="display:flex;flex-wrap:wrap;gap:8px;">'
      + '<button class="btn btn-gold" onclick="dashboard.navigate(\'sliders\')">🎠 إدارة السلايدر</button>'
      + '<button class="btn btn-gold" onclick="dashboard.navigate(\'social\')">🔗 روابط التواصل</button>'
      + '<button class="btn btn-gold" onclick="dashboard.navigate(\'companies\')">🏢 مراجعة الشركات</button>'
      + '<button class="btn btn-gold" onclick="dashboard.navigate(\'products\')">📦 إضافة منتج</button>'
      + '</div></div>';
  },

  // ---- Users ----
  render_users: function() {
    var rows = '';
    for (var i = 0; i < this.data.users.length; i++) {
      var u = this.data.users[i];
      rows += '<tr><td>' + (i+1) + '</td><td>' + (u.name || u.fullName || '-') + '</td><td>' + (u.phone || '-') + '</td><td>' + (u.accountType || 'مستخدم') + '</td><td>' + (u.city || '-') + '</td><td><button class="btn btn-sm btn-outline" onclick="dashboard.editUser(' + i + ')">عرض</button></td></tr>';
    }
    return '<div class="card"><div class="card-header"><h3>المستخدمون</h3></div><div class="card-body"><div class="table-wrap"><table><thead><tr><th>#</th><th>الاسم</th><th>رقم الهاتف</th><th>نوع الحساب</th><th>المدينة</th><th></th></tr></thead><tbody>' + (rows || '<tr><td colspan="6"><div class="empty-state"><p>لا يوجد مستخدمون</p></div></td></tr>') + '</tbody></table></div></div></div>';
  },

  editUser: function(idx) {
    alert('عرض تفاصيل المستخدم - سيتم تفعيله لاحقاً');
  },

  // ---- Companies ----
  render_companies: function() {
    var self = this;
    var pending = [], approved = [], rejected = [];
    for (var i = 0; i < this.data.companies.length; i++) {
      var c = this.data.companies[i];
      if (c.status === 'approved') approved.push(c);
      else if (c.status === 'rejected') rejected.push(c);
      else pending.push(c);
    }
    return '<div class="dash-tabs" id="companyTabs">'
      + '<div class="dash-tab active" onclick="dashboard.switchTab(\'company\',\'pending\',this)">قيد المراجعة 🟡 ' + (pending.length ? '<span class="badge">' + pending.length + '</span>' : '') + '</div>'
      + '<div class="dash-tab" onclick="dashboard.switchTab(\'company\',\'approved\',this)">تم الموافقة ✅</div>'
      + '<div class="dash-tab" onclick="dashboard.switchTab(\'company\',\'rejected\',this)">مرفوض ❌</div>'
      + '</div>'
      + '<div class="card"><div class="card-body" id="companyTabContent">'
      + this.companyTable(pending, 'pending')
      + '</div></div>';
  },

  companyTable: function(list, status) {
    if (!list.length) return '<div class="empty-state"><p>لا توجد شركات</p></div>';
    var rows = '';
    for (var i = 0; i < list.length; i++) {
      var c = list[i];
      rows += '<tr><td>' + (i+1) + '</td><td>' + (c.name || c.companyName || '-') + '</td><td>' + (c.phone || '-') + '</td><td>' + (c.city || '-') + '</td>'
        + '<td><span class="status ' + (c.status === 'approved' ? 'approved' : c.status === 'rejected' ? 'rejected' : 'pending') + '">'
        + (c.status === 'approved' ? 'مقبول' : c.status === 'rejected' ? 'مرفوض' : 'قيد المراجعة') + '</span></td>'
        + '<td>' + (status === 'pending' ? '<button class="btn btn-sm btn-success" onclick="dashboard.approveCompany(\'' + (c.id || c.phone) + '\')">قبول</button> <button class="btn btn-sm btn-danger" onclick="dashboard.rejectCompany(\'' + (c.id || c.phone) + '\')">رفض</button>' : '') + '</td></tr>';
    }
    return '<div class="table-wrap"><table><thead><tr><th>#</th><th>الاسم</th><th>الهاتف</th><th>المدينة</th><th>الحالة</th><th></th></tr></thead><tbody>' + rows + '</tbody></table></div>';
  },

  switchTab: function(group, tab, el) {
    var tabs = el.parentElement.querySelectorAll('.dash-tab');
    for (var i = 0; i < tabs.length; i++) tabs[i].classList.remove('active');
    el.classList.add('active');
    if (group === 'company') {
      var filtered = [];
      for (var j = 0; j < this.data.companies.length; j++) {
        var c = this.data.companies[j];
        if ((tab === 'pending' && (!c.status || c.status === 'pending')) ||
            (tab === 'approved' && c.status === 'approved') ||
            (tab === 'rejected' && c.status === 'rejected')) {
          filtered.push(c);
        }
      }
      document.getElementById('companyTabContent').innerHTML = this.companyTable(filtered, tab);
    }
    if (group === 'product') {
      var el2 = document.getElementById('productTabContent');
      if (tab === 'all') el2.innerHTML = this.productList();
      else if (tab === 'add') el2.innerHTML = this.productForm();
      else if (tab === 'cats') el2.innerHTML = this.categoryManager();
      else if (tab === 'suppliers') el2.innerHTML = this.supplierManager();
    }
    if (group === 'project') {
      var filtered = [];
      for (var j = 0; j < this.data.projects.length; j++) {
        var pr = this.data.projects[j];
        if ((tab === 'pending' && (!pr.status || pr.status === 'pending')) ||
            (tab === 'approved' && pr.status === 'approved') ||
            (tab === 'rejected' && pr.status === 'rejected')) {
          filtered.push(pr);
        }
      }
      document.getElementById('projectTabContent').innerHTML = this.projectTable(filtered, tab);
    }
    if (group === 'ad') {
      var filtered = [];
      for (var j = 0; j < this.data.ads.length; j++) {
        var ad = this.data.ads[j];
        if ((tab === 'pending' && (!ad.status || ad.status === 'pending')) ||
            (tab === 'approved' && ad.status === 'approved') ||
            (tab === 'rejected' && ad.status === 'rejected')) {
          filtered.push(ad);
        }
      }
      document.getElementById('adTabContent').innerHTML = this.adTable(filtered, tab);
    }
  },

  approveCompany: function(id) {
    for (var i = 0; i < this.data.companies.length; i++) {
      if (this.data.companies[i].id === id || this.data.companies[i].phone === id) {
        this.data.companies[i].status = 'approved';
        this.saveData();
        this.renderContent('companies');
        return;
      }
    }
  },

  rejectCompany: function(id) {
    for (var i = 0; i < this.data.companies.length; i++) {
      if (this.data.companies[i].id === id || this.data.companies[i].phone === id) {
        this.data.companies[i].status = 'rejected';
        this.saveData();
        this.renderContent('companies');
        return;
      }
    }
  },

  fileToBase64: function(file, callback) {
    var reader = new FileReader();
    reader.onload = function(e) { callback(e.target.result); };
    reader.readAsDataURL(file);
  },

  // ---- Products ----
  render_products: function() {
    return '<div class="dash-tabs" id="productTabs">'
      + '<div class="dash-tab active" onclick="dashboard.switchTab(\'product\',\'all\',this)">جميع المنتجات</div>'
      + '<div class="dash-tab" onclick="dashboard.switchTab(\'product\',\'add\',this)">إضافة منتج</div>'
      + '<div class="dash-tab" onclick="dashboard.switchTab(\'product\',\'cats\',this)">الأقسام</div>'
      + '<div class="dash-tab" onclick="dashboard.switchTab(\'product\',\'suppliers\',this)">الموردين</div>'
      + '</div>'
      + '<div class="card"><div class="card-body" id="productTabContent">'
      + this.productList()
      + '</div></div>';
  },

  productList: function() {
    var p = this.data.products;
    if (!p.length) return '<div class="empty-state"><p>لا توجد منتجات</p></div>';
    var rows = '';
    for (var i = 0; i < p.length; i++) {
      var img = p[i].image ? '<img src="' + p[i].image + '" style="width:50px;height:40px;object-fit:cover;border-radius:6px;" onerror="this.style.display=\'none\'">' : '-';
      var badge = p[i].mostRequested ? '<span class="status approved" style="background:rgba(201,162,67,0.12);color:var(--accent);font-size:10px;">الأكثر طلباً</span> ' : '';
      var priceHtml = p[i].price;
      if (p[i].discountPrice) {
        priceHtml = '<span style="text-decoration:line-through;color:var(--text-muted);font-size:11px;">' + p[i].price + '</span> <span style="color:var(--danger);font-weight:700;">' + p[i].discountPrice + '</span>';
      }
      rows += '<tr><td>' + (i+1) + '</td><td>' + img + '</td><td>' + (p[i].name || '-') + '</td><td>' + (p[i].category || '-') + '</td><td>' + priceHtml + '</td>'
        + '<td>' + badge + '</td>'
        + '<td><span class="toggle ' + (p[i].hidden ? '' : 'on') + '" onclick="dashboard.toggleProduct(' + i + ')"></span></td>'
        + '<td><button class="btn btn-sm btn-outline" onclick="dashboard.editProduct(' + i + ')">تعديل</button> <button class="btn btn-sm btn-danger" onclick="dashboard.deleteProduct(' + i + ')">حذف</button></td></tr>';
    }
    var cats = this.data.categories;
    var catRows = '';
    for (var j = 0; j < cats.length; j++) {
      catRows += '<tr><td>' + (j+1) + '</td><td>' + cats[j].name + '</td>'
        + '<td><span class="toggle ' + (cats[j].hidden ? '' : 'on') + '" onclick="dashboard.toggleCategory(' + j + ')"></span></td>'
        + '<td><button class="btn btn-sm btn-danger" onclick="dashboard.deleteCategory(' + j + ')">حذف</button></td></tr>';
    }
    var supps = this.data.suppliers;
    var supRows = '';
    for (var k = 0; k < supps.length; k++) {
      supRows += '<tr><td>' + (k+1) + '</td><td>' + supps[k].name + '</td><td>' + (supps[k].phone || '-') + '</td><td><button class="btn btn-sm btn-danger" onclick="dashboard.deleteSupplier(' + k + ')">حذف</button></td></tr>';
    }
    return '<div class="table-wrap"><table><thead><tr><th>#</th><th>الصورة</th><th>الاسم</th><th>القسم</th><th>السعر</th><th>وسم</th><th>إظهار</th><th></th></tr></thead><tbody>' + rows + '</tbody></table></div>'
      + '<h4 style="margin-top:20px;font-size:14px;">الأقسام</h4>'
      + '<div class="table-wrap"><table><thead><tr><th>#</th><th>القسم</th><th>إظهار</th><th></th></tr></thead><tbody>' + (catRows || '<tr><td colspan="4"><div class="empty-state"><p>لا توجد أقسام</p></div></td></tr>') + '</tbody></table></div>'
      + '<h4 style="margin-top:20px;font-size:14px;">الموردين</h4>'
      + '<div class="table-wrap"><table><thead><tr><th>#</th><th>الاسم</th><th>الهاتف</th><th></th></tr></thead><tbody>' + (supRows || '<tr><td colspan="4"><div class="empty-state"><p>لا يوجد موردين</p></div></td></tr>') + '</tbody></table></div>';
  },

  productForm: function(product) {
    product = product || {};
    var cats = this.data.categories;
    var catOpts = '';
    for (var i = 0; i < cats.length; i++) {
      catOpts += '<option value="' + cats[i].name + '"' + (product.category === cats[i].name ? ' selected' : '') + '>' + cats[i].name + '</option>';
    }
    var imgPreview = product.image ? '<div style="margin-bottom:8px;"><img src="' + product.image + '" style="width:80px;height:80px;object-fit:cover;border-radius:8px;border:1px solid var(--border);"></div>' : '';
    return '<form onsubmit="dashboard.addProduct(event)" id="productForm">'
      + '<div class="form-row">'
      + '<div class="form-group"><label>اسم المنتج</label><input class="form-control" id="prodName" value="' + (product.name || '') + '" required></div>'
      + '<div class="form-group"><label>السعر</label><input class="form-control" id="prodPrice" type="number" value="' + (product.price || '') + '" required></div>'
      + '</div>'
      + '<div class="form-row">'
      + '<div class="form-group"><label>القسم</label><select class="form-control" id="prodCategory">' + catOpts + '</select></div>'
      + '<div class="form-group"><label>الصورة</label><input class="form-control" id="prodImage" type="file" accept="image/*"></div>'
      + '</div>'
      + imgPreview
      + '<div class="form-row">'
      + '<div class="form-group"><label>سعر الخصم (اختياري)</label><input class="form-control" id="prodDiscount" type="number" value="' + (product.discountPrice || '') + '" placeholder="سعر بعد الخصم"></div>'
      + '<div class="form-group" style="display:flex;align-items:flex-end;padding-bottom:9px;">'
      + '<label style="display:flex;align-items:center;gap:8px;cursor:pointer;font-size:13px;font-weight:600;">'
      + '<input type="checkbox" id="prodMostRequested" ' + (product.mostRequested ? 'checked' : '') + ' style="width:16px;height:16px;accent-color:var(--accent);"> الأكثر طلباً'
      + '</label></div>'
      + '</div>'
      + '<div class="form-group"><label>الوصف</label><textarea class="form-control" id="prodDesc">' + (product.desc || '') + '</textarea></div>'
      + '<input type="hidden" id="prodEditIdx" value="' + (product._idx !== undefined ? product._idx : '-1') + '">'
      + '<input type="hidden" id="prodExistingImage" value="' + (product.image || '') + '">'
      + '<button type="submit" class="btn btn-gold">' + (product._idx !== undefined ? '💾 حفظ التعديلات' : '➕ إضافة المنتج') + '</button>'
      + '</form>';
  },

  addProduct: function(e) {
    e.preventDefault();
    var self = this;
    var idx = parseInt(document.getElementById('prodEditIdx').value);
    var fileInput = document.getElementById('prodImage');
    var existingImage = document.getElementById('prodExistingImage').value;

    function saveProd(base64Image) {
      var prod = {
        id: idx >= 0 ? self.data.products[idx].id : Date.now(),
        name: document.getElementById('prodName').value,
        price: document.getElementById('prodPrice').value,
        category: document.getElementById('prodCategory').value,
        image: base64Image || existingImage || 'images/img1.jpg',
        desc: document.getElementById('prodDesc').value,
        discountPrice: document.getElementById('prodDiscount').value || '',
        mostRequested: document.getElementById('prodMostRequested').checked,
        hidden: false
      };
      if (idx >= 0) {
        self.data.products[idx] = prod;
      } else {
        self.data.products.push(prod);
      }
      self.saveData();
      self.syncProducts();
      self.switchTab('product', 'all', document.querySelector('#productTabs .dash-tab:first-child'));
    }

    if (fileInput.files && fileInput.files[0]) {
      this.fileToBase64(fileInput.files[0], function(b64) { saveProd(b64); });
    } else {
      saveProd(null);
    }
  },

  toggleProduct: function(idx) {
    this.data.products[idx].hidden = !this.data.products[idx].hidden;
    this.saveData();
    this.syncProducts();
    this.switchTab('product', 'all', document.querySelector('#productTabs .dash-tab:first-child'));
  },

  deleteProduct: function(idx) {
    if (!confirm('حذف المنتج؟')) return;
    this.data.products.splice(idx, 1);
    this.saveData();
    this.syncProducts();
    this.switchTab('product', 'all', document.querySelector('#productTabs .dash-tab:first-child'));
  },

  editProduct: function(idx) {
    var p = this.data.products[idx];
    p._idx = idx;
    var el = document.getElementById('productTabContent');
    if (el) {
      el.innerHTML = this.productForm(p);
    } else {
      this.switchTab('product', 'add', document.querySelector('#productTabs .dash-tab:nth-child(2)'));
      var self = this;
      setTimeout(function() {
        var el2 = document.getElementById('productTabContent');
        if (el2) el2.innerHTML = self.productForm(p);
      }, 100);
    }
  },

  categoryManager: function() {
    var cats = this.data.categories;
    var rows = '';
    for (var i = 0; i < cats.length; i++) {
      rows += '<tr><td>' + (i+1) + '</td><td>' + cats[i].name + '</td>'
        + '<td><span class="toggle ' + (cats[i].hidden ? '' : 'on') + '" onclick="dashboard.toggleCategory(' + i + ')"></span></td>'
        + '<td><button class="btn btn-sm btn-danger" onclick="dashboard.deleteCategory(' + i + ')">حذف</button></td></tr>';
    }
    return '<form onsubmit="dashboard.addCategory(event)" style="margin-bottom:16px;display:flex;gap:8px;">'
      + '<input class="form-control" id="catName" placeholder="اسم القسم الجديد" required style="flex:1;">'
      + '<button type="submit" class="btn btn-gold">➕ إضافة</button>'
      + '</form>'
      + '<div class="table-wrap"><table><thead><tr><th>#</th><th>القسم</th><th>إظهار</th><th></th></tr></thead><tbody>' + (rows || '<tr><td colspan="4"><div class="empty-state"><p>لا توجد أقسام</p></div></td></tr>') + '</tbody></table></div>';
  },

  addCategory: function(e) {
    e.preventDefault();
    this.data.categories.push({ name: document.getElementById('catName').value, hidden: false });
    this.saveData();
    document.getElementById('catName').value = '';
    this.switchTab('product', 'cats', document.querySelector('#productTabs .dash-tab:nth-child(3)'));
  },

  toggleCategory: function(idx) {
    this.data.categories[idx].hidden = !this.data.categories[idx].hidden;
    this.saveData();
    this.switchTab('product', 'cats', document.querySelector('#productTabs .dash-tab:nth-child(3)'));
  },

  deleteCategory: function(idx) {
    if (!confirm('حذف القسم؟')) return;
    this.data.categories.splice(idx, 1);
    this.saveData();
    this.switchTab('product', 'cats', document.querySelector('#productTabs .dash-tab:nth-child(3)'));
  },

  supplierManager: function() {
    var supps = this.data.suppliers;
    var rows = '';
    for (var i = 0; i < supps.length; i++) {
      rows += '<tr><td>' + (i+1) + '</td><td>' + supps[i].name + '</td><td>' + (supps[i].phone || '-') + '</td><td><button class="btn btn-sm btn-danger" onclick="dashboard.deleteSupplier(' + i + ')">حذف</button></td></tr>';
    }
    return '<form onsubmit="dashboard.addSupplier(event)" style="margin-bottom:16px;display:flex;gap:8px;">'
      + '<input class="form-control" id="supName" placeholder="اسم المورد" required style="flex:1;">'
      + '<input class="form-control" id="supPhone" placeholder="رقم الهاتف" style="flex:1;">'
      + '<button type="submit" class="btn btn-gold">➕ إضافة</button>'
      + '</form>'
      + '<div class="table-wrap"><table><thead><tr><th>#</th><th>الاسم</th><th>الهاتف</th><th></th></tr></thead><tbody>' + (rows || '<tr><td colspan="4"><div class="empty-state"><p>لا يوجد موردين</p></div></td></tr>') + '</tbody></table></div>';
  },

  addSupplier: function(e) {
    e.preventDefault();
    this.data.suppliers.push({ name: document.getElementById('supName').value, phone: document.getElementById('supPhone').value });
    this.saveData();
    document.getElementById('supName').value = '';
    document.getElementById('supPhone').value = '';
    this.switchTab('product', 'suppliers', document.querySelector('#productTabs .dash-tab:nth-child(4)'));
  },

  deleteSupplier: function(idx) {
    if (!confirm('حذف المورد؟')) return;
    this.data.suppliers.splice(idx, 1);
    this.saveData();
    this.switchTab('product', 'suppliers', document.querySelector('#productTabs .dash-tab:nth-child(4)'));
  },

  syncProducts: function() {
    localStorage.setItem('bunean-products', JSON.stringify(this.data.products));
    localStorage.setItem('bunean-categories', JSON.stringify(this.data.categories));
    localStorage.setItem('bunean-suppliers', JSON.stringify(this.data.suppliers));
  },

  // ---- Sliders ----
  sliderSections: [
    { id: 'home', name: 'الرئيسية' },
    { id: 'ideas', name: 'أفكار' },
    { id: 'ads', name: 'إعلانات' },
    { id: 'projects', name: 'المشاريع' }
  ],

  render_sliders: function() {
    var slides = this.data.sliders;
    var list = '';
    for (var i = 0; i < slides.length; i++) {
      var s = slides[i];
      var sectionName = s.section || 'home';
      for (var si = 0; si < this.sliderSections.length; si++) {
        if (this.sliderSections[si].id === sectionName) { sectionName = this.sliderSections[si].name; break; }
      }
      list += '<tr><td>' + (i+1) + '</td><td><img src="' + (s.image || '') + '" style="width:60px;height:40px;object-fit:cover;border-radius:6px;" onerror="this.style.display=\'none\'"></td>'
        + '<td>' + (s.title || '-') + '</td><td>' + sectionName + '</td>'
        + '<td>' + (s.link || '-') + '</td>'
        + '<td>' + (s.order || i+1) + '</td>'
        + '<td><span class="toggle ' + (s.hidden ? '' : 'on') + '" onclick="dashboard.toggleSlider(' + i + ')"></span></td>'
        + '<td><button class="btn btn-sm btn-outline" onclick="dashboard.editSlider(' + i + ')">تعديل</button> <button class="btn btn-sm btn-danger" onclick="dashboard.deleteSlider(' + i + ')">حذف</button></td></tr>';
    }
    return '<div class="card"><div class="card-header"><h3>السلايدر</h3><button class="btn btn-gold btn-sm" onclick="dashboard.showSliderForm()">➕ إضافة سلايدر</button></div><div class="card-body">'
      + '<div class="table-wrap"><table><thead><tr><th>#</th><th>الصورة</th><th>العنوان</th><th>القسم</th><th>الرابط</th><th>الترتيب</th><th>إظهار</th><th></th></tr></thead><tbody>'
      + (list || '<tr><td colspan="8"><div class="empty-state"><p>لا توجد سلايدرات</p></div></td></tr>')
      + '</tbody></table></div></div></div>'
      + this.sliderModal();
  },

  sliderModal: function() {
    var secOpts = '';
    for (var i = 0; i < this.sliderSections.length; i++) {
      secOpts += '<option value="' + this.sliderSections[i].id + '">' + this.sliderSections[i].name + '</option>';
    }
    return '<div class="modal-overlay" id="sliderModal"><div class="modal-box">'
      + '<h3 id="sliderModalTitle">إضافة سلايدر</h3>'
      + '<form onsubmit="dashboard.saveSlider(event)">'
      + '<div class="form-group"><label>الصورة</label><input class="form-control" id="sliderImage" type="file" accept="image/*"></div>'
      + '<div id="sliderPreview" style="margin-bottom:8px;"></div>'
      + '<div class="form-row">'
      + '<div class="form-group"><label>القسم</label><select class="form-control" id="sliderSection">' + secOpts + '</select></div>'
      + '<div class="form-group"><label>الترتيب</label><input class="form-control" id="sliderOrder" type="number"></div>'
      + '</div>'
      + '<div class="form-group"><label>العنوان</label><input class="form-control" id="sliderTitle"></div>'
      + '<div class="form-group"><label>الرابط</label><input class="form-control" id="sliderLink"></div>'
      + '<input type="hidden" id="sliderEditIdx" value="-1">'
      + '<input type="hidden" id="sliderExistingImage" value="">'
      + '<div class="modal-actions">'
      + '<button type="button" class="btn btn-outline" onclick="dashboard.closeModal(\'sliderModal\')">إلغاء</button>'
      + '<button type="submit" class="btn btn-gold">💾 حفظ</button>'
      + '</div>'
      + '</form></div></div>';
  },

  showSliderForm: function(idx) {
    idx = idx !== undefined ? idx : -1;
    document.getElementById('sliderEditIdx').value = idx;
    document.getElementById('sliderModalTitle').textContent = idx >= 0 ? 'تعديل سلايدر' : 'إضافة سلايدر';
    document.getElementById('sliderImage').value = '';
    var preview = document.getElementById('sliderPreview');
    if (idx >= 0) {
      var s = this.data.sliders[idx];
      document.getElementById('sliderSection').value = s.section || 'home';
      document.getElementById('sliderTitle').value = s.title || '';
      document.getElementById('sliderLink').value = s.link || '';
      document.getElementById('sliderOrder').value = s.order || (idx+1);
      document.getElementById('sliderExistingImage').value = s.image || '';
      preview.innerHTML = s.image ? '<img src="' + s.image + '" style="width:80px;height:60px;object-fit:cover;border-radius:8px;border:1px solid var(--border);">' : '';
    } else {
      document.getElementById('sliderSection').value = 'home';
      document.getElementById('sliderTitle').value = '';
      document.getElementById('sliderLink').value = '';
      document.getElementById('sliderOrder').value = this.data.sliders.length + 1;
      document.getElementById('sliderExistingImage').value = '';
      preview.innerHTML = '';
    }
    document.getElementById('sliderModal').classList.add('show');
  },

  editSlider: function(idx) { this.showSliderForm(idx); },

  saveSlider: function(e) {
    e.preventDefault();
    var self = this;
    var idx = parseInt(document.getElementById('sliderEditIdx').value);
    var fileInput = document.getElementById('sliderImage');
    var existingImage = document.getElementById('sliderExistingImage').value;

    function save(base64Image) {
      var slide = {
        image: base64Image || existingImage || '',
        section: document.getElementById('sliderSection').value,
        title: document.getElementById('sliderTitle').value,
        link: document.getElementById('sliderLink').value,
        order: parseInt(document.getElementById('sliderOrder').value) || 0,
        hidden: false
      };
      if (idx >= 0) {
        self.data.sliders[idx] = slide;
      } else {
        self.data.sliders.push(slide);
      }
      self.saveData();
      self.syncSliders();
      self.closeModal('sliderModal');
      self.renderContent('sliders');
    }

    if (fileInput.files && fileInput.files[0]) {
      this.fileToBase64(fileInput.files[0], function(b64) { save(b64); });
    } else {
      save(null);
    }
  },

  toggleSlider: function(idx) {
    this.data.sliders[idx].hidden = !this.data.sliders[idx].hidden;
    this.saveData();
    this.syncSliders();
    this.renderContent('sliders');
  },

  deleteSlider: function(idx) {
    if (!confirm('حذف السلايدر؟')) return;
    this.data.sliders.splice(idx, 1);
    this.saveData();
    this.syncSliders();
    this.renderContent('sliders');
  },

  syncSliders: function() {
    localStorage.setItem('bunean-sliders', JSON.stringify(this.data.sliders));
  },

  closeModal: function(id) {
    document.getElementById(id).classList.remove('show');
  },

  // ---- Social Links ----
  render_social: function() {
    var l = this.data.socialLinks;
    return '<div class="card"><div class="card-header"><h3>🔗 روابط التواصل الاجتماعي</h3></div><div class="card-body">'
      + '<form onsubmit="dashboard.saveSocial(event)">'
      + '<div class="form-group"><label>واتساب</label><input class="form-control" id="socialWhatsapp" value="' + (l.whatsapp || '') + '" placeholder="https://wa.me/..."></div>'
      + '<div class="form-group"><label>فيسبوك</label><input class="form-control" id="socialFacebook" value="' + (l.facebook || '') + '" placeholder="https://facebook.com/..."></div>'
      + '<div class="form-group"><label>انستغرام</label><input class="form-control" id="socialInstagram" value="' + (l.instagram || '') + '" placeholder="https://instagram.com/..."></div>'
      + '<div class="form-group"><label>تيك توك</label><input class="form-control" id="socialTiktok" value="' + (l.tiktok || '') + '" placeholder="https://tiktok.com/..."></div>'
      + '<button type="submit" class="btn btn-gold">💾 حفظ الروابط</button>'
      + '</form></div></div>';
  },

  saveSocial: function(e) {
    e.preventDefault();
    this.data.socialLinks = {
      whatsapp: document.getElementById('socialWhatsapp').value,
      facebook: document.getElementById('socialFacebook').value,
      instagram: document.getElementById('socialInstagram').value,
      tiktok: document.getElementById('socialTiktok').value
    };
    this.saveData();
    this.syncSocial();
    alert('✅ تم حفظ روابط التواصل');
  },

  syncSocial: function() {
    localStorage.setItem('bunean-social-links', JSON.stringify(this.data.socialLinks));
  },

  // ---- Projects ----
  render_projects: function() {
    var pending = [], approved = [], rejected = [];
    for (var i = 0; i < this.data.projects.length; i++) {
      var p = this.data.projects[i];
      if (p.status === 'approved') approved.push(p);
      else if (p.status === 'rejected') rejected.push(p);
      else pending.push(p);
    }
    return '<div class="dash-tabs" id="projectTabs">'
      + '<div class="dash-tab active" onclick="dashboard.switchTab(\'project\',\'pending\',this)">قيد المراجعة 🟡 ' + (pending.length ? '<span class="badge">' + pending.length + '</span>' : '') + '</div>'
      + '<div class="dash-tab" onclick="dashboard.switchTab(\'project\',\'approved\',this)">منشور ✅</div>'
      + '<div class="dash-tab" onclick="dashboard.switchTab(\'project\',\'rejected\',this)">مرفوض ❌</div>'
      + '</div>'
      + '<div class="card"><div class="card-body" id="projectTabContent">'
      + this.projectTable(pending, 'pending')
      + '</div></div>';
  },

  projectTable: function(list, status) {
    if (!list.length) return '<div class="empty-state"><p>لا توجد مشاريع</p></div>';
    var rows = '';
    for (var i = 0; i < list.length; i++) {
      var p = list[i];
      var img = p.images && p.images[0] ? '<img src="' + p.images[0] + '" style="width:50px;height:40px;object-fit:cover;border-radius:6px;" onerror="this.style.display=\'none\'">' : '-';
      rows += '<tr><td>' + (i+1) + '</td><td>' + img + '</td><td>' + (p.title || p.name || '-') + '</td><td>' + (p.category || '-') + '</td><td>' + (p.owner || '-') + '</td>'
        + '<td><span class="status ' + (p.status === 'approved' ? 'approved' : p.status === 'rejected' ? 'rejected' : 'pending') + '">'
        + (p.status === 'approved' ? 'منشور' : p.status === 'rejected' ? 'مرفوض' : 'قيد المراجعة') + '</span></td>'
        + '<td>' + (status === 'pending' ? '<button class="btn btn-sm btn-success" onclick="dashboard.approveProject(' + i + ')">قبول</button> <button class="btn btn-sm btn-danger" onclick="dashboard.rejectProject(' + i + ')">رفض</button>' : '') + '</td></tr>';
    }
    return '<div class="table-wrap"><table><thead><tr><th>#</th><th>الصورة</th><th>العنوان</th><th>القسم</th><th>صاحب المشروع</th><th>الحالة</th><th></th></tr></thead><tbody>' + rows + '</tbody></table></div>';
  },

  approveProject: function(idx) {
    if (idx >= 0 && idx < this.data.projects.length) {
      this.data.projects[idx].status = 'approved';
      this.saveData();
      this.renderContent('projects');
    }
  },

  rejectProject: function(idx) {
    if (idx >= 0 && idx < this.data.projects.length) {
      this.data.projects[idx].status = 'rejected';
      this.saveData();
      this.renderContent('projects');
    }
  },

  // ---- Ads ----
  render_ads: function() {
    var pending = [], approved = [], rejected = [];
    for (var i = 0; i < this.data.ads.length; i++) {
      var a = this.data.ads[i];
      if (a.status === 'approved') approved.push(a);
      else if (a.status === 'rejected') rejected.push(a);
      else pending.push(a);
    }
    return '<div class="dash-tabs" id="adTabs">'
      + '<div class="dash-tab active" onclick="dashboard.switchTab(\'ad\',\'pending\',this)">قيد المراجعة 🟡 ' + (pending.length ? '<span class="badge">' + pending.length + '</span>' : '') + '</div>'
      + '<div class="dash-tab" onclick="dashboard.switchTab(\'ad\',\'approved\',this)">منشور ✅</div>'
      + '<div class="dash-tab" onclick="dashboard.switchTab(\'ad\',\'rejected\',this)">مرفوض ❌</div>'
      + '</div>'
      + '<div class="card"><div class="card-body" id="adTabContent">'
      + this.adTable(pending, 'pending')
      + '</div></div>';
  },

  adTable: function(list, status) {
    if (!list.length) return '<div class="empty-state"><p>لا توجد إعلانات</p></div>';
    var rows = '';
    for (var i = 0; i < list.length; i++) {
      var a = list[i];
      rows += '<tr><td>' + (i+1) + '</td><td>' + (a.title || '-') + '</td><td>' + (a.company || '-') + '</td><td>' + (a.date || '-') + '</td>'
        + '<td><span class="status ' + (a.status === 'approved' ? 'approved' : a.status === 'rejected' ? 'rejected' : 'pending') + '">'
        + (a.status === 'approved' ? 'منشور' : a.status === 'rejected' ? 'مرفوض' : 'قيد المراجعة') + '</span></td>'
        + '<td>' + (status === 'pending' ? '<button class="btn btn-sm btn-success" onclick="dashboard.approveAd(' + i + ')">قبول</button> <button class="btn btn-sm btn-danger" onclick="dashboard.rejectAd(' + i + ')">رفض</button>' : '') + '</td></tr>';
    }
    return '<div class="table-wrap"><table><thead><tr><th>#</th><th>العنوان</th><th>الشركة</th><th>التاريخ</th><th>الحالة</th><th></th></tr></thead><tbody>' + rows + '</tbody></table></div>';
  },

  approveAd: function(idx) {
    if (idx >= 0 && idx < this.data.ads.length) {
      this.data.ads[idx].status = 'approved';
      this.saveData();
      this.renderContent('ads');
    }
  },

  rejectAd: function(idx) {
    if (idx >= 0 && idx < this.data.ads.length) {
      this.data.ads[idx].status = 'rejected';
      this.saveData();
      this.renderContent('ads');
    }
  },

  // ---- Messages ----
  render_messages: function() {
    var msgs = this.data.messages;
    var list = '';
    for (var i = 0; i < msgs.length; i++) {
      var m = msgs[i];
      list += '<tr><td>' + (i+1) + '</td><td>' + (m.from || '-') + '</td><td>' + (m.to || '-') + '</td><td>' + (m.subject || m.message ? (m.message || '').substring(0, 40) : '-') + '</td>'
        + '<td>' + (m.date || '-') + '</td>'
        + '<td><span class="status ' + (m.read ? 'approved' : 'pending') + '">' + (m.read ? 'مقروء' : 'جديد') + '</span></td>'
        + '<td><button class="btn btn-sm btn-outline" onclick="dashboard.viewMessage(' + i + ')">عرض</button></td></tr>';
    }
    return '<div class="card"><div class="card-header"><h3>💬 الرسائل والاستشارات</h3></div><div class="card-body">'
      + '<div class="table-wrap"><table><thead><tr><th>#</th><th>من</th><th>إلى</th><th>الرسالة</th><th>التاريخ</th><th>الحالة</th><th></th></tr></thead><tbody>'
      + (list || '<tr><td colspan="7"><div class="empty-state"><p>لا توجد رسائل</p></div></td></tr>')
      + '</tbody></table></div></div></div>';
  },

  viewMessage: function(idx) {
    var m = this.data.messages[idx];
    if (!m) return;
    m.read = true;
    this.saveData();
    var content = '<div style="padding:10px 0;"><strong>من: </strong>' + (m.from || '-') + '<br><strong>إلى: </strong>' + (m.to || '-') + '<br><strong>التاريخ: </strong>' + (m.date || '-') + '<br><hr style="margin:12px 0;border-color:var(--border);"><p style="line-height:1.8;">' + (m.message || '') + '</p></div>';
    document.getElementById('messageViewContent').innerHTML = content;
    document.getElementById('messageModal').classList.add('show');
  },

  messageModal: function() {
    return '<div class="modal-overlay" id="messageModal"><div class="modal-box">'
      + '<h3>الرسالة</h3>'
      + '<div id="messageViewContent"></div>'
      + '<div class="modal-actions"><button type="button" class="btn btn-outline" onclick="dashboard.closeModal(\'messageModal\')">إغلاق</button></div>'
      + '</div></div>';
  },

  afterRender_messages: function() {
    // inject modal
    if (!document.getElementById('messageModal')) {
      var div = document.createElement('div');
      div.innerHTML = this.messageModal();
      document.body.appendChild(div.firstElementChild);
    }
  },

  // ---- Notifications ----
  render_notifications: function() {
    var notifs = this.data.notifications || [];
    var list = '';
    for (var i = notifs.length - 1; i >= 0; i--) {
      var n = notifs[i];
      list += '<tr><td>' + (notifs.length - i) + '</td><td>' + (n.title || '-') + '</td><td>' + (n.message || '').substring(0, 50) + '</td><td>' + (n.target || 'الكل') + '</td><td>' + (n.date || '-') + '</td>'
        + '<td><button class="btn btn-sm btn-danger" onclick="dashboard.deleteNotification(' + i + ')">حذف</button></td></tr>';
    }
    return '<div class="card"><div class="card-header"><h3>🔔 إرسال إشعار</h3></div><div class="card-body">'
      + '<form onsubmit="dashboard.sendNotification(event)">'
      + '<div class="form-row">'
      + '<div class="form-group"><label>عنوان الإشعار</label><input class="form-control" id="notifTitle" required></div>'
      + '<div class="form-group"><label>المستهدف</label><select class="form-control" id="notifTarget"><option value="all">جميع المستخدمين</option><option value="users">المستخدمون</option><option value="companies">الشركات</option></select></div>'
      + '</div>'
      + '<div class="form-group"><label>نص الإشعار</label><textarea class="form-control" id="notifMessage" required></textarea></div>'
      + '<button type="submit" class="btn btn-gold">📨 إرسال الإشعار</button>'
      + '</form></div></div>'
      + '<div class="card"><div class="card-header"><h3>📋 الإشعارات المرسلة</h3></div><div class="card-body">'
      + '<div class="table-wrap"><table><thead><tr><th>#</th><th>العنوان</th><th>الرسالة</th><th>المستهدف</th><th>التاريخ</th><th></th></tr></thead><tbody>'
      + (list || '<tr><td colspan="6"><div class="empty-state"><p>لا توجد إشعارات مرسلة</p></div></td></tr>')
      + '</tbody></table></div></div></div>';
  },

  sendNotification: function(e) {
    e.preventDefault();
    var notif = {
      id: Date.now(),
      title: document.getElementById('notifTitle').value,
      message: document.getElementById('notifMessage').value,
      target: document.getElementById('notifTarget').value,
      date: new Date().toLocaleDateString('ar-IQ')
    };
    if (!this.data.notifications) this.data.notifications = [];
    this.data.notifications.push(notif);
    this.saveData();
    this.syncNotifications();
    document.getElementById('notifTitle').value = '';
    document.getElementById('notifMessage').value = '';
    this.renderContent('notifications');
  },

  deleteNotification: function(idx) {
    if (!confirm('حذف الإشعار؟')) return;
    this.data.notifications.splice(idx, 1);
    this.saveData();
    this.syncNotifications();
    this.renderContent('notifications');
  },

  syncNotifications: function() {
    localStorage.setItem('bunean-notifications', JSON.stringify(this.data.notifications || []));
  },

  // ---- Orders ----
  render_orders: function() {
    var orders = this.data.orders;
    var list = '';
    for (var i = orders.length - 1; i >= 0; i--) {
      var o = orders[i];
      var items = o.items || [];
      var itemStr = items.map(function(it) { return it.name || it.productName || ''; }).filter(Boolean).join(', ') || '-';
      list += '<tr><td>' + (orders.length - i) + '</td><td>' + (o.orderId || o.id || '-') + '</td>'
        + '<td>' + (o.customer || o.name || '-') + '</td><td>' + itemStr.substring(0, 30) + '</td>'
        + '<td>' + (o.total || o.price || '-') + '</td><td>' + (o.date || '-') + '</td>'
        + '<td><span class="status ' + (o.status === 'completed' || o.status === 'delivered' ? 'approved' : o.status === 'cancelled' ? 'rejected' : 'pending') + '">' + (o.status || 'جديد') + '</span></td>'
        + '<td><button class="btn btn-sm btn-outline" onclick="dashboard.editOrder(' + i + ')">عرض</button></td></tr>';
    }
    return '<div class="card"><div class="card-header"><h3>🛒 الطلبات</h3></div><div class="card-body">'
      + '<div class="table-wrap"><table><thead><tr><th>#</th><th>رقم الطلب</th><th>العميل</th><th>المنتجات</th><th>المجموع</th><th>التاريخ</th><th>الحالة</th><th></th></tr></thead><tbody>'
      + (list || '<tr><td colspan="8"><div class="empty-state"><p>لا توجد طلبات</p></div></td></tr>')
      + '</tbody></table></div></div></div>';
  },

  editOrder: function(idx) {
    var o = this.data.orders[idx];
    if (!o) return;
    var itemsHtml = '';
    if (o.items) {
      for (var i = 0; i < o.items.length; i++) {
        itemsHtml += '<div style="display:flex;justify-content:space-between;padding:6px 0;border-bottom:1px solid var(--border-light);font-size:13px;">'
          + '<span>' + (o.items[i].name || o.items[i].productName || '') + '</span>'
          + '<span style="color:var(--text-muted);">' + (o.items[i].qty || o.items[i].quantity || 1) + ' × ' + (o.items[i].price || '') + '</span></div>';
      }
    }
    document.getElementById('orderViewContent').innerHTML = '<div style="line-height:2;">'
      + '<strong>رقم الطلب:</strong> ' + (o.orderId || o.id || '-') + '<br>'
      + '<strong>العميل:</strong> ' + (o.customer || o.name || '-') + '<br>'
      + '<strong>الهاتف:</strong> ' + (o.phone || '-') + '<br>'
      + '<strong>العنوان:</strong> ' + (o.address || o.shippingAddress || '-') + '<br>'
      + '<strong>التاريخ:</strong> ' + (o.date || '-') + '<br>'
      + '<strong>الحالة:</strong> <span class="status ' + (o.status === 'completed' || o.status === 'delivered' ? 'approved' : o.status === 'cancelled' ? 'rejected' : 'pending') + '">' + (o.status || 'جديد') + '</span><br>'
      + '<hr style="border-color:var(--border-light);margin:10px 0;">'
      + '<strong>المنتجات:</strong><br>' + itemsHtml
      + '<hr style="border-color:var(--border-light);margin:10px 0;">'
      + '<strong style="font-size:15px;">المجموع: ' + (o.total || o.price || '-') + '</strong>'
      + '</div>';
    document.getElementById('orderModal').classList.add('show');
  },

  afterRender_orders: function() {
    if (!document.getElementById('orderModal')) {
      var div = document.createElement('div');
      div.innerHTML = '<div class="modal-overlay" id="orderModal"><div class="modal-box">'
        + '<h3>تفاصيل الطلب</h3><div id="orderViewContent"></div>'
        + '<div class="modal-actions"><button type="button" class="btn btn-outline" onclick="dashboard.closeModal(\'orderModal\')">إغلاق</button></div></div></div>';
      document.body.appendChild(div.firstElementChild);
    }
  },

  // ---- Quotes ----
  render_quotes: function() {
    var qs = this.data.quotes;
    var list = '';
    for (var i = qs.length - 1; i >= 0; i--) {
      var q = qs[i];
      list += '<tr><td>' + (qs.length - i) + '</td><td>' + (q.name || q.from || '-') + '</td>'
        + '<td>' + (q.phone || '-') + '</td><td>' + (q.service || q.serviceType || '-') + '</td>'
        + '<td>' + (q.details || '').substring(0, 30) + '</td><td>' + (q.date || '-') + '</td>'
        + '<td><span class="status ' + (q.status === 'approved' ? 'approved' : q.status === 'rejected' ? 'rejected' : 'pending') + '">' + (q.status === 'approved' ? 'تم الموافقة' : q.status === 'rejected' ? 'مرفوض' : 'قيد المراجعة') + '</span></td>'
        + '<td><button class="btn btn-sm btn-outline" onclick="dashboard.viewQuote(' + i + ')">عرض</button>'
        + (q.status !== 'approved' ? ' <button class="btn btn-sm btn-success" onclick="dashboard.approveQuote(' + i + ')">قبول</button>' : '')
        + (q.status !== 'rejected' ? ' <button class="btn btn-sm btn-danger" onclick="dashboard.rejectQuote(' + i + ')">رفض</button>' : '')
        + '</td></tr>';
    }
    return '<div class="card"><div class="card-header"><h3>💰 عروض الأسعار</h3></div><div class="card-body">'
      + '<div class="table-wrap"><table><thead><tr><th>#</th><th>الاسم</th><th>الهاتف</th><th>الخدمة</th><th>التفاصيل</th><th>التاريخ</th><th>الحالة</th><th></th></tr></thead><tbody>'
      + (list || '<tr><td colspan="8"><div class="empty-state"><p>لا توجد عروض أسعار</p></div></td></tr>')
      + '</tbody></table></div></div></div>';
  },

  viewQuote: function(idx) {
    var q = this.data.quotes[idx];
    if (!q) return;
    document.getElementById('quoteViewContent').innerHTML = '<div style="line-height:2;">'
      + '<strong>الاسم:</strong> ' + (q.name || q.from || '-') + '<br>'
      + '<strong>الهاتف:</strong> ' + (q.phone || '-') + '<br>'
      + '<strong>الخدمة:</strong> ' + (q.service || q.serviceType || '-') + '<br>'
      + '<strong>المدينة:</strong> ' + (q.city || '-') + '<br>'
      + '<strong>تفاصيل:</strong><br><p style="padding:10px;background:var(--bg-input);border-radius:8px;margin-top:4px;">' + (q.details || q.message || '') + '</p>'
      + '<strong>التاريخ:</strong> ' + (q.date || '-') + '<br>'
      + '<strong>الحالة:</strong> <span class="status ' + (q.status === 'approved' ? 'approved' : q.status === 'rejected' ? 'rejected' : 'pending') + '">' + (q.status === 'approved' ? 'تم الموافقة' : q.status === 'rejected' ? 'مرفوض' : 'قيد المراجعة') + '</span>'
      + '</div>';
    document.getElementById('quoteModal').classList.add('show');
  },

  approveQuote: function(idx) {
    if (idx >= 0 && idx < this.data.quotes.length) {
      this.data.quotes[idx].status = 'approved';
      this.saveData();
      this.syncQuotes();
      this.renderContent('quotes');
    }
  },

  rejectQuote: function(idx) {
    if (idx >= 0 && idx < this.data.quotes.length) {
      this.data.quotes[idx].status = 'rejected';
      this.saveData();
      this.syncQuotes();
      this.renderContent('quotes');
    }
  },

  syncQuotes: function() {
    localStorage.setItem('bunean-quote-requests', JSON.stringify(this.data.quotes));
  },

  afterRender_quotes: function() {
    if (!document.getElementById('quoteModal')) {
      var div = document.createElement('div');
      div.innerHTML = '<div class="modal-overlay" id="quoteModal"><div class="modal-box">'
        + '<h3>تفاصيل عرض السعر</h3><div id="quoteViewContent"></div>'
        + '<div class="modal-actions"><button type="button" class="btn btn-outline" onclick="dashboard.closeModal(\'quoteModal\')">إغلاق</button></div></div></div>';
      document.body.appendChild(div.firstElementChild);
    }
  },

  // ---- Services ----
  render_services: function() {
    var reqs = this.data.serviceReqs;
    var list = '';
    for (var i = reqs.length - 1; i >= 0; i--) {
      var r = reqs[i];
      list += '<tr><td>' + (reqs.length - i) + '</td><td>' + (r.name || r.customerName || r.from || '-') + '</td>'
        + '<td>' + (r.phone || '-') + '</td><td>' + (r.service || r.serviceType || '-') + '</td>'
        + '<td>' + (r.details || r.message || '').substring(0, 30) + '</td><td>' + (r.date || '-') + '</td>'
        + '<td><span class="status ' + (r.status === 'completed' ? 'approved' : r.status === 'cancelled' ? 'rejected' : 'pending') + '">' + (r.status || 'جديد') + '</span></td>'
        + '<td><button class="btn btn-sm btn-outline" onclick="dashboard.viewService(' + i + ')">عرض</button>'
        + '<button class="btn btn-sm btn-success" onclick="dashboard.completeService(' + i + ')">إكمال</button></td></tr>';
    }
    return '<div class="card"><div class="card-header"><h3>📞 طلبات الخدمة</h3></div><div class="card-body">'
      + '<div class="table-wrap"><table><thead><tr><th>#</th><th>الاسم</th><th>الهاتف</th><th>الخدمة</th><th>التفاصيل</th><th>التاريخ</th><th>الحالة</th><th></th></tr></thead><tbody>'
      + (list || '<tr><td colspan="8"><div class="empty-state"><p>لا توجد طلبات خدمة</p></div></td></tr>')
      + '</tbody></table></div></div></div>';
  },

  viewService: function(idx) {
    var r = this.data.serviceReqs[idx];
    if (!r) return;
    document.getElementById('serviceViewContent').innerHTML = '<div style="line-height:2;">'
      + '<strong>الاسم:</strong> ' + (r.name || r.customerName || r.from || '-') + '<br>'
      + '<strong>الهاتف:</strong> ' + (r.phone || '-') + '<br>'
      + '<strong>الخدمة:</strong> ' + (r.service || r.serviceType || '-') + '<br>'
      + '<strong>المدينة:</strong> ' + (r.city || '-') + '<br>'
      + '<strong>التفاصيل:</strong><br><p style="padding:10px;background:var(--bg-input);border-radius:8px;margin-top:4px;">' + (r.details || r.message || '') + '</p>'
      + '<strong>الحالة:</strong> <span class="status ' + (r.status === 'completed' ? 'approved' : r.status === 'cancelled' ? 'rejected' : 'pending') + '">' + (r.status || 'جديد') + '</span>'
      + '</div>';
    document.getElementById('serviceModal').classList.add('show');
  },

  completeService: function(idx) {
    if (idx >= 0 && idx < this.data.serviceReqs.length) {
      this.data.serviceReqs[idx].status = 'completed';
      this.saveData();
      this.syncServiceReqs();
      this.renderContent('services');
    }
  },

  syncServiceReqs: function() {
    localStorage.setItem('bunean-service-requests', JSON.stringify(this.data.serviceReqs));
  },

  afterRender_services: function() {
    if (!document.getElementById('serviceModal')) {
      var div = document.createElement('div');
      div.innerHTML = '<div class="modal-overlay" id="serviceModal"><div class="modal-box">'
        + '<h3>تفاصيل طلب الخدمة</h3><div id="serviceViewContent"></div>'
        + '<div class="modal-actions"><button type="button" class="btn btn-outline" onclick="dashboard.closeModal(\'serviceModal\')">إغلاق</button></div></div></div>';
      document.body.appendChild(div.firstElementChild);
    }
  },

  // ---- Settings ----
  render_settings: function() {
    return '<div class="card"><div class="card-header"><h3>⚙️ إعدادات التطبيق</h3></div><div class="card-body">'
      + '<div class="empty-state"><p>الإعدادات قيد التطوير</p></div>'
      + '</div></div>';
  }
};

document.addEventListener('DOMContentLoaded', function() {
  dashboard.init();
});
