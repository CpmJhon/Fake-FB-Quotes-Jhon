// Daftar format mockup
const formats = [
    { id: 'brat', name: 'Brat Text', icon: 'fas fa-font', endpoint: '/maker/brat', params: [{ name: 'text', label: 'Teks', type: 'text', placeholder: 'Masukkan teks...' }] },
    { id: 'fakecall', name: 'Fake Call', icon: 'fas fa-phone-alt', endpoint: '/maker/fakecall', params: [
        { name: 'nama', label: 'Nama Penelepon', type: 'text', placeholder: 'Jhony' },
        { name: 'durasi', label: 'Durasi', type: 'text', placeholder: '19:31' },
        { name: 'avatar', label: 'URL Avatar', type: 'url', placeholder: 'https://cdn.discordapp.com/embed/avatars/0.png' }
    ] },
    { id: 'fakechannel', name: 'Fake Channel', icon: 'fab fa-youtube', endpoint: '/maker/fakechannel', params: [
        { name: 'url', label: 'URL Gambar', type: 'url' }, { name: 'name', label: 'Nama Channel', type: 'text' },
        { name: 'followers', label: 'Followers', type: 'text' }, { name: 'desc', label: 'Deskripsi', type: 'text' },
        { name: 'date', label: 'Tanggal', type: 'text' }
    ] },
    { id: 'fakedana', name: 'Fake DANA', icon: 'fas fa-wallet', endpoint: '/maker/fakedanav2', params: [{ name: 'nominal', label: 'Nominal', type: 'text', placeholder: 'Rp 100.000' }] },
    { id: 'fbcomment', name: 'FB Comment', icon: 'fab fa-facebook', endpoint: '/maker/fakefbcomment', params: [
        { name: 'name', label: 'Nama', type: 'text' }, { name: 'comment', label: 'Komentar', type: 'text' },
        { name: 'url', label: 'URL Foto Profil', type: 'url' }
    ] },
    { id: 'wagroup', name: 'WA Group', icon: 'fab fa-whatsapp', endpoint: '/maker/fakegroup', params: [
        { name: 'url', label: 'URL Icon', type: 'url' }, { name: 'title', label: 'Judul', type: 'text' },
        { name: 'number', label: 'Jumlah Pesan', type: 'text' }, { name: 'time', label: 'Waktu', type: 'text' }
    ] },
    { id: 'wagroupv2', name: 'WA Group V2', icon: 'fab fa-whatsapp', endpoint: '/maker/fakegroupv2', params: [
        { name: 'url', label: 'URL Avatar', type: 'url' }, { name: 'name', label: 'Nama Admin', type: 'text' },
        { name: 'members', label: 'Member', type: 'text' }, { name: 'desc', label: 'Deskripsi', type: 'text' },
        { name: 'author', label: 'Author', type: 'text' }, { name: 'date', label: 'Tanggal', type: 'text' }
    ] },
    { id: 'igpost', name: 'IG Post', icon: 'fab fa-instagram', endpoint: '/maker/fakeigpost', params: [
        { name: 'avatar', label: 'URL Avatar', type: 'url' }, { name: 'content', label: 'URL Konten', type: 'url' },
        { name: 'username', label: 'Username', type: 'text' }, { name: 'likes', label: 'Likes', type: 'text' },
        { name: 'comment', label: 'Comments', type: 'text' }, { name: 'share', label: 'Share', type: 'text' },
        { name: 'repost', label: 'Repost', type: 'text' }, { name: 'date', label: 'Tanggal', type: 'text' },
        { name: 'desc', label: 'Caption', type: 'textarea' }
    ] },
    { id: 'tiktokprofile', name: 'TikTok Profile', icon: 'fab fa-tiktok', endpoint: '/maker/faketiktok', params: [
        { name: 'name', label: 'Nama', type: 'text' }, { name: 'username', label: 'Username', type: 'text' },
        { name: 'following', label: 'Following', type: 'text' }, { name: 'followers', label: 'Followers', type: 'text' },
        { name: 'likes', label: 'Likes', type: 'text' }, { name: 'url', label: 'URL Foto', type: 'url' }
    ] },
    { id: 'tiktokcomment', name: 'TikTok Comment', icon: 'fab fa-tiktok', endpoint: '/maker/fakettcomment', params: [
        { name: 'url', label: 'URL Foto', type: 'url' }, { name: 'username', label: 'Username', type: 'text' },
        { name: 'comment', label: 'Komentar', type: 'text' }, { name: 'date', label: 'Tanggal', type: 'text' }
    ] },
    { id: 'ytcommunity', name: 'YT Community', icon: 'fab fa-youtube', endpoint: '/maker/fakeytcomunity', params: [
        { name: 'avatar', label: 'URL Avatar', type: 'url' }, { name: 'content', label: 'URL Konten', type: 'url' },
        { name: 'username', label: 'Username', type: 'text' }, { name: 'desc', label: 'Deskripsi', type: 'text' },
        { name: 'like', label: 'Like', type: 'text' }, { name: 'comment', label: 'Comment', type: 'text' }
    ] }
];

