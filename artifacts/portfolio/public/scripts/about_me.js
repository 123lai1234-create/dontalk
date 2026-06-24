(() => {
    const form           = document.getElementById('contactForm');
    const statusEl       = document.getElementById('contactStatus');
    const submitBtn      = document.getElementById('contactSubmitBtn');
    const apiHealthLabel = document.getElementById('apiHealthLabel');
    const dbHealthLabel  = document.getElementById('dbHealthLabel');
    const dbCountLabel   = document.getElementById('dbCountLabel');
    const dbLastSeen     = document.getElementById('dbLastSeen');
    const apiBaseLabel   = document.getElementById('apiBaseLabel');

    const setStatus = (message, state) => {
        statusEl.textContent    = message;
        statusEl.dataset.state  = state;
    };

    const setMetrics = ({ api, db, count, lastSeen }) => {
        if (apiHealthLabel) apiHealthLabel.textContent = api;
        if (dbHealthLabel)  dbHealthLabel.textContent  = db;
        if (dbCountLabel)   dbCountLabel.textContent   = count;
        if (dbLastSeen)     dbLastSeen.textContent     = lastSeen;
    };

    const formatDateTime = (value) => {
        if (!value) return '-';
        const d = new Date(value);
        if (Number.isNaN(d.getTime())) return '-';
        return d.toLocaleString('zh-TW', {
            hour12: false, year: 'numeric', month: '2-digit', day: '2-digit',
            hour: '2-digit', minute: '2-digit',
        });
    };

    // Hide admin panel — was FastAPI-specific
    const adminPanel = document.getElementById('dbMultiStatus');
    if (adminPanel) adminPanel.style.display = 'none';

    const updateStats = async () => {
        try {
            const apiBase = await window.APP_CONFIG_UTILS.resolveApiBase();
            if (apiBaseLabel) apiBaseLabel.textContent = apiBase || 'Not configured';
            const r = await fetch(`${apiBase}/contact/stats`);
            if (!r.ok) throw new Error('stats failed');
            const data = await r.json();
            setMetrics({
                api:      'API Server',
                db:       'Connected',
                count:    String(data.total ?? 0),
                lastSeen: formatDateTime(data.latest_at),
            });
            submitBtn.disabled = false;
            setStatus('表單已就緒，可以送出留言。', 'success');
        } catch (e) {
            setMetrics({ api: 'API Server', db: 'Unavailable', count: '-', lastSeen: '-' });
            submitBtn.disabled = false;
            setStatus('無法確認連線狀態，仍可嘗試送出。', 'warning');
        }
    };

    form.addEventListener('submit', async (event) => {
        event.preventDefault();

        const fd = new FormData(form);
        const payload = {
            name:         String(fd.get('name')         || '').trim(),
            email:        String(fd.get('email')        || '').trim(),
            organization: String(fd.get('organization') || '').trim() || null,
            message:      String(fd.get('message')      || '').trim(),
            website:      String(fd.get('website')      || '').trim() || null,
            source_page:  window.location.pathname.split('/').pop() || 'about_me',
        };

        // Honeypot — bot trap
        if (payload.website) return;

        if (!payload.name || !payload.email || !payload.message) {
            setStatus('請至少填寫姓名、Email 與訊息內容。', 'warning');
            return;
        }

        submitBtn.disabled    = true;
        submitBtn.textContent = '送出中…';
        setStatus('正在送出留言…', 'idle');

        try {
            const apiBase = await window.APP_CONFIG_UTILS.resolveApiBase();
            const r = await fetch(`${apiBase}/contact`, {
                method:  'POST',
                headers: { 'Content-Type': 'application/json' },
                body:    JSON.stringify(payload),
            });

            const data = await r.json().catch(() => ({}));
            if (r.status === 429) throw new Error(data.error || '請求過於頻繁，請稍後再試。');
            if (!r.ok) throw new Error(data.error || '送出失敗，請稍後再試。');

            const id = data?.id;
            form.reset();
            setStatus(`留言已送出！記錄編號 #${id}。感謝您的聯絡 🎉`, 'success');
            updateStats();
        } catch (err) {
            setStatus(err.message || '目前無法送出，請稍後再試。', 'error');
        } finally {
            submitBtn.disabled    = false;
            submitBtn.textContent = '送出留言';
        }
    });

    updateStats();
})();
