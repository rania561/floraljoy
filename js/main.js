// إعدادات التواصل الثابتة لـ FLORAL JOY
const BRAND_PHONE = "966501707487";
const BRAND_PHONE_DISPLAY = "+966501707487";

function getWhatsAppUrl(message) {
  return `https://wa.me/${BRAND_PHONE}?text=${encodeURIComponent(message)}`;
}

// تفعيل قائمة الجوال
document.addEventListener("DOMContentLoaded", () => {
  const mobileBtn = document.getElementById("mobileToggle");
  const navMenu = document.getElementById("navMenu");
  if (mobileBtn && navMenu) {
    mobileBtn.addEventListener("click", () => {
      navMenu.classList.toggle("open");
    });
  }

  // تعبئة القائمة المنسدلة للحفلات في الهيدر تلقائياً
  const dropdownContainer = document.getElementById("eventsDropdownList");
  if (dropdownContainer && typeof FLORAL_EVENTS !== "undefined") {
    dropdownContainer.innerHTML = FLORAL_EVENTS.map(ev => `
      <a href="event-details.html?id=${ev.id}">
        <span>${ev.title}</span>
        <i class="fa-solid fa-angle-left" style="font-size:0.75rem; color:#C5A059;"></i>
      </a>
    `).join("");
  }

  // تهيئة صفحة الرئيسية (أبرز 8 حفلات)
  const homeEventsGrid = document.getElementById("homeEventsGrid");
  if (homeEventsGrid && typeof FLORAL_EVENTS !== "undefined") {
    renderEventCards(FLORAL_EVENTS.slice(0, 8), homeEventsGrid);
  }

  // تهيئة صفحة جميع الحفلات (كل الـ 15 حفلة مع البحث والفلترة والترتيب)
  const allEventsGrid = document.getElementById("allEventsGrid");
  if (allEventsGrid && typeof FLORAL_EVENTS !== "undefined") {
    initAllEventsPage(allEventsGrid);
  }

  // تهيئة صفحة تفاصيل الحفلة
  const eventDetailContainer = document.getElementById("eventDetailContainer");
  if (eventDetailContainer && typeof FLORAL_EVENTS !== "undefined") {
    initEventDetailsPage(eventDetailContainer);
  }

  // تهيئة صفحة سابقة الأعمال
  const portfolioGrid = document.getElementById("portfolioGrid");
  if (portfolioGrid && typeof PORTFOLIO_WORKS !== "undefined") {
    initPortfolioPage(portfolioGrid);
  }

  // تهيئة مصمم الذكاء الاصطناعي
  const aiForm = document.getElementById("aiStylistForm");
  if (aiForm) {
    initAIStylist(aiForm);
  }

  // تهيئة الشات بوت
  initChatbot();
});

function renderEventCards(eventsList, container) {
  if (!eventsList.length) {
    container.innerHTML = `<p style="grid-column:1/-1; text-align:center; padding:40px; color:#5F6863;">لا توجد مناسبات مطابقة لبحثك حالياً.</p>`;
    return;
  }
  container.innerHTML = eventsList.map(ev => `
    <article class="event-card">
      <a href="event-details.html?id=${ev.id}" class="event-card-img">
        <img src="${ev.image}" alt="${ev.title}" loading="lazy">
        <span class="discount-ribbon">${ev.badge}</span>
        <span class="category-chip">${ev.category}</span>
      </a>
      <div class="event-card-body">
        <a href="event-details.html?id=${ev.id}">
          <h3 class="event-card-title">${ev.title}</h3>
        </a>
        <p class="event-card-desc">${ev.shortDesc}</p>
        <div class="event-card-footer">
          <span class="price-note"><i class="fa-solid fa-tag"></i> يُصمَّم حسب ميزانيتك</span>
          <div style="display:flex; gap:8px;">
            <a href="event-details.html?id=${ev.id}" class="btn btn-outline" style="padding:7px 14px; font-size:0.82rem;">التفاصيل</a>
            <a href="${getWhatsAppUrl(`السلام عليكم FLORAL JOY، أرغب بالاستفسار عن باقات (${ev.title}) والاستفادة من خصم الـ 30%.`)}" target="_blank" class="btn btn-whatsapp" style="padding:7px 12px; font-size:0.85rem;" title="اطلب عبر واتساب">
              <i class="fa-brands fa-whatsapp"></i>
            </a>
          </div>
        </div>
      </div>
    </article>
  `).join("");
}

