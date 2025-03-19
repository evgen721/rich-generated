// Инициализация и обработка событий

document.addEventListener('DOMContentLoaded', function () {
    // Назначаем обработчик события на кнопку закрытия
    document.getElementById('closemodal').addEventListener('click', closeImagePreview);

    // Закрытие модального окна при клике вне области модалки
    document.getElementById('image-preview-overlay').addEventListener('click', function (event) {
        if (event.target === this) { // Проверяем, что клик был именно по оверлею
            closeImagePreview();
        }
    });

    // Обработчик для таба "Предпросмотр веб"
   const previewWebTab = document.querySelector('.tab[data-tab="preview-web"]');
if (previewWebTab) {
    previewWebTab.addEventListener('click', function() {
        const blocks = document.querySelectorAll('.block');
        if (blocks.length === 0) {
            alert('Нет добавленных блоков.');
            return;
        }

        // Всегда генерируем описание при переходе на таб
        const isGenerated = generateDescription();
        if (!isGenerated) {
            return;
        }

        const generatedDescription = document.getElementById('generated-description').textContent;
        if (generatedDescription.trim()) {
            fetch('preview_desktop.html')
                .then(response => response.text())
                .then(html => {
                    const updatedHTML = html.replace(
                        '<!-- CONTENT_PLACEHOLDER -->', 
                        generatedDescription
                    );

                    const iframe = document.getElementById('preview-iframe');
                    iframe.srcdoc = updatedHTML;
                    console.log('preview.html loaded via srcdoc with generated content');
                })
                .catch(error => {
                    console.error('Error loading preview.html:', error);
                });
        } else {
            alert('Нет сгенерированного описания для предпросмотра.');
        }
    });
} else {
    console.error('Таб для предпросмотра веб не найден.');
}

    // Обработчик для таба "Предпросмотр моб"
const previewMobTab = document.querySelector('.tab[data-tab="preview-mob"]');
if (previewMobTab) {
    previewMobTab.addEventListener('click', function() {
        const blocks = document.querySelectorAll('.block');
        if (blocks.length === 0) {
            alert('Нет добавленных блоков.');
            return;
        }

        // Всегда генерируем описание при переходе на таб
        const isGenerated = generateDescription();
        if (!isGenerated) {
            return;
        }

        const generatedDescription = document.getElementById('generated-description').textContent;
        if (generatedDescription.trim()) {
            fetch('preview_mobile.html')
                .then(response => response.text())
                .then(html => {
                    const updatedHTML = html.replace(
                        '<!-- CONTENT_PLACEHOLDER -->', 
                        generatedDescription
                    );

                    const iframe = document.getElementById('preview-mob-iframe');
                    iframe.srcdoc = updatedHTML;
                    console.log('preview_mob.html loaded via srcdoc with generated content');
                })
                .catch(error => {
                    console.error('Error loading preview_mob.html:', error);
                });
        } else {
            alert('Нет сгенерированного описания для предпросмотра.');
        }
    });
} else {
    console.error('Таб для предпросмотра моб не найден.');
}

    // По умолчанию показываем конструктор
    document.querySelector('#top-bar .tab[data-tab="constructor"]').classList.add('active');
    document.getElementById('constructor-content').classList.add('active');
});

// Функции для работы с блоками

