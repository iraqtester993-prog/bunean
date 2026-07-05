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
    this.loadData();
    this.renderSidebar();
    this.navigate('overview');
    this.bindEvents();
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
    this.data.stats.users = this.data.users.length;
    this.data.stats.companies = this.data.companies.length;
    this.data.stats.products = this.data.products.length;
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
    document.querySelector('.toggle-sidebar').onclick = function() {
      document.querySelector('.sidebar').classList.toggle('open');
    };
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
      rows += '<tr><td>' + (i+1) + '</td><td>' + (p[i].name || '-') + '</td><td>' + (p[i].category || '-') + '</td><td>' + (p[i].price || '-') + '</td>'
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
    return '<div class="table-wrap"><table><thead><tr><th>#</th><th>الاسم</th><th>القسم</th><th>السعر</th><th>إظهار</th><th></th></tr></thead><tbody>' + rows + '</tbody></table></div>'
      + '<h4 style="margin-top:20px;font-size:14px;">الأقسام</h4>'
      + '<div class="table-wrap"><table><thead><tr><th>#</th><th>القسم</th><th>إظهار</th><th></th></tr></thead><tbody>' + catRows + '</tbody></table></div>'
      + '<h4 style="margin-top:20px;font-size:14px;">الموردين</h4>'
      + '<div class="table-wrap"><table><thead><tr><th>#</th><th>الاسم</th><th>الهاتف</th><th></th></tr></thead><tbody>' + supRows + '</tbody></table></div>';
  },

  productForm: function() {
    var cats = this.data.categories;
    var catOpts = '';
    for (var i = 0; i < cats.length; i++) {
      catOpts += '<option value="' + cats[i].name + '">' + cats[i].name + '</option>';
    }
    return '<form onsubmit="dashboard.addProduct(event)">'
      + '<div class="form-row">'
      + '<div class="form-group"><label>اسم المنتج</label><input class="form-control" id="prodName" required></div>'
      + '<div class="form-group"><label>السعر</label><input class="form-control" id="prodPrice" type="number" required></div>'
      + '</div>'
      + '<div class="form-row">'
      + '<div class="form-group"><label>القسم</label><select class="form-control" id="prodCategory">' + catOpts + '</select></div>'
      + '<div class="form-group"><label>صورة (رابط)</label><input class="form-control" id="prodImage" placeholder="https://..."></div>'
      + '</div>'
      + '<div class="form-group"><label>الوصف</label><textarea class="form-control" id="prodDesc"></textarea></div>'
      + '<button type="submit" class="btn btn-gold">➕ إضافة المنتج</button>'
      + '</form>';
  },

  addProduct: function(e) {
    e.preventDefault();
    var prod = {
      id: Date.now(),
      name: document.getElementById('prodName').value,
      price: document.getElementById('prodPrice').value,
      category: document.getElementById('prodCategory').value,
      image: document.getElementById('prodImage').value || 'images/img1.jpg',
      desc: document.getElementById('prodDesc').value,
      hidden: false
    };
    this.data.products.push(prod);
    this.saveData();
    this.syncProducts();
    this.switchTab('product', 'all', document.querySelector('#productTabs .dash-tab:first-child'));
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
    document.getElementById('prodName').value = p.name;
    document.getElementById('prodPrice').value = p.price;
    document.getElementById('prodCategory').value = p.category;
    document.getElementById('prodImage').value = p.image || '';
    document.getElementById('prodDesc').value = p.desc || '';
    this.switchTab('product', 'add', document.querySelector('#productTabs .dash-tab:nth-child(2)'));
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
  render_sliders: function() {
    var slides = this.data.sliders;
    var list = '';
    for (var i = 0; i < slides.length; i++) {
      var s = slides[i];
      list += '<tr><td>' + (i+1) + '</td><td><img src="' + (s.image || '') + '" style="width:60px;height:40px;object-fit:cover;border-radius:6px;" onerror="this.style.display=\'none\'"></td>'
        + '<td>' + (s.title || '-') + '</td><td>' + (s.link || '-') + '</td>'
        + '<td>' + (s.order || i+1) + '</td>'
        + '<td><span class="toggle ' + (s.hidden ? '' : 'on') + '" onclick="dashboard.toggleSlider(' + i + ')"></span></td>'
        + '<td><button class="btn btn-sm btn-outline" onclick="dashboard.editSlider(' + i + ')">تعديل</button> <button class="btn btn-sm btn-danger" onclick="dashboard.deleteSlider(' + i + ')">حذف</button></td></tr>';
    }
    return '<div class="card"><div class="card-header"><h3>السلايدر</h3><button class="btn btn-gold btn-sm" onclick="dashboard.showSliderForm()">➕ إضافة سلايدر</button></div><div class="card-body">'
      + '<div class="table-wrap"><table><thead><tr><th>#</th><th>الصورة</th><th>العنوان</th><th>الرابط</th><th>الترتيب</th><th>إظهار</th><th></th></tr></thead><tbody>'
      + (list || '<tr><td colspan="7"><div class="empty-state"><p>لا توجد سلايدرات</p></div></td></tr>')
      + '</tbody></table></div></div></div>'
      + this.sliderModal();
  },

  sliderModal: function() {
    return '<div class="modal-overlay" id="sliderModal"><div class="modal-box">'
      + '<h3 id="sliderModalTitle">إضافة سلايدر</h3>'
      + '<form onsubmit="dashboard.saveSlider(event)">'
      + '<div class="form-group"><label>رابط الصورة</label><input class="form-control" id="sliderImage" required></div>'
      + '<div class="form-group"><label>العنوان</label><input class="form-control" id="sliderTitle"></div>'
      + '<div class="form-group"><label>الرابط</label><input class="form-control" id="sliderLink"></div>'
      + '<div class="form-group"><label>الترتيب</label><input class="form-control" id="sliderOrder" type="number"></div>'
      + '<input type="hidden" id="sliderEditIdx" value="-1">'
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
    if (idx >= 0) {
      var s = this.data.sliders[idx];
      document.getElementById('sliderImage').value = s.image || '';
      document.getElementById('sliderTitle').value = s.title || '';
      document.getElementById('sliderLink').value = s.link || '';
      document.getElementById('sliderOrder').value = s.order || (idx+1);
    } else {
      document.getElementById('sliderImage').value = '';
      document.getElementById('sliderTitle').value = '';
      document.getElementById('sliderLink').value = '';
      document.getElementById('sliderOrder').value = this.data.sliders.length + 1;
    }
    document.getElementById('sliderModal').classList.add('show');
  },

  editSlider: function(idx) { this.showSliderForm(idx); },

  saveSlider: function(e) {
    e.preventDefault();
    var idx = parseInt(document.getElementById('sliderEditIdx').value);
    var slide = {
      image: document.getElementById('sliderImage').value,
      title: document.getElementById('sliderTitle').value,
      link: document.getElementById('sliderLink').value,
      order: parseInt(document.getElementById('sliderOrder').value) || 0,
      hidden: false
    };
    if (idx >= 0) {
      this.data.sliders[idx] = slide;
    } else {
      this.data.sliders.push(slide);
    }
    this.saveData();
    this.syncSliders();
    this.closeModal('sliderModal');
    this.renderContent('sliders');
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
