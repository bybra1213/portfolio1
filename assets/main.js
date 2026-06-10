(function () {
  const galleryEl = document.getElementById("gallery");
  const filtersEl = document.getElementById("filters");
  const emptyMsg = document.getElementById("empty-msg");

  let activeCat = "all";

  // ===== Filters =====
  CATEGORIES.forEach((cat) => {
    const btn = document.createElement("button");
    btn.className = "filter-btn" + (cat.id === "all" ? " active" : "");
    btn.textContent = cat.label;
    btn.dataset.cat = cat.id;
    btn.addEventListener("click", () => {
      activeCat = cat.id;
      document
        .querySelectorAll(".filter-btn")
        .forEach((b) => b.classList.toggle("active", b.dataset.cat === cat.id));
      renderGallery();
    });
    filtersEl.appendChild(btn);
  });

  // ===== Gallery =====
  function renderGallery() {
    galleryEl.innerHTML = "";
    const items = PROJECTS.filter(
      (p) => activeCat === "all" || p.cats.includes(activeCat)
    );
    emptyMsg.style.display = items.length ? "none" : "block";

    items.forEach((proj, idx) => {
      const card = document.createElement("article");
      card.className = "card";
      card.tabIndex = 0;
      card.setAttribute("role", "button");
      card.setAttribute("aria-label", "Открыть: " + proj.title);

      const media = document.createElement("div");
      media.className = "card-media";

      if (proj.type === "video") {
        const img = document.createElement("img");
        img.src = "assets/" + proj.poster;
        img.loading = "lazy";
        img.alt = proj.title;
        media.appendChild(img);

        const play = document.createElement("div");
        play.className = "play-icon";
        play.innerHTML =
          '<svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>';
        media.appendChild(play);
      } else {
        const img = document.createElement("img");
        img.src = "assets/img/" + proj.cover;
        img.loading = "lazy";
        img.alt = proj.title;
        media.appendChild(img);

        if (proj.images.length > 1) {
          const count = document.createElement("div");
          count.className = "count";
          count.textContent = proj.images.length + " фото";
          media.appendChild(count);
        }
      }

      const body = document.createElement("div");
      body.className = "card-body";

      const title = document.createElement("h3");
      title.className = "card-title";
      title.textContent = proj.title;

      const tags = document.createElement("div");
      tags.className = "card-tags";
      proj.cats.forEach((c) => {
        const cat = CATEGORIES.find((x) => x.id === c);
        if (cat) {
          const span = document.createElement("span");
          span.textContent = cat.label;
          tags.appendChild(span);
        }
      });

      body.appendChild(title);
      body.appendChild(tags);
      card.appendChild(media);
      card.appendChild(body);

      const open = () => openLightbox(proj);
      card.addEventListener("click", open);
      card.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          open();
        }
      });

      galleryEl.appendChild(card);
    });
  }

  // ===== Lightbox =====
  const lightbox = document.getElementById("lightbox");
  const stage = document.getElementById("lightbox-stage");
  const titleEl = document.getElementById("lightbox-title");
  const counterEl = document.getElementById("lightbox-counter");
  const closeBtn = document.getElementById("lightbox-close");
  const prevBtn = document.getElementById("lightbox-prev");
  const nextBtn = document.getElementById("lightbox-next");

  let currentProj = null;
  let currentIdx = 0;

  function openLightbox(proj) {
    currentProj = proj;
    currentIdx = 0;
    lightbox.classList.add("open");
    render();
  }

  function render() {
    // clear previous media (keep nav buttons)
    stage.querySelectorAll("img, video").forEach((el) => el.remove());

    if (currentProj.type === "video") {
      const video = document.createElement("video");
      video.src = "assets/" + currentProj.video;
      video.controls = true;
      video.autoplay = true;
      video.loop = true;
      video.poster = "assets/" + currentProj.poster;
      stage.appendChild(video);
      titleEl.textContent = currentProj.title;
      counterEl.textContent = "видео";
      prevBtn.style.display = "none";
      nextBtn.style.display = "none";
    } else {
      const img = document.createElement("img");
      img.src = "assets/img/" + currentProj.images[currentIdx];
      img.alt = currentProj.title;
      stage.appendChild(img);
      titleEl.textContent = currentProj.title;
      counterEl.textContent = (currentIdx + 1) + " / " + currentProj.images.length;
      const multi = currentProj.images.length > 1;
      prevBtn.style.display = multi ? "flex" : "none";
      nextBtn.style.display = multi ? "flex" : "none";
    }
  }

  function closeLightbox() {
    lightbox.classList.remove("open");
    stage.querySelectorAll("video").forEach((v) => v.pause());
  }

  function step(dir) {
    if (!currentProj || currentProj.type === "video") return;
    const len = currentProj.images.length;
    currentIdx = (currentIdx + dir + len) % len;
    render();
  }

  closeBtn.addEventListener("click", closeLightbox);
  prevBtn.addEventListener("click", () => step(-1));
  nextBtn.addEventListener("click", () => step(1));
  lightbox.addEventListener("click", (e) => {
    if (e.target === lightbox) closeLightbox();
  });
  document.addEventListener("keydown", (e) => {
    if (!lightbox.classList.contains("open")) return;
    if (e.key === "Escape") closeLightbox();
    if (e.key === "ArrowLeft") step(-1);
    if (e.key === "ArrowRight") step(1);
  });

  renderGallery();
})();