function addBlock(type) {
    const container = document.getElementById('blocks-container');
    const block = document.createElement('div');
    block.className = 'block';
    block.dataset.type = type;

    // Добавляем кнопки управления блоком
    const controls = document.createElement('div');
    controls.className = 'block-controls';
    controls.innerHTML = `
        <img src="icon/вверх.png" alt="Вверх" onclick="moveBlockUp(this)">
        <img src="icon/вниз.png" alt="Вниз" onclick="moveBlockDown(this)">
        <img src="icon/крест.png" alt="Удалить" onclick="deleteBlock(this)">
    `;
    block.appendChild(controls);

    switch (type) {
        case 'text':
            block.innerHTML += `
                <div class="text-controls">
                    <button class="button-all" onclick="insertParagraph(this)">Абзац</button>
                    <button class="button-all" onclick="insertOrderedList(this)">Нумерованный список</button>
                    <button class="button-all" onclick="insertUnorderedList(this)">Маркированный список</button>
                    <button class="button-all" onclick="insertHeader(this)">Заголовок</button>
                </div>
                <textarea id="text-block" placeholder="Введите текст"></textarea>`;
            break;
        case 'row-gallery':
            block.innerHTML += `<div class="row-gallery"></div>
                               <button class="button-all" onclick="addImageRow(this)">+Добавить картинку в ряду</button>`;
            break;
        case 'column-gallery':
            block.innerHTML += createColumnGalleryBlock();
            break;
case 'single-media':
    block.innerHTML += `
        <div class="single-media-block">
            <div class="left-column">
                <select id="change" onchange="changeMediaType(this)">
                    <option value="image">Картинка</option>
                    <option value="video">Видео</option>
                </select>
                <div class="url-container">
                    <input type="text" placeholder="URL*" oninput="updateImagePreview(this)" class="required-placeholder">
                </div>
                <div class="media-controls-container">
                    <div class="new-container">
                        <div class="image-preview-container" onclick="openImagePreview(this.querySelector('.image-preview').src)">
                            <img class="image-preview" src="" alt="Превью">
                        </div>
                        <div class="image-size"></div>
                    </div>
                    <div class="width-and-checkbox-container">
                        <div class="width-container">
                            <input type="number" placeholder="Ширина % (необязательно)" min="1" max="100">
                        </div>
                        <label>
                            <input type="checkbox" class="checkbox" onchange="toggleWidthField(this)"> Во всю ширину (необязательно)
                        </label>
                    </div>
                </div>
            </div>
            <div class="right-column">
                <input type="text" placeholder="Заголовок">
                <textarea placeholder="Текст"></textarea>
            </div>
        </div>`;
    break;
	}

    container.appendChild(block);
}

function toggleWidthField(checkbox) {
    const widthInput = checkbox.closest('.single-media-block').querySelector('.width-container input');
    if (checkbox.checked) {
        widthInput.disabled = true;
        widthInput.value = '';
    } else {
        widthInput.disabled = false;
    }
}

function createColumnItemHTML() {
    return `
        <div class="column-item">
            <div class="left-column">
                <select onchange="toggleTextOrder(this)">
                    <option value="left">Картинка слева</option>
                    <option value="right">Картинка справа</option>
                </select>
                <div class="url-container">
                    <input type="text" placeholder="URL*" oninput="updateImagePreview(this)" class="required-placeholder">
                </div>
				<div class="media-controls-container">
				    <div class="new-container">
                         <div class="image-preview-container" onclick="openImagePreview(this.querySelector('.image-preview').src)">
                         <img class="image-preview" src="" alt="Превью">
                         </div>
                         <div class="image-size"></div>
						 </div>
                         <div class="width-and-checkbox-container">
                            <div class="width-container">
                                <input type="number" placeholder="Ширина % (необязательно)" min="1" max="100">
                            </div>
                         </div>           				
                    </div>
                </div>
            <div class="right-column">
                <input type="text" placeholder="Заголовок">
                <textarea placeholder="Текст*" class="required-placeholder"></textarea>
            </div>
            <div class="image-block-controls">
                <button class="delete-btn" onclick="deleteColumnItem(this)">✕</button>
            </div>
        </div>`;
}

// Функция для создания блока галереи
function createColumnGalleryBlock() {
    return `
        <div class="column-gallery-block">
            ${createColumnItemHTML()}
            <button class="button-all button-add-colum-image" onclick="addColumnItem(this)">+Добавить картинку</button>
        </div>`;
}

function addColumnItem(button) {
    const block = button.closest('.column-gallery-block'); // Находим контейнер галереи
    const newItem = document.createElement('div');
    newItem.innerHTML = createColumnItemHTML(); // Создаем только новый элемент .column-item

    // Вставляем новый элемент перед кнопкой
    block.insertBefore(newItem, button);

    // Динамическая привязка обработчиков
    const urlInput = newItem.querySelector('.url-container input[type="text"]');
    urlInput.addEventListener('input', function () {
        updateImagePreview(this);
    });

    const previewContainer = newItem.querySelector('.image-preview-container');
    previewContainer.addEventListener('click', function () {
        const previewImage = this.querySelector('.image-preview');
        if (previewImage.src) {
            openImagePreview(previewImage.src);
        }
    });

    const selectElement = newItem.querySelector('select');
    selectElement.addEventListener('change', function () {
        toggleTextOrder(this);
    });

    const checkbox = newItem.querySelector('.checkbox');
    checkbox.addEventListener('change', function () {
        toggleWidthField(this);
    });
}

