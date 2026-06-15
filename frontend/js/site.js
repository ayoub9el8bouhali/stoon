const toggler = document.querySelector("[data-stoon-toggle]");
const menu = document.querySelector("#mainNav");

toggler?.addEventListener("click", () => {
  const open = menu.classList.toggle("show");
  toggler.setAttribute("aria-expanded", String(open));
});

document.querySelectorAll("#mainNav a").forEach(link => {
  link.addEventListener("click", () => {
    menu?.classList.remove("show");
    toggler?.setAttribute("aria-expanded", "false");
  });
});

const token = localStorage.getItem("stoon_token");
document.querySelectorAll("[data-auth-link]").forEach(link => {
  link.textContent = token ? "Mon espace" : "Connexion";
  link.href = token ? "/pages/dashboard.html" : "/pages/login.html";
});
