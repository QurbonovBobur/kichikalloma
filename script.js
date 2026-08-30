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

/* ============ Sayyora Kartalari Carousel - Scroll qotib qolish ============ */
(function initPlanetCardsCarousel() {
    var container = kaOne('#planetCardsContainer');
    if (!container) return;
    
    var cards = kaAll('.planet-card-item', container);
    if (cards.length === 0) return;
    
    var currentIndex = 0;
    var totalCards = cards.length;
    var hasPassedFour = false;
    var sectionLocked = false;
    var scrollTimeout = null;
    
    function updateCardPositions() {
        cards.forEach(function(card, index) {
            card.classList.remove('active', 'prev-1', 'prev-2', 'prev-3', 'next-1', 'next-2', 'next-3', 'hidden-below');
            
            var relPos = (index - currentIndex + totalCards) % totalCards;
            if (relPos < 0) relPos += totalCards;
            
            if (relPos === 0) {
                card.classList.add('active');
            } else if (relPos === 1) {
                card.classList.add('next-1');
            } else if (relPos === 2) {
                card.classList.add('next-2');
            } else if (relPos === 3) {
                card.classList.add('next-3');
            } else if (relPos === totalCards - 1) {
                card.classList.add('prev-1');
            } else if (relPos === totalCards - 2) {
                card.classList.add('prev-2');
            } else if (relPos === totalCards - 3) {
                card.classList.add('prev-3');
            } else {
                card.classList.add('hidden-below');
            }
        });
        
        // 4 tadan keyin 2 qatorga o'tish
        if (hasPassedFour && currentIndex >= 4) {
            container.classList.add('two-rows');
        } else {
            container.classList.remove('two-rows');
        }
    }
    
    // Section scroll position aniqlash
    function isSectionInView() {
        var rect = container.getBoundingClientRect();
        return rect.top < 150 && rect.bottom > window.innerHeight - 150;
    }
    
    // Scroll bilan carousel boshqaruvi - LOCK effekti
    window.addEventListener('scroll', function() {
        if (!isSectionInView()) {
            sectionLocked = false;
            return;
        }
        
        if (sectionLocked) return; // Lock holatida scroll ishlatilmaydi
        
        sectionLocked = true;
        
        setTimeout(function() {
            if (currentIndex < totalCards - 1) {
                currentIndex++;
                if (currentIndex === 4) hasPassedFour = true;
                updateCardPositions();
                
                // 2 qatorga o'tgandan keyin section'dan chiqish
                if (currentIndex >= totalCards - 1) {
                    setTimeout(function() {
                        sectionLocked = false;
                    }, 800);
                }
            } else {
                sectionLocked = false;
            }
        }, 150);
    }, { passive: true });
    
    // Click bilan ham boshqarish
    cards.forEach(function(card, index) {
        card.addEventListener('click', function() {
            currentIndex = index;
            if (currentIndex >= 4) hasPassedFour = true;
            updateCardPositions();
        });
    });
    
    // Dastlabki holat
    updateCardPositions();
})();

/* ============ Pedagogik Yondashuv Carousel - Scroll qotib qolish ============ */
(function initPedagogyCarousel() {
    var container = kaOne('#pedagogyCarousel');
    if (!container) return;
    
    var cards = kaAll('.pedagogy-card', container);
    var imagePlaceholder = kaOne('#pedagogyImagePlaceholder');
    var activeImg = kaOne('#pedagogyActiveImg');
    if (cards.length === 0 || !imagePlaceholder) return;
    
    var currentIndex = 0;
    var totalCards = cards.length;
    var sectionLocked = false;
    
    // Har bir qadam uchun rasm
    var stepImages = [
        'img/earth.png',
        'img/mars.png',
        'img/jupiter.png',
        'img/saturn.png'
    ];
    
    function updateCardPositions() {
        cards.forEach(function(card, index) {
            card.classList.remove('active', 'prev-1', 'prev-2', 'prev-3', 'next-1', 'next-2', 'next-3', 'hidden-above');
            
            var relPos = (index - currentIndex + totalCards) % totalCards;
            if (relPos < 0) relPos += totalCards;
            
            if (relPos === 0) {
                card.classList.add('active');
            } else if (relPos === 1) {
                card.classList.add('next-1');
            } else if (relPos === 2) {
                card.classList.add('next-2');
            } else if (relPos === 3) {
                card.classList.add('next-3');
            } else if (relPos === totalCards - 1) {
                card.classList.add('prev-1');
            } else if (relPos === totalCards - 2) {
                card.classList.add('prev-2');
            } else if (relPos === totalCards - 3) {
                card.classList.add('prev-3');
            } else {
                card.classList.add('hidden-above');
            }
        });
        
        // Rasmni yangilash
        if (imagePlaceholder && activeImg) {
            imagePlaceholder.classList.add('img-changing');
            setTimeout(function() {
                var imgIndex = currentIndex % stepImages.length;
                activeImg.src = stepImages[imgIndex];
                imagePlaceholder.classList.remove('img-changing');
            }, 250);
        }
    }
    
    // Section scroll position aniqlash
    function isSectionInView() {
        var rect = container.getBoundingClientRect();
        return rect.top < 150 && rect.bottom > window.innerHeight - 150;
    }
    
    // Scroll bilan carousel boshqaruvi - LOCK effekti
    window.addEventListener('scroll', function() {
        if (!isSectionInView()) {
            sectionLocked = false;
            return;
        }
        
        if (sectionLocked) return;
        
        sectionLocked = true;
        
        setTimeout(function() {
            if (currentIndex < totalCards - 1) {
                currentIndex++;
                updateCardPositions();
                
                // Oxirgi qadamdan keyin section'dan chiqish
                if (currentIndex >= totalCards - 1) {
                    setTimeout(function() {
                        sectionLocked = false;
                    }, 800);
                }
            } else {
                sectionLocked = false;
            }
        }, 150);
    }, { passive: true });
    
    // Click bilan boshqarish
    cards.forEach(function(card, index) {
        card.addEventListener('click', function() {
            currentIndex = index;
            updateCardPositions();
        });
    });
    
    // Dastlabki holat
    updateCardPositions();
})();

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