function initAllEventsPage(container) {
  let currentCategory = "الكل";
  let currentSearch = "";
  let currentSort = "recommended";

  const searchInput = document.getElementById("eventSearchInput");
  const sortSelect = document.getElementById("eventSortSelect");
  const filterButtons = document.querySelectorAll(".filter-pill");

  function updateList() {
    let filtered = [...FLORAL_EVENTS];

    if (currentCategory !== "الكل") {
      filtered = filtered.filter(e => e.category === currentCategory);
    }

    if (currentSearch.trim() !== "") {
      const q = currentSearch.trim().toLowerCase();
      filtered = filtered.filter(e =>
        e.title.toLowerCase().includes(q) ||
        e.shortDesc.toLowerCase().includes(q) ||
        e.category.toLowerCase().includes(q)
      );
    }

    if (currentSort === "bestselling") {
      filtered.sort((a, b) => a.popularRank - b.popularRank);
    } else if (currentSort === "rating") {
      filtered.sort((a, b) => b.rating - a.rating);
    } else if (currentSort === "price-desc") {
      filtered.sort((a, b) => b.tierOrder - a.tierOrder);
    } else if (currentSort === "price-asc") {
      filtered.sort((a, b) => a.tierOrder - b.tierOrder);
    }

    renderEventCards(filtered, container);
  }

  filterButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      filterButtons.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      currentCategory = btn.dataset.category;
      updateList();
    });
  });

  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      currentSearch = e.target.value;
      updateList();
    });
  }

  if (sortSelect) {
    sortSelect.addEventListener("change", (e) => {
      currentSort = e.target.value;
      updateList();
    });
  }

  updateList();
}

