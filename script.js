document.getElementById('translateBtn').addEventListener('click', async () => {
    const inputText = document.getElementById('inputText').value;
    const sourceLang = document.getElementById('sourceLanguage').value;
    const targetLang = document.getElementById('targetLanguage').value;
    const outputText = document.getElementById('outputText');

    if (!inputText.trim()) {
        outputText.textContent = 'Введите текст!';
        return;
    }

    // Показываем загрузку
    outputText.textContent = 'Перевожу...';
    outputText.classList.add('loading');

    try {
        const response = await fetch(
            `https://api.mymemory.translated.net/get?q=${encodeURIComponent(inputText)}&langpair=${sourceLang}|${targetLang}`
        );

        const data = await response.json();
        
        if (data.responseStatus === 200) {
            outputText.textContent = data.responseData.translatedText;
        } else {
            outputText.textContent = 'Ошибка перевода 😢';
        }

    } catch (error) {
        outputText.textContent = 'Ошибка сети!';
        console.error(error);
    } finally {
        outputText.classList.remove('loading');
    }
});