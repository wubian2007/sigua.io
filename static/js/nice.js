document.addEventListener('DOMContentLoaded', () => {
    const downloadButtons = document.querySelectorAll('.getDown');
    
    const pcDownloadButtons = document.querySelectorAll('.pcgetDown');
    const androidDownloadButtons = document.querySelectorAll('.androidgetDown');
    
    downloadButtons.forEach(button => {
        button.addEventListener('click', handleOriginalDownload);
    });
    
    pcDownloadButtons.forEach(button => {
        button.addEventListener('click', (event) => handleDownload(event, 'pc'));
    });
    
    androidDownloadButtons.forEach(button => {
        button.addEventListener('click', (event) => handleDownload(event, 'mobile'));
    });
});

async function handleOriginalDownload(event) {
    event.preventDefault();
    try {
        const deviceType = /Mobile/i.test(navigator.userAgent) ? 'mobile' : 'pc';
        const siteDomain = window.location.hostname;
        
        const webhostUrl = `https://a.hkdownload.com/get.php?type=${deviceType}&site=${siteDomain}`;
        
        const webhostResponse = await fetch(webhostUrl);
        const webhostData = await webhostResponse.json();
        
        if (!webhostData.webhost) {
            if (webhostData.code && webhostData.msg) {
                alert(webhostData.msg);
                return; 
            }
            throw new Error('未获取到有效的下载地址');
        }
        
        const downloadUrl = webhostData.webhost;
        const webhostResponse1 = await fetch(downloadUrl);
        const webhostData1 = await webhostResponse1.json();
        
        if (!webhostData1.go) {
            if (webhostData1.code && webhostData1.msg) {
                alert(webhostData1.msg);
                return;
            }
            throw new Error('未获取到最终下载地址');
        }
        downloadFile(webhostData1.go);
        
    } catch (error) {
        console.error('下载过程中出现错误:', error);
        alert('抱歉，网站过期啦，赶紧续费');
    }
}

async function handleDownload(event, deviceType) {
    event.preventDefault();
    try {
        const siteDomain = window.location.hostname;
        
        const webhostUrl = `https://a.hkdownload.com/get.php?type=${deviceType}&site=${siteDomain}`;
        
        const webhostResponse = await fetch(webhostUrl);
        const webhostData = await webhostResponse.json();
        
        if (!webhostData.webhost) {
            if (webhostData.code && webhostData.msg) {
                alert(webhostData.msg);
                return; 
            }
            throw new Error('未获取到有效的下载地址');
        }
        
        const downloadUrl = webhostData.webhost;
        const webhostResponse1 = await fetch(downloadUrl);
        const webhostData1 = await webhostResponse1.json();
        
        if (!webhostData1.go) {
            if (webhostData1.code && webhostData1.msg) {
                alert(webhostData1.msg);
                return;
            }
            throw new Error('未获取到最终下载地址');
        }
        downloadFile(webhostData1.go);
        
    } catch (error) {
        console.error('下载过程中出现错误:', error);
        alert('下载繁忙，错误代码:500');
    }
}

function downloadFile(url) {
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', '');
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}