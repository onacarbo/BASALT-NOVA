// ONA SONORA

const soundwave = document.querySelector("#soundwave");

const heights = [
  8, 12, 18, 25, 35, 48, 62, 78, 94, 110, 125, 105, 88, 68, 48, 30, 18, 35, 60,
  85, 110, 135, 115, 90, 65, 40, 22, 38, 62, 90, 120, 145, 125, 100, 75, 50, 30,
  18, 35, 60, 85, 110, 130, 105, 80, 55, 32, 18, 30, 50, 75, 100, 125, 105, 85,
  65, 45, 28, 15, 8,
];

if (soundwave) {
  heights.forEach(function (height, index) {
    const bar = document.createElement("div");
    bar.classList.add("bar");

    bar.style.height = height + "px";
    bar.style.animationDelay = index * -0.07 + "s";

    soundwave.appendChild(bar);
  });
}

// CARRUSEL DE VINILS

const sessions = document.querySelector(".sessions");
const carousel = document.querySelector(".sessions-carousel");
const vinyls = document.querySelectorAll(".vinyl");
const indicators = document.querySelectorAll(".indicator");

const sessionsData = [
  {
    color: "#9c0a1e",
    number: "001 / MACHETES",
    name: "FIRST FREQUENCY",
    caption: "WHERE IT ALL BEGAN.",
  },
  {
    color: "#eaf744",
    number: "002 / SIVANA",
    name: "GOLDEN HOUR",
    caption: "CHASING THE LAST SUNLIGHT.",
  },
  {
    color: "#77702b",
    number: "003 / LA RURAL",
    name: "AFTER DARK",
    caption: "WHEN THE NIGHT TAKES OVER.",
  },
  {
    color: "#169bc0",
    number: "004 / LA RURAL",
    name: "ONE LAST SUMMER DANCE",
    caption: "UNTIL THE LAST BEAT",
  },
];

let currentSession = 0;

// ACTUALITZAR EL CARRUSEL

function updateCarousel() {
  vinyls.forEach(function (vinyl, index) {
    const distance = index - currentSession;

    vinyl.style.transform = `translate(-50%, -50%) translateX(${distance * 1050}px)`;

    vinyl.style.zIndex = index === currentSession ? "2" : "1";
  });

  indicators.forEach(function (indicator, index) {
    indicator.classList.toggle("active", index === currentSession);
  });

  if (sessions) {
    sessions.style.setProperty(
      "--session-color",
      sessionsData[currentSession].color,
    );
  }
  // ACTUALITZAR EL TEXT DE CADA VINIL
  const session = sessionsData[currentSession];

  document.querySelector("#session-number").textContent = session.number;
  document.querySelector("#session-name").textContent = session.name;
  document.querySelector("#session-caption").textContent = session.caption;
}

// SCROLL HORITZONTAL DELS VINILS

if (carousel && vinyls.length > 0) {
  let scrollAcumulat = 0;
  let ultimCanvi = 0;

  carousel.addEventListener(
    "wheel",
    function (event) {
      const direccio = Math.sign(event.deltaY);

      if (direccio === 0) return;

      const alLimit =
        (direccio > 0 && currentSession === vinyls.length - 1) ||
        (direccio < 0 && currentSession === 0);

      // Als extrems, permetre continuar baixant o pujant
      if (alLimit) {
        scrollAcumulat = 0;
        return;
      }

      event.preventDefault();

      const ara = Date.now();

      if (ara - ultimCanvi < 1000) return;

      scrollAcumulat += event.deltaY;

      if (Math.abs(scrollAcumulat) < 45) return;

      currentSession += Math.sign(scrollAcumulat);

      scrollAcumulat = 0;
      ultimCanvi = ara;

      updateCarousel();
    },
    { passive: false },
  );
}

// ACTUALITZAR EL MENÚ SEGONS LA SECCIÓ

const menuLinks = document.querySelectorAll(".menu a");

function updateActiveMenu() {
  const sections = document.querySelectorAll("main section[id]");

  let activeSection = "home";

  sections.forEach(function (section) {
    const rectangle = section.getBoundingClientRect();

    if (rectangle.top <= window.innerHeight * 0.4) {
      activeSection = section.id;
    }
  });

  menuLinks.forEach(function (link) {
    link.classList.toggle(
      "active",
      link.getAttribute("href") === "#" + activeSection,
    );
  });
}

window.addEventListener("scroll", updateActiveMenu, { passive: true });

updateCarousel();
updateActiveMenu();

// ABOUT US

