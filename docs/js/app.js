const $ = (el) => document.querySelector(el);

let data = {};

const loadData = async () => {
  try {
    const res = await fetch("./data/info.json");
    data = await res.json();
  } catch (error) {
    console.error("Error loading data:", error);
  }
};

await loadData();

// Función para obtener valores anidados del objeto usando notación de puntos
const getNestedValue = (obj, path) => {
  return path.split(".").reduce((current, key) => current?.[key], obj);
};

// Función para renderizar los datos en el HTML (con soporte para HTML en JSON)
const renderData = () => {
  const elements = document.querySelectorAll("*");

  elements.forEach((element) => {
    // ================== Procesar atributos ==================
    Array.from(element.attributes).forEach((attr) => {
      const matches = attr.value.match(/\{\{\s*([^}]+)\s*\}\}/g);
      if (matches) {
        let newValue = attr.value;
        matches.forEach((match) => {
          const key = match.replace(/\{\{\s*|\s*\}\}/g, "");
          const value = getNestedValue(data.info, key) || "--";
          newValue = newValue.replace(match, value);
        });
        element.setAttribute(attr.name, newValue);
      }
    });

    // ================== Procesar contenido (ahora con HTML) ==================
    const htmlMatches = element.innerHTML.match(/\{\{\s*([^}]+)\s*\}\}/g);
    if (htmlMatches) {
      let newHTML = element.innerHTML;
      htmlMatches.forEach((match) => {
        const key = match.replace(/\{\{\s*|\s*\}\}/g, "");
        const value = getNestedValue(data.info, key) || "";

        // Si el valor contiene HTML (como <br/>), será renderizado
        newHTML = newHTML.replace(match, value);
      });
      element.innerHTML = newHTML; // <- Aquí se interpreta HTML correctamente
    }
  });
};

// Renderizar los datos
renderData();

const renderValueChips = (value) => {
  const percent = Math.min(Math.max(value, 0), 1) * 100;

  const dim = "1rem";
  const radius = 50;
  const viewBox = radius * 3;

  const chipValue = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "svg"
  );
  chipValue.style.height = dim;
  chipValue.style.width = dim;
  chipValue.setAttribute("viewBox", `0 0 ${viewBox} ${viewBox}`);

  const circumference = 2 * Math.PI * radius;

  const circleProgress = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "circle"
  );
  circleProgress.setAttribute("cy", viewBox / 2);
  circleProgress.setAttribute("cx", viewBox / 2);
  circleProgress.setAttribute("r", radius);
  circleProgress.setAttribute("stroke", "var(--primary)");
  circleProgress.setAttribute("stroke-width", "16px");
  circleProgress.setAttribute("fill", "none");
  circleProgress.setAttribute("stroke-linecap", "round");
  circleProgress.setAttribute(
    "transform",
    `rotate(270 ${viewBox / 2} ${viewBox / 2})`
  );
  circleProgress.style.strokeDasharray = circumference;
  circleProgress.style.strokeDashoffset = circumference; // inicia vacío
  circleProgress.style.transition = "stroke-dashoffset 1s ease";
  chipValue.appendChild(circleProgress);

  // Ejecuta animación
  requestAnimationFrame(() => {
    circleProgress.style.strokeDashoffset =
      circumference - (percent / 100) * circumference;
  });

  return chipValue;
};

const renderChips = (value = false) => {
  const chips = $("#chips");
  data.info.habilities.forEach((chip) => {
    const chipElement = document.createElement("div");
    chipElement.classList.add("chip");
    chipElement.textContent = chip.name;
    // Renderiza los valores de cada habilidad
    if (value !== false) {
      if (chip.level !== undefined || chip.level !== 0) {
        let chipValue = renderValueChips(chip.level);
        chipElement.appendChild(chipValue);
      }
    }
    chips.appendChild(chipElement);
  });
};

renderChips(true);

const renderEducation = () => {
  const education = $("#education");
  data.info.education.forEach((edu) => {
    const section = document.createElement("div");
    section.classList.add("aside__header_section--line");
    section.innerHTML = `
            <div class="aside__header_section--line-icon mdi mdi-school"></div>
            <div class="aside__header_section--line-content"><b>${edu.program}</b> - ${edu.institution}  - ${edu.year}</div>
        `;
    education.appendChild(section);
  });
};