function addImageRow(button) {
    const block = button.parentElement;
    const gallery = block.querySelector('.row-gallery');
    const imageCount = gallery.querySelectorAll('.image-block').length;
    if (imageCount >= 6) return;

    const imageBlock = document.createElement('div');
    imageBlock.className = 'image-block';
    imageBlock.innerHTML = `
        <div class="image-block-controls">
            <button class="move-left" onclick="moveImageLeft(this)">←</button>
            <button class="move-right" onclick="moveImageRight(this)">→</button>
            <button class="delete-btn" onclick="deleteImageRow(this)">✕</button>
        </div>
        <div class="url-container">
            <input type="text" placeholder="URL*" oninput="updateImagePreview(this)" class="required-placeholder">
        </div>
        <div class="image-preview-container" onclick="openImagePreview(this.querySelector('.image-preview').src)">
            <img class="image-preview" src="" alt="Превью">
        </div>
        <div class="image-size"></div>
        <input type="text" placeholder="Заголовок">
        <textarea placeholder="Текст"></textarea>
    `;
    gallery.appendChild(imageBlock);
}

function toggleTextOrder(selectElement) {
    const columnItem = selectElement.closest('.column-item');
    const leftColumn = columnItem.querySelector('.left-column');
    const rightColumn = columnItem.querySelector('.right-column');

    if (selectElement.value === 'left') {
        leftColumn.style.order = 1;
        rightColumn.style.order = 2;
    } else if (selectElement.value === 'right') {
        leftColumn.style.order = 2;
        rightColumn.style.order = 1;
    }
}

function deleteImageRow(button) {
    const imageBlock = button.closest('.image-block');
    if (imageBlock) {
        imageBlock.remove();
    }
}

function deleteColumnItem(button) {
    const item = button.closest('.column-item');
    item.remove();
}

function moveImageLeft(button) {
    const imageBlock = button.closest('.image-block');
    const prevImageBlock = imageBlock.previousElementSibling;

    // Если есть предыдущий блок, меняем их местами
    if (prevImageBlock && prevImageBlock.classList.contains('image-block')) {
        imageBlock.parentElement.insertBefore(imageBlock, prevImageBlock);
    }
}

function moveImageRight(button) {
    const imageBlock = button.closest('.image-block');
    const nextImageBlock = imageBlock.nextElementSibling;

    // Если есть следующий блок, меняем их местами
    if (nextImageBlock && nextImageBlock.classList.contains('image-block')) {
        imageBlock.parentElement.insertBefore(nextImageBlock, imageBlock);
    }
}

function moveBlockUp(button) {
    const block = button.closest('.block');
    const prevBlock = block.previousElementSibling;
    if (prevBlock) {
        block.parentElement.insertBefore(block, prevBlock);
    }
}

function moveBlockDown(button) {
    const block = button.closest('.block');
    const nextBlock = block.nextElementSibling;
    if (nextBlock) {
        block.parentElement.insertBefore(nextBlock, block);
    }
}

function deleteBlock(button) {
    const block = button.closest('.block');
    block.remove();
}

// Функции для работы с текстом

function insertParagraph(button) {
    const block = button.closest('.block');
    const textarea = block.querySelector('textarea');
    const newContent = '<p></p>';
    textarea.value += textarea.value ? `\n${newContent}` : newContent; // Проверка на пустоту
    textarea.focus(); // Фокусируем textarea
}

function insertOrderedList(button) {
    const block = button.closest('.block');
    const textarea = block.querySelector('textarea');
    const newContent = '<ol>\n<li>пункт1</li>\n<li>пункт2</li>\n<li>пункт3</li>\n</ol>';
    textarea.value += textarea.value ? `\n${newContent}` : newContent; // Проверка на пустоту
    textarea.focus(); // Фокусируем textarea
}

function insertUnorderedList(button) {
    const block = button.closest('.block');
    const textarea = block.querySelector('textarea');
    const newContent = '<ul>\n<li>пункт1</li>\n<li>пункт2</li>\n<li>пункт3</li>\n</ul>';
    textarea.value += textarea.value ? `\n${newContent}` : newContent; // Проверка на пустоту
    textarea.focus(); // Фокусируем textarea
}

