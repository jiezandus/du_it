document.addEventListener('DOMContentLoaded', function() {
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    const clearBtn = document.getElementById('clearBtn');
    const recognizeBtn = document.getElementById('recognizeBtn');
    
    let isDrawing = false;
    let lastX = 0;
    let lastY = 0;

    // 触摸事件处理
    function handleStart(e) {
        e.preventDefault();
        isDrawing = true;
        const touch = e.touches[0];
        const rect = canvas.getBoundingClientRect();
        lastX = touch.clientX - rect.left;
        lastY = touch.clientY - rect.top;
    }

    function handleMove(e) {
        if (!isDrawing) return;
        e.preventDefault();
        const touch = e.touches[0];
        const rect = canvas.getBoundingClientRect();
        const x = touch.clientX - rect.left;
        const y = touch.clientY - rect.top;
        
        ctx.beginPath();
        ctx.moveTo(lastX, lastY);
        ctx.lineTo(x, y);
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 4;
        ctx.lineCap = 'round';
        ctx.stroke();
        
        lastX = x;
        lastY = y;
    }

    function handleEnd() {
        isDrawing = false;
    }

    // 清除画布
    function clearCanvas() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }

    // 获取百度API访问令牌
    async function getBaiduToken() {
        const response = await fetch(`https://aip.baidubce.com/oauth/2.0/token?grant_type=client_credentials&client_id=${CONFIG.BAIDU_API_KEY}&client_secret=${CONFIG.BAIDU_SECRET_KEY}`, {
            method: 'POST'
        });
        const data = await response.json();
        return data.access_token;
    }

    // 将Canvas转换为Base64图片
    function getCanvasImage() {
        return canvas.toDataURL('image/png')
            .replace('data:image/png;base64,', '');
    }

    // 识别函数修改为异步函数
    async function recognizeCharacter() {
        try {
            const result = document.getElementById('result');
            result.style.display = 'block';
            result.querySelector('.pronunciation').textContent = '识别中...';
            
            const token = await getBaiduToken();
            const image = getCanvasImage();
            
            const response = await fetch('https://aip.baidubce.com/rest/2.0/handwriting/v1/recognize', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: `access_token=${token}&image=${encodeURIComponent(image)}`
            });

            const data = await response.json();
            
            if (data.words_result && data.words_result.length > 0) {
                const character = data.words_result[0].words;
                
                // 获取汉字信息（这里可以接入其他API获取读音和释义）
                result.querySelector('.pronunciation').textContent = `识别结果: "${character}"`;
                result.querySelector('.words').textContent = '正在查询词组...';
                result.querySelector('.usage').textContent = '正在查询用法...';
            } else {
                result.querySelector('.pronunciation').textContent = '未能识别，请重试';
            }
        } catch (error) {
            console.error('识别出错:', error);
            const result = document.getElementById('result');
            result.querySelector('.pronunciation').textContent = '识别失败，请重试';
        }
    }

    // 事件监听
    canvas.addEventListener('touchstart', handleStart);
    canvas.addEventListener('touchmove', handleMove);
    canvas.addEventListener('touchend', handleEnd);
    clearBtn.addEventListener('click', clearCanvas);
    recognizeBtn.addEventListener('click', recognizeCharacter);
});