let activeFormat = formats[0];

// Splash Screen
function initSplashScreen() {
    const splashScreen = document.getElementById('splashScreen');
    const mainContent = document.getElementById('mainContent');
    const progressFill = document.getElementById('progressFill');
    const loadingPercentage = document.getElementById('loadingPercentage');
    const loadingStatus = document.getElementById('loadingStatus');
    
    const messages = [
        { text: '🎨 Loading features...', progress: 20 },
        { text: '⚡ Connecting to API...', progress: 40 },
        { text: '✨ Preparing generators...', progress: 60 },
        { text: '🚀 Almost ready...', progress: 80 },
        { text: '🎉 Welcome to QuickFake!', progress: 100 }
    ];
    
    let currentProgress = 0;
    let msgIndex = 0;
    
    createParticles();
    
    function updateProgress() {
        const target = messages[msgIndex]?.progress || 100;
        const interval = setInterval(() => {
            if (currentProgress < target) {
                currentProgress++;
                progressFill.style.width = currentProgress + '%';
                loadingPercentage.textContent = currentProgress;
            } else {
                clearInterval(interval);
                if (msgIndex < messages.length - 1) {
                    msgIndex++;
                    loadingStatus.innerHTML = `<i class="fas fa-${msgIndex === 1 ? 'network-wired' : msgIndex === 2 ? 'palette' : 'rocket'}"></i> ${messages[msgIndex].text}`;
                    updateProgress();
                } else {
                    setTimeout(() => {
                        splashScreen.classList.add('fade-out');
                        mainContent.classList.remove('hidden');
                        setTimeout(() => {
                            mainContent.classList.add('visible');
                            splashScreen.style.display = 'none';
                        }, 800);
                    }, 500);
                }
            }
        }, 30);
    }
    updateProgress();
}

function createParticles() {
    const container = document.getElementById('particles');
    if (!container) return;
    for (let i = 0; i < 30; i++) {
        const p = document.createElement('div');
        p.className = 'particle';
        p.style.left = Math.random() * 100 + '%';
        p.style.animationDelay = Math.random() * 3 + 's';
        p.style.animationDuration = 2 + Math.random() * 2 + 's';
        p.style.background = `hsl(${Math.random() * 60 + 200}, 70%, 60%)`;
        container.appendChild(p);
    }
}

// Generate Loading
function showGenerateLoading() {
    const btn = document.getElementById('generateBtn');
    const loading = document.getElementById('generateLoading');
    const fill = document.getElementById('generateProgressFill');
    const percent = document.getElementById('generateProgressPercent');
    const msg = document.getElementById('generateLoadingMessage');
    
    btn.classList.add('hidden');
    loading.classList.remove('hidden');
    
    const texts = [
        { icon: 'fa-paintbrush-fine', text: 'Creating mockup...' },
        { icon: 'fa-cogs', text: 'Processing image...' },
        { icon: 'fa-magic', text: 'Applying effects...' }
    ];
    
    let progress = 0, idx = 0;
    const interval = setInterval(() => {
        if (progress < 95) {
            progress += Math.random() * 12;
            if (progress > 95) progress = 95;
            fill.style.width = progress + '%';
            percent.textContent = Math.floor(progress);
        }
        if (progress >= 30 && idx === 0) { idx++; msg.innerHTML = `<i class="fas ${texts[1].icon}"></i> ${texts[1].text}`; }
        if (progress >= 60 && idx === 1) { idx++; msg.innerHTML = `<i class="fas ${texts[2].icon}"></i> ${texts[2].text}`; }
    }, 180);
    
    return { interval, fill, percent };
}

function hideGenerateLoading(loading, fill, percent, success = true) {
    if (loading) clearInterval(loading);
    const btn = document.getElementById('generateBtn');
    const container = document.getElementById('generateLoading');
    if (success && fill && percent) {
        fill.style.width = '100%';
        percent.textContent = '100';
        setTimeout(() => { container.classList.add('hidden'); btn.classList.remove('hidden'); }, 500);
    } else {
        container.classList.add('hidden');
        btn.classList.remove('hidden');
    }
}