function insertHeader(button) {
    const block = button.closest('.block');
    const textarea = block.querySelector('textarea');
    const newContent = '<p><b>Заголовок</b></p>';
    textarea.value += textarea.value ? `\n${newContent}` : newContent; // Проверка на пустоту
    textarea.focus(); // Фокусируем textarea
}



// Функции для генерации HTML

function generateColumnGalleryHTML(block) {
    let output = `<div data-rich-type="column-gallery">\n`;
    let isValid = true;

    block.querySelectorAll('.column-item').forEach(item => {
        // Получаем значения элементов
        const url = item.querySelector('.url-container input[type="text"]').value.trim();
        const text = item.querySelector('.right-column textarea').value.trim();
        const title = item.querySelector('.right-column input[type="text"]').value.trim();
        const position = item.querySelector('.left-column select').value;
		const widthInput = item.querySelector('.width-container input[type="number"]');
        const width = widthInput ? widthInput.value.trim() : '';

        // Проверяем, что обязательные поля заполнены
        if (!url || !text) {
            alert('Поля "URL" и "Текст" в блоке "Картинка и текст сбоку" обязательны для заполнения.');
            isValid = false;
            return;
        }

        // Генерируем HTML в зависимости от положения картинки
        if (position === 'left') {
            output += `<div>\n<img src="${url}" alt="Пример изображения"`;
            if (width) {
                output += ` style="width: ${width}%"`; // Добавляем ширину, если она указана
            }
            output += `>\n<div>\n`;	
            if (title) output += `<div data-block="title">${title}</div>\n`;
            output += `<div data-block="text">${text}</div>\n</div>\n</div>\n`;
        } else {
            output += `<div>\n<div>\n`;
            if (title) output += `<div data-block="title">${title}</div>\n`;
            output += `<div data-block="text">${text}</div>\n</div>\n<img src="${url}" alt="Пример изображения"`;
            if (width) {
                output += ` style="width: ${width}%"`; // Добавляем ширину, если она указана
            }
            output += `>\n</div>\n`;
        }
    });

    if (!isValid) return '';

    output += '</div>';
    return output;
}

let isDescriptionDirty = true; // Флаг для отслеживания изменений в блоках

// Функция для генерации описания
function generateDescription() {
    const blocks = document.querySelectorAll('.block');
    let generatedHTML = '';
    let isValid = true;

    blocks.forEach(block => {
        const type = block.dataset.type;
        switch (type) {
            case 'text':
                const textValue = block.querySelector('textarea').value;
                if (!textValue.trim()) {
                    alert('Поле "Текст" в блоке "Текст" не заполнено.');
                    isValid = false;
                    return;
                }
                generatedHTML += `${textValue}\n`;
                break;
            case 'row-gallery':
                const imageBlocks = block.querySelectorAll('.image-block');
                if (imageBlocks.length === 0) {
                    alert('В блоке "Картинки в ряд" нет добавленных картинок.');
                    isValid = false;
                    return;
                }
                generatedHTML += `<div data-rich-type="row-gallery">\n`;
                generatedHTML += ` <div data-block="images">\n`;
                imageBlocks.forEach(imageBlock => {
                    const url = imageBlock.querySelector('input[type="text"]').value;
                    const title = imageBlock.querySelectorAll('input[type="text"]')[1].value;
                    const text = imageBlock.querySelector('textarea').value;
                    if (!url.trim()) {
                        alert('Поле "URL" в блоке "Картинки в ряд" не заполнено.');
                        isValid = false;
                        return;
                    }
                    generatedHTML += `  <div>\n    <img src="${url}" alt="Пример изображения">\n`;
                    if (title) generatedHTML += `    <div data-block="title">${title}</div>\n`;
                    if (text) generatedHTML += `    <div data-block="text">${text}</div>\n`;
                    generatedHTML += `  </div>\n`;
                });
                generatedHTML += ` </div>\n`;
                generatedHTML += `</div>\n`;
                break;
            case 'column-gallery':
                const columnItems = block.querySelectorAll('.column-item');
                if (columnItems.length === 0) {
                    alert('В блоке "Картинка и текст сбоку" нет добавленных элементов.');
                    isValid = false;
                    return;
                }
                generatedHTML += generateColumnGalleryHTML(block);
                break;
            case 'single-media':
                const url = block.querySelector('input[type="text"]').value;
                const title = block.querySelectorAll('input[type="text"]')[1].value;
                const text = block.querySelector('textarea').value;
                const mediaType = block.querySelector('select').value;
                const isWide = block.querySelector('input[type="checkbox"]').checked;
                const width = block.querySelector('.width-container input').value;

                if (!url.trim()) {
                    alert('Поле "URL" в блоке "Картинка во всю ширину" не заполнено.');
                    isValid = false;
                    return;
                }

                if (mediaType === 'image') {
                    generatedHTML += `<div data-rich-type="single-media" ${isWide ? 'data-view="wide"' : ''}>\n`;
                    generatedHTML += `  <img src="${url}" alt="Пример изображения"`;
                    if (width && !isWide) {
                        generatedHTML += ` style="width: ${width}%"`;
                    }
                    generatedHTML += `>\n`;
                    if (title) generatedHTML += `  <div data-block="title">${title}</div>\n`;
                    if (text) generatedHTML += `  <div data-block="text">${text}</div>\n`;
                    generatedHTML += `</div>\n`;
                } else {
                    generatedHTML += `<div data-rich-type="single-media">\n`;
                    generatedHTML += `  <video controls><source src="${url}" type="video/mp4">Видео</video>\n`;
                    if (title) generatedHTML += `  <div data-block="title">${title}</div>\n`;
                    if (text) generatedHTML += `  <div data-block="text">${text}</div>\n`;
                    generatedHTML += `</div>\n`;
                }
                break;
        }
    });

    if (isValid) {
        document.getElementById('generated-description').textContent = generatedHTML;
    }
    return isValid;
}

