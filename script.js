// 音频播放器功能
class AudioPlayer {
    constructor() {
        this.audioElement = document.getElementById('audioPlayer');
        this.currentTrackName = document.getElementById('currentTrackName');
        this.playBtn = document.getElementById('playBtn');
        this.pauseBtn = document.getElementById('pauseBtn');
        this.stopBtn = document.getElementById('stopBtn');
        this.volumeSlider = document.getElementById('volumeSlider');
        this.audioList = document.getElementById('audioList');
        this.searchInput = document.getElementById('searchInput');
        this.searchBtn = document.getElementById('searchBtn');
        
        this.audioFiles = [];
        this.currentAudioIndex = -1;
        this.isPlaying = false;
        
        this.init();
    }
    
    init() {
        this.loadAudioFiles();
        this.setupEventListeners();
        this.setupVolumeControl();
    }
    
    // 加载音频文件列表
    async loadAudioFiles() {
        try {
            // 模拟从服务器获取音频文件列表
            // 在实际应用中，这里应该是一个API调用
            this.audioFiles = await this.getAudioFileList();
            this.renderAudioList(this.audioFiles);
        } catch (error) {
            console.error('加载音频文件失败:', error);
            this.showError('加载音频文件失败，请刷新页面重试');
        }
    }
    
    // 获取音频文件列表（模拟从服务器获取）
    async getAudioFileList() {
        // 这里我们模拟一个异步操作
        return new Promise((resolve) => {
            setTimeout(() => {
                const files = [];
                // 生成48个测试音频文件信息
                for (let i = 1; i <= 48; i++) {
                    files.push({
                        id: i,
                        title: `Test ${i}`,
                        filename: `${i.toString().padStart(2, '0')} Test ${i}（2026 八年级）.mp3`,
                        path: `MP3/${i.toString().padStart(2, '0')} Test ${i}（2026 八年级）.mp3`,
                        duration: '2:30' // 模拟时长
                    });
                }
                resolve(files);
            }, 500);
        });
    }
    
    // 渲染音频列表
    renderAudioList(files) {
        if (files.length === 0) {
            this.audioList.innerHTML = `
                <div class="empty-state">
                    <i>🔍</i>
                    <p>未找到音频文件</p>
                </div>
            `;
            return;
        }
        
        this.audioList.innerHTML = files.map((file, index) => `
            <div class="audio-item" data-index="${index}">
                <div class="audio-info">
                    <div class="audio-title">${file.title}</div>
                    <div class="audio-filename">${file.filename}</div>
                </div>
                <div class="audio-actions">
                    <button class="play-btn" onclick="audioPlayer.playAudio(${index})">
                        ▶ 播放
                    </button>
                    <button class="download-btn" onclick="audioPlayer.downloadAudio('${file.path}', '${file.filename}')">
                        ⬇ 下载
                    </button>
                </div>
            </div>
        `).join('');
    }
    
