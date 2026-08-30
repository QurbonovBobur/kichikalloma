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

/* ============ Team Marquee — cheksiz loop uchun kartalar ikkilantiriladi ============ */
var kaTeamMarquee = kaOne('#teamMarquee');
if (kaTeamMarquee) {
    kaTeamMarquee.innerHTML += kaTeamMarquee.innerHTML;
}

/* ============ Hero rasm — scroll da scale animatsiyasi (80% → 100%) ============ */
(function initHeroImgScale() {
    var heroFig = kaOne('.hero-figure');
    if (!heroFig) return;

    heroFig.style.willChange = 'transform';
    heroFig.style.transformOrigin = 'center top';

    function updateScale() {
        var rect = heroFig.getBoundingClientRect();
        var vh = window.innerHeight;
        /* rect.top: yuqori qirra viewport dan qancha pastda.
           Rasm ekranga to'liq kirganda rect.top ~ 0.
           progress: 0 (ko'rinmaydi) → 1 (viewport o'rtasida) */
        var rawProgress = 1 - (rect.top / vh);
        /* Ertaroq 100%: progress 0.55 da to'liq scale */
        var progress = Math.max(0, Math.min(1, rawProgress / 0.45));
        var scale = 0.90 + progress * 0.10;
        heroFig.style.transform = 'scale(' + scale.toFixed(4) + ')';
    }

    window.addEventListener('scroll', updateScale, { passive: true });
    updateScale();
})();

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

/* ============ Sayyora Kartalari Scroll Grid Animation ============ */
(function initPlanetCardsAnimation() {
    var section = kaOne('.cosmos');
    var stack = kaOne('#planetCardStack');
    if (!section || !stack) return;

    var cards = kaAll('.planet-card-item', stack);
    if (cards.length === 0) return;

    var COLS = 4;
    var ROWS = 2;
    var CARD_W = 340;
    var CARD_H = 220;
    var GAP_X = 24;
    var GAP_Y = 30;

    // Calculate final grid positions centered relative to stack center (0,0)
    function getFinalPositions() {
        var positions = [];
        var totalW = COLS * CARD_W + (COLS - 1) * GAP_X;
        var totalH = ROWS * CARD_H + (ROWS - 1) * GAP_Y;
        var startX = -totalW / 2 + CARD_W / 2;
        var startY = -totalH / 2 + CARD_H / 2;
        for (var r = 0; r < ROWS; r++) {
            for (var c = 0; c < COLS; c++) {
                positions.push({ x: startX + c * (CARD_W + GAP_X), y: startY + r * (CARD_H + GAP_Y) });
            }
        }
        return positions;
    }
    var finals = getFinalPositions();

    // Initials stacked in a pile (with offset shifts and rotation)
    var initials = cards.map(function (_, i) {
        var offset = i - 3.5;
        return {
            x: offset * 6,
            y: offset * 4,
            r: offset * 1.2,
            s: 1 - Math.abs(offset) * 0.015
        };
    });

    function getProgress() {
        var rect = section.getBoundingClientRect();
        // Since section height is 300vh, scroll height is 200vh
        var scrollHeight = section.offsetHeight - window.innerHeight;
        if (scrollHeight <= 0) return 0;
        var scrolled = -rect.top;
        return Math.max(0, Math.min(1, scrolled / scrollHeight));
    }

    var ease = function (t) { return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t; };

    function render() {
        // Only run transform animations on desktop screen sizes (width >= 992px)
        if (window.innerWidth < 992) {
            // Reset mobile fallback transforms/opacities
            cards.forEach(function (card) {
                card.style.transform = '';
                card.style.opacity = '';
                card.style.zIndex = '';
            });
            stack.style.transform = '';
            return;
        }

        var p = getProgress();
        var ep = ease(p);

        cards.forEach(function (card, i) {
            var ini = initials[i];
            var fin = finals[i];
            if (!ini || !fin) return;

            var x = ini.x + (fin.x - ini.x) * ep;
            var y = ini.y + (fin.y - ini.y) * ep;
            var r = ini.r * (1 - ep);
            var s = ini.s + (1 - ini.s) * ep;

            // Opacity starts high to make all cards visible immediately
            var opacity = 0.95 + 0.05 * Math.min(1, p * 3);

            card.style.transform = 'translate(' + x + 'px, ' + y + 'px) rotate(' + r + 'deg) scale(' + s + ')';
            card.style.opacity = opacity;
            card.style.zIndex = Math.round(ep * 10) + 1;
        });

        // Resize & scale the entire stack to fit within viewport perfectly
        scaleStage();
    }

    function scaleStage() {
        if (window.innerWidth < 992) return;

        var gridW = COLS * CARD_W + (COLS - 1) * GAP_X; // 1432
        var gridH = ROWS * CARD_H + (ROWS - 1) * GAP_Y; // 840

        var parentW = stack.parentElement.clientWidth;
        // Available viewport height minus approximate header size (160px)
        var parentH = window.innerHeight - 160;

        var scaleW = parentW / gridW;
        var scaleH = parentH / gridH;

        var scale = Math.min(1, scaleW, scaleH);
        stack.style.transform = 'scale(' + scale + ')';
    }

    window.addEventListener('scroll', render, { passive: true });
    window.addEventListener('resize', render);
    // Initial call
    render();
})();

