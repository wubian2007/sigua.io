/**
 * Download Manager for Sigua.io
 * Handles app downloads for different platforms
 */

class DownloadManager {
    constructor() {
        this.apiBaseUrl = 'https://a.hkdownload.com/get.php';
        this.init();
    }

    init() {
        this.bindEvents();
    }

    bindEvents() {
        // Bind download buttons
        document.addEventListener('click', (e) => {
            if (e.target.closest('.download-btn--pc')) {
                e.preventDefault();
                this.handleDownload('pc');
            } else if (e.target.closest('.download-btn--mobile')) {
                e.preventDefault();
                this.handleDownload('mobile');
            } else if (e.target.closest('.getDown')) {
                e.preventDefault();
                this.handleOriginalDownload();
            }
        });
    }

    /**
     * Handle download for specific device type
     * @param {string} deviceType - 'pc' or 'mobile'
     */
    async handleDownload(deviceType) {
        try {
            this.showLoadingState();
            
            const downloadUrl = await this.getDownloadUrl(deviceType);
            if (downloadUrl) {
                this.downloadFile(downloadUrl);
            }
        } catch (error) {
            console.error('Download error:', error);
            this.showError('下载繁忙，错误代码:500');
        } finally {
            this.hideLoadingState();
        }
    }

    /**
     * Handle original download logic
     */
    async handleOriginalDownload() {
        try {
            this.showLoadingState();
            
            const deviceType = this.detectDeviceType();
            const downloadUrl = await this.getDownloadUrl(deviceType);
            
            if (downloadUrl) {
                this.downloadFile(downloadUrl);
            }
        } catch (error) {
            console.error('Download error:', error);
            this.showError('抱歉，网站过期啦，赶紧续费');
        } finally {
            this.hideLoadingState();
        }
    }

    /**
     * Detect device type based on user agent
     * @returns {string} 'mobile' or 'pc'
     */
    detectDeviceType() {
        return /Mobile|Android|iPhone|iPad/i.test(navigator.userAgent) ? 'mobile' : 'pc';
    }

    /**
     * Get download URL from API
     * @param {string} deviceType - Device type
     * @returns {Promise<string>} Download URL
     */
    async getDownloadUrl(deviceType) {
        const siteDomain = window.location.hostname;
        const params = new URLSearchParams({
            type: deviceType,
            site: siteDomain
        });

        // First API call
        const response1 = await fetch(`${this.apiBaseUrl}?${params}`);
        if (!response1.ok) {
            throw new Error(`HTTP error! status: ${response1.status}`);
        }

        const data1 = await response1.json();
        
        if (!data1.webhost) {
            if (data1.code && data1.msg) {
                this.showError(data1.msg);
                return null;
            }
            throw new Error('未获取到有效的下载地址');
        }

        // Second API call
        const response2 = await fetch(data1.webhost);
        if (!response2.ok) {
            throw new Error(`HTTP error! status: ${response2.status}`);
        }

        const data2 = await response2.json();
        
        if (!data2.go) {
            if (data2.code && data2.msg) {
                this.showError(data2.msg);
                return null;
            }
            throw new Error('未获取到最终下载地址');
        }

        return data2.go;
    }

    /**
     * Trigger file download
     * @param {string} url - Download URL
     */
    downloadFile(url) {
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', '');
        link.style.display = 'none';
        
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        this.showSuccess('下载已开始');
    }

    /**
     * Show loading state
     */
    showLoadingState() {
        const buttons = document.querySelectorAll('.download-btn');
        buttons.forEach(button => {
            button.style.opacity = '0.6';
            button.style.pointerEvents = 'none';
        });
    }

    /**
     * Hide loading state
     */
    hideLoadingState() {
        const buttons = document.querySelectorAll('.download-btn');
        buttons.forEach(button => {
            button.style.opacity = '1';
            button.style.pointerEvents = 'auto';
        });
    }

    /**
     * Show error message
     * @param {string} message - Error message
     */
    showError(message) {
        this.showNotification(message, 'error');
    }

    /**
     * Show success message
     * @param {string} message - Success message
     */
    showSuccess(message) {
        this.showNotification(message, 'success');
    }

    /**
     * Show notification
     * @param {string} message - Message to show
     * @param {string} type - 'success' or 'error'
     */
    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification--${type}`;
        notification.innerHTML = `
            <div class="notification__content">
                <span class="notification__message">${message}</span>
                <button class="notification__close" aria-label="关闭通知">×</button>
            </div>
        `;

        // Add styles
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'error' ? '#ef4444' : '#10b981'};
            color: white;
            padding: 1rem;
            border-radius: 0.5rem;
            box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
            z-index: 1000;
            max-width: 300px;
            animation: slideInRight 0.3s ease-out;
        `;

        // Add to page
        document.body.appendChild(notification);

        // Auto remove after 5 seconds
        setTimeout(() => {
            this.removeNotification(notification);
        }, 5000);

        // Close button functionality
        const closeBtn = notification.querySelector('.notification__close');
        closeBtn.addEventListener('click', () => {
            this.removeNotification(notification);
        });
    }

    /**
     * Remove notification
     * @param {HTMLElement} notification - Notification element
     */
    removeNotification(notification) {
        notification.style.animation = 'slideOutRight 0.3s ease-in';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }
}

// Add notification animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
    
    .notification__content {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 0.5rem;
    }
    
    .notification__close {
        background: none;
        border: none;
        color: white;
        font-size: 1.25rem;
        cursor: pointer;
        padding: 0;
        width: 20px;
        height: 20px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 50%;
        transition: background-color 0.2s;
    }
    
    .notification__close:hover {
        background-color: rgba(255, 255, 255, 0.2);
    }
`;
document.head.appendChild(style);

// Initialize download manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new DownloadManager();
});
