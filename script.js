const HISTORY_KEY = 'translationHistory';
const HISTORY_LIMIT = 20;

const outputTextEl = document.getElementById('outputText');
const historyListEl = document.getElementById('historyList');

function loadHistory() {
    try {
        return JSON.parse(localStorage.getItem(HISTORY_KEY)) || [];
    } catch {
        return [];
    }
}

function saveHistory(history) {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
}

function renderHistory(history) {
    historyListEl.innerHTML = '';

    if (!history.length) {
        const empty = document.createElement('li');
        empty.textContent = 'История пока пуста';
        historyListEl.appendChild(empty);
        return;
    }

    history.forEach(item => {
        const li = document.createElement('li');
        li.innerHTML = `<strong>${item.from} → ${item.to}</strong>: ${item.source} → ${item.result}`;
        historyListEl.appendChild(li);
    });
}

function addToHistory(entry) {
    const history = loadHistory();
    history.unshift(entry);
    const trimmed = history.slice(0, HISTORY_LIMIT);
    saveHistory(trimmed);
    renderHistory(trimmed);
}

document.getElementById('translateBtn').addEventListener('click', async () => {
    const inputText = document.getElementById('inputText').value;
    const sourceLang = document.getElementById('sourceLanguage').value;
    const targetLang = document.getElementById('targetLanguage').value;

    if (!inputText.trim()) {
        outputTextEl.textContent = 'Введите текст!';
        return;
    }

    outputTextEl.textContent = 'Перевожу...';
    outputTextEl.classList.add('loading');

    try {
        const response = await fetch(
            `https://api.mymemory.translated.net/get?q=${encodeURIComponent(inputText)}&langpair=${sourceLang}|${targetLang}`
        );

        const data = await response.json();
        
        if (data.responseStatus === 200) {
            const translated = data.responseData.translatedText;
            outputTextEl.textContent = translated;
            addToHistory({
                source: inputText,
                result: translated,
                from: sourceLang,
                to: targetLang,
                time: Date.now()
            });
        } else {
            outputTextEl.textContent = 'Ошибка перевода 😢';
        }

    } catch (error) {
        outputTextEl.textContent = 'Ошибка сети!';
        console.error(error);
    } finally {
        outputTextEl.classList.remove('loading');
    }
});

// Показываем историю при загрузке
renderHistory(loadHistory());