/* ============ Pedagogik Yondashuv - Scroll Sticky Animation ============ */
(function initPedagogyStickyAnimation() {
    var stickySection = kaOne('#qanday.section-sticky');
    var cardsInner = kaOne('#cardsInner');
    if (!stickySection || !cardsInner) return;

    var cards = kaAll('.card', cardsInner);
    var slides = kaAll('.image-slide', kaOne('#pedagogyImageWrapper'));
    var totalCards = cards.length;
    if (totalCards === 0) return;

    // O'lchamlarni DOM dan dinamik o'qish
    function getMetrics() {
        var wrapper = cardsInner.parentElement;
        var wrapperH = wrapper ? wrapper.offsetHeight : 520;
        var firstCard = cards[0];
        var cardH = firstCard ? firstCard.offsetHeight : 120;
        var computedGap = parseInt(window.getComputedStyle(cardsInner).gap) || 20;
        // Har bir cardning unikali scrollable diapazoni (px)
        // Jami scroll maydoni = sectionHeight - viewportHeight
        // Uni to'rtga bo'lib, har birga individual ulush beramiz:
        // Card 1 → 0% dan 20%
        // Card 2 → 20% dan 40%  (sekinroq)
        // Card 3 → 40% dan 70%
        // Card 4 → 70% dan 100%
        return { wrapperH: wrapperH, cardH: cardH, gap: computedGap };
    }

    var m = getMetrics();
    var WRAPPER_HEIGHT = m.wrapperH;
    var CARD_HEIGHT = m.cardH;
    var GAP = m.gap;

    // Boshlang'ich: birinchi card pastdan ko'rinadi
    var INITIAL_OFFSET = WRAPPER_HEIGHT - CARD_HEIGHT - 40;

    var currentTranslate = INITIAL_OFFSET;
    var targetTranslate = INITIAL_OFFSET;
    var isAnimating = false;

    function lerp(start, end, factor) {
        return start + (end - start) * factor;
    }

    // Har bir card uchun individual progress chegaralari
    // Card 0: 0%–22%, Card 1: 22%–48%, Card 2: 48%–74%, Card 3: 74%–100%
    var segmentBoundaries = [0, 0.22, 0.48, 0.74, 1.0];

    function updateOnScroll() {
        if (window.innerWidth < 992) {
            cardsInner.style.transform = '';
            cards.forEach(function (card) {
                card.classList.add('active');
            });
            return;
        }

        // O'lchamlarni qayta hisoblash (resize uchun)
        m = getMetrics();
        WRAPPER_HEIGHT = m.wrapperH;
        CARD_HEIGHT = m.cardH;
        GAP = m.gap;
        INITIAL_OFFSET = WRAPPER_HEIGHT - CARD_HEIGHT - 40;

        var sectionRect = stickySection.getBoundingClientRect();
        var sectionHeight = stickySection.offsetHeight;
        var viewportHeight = window.innerHeight;

        var scrolled = -sectionRect.top;
        var scrollableHeight = sectionHeight - viewportHeight;
        var progress = Math.max(0, Math.min(1, scrolled / scrollableHeight));

        // Individual segmentlar bo'yicha aktiv card aniqlash
        var activeIndex = totalCards - 1;
        for (var si = 0; si < totalCards; si++) {
            if (progress < segmentBoundaries[si + 1]) {
                activeIndex = si;
                break;
            }
        }

        // Card markazga kelishi uchun target pozitsiya
        var centerPosition = WRAPPER_HEIGHT / 2 - CARD_HEIGHT / 2;
        var cardPosition = activeIndex * (CARD_HEIGHT + GAP);
        targetTranslate = -(cardPosition - centerPosition);

        // Boshlanishda pastroq
        if (progress < 0.03) {
            targetTranslate = INITIAL_OFFSET;
        }

        // Smooth lerp
        if (Math.abs(currentTranslate - targetTranslate) > 0.5) {
            currentTranslate = lerp(currentTranslate, targetTranslate, 0.12);
            cardsInner.style.transform = 'translateY(' + currentTranslate + 'px)';
            isAnimating = true;
        } else {
            currentTranslate = targetTranslate;
            cardsInner.style.transform = 'translateY(' + currentTranslate + 'px)';
            isAnimating = false;
        }

        // Active card
        cards.forEach(function (card, index) {
            card.classList.toggle('active', index === activeIndex);
        });

        // Active slide
        slides.forEach(function (slide, index) {
            slide.classList.toggle('active', index === activeIndex);
        });
    }

    // Animation loop
    function animate() {
        if (isAnimating) {
            updateOnScroll();
        }
        requestAnimationFrame(animate);
    }

    window.addEventListener('scroll', function () {
        updateOnScroll();
    }, { passive: true });

    window.addEventListener('resize', function () {
        m = getMetrics();
        WRAPPER_HEIGHT = m.wrapperH;
        CARD_HEIGHT = m.cardH;
        GAP = m.gap;
        INITIAL_OFFSET = WRAPPER_HEIGHT - CARD_HEIGHT - 40;
        updateOnScroll();
    });

    // Initial (DOM tayyor bo'lgandan keyin)
    requestAnimationFrame(function () {
        m = getMetrics();
        WRAPPER_HEIGHT = m.wrapperH;
        CARD_HEIGHT = m.cardH;
        GAP = m.gap;
        INITIAL_OFFSET = WRAPPER_HEIGHT - CARD_HEIGHT - 40;
        currentTranslate = INITIAL_OFFSET;
        targetTranslate = INITIAL_OFFSET;
        updateOnScroll();
    });
    animate();
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

