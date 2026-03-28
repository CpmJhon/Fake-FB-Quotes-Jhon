/**
 * download.js
 * Fungsi untuk mendownload gambar dari URL blob - VERSI TERFIX
 */

// Fungsi download utama yang lebih robust
async function downloadImage(imageUrl, filename = 'mockup.png') {
    console.log('Download function called with URL:', imageUrl);
    console.log('Filename:', filename);
    
    try {
        // Tampilkan notifikasi loading
        if (window.showToast) {
            window.showToast('⏳ Mengunduh gambar...', 'info');
        }
        
        // Pastikan URL valid
        if (!imageUrl || imageUrl === '') {
            throw new Error('URL gambar tidak valid');
        }
        
        // Fetch gambar dengan mode yang tepat
        const response = await fetch(imageUrl, {
            method: 'GET',
            mode: 'cors',
            headers: {
                'Accept': 'image/*'
            }
        });
        
        console.log('Fetch response status:', response.status);
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        const blob = await response.blob();
        console.log('Blob size:', blob.size, 'Blob type:', blob.type);
        
        // Validasi blob
        if (blob.size === 0) {
            throw new Error('File kosong (0 bytes)');
        }
        
        // Buat URL object untuk blob
        const blobUrl = URL.createObjectURL(blob);
        
        // Buat link download
        const link = document.createElement('a');
        link.href = blobUrl;
        link.download = filename;
        link.style.display = 'none';
        document.body.appendChild(link);
        
        // Trigger download dengan timeout untuk memastikan click terdaftar
        setTimeout(() => {
            link.click();
            console.log('Download triggered');
        }, 100);
        
        // Cleanup setelah download selesai
        setTimeout(() => {
            document.body.removeChild(link);
            URL.revokeObjectURL(blobUrl);
            console.log('Cleanup completed');
        }, 1000);
        
        // Notifikasi sukses
        if (window.showToast) {
            window.showToast('✅ Download berhasil!', 'success');
        }
        
        return true;
        
    } catch (error) {
        console.error('Download error details:', error);
        
        // Notifikasi error dengan detail
        const errorMessage = error.message || 'Gagal mendownload gambar';
        if (window.showToast) {
            window.showToast('❌ ' + errorMessage, 'error');
        } else {
            alert('Gagal mendownload gambar: ' + errorMessage);
        }
        
        return false;
    }
}

// Fungsi alternatif: download dengan cara membuka tab baru
function downloadImageNewTab(imageUrl, filename = 'mockup.png') {
    console.log('Download via new tab:', imageUrl);
    
    try {
        // Buat link dan klik
        const link = document.createElement('a');
        link.href = imageUrl;
        link.download = filename;
        link.target = '_blank';
        link.style.display = 'none';
        document.body.appendChild(link);
        link.click();
        
        setTimeout(() => {
            document.body.removeChild(link);
        }, 500);
        
        if (window.showToast) {
            window.showToast('✅ Download dimulai', 'success');
        }
        
    } catch (error) {
        console.error('Download via new tab error:', error);
        
        // Fallback: buka gambar di tab baru
        window.open(imageUrl, '_blank');
        
        if (window.showToast) {
            window.showToast('📸 Gambar dibuka di tab baru, klik kanan untuk save', 'info');
        }
    }
}

// Fungsi showToast yang lebih baik
function createToast(message, type = 'info') {
    // Hapus toast yang sudah ada
    const existingToast = document.querySelector('.toast-notification');
    if (existingToast) existingToast.remove();
    
    // Buat elemen toast
    const toast = document.createElement('div');
    toast.className = `toast-notification toast-${type}`;
    
    const icon = type === 'success' ? 'fa-check-circle' : 
                 type === 'error' ? 'fa-exclamation-circle' : 
                 'fa-info-circle';
    
    toast.innerHTML = `
        <i class="fas ${icon}"></i>
        <span>${message}</span>
        <div class="toast-progress"></div>
    `;
    
    document.body.appendChild(toast);
    
    // Animasi muncul
    setTimeout(() => toast.classList.add('show'), 10);
    
    // Auto hide setelah 3 detik
    const timeout = setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, 3000);
    
    // Progress bar animation
    const progressBar = toast.querySelector('.toast-progress');
    if (progressBar) {
        progressBar.style.animation = `toastProgress 3s linear forwards`;
    }
    
    return timeout;
}

// Tambahkan CSS untuk progress bar toast di sini (akan ditambahkan ke style.css)
// Untuk memastikan toast memiliki progress bar
if (typeof document !== 'undefined') {
    const style = document.createElement('style');
    style.textContent = `
        .toast-notification {
            position: fixed;
            bottom: 30px;
            left: 50%;
            transform: translateX(-50%) translateY(100px);
            background: rgba(0, 0, 0, 0.95);
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 50px;
            padding: 12px 24px;
            display: flex;
            align-items: center;
            gap: 12px;
            color: white;
            font-size: 0.9rem;
            font-weight: 500;
            z-index: 10000;
            transition: transform 0.3s ease;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
            overflow: hidden;
        }
        
        .toast-notification.show {
            transform: translateX(-50%) translateY(0);
        }
        
        .toast-notification i {
            font-size: 1.2rem;
        }
        
        .toast-success i {
            color: #10b981;
        }
        
        .toast-error i {
            color: #ef4444;
        }
        
        .toast-info i {
            color: #3b82f6;
        }
        
        .toast-progress {
            position: absolute;
            bottom: 0;
            left: 0;
            width: 100%;
            height: 3px;
            background: rgba(255, 255, 255, 0.3);
            transform-origin: left;
        }
        
        @keyframes toastProgress {
            from { transform: scaleX(1); }
            to { transform: scaleX(0); }
        }
        
        .toast-success .toast-progress {
            background: #10b981;
        }
        
        .toast-error .toast-progress {
            background: #ef4444;
        }
        
        .toast-info .toast-progress {
            background: #3b82f6;
        }
    `;
    document.head.appendChild(style);
}

// Export fungsi untuk digunakan global
window.downloadImage = downloadImage;
window.downloadImageNewTab = downloadImageNewTab;
window.showToast = createToast;

console.log('download.js v2 loaded - download functions ready');