// Обработчик для кнопки "Сформировать"
document.getElementById('generate-btn').addEventListener('click', function() {
    generateDescription();
});

document.getElementById('copy-btn').addEventListener('click', function() {
    const generatedDescription = document.getElementById('generated-description').textContent;
    if (generatedDescription.trim()) {
        navigator.clipboard.writeText(generatedDescription).then(() => {
            alert('HTML скопирован в буфер обмена!');
        });
    } else {
        alert('Нет сгенерированного HTML для копирования.');
    }
});

// Функции для работы с изображениями

function updateImagePreview(input) {
    // Находим контейнер с URL
    const urlContainer = input.closest('.url-container');
    if (!urlContainer) {
        console.error('Не найден .url-container');
        return;
    }

    let previewContainer, imageSizeElement;

    // Проверяем, есть ли новый контейнер .media-controls-container
    const mediaControlsContainer = urlContainer.nextElementSibling;
    if (mediaControlsContainer && mediaControlsContainer.classList.contains('media-controls-container')) {
        // Новая структура: ищем элементы внутри .media-controls-container
        previewContainer = mediaControlsContainer.querySelector('.image-preview-container');
        imageSizeElement = mediaControlsContainer.querySelector('.image-size');
    } else {
        // Старая структура: ищем элементы как раньше
        previewContainer = urlContainer.nextElementSibling;
        if (previewContainer && previewContainer.classList.contains('image-preview-container')) {
            imageSizeElement = previewContainer.nextElementSibling;
        }
    }

    // Проверяем, найдены ли необходимые элементы
    if (!previewContainer || !previewContainer.classList.contains('image-preview-container')) {
        console.error('Не найден .image-preview-container');
        return;
    }

    const preview = previewContainer.querySelector('.image-preview');
    if (!preview) {
        console.error('Не найдено .image-preview');
        return;
    }

    if (!imageSizeElement || !imageSizeElement.classList.contains('image-size')) {
        console.error('Не найден .image-size');
        return;
    }

    // Получаем URL из поля ввода
    const url = input.value.trim();
    if (url) {
        const img = new Image();
        img.src = url;
        img.onload = function () {
            preview.src = url; // Устанавливаем URL превью
            preview.style.display = 'block'; // Показываем превью
            imageSizeElement.textContent = `Размер: ${img.naturalWidth}x${img.naturalHeight} px`; // Отображаем размер изображения
        };
        img.onerror = function () {
            preview.style.display = 'none'; // Скрываем превью, если изображение не загрузилось
            imageSizeElement.textContent = ''; // Очищаем текст с размером
            alert('Не удалось загрузить изображение.');
        };
    } else {
        preview.style.display = 'none'; // Скрываем превью, если URL пустой
        imageSizeElement.textContent = ''; // Очищаем текст с размером
    }
}


