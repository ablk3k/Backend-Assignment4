$(function(){
  // Set current year
  $('#year, #year2, #year3, #year4, #year5').text(new Date().getFullYear());

  // --- RESERVE MODAL ---
  $('#reserveBtn, #reserveBtnTop, #reserveBtnTop2, #reserveBtnTop3, #reserveBtnTop4').on('click', function(){
    const el = document.getElementById('reserveModal');
    if(el){
      const modal = bootstrap.Modal.getOrCreateInstance(el);
      modal.show();
    } else {
      window.location.href = 'index.html';
    }
  });

  // --- RESERVATION FORM SUBMISSION ---
  $('#reserveForm').on('submit', function(e){
    e.preventDefault();

    const name = $('#name').val().trim();
    const phone = $('#phone').val().trim();
    const date = $('#resDate').val();
    const time = $('#resTime').val();
    const guests = parseInt($('#guests').val(), 10);

    if(!name || !phone || !date || !time || !guests){
      alert('Please fill all fields correctly.');
      return;
    }

    // Validate future datetime
    const selected = new Date(date + 'T' + time);
    const now = new Date();
    if(isNaN(selected.getTime())){
      alert('Please choose a valid date and time.');
      return;
    }
    if(selected < now){
      alert('Reservation time must be in the future.');
      return;
    }

    let reservations = JSON.parse(localStorage.getItem('reservations')) || [];
    reservations.push({ name, phone, date, time, guests });
    localStorage.setItem('reservations', JSON.stringify(reservations));

    alert('Reservation received! We will call to confirm.');
    $(this).trigger('reset');

    const modalEl = document.getElementById('reserveModal');
    const modalInst = bootstrap.Modal.getInstance(modalEl) || bootstrap.Modal.getOrCreateInstance(modalEl);
    modalInst.hide();
  });

  // --- CONTACT FORM (if present) ---
  $('#contactForm').on('submit', function(e){
    e.preventDefault();

    const name = $('#cname').val().trim();
    const email = $('#cemail').val().trim();
    const message = $('#cmessage').val().trim();

    if(!name || !email || !message || !validateEmail(email)){
      alert('Please enter a valid name, email, and message.');
      return;
    }

    alert('Thanks! Your message has been sent.');
    $(this).trigger('reset');
  });

  // --- DISH CARD OVERLAY ---
  $('.dish-card').each(function(){
    const overlay = $(this).find('.dish-overlay');
    if(overlay.length) overlay.hide();
    $(this).on('click', function(){
      $(this).find('.dish-overlay').toggle();
    });
  });

  // Page fade-in
  $('main.container').hide().fadeIn(600);

  // --- DARK/LIGHT MODE TOGGLE ---
  const themeBtn = document.getElementById('themeToggle');
  // load saved theme
  if(localStorage.getItem('theme') === 'dark'){
    document.body.classList.add('dark-mode');
    if(themeBtn) themeBtn.textContent = '☀️';
  } else {
    if(themeBtn) themeBtn.textContent = '🌙';
  }

  if(themeBtn){
    themeBtn.addEventListener('click', function(){
      document.body.classList.toggle('dark-mode');
      if(document.body.classList.contains('dark-mode')){
        themeBtn.textContent = '☀️';
        localStorage.setItem('theme', 'dark');
      } else {
        themeBtn.textContent = '🌙';
        localStorage.setItem('theme', 'light');
      }
    });
  }

  // --- GALLERY IMAGE CLICK -> DESCRIPTION MODAL ---
  $('.gallery-item').on('click', function(){
    const src = $(this).attr('src') || $(this).data('src');
    const title = $(this).data('title') || '';
    const desc = $(this).data('description') || '';

    $('#imageModalImg').attr('src', src);
    $('#imageModalTitle').text(title);
    $('#imageModalDesc').text(desc);

    const modalEl = document.getElementById('imageModal');
    if(modalEl){
      const modal = bootstrap.Modal.getOrCreateInstance(modalEl);
      modal.show();
    }
  });

});

// --- EMAIL VALIDATION ---
function validateEmail(email){
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

// --- API: Menu integration ---
async function fetchMenuItems(){
  try{
    const res = await fetch('http://localhost:5000/api/menu');
    if(!res.ok) throw new Error('Failed to load menu');
    const data = await res.json();
    renderMenuItems(data);
  }catch(err){
    console.error(err);
    const el = document.getElementById('apiMenuList');
    if(el) el.innerHTML = '<div class="text-danger">Could not fetch menu items.</div>';
  }
}

function renderMenuItems(items){
  const container = document.getElementById('apiMenuList');
  if(!container) return;
  if(items.length === 0){
    container.innerHTML = '<div class="text-muted">No items yet.</div>';
    return;
  }
  container.innerHTML = '';
  items.forEach(it => {
    const node = document.createElement('div');
    node.className = 'card mb-2 p-2';
    node.innerHTML = `<div class="d-flex justify-content-between align-items-start">
      <div>
        <strong>${escapeHtml(it.name)}</strong> <div class="text-muted small">${escapeHtml(it.category)} • $${Number(it.price).toFixed(2)}</div>
        <div class="small mt-1">${escapeHtml(it.description)}</div>
      </div>
      <div>
        <button class="btn btn-sm btn-outline-danger" data-id="${it._id}" onclick="deleteMenuItem('${it._id}')">Delete</button>
      </div>
    </div>`;
    container.appendChild(node);
  });
}

async function deleteMenuItem(id){
  if(!confirm('Delete this item?')) return;
  try{
    const res = await fetch(`http://localhost:5000/api/menu/${id}`, { method: 'DELETE' });
    if(!res.ok) throw new Error('Delete failed');
    await fetchMenuItems();
  }catch(err){ console.error(err); alert('Delete failed'); }
}

function escapeHtml(str){
  if(!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

// Hook up form
document.addEventListener('DOMContentLoaded', function(){
  const form = document.getElementById('apiMenuForm');
  if(form){
    form.addEventListener('submit', async function(e){
      e.preventDefault();
      const name = document.getElementById('mname').value.trim();
      const price = parseFloat(document.getElementById('mprice').value);
      const category = document.getElementById('mcategory').value.trim();
      const description = document.getElementById('mdesc').value.trim();
      if(!name || !category || !description || isNaN(price)) return alert('Please fill all fields');

      try{
        const res = await fetch('http://localhost:5000/api/menu', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, price, category, description })
        });
        if(res.status === 201){
          form.reset();
          await fetchMenuItems();
          alert('Menu item created');
        } else {
          const data = await res.json();
          console.error(data);
          alert('Failed to create: ' + (data.error || JSON.stringify(data.errors || data)));
        }
      }catch(err){ console.error(err); alert('Network error'); }
    });

    // initial load
    fetchMenuItems();
  }
});

