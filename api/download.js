/**
 * download.js
 * Fungsi untuk mendownload gambar dari URL blob
 */

// Fungsi download yang robust dengan toast notification
async function downloadImage(imageUrl, filename = 'mockup.png') {
    try {
        // Tampilkan notifikasi loading jika fungsi showToast tersedia
        if (window.showToast) {
            window.showToast('Mengunduh gambar...', 'info');
        }
        
        // Fetch gambar dengan mode yang tepat
        const response = await fetch(imageUrl);
        
        if (!response.ok) {
            throw new Error(`Gagal mengunduh: ${response.status} ${response.statusText}`);
        }
        
        const blob = await response.blob();
        
        // Validasi blob
        if (blob.size === 0) {
            throw new Error('File kosong');
        }
        
        // Buat URL object untuk blob
        const blobUrl = URL.createObjectURL(blob);
        
        // Buat link download
        const link = document.createElement('a');
        link.href = blobUrl;
        link.download = filename;
        document.body.appendChild(link);
        
        // Trigger download
        link.click();
        
        // Cleanup setelah download
        setTimeout(() => {
            document.body.removeChild(link);
            URL.revokeObjectURL(blobUrl);
        }, 100);
        
        // Notifikasi sukses
        if (window.showToast) {
            window.showToast('Download berhasil!', 'success');
        } else {
            console.log('Download berhasil:', filename);
        }
        
    } catch (error) {
        console.error('Download error:', error);
        
        // Notifikasi error
        if (window.showToast) {
            window.showToast('Gagal mendownload: ' + error.message, 'error');
        } else {
            alert('Gagal mendownload gambar: ' + error.message);
        }
    }
}

// Fungsi notifikasi toast sederhana (fallback jika tidak ada di global)
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
    `;
    
    document.body.appendChild(toast);
    
    // Animasi muncul
    setTimeout(() => toast.classList.add('show'), 10);
    
    // Hilangkan setelah 3 detik
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// Inisialisasi fungsi showToast jika belum ada
if (typeof window.showToast === 'undefined') {
    window.showToast = createToast;
}

// Export fungsi untuk digunakan global
window.downloadImage = downloadImage;
window.showToast = window.showToast || createToast;

console.log('download.js loaded - downloadImage function ready');