function openImagePreview(url) {
    if (!url.trim()) {
        alert('URL изображения не заполнен.');
        return;
    }

    const previewedImage = document.getElementById('previewed-image');
    const imageInfo = document.getElementById('image-info');

    // Загружаем изображение
    previewedImage.src = url;

    // Обработчик события, который срабатывает, когда изображение загружено
    previewedImage.onload = function () {
        // Получаем размеры изображения
        const width = previewedImage.naturalWidth;
        const height = previewedImage.naturalHeight;

        // Отображаем информацию о размере
        imageInfo.textContent = `Размер изображения: ${width}x${height} пикселей`;

        // Показываем модальное окно и оверлей
        document.getElementById('image-preview-overlay').style.display = 'block';
        document.getElementById('image-preview-modal').style.display = 'block';
    };

    // Обработчик ошибки, если изображение не загрузилось
    previewedImage.onerror = function () {
        alert('Не удалось загрузить изображение.');
    };
}

function closeImagePreview() {
    const modal = document.getElementById('image-preview-modal');
    const overlay = document.getElementById('image-preview-overlay');
    modal.style.display = 'none'; // Скрываем модальное окно
    overlay.style.display = 'none'; // Скрываем оверлей
}

// Функции для работы с табами

document.querySelectorAll('#top-bar .tab').forEach(tab => {
    tab.addEventListener('click', function () {
        // Убираем активный класс у всех табов
        document.querySelectorAll('#top-bar .tab').forEach(t => t.classList.remove('active'));
        // Добавляем активный класс текущему табу
        this.classList.add('active');

        // Скрываем все контейнеры
        document.querySelectorAll('#content-container .content').forEach(content => {
            content.classList.remove('active');
        });

        // Показываем выбранный контейнер
        const tabType = this.getAttribute('data-tab');
        const content = document.getElementById(`${tabType}-content`);
        if (content) {
            content.classList.add('active');

            // Если выбран предпросмотр веб, загружаем HTML в iframe
            if (tabType === 'preview-web') {
                const generatedDescription = document.getElementById('generated-description').textContent;
                const iframe = document.getElementById('preview-iframe');
                iframe.srcdoc = generatedDescription;
            }
        }
    });
});

document.addEventListener('DOMContentLoaded', function () {
    const tabs = document.querySelectorAll('.tab');

    tabs.forEach(tab => {
        tab.addEventListener('click', function () {
            // Убираем активный класс у всех табов
            tabs.forEach(t => t.classList.remove('active'));
            // Добавляем активный класс текущему табу
            tab.classList.add('active');
        });
    });
});

document.addEventListener('DOMContentLoaded', function () {
    const secondTopBar = document.getElementById('second-top-bar');
    const tabs = document.querySelectorAll('.tab');

    tabs.forEach(tab => {
        tab.addEventListener('click', function () {
            const tabType = this.getAttribute('data-tab');

            // Убираем активный класс у всех табов
            tabs.forEach(t => t.classList.remove('active'));

            // Добавляем активный класс текущему табу
            this.classList.add('active');

            // Управляем видимостью второго топ-бара
            if (tabType === 'constructor') {
                secondTopBar.style.display = 'flex'; // Показываем второй топ-бар
                setTimeout(() => {
                    secondTopBar.style.opacity = '1'; // Плавное появление
                }, 10);
            } else {
                secondTopBar.style.opacity = '0'; // Плавное исчезновение
                setTimeout(() => {
                    secondTopBar.style.display = 'none'; // Скрываем второй топ-бар
                }, 300); // Время анимации
            }
        });
    });
});

//  Обработчики событий для кнопок

document.getElementById('add-block-btn').addEventListener('click', function() {
    document.getElementById('overlay').style.display = 'block';
    document.getElementById('modal').style.display = 'block';
    updatePreview();
});

document.getElementById('block-type').addEventListener('change', function() {
    updatePreview();
});

document.getElementById('confirm-block-type').addEventListener('click', function() {
    const blockType = document.getElementById('block-type').value;
    addBlock(blockType);
    document.getElementById('overlay').style.display = 'none';
    document.getElementById('modal').style.display = 'none';
});

function updatePreview() {
    const blockType = document.getElementById('block-type').value;
    const previewImage = document.getElementById('preview-image');
    previewImage.src = blockImages[blockType];
    previewImage.style.display = 'block';
}

const blockImages = {
    'text': 'icon/1.png',
    'row-gallery': 'icon/2.png',
    'column-gallery': 'icon/3.png',
    'single-media': 'icon/4.png'
};