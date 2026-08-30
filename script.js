/* ============ Yordamchi ============ */
var kaAll = function (sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); };
var kaOne = function (sel, ctx) { return (ctx || document).querySelector(sel); };

/* ============ Navbar scroll ============ */
var kaNavPill = kaOne('#navPill');
window.addEventListener('scroll', function () {
    kaNavPill.classList.toggle('scrolled', window.scrollY > 10);
}, { passive: true });

/* ============ Mobil menyu ============ */
var kaMenuBtn = kaOne('#menuBtn');
var kaMobileMenu = kaOne('#mobileMenu');
kaMenuBtn.addEventListener('click', function () {
    kaMobileMenu.classList.toggle('open');
    kaMenuBtn.classList.toggle('open');
});
kaAll('#mobileMenu a').forEach(function (link) {
    link.addEventListener('click', function () {
        kaMobileMenu.classList.remove('open');
        kaMenuBtn.classList.remove('open');
    });
});

/* ============ Reveal on scroll ============ */
var kaRevealIO = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
        if (entry.isIntersecting) {
            entry.target.classList.add('in');
            kaRevealIO.unobserve(entry.target);
        }
    });
}, { threshold: .15 });
kaAll('.reveal').forEach(function (el) { kaRevealIO.observe(el); });

/* ============ Yulduzli osmon ============ */
kaAll('.starfield').forEach(function (field) {
    var kaN = parseInt(field.getAttribute('data-stars'), 10) || 60;
    for (var kaI = 0; kaI < kaN; kaI++) {
        var kaStar = document.createElement('i');
        var kaSize = (Math.random() * 2.2 + 1).toFixed(1);
        kaStar.style.left = (Math.random() * 100).toFixed(2) + '%';
        kaStar.style.top = (Math.random() * 100).toFixed(2) + '%';
        kaStar.style.width = kaSize + 'px';
        kaStar.style.height = kaSize + 'px';
        kaStar.style.animationDelay = (Math.random() * 4).toFixed(2) + 's';
        kaStar.style.animationDuration = (2.5 + Math.random() * 3).toFixed(2) + 's';
        field.appendChild(kaStar);
    }
});

/* ============ Marquee nusxalash (cheksiz lenta) ============ */
var kaTrack = kaOne('#marqueeTrack');
if (kaTrack) {
    kaTrack.innerHTML += kaTrack.innerHTML;
}

/* ============ Forma ============ */
var kaForm = kaOne('#waitlistForm');
var kaSubmit = kaOne('#submitBtn');
if (kaForm && kaSubmit) {
    kaForm.addEventListener('submit', function (ev) {
        ev.preventDefault();
        if (!kaForm.reportValidity()) return;
        kaSubmit.disabled = true;
        kaSubmit.innerHTML = 'Yuborilmoqda…';
        setTimeout(function () {
            kaForm.reset();
            kaSubmit.disabled = false;
            kaSubmit.innerHTML = 'Yuborish <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/></svg>';
            kaShowToast("Rahmat! 🚀 Tez orada siz bilan bog'lanamiz.");
        }, 900);
    });
}

function kaShowToast(msg) {
    var kaToast = kaOne('#toast');
    if (!kaToast) return;
    kaOne('#toastMsg').textContent = msg;
    kaToast.classList.add('show');
    clearTimeout(kaToast._kaTimer);
    kaToast._kaTimer = setTimeout(function () { kaToast.classList.remove('show'); }, 3600);
}

/* ============ Yil ============ */
var yearEl = kaOne('#year');
if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
}

/* ============ Sayyoralar rasmlarini Backend'dan yuklash (Failover Tizimi) ============ */
(function loadBackendPlanets() {
    fetch('/api/website/planets/')
        .then(function (res) {
            if (!res.ok) throw new Error('Network error');
            return res.json();
        })
        .then(function (data) {
            if (!Array.isArray(data) || data.length === 0) return;
            
            var planetSlots = kaAll('.planet-slot');
            planetSlots.forEach(function (slot) {
                var imgEl = kaOne('img', slot);
                var titleEl = kaOne('.popover-title', slot);
                var descEl = kaOne('.popover-desc', slot);
                if (!imgEl) return;

                var currentTitle = titleEl ? titleEl.textContent.trim().toLowerCase() : '';
                var match = data.find(function (item) {
                    var itemTitle = (item.title || item.name || '').toLowerCase();
                    return itemTitle && (currentTitle.indexOf(itemTitle) !== -1 || itemTitle.indexOf(currentTitle) !== -1);
                });

                if (match) {
                    if (match.image) {
                        var cleanImg = match.image.replace(/^https?:\/\/[^/]+/, '');
                        imgEl.src = cleanImg;
                    }
                    if (match.description && descEl) {
                        descEl.textContent = match.description;
                    }
                }
            });
        })
        .catch(function () {
            // Serverdan xabar kelmasa hech narsa bajarilmaydi (Folderdagi o'z rasmlari qoladi)
            console.log("Backend aloqasi yo'q. Folderdagi statik rasmlar ishlatilmoqda.");
        });
})();