    // 设置事件监听器
    setupEventListeners() {
        this.playBtn.addEventListener('click', () => this.play());
        this.pauseBtn.addEventListener('click', () => this.pause());
        this.stopBtn.addEventListener('click', () => this.stop());
        
        this.searchBtn.addEventListener('click', () => this.searchAudio());
        this.searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.searchAudio();
            }
        });
        
        this.audioElement.addEventListener('ended', () => {
            this.isPlaying = false;
            this.updatePlayButtonState();
            this.highlightCurrentAudio(-1);
        });
        
        this.audioElement.addEventListener('play', () => {
            this.isPlaying = true;
            this.updatePlayButtonState();
        });
        
        this.audioElement.addEventListener('pause', () => {
            this.isPlaying = false;
            this.updatePlayButtonState();
        });
    }
    
    // 设置音量控制
    setupVolumeControl() {
        this.volumeSlider.addEventListener('input', (e) => {
            this.audioElement.volume = e.target.value;
        });
    }
    
    // 播放音频
    playAudio(index) {
        if (index < 0 || index >= this.audioFiles.length) return;
        
        const audioFile = this.audioFiles[index];
        this.audioElement.src = audioFile.path;
        this.currentTrackName.textContent = audioFile.title;
        this.currentAudioIndex = index;
        
        this.audioElement.play().catch(error => {
            console.error('播放失败:', error);
            this.showError('播放失败，请检查音频文件路径');
        });
        
        this.highlightCurrentAudio(index);
    }
    
    // 播放
    play() {
        if (this.audioElement.src) {
            this.audioElement.play().catch(error => {
                console.error('播放失败:', error);
                this.showError('播放失败');
            });
        } else if (this.audioFiles.length > 0) {
            this.playAudio(0);
        }
    }
    
    // 暂停
    pause() {
        this.audioElement.pause();
    }
    
    // 停止
    stop() {
        this.audioElement.pause();
        this.audioElement.currentTime = 0;
        this.isPlaying = false;
        this.updatePlayButtonState();
        this.highlightCurrentAudio(-1);
    }
    
    // 更新播放按钮状态
    updatePlayButtonState() {
        if (this.isPlaying) {
            this.playBtn.style.display = 'none';
            this.pauseBtn.style.display = 'block';
        } else {
            this.playBtn.style.display = 'block';
            this.pauseBtn.style.display = 'none';
        }
    }
    
    // 高亮当前播放的音频
    highlightCurrentAudio(index) {
        const audioItems = this.audioList.querySelectorAll('.audio-item');
        audioItems.forEach((item, i) => {
            if (i === index) {
                item.classList.add('playing');
            } else {
                item.classList.remove('playing');
            }
        });
    }
    
    // 下载音频
    downloadAudio(filePath, fileName) {
        try {
            // 创建一个虚拟链接进行下载
            const link = document.createElement('a');
            link.href = filePath;
            link.download = fileName;
            link.target = '_blank';
            
            // 模拟点击下载
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            
            this.showSuccess(`正在下载: ${fileName}`);
        } catch (error) {
            console.error('下载失败:', error);
            this.showError('下载失败，请检查文件路径');
        }
    }
    
    // 搜索音频
    searchAudio() {
        const searchTerm = this.searchInput.value.trim().toLowerCase();
        
        if (searchTerm === '') {
            this.renderAudioList(this.audioFiles);
            return;
        }
        
        const filteredFiles = this.audioFiles.filter(file => 
            file.title.toLowerCase().includes(searchTerm) ||
            file.filename.toLowerCase().includes(searchTerm)
        );
        
        this.renderAudioList(filteredFiles);
    }
    
    // 显示错误消息
    showError(message) {
        this.showNotification(message, 'error');
    }
    
    // 显示成功消息
    showSuccess(message) {
        this.showNotification(message, 'success');
    }
    
    // 显示通知
    showNotification(message, type = 'info') {
        // 创建一个简单的通知元素
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 20px;
            border-radius: 8px;
            color: white;
            font-weight: bold;
            z-index: 1000;
            background: ${type === 'error' ? '#f44336' : type === 'success' ? '#4CAF50' : '#2196F3'};
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
            animation: slideIn 0.3s ease;
        `;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        // 3秒后自动移除
        setTimeout(() => {
            if (notification.parentNode) {
                notification.style.animation = 'slideOut 0.3s ease';
                setTimeout(() => {
                    if (notification.parentNode) {
                        notification.parentNode.removeChild(notification);
                    }
                }, 300);
            }
        }, 3000);
    }
}

// 添加CSS动画
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// 初始化音频播放器
document.addEventListener('DOMContentLoaded', () => {
    window.audioPlayer = new AudioPlayer();
});

// 添加键盘快捷键
document.addEventListener('keydown', (e) => {
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
    
    switch (e.code) {
        case 'Space':
            e.preventDefault();
            if (window.audioPlayer.isPlaying) {
                window.audioPlayer.pause();
            } else {
                window.audioPlayer.play();
            }
            break;
        case 'ArrowRight':
            if (window.audioPlayer.currentAudioIndex < window.audioPlayer.audioFiles.length - 1) {
                window.audioPlayer.playAudio(window.audioPlayer.currentAudioIndex + 1);
            }
            break;
        case 'ArrowLeft':
            if (window.audioPlayer.currentAudioIndex > 0) {
                window.audioPlayer.playAudio(window.audioPlayer.currentAudioIndex - 1);
            }
            break;
    }
});