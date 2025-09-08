// Подключение через <script defer> согласно п. 1.4.1  :contentReference[oaicite:6]{index=6}

const dlg = document.getElementById('contactDialog');
const openBtn = document.getElementById('openDialog');
const closeBtn = document.getElementById('closeDialog');
const form = document.getElementById('contactForm');
const successNotice = document.getElementById('successNotice');
let lastActive = null;

// Открыть модалку и сфокусироваться на первом интерактивном элементе (п. 1.3.1)  :contentReference[oaicite:7]{index=7}
openBtn?.addEventListener('click', () => {
  lastActive = document.activeElement;
  dlg.showModal();
  dlg.querySelector('input,select,textarea,button')?.focus();
});

// Закрыть модалку
closeBtn?.addEventListener('click', () => dlg.close('cancel'));

// Возврат фокуса на исходный элемент
dlg.addEventListener('close', () => { lastActive?.focus(); });

// ЛЁГКАЯ МАСКА ДЛЯ ТЕЛЕФОНА (п. 1.4.3)  :contentReference[oaicite:8]{index=8}
const phone = document.getElementById('phone');
phone?.addEventListener('input', () => {
  const digits = phone.value.replace(/\D/g,'').slice(0,11);
  const d = digits.replace(/^8/, '7');
  const parts = [];
  if (d.length > 0) parts.push('+7');
  if (d.length > 1) parts.push(' (' + d.slice(1,4));
  if (d.length >= 4) parts[parts.length - 1] += ')';
  if (d.length >= 5) parts.push(' ' + d.slice(4,7));
  if (d.length >= 8) parts.push('-' + d.slice(7,9));
  if (d.length >= 10) parts.push('-' + d.slice(9,11));
  phone.value = parts.join('');
});
// Жёсткий pattern (дублируем из HTML, если захотим задавать из JS)
phone?.setAttribute('pattern', '^\\+7 \\(\\d{3}\\) \\d{3}-\\d{2}-\\d{2}$');

// ВАЛИДАЦИЯ (Constraint Validation API, п. 1.4.2)  :contentReference[oaicite:9]{index=9}
form?.addEventListener('submit', (e) => {
  // 1) Сброс кастомных сообщений
  [...form.elements].forEach(el => el.setCustomValidity?.(''));

  // 2) Проверка встроенных ограничений
  if (!form.checkValidity()) {
    e.preventDefault();

    // Таргетированное сообщение для email
    const email = form.elements.email;
    if (email?.validity.typeMismatch) {
      email.setCustomValidity('Введите корректный e-mail, например name@example.com');
    }

    // Таргетированное сообщение для телефона
    const phoneEl = form.elements.phone;
    if (phoneEl?.validity.patternMismatch || phoneEl?.validity.valueMissing) {
      phoneEl.setCustomValidity('Укажите телефон в формате +7 (900) 000-00-00');
    }

    form.reportValidity();

    // A11y: подсветка проблемных полей
    [...form.elements].forEach(el => {
      if (el.willValidate) el.toggleAttribute('aria-invalid', !el.checkValidity());
    });
    return;
  }

  // 3) «Успешная отправка» без сервера: показываем сообщение и закрываем <dialog> (п. 1.4.2)  :contentReference[oaicite:10]{index=10}
  e.preventDefault();
  successNotice.textContent = 'Спасибо! Форма успешно отправлена.';
  dlg.close('success');
  form.reset();

  // ДОП: Мок-переход на отдельную страницу "Спасибо" через 900 мс
  setTimeout(() => {
    window.location.href = 'thankyou.html';
  }, 900);
});