function initEventDetailsPage(container) {
  const params = new URLSearchParams(window.location.search);
  const eventId = params.get("id") || "wedding";
  const ev = FLORAL_EVENTS.find(item => item.id === eventId) || FLORAL_EVENTS[0];

  document.title = `${ev.title} | FLORAL JOY`;
  const breadcrumbTitle = document.getElementById("breadcrumbEventTitle");
  if (breadcrumbTitle) breadcrumbTitle.textContent = ev.title;

  container.innerHTML = `
    <div class="detail-grid">
      <div class="detail-gallery">
        <img src="${ev.image}" alt="${ev.title}">
      </div>
      <div>
        <span class="hero-pill"><i class="fa-solid fa-sparkles" style="color:#C5A059;"></i> ${ev.badge}</span>
        <h1 style="font-size:2.2rem; color:#132A23; margin-bottom:12px;">${ev.title}</h1>
        <p style="color:#5F6863; font-size:1.05rem; margin-bottom:22px;">${ev.fullDesc}</p>

        <div style="background:#FFFFFF; padding:22px; border-radius:18px; border:1px solid rgba(197,160,89,0.25); margin-bottom:24px;">
          <h3 style="color:#132A23; margin-bottom:12px; font-size:1.1rem;">أبرز ما يشمله التنسيق:</h3>
          <ul class="tier-list">
            ${ev.includes.map(inc => `<li><i class="fa-solid fa-check-circle"></i> <span>${inc}</span></li>`).join("")}
          </ul>
        </div>

        <div style="display:flex; flex-wrap:wrap; gap:12px;">
          <a href="${getWhatsAppUrl(`السلام عليكم FLORAL JOY، أرغب بحجز باقة (${ev.title}) بعد خصم الـ 30% وتحديد الميزانية المناسبة.`)}" target="_blank" class="btn btn-whatsapp">
            <i class="fa-brands fa-whatsapp"></i> اطلب التنسيق الآن عبر واتساب
          </a>
          <a href="ai-planner.html" class="btn btn-gold">
            <i class="fa-solid fa-wand-magic-sparkles"></i> صمّمها بالذكاء الاصطناعي
          </a>
        </div>
      </div>
    </div>

    <div style="margin-top:60px;">
      <div class="section-header" style="margin-bottom:28px;">
        <span class="section-tag">فخامة تُصمَّم بما يناسب ميزانيتك</span>
        <h2 class="section-title">اختاري مستوى الباقة المناسب لميزانيتك</h2>
        <p class="section-subtitle">جميع الباقات قابلة للتعديل بالكامل وتشمل خصم الـ 30% الحالي</p>
      </div>
      <div class="tiers-grid">
        <div class="tier-card">
          <span class="section-tag">الباقة الأنيقة</span>
          <h3 style="font-size:1.35rem; color:#132A23; margin-bottom:8px;">تنسيق أساسي راقٍ</h3>
          <p style="font-size:0.9rem; color:#5F6863; margin-bottom:16px;">مثالية للمناسبات المنزلية والتجمعات العائلية الدافئة.</p>
          <ul class="tier-list" style="margin-bottom:20px;">
            <li><i class="fa-solid fa-check"></i> خلفية رئيسية مع تنسيق ورد طبيعي</li>
            <li><i class="fa-solid fa-check"></i> تنسيق طاولة الضيافة الأساسية</li>
            <li><i class="fa-solid fa-check"></i> لوحة ترحيبية مخصصة باسم المناسبة</li>
          </ul>
          <a href="${getWhatsAppUrl(`السلام عليكم، أستفسر عن (الباقة الأنيقة) لـ ${ev.title} بعد خصم الـ 30%.`)}" target="_blank" class="btn btn-outline" style="width:100%;">استفسر حسب ميزانيتك</a>
        </div>

        <div class="tier-card featured">
          <span class="discount-ribbon" style="position:static; display:inline-block; margin-bottom:10px;">الأكثر طلباً — خصم 30%</span>
          <h3 style="font-size:1.35rem; color:#132A23; margin-bottom:8px;">الباقة الفاخرة المتكاملة</h3>
          <p style="font-size:0.9rem; color:#5F6863; margin-bottom:16px;">تجمع بين فخامة الزهور الطبيعية والإضاءات وتوزيعات الطاولات.</p>
          <ul class="tier-list" style="margin-bottom:20px;">
            <li><i class="fa-solid fa-check"></i> تصميم متكامل للمنصة أو ركن التصوير</li>
            <li><i class="fa-solid fa-check"></i> تنسيق طاولات المدعوين والمدخل</li>
            <li><i class="fa-solid fa-check"></i> إضاءات دافئة وشموع وإكسسوارات ذهبية</li>
            <li><i class="fa-solid fa-check"></i> إشراف فريق التنسيق قبل وأثناء الحفل</li>
          </ul>
          <a href="${getWhatsAppUrl(`السلام عليكم، أرغب في (الباقة الفاخرة المتكاملة) لـ ${ev.title} بعد خصم الـ 30%.`)}" target="_blank" class="btn btn-primary" style="width:100%;">احجز الباقة عبر واتساب</a>
        </div>

        <div class="tier-card">
          <span class="section-tag">الباقة الملكية VIP</span>
          <h3 style="font-size:1.35rem; color:#132A23; margin-bottom:8px;">تصميم خاص من الصفر</h3>
          <p style="font-size:0.9rem; color:#5F6863; margin-bottom:16px;">للقاعات الكبرى والاحتفالات الاستثنائية بتفاصيل مصممة حصرياً لك.</p>
          <ul class="tier-list" style="margin-bottom:20px;">
            <li><i class="fa-solid fa-check"></i> مخطط 3D وتصميم حصري للموقع</li>
            <li><i class="fa-solid fa-check"></i> كثافة زهور طبيعية مستوردة</li>
            <li><i class="fa-solid fa-check"></i> تنسيق شامل للممرات والطاولات والضيافة</li>
          </ul>
          <a href="${getWhatsAppUrl(`السلام عليكم، أرغب في تصميم خاص VIP لـ ${ev.title} بعد خصم الـ 30%.`)}" target="_blank" class="btn btn-gold" style="width:100%;">اطلب استشارة VIP</a>
        </div>
      </div>
    </div>
  `;
}

