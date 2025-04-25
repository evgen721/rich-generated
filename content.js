// Инициализация и обработка событий

document.addEventListener('DOMContentLoaded', function () {
    // Обработчики для модалки превью изображения
    document.getElementById('closemodal').addEventListener('click', function() {
        closeModal('image-preview-modal', 'image-preview-overlay');
    });

    document.getElementById('image-preview-overlay').addEventListener('click', function(event) {
        if (event.target === this) {
            closeModal('image-preview-modal', 'image-preview-overlay');
        }
    });

    // Обработчики для модалки информации о блоке
    document.getElementById('close-block-info-modal').addEventListener('click', function() {
        closeModal('block-info-modal', 'block-info-overlay');
    });

    document.getElementById('block-info-overlay').addEventListener('click', function(event) {
        if (event.target === this) {
            closeModal('block-info-modal', 'block-info-overlay');
        }
    });
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


function showBlockInfo(button) {
    const blockElement = button.closest('.block');
    if (!blockElement) return;

    const blockType = blockElement.getAttribute('data-type');
    if (!blockType || !blockInfoTexts[blockType]) {
        alert('Информация для этого типа блока не найдена.');
        return;
    }

    // Используем innerHTML вместо textContent для интерпретации HTML-тегов
    document.getElementById('block-info-content').innerHTML = blockInfoTexts[blockType];

    document.getElementById('block-info-overlay').style.display = 'block';
    document.getElementById('block-info-modal').style.display = 'block';
}



// Функции для работы с блоками

// В функции addBlock добавляем номер блока
function addBlock(type) {
    const container = document.getElementById('blocks-container');
    const block = document.createElement('div');
    block.className = 'block';
    block.dataset.type = type;

    // Создаем верхний контейнер в стиле Windows XP
    const topContainer = document.createElement('div');
    topContainer.className = 'block-top-container';

    // Определяем название блока
    const blockTitles = {
        'text': 'Текст',
        'row-gallery': 'Картинки в ряд',
        'column-gallery': 'Картинка слева/справа',
        'single-media': 'Картинка (+во всю ширину)'
    };
    const blockTitle = blockTitles[type] || 'Блок';

    // Контейнер для информации о блоке (номер + название)
    const blockInfo = document.createElement('div');
    blockInfo.className = 'block-info';
    blockInfo.innerHTML = `
        <div class="block-number">${container.children.length + 1}</div>
        <div class="block-title">${blockTitle}</div>
    `;

    // Кнопки управления с иконками
    const controls = document.createElement('div');
    controls.className = 'block-controls';
    controls.innerHTML = `
	<button class="block-control-btn info-btn" onclick="showBlockInfo(this)" title="Информация о блоке">
        <img src="icon/инфо.png" alt="i" class="control-icon">
    </button>
        <button class="block-control-btn move-up" onclick="moveBlockUp(this)" title="Переместить вверх">
            <img src="icon/вверх.png" alt="↑" class="control-icon">
        </button>
        <button class="block-control-btn move-down" onclick="moveBlockDown(this)" title="Переместить вниз">
            <img src="icon/вниз.png" alt="↓" class="control-icon">
        </button>
        <button class="block-control-btn delete-btn" onclick="deleteBlock(this)" title="Удалить блок">
            <img src="icon/крест.png" alt="×" class="control-icon">
        </button>
    `;

    // Собираем верхнюю панель
    topContainer.appendChild(blockInfo);
    topContainer.appendChild(controls);
    block.appendChild(topContainer);
	
	const contentContainer = document.createElement('div');
    contentContainer.className = 'block-content';

    // Добавляем содержимое блока в зависимости от типа
    switch (type) {
        case 'text':
             contentContainer.innerHTML = `
                <div class="text-controls">
                    <button class="button-all" onclick="insertHeader(this)">Заголовок</button>
					<button class="button-all" onclick="insertParagraph(this)">Абзац</button>
                    <button class="button-all" onclick="insertOrderedList(this)">Нумерованный список</button>
                    <button class="button-all" onclick="insertUnorderedList(this)">Маркированный список</button>
                    <button class="button-all" onclick="insertGiperURL(this)">Гиперссылка</button>
					<button class="button-all" onclick="makeBold(this)">Полужирный</button>
                    <button class="button-all" onclick="makeItalic(this)">Курсив</button>
                </div>
                <textarea class="text-block" placeholder="Введите текст"></textarea>`;
            break;
            
        case 'row-gallery':
            contentContainer.innerHTML += `<div class="row-gallery"></div>
                             <button class="button-all" onclick="addImageRow(this)">+Добавить картинку в ряду</button>`;
            break;
            
        case 'column-gallery':
            contentContainer.innerHTML += createColumnGalleryBlock();
            break;
            
        case 'single-media':
            contentContainer.innerHTML += `
                <div class="single-media-block">
                    <div class="left-column">
                        <select class="media-type-select" onchange="toggleWidthField(this)">
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
								<span class="width-label">Ширина картинки</span>
                                      <select class="width-select">                                
                                <option value="10">10%</option>
                                <option value="20">20%</option>
                                <option value="30">30%</option>
                                <option value="40">40%</option>
                                <option value="50">50%</option>
                                <option value="60">60%</option>
                                <option value="70">70%</option>
                                <option value="80">80%</option>
                                <option value="90">90%</option>
								<option value="100" selected>100% (по умолчанию)</option>
                            </select>						
                                </div>
                                <label>
                                    <input type="checkbox" class="checkbox" onchange="toggleWidthField(this)"> Растянуть во всю ширину (необязательно)
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

    block.appendChild(contentContainer);
    container.appendChild(block);
}

// Обновляем функцию moveBlockUp для обновления номеров
function moveBlockUp(button) {
    const block = button.closest('.block');
    const prevBlock = block.previousElementSibling;
    if (prevBlock) {
        block.parentElement.insertBefore(block, prevBlock);
        updateBlockNumbers();
    }
}

// Обновляем функцию moveBlockDown для обновления номеров
function moveBlockDown(button) {
    const block = button.closest('.block');
    const nextBlock = block.nextElementSibling;
    if (nextBlock) {
        block.parentElement.insertBefore(nextBlock, block);
        updateBlockNumbers();
    }
}

// Обновляем функцию deleteBlock для обновления номеров
function deleteBlock(button) {
    const block = button.closest('.block');
    block.remove();
    updateBlockNumbers();
}

// Новая функция для обновления номеров блоков
function updateBlockNumbers() {
    const blocks = document.querySelectorAll('.block');
    blocks.forEach((block, index) => {
        const blockNumber = block.querySelector('.block-number');
        if (blockNumber) {
            blockNumber.textContent = index + 1;
        }
    });
}

function toggleWidthField(element) {
    // element может быть как checkbox, так и select
    const mediaBlock = element.closest('.single-media-block');
    const widthSelect = mediaBlock.querySelector('.width-select');
    const mediaTypeSelect = mediaBlock.querySelector('.media-type-select');
    const checkbox = mediaBlock.querySelector('.checkbox');
    
    // Если выбран тип "видео", блокируем оба элемента
    if (mediaTypeSelect.value === 'video') {
        widthSelect.disabled = true;
        checkbox.disabled = true;
        widthSelect.value = '100';
        checkbox.checked = false;
    } 
    // Если выбран тип "изображение", работаем как раньше
    else {
        if (checkbox.checked) {
            widthSelect.disabled = true;
            widthSelect.value = '100';
        } else {
            widthSelect.disabled = false;
        }
        checkbox.disabled = false;
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
                            <select>                               
                                <option value="20">20%</option>
                                <option value="30">30%</option>
                                <option value="40">40%</option>
								<option value="" selected>50% (по умолчанию)</option>
                                <option value="60">60%</option>
                                <option value="70">70%</option>
                                <option value="80">80%</option>
                            </select>
							 <span class="width-label">Ширина колонки с картинкой</span>
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
        updateBlockNumbers();
    }
}

function moveBlockDown(button) {
    const block = button.closest('.block');
    const nextBlock = block.nextElementSibling;
    if (nextBlock) {
        block.parentElement.insertBefore(nextBlock, block);
        updateBlockNumbers();
    }
}

function deleteBlock(button) {
    const block = button.closest('.block');
    block.remove();
    updateBlockNumbers();
}

function updateBlockNumbers() {
    const blocks = document.querySelectorAll('.block');
    blocks.forEach((block, index) => {
        const blockNumber = block.querySelector('.block-number');
        if (blockNumber) {
            blockNumber.textContent = index + 1;
        }
    });
}

// Функции для работы с текстом

function insertParagraph(button) {
    const block = button.closest('.block');
    const textarea = block.querySelector('textarea');
    const startPos = textarea.selectionStart;
    const endPos = textarea.selectionEnd;
    const selectedText = textarea.value.substring(startPos, endPos);
    
    if (selectedText) {
        const textBefore = textarea.value.substring(0, startPos);
        const textAfter = textarea.value.substring(endPos);
        textarea.value = textBefore + '<p>' + selectedText + '</p>' + textAfter;
        const newCursorPos = startPos + '<p>'.length + selectedText.length + '</p>'.length;
        textarea.setSelectionRange(newCursorPos, newCursorPos);
    } else {
        const textBefore = textarea.value.substring(0, startPos);
        const textAfter = textarea.value.substring(startPos);
        textarea.value = textBefore + '<p></p>' + textAfter;
        const newCursorPos = startPos + '<p>'.length;
        textarea.setSelectionRange(newCursorPos, newCursorPos);
    }
    
    textarea.focus();
}

function insertOrderedList(button) {
    const block = button.closest('.block');
    const textarea = block.querySelector('textarea');
	const cursorPosition = textarea.selectionStart;
	const textBefore = textarea.value.substring(0, cursorPosition);
    const textAfter = textarea.value.substring(cursorPosition);
	textarea.value = textBefore + '<ol>\n<li>пункт1</li>\n<li>пункт2</li>\n<li>пункт3</li>\n</ol>' + textAfter;
    const newCursorPosition = cursorPosition + '<ol>\n<li>пункт1</li>\n<li>пункт2</li>\n<li>пункт3</li>\n</ol>'.length;
    textarea.setSelectionRange(newCursorPosition, newCursorPosition);
    textarea.focus();
}

function insertUnorderedList(button) {
    const block = button.closest('.block');
    const textarea = block.querySelector('textarea');
	const cursorPosition = textarea.selectionStart;
	const textBefore = textarea.value.substring(0, cursorPosition);
    const textAfter = textarea.value.substring(cursorPosition);
	textarea.value = textBefore + '<ul>\n<li>пункт1</li>\n<li>пункт2</li>\n<li>пункт3</li>\n</ul>' + textAfter;
    const newCursorPosition = cursorPosition + '<ul>\n<li>пункт1</li>\n<li>пункт2</li>\n<li>пункт3</li>\n</ul>'.length;
    textarea.setSelectionRange(newCursorPosition, newCursorPosition);
    textarea.focus();
}

function insertHeader(button) {
    const block = button.closest('.block');
    const textarea = block.querySelector('textarea');
    const startPos = textarea.selectionStart;
    const endPos = textarea.selectionEnd;
    const selectedText = textarea.value.substring(startPos, endPos);
    
    if (selectedText) {
        const textBefore = textarea.value.substring(0, startPos);
        const textAfter = textarea.value.substring(endPos);
        textarea.value = textBefore + '<p><b>' + selectedText + '</b></p>' + textAfter;
        const newCursorPos = startPos + '<p><b>'.length + selectedText.length + '</b></p>'.length;
        textarea.setSelectionRange(newCursorPos, newCursorPos);
    } else {
        const textBefore = textarea.value.substring(0, startPos);
        const textAfter = textarea.value.substring(startPos);
        textarea.value = textBefore + '<p><b>Заголовок</b></p>' + textAfter;
        const newCursorPos = startPos + '<p><b>Заголовок</b></p>'.length;
        textarea.setSelectionRange(newCursorPos, newCursorPos);
    }
    
    textarea.focus();
}

function insertGiperURL(button) {
    const block = button.closest('.block');
    const textarea = block.querySelector('textarea');
	const cursorPosition = textarea.selectionStart;
	const textBefore = textarea.value.substring(0, cursorPosition);
    const textAfter = textarea.value.substring(cursorPosition);
	textarea.value = textBefore + '<a href="ссылка">Текст у ссылки</a>' + textAfter;
    const newCursorPosition = cursorPosition + '<a href="ссылка">Текст у ссылки</a>'.length;
    textarea.setSelectionRange(newCursorPosition, newCursorPosition);
    textarea.focus();
}

function makeBold(button) {
    const block = button.closest('.block');
    const textarea = block.querySelector('textarea');
    const startPos = textarea.selectionStart;
    const endPos = textarea.selectionEnd;
    const selectedText = textarea.value.substring(startPos, endPos);

    if (!selectedText) return; // Если нет выделения — ничего не делаем

    const textBefore = textarea.value.substring(0, startPos);
    const textAfter = textarea.value.substring(endPos);
    
    // Оборачиваем выделенный текст в <b></b>
    textarea.value = textBefore + '<b>' + selectedText + '</b>' + textAfter;
    
    // Устанавливаем курсор после закрывающего тега
    const newCursorPos = startPos + '<b>'.length + selectedText.length + '</b>'.length;
    textarea.setSelectionRange(newCursorPos, newCursorPos);
    textarea.focus();
}

function makeItalic(button) {
    const block = button.closest('.block');
    const textarea = block.querySelector('textarea');
    const startPos = textarea.selectionStart;
    const endPos = textarea.selectionEnd;
    const selectedText = textarea.value.substring(startPos, endPos);

    if (!selectedText) return; // Если нет выделения — ничего не делаем

    const textBefore = textarea.value.substring(0, startPos);
    const textAfter = textarea.value.substring(endPos);
    
    // Оборачиваем выделенный текст в <i></i>
    textarea.value = textBefore + '<i>' + selectedText + '</i>' + textAfter;
    
    // Устанавливаем курсор после закрывающего тега
    const newCursorPos = startPos + '<i>'.length + selectedText.length + '</i>'.length;
    textarea.setSelectionRange(newCursorPos, newCursorPos);
    textarea.focus();
}

let isDescriptionDirty = true; // Флаг для отслеживания изменений в блоках

// Функция для генерации описания
function generateDescription() {
    const blocks = document.querySelectorAll('.block');
    let generatedHTML = '';
    let isValid = true;
    let errors = [];
    const blockTypes = {
        'text': 'Текст',
        'row-gallery': 'Картинки в ряд',
        'column-gallery': 'Картинка и текст сбоку',
        'single-media': 'Картинка во всю ширину'
    };

    blocks.forEach((block, index) => {
        const blockNumber = index + 1;
        const type = block.dataset.type;
        const blockName = blockTypes[type] || 'Блок';

        switch (type) {
            case 'text':
                const textValue = block.querySelector('textarea').value;
                if (!textValue.trim()) {
                    errors.push(`Блок №${blockNumber} (${blockName}): не заполнено поле "Текст"`);
                    isValid = false;
                } else {
                    generatedHTML += `${textValue}\n`;
                }
                break;

            case 'row-gallery':
                const imageBlocks = block.querySelectorAll('.image-block');
                if (imageBlocks.length === 0) {
                    errors.push(`Блок №${blockNumber} (${blockName}): нет добавленных картинок`);
                    isValid = false;
                } else {
                    generatedHTML += `<div data-rich-type="row-gallery">\n <div data-block="images">\n`;
                    
                    imageBlocks.forEach((imageBlock, imgIndex) => {
                        const url = imageBlock.querySelector('input[type="text"]').value;
                        const title = imageBlock.querySelectorAll('input[type="text"]')[1].value;
                        const text = imageBlock.querySelector('textarea').value;
                        
                        if (!url.trim()) {
                            errors.push(`Блок №${blockNumber} (${blockName}), изображение ${imgIndex + 1}: не заполнено поле "URL"`);
                            isValid = false;
                        } else {
                            generatedHTML += `  <div>\n    <img src="${url}" alt="Пример изображения">\n`;
                            if (title) generatedHTML += `    <div data-block="title">${title}</div>\n`;
                            if (text) generatedHTML += `    <div data-block="text">${text}</div>\n`;
                            generatedHTML += `  </div>\n`;
                        }
                    });
                    
                    generatedHTML += ` </div>\n</div>\n`;
                }
                break;

            case 'column-gallery':
    const columnItems = block.querySelectorAll('.column-item');
    if (columnItems.length === 0) {
        errors.push(`Блок №${blockNumber} (${blockName}): нет добавленных элементов`);
        isValid = false;
    } else {
        generatedHTML += `<div data-rich-type="column-gallery">\n`;
        
        columnItems.forEach((item, colIndex) => {
            const url = item.querySelector('.url-container input[type="text"]').value.trim();
            const text = item.querySelector('.right-column textarea').value.trim();
            const title = item.querySelector('.right-column input[type="text"]').value.trim();
            const position = item.querySelector('.left-column select').value;
            const widthSelect = item.querySelector('.width-container select');
            const width = widthSelect ? widthSelect.value.trim() : '';

            if (!url) {
                errors.push(`Блок №${blockNumber} (${blockName}), элемент ${colIndex + 1}: не заполнено поле "URL"`);
                isValid = false;
            }
            if (!text) {
                errors.push(`Блок №${blockNumber} (${blockName}), элемент ${colIndex + 1}: не заполнено поле "Текст"`);
                isValid = false;
            }

            if (url && text) {
                if (position === 'left') {
                    generatedHTML += `<div>\n<img src="${url}" alt="Пример изображения"`;
                    if (width) generatedHTML += ` style="width: ${width}%"`;
                    generatedHTML += `>\n<div>\n`;
                    if (title) generatedHTML += `<div data-block="title">${title}</div>\n`;
                    generatedHTML += `<div data-block="text">${text}</div>\n</div>\n</div>\n`;
                } else {
                    generatedHTML += `<div>\n<div>\n`;
                    if (title) generatedHTML += `<div data-block="title">${title}</div>\n`;
                    generatedHTML += `<div data-block="text">${text}</div>\n</div>\n<img src="${url}" alt="Пример изображения"`;
                    if (width) generatedHTML += ` style="width: ${width}%"`;
                    generatedHTML += `>\n</div>\n`;
                }
            }
        });
        
        generatedHTML += `</div>\n`;
    }
                break;

            case 'single-media':
                const url = block.querySelector('.url-container input[type="text"]').value;
                const title = block.querySelectorAll('.right-column input[type="text"]')[0]?.value || '';
                const text = block.querySelector('.right-column textarea')?.value || '';
                const mediaType = block.querySelector('select').value;
                const isWide = block.querySelector('input[type="checkbox"]').checked;
                const widthSelect = block.querySelector('.width-select');
                const width = widthSelect ? widthSelect.value : '100';

                if (!url.trim()) {
                    errors.push(`Блок №${blockNumber} (${blockName}): не заполнено поле "URL"`);
                    isValid = false;
                } else {
                    if (mediaType === 'image') {
                        generatedHTML += `<div data-rich-type="single-media" ${isWide ? 'data-view="wide"' : ''}>\n`;
                        generatedHTML += `  <img src="${url}" alt="Пример изображения"`;
                        if (width !== '100' && !isWide) generatedHTML += ` style="width: ${width}%"`;
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
                }
                break;
        }
    });

    if (!isValid) {
        let errorMessage = "Обнаружены ошибки в следующих блоках:\n\n";
        errorMessage += errors.join("\n");
        errorMessage += "\n\nПожалуйста, исправьте ошибки и попробуйте снова.";
        alert(errorMessage);
        return false;
    }

    document.getElementById('generated-description').textContent = generatedHTML;
    return true;
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

function closeModal(modalId, overlayId) {
    const modal = document.getElementById(modalId);
    const overlay = document.getElementById(overlayId);
    if (modal && overlay) { // Проверка на существование элементов
        modal.style.display = 'none';
        overlay.style.display = 'none';
    }
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