/* ============ Yordamchi ============ */
var kaAll = function (sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); };
var kaOne = function (sel, ctx) { return (ctx || document).querySelector(sel); };

/* ============ Navbar scroll ============ */
var kaNavPill = kaOne('#navPill');
window.addEventListener('scroll', function () {
    if (kaNavPill) {
        kaNavPill.classList.toggle('scrolled', window.scrollY > 10);
    }
}, { passive: true });

/* ============ Mobil menyu ============ */
var kaMenuBtn = kaOne('#menuBtn');
var kaMobileMenu = kaOne('#mobileMenu');

if (kaMenuBtn && kaMobileMenu) {
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
}

/* ============ Lang Dropdown (Desktop & Mobil sinxron) ============ */
function initDropdowns() {
    var dropdowns = kaAll('.lang-dropdown');

    dropdowns.forEach(function (dropdown) {
        var btn = kaOne('.lang-btn', dropdown);

        btn.addEventListener('click', function (e) {
            e.stopPropagation();
            // Boshqa barcha ochiq dropdownlarni yopish
            dropdowns.forEach(function (d) { if (d !== dropdown) d.classList.remove('open'); });
            dropdown.classList.toggle('open');
        });
    });

    // Variant tanlanganda har ikkala dropdownni sinxronlash
    var allOptions = kaAll('.lang-option');
    allOptions.forEach(function (option) {
        option.addEventListener('click', function () {
            var selectedLang = this.getAttribute('data-lang');

            kaAll('.currentLang').forEach(function (el) {
                el.textContent = selectedLang;
            });

            allOptions.forEach(function (opt) {
                if (opt.getAttribute('data-lang') === selectedLang) {
                    opt.classList.add('selected');
                } else {
                    opt.classList.remove('selected');
                }
            });

            dropdowns.forEach(function (d) { d.classList.remove('open'); });
        });
    });

    document.addEventListener('click', function (e) {
        dropdowns.forEach(function (d) {
            if (!d.contains(e.target)) {
                d.classList.remove('open');
            }
        });
    });
}

initDropdowns();

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

/* Hero Video Control & Scale Animatsiyasi */
(function initHeroVideoPlayer() {
    var heroFig = kaOne('.hero-figure');
    var heroVideo = kaOne('#heroVideo');
    var videoBtn = kaOne('#videoBtn');

    if (!heroFig || !heroVideo || !videoBtn) return;

    heroFig.style.willChange = 'transform';
    heroFig.style.transformOrigin = 'center top';

    var autoPlayTriggered = false;

    function updateVideoScaleAndPlay() {
        var rect = heroFig.getBoundingClientRect();
        var vh = window.innerHeight;
        var rawProgress = 1 - (rect.top / vh);
        var progress = Math.max(0, Math.min(1, rawProgress / 0.45));
        var scale = 0.90 + progress * 0.10;

        heroFig.style.transform = 'scale(' + scale.toFixed(4) + ')';

        /* Video 100% scale holatiga yetganda bir marta avtomatik ijro bo'ladi */
        if (scale >= 0.999 && !autoPlayTriggered) {
            autoPlayTriggered = true;
            heroVideo.play().then(function () {
                videoBtn.classList.add('playing');
            }).catch(function (error) {
                console.log("Autoplay brauzer tomonidan bloklandi:", error);
            });
        }
    }

    /* Manual Play/Pause bosilganda */
    videoBtn.addEventListener('click', function () {
        if (heroVideo.paused) {
            heroVideo.play();
            videoBtn.classList.add('playing');
        } else {
            heroVideo.pause();
            videoBtn.classList.remove('playing');
        }
    });

    heroVideo.addEventListener('play', function () {
        videoBtn.classList.add('playing');
    });

    heroVideo.addEventListener('pause', function () {
        videoBtn.classList.remove('playing');
    });

    window.addEventListener('scroll', updateVideoScaleAndPlay, { passive: true });
    updateVideoScaleAndPlay();
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
            kaShowToast("Rahmat! Tez orada siz bilan bog'lanamiz.");
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
    var CARD_W = 300;
    var CARD_H = 170;
    var GAP_X = 24;
    var GAP_Y = 12;

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
        var scrollHeight = section.offsetHeight - window.innerHeight;
        if (scrollHeight <= 0) return 0;
        var scrolled = -rect.top;
        return Math.max(0, Math.min(1, scrolled / scrollHeight));
    }

    var ease = function (t) { return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t; };

    function render() {
        if (window.innerWidth < 992) {
            cards.forEach(function (card) {
                card.style.transform = '';
                card.style.opacity = '';
                card.style.zIndex = '';
                card.classList.remove('opened');
            });
            stack.style.transform = '';
            return;
        }

        var p = getProgress();
        var ep = ease(p);

        var isFullyOpened = p >= 0.70;

        cards.forEach(function (card, i) {
            var ini = initials[i];
            var fin = finals[i];
            if (!ini || !fin) return;

            var x = ini.x + (fin.x - ini.x) * ep;
            var y = ini.y + (fin.y - ini.y) * ep;
            var r = ini.r * (1 - ep);
            var s = ini.s + (1 - ini.s) * ep;

            var opacity = 0.95 + 0.05 * Math.min(1, p * 3);

            card.style.transform = 'translate(' + x + 'px, ' + y + 'px) rotate(' + r + 'deg) scale(' + s + ')';
            card.style.opacity = opacity;
            card.style.zIndex = Math.round(ep * 10) + 1;

            if (isFullyOpened) {
                card.classList.add('opened');
            } else {
                card.classList.remove('opened');
            }
        });

        scaleStage();
    }

    function scaleStage() {
        if (window.innerWidth < 992) return;

        var gridW = COLS * CARD_W + (COLS - 1) * GAP_X; // 1272
        var gridH = ROWS * CARD_H + (ROWS - 1) * GAP_Y; // 364

        var parentW = stack.parentElement.clientWidth;
        var parentH = window.innerHeight - 160;

        var scaleW = parentW / gridW;
        var scaleH = parentH / gridH;

        var scale = Math.min(1, scaleW, scaleH);
        stack.style.transform = 'scale(' + scale + ')';
    }

    window.addEventListener('scroll', render, { passive: true });
    window.addEventListener('resize', render);
    render();
})();