function initPortfolioPage(container) {
  const buttons = document.querySelectorAll(".portfolio-filter");
  function renderWorks(cat) {
    const list = cat === "الكل" ? PORTFOLIO_WORKS : PORTFOLIO_WORKS.filter(w => w.category === cat);
    container.innerHTML = list.map(work => `
      <div class="portfolio-card">
        <img src="${work.image}" alt="${work.title}" loading="lazy">
        <div class="portfolio-info">
          <span class="section-tag">${work.category}</span>
          <h3 style="color:#132A23; font-size:1.2rem; margin-bottom:8px;">${work.title}</h3>
          <p style="color:#5F6863; font-size:0.92rem; margin-bottom:14px;">${work.desc}</p>
          <a href="${getWhatsAppUrl(`السلام عليكم، أعجبني تنفيذكم (${work.title}) وأرغب بتنسيق مشابه لمناسبتي.`)}" target="_blank" class="btn btn-outline" style="padding:7px 16px; font-size:0.84rem;">
            اطلب تصميماً مشابهاً
          </a>
        </div>
      </div>
    `).join("");
  }

  buttons.forEach(btn => {
    btn.addEventListener("click", () => {
      buttons.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      renderWorks(btn.dataset.category);
    });
  });

  renderWorks("الكل");
}

function initAIStylist(form) {
  const PALETTES = {
    "كلاسيكي ملكي": {
      colors: ["#FAF7F2", "#C5A059", "#132A23", "#FFFFFF"],
      names: "العاجي الدافئ + الذهبي الشامبانيا + الأخضر الملكي",
      flowers: "ورود الجوري الأبيض الهولندي، الأوركيد، وأوراق الأوكالبتوس."
    },
    "رومانسي ناعم": {
      colors: ["#F8E8E8", "#E8CFCB", "#D4A373", "#FFFDF9"],
      names: "الوردي الباستيل + الخوخي الناعم + الأبيض اللؤلؤي",
      flowers: "البيوني الوردي، البيبي جوري، والجبسوفيليا السحابية."
    },
    "مودرن عصري": {
      colors: ["#EBF2FA", "#85A7D0", "#0E234E", "#FFFFFF"],
      names: "الأزرق السماوي الهادئ + الكحلي الملكي + الأبيض النقي",
      flowers: "الهيدرانجيا الزرقاء، التوليب الأبيض، ولمسات الأكريليك الشفاف."
    },
    "تراثي سعودي فاخر": {
      colors: ["#3E2723", "#C5A059", "#F3ECE1", "#2E5A44"],
      names: "الذهبي المعتّق + البيج الرملي + الأخضر النجدي",
      flowers: "الفل والياسمين، الجوري الأحمر الداكن، مع فوانيس نحاسية."
    }
  };

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const eventType = document.getElementById("aiEventType").value;
    const style = document.getElementById("aiStyle").value;
    const budget = document.getElementById("aiBudget").value;
    const guests = document.getElementById("aiGuests").value;
    const city = document.getElementById("aiCity").value;

    const palette = PALETTES[style] || PALETTES["كلاسيكي ملكي"];
    const resultDiv = document.getElementById("aiOutputContent");
    const waBtn = document.getElementById("aiWhatsAppShare");

    resultDiv.innerHTML = `
      <span class="top-bar-badge" style="margin-bottom:12px; display:inline-block;">مقترح FLORAL JOY الذكي — شامل خصم 30%</span>
      <h3 style="font-size:1.45rem; color:#DFC48C; margin-bottom:10px;">تصميم ${eventType} (${style})</h3>
      <p style="font-size:0.95rem; opacity:0.92; margin-bottom:14px;">
        مُهيأ لـ <strong>${guests} ضيف</strong> في مدينة <strong>${city}</strong> ضمن فئة الميزانية <strong>${budget}</strong>.
      </p>
      <div style="margin-bottom:14px;">
        <strong style="color:#DFC48C; font-size:0.9rem;">لوحة الألوان المقترحة (${palette.names}):</strong>
        <div class="palette-dots">
          ${palette.colors.map(c => `<span class="palette-dot" style="background:${c};" title="${c}"></span>`).join("")}
        </div>
      </div>
      <p style="font-size:0.92rem; margin-bottom:10px;"><strong>الزهور المقترحة:</strong> ${palette.flowers}</p>
      <p style="font-size:0.92rem;"><strong>توزيع العناصر:</strong> خلفية رئيسية بارتفاع 2.8م + تنسيق طاولة الضيافة + إضاءات دافئة + لوحة ترحيبية مخصصة.</p>
    `;

    const msg = `مرحباً FLORAL JOY، صممت خطة مناسبتي عبر المساعد الذكي:
- المناسبة: ${eventType}
- الطابع: ${style}
- المدينة: ${city}
- عدد الضيوف: ${guests}
- الميزانية: ${budget}
أرغب بتأكيد العرض مع خصم الـ 30%.`;
    waBtn.href = getWhatsAppUrl(msg);
    waBtn.style.display = "inline-flex";
  });
}

