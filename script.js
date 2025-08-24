document.addEventListener('DOMContentLoaded', () => {
    const display = document.getElementById("display");
    const timeInput = document.getElementById("time-input");
    const timerDisplay = document.getElementById("timer");
    const actionBtn = document.getElementById("action-btn");
    const alarmSound = document.getElementById("alarm-sound");

    let timerInterval;
    let totalSeconds = 0;
    const originalTitle = document.title;

    function updateDisplay() {
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        const timeString = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        timerDisplay.textContent = timeString;
        
        // Обновляем заголовок вкладки
        document.title = `${timeString} | ${originalTitle}`;
    }

    function resetTitle() {
        document.title = originalTitle;
    }

    function playAlertSound() {
        alarmSound.currentTime = 0;
        alarmSound.loop = true;
        alarmSound.play().catch(e => console.log("Ошибка звука:", e));
    }

    function stopAlertSound() {
        alarmSound.pause();
        alarmSound.currentTime = 0;
    }

    function parseInputTime(input) {
        if (!input) return 0;
        
        const parts = input.split('+').map(part => {
            const num = parseInt(part.trim());
            return isNaN(num) ? 0 : num;
        });

        const minutes = parts[0] || 0;
        const seconds = parts[1] || 0;
        
        return (minutes * 60) + seconds;
    }

    function startTimer() {
        totalSeconds = parseInputTime(timeInput.value);
        
        if (totalSeconds > 0 && totalSeconds <= 7200) {
            timeInput.classList.add("hidden");
            timerDisplay.classList.remove("hidden");
            actionBtn.textContent = "Сброс";
            actionBtn.classList.add("reset");
            
            updateDisplay();
            
            timerInterval = setInterval(() => {
                if (totalSeconds <= 0) {
                    clearInterval(timerInterval);
                    playAlertSound();
                    timerDisplay.classList.add("timer-ended");
                    return;
                }
                totalSeconds--;
                updateDisplay();
            }, 1000);
        } else {
            alert("Введите время в формате:\nМинуты (1-120)\nИли Мин+Сек (например: 1+30)");
            timeInput.value = "";
            timeInput.focus();
        }
    }

    function resetTimer() {
        clearInterval(timerInterval);
        stopAlertSound();
        resetTitle();
        timeInput.classList.remove("hidden");
        timerDisplay.classList.add("hidden");
        timerDisplay.classList.remove("timer-ended");
        actionBtn.textContent = "Старт";
        actionBtn.classList.remove("reset");
        totalSeconds = 0;
        timeInput.value = "";
        timeInput.focus();
    }

    actionBtn.addEventListener("click", () => {
        if (actionBtn.textContent === "Старт") {
            startTimer();
        } else {
            resetTimer();
        }
    });

    timeInput.addEventListener("keypress", (e) => {
        if (e.key === "Enter") {
            startTimer();
        }
    });

    timeInput.addEventListener("input", (e) => {
        e.target.value = e.target.value.replace(/[^0-9+]/g, '');
    });

    timeInput.focus();
});