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

    // 识别函数（这里需要接入实际的识别API）
    function recognizeCharacter() {
        // 这里是示例数据，实际项目中需要接入手写识别API
        const result = document.getElementById('result');
        result.style.display = 'block';
        result.querySelector('.pronunciation').textContent = '示例: "字" (zì)';
        result.querySelector('.words').textContent = '常用词组：文字、汉字、字体';
        result.querySelector('.usage').textContent = '用法：用于表示书面语言的基本符号单位。';
    }

    // 事件监听
    canvas.addEventListener('touchstart', handleStart);
    canvas.addEventListener('touchmove', handleMove);
    canvas.addEventListener('touchend', handleEnd);
    clearBtn.addEventListener('click', clearCanvas);
    recognizeBtn.addEventListener('click', recognizeCharacter);
});