/* ============ Pedagogik Yondashuv — Desktop + Mobil Animatsiya ============ */
(function () {
    var stickySection = kaOne('#qanday.section-sticky');
    if (!stickySection) return;

    /* --- DESKTOP ELEMENTLARI --- */
    var cardsInner = kaOne('#cardsInner');
    var cards = cardsInner ? kaAll('.card', cardsInner) : [];
    var imgWrapper = kaOne('#pedagogyImageWrapper');
    var slides = imgWrapper ? kaAll('.image-slide', imgWrapper) : [];
    var totalCards = cards.length;

    /* --- MOBIL DATA & SOZLAMALARI --- */
    var STEPS = [
        { number: "01", title: "Maqsadli sayohat", subtitle: "Bola Quyosh tizimidagi o'zi kashf etmoqchi bo'lgan qobiliyat sayyorasini tanlaydi.", image: "img/how1.jpg", alt: "Maqsadli sayohat" },
        { number: "02", title: "Fikrlab o'rganish", subtitle: "Sun'iy intellekt bolaning o'rniga vazifani bajarmaydi. U yo'naltiruvchi savollar orqali bolani to'g'ri javob topishga undaydi.", image: "img/how2.jpg", alt: "Fikrlab o'rganish" },
        { number: "03", title: "Amaliy harakat", subtitle: "O'qish, mashq qilish yoki o'z hissiyotlarini yozish orqali missiya yakunlanadi.", image: "img/how3.jpg", alt: "Amaliy harakat" },
        { number: "04", title: "Munosib mukofot", subtitle: "Har bir to'g'ri qadam uchun 'Gold Coin' yig'iladi. Bu bolada o'z mehnati samarasini ko'rish hissini uyg'otadi.", image: "img/how4.jpg", alt: "Munosib mukofot" }
    ];

    var mobileInitialized = false;
    var mobileContainer, mobileCards, mobileDots;
    var mobileCurrentStep = -1;

    function buildMobileLayout() {
        mobileContainer = document.getElementById('mobileStepContainer');
        if (!mobileContainer || mobileInitialized) return;
        mobileInitialized = true;

        var html = '<div class="mobile-step-cards-wrapper" id="mobileCardsWrapper">';
        STEPS.forEach(function (s, i) {
            var initialClass = i === 0 ? 'active' : 'is-next';
            html += '<div class="mobile-step-card ' + initialClass + '" data-idx="' + i + '">' +
                '<div class="mobile-step-image-wrap">' +
                '<img src="' + s.image + '" alt="' + s.alt + '">' +
                '</div>' +
                '<div class="mobile-step-content">' +
                '<div class="mobile-step-number">' + s.number + '</div>' +
                '<div class="mobile-step-text">' +
                '<div class="mobile-step-title">' + s.title + '</div>' +
                '<div class="mobile-step-subtitle">' + s.subtitle + '</div>' +
                '</div>' +
                '</div>' +
                '</div>';
        });
        html += '</div>';

        html += '<div class="mobile-progress" id="mobileProgress">';
        STEPS.forEach(function (_, i) {
            html += '<div class="mobile-progress-dot ' + (i === 0 ? 'active' : '') + '" data-idx="' + i + '"></div>';
        });
        html += '</div>';

        mobileContainer.innerHTML = html;

        mobileCards = mobileContainer.querySelectorAll('.mobile-step-card');
        mobileDots = mobileContainer.querySelectorAll('.mobile-progress-dot');

        mobileDots.forEach(function (dot) {
            dot.addEventListener('click', function () {
                var idx = parseInt(this.getAttribute('data-idx'));
                var rect = stickySection.getBoundingClientRect();
                var sectionTop = window.pageYOffset + rect.top;
                var sectionH = stickySection.offsetHeight;
                var viewportH = window.innerHeight;
                var scrollable = sectionH - viewportH;
                if (scrollable > 0) {
                    var targetY = sectionTop + (idx / STEPS.length) * scrollable + 20;
                    window.scrollTo({ top: targetY, behavior: 'smooth' });
                }
            });
        });
    }

    function updateDesktop() {
        if (!cardsInner || totalCards === 0) return;

        var wrapper = cardsInner.parentElement;
        var wrapperH = wrapper ? wrapper.offsetHeight : 520;
        var firstCard = cards[0];
        var cardH = firstCard ? firstCard.offsetHeight : 120;
        var computedGap = parseInt(window.getComputedStyle(cardsInner).gap) || 20;
        var initialOffset = wrapperH - cardH - 40;

        var rect = stickySection.getBoundingClientRect();
        var sectionH = stickySection.offsetHeight;
        var viewportH = window.innerHeight;
        var scrolled = -rect.top;
        var scrollable = sectionH - viewportH;

        if (scrollable <= 0) return;

        var progress = Math.max(0, Math.min(1, scrolled / scrollable));
        var activeIndex = Math.min(totalCards - 1, Math.floor(progress * totalCards));

        var centerPos = wrapperH / 2 - cardH / 2;
        var cardPos = activeIndex * (cardH + computedGap);
        var targetTranslate = -(cardPos - centerPos);
        if (progress < 0.03) targetTranslate = initialOffset;

        cardsInner.style.transform = 'translateY(' + targetTranslate + 'px)';

        cards.forEach(function (c, i) {
            c.classList.toggle('active', i === activeIndex);
        });
        slides.forEach(function (s, i) {
            s.classList.toggle('active', i === activeIndex);
        });
    }

    function updateMobile() {
        if (!mobileInitialized) buildMobileLayout();
        if (!mobileCards || mobileCards.length === 0) return;

        var rect = stickySection.getBoundingClientRect();
        var sectionH = stickySection.offsetHeight;
        var viewportH = window.innerHeight;
        var scrolled = -rect.top;
        var scrollable = sectionH - viewportH;

        if (scrollable <= 0) return;

        var progress = Math.max(0, Math.min(1, scrolled / scrollable));
        var stepIndex = Math.min(STEPS.length - 1, Math.floor(progress * STEPS.length));

        if (stepIndex === mobileCurrentStep) return;
        mobileCurrentStep = stepIndex;

        mobileCards.forEach(function (card, i) {
            card.classList.remove('active', 'is-prev', 'is-next');
            if (i === stepIndex) {
                card.classList.add('active');
            } else if (i < stepIndex) {
                card.classList.add('is-prev');
            } else {
                card.classList.add('is-next');
            }
        });

        if (mobileDots) {
            mobileDots.forEach(function (d, i) {
                d.classList.toggle('active', i === stepIndex);
            });
        }
    }

    function handleScroll() {
        if (window.innerWidth < 992) {
            updateMobile();
        } else {
            updateDesktop();
        }
    }

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll);
    window.addEventListener('orientationchange', function () {
        setTimeout(handleScroll, 150);
    });

    handleScroll();
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

            var planetItems = kaAll('.planet-card-item');
            planetItems.forEach(function (item) {
                var imgEl = kaOne('img', item);
                var titleEl = kaOne('.planet-card-title', item);
                var descEl = kaOne('.planet-card-desc', item);
                var descMobileEl = kaOne('.planet-card-desc-mobile', item);

                if (!imgEl) return;

                var currentTitle = titleEl ? titleEl.textContent.trim().toLowerCase() : '';
                var match = data.find(function (p) {
                    var itemTitle = (p.title || p.name || '').toLowerCase();
                    return itemTitle && (currentTitle.indexOf(itemTitle) !== -1 || itemTitle.indexOf(currentTitle) !== -1);
                });

                if (match) {
                    if (match.image) {
                        var cleanImg = match.image.replace(/^https?:\/\/[^/]+/, '');
                        imgEl.src = cleanImg;
                    }
                    if (match.description) {
                        if (descEl) descEl.textContent = match.description;
                        if (descMobileEl) descMobileEl.textContent = match.description;
                    }
                }
            });
        })
        .catch(function () {
            console.log("Backend aloqasi yo'q. Local rasmlar ishlatilmoqda.");
        });
})();