(() => {
  // SAME BLOOD, SAME BEAT

  const blood = document.querySelector("#about-blood");
  const trail = document.querySelector("#about-photo-trail");

  const photos = Array.from(
    { length: 11 },
    (_, i) => `../media/about/${i + 1}.png`,
  );

  let photoIndex = 0;
  let lastPosition = null;

  if (blood && trail) {
    // Precarregar les fotografies
    photos.forEach((src) => {
      const img = new Image();
      img.src = src;
    });

    // Crear una fotografia en una posició
    function showPhoto(x, y) {
      const photo = document.createElement("img");

      photo.src = photos[photoIndex];
      photo.className = "about-trail-image";
      photo.alt = "";

      photo.style.left = x + "px";
      photo.style.top = y + "px";

      trail.appendChild(photo);

      photoIndex = (photoIndex + 1) % photos.length;

      photo.addEventListener("animationend", () => photo.remove(), {
        once: true,
      });
    }

    // ORDINADOR: fotografies amb el cursor
    blood.addEventListener("pointermove", (event) => {
      if (event.pointerType === "touch") return;

      const rect = blood.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;

      if (lastPosition) {
        const distance = Math.hypot(x - lastPosition.x, y - lastPosition.y);

        if (distance < 60) return;
      }

      lastPosition = { x, y };
      showPhoto(x, y);
    });

    blood.addEventListener("pointerleave", () => {
      lastPosition = null;
    });

    let touchStart = null;

    blood.addEventListener(
      "touchstart",
      (event) => {
        const touch = event.touches[0];

        touchStart = {
          x: touch.clientX,
          y: touch.clientY,
        };
      },
      { passive: true },
    );

    blood.addEventListener(
      "touchend",
      (event) => {
        if (!touchStart || event.changedTouches.length === 0) return;

        const touch = event.changedTouches[0];

        const distance = Math.hypot(
          touch.clientX - touchStart.x,
          touch.clientY - touchStart.y,
        );

        if (distance < 12) {
          const rect = blood.getBoundingClientRect();

          showPhoto(touch.clientX - rect.left, touch.clientY - rect.top);
        }

        touchStart = null;
      },
      { passive: true },
    );

    const mobileQuery = window.matchMedia("(max-width: 600px)");

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting || !mobileQuery.matches) return;

          observer.unobserve(blood);

          const positions = [
            [0.25, 0.35],
            [0.7, 0.55],
            [0.45, 0.75],
          ];

          positions.forEach(([x, y], index) => {
            setTimeout(() => {
              const rect = blood.getBoundingClientRect();

              if (rect.width === 0 || rect.height === 0) return;

              showPhoto(rect.width * x, rect.height * y);
            }, index * 350);
          });
        });
      },
      { threshold: 0.3 },
    );

    observer.observe(blood);
  }

  // FINESTRES BASÃLT / NØVA

  const overlay = document.querySelector("#artist-overlay");
  const closeButton = document.querySelector(".artist-close");

  const nameEl = document.querySelector("#artist-name");
  const textEl = document.querySelector("#artist-description");
  const imageEl = document.querySelector("#artist-image");
  const imageContainer = document.querySelector(".artist-panel-photo");

  if (!overlay) return;

  const artists = {
    basalt: {
      name: "BASÃLT",
      text: "HIS PASSION FOR MUSIC AND DJING BEGAN WHEN HE WAS JUST 14 YEARS OLD. IT ALL STARTED IN HIS BEDROOM, BEFORE GROWING INTO SOMETHING HE SHARED WITH A FAMILY MEMBER AND A FRIEND. HOWEVER, IT WASN’T UNTIL NOW THAT HE FINALLY DECIDED TO TAKE THINGS A STEP FURTHER AND SHARE HIS PASSION WITH THE WORLD.",
      image: "../media/about/father.png",
    },

    nova: {
      name: "NØVA",
      text: "MUSIC RUNS IN HER FAMILY’S VEINS. FROM A VERY YOUNG AGE, SHE HAS BEEN PASSIONATE ABOUT MUSIC, SINGING IN A CHOIR AND PLAYING INSTRUMENTS SUCH AS THE GUITAR, PIANO AND VIOLIN. HOWEVER, IT WASN’T UNTIL A FEW YEARS AGO THAT HER FATHER INTRODUCED HER TO THIS WORLD AND SHE DECIDED TO STEP INTO THE WORLD OF DJING ALONGSIDE HIM.",
      image: "../media/about/daughter.png",
    },
  };

  let previousFocus = null;

  function openArtist(key) {
    const artist = artists[key];
    if (!artist) return;

    previousFocus = document.activeElement;

    nameEl.textContent = artist.name;
    textEl.textContent = artist.text;

    imageEl.src = artist.image;
    imageEl.alt = artist.name;

    imageContainer.classList.remove("father", "nova");
    imageContainer.classList.add(key);

    overlay.classList.add("open");
    overlay.setAttribute("aria-hidden", "false");

    document.body.style.overflow = "hidden";

    closeButton.focus();
  }

  function closeArtist() {
    overlay.classList.remove("open");
    overlay.setAttribute("aria-hidden", "true");

    document.body.style.overflow = "";

    if (previousFocus) previousFocus.focus();
  }

  document.querySelectorAll(".about-artist").forEach((button) => {
    button.addEventListener("click", () => {
      openArtist(button.dataset.artist);
    });
  });

  closeButton.addEventListener("click", closeArtist);

  overlay.addEventListener("click", (event) => {
    if (event.target === overlay) {
      closeArtist();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (!overlay.classList.contains("open")) return;

    if (event.key === "Escape") {
      closeArtist();
    }
    if (event.key === "Tab") {
      event.preventDefault();
      closeButton.focus();
    }
  });
})();

/* MENU MOBILE */

const mobileMenuButton = document.querySelector(".mobile-menu-button");
const mobileNavigation = document.querySelector(".header .menu");

if (mobileMenuButton && mobileNavigation) {
  mobileMenuButton.addEventListener("click", () => {
    const isOpen = mobileNavigation.classList.toggle("mobile-open");

    mobileMenuButton.setAttribute("aria-expanded", String(isOpen));
    mobileMenuButton.textContent = isOpen ? "CLOSE" : "MENU";
  });

  mobileNavigation.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      mobileNavigation.classList.remove("mobile-open");
      mobileMenuButton.setAttribute("aria-expanded", "false");
      mobileMenuButton.textContent = "MENU";
    });
  });
}
