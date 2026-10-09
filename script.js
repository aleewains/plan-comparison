// Marks each feature row as differing or identical by comparing its cell values,
// so the data in index.html is the only source of truth.
(function () {
  const table = document.getElementById("plan-table");
  const toggle = document.getElementById("diff-toggle");
  const status = document.getElementById("diff-status");
  if (!table || !toggle || !status) return;

  const rows = Array.from(table.querySelectorAll(".feature-row"));
  let differing = 0;

  rows.forEach((row) => {
    const values = Array.from(row.querySelectorAll("td"), (td) => td.dataset.value);
    const differs = new Set(values).size > 1;
    if (differs) differing++;
    row.classList.add(differs ? "is-diff" : "is-same");

    // A text tag, so the state is never carried by colour alone.
    // It sits inside the row header, so screen readers hear it with the feature name.
    const tag = document.createElement("span");
    tag.className = "tag " + (differs ? "tag-diff" : "tag-same");
    tag.hidden = true;
    tag.innerHTML = '<span class="sr-only">, </span>' + (differs ? "Differs" : "Same on every plan");
    row.querySelector("th").appendChild(tag);
  });

  function setHighlight(on) {
    toggle.setAttribute("aria-pressed", String(on));
    table.dataset.diff = on ? "on" : "off";
    table.querySelectorAll(".tag").forEach((tag) => { tag.hidden = !on; });
    status.textContent = on
      ? `${differing} of ${rows.length} features differ between plans. They are marked “Differs”.`
      : "Highlighting is off.";
  }

  toggle.addEventListener("click", () => {
    setHighlight(toggle.getAttribute("aria-pressed") !== "true");
  });

  // Plan buttons: demo only, but they confirm the action instead of doing nothing.
  const choice = document.querySelector(".choice-status");
  document.querySelectorAll("[data-plan]").forEach((btn) => {
    btn.addEventListener("click", () => {
      choice.textContent = `You chose ${btn.dataset.plan}. Sign-up is not part of this demo.`;
    });
  });
})();
