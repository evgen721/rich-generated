        const blockImages = {
            'text': 'icon/1.png',
            'row-gallery': 'icon/2.png',
            'column-gallery': 'icon/3.png',
            'single-media': 'icon/4.png'
        };

        document.getElementById('add-block-btn').addEventListener('click', function() {
            document.getElementById('overlay').style.display = 'block';
            document.getElementById('modal').style.display = 'block';
            updatePreview();
        });

        document.getElementById('block-type').addEventListener('change', function() {
            updatePreview();
        });

        function updatePreview() {
            const blockType = document.getElementById('block-type').value;
            const previewImage = document.getElementById('preview-image');
            previewImage.src = blockImages[blockType];
            previewImage.style.display = 'block';
        }

        document.getElementById('confirm-block-type').addEventListener('click', function() {
            const blockType = document.getElementById('block-type').value;
            addBlock(blockType);
            document.getElementById('overlay').style.display = 'none';
            document.getElementById('modal').style.display = 'none';
        });

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
                            <button onclick="insertParagraph(this)">Абзац</button>
                            <button onclick="insertOrderedList(this)">Нумерованный список</button>
                            <button onclick="insertUnorderedList(this)">Маркированный список</button>
                            <button onclick="insertHeader(this)">Заголовок</button>
                        </div>
                        <textarea id="text1" placeholder="Введите текст"></textarea>`;
                    break;
                case 'row-gallery':
                    block.innerHTML += `<div class="row-gallery"></div>
                                       <button onclick="addImageRow(this)">+Добавить картинку в ряду</button>`;
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
                    <input type="text" placeholder="URL*" class="required">
                    <button class="preview-btn" onclick="openImagePreview(this.previousElementSibling.value)">
                        <img src="icon/5.png" alt="Просмотр">
                    </button>
                </div>
                <label><input type="checkbox" class="checkbox"> Во всю ширину</label>
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

        function insertParagraph(button) {
            const block = button.closest('.block');
            const textarea = block.querySelector('textarea');
            textarea.value += '<p></p>';
        }

        function insertOrderedList(button) {
            const block = button.closest('.block');
            const textarea = block.querySelector('textarea');
            textarea.value += '<ol>\n<li>пункт1</li>\n<li>пункт2</li>\n<li>пункт3</li>\n</ol>';
        }

        function insertUnorderedList(button) {
            const block = button.closest('.block');
            const textarea = block.querySelector('textarea');
            textarea.value += '<ul>\n<li>пункт1</li>\n<li>пункт2</li>\n<li>пункт3</li>\n</ul>';
        }

        function insertHeader(button) {
            const block = button.closest('.block');
            const textarea = block.querySelector('textarea');
            textarea.value += '<p><b>Заголовок</b></p>';
        }

function createColumnGalleryBlock() {
    return `
        <div class="column-gallery-block">
            <div class="column-item">
                <div class="left-column">
                    <select onchange="toggleTextOrder(this)">
                        <option value="left">Картинка слева</option>
                        <option value="right">Картинка справа</option>
                    </select>
                    <div class="url-container">
                        <input type="url" placeholder="URL картинки*" class="required">
                        <button class="preview-btn" onclick="openImagePreview(this.previousElementSibling.value)">
                            <img src="icon/5.png" alt="Просмотр">
                        </button>
                    </div>
                </div>
                <div class="right-column">
                    <input type="text" placeholder="Заголовок">
                    <textarea placeholder="Текст*"></textarea>
                </div>
                <div class="delete-btn" onclick="deleteColumnItem(this)">✕</div>
            </div>
            <button id="addblock1" onclick="addColumnItem(this)">+Добавить картинку</button>
        </div>`;
}

function addImageRow(button) {
    const block = button.parentElement;
    const gallery = block.querySelector('.row-gallery');
    const imageCount = gallery.querySelectorAll('.image-block').length;
    if (imageCount >= 6) return;

    const imageBlock = document.createElement('div');
    imageBlock.className = 'image-block';
    imageBlock.innerHTML = `
        <div class="url-container">
            <input type="text" placeholder="URL картинки*" class="required">
            <button class="preview-btn" onclick="openImagePreview(this.previousElementSibling.value)">
                <img src="icon/5.png" alt="Просмотр">
            </button>
        </div>
        <input type="text" placeholder="Заголовок">
        <textarea placeholder="Текст"></textarea>
        <div class="delete-btn" onclick="deleteImageRow(this)">✕</div>
    `;
    gallery.appendChild(imageBlock);
}

        function deleteImageRow(button) {
            const imageBlock = button.parentElement;
            imageBlock.remove();
        }

function addColumnItem(button) {
    const block = button.parentElement;
    const newItem = document.createElement('div');
    newItem.className = 'column-item';
    newItem.innerHTML = `
        <div class="left-column">
            <select onchange="toggleTextOrder(this)">
                <option value="left">Картинка слева</option>
                <option value="right">Картинка справа</option>
            </select>
            <div class="url-container">
                <input type="url" placeholder="URL картинки*" class="required">
                <button class="preview-btn" onclick="openImagePreview(this.previousElementSibling.value)">
                    <img src="icon/5.png" alt="Просмотр">
                </button>
            </div>
        </div>
        <div class="right-column">
            <input type="text" placeholder="Заголовок">
            <textarea placeholder="Текст*"></textarea>
        </div>
        <div class="delete-btn" onclick="deleteColumnItem(this)">✕</div>
    `;
    block.insertBefore(newItem, button);
}

        function deleteColumnItem(button) {
            const item = button.closest('.column-item');
            item.remove();
        }

        function toggleTextOrder(select) {
            // Ничего не делаем, так как поля не должны перемещаться
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

        document.getElementById('generate-btn').addEventListener('click', function() {
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
                        generatedHTML += `${textValue}\n\n`;
                        break;
                    case 'row-gallery':
                        const imageBlocks = block.querySelectorAll('.image-block');
                        if (imageBlocks.length === 0) {
                            alert('В блоке "Картинки в ряд" нет добавленных картинок.');
                            isValid = false;
                            return;
                        }
                        generatedHTML += `<div data-rich-type="row-gallery">\n`;
generatedHTML += ` <div data-block="images">\n`; // Добавляем обертку для изображений
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
generatedHTML += ` </div>\n`; // Закрываем обертку для изображений
generatedHTML += `</div>\n\n`;
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
                        if (!url.trim()) {
                            alert('Поле "URL" в блоке "Картинка во всю ширину" не заполнено.');
                            isValid = false;
                            return;
                        }
                        if (mediaType === 'image') {
                            generatedHTML += `<div data-rich-type="single-media" ${isWide ? 'data-view="wide"' : ''}>\n`;
                            generatedHTML += `  <img src="${url}" alt="Пример изображения">\n`;
                            if (title) generatedHTML += `  <div data-block="title">${title}</div>\n`;
                            if (text) generatedHTML += `  <div data-block="text">${text}</div>\n`;
                            generatedHTML += `</div>\n\n`;
                        } else {
                            generatedHTML += `<div data-rich-type="single-media">\n`;
                            generatedHTML += `  <video controls><source src="${url}" type="video/mp4">Видео</video>\n`;
                            if (title) generatedHTML += `  <div data-block="title">${title}</div>\n`;
                            if (text) generatedHTML += `  <div data-block="text">${text}</div>\n`;
                            generatedHTML += `</div>\n\n`;
                        }
                        break;
                }
            });

            if (isValid) {
                document.getElementById('generated-description').textContent = generatedHTML;
            }
        });

        function generateColumnGalleryHTML(block) {
            let output = `<div data-rich-type="column-gallery">\n`;
            let isValid = true;

            block.querySelectorAll('.column-item').forEach(item => {
                const url = item.querySelector('input[type="url"]').value.trim();
                const text = item.querySelector('textarea').value.trim();
                const title = item.querySelector('input[type="text"]').value.trim();
                const position = item.querySelector('select').value;

                if (!url.trim() || !text.trim()) {
                    alert('Поля "URL" и "Текст" в блоке "Картинка и текст сбоку" обязательны для заполнения.');
                    isValid = false;
                    return;
                }

                if (position === 'left') {
                    output += `<div>\n<img src="${url}" alt="Пример изображения">\n<div>\n`;
                    if (title) output += `<div data-block="title">${title}</div>\n`;
                    output += `<div data-block="text">${text}</div>\n</div>\n</div>\n`;
                } else {
                    output += `<div>\n<div>\n`;
                    if (title) output += `<div data-block="title">${title}</div>\n`;
                    output += `<div data-block="text">${text}</div>\n</div>\n<img src="${url}" alt="Пример изображения">\n</div>\n`;
                }
            });

            if (!isValid) return '';

            output += '</div>';
            return output;
        }

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
		function openImagePreview(url) {
    if (!url.trim()) {
        alert('URL изображения не заполнен.');
        return;
    }
	function closeImagePreview() {
    const modal = document.getElementById('image-preview-modal');
    const overlay = document.getElementById('image-preview-overlay');
    modal.style.display = 'none'; // Скрываем модальное окно
    overlay.style.display = 'none'; // Скрываем оверлей
}

// Назначаем обработчик события на кнопку
document.getElementById('closemodal').addEventListener('click', closeImagePreview);

    document.getElementById('previewed-image').src = url;
    document.getElementById('image-preview-overlay').style.display = 'block';
    document.getElementById('image-preview-modal').style.display = 'block';
}

document.getElementById('previewButton').addEventListener('click', function() {
    const generatedDescription = document.getElementById('generated-description').textContent;
    
    if (generatedDescription.trim()) {
        // Сохраняем текст в localStorage
        localStorage.setItem('previewDescription', generatedDescription);
        
        // Открываем новую вкладку с preview.html
        window.open('preview.html', '_blank');
    } else {
        alert('Нет сгенерированного описания для предпросмотра.');
    }
});