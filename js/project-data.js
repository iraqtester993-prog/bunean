var ProjectData = (function() {
    var PENDING_KEY = 'bunean-pending-projects';
    var APPROVED_KEY = 'bunean-approved-projects';
    var FEATURED_KEY = 'bunean-featured-projects';

    function _get(key) {
        try { return JSON.parse(localStorage.getItem(key)) || []; }
        catch(e) { return []; }
    }
    function _set(key, data) { localStorage.setItem(key, JSON.stringify(data)); }
    function _genId() { return 'proj_' + Date.now() + '_' + Math.random().toString(36).substr(2, 6); }

    return {
        addProject: function(project) {
            var pending = _get(PENDING_KEY);
            project.id = project.id || _genId();
            project.status = 'pending';
            project.createdAt = project.createdAt || new Date().toISOString();
            pending.push(project);
            _set(PENDING_KEY, pending);
            return project;
        },
        approveProject: function(id) {
            var pending = _get(PENDING_KEY);
            var approved = _get(APPROVED_KEY);
            var idx = -1;
            for (var i = 0; i < pending.length; i++) { if (pending[i].id === id) { idx = i; break; } }
            if (idx === -1) return false;
            var project = pending.splice(idx, 1)[0];
            project.status = 'approved';
            project.approvedAt = new Date().toISOString();
            approved.push(project);
            _set(PENDING_KEY, pending);
            _set(APPROVED_KEY, approved);
            return true;
        },
        featureProject: function(id) {
            var approved = _get(APPROVED_KEY);
            var featured = _get(FEATURED_KEY);
            var idx = -1;
            for (var i = 0; i < approved.length; i++) { if (approved[i].id === id) { idx = i; break; } }
            if (idx === -1) return false;
            var project = approved[idx];
            project.status = 'featured';
            project.featuredAt = new Date().toISOString();
            featured.push(project);
            _set(FEATURED_KEY, featured);
            return true;
        },
        unfeatureProject: function(id) {
            var featured = _get(FEATURED_KEY);
            var approved = _get(APPROVED_KEY);
            var idx = -1;
            for (var i = 0; i < featured.length; i++) { if (featured[i].id === id) { idx = i; break; } }
            if (idx === -1) return false;
            var project = featured.splice(idx, 1)[0];
            project.status = 'approved';
            approved.push(project);
            _set(FEATURED_KEY, featured);
            _set(APPROVED_KEY, approved);
            return true;
        },
        rejectProject: function(id) {
            var pending = _get(PENDING_KEY);
            var idx = -1;
            for (var i = 0; i < pending.length; i++) { if (pending[i].id === id) { idx = i; break; } }
            if (idx === -1) return false;
            pending.splice(idx, 1);
            _set(PENDING_KEY, pending);
            return true;
        },
        deleteProject: function(id) {
            var keys = [PENDING_KEY, APPROVED_KEY, FEATURED_KEY];
            for (var k = 0; k < keys.length; k++) {
                var arr = _get(keys[k]);
                for (var i = 0; i < arr.length; i++) {
                    if (arr[i].id === id) { arr.splice(i, 1); _set(keys[k], arr); return true; }
                }
            }
            return false;
        },
        getPendingProjects: function() { return _get(PENDING_KEY); },
        getApprovedProjects: function() { return _get(APPROVED_KEY); },
        getFeaturedProjects: function() { return _get(FEATURED_KEY); },
        getCompanyProjects: function(companyName) {
            var approved = _get(APPROVED_KEY);
            var featured = _get(FEATURED_KEY);
            var result = [];
            for (var i = 0; i < approved.length; i++) { if (approved[i].company === companyName) result.push(approved[i]); }
            for (var i = 0; i < featured.length; i++) { if (featured[i].company === companyName) result.push(featured[i]); }
            return result;
        },
        getAllProjects: function() {
            return _get(PENDING_KEY).concat(_get(APPROVED_KEY)).concat(_get(FEATURED_KEY));
        },
        getProjectById: function(id) {
            var all = this.getAllProjects();
            for (var i = 0; i < all.length; i++) { if (all[i].id === id) return all[i]; }
            return null;
        }
    };
})();
