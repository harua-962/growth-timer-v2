document.addEventListener('DOMContentLoaded', () => {

    const appTitle = document.getElementById('app-title');
    const plantImage = document.getElementById('plant-image');
    const timeDisplay = document.getElementById('time');
    const messageDisplay = document.getElementById('message');
    const minutesInput = document.getElementById('minutes-input');
    const startButton = document.getElementById('start-btn');
    const resetButton = document.getElementById('reset-btn');
    const prevThemeButton = document.getElementById('prev-theme-btn');
    const nextThemeButton = document.getElementById('next-theme-btn');

    const themes = [
        {
            name: 'サクラ・タイマー',
            images: [
                './images/growth/sakura_stage1.png',
                './images/growth/sakura_stage2.png',
                './images/growth/sakura_stage3.png',
                './images/growth/sakura_stage4.png'
            ],
            sizes: ['25vh', '40vh', '65vh', '90vh']
        },
        {
            name: 'ビーチ・タイマー',
            images: [
                './images/growth/beach_stage1.png',
                './images/growth/beach_stage2.png',
                './images/growth/beach_stage3.png'
            ],
            sizes: ['30vh', '55vh', '85vh']
        },
        {
            name: '紅葉タイマー',
            images: [
                './images/growth/autumn_stage1.png',
                './images/growth/autumn_stage2.png',
                './images/growth/autumn_stage3.png'
            ],
            sizes: ['30vh', '55vh', '85vh']
        },
        {
            name: '宇宙タイマー',
            images: [
                './images/growth/space_stage1.png',
                './images/growth/space_stage2.png',
                './images/growth/space_stage3.png',
                './images/growth/space_stage4.png'
            ],
            sizes: ['30vh', '50vh', '70vh', '90vh']
        }
    ];

    let timerId = null;
    let totalSeconds = 0;
    let secondsLeft = 0;
    let currentThemeIndex = 0;
    
    let currentStageIndex = -1; 

    function switchTheme(index) {
        currentThemeIndex = index;
        const theme = themes[index];
        const backgroundUrl = `./images/${theme.name.includes('サクラ') ? 'sakura' : theme.name.includes('ビーチ') ? 'beach' : theme.name.includes('紅葉') ? 'autumn' : 'space'}_bg.png`;
        
        document.body.style.backgroundImage = `url(${backgroundUrl})`;
        appTitle.textContent = theme.name;
        resetTimer();
        localStorage.setItem('timerThemeIndex', index);
    }
    
    prevThemeButton.addEventListener('click', () => {
        let newIndex = currentThemeIndex - 1;
        if (newIndex < 0) newIndex = themes.length - 1;
        switchTheme(newIndex);
    });
    nextThemeButton.addEventListener('click', () => {
        let newIndex = currentThemeIndex + 1;
        if (newIndex >= themes.length) newIndex = 0;
        switchTheme(newIndex);
    });
    startButton.addEventListener('click', () => {
        const minutes = parseInt(minutesInput.value);
        if (isNaN(minutes) || minutes <= 0) {
            alert('1以上の半角数字を入力してください。');
            return;
        }
        if (timerId === null) startTimer(minutes);
    });
    resetButton.addEventListener('click', resetTimer);

    function startTimer(minutes) {
        totalSeconds = minutes * 60;
        secondsLeft = totalSeconds;
        updateDisplay();
        timerId = setInterval(updateTimer, 1000);
        startButton.disabled = true;
        minutesInput.disabled = true;
    }

    function updateTimer() {
        secondsLeft--;
        updateDisplay();
        if (secondsLeft <= 0) {
            clearInterval(timerId);
            timerId = null;
            messageDisplay.textContent = 'お疲れ様でした！見事に育ちました！';
        }
    }

    function updateDisplay() {
        const minutes = Math.floor(secondsLeft / 60);
        const seconds = secondsLeft % 60;
        timeDisplay.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
        updateGrowth();
    }

    
    function updateGrowth() {
        const theme = themes[currentThemeIndex];
        const progress = totalSeconds > 0 ? (totalSeconds - secondsLeft) / totalSeconds : 0;
        
        let stageIndex = 0;
        if (theme.images.length === 4) {
            if (progress >= 0.95) { stageIndex = 3; }
            else if (progress >= 0.6) { stageIndex = 2; }
            else if (progress >= 0.2) { stageIndex = 1; }
        } else {
            if (progress >= 0.8) { stageIndex = 2; }
            else if (progress >= 0.3) { stageIndex = 1; }
        }
        
        
        if (stageIndex !== currentStageIndex) {
            currentStageIndex = stageIndex; 
            
            const newImageSrc = theme.images[stageIndex];
            const newSize = theme.sizes[stageIndex];
            
            plantImage.style.opacity = 0;
            setTimeout(() => {
                plantImage.src = newImageSrc;
                plantImage.style.maxHeight = newSize;
                plantImage.style.opacity = 1;
            }, 400);
        }
    }

    function resetTimer() {
        clearInterval(timerId);
        timerId = null;
        secondsLeft = 0;
        totalSeconds = 0;
        timeDisplay.textContent = '00:00';
        messageDisplay.textContent = '';
        
        
        currentStageIndex = 0; 
        
        plantImage.src = themes[currentThemeIndex].images[0];
        plantImage.style.maxHeight = themes[currentThemeIndex].sizes[0];
        plantImage.style.opacity = 1; 
        
        startButton.disabled = false;
        minutesInput.disabled = false;
    }
    
    const savedThemeIndex = localStorage.getItem('timerThemeIndex');
    if (savedThemeIndex !== null) {
        currentThemeIndex = parseInt(savedThemeIndex, 10);
    }
    
    const initialTheme = themes[currentThemeIndex];
    const initialBackgroundName = initialTheme.name.includes('サクラ') ? 'sakura' :
                                  initialTheme.name.includes('ビーチ') ? 'beach' :
                                  initialTheme.name.includes('紅葉') ? 'autumn' : 'space';
    document.body.style.backgroundImage = `url(./images/${initialBackgroundName}_bg.png)`;
    
    switchTheme(currentThemeIndex);
});
