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
    appSections: [],
    activityLog: [],
    suppliers: []
  },

  init: function() {
    this.initTheme();
    this.loadData();
    this.initHomeSections();
    this.renderSidebar();
    this.bindTopbarEvents();
    this.navigate('overview');
    this.updateThemeIcon();
  },

  loadData: function() {
    var saved = localStorage.getItem('bunean-dashboard');
    if (saved) {
      try { var d = JSON.parse(saved); for (var k in d) this.data[k] = d[k]; } catch(e) {}
    }
    // Load accounts (all registered users)
    var accounts = localStorage.getItem('bunean-accounts');
    if (accounts) {
      try {
        var accs = JSON.parse(accounts);
        var allUsers = [];
        for (var uid in accs) {
          var a = accs[uid];
          a.uid = uid;
          // Check if there's a company profile with additional data
          if (a.role === 'company') {
            var cp = localStorage.getItem('bunean-company-profile');
            if (cp) {
              try { var cpd = JSON.parse(cp); for (var ck in cpd) { if (ck !== 'name') a[ck] = cpd[ck]; } } catch(e) {}
            }
          }
          allUsers.push(a);
        }
        this.data.users = allUsers;
      } catch(e) {}
    } else {
      // Fallback to old methods
      var usersData = localStorage.getItem('bunean-user-data');
      if (usersData) {
        try { this.data.users = [JSON.parse(usersData)]; } catch(e) {}
      }
      var allUsers = localStorage.getItem('bunean-all-users');
      if (allUsers) {
        try { this.data.users = JSON.parse(allUsers); } catch(e) {}
      }
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
    // Load ads from bunean-ads (from company submissions)
    var ads = localStorage.getItem('bunean-ads');
    if (ads) {
      try { this.data.ads = JSON.parse(ads); } catch(e) {}
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

  navigate: function(section) {
    this.currentSection = section;
    var items = document.querySelectorAll('.nav-item');
    for (var i = 0; i < items.length; i++) {
      items[i].classList.toggle('active', items[i].dataset.section === section);
    }
    var titles = {
      overview: 'الرئيسية', users: 'المستخدمون', companies: 'الشركات',
      products: 'المنتجات', orders: 'الطلبات', projects: 'المشاريع',
      ads: 'الإعلانات', messages: 'الرسائل والاستشارات', quotes: 'عروض الأسعار',
      services: 'طلبات الخدمة', social: 'روابط التواصل',
      notifications: 'الإشعارات', sliders: 'السلايدر', appSections: 'الأقسام', suppliers: 'الموردين', settings: 'الإعدادات'
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

  // ===== Sections =====

  // ---- Overview ----
  render_overview: function() {
    var d = this.data;
    var otpLog = JSON.parse(localStorage.getItem('bunean-otp-log') || '[]');
    return '<div class="stats-grid">'
      + this.statCard('المستخدمون', d.stats.users, 'group', 'gold', "dashboard.navigate('users')")
      + this.statCard('الشركات', d.stats.companies, 'business', 'blue', "dashboard.navigate('companies')")
      + this.statCard('المنتجات', d.stats.products, 'inventory_2', 'green', "dashboard.navigate('products')")
      + this.statCard('الموردين', d.suppliers.length, 'local_shipping', 'purple', "dashboard.navigate('suppliers')")
      + '</div>'
      + '<div class="stats-grid" style="margin-top:12px;">'
      + this.statCard('الإعلانات', d.ads.length, 'campaign', 'blue', "dashboard.navigate('ads')")
      + this.statCard('الطلبات', d.stats.orders, 'shopping_cart', 'red', "dashboard.navigate('orders')")
      + this.statCard('الأقسام', d.appSections.length, 'category', 'purple', "dashboard.navigate('appSections')")
      + this.statCard('رسائل OTP', otpLog.length, 'sms', 'blue')
      + '</div>'
      + this.recentActivity();
  },

  statCard: function(label, count, icon, color, onclick) {
    return '<div class="stat-card ' + color + '-bg' + (onclick ? ' clickable' : '') + '"' + (onclick ? ' onclick="' + onclick + '"' : '') + '>'
      + '<div class="stat-icon-wrap"><div class="stat-icon ' + color + '"><span class="material-symbols-outlined">' + icon + '</span></div></div>'
      + '<div class="stat-info"><h3>' + count + '</h3><p>' + label + '</p></div>'
      + '</div>';
  },

  logAction: function(action, details) {
    this.data.activityLog.unshift({
      action: action,
      details: details,
      time: new Date().toLocaleString('ar-IQ')
    });
    if (this.data.activityLog.length > 50) this.data.activityLog.length = 50;
    this.saveData();
  },

  recentActivity: function() {
    var log = this.data.activityLog || [];
    var rows = '';
    for (var i = 0; i < Math.min(log.length, 10); i++) {
      var l = log[i];
      var iconMap = { أضاف: 'add_circle', حذف: 'delete', عدل: 'edit', قبل: 'check_circle', رفض: 'cancel', أخفى: 'visibility_off', أظهر: 'visibility' };
      var icon = iconMap[l.action] || 'info';
      rows += '<div style="display:flex;align-items:center;gap:10px;padding:10px 0;border-bottom:1px solid var(--border-color);font-size:13px;">'
        + '<span class="material-symbols-outlined" style="font-size:18px;color:var(--accent-gold);flex-shrink:0;">' + icon + '</span>'
        + '<div style="flex:1;min-width:0;"><span style="color:var(--text-main);font-weight:600;">' + l.action + '</span> '
        + '<span style="color:var(--text-muted);">' + (l.details || '') + '</span></div>'
        + '<span style="font-size:11px;color:var(--text-muted);flex-shrink:0;white-space:nowrap;">' + l.time + '</span>'
        + '</div>';
    }
    if (!rows) rows = '<div class="empty-state" style="padding:20px;"><p>لا توجد إجراءات بعد</p></div>';
    return '<div class="card"><div class="card-header"><h3><span class="material-symbols-outlined" style="font-size:18px;vertical-align:middle;margin-left:6px;">history</span>آخر الإجراءات</h3></div><div class="card-body" style="padding:12px 20px;">' + rows + '</div></div>';
  },

  // ---- Users ----
  render_users: function() {
    var users = this.data.users.filter(function(u){ return u.role === 'user'; });
    var companies = this.data.users.filter(function(u){ return u.role === 'company'; });
    // Also add companies from this.data.companies (loaded from dashboard)
    for (var ci = 0; ci < this.data.companies.length; ci++) {
      var c = this.data.companies[ci];
      var exists = false;
      for (var ui = 0; ui < companies.length; ui++) {
        if (companies[ui].phone === c.phone || companies[ui].uid === c.id) { exists = true; break; }
      }
      if (!exists) {
        companies.push({ role: 'company', name: c.name || c.companyName || '-', phone: c.phone || '-', governorate: c.city || c.governorate || '-', address: c.address || '-', companyName: c.name || c.companyName || '-', uid: c.id || c.phone });
      }
    }
    var tabs = '<div class="dash-tabs" id="userTabs">'
      + '<div class="dash-tab active" onclick="dashboard.switchTab(\'user\',\'regular\',this)"><span class="material-symbols-outlined" style="font-size:16px;">person</span> مستخدم عادي (' + users.length + ')</div>'
      + '<div class="dash-tab" onclick="dashboard.switchTab(\'user\',\'company\',this)"><span class="material-symbols-outlined" style="font-size:16px;">business</span> شركات (' + companies.length + ')</div>'
      + '</div>';
    var regularTable = '<div class="card" id="userRegularContent"><div class="card-body"><div class="table-wrap"><table><thead><tr><th>#</th><th>الاسم</th><th>رقم الهاتف</th><th>المحافظة</th><th>العنوان</th><th></th></tr></thead><tbody>'
      + (users.length ? users.map(function(u, i){
          return '<tr><td>' + (i+1) + '</td><td>' + (u.name || u.fullName || '-') + '</td><td>' + (u.phone || '-') + '</td><td>' + (u.governorate || u.city || '-') + '</td><td>' + (u.address || '-') + '</td>'
            + '<td><button class="btn btn-sm btn-outline" onclick="dashboard.editUser(' + i + ',\'user\')"><span class="material-symbols-outlined" style="font-size:14px;vertical-align:middle;">visibility</span></button> '
            + '<button class="btn btn-sm btn-edit" onclick="dashboard.editUser(' + i + ',\'user\')"><span class="material-symbols-outlined" style="font-size:14px;vertical-align:middle;">edit</span></button> '
            + '<button class="btn btn-sm btn-danger" onclick="dashboard.deleteUser(' + i + ',\'user\')"><span class="material-symbols-outlined" style="font-size:14px;vertical-align:middle;">delete</span></button></td></tr>';
        }).join('') : '<tr><td colspan="6"><div class="empty-state"><p>لا يوجد مستخدمين</p></div></td></tr>')
      + '</tbody></table></div></div></div>';
    var companyTable = '<div class="card" id="userCompanyContent" style="display:none;"><div class="card-body"><div class="table-wrap"><table><thead><tr><th>#</th><th>اسم الشركة</th><th>الاسم</th><th>رقم الهاتف</th><th>المحافظة</th><th>العنوان</th><th></th></tr></thead><tbody>'
      + (companies.length ? companies.map(function(c, i){
          return '<tr><td>' + (i+1) + '</td><td>' + (c.companyName || c.name || '-') + '</td><td>' + (c.ownerName || c.fullName || '-') + '</td><td>' + (c.phone || '-') + '</td><td>' + (c.governorate || c.city || '-') + '</td><td>' + (c.address || '-') + '</td>'
            + '<td><button class="btn btn-sm btn-outline" onclick="dashboard.editUser(' + i + ',\'company\')"><span class="material-symbols-outlined" style="font-size:14px;vertical-align:middle;">visibility</span></button> '
            + '<button class="btn btn-sm btn-edit" onclick="dashboard.editUser(' + i + ',\'company\')"><span class="material-symbols-outlined" style="font-size:14px;vertical-align:middle;">edit</span></button> '
            + '<button class="btn btn-sm btn-danger" onclick="dashboard.deleteUser(' + i + ',\'company\')"><span class="material-symbols-outlined" style="font-size:14px;vertical-align:middle;">delete</span></button></td></tr>';
        }).join('') : '<tr><td colspan="7"><div class="empty-state"><p>لا توجد شركات</p></div></td></tr>')
      + '</tbody></table></div></div></div>';
    return tabs + regularTable + companyTable;
  },

  editUser: function(idx, type) {
    var list = type === 'company' ? this.data.users.filter(function(u){ return u.role === 'company'; }) : this.data.users.filter(function(u){ return u.role === 'user'; });
    var u = list[idx];
    if (!u) return;
    // Build a detailed view modal
    var fields = '<div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin:10px 0;">'
      + '<div><label style="font-size:11px;color:var(--text-muted);font-weight:700;">الاسم</label><div style="padding:8px;border-radius:8px;background:var(--bg-color);box-shadow:inset 2px 2px 4px var(--shadow-dark), inset -2px -2px 4px var(--shadow-light);margin-top:4px;font-size:13px;">' + (u.name || u.fullName || '-') + '</div></div>'
      + '<div><label style="font-size:11px;color:var(--text-muted);font-weight:700;">رقم الهاتف</label><div style="padding:8px;border-radius:8px;background:var(--bg-color);box-shadow:inset 2px 2px 4px var(--shadow-dark), inset -2px -2px 4px var(--shadow-light);margin-top:4px;font-size:13px;">' + (u.phone || '-') + '</div></div>'
      + '<div><label style="font-size:11px;color:var(--text-muted);font-weight:700;">المحافظة</label><div style="padding:8px;border-radius:8px;background:var(--bg-color);box-shadow:inset 2px 2px 4px var(--shadow-dark), inset -2px -2px 4px var(--shadow-light);margin-top:4px;font-size:13px;">' + (u.governorate || '-') + '</div></div>'
      + '<div><label style="font-size:11px;color:var(--text-muted);font-weight:700;">العنوان</label><div style="padding:8px;border-radius:8px;background:var(--bg-color);box-shadow:inset 2px 2px 4px var(--shadow-dark), inset -2px -2px 4px var(--shadow-light);margin-top:4px;font-size:13px;">' + (u.address || '-') + '</div></div>'
      + (type === 'company' ? '<div style="grid-column:span 2;"><label style="font-size:11px;color:var(--text-muted);font-weight:700;">اسم الشركة</label><div style="padding:8px;border-radius:8px;background:var(--bg-color);box-shadow:inset 2px 2px 4px var(--shadow-dark), inset -2px -2px 4px var(--shadow-light);margin-top:4px;font-size:13px;">' + (u.companyName || u.name || '-') + '</div></div>' : '')
      + '</div>';
    // Edit form
    var editForm = '<div id="editUserForm" style="display:none;margin-top:16px;border-top:1px solid var(--border-color);padding-top:16px;">'
      + '<form onsubmit="dashboard.saveUserEdit(event,\'' + type + '\',' + idx + ')">'
      + '<div class="form-group"><label>الاسم</label><input class="form-control" id="editUserName" value="' + (u.name || '') + '"></div>'
      + '<div class="form-group"><label>رقم الهاتف</label><input class="form-control" id="editUserPhone" value="' + (u.phone || '') + '"></div>'
      + '<div class="form-group"><label>المحافظة</label><input class="form-control" id="editUserGov" value="' + (u.governorate || '') + '"></div>'
      + '<div class="form-group"><label>العنوان</label><input class="form-control" id="editUserAddr" value="' + (u.address || '') + '"></div>'
      + (type === 'company' ? '<div class="form-group"><label>اسم الشركة</label><input class="form-control" id="editUserCompany" value="' + (u.companyName || '') + '"></div>' : '')
      + '<button type="submit" class="btn btn-gold">💾 حفظ التعديلات</button>'
      + '</form></div>';
    var html = '<div style="text-align:right;"><h3 style="font-size:16px;font-weight:700;color:var(--text-main);margin-bottom:4px;">' + (u.name || '-') + '</h3>'
      + '<p style="font-size:12px;color:var(--text-muted);">' + (type === 'company' ? 'شركة' : 'مستخدم') + ' • ' + (u.phone || '') + '</p></div>'
      + fields
      + '<div style="display:flex;gap:8px;margin-top:12px;">'
      + '<button class="btn btn-edit" onclick="document.getElementById(\'editUserForm\').style.display=\'block\';this.style.display=\'none\';">✏️ تعديل البيانات</button>'
      + '<button class="btn btn-danger" onclick="dashboard.deleteUser(' + idx + ',\'' + type + '\');dashboard.closeModal(\'userViewModal\');">🗑️ حذف الحساب</button>'
      + '</div>'
      + editForm;
    var div = document.getElementById('userViewModal');
    if (!div) {
      div = document.createElement('div');
      div.innerHTML = '<div class="modal-overlay" id="userViewModal"><div class="modal-box" id="userViewContent"></div></div>';
      document.body.appendChild(div.firstElementChild);
    }
    document.getElementById('userViewContent').innerHTML = html
      + '<div class="modal-actions"><button class="btn btn-outline" onclick="dashboard.closeModal(\'userViewModal\')">إغلاق</button></div>';
    document.getElementById('userViewModal').classList.add('show');
  },

  saveUserEdit: function(e, type, idx) {
    e.preventDefault();
    var accounts = JSON.parse(localStorage.getItem('bunean-accounts') || '{}');
    // Find the user in accounts
    var list = type === 'company' ? this.data.users.filter(function(u){ return u.role === 'company'; }) : this.data.users.filter(function(u){ return u.role === 'user'; });
    var u = list[idx];
    var uid = u.uid || u.phone;
    if (accounts[uid]) {
      accounts[uid].name = document.getElementById('editUserName').value;
      accounts[uid].phone = document.getElementById('editUserPhone').value;
      accounts[uid].governorate = document.getElementById('editUserGov').value;
      accounts[uid].address = document.getElementById('editUserAddr').value;
      if (type === 'company') {
        accounts[uid].companyName = document.getElementById('editUserCompany').value;
      }
      localStorage.setItem('bunean-accounts', JSON.stringify(accounts));
    }
    // Update local data
    if (u) {
      u.name = document.getElementById('editUserName').value;
      u.phone = document.getElementById('editUserPhone').value;
      u.governorate = document.getElementById('editUserGov').value;
      u.address = document.getElementById('editUserAddr').value;
      if (type === 'company') u.companyName = document.getElementById('editUserCompany').value;
    }
    this.saveData();
    this.renderContent('users');
    this.closeModal('userViewModal');
  },

  deleteUser: function(idx, type) {
    if (!confirm('هل أنت متأكد من حذف هذا الحساب؟')) return;
    var list = type === 'company' ? this.data.users.filter(function(u){ return u.role === 'company'; }) : this.data.users.filter(function(u){ return u.role === 'user'; });
    var u = list[idx];
    if (!u) return;
    var uid = u.uid || u.phone;
    var accounts = JSON.parse(localStorage.getItem('bunean-accounts') || '{}');
    if (accounts[uid]) {
      delete accounts[uid];
      localStorage.setItem('bunean-accounts', JSON.stringify(accounts));
    }
    // Remove from data.users
    this.data.users = this.data.users.filter(function(x){ return (x.uid || x.phone) !== uid; });
    this.saveData();
    this.renderContent('users');
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
        + '<td>' + (status === 'pending' ? '<button class="btn btn-sm btn-success" onclick="dashboard.approveCompany(\'' + (c.id || c.phone) + '\')"><span class="material-symbols-outlined" style="font-size:14px;">check</span> قبول</button> <button class="btn btn-sm btn-danger" onclick="dashboard.rejectCompany(\'' + (c.id || c.phone) + '\')"><span class="material-symbols-outlined" style="font-size:14px;">close</span> رفض</button>' : '') + '</td></tr>';
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
    if (group === 'user') {
      document.getElementById('userRegularContent').style.display = tab === 'regular' ? '' : 'none';
      document.getElementById('userCompanyContent').style.display = tab === 'company' ? '' : 'none';
    }
    if (group === 'ad') {
      if (tab === 'add') {
        document.getElementById('adTabContent').innerHTML = '<div id="adFormContainer">' + this.adForm() + '</div>';
      } else {
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
    return '<div class="table-wrap"><table><thead><tr><th>#</th><th>الصورة</th><th>الاسم</th><th>القسم</th><th>السعر</th><th>وسم</th><th>إظهار</th><th></th></tr></thead><tbody>' + rows + '</tbody></table></div>';
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
        self.logAction('عدل', 'منتج: ' + (prod.name || ''));
      } else {
        self.data.products.push(prod);
        self.logAction('أضاف', 'منتج: ' + (prod.name || ''));
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
    this.logAction(this.data.products[idx].hidden ? 'أخفى' : 'أظهر', 'منتج: ' + (this.data.products[idx].name || ''));
    this.switchTab('product', 'all', document.querySelector('#productTabs .dash-tab:first-child'));
  },

  deleteProduct: function(idx) {
    if (!confirm('حذف المنتج؟')) return;
    this.logAction('حذف', 'منتج: ' + (this.data.products[idx].name || ''));
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

  // ---- Suppliers ----
  render_suppliers: function() {
    return '<div class="card"><div class="card-header"><h3>🚚 إدارة الموردين</h3></div><div class="card-body">' + this.supplierManager() + '</div></div>';
  },

  addSupplier: function(e) {
    e.preventDefault();
    this.data.suppliers.push({ name: document.getElementById('supName').value, phone: document.getElementById('supPhone').value });
    this.saveData();
    document.getElementById('supName').value = '';
    document.getElementById('supPhone').value = '';
    this.renderContent('suppliers');
  },

  deleteSupplier: function(idx) {
    if (!confirm('حذف المورد؟')) return;
    this.data.suppliers.splice(idx, 1);
    this.saveData();
    this.renderContent('suppliers');
  },

  syncProducts: function() {
    localStorage.setItem('bunean-products', JSON.stringify(this.data.products));
    localStorage.setItem('bunean-categories', JSON.stringify(this.data.categories));
    localStorage.setItem('bunean-suppliers', JSON.stringify(this.data.suppliers));
  },

  // ---- Sliders ----
  sliderSections: [
    { id: 'home', name: 'الرئيسية' },
    { id: 'execute', name: 'تنفيذ' },
    { id: 'market', name: 'سوق البناء' },
    { id: 'ads', name: 'إعلانات' },
    { id: 'projects', name: 'المشاريع' }
  ],

  sliderLinkTypes: [
    { id: 'home', name: 'الصفحة الرئيسية' },
    { id: 'market', name: 'سوق البناء' },
    { id: 'execute', name: 'تنفيذ' },
    { id: 'projects', name: 'المشاريع' },
    { id: 'ideas', name: 'أفكار' },
    { id: 'account', name: 'حسابي' }
  ],

  render_sliders: function() {
    var slides = this.data.sliders;
    // Build tabs for each section
    var tabsHtml = '<div class="dash-tabs" id="sliderTabs">';
    for (var si = 0; si < this.sliderSections.length; si++) {
      var sec = this.sliderSections[si];
      var count = slides.filter(function(s){ return (s.section || 'home') === sec.id; }).length;
      tabsHtml += '<div class="dash-tab' + (si === 0 ? ' active' : '') + '" onclick="dashboard.switchSliderTab(\'' + sec.id + '\',this)">'
        + '<span class="material-symbols-outlined" style="font-size:16px;">' + (sec.id === 'home' ? 'home' : sec.id === 'execute' ? 'build' : sec.id === 'market' ? 'store' : sec.id === 'ads' ? 'campaign' : 'construction') + '</span> '
        + sec.name + ' <span class="badge">' + count + '</span></div>';
    }
    tabsHtml += '</div>';

    // Build content for each section
    var contentHtml = '';
    for (var si = 0; si < this.sliderSections.length; si++) {
      var sec = this.sliderSections[si];
      var cards = slides.map(function(s, gi){
        if ((s.section || 'home') !== sec.id) { return ''; }
        var linkText = s.linkUrl || (s.linkTitle || s.link || '-');
        var idx = gi;
        var hidden = s.hidden || false;
        return '<div class="neu-extruded-sm" style="border-radius:14px;padding:16px;display:flex;align-items:center;gap:14px;margin-bottom:10px;">'
          + '<img src="' + (s.image || '') + '" style="width:80px;height:60px;object-fit:cover;border-radius:10px;flex-shrink:0;" onerror="this.style.display=\'none\'">'
          + '<div style="flex:1;min-width:0;">'
          + '<div style="font-size:14px;font-weight:700;color:var(--text-main);">' + (s.title || 'بدون عنوان') + '</div>'
          + '<div style="font-size:12px;color:var(--text-muted);margin-top:2px;">الوجهة: ' + linkText + ' • ترتيب: ' + (s.order || (idx+1)) + '</div>'
          + '</div>'
          + '<div style="display:flex;align-items:center;gap:8px;flex-shrink:0;">'
          + '<div style="display:flex;flex-direction:column;align-items:center;gap:2px;">'
          + '<span class="toggle ' + (hidden ? '' : 'on') + '" onclick="dashboard.toggleSlider(' + idx + ')"><span class="material-symbols-outlined vis-icon">' + (hidden ? 'visibility_off' : 'visibility') + '</span></span>'
          + '<span class="slider-vis-label' + (hidden ? '' : ' on') + '">' + (hidden ? 'مخفي' : 'ظاهر') + '</span>'
          + '</div>'
          + '<button class="btn btn-sm btn-edit" onclick="dashboard.editSlider(' + idx + ')"><span class="material-symbols-outlined" style="font-size:14px;vertical-align:middle;">edit</span></button>'
          + '<button class="btn btn-sm btn-danger" onclick="dashboard.deleteSlider(' + idx + ')"><span class="material-symbols-outlined" style="font-size:14px;vertical-align:middle;">delete</span></button>'
          + '</div></div>';
      }).filter(function(c){ return c !== ''; }).join('') || '<div class="empty-state"><p>لا توجد سلايدرات في هذا القسم</p></div>';
      contentHtml += '<div id="sliderSection_' + sec.id + '" style="' + (si === 0 ? '' : 'display:none;') + '">'
        + '<div class="card" style="margin-top:12px;"><div class="card-body">' + cards + '</div></div>'
        + '<button class="btn btn-gold" onclick="dashboard.showSliderForm(-1,\'' + sec.id + '\')" style="width:100%;"><span class="material-symbols-outlined" style="font-size:16px;">add</span> إضافة سلايدر إلى ' + sec.name + '</button>'
        + '</div>';
    }
    return tabsHtml + contentHtml + this.sliderModal();
  },

  switchSliderTab: function(sectionId, el) {
    document.querySelectorAll('#sliderTabs .dash-tab').forEach(function(t){ t.classList.remove('active'); });
    el.classList.add('active');
    for (var si = 0; si < this.sliderSections.length; si++) {
      var content = document.getElementById('sliderSection_' + this.sliderSections[si].id);
      if (content) content.style.display = this.sliderSections[si].id === sectionId ? '' : 'none';
    }
  },

  showSliderForm: function(idx, presetSection) {
    idx = idx !== undefined ? idx : -1;
    document.getElementById('sliderEditIdx').value = idx;
    document.getElementById('sliderModalTitle').textContent = idx >= 0 ? 'تعديل سلايدر' : 'إضافة سلايدر';
    document.getElementById('sliderImage').value = '';
    document.getElementById('sliderSection').value = presetSection || 'home';
    var preview = document.getElementById('sliderPreview');
    if (idx >= 0) {
      var s = this.data.sliders[idx];
      document.getElementById('sliderTitle').value = s.title || '';
      document.getElementById('sliderLinkUrl').value = s.linkUrl || '';
      document.getElementById('sliderOrder').value = s.order || (idx+1);
      document.getElementById('sliderExistingImage').value = s.image || '';
      preview.innerHTML = s.image ? '<img src="' + s.image + '" style="width:80px;height:60px;object-fit:cover;border-radius:8px;border:1px solid var(--border);">' : '';
    } else {
      document.getElementById('sliderTitle').value = '';
      document.getElementById('sliderLinkUrl').value = '';
      document.getElementById('sliderOrder').value = this.data.sliders.length + 1;
      document.getElementById('sliderExistingImage').value = '';
      preview.innerHTML = '';
    }
    document.getElementById('sliderModal').classList.add('show');
  },

  editSlider: function(idx) { this.showSliderForm(idx); },

  sliderModal: function() {
    return '<div class="modal-overlay" id="sliderModal"><div class="modal-box">'
      + '<h3 id="sliderModalTitle">إضافة سلايدر</h3>'
      + '<form onsubmit="dashboard.saveSlider(event)">'
      + '<div class="form-group"><label>الصورة</label><input class="form-control" id="sliderImage" type="file" accept="image/*"></div>'
      + '<div id="sliderPreview" style="margin-bottom:8px;"></div>'
      + '<div class="form-group"><label>الترتيب</label><input class="form-control" id="sliderOrder" type="number"></div>'
      + '<div class="form-group"><label>العنوان</label><input class="form-control" id="sliderTitle"></div>'
      + '<div class="form-group"><label>رابط الصورة <span style="color:var(--text-muted);font-size:11px;">(اختياري)</span></label><input class="form-control" id="sliderLinkUrl" placeholder="https://..."></div>'
      + '<input type="hidden" id="sliderEditIdx" value="-1">'
      + '<input type="hidden" id="sliderExistingImage" value="">'
      + '<input type="hidden" id="sliderSection" value="">'
      + '<div class="modal-actions">'
      + '<button type="button" class="btn btn-outline" onclick="dashboard.closeModal(\'sliderModal\')">إلغاء</button>'
      + '<button type="submit" class="btn btn-gold">حفظ</button>'
      + '</div>'
      + '</form></div></div>';
  },

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
        linkUrl: document.getElementById('sliderLinkUrl').value,
        order: parseInt(document.getElementById('sliderOrder').value) || 0,
        hidden: false
      };
      if (idx >= 0) {
        slide.hidden = self.data.sliders[idx].hidden || false;
        self.data.sliders[idx] = slide;
        self.logAction('عدل', 'سلايدر: ' + (slide.title || ''));
      } else {
        self.data.sliders.push(slide);
        self.logAction('أضاف', 'سلايدر: ' + (slide.title || ''));
      }
      self.saveData();
      self.syncSliders();
      self.closeModal('sliderModal');
      self.currentSliderTab = document.getElementById('sliderSection').value;
      self.renderContent('sliders');
      self.restoreSliderTab();
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
    this.logAction(this.data.sliders[idx].hidden ? 'أخفى' : 'أظهر', 'سلايدر: ' + (this.data.sliders[idx].title || ''));
    this.currentSliderTab = this.getCurrentSliderTab();
    this.renderContent('sliders');
    this.restoreSliderTab();
  },

  deleteSlider: function(idx) {
    if (!confirm('حذف السلايدر؟')) return;
    this.logAction('حذف', 'سلايدر: ' + (this.data.sliders[idx].title || ''));
    this.data.sliders.splice(idx, 1);
    this.saveData();
    this.syncSliders();
    this.currentSliderTab = this.getCurrentSliderTab();
    this.renderContent('sliders');
    this.restoreSliderTab();
  },

  getCurrentSliderTab: function() {
    var active = document.querySelector('#sliderTabs .dash-tab.active');
    if (active) {
      var onclick = active.getAttribute('onclick');
      var match = onclick && onclick.match(/switchSliderTab\('([^']+)'/);
      if (match) return match[1];
    }
    return 'home';
  },

  restoreSliderTab: function() {
    var self = this;
    if (this.currentSliderTab) {
      var tabs = document.querySelectorAll('#sliderTabs .dash-tab');
      tabs.forEach(function(t){
        var onclick = t.getAttribute('onclick');
        var match = onclick && onclick.match(/switchSliderTab\('([^']+)'/);
        if (match && match[1] === self.currentSliderTab) {
          self.switchSliderTab(self.currentSliderTab, t);
        }
      });
    }
  },

  syncSliders: function() {
    localStorage.setItem('bunean-sliders', JSON.stringify(this.data.sliders));
  },

  closeModal: function(id) {
    document.getElementById(id).classList.remove('show');
  },

  sectionTabs: [
    { id: 'home', name: 'الرئيسية', icon: 'home' },
    { id: 'execute', name: 'تنفيذ', icon: 'build' },
    { id: 'market', name: 'سوق البناء', icon: 'store' },
    { id: 'ideas', name: 'أفكار', icon: 'lightbulb' }
  ],

  homeSectionDefaults: [
    'بناء منزل', 'تصميم داخلي', 'تشطيب', 'شراء مواد', 'استشارات'
  ],

  initHomeSections: function() {
    var existing = this.data.appSections.filter(function(s){ return s.sectionType === 'home'; });
    if (existing.length === 0) {
      for (var i = 0; i < this.homeSectionDefaults.length; i++) {
        this.data.appSections.push({
          sectionType: 'home',
          name: this.homeSectionDefaults[i],
          image: '',
          icon: ['home_work', 'design_services', 'brush', 'shopping_cart', 'support'][i] || 'category',
          hidden: false,
          fixed: true
        });
      }
      this.saveData();
    }
  },

  render_appSections: function() {
    var allSections = this.data.appSections;
    // Tabs
    var tabsHtml = '<div class="dash-tabs" id="sectionTabs">';
    for (var si = 0; si < this.sectionTabs.length; si++) {
      var st = this.sectionTabs[si];
      var count = allSections.filter(function(s){ return s.sectionType === st.id; }).length;
      tabsHtml += '<div class="dash-tab' + (si === 0 ? ' active' : '') + '" onclick="dashboard.switchSectionTab(\'' + st.id + '\',this)">'
        + '<span class="material-symbols-outlined" style="font-size:16px;">' + st.icon + '</span> '
        + st.name + ' <span class="badge">' + count + '</span></div>';
    }
    tabsHtml += '</div>';

    // Content for each tab
    var contentHtml = '';
    for (var si = 0; si < this.sectionTabs.length; si++) {
      var st = this.sectionTabs[si];
      var filtered = allSections.filter(function(s){ return s.sectionType === st.id; });
      var isHome = st.id === 'home';
      var cards = filtered.map(function(s, i){
        var idx = allSections.indexOf(s);
        var hidden = s.hidden || false;
        return '<div class="neu-extruded-sm" style="border-radius:14px;padding:16px;display:flex;align-items:center;gap:14px;margin-bottom:10px;">'
          + '<div class="stat-icon-wrap" style="margin:0;"><div class="stat-icon gold" style="width:50px;height:50px;"><span class="material-symbols-outlined" style="font-size:22px;">' + (s.icon || 'category') + '</span></div></div>'
          + '<div style="flex:1;min-width:0;">'
          + '<div style="font-size:15px;font-weight:700;color:var(--text-main);">' + (s.name || 'بدون اسم') + '</div>'
          + (s.fixed ? '<div style="font-size:11px;color:var(--text-muted);">قسم رئيسي</div>' : '')
          + '</div>'
          + '<div style="display:flex;align-items:center;gap:8px;flex-shrink:0;">'
          + '<div style="display:flex;flex-direction:column;align-items:center;gap:2px;">'
          + '<span class="toggle ' + (hidden ? '' : 'on') + '" onclick="dashboard.toggleAppSection(' + idx + ')"><span class="material-symbols-outlined vis-icon">' + (hidden ? 'visibility_off' : 'visibility') + '</span></span>'
          + '<span class="slider-vis-label' + (hidden ? '' : ' on') + '">' + (hidden ? 'مخفي' : 'ظاهر') + '</span>'
          + '</div>'
          + (isHome
            ? '<button class="btn btn-sm btn-edit" onclick="dashboard.editAppSection(' + idx + ')"><span class="material-symbols-outlined" style="font-size:14px;vertical-align:middle;">edit</span></button>'
            : '<button class="btn btn-sm btn-edit" onclick="dashboard.editAppSection(' + idx + ')"><span class="material-symbols-outlined" style="font-size:14px;vertical-align:middle;">edit</span></button>'
            + '<button class="btn btn-sm btn-danger" onclick="dashboard.deleteAppSection(' + idx + ')"><span class="material-symbols-outlined" style="font-size:14px;vertical-align:middle;">delete</span></button>')
          + '</div></div>';
      }).join('') || '<div class="empty-state"><p>لا توجد أقسام في هذا التبويب</p></div>';
      contentHtml += '<div id="sectionTabContent_' + st.id + '" style="' + (si === 0 ? '' : 'display:none;') + '">'
        + '<div class="card" style="margin-top:12px;"><div class="card-body">' + cards + '</div></div>'
        + (isHome ? '' : '<button class="btn btn-gold" onclick="dashboard.showAppSectionForm(-1,\'' + st.id + '\')" style="width:100%;margin-top:10px;"><span class="material-symbols-outlined" style="font-size:16px;">add</span> إضافة قسم إلى ' + st.name + '</button>')
        + '</div>';
    }
    return tabsHtml + contentHtml + this.appSectionModal();
  },

  switchSectionTab: function(tabId, el) {
    document.querySelectorAll('#sectionTabs .dash-tab').forEach(function(t){ t.classList.remove('active'); });
    el.classList.add('active');
    for (var si = 0; si < this.sectionTabs.length; si++) {
      var content = document.getElementById('sectionTabContent_' + this.sectionTabs[si].id);
      if (content) content.style.display = this.sectionTabs[si].id === tabId ? '' : 'none';
    }
  },

  appSectionModal: function() {
    return '<div class="modal-overlay" id="appSectionModal"><div class="modal-box">'
      + '<h3 id="appSectionModalTitle">إضافة قسم</h3>'
      + '<form onsubmit="dashboard.saveAppSection(event)">'
      + '<div class="form-group"><label>اسم القسم</label><input class="form-control" id="appSectionName" required></div>'
      + '<div class="form-group" id="appSectionImageGroup"><label>صورة القسم</label><input class="form-control" id="appSectionImage" type="file" accept="image/*"></div>'
      + '<div id="appSectionPreview" style="margin-bottom:8px;"></div>'
      + '<input type="hidden" id="appSectionEditIdx" value="-1">'
      + '<input type="hidden" id="appSectionType" value="">'
      + '<input type="hidden" id="appSectionExistingImage" value="">'
      + '<input type="hidden" id="appSectionFixed" value="">'
      + '<div class="modal-actions">'
      + '<button type="button" class="btn btn-outline" onclick="dashboard.closeModal(\'appSectionModal\')">إلغاء</button>'
      + '<button type="submit" class="btn btn-gold">حفظ</button>'
      + '</div>'
      + '</form></div></div>';
  },

  showAppSectionForm: function(idx, presetType) {
    idx = idx !== undefined ? idx : -1;
    document.getElementById('appSectionEditIdx').value = idx;
    document.getElementById('appSectionModalTitle').textContent = idx >= 0 ? 'تعديل قسم' : 'إضافة قسم';
    document.getElementById('appSectionImage').value = '';
    document.getElementById('appSectionType').value = presetType || 'execute';
    var preview = document.getElementById('appSectionPreview');
    var fixed = false;
    if (idx >= 0) {
      var s = this.data.appSections[idx];
      document.getElementById('appSectionName').value = s.name || '';
      document.getElementById('appSectionExistingImage').value = s.image || '';
      document.getElementById('appSectionFixed').value = s.fixed ? 'true' : '';
      fixed = s.fixed || false;
      preview.innerHTML = s.image ? '<img src="' + s.image + '" style="width:80px;height:80px;object-fit:cover;border-radius:8px;border:1px solid var(--border);">' : '';
    } else {
      document.getElementById('appSectionName').value = '';
      document.getElementById('appSectionExistingImage').value = '';
      document.getElementById('appSectionFixed').value = '';
      preview.innerHTML = '';
    }
    // Hide image upload for fixed home sections
    var imgGroup = document.getElementById('appSectionImageGroup');
    if (imgGroup) imgGroup.style.display = fixed ? 'none' : '';
    document.getElementById('appSectionModal').classList.add('show');
  },

  editAppSection: function(idx) { this.showAppSectionForm(idx, this.data.appSections[idx].sectionType); },

  saveAppSection: function(e) {
    e.preventDefault();
    var self = this;
    var idx = parseInt(document.getElementById('appSectionEditIdx').value);
    var fileInput = document.getElementById('appSectionImage');
    var existingImage = document.getElementById('appSectionExistingImage').value;

    function saveSection(base64Image) {
      var item = {
        sectionType: document.getElementById('appSectionType').value,
        name: document.getElementById('appSectionName').value,
        image: base64Image || existingImage || '',
        hidden: false
      };
      if (idx >= 0) {
        item.hidden = self.data.appSections[idx].hidden || false;
        item.fixed = self.data.appSections[idx].fixed || false;
        item.icon = self.data.appSections[idx].icon || '';
        self.data.appSections[idx] = item;
        self.logAction('عدل', 'قسم: ' + (item.name || ''));
      } else {
        self.data.appSections.push(item);
        self.logAction('أضاف', 'قسم: ' + (item.name || ''));
      }
      self.saveData();
      self.closeModal('appSectionModal');
      self.currentSectionTab = document.getElementById('appSectionType').value || 'home';
      self.renderContent('appSections');
      self.restoreSectionTab();
    }

    if (fileInput.files && fileInput.files[0]) {
      this.fileToBase64(fileInput.files[0], function(b64) { saveSection(b64); });
    } else {
      saveSection(null);
    }
  },

  toggleAppSection: function(idx) {
    this.data.appSections[idx].hidden = !this.data.appSections[idx].hidden;
    this.saveData();
    this.logAction(this.data.appSections[idx].hidden ? 'أخفى' : 'أظهر', 'قسم: ' + (this.data.appSections[idx].name || ''));
    this.currentSectionTab = this.getCurrentSectionTab();
    this.renderContent('appSections');
    this.restoreSectionTab();
  },

  deleteAppSection: function(idx) {
    if (this.data.appSections[idx].fixed) return;
    if (!confirm('حذف هذا القسم؟')) return;
    this.logAction('حذف', 'قسم: ' + (this.data.appSections[idx].name || ''));
    this.data.appSections.splice(idx, 1);
    this.saveData();
    this.currentSectionTab = this.getCurrentSectionTab();
    this.renderContent('appSections');
    this.restoreSectionTab();
  },

  getCurrentSectionTab: function() {
    var active = document.querySelector('#sectionTabs .dash-tab.active');
    if (active) {
      var onclick = active.getAttribute('onclick');
      var match = onclick && onclick.match(/switchSectionTab\('([^']+)'/);
      if (match) return match[1];
    }
    return 'home';
  },

  restoreSectionTab: function() {
    var self = this;
    if (this.currentSectionTab) {
      var tabs = document.querySelectorAll('#sectionTabs .dash-tab');
      tabs.forEach(function(t){
        var onclick = t.getAttribute('onclick');
        var match = onclick && onclick.match(/switchSectionTab\('([^']+)'/);
        if (match && match[1] === self.currentSectionTab) {
          self.switchSectionTab(self.currentSectionTab, t);
        }
      });
    }
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
    var l = this.data.socialLinks;
    var privacy = JSON.parse(localStorage.getItem('bunean-privacy-content') || '{}');
    var tabsHtml = '<div class="dash-tabs" id="settingsTabs">'
      + '<div class="dash-tab active" onclick="dashboard.switchSettingsTab(\'social\',this)"><span class="material-symbols-outlined" style="font-size:16px;">share</span> روابط التواصل</div>'
      + '<div class="dash-tab" onclick="dashboard.switchSettingsTab(\'privacy\',this)"><span class="material-symbols-outlined" style="font-size:16px;">description</span> الشروط والخصوصية</div>'
      + '<div class="dash-tab" onclick="dashboard.switchSettingsTab(\'finishing\',this)"><span class="material-symbols-outlined" style="font-size:16px;">palette</span> التعبئة</div>'
      + '</div>';
    var socialContent = '<div id="settingsSocialContent"><div class="card" style="margin-bottom:12px;"><div class="card-body">'
      + '<div style="display:flex;align-items:center;gap:12px;margin-bottom:8px;"><div class="stat-icon blue" style="width:42px;height:42px;font-size:20px;"><span class="material-symbols-outlined" style="font-size:20px;">chat</span></div><div style="flex:1;"><label style="font-size:13px;font-weight:700;color:var(--text-main);">واتساب</label><input class="form-control" id="socialWhatsapp" value="' + (l.whatsapp || '') + '" placeholder="https://wa.me/..." style="margin-top:6px;"></div><button class="btn btn-gold" onclick="dashboard.saveSingleSocial(\'whatsapp\')">حفظ التعديلات</button></div>'
      + '<div style="display:flex;align-items:center;gap:12px;margin-bottom:8px;"><div class="stat-icon blue" style="width:42px;height:42px;font-size:20px;"><span class="material-symbols-outlined" style="font-size:20px;">thumb_up</span></div><div style="flex:1;"><label style="font-size:13px;font-weight:700;color:var(--text-main);">فيسبوك</label><input class="form-control" id="socialFacebook" value="' + (l.facebook || '') + '" placeholder="https://facebook.com/..." style="margin-top:6px;"></div><button class="btn btn-gold" onclick="dashboard.saveSingleSocial(\'facebook\')">حفظ التعديلات</button></div>'
      + '<div style="display:flex;align-items:center;gap:12px;margin-bottom:8px;"><div class="stat-icon blue" style="width:42px;height:42px;font-size:20px;"><span class="material-symbols-outlined" style="font-size:20px;">camera_alt</span></div><div style="flex:1;"><label style="font-size:13px;font-weight:700;color:var(--text-main);">انستغرام</label><input class="form-control" id="socialInstagram" value="' + (l.instagram || '') + '" placeholder="https://instagram.com/..." style="margin-top:6px;"></div><button class="btn btn-gold" onclick="dashboard.saveSingleSocial(\'instagram\')">حفظ التعديلات</button></div>'
      + '<div style="display:flex;align-items:center;gap:12px;"><div class="stat-icon blue" style="width:42px;height:42px;font-size:20px;"><span class="material-symbols-outlined" style="font-size:20px;">music_note</span></div><div style="flex:1;"><label style="font-size:13px;font-weight:700;color:var(--text-main);">تيك توك</label><input class="form-control" id="socialTiktok" value="' + (l.tiktok || '') + '" placeholder="https://tiktok.com/..." style="margin-top:6px;"></div><button class="btn btn-gold" onclick="dashboard.saveSingleSocial(\'tiktok\')">حفظ التعديلات</button></div>'
      + '</div></div></div>';
    var privacyContent = '<div id="settingsPrivacyContent" style="display:none;">'
      + '<div class="card" style="margin-bottom:12px;"><div class="card-body">'
      + '<div style="display:flex;align-items:flex-start;gap:12px;margin-bottom:8px;"><div class="stat-icon gold" style="width:42px;height:42px;font-size:20px;flex-shrink:0;"><span class="material-symbols-outlined" style="font-size:20px;">privacy_tip</span></div><div style="flex:1;"><label style="font-size:13px;font-weight:700;color:var(--text-main);display:block;margin-bottom:6px;">سياسة الخصوصية (HTML)</label><textarea class="form-control" id="privacyText" rows="6">' + (privacy.privacy || '') + '</textarea></div><button class="btn btn-gold" onclick="dashboard.saveSinglePrivacy(\'privacy\')" style="margin-top:28px;flex-shrink:0;">حفظ التعديلات</button></div>'
      + '</div></div>'
      + '<div class="card"><div class="card-body">'
      + '<div style="display:flex;align-items:flex-start;gap:12px;"><div class="stat-icon gold" style="width:42px;height:42px;font-size:20px;flex-shrink:0;"><span class="material-symbols-outlined" style="font-size:20px;">gavel</span></div><div style="flex:1;"><label style="font-size:13px;font-weight:700;color:var(--text-main);display:block;margin-bottom:6px;">الشروط والأحكام (HTML)</label><textarea class="form-control" id="termsText" rows="6">' + (privacy.terms || '') + '</textarea></div><button class="btn btn-gold" onclick="dashboard.saveSinglePrivacy(\'terms\')" style="margin-top:28px;flex-shrink:0;">حفظ التعديلات</button></div>'
      + '</div></div></div>';
    var finishOpts = JSON.parse(localStorage.getItem('bunean-finishing-options') || '[]');
    var finishRows = finishOpts.map(function(f, i){
      var typeIcon = f.type === 'ألوان' ? 'palette' : f.type === 'حجم' ? 'straighten' : 'handyman';
      return '<tr><td>' + (i+1) + '</td><td><span class="material-symbols-outlined" style="font-size:16px;vertical-align:middle;margin-left:4px;color:var(--accent-gold);">' + typeIcon + '</span>' + f.name + '</td><td>' + f.type + '</td><td><button class="btn btn-sm btn-danger" onclick="dashboard.deleteFinishing(' + i + ')"><span class="material-symbols-outlined" style="font-size:14px;vertical-align:middle;">delete</span></button></td></tr>';
    }).join('');
    var finishingContent = '<div id="settingsFinishingContent" style="display:none;">'
      + '<div class="card" style="margin-bottom:12px;"><div class="card-header"><h3><span class="material-symbols-outlined" style="font-size:18px;vertical-align:middle;margin-left:6px;">palette</span>إضافة خيار تعبئة</h3></div><div class="card-body">'
      + '<form onsubmit="dashboard.addFinishing(event)">'
      + '<div class="form-group"><label>اسم التعبئة</label><input class="form-control" id="finishName" required placeholder="مثال: أبيض، صغير، عادي"></div>'
      + '<div class="form-group"><label>النوع</label><select class="form-control" id="finishType" required>'
      + '<option value="">اختر النوع...</option><option value="ألوان">ألوان</option><option value="حجم">حجم</option><option value="نوع التشطيب">نوع التشطيب</option>'
      + '</select></div>'
      + '<button type="submit" class="btn btn-gold"><span class="material-symbols-outlined" style="font-size:16px;">add</span> إضافة</button>'
      + '</form></div></div>'
      + '<div class="card"><div class="card-header"><h3><span class="material-symbols-outlined" style="font-size:18px;vertical-align:middle;margin-left:6px;">list</span>خيارات التعبئة</h3></div><div class="card-body"><div class="table-wrap"><table><thead><tr><th>#</th><th>الاسم</th><th>النوع</th><th></th></tr></thead><tbody>'
      + (finishRows || '<tr><td colspan="4"><div class="empty-state"><p>لا توجد خيارات تعبئة</p></div></td></tr>')
      + '</tbody></table></div></div></div></div>';
    return tabsHtml + socialContent + privacyContent + finishingContent;
  },

  selectDesign: function() {},
  addFinishing: function(e) {
    e.preventDefault();
    var opts = JSON.parse(localStorage.getItem('bunean-finishing-options') || '[]');
    opts.push({ name: document.getElementById('finishName').value, type: document.getElementById('finishType').value });
    localStorage.setItem('bunean-finishing-options', JSON.stringify(opts));
    document.getElementById('finishName').value = '';
    document.getElementById('finishType').value = '';
    this.renderContent('settings');
  },

  deleteFinishing: function(idx) {
    if (!confirm('حذف هذا الخيار؟')) return;
    var opts = JSON.parse(localStorage.getItem('bunean-finishing-options') || '[]');
    opts.splice(idx, 1);
    localStorage.setItem('bunean-finishing-options', JSON.stringify(opts));
    this.renderContent('settings');
  },

  switchSettingsTab: function(tab, el) {
    document.querySelectorAll('#settingsTabs .dash-tab').forEach(function(t){ t.classList.remove('active'); });
    el.classList.add('active');
    document.getElementById('settingsSocialContent').style.display = tab === 'social' ? '' : 'none';
    document.getElementById('settingsPrivacyContent').style.display = tab === 'privacy' ? '' : 'none';
    var fc = document.getElementById('settingsFinishingContent');
    if (fc) fc.style.display = tab === 'finishing' ? '' : 'none';
  },

  saveSingleSocial: function(key) {
    var map = { whatsapp: 'socialWhatsapp', facebook: 'socialFacebook', instagram: 'socialInstagram', tiktok: 'socialTiktok' };
    var val = document.getElementById(map[key]).value;
    this.data.socialLinks[key] = val;
    this.saveData();
    this.syncSocial();
    var btn = event.target;
    var orig = btn.textContent;
    btn.textContent = '✅ تم الحفظ';
    btn.style.opacity = '0.8';
    setTimeout(function(){ btn.textContent = orig; btn.style.opacity = '1'; }, 1500);
  },

  saveSinglePrivacy: function(key) {
    var map = { privacy: 'privacyText', terms: 'termsText' };
    var val = document.getElementById(map[key]).value;
    var content = JSON.parse(localStorage.getItem('bunean-privacy-content') || '{}');
    content[key] = val;
    localStorage.setItem('bunean-privacy-content', JSON.stringify(content));
    var btn = event.target;
    var orig = btn.textContent;
    btn.textContent = '✅ تم الحفظ';
    btn.style.opacity = '0.8';
    setTimeout(function(){ btn.textContent = orig; btn.style.opacity = '1'; }, 1500);
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
      + '<div class="dash-tab" onclick="dashboard.switchTab(\'ad\',\'add\',this)"><span class="material-symbols-outlined" style="font-size:16px;">add_circle</span> إضافة إعلان</div>'
      + '<div class="dash-tab active" onclick="dashboard.switchTab(\'ad\',\'pending\',this)"><span class="material-symbols-outlined" style="font-size:16px;">pending</span> قيد المراجعة' + (pending.length ? ' <span class="badge">' + pending.length + '</span>' : '') + '</div>'
      + '<div class="dash-tab" onclick="dashboard.switchTab(\'ad\',\'approved\',this)"><span class="material-symbols-outlined" style="font-size:16px;">check_circle</span> منشور</div>'
      + '<div class="dash-tab" onclick="dashboard.switchTab(\'ad\',\'rejected\',this)"><span class="material-symbols-outlined" style="font-size:16px;">cancel</span> مرفوض</div>'
      + '</div>'
      + '<div class="card"><div class="card-body" id="adTabContent">'
      + this.adTable(pending, 'pending')
      + '</div></div>'
      + this.adModal();
  },

  adTable: function(list, status) {
    if (status === 'add') {
      return '<div id="adFormContainer">' + this.adForm() + '</div>';
    }
    if (!list.length) return '<div class="empty-state"><p>لا توجد إعلانات</p></div>';
    var rows = '';
    for (var i = 0; i < list.length; i++) {
      var a = list[i];
      var img = a.images && a.images[0] ? '<img src="' + a.images[0] + '" style="width:50px;height:40px;object-fit:cover;border-radius:6px;" onerror="this.style.display=\'none\'">' : (a.image ? '<img src="' + a.image + '" style="width:50px;height:40px;object-fit:cover;border-radius:6px;" onerror="this.style.display=\'none\'">' : '-');
      rows += '<tr><td>' + (i+1) + '</td><td>' + img + '</td><td>' + (a.title || '-') + '</td><td><a href="../company.html?id=' + encodeURIComponent(a.company || '') + '" target="_blank" style="color:var(--accent-gold);text-decoration:none;font-weight:600;font-size:13px;">' + (a.company || '-') + '</a></td><td>' + (a.date || '-') + '</td>'
        + '<td><span class="status ' + (a.status === 'approved' ? 'approved' : a.status === 'rejected' ? 'rejected' : 'pending') + '">'
        + (a.status === 'approved' ? 'منشور' : a.status === 'rejected' ? 'مرفوض' : 'قيد المراجعة') + '</span></td>'
        + '<td><button class="btn btn-sm btn-outline" onclick="dashboard.viewAd(' + i + ')"><span class="material-symbols-outlined" style="font-size:14px;vertical-align:middle;">visibility</span></button>'
        + '<button class="btn btn-sm btn-edit" onclick="dashboard.editAd(' + i + ')"><span class="material-symbols-outlined" style="font-size:14px;vertical-align:middle;">edit</span></button>'
        + (status === 'pending' ? '<button class="btn btn-sm btn-success" onclick="dashboard.approveAd(' + i + ')"><span class="material-symbols-outlined" style="font-size:14px;vertical-align:middle;">check</span></button> <button class="btn btn-sm btn-danger" onclick="dashboard.rejectAd(' + i + ')"><span class="material-symbols-outlined" style="font-size:14px;vertical-align:middle;">close</span></button>' : '')
        + '<button class="btn btn-sm btn-danger" onclick="dashboard.deleteAd(' + i + ')"><span class="material-symbols-outlined" style="font-size:14px;vertical-align:middle;">delete</span></button>'
        + '</td></tr>';
    }
    return '<div class="table-wrap"><table><thead><tr><th>#</th><th>الصورة</th><th>العنوان</th><th>الشركة</th><th>التاريخ</th><th>الحالة</th><th></th></tr></thead><tbody>' + rows + '</tbody></table></div>';
  },

  adForm: function(ad) {
    ad = ad || {};
    var imgsPreview = '';
    if (ad.images && ad.images.length) {
      imgsPreview = ad.images.map(function(url){ return '<img src="' + url + '" style="width:60px;height:60px;object-fit:cover;border-radius:8px;border:1px solid var(--border);">'; }).join(' ');
    } else if (ad.image) {
      imgsPreview = '<img src="' + ad.image + '" style="width:60px;height:60px;object-fit:cover;border-radius:8px;border:1px solid var(--border);">';
    }
    var materialsHtml = '';
    if (ad.materials && ad.materials.length) {
      materialsHtml = ad.materials.map(function(m, mi){
        return '<div style="display:flex;gap:6px;margin-bottom:6px;align-items:center;"><input class="form-control" id="adMatName_' + mi + '" value="' + (m.name || '') + '" placeholder="اسم المادة" style="flex:1;"><input class="form-control" id="adMatImg_' + mi + '" value="' + (m.image || '') + '" placeholder="رابط الصورة" style="flex:1;"><button type="button" class="btn btn-sm btn-danger" onclick="dashboard.removeAdMaterial(' + mi + ')">✕</button></div>';
      }).join('');
    }
    // Build company options from registered companies
    var companyOpts = '<option value="">اختر الشركة...</option>';
    var seen = {};
    // From users with role 'company'
    for (var ci = 0; ci < this.data.users.length; ci++) {
      var u = this.data.users[ci];
      if (u.role === 'company' && u.name && !seen[u.name]) {
        seen[u.name] = true;
        companyOpts += '<option value="' + u.name + '"' + (ad.company === u.name ? ' selected' : '') + '>' + u.name + '</option>';
      }
    }
    // Also check companies array
    for (var ci = 0; ci < this.data.companies.length; ci++) {
      var c = this.data.companies[ci];
      var cname = c.name || c.companyName;
      if (cname && !seen[cname]) {
        seen[cname] = true;
        companyOpts += '<option value="' + cname + '"' + (ad.company === cname ? ' selected' : '') + '>' + cname + '</option>';
      }
    }
    return '<form onsubmit="dashboard.saveAd(event)" id="adForm">'
      + '<div class="form-row"><div class="form-group"><label>عنوان الإعلان</label><input class="form-control" id="adTitle" value="' + (ad.title || '') + '" required></div>'
      + '<div class="form-group"><label>نوع الإعلان</label><select class="form-control" id="adType"><option value="مشروع"' + (ad.type === 'مشروع' ? ' selected' : '') + '>مشروع</option><option value="عرض خاص"' + (ad.type === 'عرض خاص' ? ' selected' : '') + '>عرض خاص</option><option value="تخفيض"' + (ad.type === 'تخفيض' ? ' selected' : '') + '>تخفيض</option></select></div></div>'
      + '<div class="form-group"><label>الوصف</label><textarea class="form-control" id="adDesc" rows="4">' + (ad.desc || '') + '</textarea></div>'
      + '<div class="form-row"><div class="form-group"><label>الموقع</label><input class="form-control" id="adLocation" value="' + (ad.location || '') + '"></div>'
      + '<div class="form-group"><label>المساحة</label><input class="form-control" id="adArea" value="' + (ad.area || '') + '"></div></div>'
      + '<div class="form-row"><div class="form-group"><label>تاريخ التسليم</label><input class="form-control" id="adDeliveryDate" value="' + (ad.deliveryDate || '') + '"></div>'
      + '<div class="form-group"><label>الشركة المنفذة</label><select class="form-control" id="adCompany" required>' + companyOpts + '</select></div></div>'
      + '<div class="form-group"><label>صور الإعلان <span style="color:var(--text-muted);font-size:11px;">(اختياري، يمكن رفع عدة صور)</span></label><input class="form-control" id="adImages" type="file" accept="image/*" multiple></div>'
      + '<div id="adImagesPreview" style="display:flex;flex-wrap:wrap;gap:6px;margin-bottom:8px;">' + imgsPreview + '</div>'
      + '<div class="form-group"><label>المواد المستخدمة</label><div id="adMaterialsList">' + (materialsHtml || '') + '</div>'
      + '<button type="button" class="btn btn-sm btn-outline" onclick="dashboard.addAdMaterial()" style="margin-top:4px;"><span class="material-symbols-outlined" style="font-size:14px;vertical-align:middle;">add</span> إضافة مادة</button></div>'
      + '<input type="hidden" id="adEditIdx" value="' + (ad._idx !== undefined ? ad._idx : '-1') + '">'
      + '<input type="hidden" id="adExistingImages" value="' + (ad.images ? JSON.stringify(ad.images).replace(/"/g, '&quot;') : (ad.image ? JSON.stringify([ad.image]).replace(/"/g, '&quot;') : '')) + '">'
      + '<button type="submit" class="btn btn-gold"><span class="material-symbols-outlined" style="font-size:16px;">save</span> ' + (ad._idx !== undefined ? 'حفظ التعديلات' : 'نشر الإعلان') + '</button>'
      + '</form>';
  },

  addAdMaterial: function() {
    var list = document.getElementById('adMaterialsList');
    var idx = list.children.length;
    var div = document.createElement('div');
    div.style.cssText = 'display:flex;gap:6px;margin-bottom:6px;align-items:center;';
    div.innerHTML = '<input class="form-control" id="adMatName_' + idx + '" placeholder="اسم المادة" style="flex:1;"><input class="form-control" id="adMatImg_' + idx + '" placeholder="رابط الصورة" style="flex:1;"><button type="button" class="btn btn-sm btn-danger" onclick="this.parentElement.remove()">✕</button>';
    list.appendChild(div);
  },

  removeAdMaterial: function(idx) {
    var el = document.getElementById('adMatName_' + idx);
    if (el && el.parentElement) el.parentElement.remove();
  },

  saveAd: function(e) {
    e.preventDefault();
    var self = this;
    var idx = parseInt(document.getElementById('adEditIdx').value);
    var fileInput = document.getElementById('adImages');
    var existingImages = document.getElementById('adExistingImages').value;
    var existing = existingImages ? JSON.parse(existingImages) : [];

    function saveAdWithImages(images) {
      // Collect materials
      var materials = [];
      var matList = document.getElementById('adMaterialsList');
      if (matList) {
        for (var mi = 0; mi < matList.children.length; mi++) {
          var nameEl = document.getElementById('adMatName_' + mi);
          var imgEl = document.getElementById('adMatImg_' + mi);
          if (nameEl) {
            materials.push({ name: nameEl.value || '', image: imgEl ? imgEl.value : '' });
          }
        }
      }
      var ad = {
        title: document.getElementById('adTitle').value,
        type: document.getElementById('adType').value,
        desc: document.getElementById('adDesc').value,
        location: document.getElementById('adLocation').value,
        area: document.getElementById('adArea').value,
        deliveryDate: document.getElementById('adDeliveryDate').value,
        company: document.getElementById('adCompany').value,
        images: images.length ? images : existing,
        materials: materials,
        date: new Date().toLocaleDateString('ar-IQ'),
        status: 'pending'
      };
      if (idx >= 0) {
        ad.status = self.data.ads[idx].status || 'pending';
        self.data.ads[idx] = ad;
        self.logAction('عدل', 'إعلان: ' + (ad.title || ''));
      } else {
        self.data.ads.push(ad);
        self.logAction('أضاف', 'إعلان: ' + (ad.title || ''));
      }
      self.saveData();
      self.syncAds();
      self.switchTab('ad', 'pending', document.querySelector('#adTabs .dash-tab:nth-child(2)'));
    }

    if (fileInput.files && fileInput.files.length > 0) {
      var loaded = 0, total = fileInput.files.length, results = [];
      for (var fi = 0; fi < total; fi++) {
        this.fileToBase64(fileInput.files[fi], function(b64) {
          results.push(b64);
          loaded++;
          if (loaded === total) saveAdWithImages(results);
        });
      }
    } else {
      saveAdWithImages([]);
    }
  },

  viewAd: function(idx) {
    var a = this.data.ads[idx];
    if (!a) return;
    var imgs = a.images && a.images.length ? a.images : (a.image ? [a.image] : []);
    var imgsHtml = imgs.length ? imgs.map(function(url){ return '<img src="' + url + '" style="width:100%;max-height:200px;object-fit:cover;border-radius:10px;margin-bottom:6px;">'; }).join('') : '<div style="text-align:center;padding:20px;color:var(--text-muted);">لا توجد صور</div>';
    var materialsHtml = '';
    if (a.materials && a.materials.length) {
      materialsHtml = a.materials.map(function(m){ return '<div style="display:flex;align-items:center;gap:8px;padding:8px;background:var(--bg-color);border-radius:8px;box-shadow:inset 2px 2px 4px var(--shadow-dark), inset -2px -2px 4px var(--shadow-light);"><span class="material-symbols-outlined" style="font-size:18px;color:var(--accent-gold);">inventory_2</span>' + (m.name || '-') + '</div>'; }).join('');
    }
    var metaRows = '';
    if (a.location) metaRows += '<div style="display:flex;align-items:center;gap:8px;padding:8px;background:var(--bg-color);border-radius:8px;box-shadow:inset 2px 2px 4px var(--shadow-dark), inset -2px -2px 4px var(--shadow-light);"><span class="material-symbols-outlined" style="font-size:18px;color:var(--accent-gold);">location_on</span><div><div style="font-size:11px;color:var(--text-muted);">الموقع</div><div style="font-size:13px;">' + a.location + '</div></div></div>';
    if (a.area) metaRows += '<div style="display:flex;align-items:center;gap:8px;padding:8px;background:var(--bg-color);border-radius:8px;box-shadow:inset 2px 2px 4px var(--shadow-dark), inset -2px -2px 4px var(--shadow-light);"><span class="material-symbols-outlined" style="font-size:18px;color:var(--accent-gold);">straighten</span><div><div style="font-size:11px;color:var(--text-muted);">المساحة</div><div style="font-size:13px;">' + a.area + '</div></div></div>';
    if (a.deliveryDate) metaRows += '<div style="display:flex;align-items:center;gap:8px;padding:8px;background:var(--bg-color);border-radius:8px;box-shadow:inset 2px 2px 4px var(--shadow-dark), inset -2px -2px 4px var(--shadow-light);"><span class="material-symbols-outlined" style="font-size:18px;color:var(--accent-gold);">calendar_month</span><div><div style="font-size:11px;color:var(--text-muted);">تاريخ التسليم</div><div style="font-size:13px;">' + a.deliveryDate + '</div></div></div>';

    document.getElementById('adModalContent').innerHTML = '<div style="max-height:70vh;overflow-y:auto;padding:4px;">'
      + imgsHtml
      + '<div style="display:flex;align-items:center;gap:10px;margin-bottom:12px;"><div class="stat-icon gold" style="width:40px;height:40px;font-size:18px;"><span class="material-symbols-outlined" style="font-size:18px;">campaign</span></div><div style="flex:1;"><div style="font-size:16px;font-weight:700;color:var(--text-main);">' + (a.title || '-') + '</div><div style="font-size:12px;color:var(--text-muted);"><a href="../company.html?id=' + encodeURIComponent(a.company || '') + '" target="_blank" style="color:var(--accent-gold);text-decoration:none;font-weight:700;">' + (a.company || '-') + '</a> • ' + (a.type || '-') + ' • ' + (a.date || '-') + '</div></div></div>'
      + '<div style="display:grid;grid-template-columns:1fr 1fr;gap:6px;margin-bottom:12px;">' + metaRows + '</div>'
      + (a.desc ? '<div style="padding:10px;background:var(--bg-color);border-radius:8px;box-shadow:inset 2px 2px 4px var(--shadow-dark), inset -2px -2px 4px var(--shadow-light);margin-bottom:12px;font-size:13px;line-height:1.7;">' + a.desc + '</div>' : '')
      + (materialsHtml ? '<div><div style="font-size:12px;font-weight:700;color:var(--text-muted);margin-bottom:6px;">المواد المستخدمة</div><div style="display:flex;flex-wrap:wrap;gap:6px;">' + materialsHtml + '</div></div>' : '')
      + '</div>';
    document.getElementById('adModal').classList.add('show');
  },

  editAd: function(idx) {
    var a = this.data.ads[idx];
    if (!a) return;
    a._idx = idx;
    document.getElementById('adTabContent').innerHTML = '<div id="adFormContainer">' + this.adForm(a) + '</div>';
  },

  deleteAd: function(idx) {
    if (!confirm('حذف الإعلان؟')) return;
    this.logAction('حذف', 'إعلان: ' + (this.data.ads[idx].title || ''));
    this.data.ads.splice(idx, 1);
    this.saveData();
    this.syncAds();
    this.renderContent('ads');
  },

  approveAd: function(idx) {
    if (idx >= 0 && idx < this.data.ads.length) {
      this.data.ads[idx].status = 'approved';
      this.saveData();
      this.syncAds();
      this.logAction('قبل', 'إعلان: ' + (this.data.ads[idx].title || ''));
      this.renderContent('ads');
    }
  },

  rejectAd: function(idx) {
    if (idx >= 0 && idx < this.data.ads.length) {
      this.data.ads[idx].status = 'rejected';
      this.saveData();
      this.syncAds();
      this.logAction('رفض', 'إعلان: ' + (this.data.ads[idx].title || ''));
      this.renderContent('ads');
    }
  },

  adModal: function() {
    return '<div class="modal-overlay" id="adModal"><div class="modal-box"><div class="modal-header"><h3>تفاصيل الإعلان</h3><button class="btn btn-sm btn-outline" onclick="dashboard.closeModal(\'adModal\')">✕</button></div><div class="modal-body" id="adModalContent"></div></div></div>';
  },

  syncAds: function() {
    localStorage.setItem('bunean-ads', JSON.stringify(this.data.ads));
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
    var self = this;
    var content = '<div style="padding:10px 0;"><strong>من: </strong>' + (m.from || '-') + '<br><strong>إلى: </strong>' + (m.to || '-') + '<br><strong>التاريخ: </strong>' + (m.date || '-') + '<br><hr style="margin:12px 0;border-color:var(--border);"><p style="line-height:1.8;">' + (m.message || '') + '</p></div>'
      + '<hr style="border-color:var(--border);margin:8px 0;"><div class="form-group"><label>الرد على الرسالة (سيصل كإشعار للمستخدم)</label><textarea class="form-control" id="replyMessageText" rows="3"></textarea></div>'
      + '<button class="btn btn-gold" onclick="dashboard.sendMessageReply(' + idx + ')">📨 إرسال الرد</button>';
    document.getElementById('messageViewContent').innerHTML = content;
    document.getElementById('messageModal').classList.add('show');
  },

  sendMessageReply: function(idx) {
    var m = this.data.messages[idx];
    if (!m) return;
    var reply = document.getElementById('replyMessageText').value.trim();
    if (!reply) { alert('اكتب الرد أولاً'); return; }
    if (!this.data.notifications) this.data.notifications = [];
    this.data.notifications.push({
      id: Date.now(),
      title: 'رد على استفسارك',
      message: reply,
      target: m.from,
      targetType: 'user',
      targetName: m.from,
      date: new Date().toLocaleDateString('ar-IQ')
    });
    this.saveData();
    this.syncNotifications();
    document.getElementById('replyMessageText').value = '';
    document.getElementById('messageModal').classList.remove('show');
    alert('✅ تم إرسال الرد وسيظهر في إشعارات المستخدم');
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
      var targetLabel = n.target === 'user' ? ('مستخدم: ' + (n.targetName || ''))
        : n.target === 'company' ? ('شركة: ' + (n.targetName || ''))
        : n.target === 'users' ? 'المستخدمون'
        : n.target === 'companies' ? 'الشركات'
        : 'الكل';
      list += '<tr><td>' + (notifs.length - i) + '</td><td>' + (n.title || '-') + '</td><td>' + (n.message || '').substring(0, 50) + '</td><td>' + targetLabel + '</td><td>' + (n.date || '-') + '</td>'
        + '<td><button class="btn btn-sm btn-danger" onclick="dashboard.deleteNotification(' + i + ')">حذف</button></td></tr>';
    }
    var users = this.data.users || [];
    var companies = this.data.companies || [];
    var userOpts = '<option value="">-- اختر --</option>';
    for (var i = 0; i < users.length; i++) {
      userOpts += '<option value="' + users[i].username + '">' + (users[i].fullName || users[i].name || users[i].username) + '</option>';
    }
    var compOpts = '<option value="">-- اختر --</option>';
    for (var i = 0; i < companies.length; i++) {
      compOpts += '<option value="' + companies[i].name + '">' + companies[i].name + '</option>';
    }
    return '<div class="card"><div class="card-header"><h3>🔔 إرسال إشعار</h3></div><div class="card-body">'
      + '<form onsubmit="dashboard.sendNotification(event)">'
      + '<div class="form-row">'
      + '<div class="form-group"><label>عنوان الإشعار</label><input class="form-control" id="notifTitle" required></div>'
      + '<div class="form-group"><label>نوع المستهدف</label><select class="form-control" id="notifTargetType" onchange="dashboard.toggleNotifTarget()"><option value="all">جميع المستخدمين</option><option value="users">المستخدمون فقط</option><option value="companies">الشركات فقط</option><option value="user">مستخدم معين</option><option value="company">شركة معينة</option></select></div>'
      + '</div>'
      + '<div class="form-group" id="notifUserGroup" style="display:none;"><label>اختر المستخدم</label><select class="form-control" id="notifTargetUser">' + userOpts + '</select></div>'
      + '<div class="form-group" id="notifCompanyGroup" style="display:none;"><label>اختر الشركة</label><select class="form-control" id="notifTargetCompany">' + compOpts + '</select></div>'
      + '<div class="form-group"><label>نص الإشعار</label><textarea class="form-control" id="notifMessage" required></textarea></div>'
      + '<button type="submit" class="btn btn-gold">📨 إرسال الإشعار</button>'
      + '</form></div></div>'
      + '<div class="card"><div class="card-header"><h3>📋 الإشعارات المرسلة</h3></div><div class="card-body">'
      + '<div class="table-wrap"><table><thead><tr><th>#</th><th>العنوان</th><th>الرسالة</th><th>المستهدف</th><th>التاريخ</th><th></th></tr></thead><tbody>'
      + (list || '<tr><td colspan="6"><div class="empty-state"><p>لا توجد إشعارات مرسلة</p></div></td></tr>')
      + '</tbody></table></div></div></div>';
  },

  toggleNotifTarget: function() {
    var val = document.getElementById('notifTargetType').value;
    document.getElementById('notifUserGroup').style.display = val === 'user' ? '' : 'none';
    document.getElementById('notifCompanyGroup').style.display = val === 'company' ? '' : 'none';
  },

  sendNotification: function(e) {
    e.preventDefault();
    var targetType = document.getElementById('notifTargetType').value;
    var target = targetType;
    var targetName = '';
    if (targetType === 'user') {
      target = document.getElementById('notifTargetUser').value;
      var users = this.data.users || [];
      for (var i = 0; i < users.length; i++) {
        if (users[i].username === target) { targetName = users[i].fullName || users[i].name || target; break; }
      }
    } else if (targetType === 'company') {
      target = document.getElementById('notifTargetCompany').value;
      var companies = this.data.companies || [];
      for (var i = 0; i < companies.length; i++) {
        if (companies[i].name === target) { targetName = target; break; }
      }
    }
    var notif = {
      id: Date.now(),
      title: document.getElementById('notifTitle').value,
      message: document.getElementById('notifMessage').value,
      target: target,
      targetType: targetType,
      targetName: targetName,
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
        + ' <button class="btn btn-sm btn-edit" onclick="dashboard.editQuoteForm(' + i + ')">✏️</button>'
        + (q.status !== 'approved' ? ' <button class="btn btn-sm btn-success" onclick="dashboard.approveQuote(' + i + ')">قبول</button>' : '')
        + (q.status !== 'rejected' ? ' <button class="btn btn-sm btn-danger" onclick="dashboard.rejectQuote(' + i + ')">رفض</button>' : '')
        + '</td></tr>';
    }
    return '<div class="card"><div class="card-header"><h3>💰 عروض الأسعار</h3></div><div class="card-body">'
      + '<div class="table-wrap"><table><thead><tr><th>#</th><th>الاسم</th><th>الهاتف</th><th>الخدمة</th><th>التفاصيل</th><th>التاريخ</th><th>الحالة</th><th></th></tr></thead><tbody>'
      + (list || '<tr><td colspan="8"><div class="empty-state"><p>لا توجد عروض أسعار</p></div></td></tr>')
      + '</tbody></table></div></div></div>';
  },

  editQuoteForm: function(idx) {
    var q = this.data.quotes[idx];
    if (!q) return;
    document.getElementById('quoteEditIdx').value = idx;
    document.getElementById('editQuoteName').value = q.name || q.from || '';
    document.getElementById('editQuotePhone').value = q.phone || '';
    document.getElementById('editQuoteService').value = q.service || q.serviceType || '';
    document.getElementById('editQuoteCity').value = q.city || '';
    document.getElementById('editQuoteDetails').value = q.details || q.message || '';
    document.getElementById('editQuoteStatus').value = q.status || 'pending';
    document.getElementById('editQuoteModal').classList.add('show');
  },

  saveQuoteEdit: function() {
    var idx = parseInt(document.getElementById('quoteEditIdx').value);
    var q = this.data.quotes[idx];
    if (!q) return;
    q.name = document.getElementById('editQuoteName').value;
    q.phone = document.getElementById('editQuotePhone').value;
    q.service = q.serviceType = document.getElementById('editQuoteService').value;
    q.city = document.getElementById('editQuoteCity').value;
    q.details = q.message = document.getElementById('editQuoteDetails').value;
    q.status = document.getElementById('editQuoteStatus').value;
    this.saveData();
    this.syncQuotes();
    document.getElementById('editQuoteModal').classList.remove('show');
    this.renderContent('quotes');
    alert('✅ تم التعديل');
  },

  quoteEditModal: function() {
    return '<div class="modal-overlay" id="editQuoteModal"><div class="modal-box">'
      + '<h3>✏️ تعديل عرض السعر</h3>'
      + '<form onsubmit="event.preventDefault(); dashboard.saveQuoteEdit()">'
      + '<input type="hidden" id="quoteEditIdx" value="-1">'
      + '<div class="form-row"><div class="form-group"><label>الاسم</label><input class="form-control" id="editQuoteName"></div>'
      + '<div class="form-group"><label>الهاتف</label><input class="form-control" id="editQuotePhone"></div></div>'
      + '<div class="form-row"><div class="form-group"><label>الخدمة</label><input class="form-control" id="editQuoteService"></div>'
      + '<div class="form-group"><label>المدينة</label><input class="form-control" id="editQuoteCity"></div></div>'
      + '<div class="form-group"><label>التفاصيل</label><textarea class="form-control" id="editQuoteDetails" rows="3"></textarea></div>'
      + '<div class="form-group"><label>الحالة</label><select class="form-control" id="editQuoteStatus"><option value="pending">قيد المراجعة</option><option value="approved">تم الموافقة</option><option value="rejected">مرفوض</option></select></div>'
      + '<div class="modal-actions"><button type="button" class="btn btn-outline" onclick="dashboard.closeModal(\'editQuoteModal\')">إلغاء</button>'
      + '<button type="submit" class="btn btn-gold">💾 حفظ</button></div>'
      + '</form></div></div>';
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
    if (!document.getElementById('editQuoteModal')) {
      var div2 = document.createElement('div');
      div2.innerHTML = this.quoteEditModal();
      document.body.appendChild(div2.firstElementChild);
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

  // ---- Settings (محذوفة - اسم التطبيق ثابت) ----
};

document.addEventListener('DOMContentLoaded', function() {
  dashboard.init();
});