renderEducation();

const renderSummary = () => {
  const summary = $("#summary");
  data.info.summary.forEach((s) => {
    const item = document.createElement("div");
    item.classList.add("summary__item");
    item.innerHTML = s;
    summary.append(item);
  });
};

renderSummary();

const renderAchievements = () => {
  const summary = $("#achievements");
  data.info.achievements.forEach((s) => {
    const item = document.createElement("div");
    item.classList.add("achievement");
    item.innerHTML = `
        <div class="achievement__value">
            <i class="mdi mdi-${s.icon}" style="margin-right: .5rem"></i>
            ${s.value}
        </div>
        <div class="achievement__content">${s.description}</div>
        `;
    summary.append(item);
  });
};

renderAchievements();

const renderWorks = () => {
  const summary = $("#works");
  data.info.works.forEach((s) => {
    const item = document.createElement("div");
    item.classList.add("work");
    item.addEventListener("click", () => {
      let wrapper = renderWorkDetails(s);

      summary.append(wrapper);
    });
    item.innerHTML = `
            <div class="work__title"><b>${s.company}</b></div>
            <div class="work__content">${s.title} • ${s.location} <br/>${s.city}, <b>${s.period}</b></div>
        `;
    summary.append(item);
  });
};

const renderWorkDetails = (detail) => {
  let wrapper = document.createElement("div");
  wrapper.classList.add("work__wrapper");
  wrapper.innerHTML = `
    <div class="work__wrapper_block">
    <!-- Start Actions --> 
    <div class="work__wrapper_actions">
    <div style="margin:0 auto 0 0" class="chips">
      <p style="margin:0 auto 0 0" class="chip">${detail.period}</p>
    </div>
      <i id="btn_${detail.id
    }" class="btn  btn-clean mdi mdi-24px mdi-page-previous"></i>
    </div>
    <!-- End Actions -->
    
    <!-- Start Header -->
    <div class="work__wrapper_header">
      <div class="work__wrapper_header--avatar">${detail.company.slice(
      0,
      2
    )}</div>
      <div class="work__wrapper_header--info">
        <div class="work__wrapper_header--info-company">${detail.company}</div>
        <div class="work__wrapper_header--info-title">${detail.title} • ${detail.location
    }</div>
        <div class="work__wrapper_header--info-location">${detail.city}, <b>${detail.period
    }</div>
      </div>
    </div>
    <!-- End Header -->

    <!-- Start Section -->
    <div class="work__wrapper_section">
      <div class="work__wrapper_section--content summary">${detail.summary
    }</div>
    </div>
    <!-- End Section -->

    <!-- Start Section -->
    <div class="work__wrapper_section">
      <div class="work__wrapper_section--title">Proyectos</div>
      <div class="work__wrapper_section--content">
        <ul style="margin:1rem 2rem 0 2rem; list-style-type: disc">
          ${detail.projects.map((p) => `<li>${p}</li>`).join("")}
        </ul>
      </div>
    </div>
    <!-- End Section -->

    <!-- Start Section -->
    <div class="work__wrapper_section">
      <div class="work__wrapper_section--title">Responsabilidades</div>
      <div class="work__wrapper_section--content">
        <ul style="margin:1rem 2rem 0 2rem; list-style-type: disc">
          ${detail.responsibilities.map((r) => `<li>${r}</li>`).join("")}
        </ul>
      </div>
    </div>
    <!-- End Section -->

    <!-- Start Section -->
    <div class="work__wrapper_section">
      <div class="work__wrapper_section--title">Logros</div>
      <div class="work__wrapper_section--content">
        <ul style="margin:1rem 2rem 0 2rem; list-style-type: disc">
          ${detail.achievements.map((a) => `<li>${a}</li>`).join("")}
        </ul>
      </div>
    </div>
    <!-- End Section -->
    
    </div>
  `;
  wrapper.querySelector(`#btn_${detail.id}`).addEventListener("click", () => {
    wrapper.remove();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === "Escape") {
      wrapper.remove()
    }
  })

  return wrapper;
};

renderWorks();