function initChatbot() {
  const toggleBtn = document.getElementById("chatbotToggle");
  const closeBtn = document.getElementById("chatbotClose");
  const chatWin = document.getElementById("chatbotWindow");
  const messagesBox = document.getElementById("chatMessages");
  const chatInput = document.getElementById("chatInput");
  const chatSend = document.getElementById("chatSend");

  if (!toggleBtn || !chatWin) return;

  toggleBtn.addEventListener("click", () => chatWin.classList.toggle("open"));
  if (closeBtn) closeBtn.addEventListener("click", () => chatWin.classList.remove("open"));

  function addMessage(text, sender = "bot") {
    const div = document.createElement("div");
    div.className = `chat-msg ${sender}`;
    div.innerHTML = text;
    messagesBox.appendChild(div);
    messagesBox.scrollTop = messagesBox.scrollHeight;
  }

  function handleBotReply(userText) {
    const t = userText.toLowerCase();
    let reply = `يسعدنا خدمتك في <strong>FLORAL JOY</strong>! جميع باقاتنا تُصمَّم بما يناسب ميزانيتك مع <strong>خصم 30%</strong>. يمكنك التحدث مباشرة مع المنسقة عبر <a href="${getWhatsAppUrl("السلام عليكم FLORAL JOY، أرغب بالاستفسار عن تنسيق مناسبة.")}" target="_blank" style="color:#1E9E54; font-weight:700; text-decoration:underline;">واتساب</a>.`;

    if (t.includes("خصم") || t.includes("سعر") || t.includes("اسعار") || t.includes("ميزانية")) {
      reply = `نقدم حالياً <strong>خصم 30%</strong> على جميع الحفلات! شعارنا "فخامة تُصمَّم بما يناسب ميزانيتك"، أخبرينا بنوع المناسبة وميزانيتك وسنجهز لك أفضل باقة.`;
    } else if (t.includes("زواج") || t.includes("خطوبة") || t.includes("حناء")) {
      reply = `لدينا قسم متكامل للأفراح والخطوبة وليلة الحناء يشمل الكوشة وممر العروس وطاولات الضيافة. شاهدي التفاصيل في <a href="events.html" style="color:#C5A059; font-weight:700;">صفحة جميع الحفلات</a>.`;
    } else if (t.includes("مولود") || t.includes("ولادة") || t.includes("تسنين") || t.includes("كشف")) {
      reply = `نبدع في حفلات الكشف عن المولود، استقبال الولادة، وحفلات التسنين بألوان باستيل ناعمة ولوحات مخصصة باسم الطفل.`;
    } else if (t.includes("رقم") || t.includes("تواصل") || t.includes("واتس")) {
      reply = `رقم التواصل والواتساب المباشر: <strong dir="ltr">+966501707487</strong> — أو اضغطي <a href="${getWhatsAppUrl("مرحباً FLORAL JOY")}" target="_blank" style="color:#1E9E54; font-weight:700;">هنا للمراسلة الفورية</a>.`;
    }

    setTimeout(() => addMessage(reply, "bot"), 350);
  }

  document.querySelectorAll(".quick-chip").forEach(chip => {
    chip.addEventListener("click", () => {
      const q = chip.textContent;
      addMessage(q, "user");
      handleBotReply(q);
    });
  });

  if (chatSend && chatInput) {
    const sendAction = () => {
      const val = chatInput.value.trim();
      if (!val) return;
      addMessage(val, "user");
      chatInput.value = "";
      handleBotReply(val);
    };
    chatSend.addEventListener("click", sendAction);
    chatInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter") sendAction();
    });
  }
}
