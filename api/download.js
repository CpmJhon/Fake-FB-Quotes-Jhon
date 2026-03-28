function downloadImage(url, filename = 'mockup.png') {
    fetch(url)
        .then(res => res.blob())
        .then(blob => {
            const link = document.createElement('a');
            const objectUrl = URL.createObjectURL(blob);
            link.href = objectUrl;
            link.download = filename;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(objectUrl);
        })
        .catch(err => console.error('Download error:', err));
}

// Untuk memudahkan akses global
window.downloadImage = downloadImage;