// Render Functions
function renderFormatGrid() {
    const grid = document.getElementById('formatGrid');
    grid.innerHTML = formats.map(f => `
        <div class="format-item ${activeFormat.id === f.id ? 'active' : ''}" data-id="${f.id}">
            <i class="${f.icon}"></i> ${f.name}
        </div>
    `).join('');
    
    document.querySelectorAll('.format-item').forEach(el => {
        el.addEventListener('click', () => {
            activeFormat = formats.find(f => f.id === el.dataset.id);
            renderFormatGrid();
            renderParamForm();
            document.getElementById('resultArea').innerHTML = `<div class="result-placeholder"><i class="fas fa-image"></i><p>Hasil mockup akan tampil di sini</p></div>`;
        });
    });
}

function renderParamForm() {
    const container = document.getElementById('paramForm');
    if (!activeFormat.params?.length) {
        container.innerHTML = '<div class="input-group"><p style="color:#9ca3af;">Tidak ada parameter</p></div>';
        return;
    }
    container.innerHTML = activeFormat.params.map(p => `
        <div class="input-group">
            <label>${p.label}</label>
            ${p.type === 'textarea' ? 
                `<textarea name="${p.name}" rows="3" placeholder="${p.placeholder || ''}"></textarea>` : 
                `<input type="${p.type}" name="${p.name}" placeholder="${p.placeholder || ''}" />`}
        </div>
    `).join('');
}

// Generate Mockup
async function generateMockup() {
    const resultDiv = document.getElementById('resultArea');
    const inputs = document.querySelectorAll('#paramForm input, #paramForm textarea');
    let params = {};
    inputs.forEach(inp => { if (inp.value.trim()) params[inp.name] = encodeURIComponent(inp.value.trim()); });
    
    if (activeFormat.id === 'brat' && !params.text) {
        if (window.showToast) window.showToast('Masukkan teks terlebih dahulu', 'error');
        return;
    }
    
    const { interval, fill, percent } = showGenerateLoading();
    
    let apiUrl = `https://api.zenzxz.my.id${activeFormat.endpoint}?`;
    apiUrl += Object.entries(params).map(([k, v]) => `${k}=${v}`).join('&');
    
    try {
        const response = await fetch(apiUrl, { method: 'GET', mode: 'cors', headers: { 'Accept': 'image/*' } });
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        
        const blob = await response.blob();
        if (!blob.type.startsWith('image/')) throw new Error('Bukan format gambar');
        
        const imageUrl = URL.createObjectURL(blob);
        
        resultDiv.innerHTML = `
            <div class="result-content">
                <img src="${imageUrl}" alt="Mockup" style="max-width:100%; border-radius:1rem; box-shadow:0 8px 20px rgba(0,0,0,0.3);" />
                <div style="margin-top:20px; text-align:center;">
                    <button class="download-btn" id="downloadImageBtn">
                        <i class="fas fa-download"></i> Download Gambar
                    </button>
                </div>
            </div>
        `;
        
        const downloadBtn = document.getElementById('downloadImageBtn');
        if (downloadBtn) {
            downloadBtn.onclick = async (e) => {
                e.preventDefault();
                if (typeof window.downloadImage === 'function') {
                    await window.downloadImage(imageUrl, `${activeFormat.id}_mockup_${Date.now()}.png`);
                } else {
                    const a = document.createElement('a');
                    a.href = imageUrl;
                    a.download = `${activeFormat.id}_mockup_${Date.now()}.png`;
                    a.click();
                }
            };
        }
        
        hideGenerateLoading(interval, fill, percent, true);
        if (window.showToast) window.showToast('Mockup berhasil dibuat!', 'success');
        
    } catch (err) {
        resultDiv.innerHTML = `<div class="result-placeholder"><i class="fas fa-times-circle"></i><p>Gagal: ${err.message}</p></div>`;
        hideGenerateLoading(interval, fill, percent, false);
        if (window.showToast) window.showToast(err.message, 'error');
    }
}

// Navigation
function initNavigation() {
    const links = document.querySelectorAll('.nav-link');
    const pages = {
        home: document.getElementById('homePage'),
        howto: document.getElementById('howtoPage'),
        guide: document.getElementById('guidePage'),
        docs: document.getElementById('docsPage')
    };
    
    function switchPage(pageId) {
        Object.values(pages).forEach(p => p?.classList.remove('active-page'));
        if (pages[pageId]) pages[pageId].classList.add('active-page');
        links.forEach(l => l.classList.remove('active'));
        document.querySelector(`.nav-link[data-page="${pageId}"]`)?.classList.add('active');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    
    links.forEach(l => {
        l.addEventListener('click', (e) => {
            e.preventDefault();
            switchPage(l.dataset.page);
            document.getElementById('navMenu')?.classList.remove('active');
        });
    });
    
    document.getElementById('navToggle')?.addEventListener('click', () => {
        document.getElementById('navMenu')?.classList.toggle('active');
    });
    
    switchPage('home');
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    initSplashScreen();
    renderFormatGrid();
    renderParamForm();
    initNavigation();
    document.getElementById('generateBtn')?.addEventListener('click', generateMockup);
});