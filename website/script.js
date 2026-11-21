// FairFriends landing: EN/ES toggle + gentle hero parallax.
// Vanilla, no dependencies.

/* ---------- i18n ---------- */
const I18N = {
  en: {
    "nav.features": "Features",
    "nav.how": "How it works",
    "nav.early": "Early access",
    "nav.cta": "Join early access",
    "hero.title": 'Money between friends, <em>made fair.</em>',
    "hero.sub": "FairFriends keeps track of what everyone owes and who paid what — group balances for shared plans, IOUs between two people, and payments you accept with one tap. No awkward math, no forgotten debts.",
    "hero.cta": "Join early access",
    "hero.github": "View the project",
    "hero.note": "Free · English and Spanish · Your data stays between you and your friends",
    "mock.balance": "Balance",
    "mock.promise": "Promise",
    "mock.trip": "Cabin trip",
    "mock.owes": "Owes me $80",
    "mock.paid": "paid",
    "mock.accepted": "accepted your payment",
    "features.title": "Four words carry the whole app.",
    "features.sub": "FairFriends is built around the way friends actually handle money — not ledger software.",
    "f1.es": " · Balance",
    "f1.body": "A shared tab among a group — a trip, a flat, a birthday dinner. Everyone's part is tracked live, so \u201Cwho owes what\u201D is a glance, not a spreadsheet.",
    "f2.es": " · Promesa",
    "f2.body": "A simple IOU between two people. One of you owes the other a fixed amount — FairFriends keeps the deadline and lets you split it across members when it's not one person's burden.",
    "f3.es": " · Pago",
    "f3.body": "Payments land as suggestions, not surprises: the receiver accepts or rejects, and amounts can be uneven. Paid $63 of a $90 promise? That's allowed, and it's recorded.",
    "f4.es": " · Amistad",
    "f4.body": "Contacts join by request and accept on their side — nobody tracks money for a stranger. Everything else stays between the people who were there.",
    "how.title": "How it works.",
    "how.s1": "Add your friends",
    "how.s1b": "Send a contact request. They accept — now you share a ledger, nothing more.",
    "how.s2": "Create a balance or a promise",
    "how.s2b": "Group plan or one-on-one IOU — pick the shape that fits, set amounts, done.",
    "how.s3": "Accept payments as they land",
    "how.s3b": "One tap confirms what came in. FairFriends updates everyone's part instantly.",
    "early.title": "The first release is nearly ready.",
    "early.sub": "FairFriends for iOS and Android is in final polish. The app ships in English and Spanish on day one — if you want in early, say hello on GitHub.",
    "early.repo": "FairFriends on GitHub",
    "early.contact": "Talk to us",
    "footer.tag": "split expenses with friends, without the friction.",
    "footer.built": "Built by",
  },
  es: {
    "nav.features": "Funciones",
    "nav.how": "Cómo funciona",
    "nav.early": "Acceso anticipado",
    "nav.cta": "Únete al acceso anticipado",
    "hero.title": 'Dinero entre amigos, <em>sin líos.</em>',
    "hero.sub": "FairFriends lleva la cuenta de lo que cada uno debe y de quién pagó qué — saldos compartidos para planes de grupo, promesas entre dos personas y pagos que aceptas con un toque. Sin cuentas raras, sin deudas olvidadas.",
    "hero.cta": "Únete al acceso anticipado",
    "hero.github": "Ver el proyecto",
    "hero.note": "Gratis · En español e inglés · Tus datos se quedan entre tú y tus amigos",
    "mock.balance": "Saldo",
    "mock.promise": "Promesa",
    "mock.trip": "Viaje a la cabaña",
    "mock.owes": "Me deben $80",
    "mock.paid": "pagado",
    "mock.accepted": "aceptó tu pago",
    "features.title": "Cuatro palabras sostienen toda la app.",
    "features.sub": "FairFriends está construido sobre cómo los amigos realmente manejan el dinero — no sobre software de contabilidad.",
    "f1.es": " · Saldo",
    "f1.body": "Una cuenta compartida en grupo — un viaje, un departamento, una cena. La parte de cada quien se actualiza en vivo: \u201C¿quién debe qué?\u201D se ve de un vistazo, no en una hoja de cálculo.",
    "f2.es": " · Promesa",
    "f2.body": "Un \u201Cte debo\u201D simple entre dos personas. Uno debe al otro un monto fijo — FairFriends vigila la fecha y te deja dividirlo entre miembros cuando no es carga de una sola persona.",
    "f3.es": " · Pago",
    "f3.body": "Los pagos llegan como propuestas, no como sorpresas: quien recibe acepta o rechaza, y los montos pueden ser desiguales. ¿Pagaste $63 de una promesa de $90? Se puede, y queda registrado.",
    "f4.es": " · Amistad",
    "f4.body": "Los contactos entran por invitación y aceptan de su lado — nadie lleva cuentas de un desconocido. Todo lo demás se queda entre los que estuvieron ahí.",
    "how.title": "Cómo funciona.",
    "how.s1": "Agrega a tus amigos",
    "how.s1b": "Manda una solicitud de contacto. Ellos aceptan — y comparten una cuenta contigo, nada más.",
    "how.s2": "Crea un saldo o una promesa",
    "how.s2b": "Plan de grupo o promesa de dos — elige la forma que corresponda, pon los montos y listo.",
    "how.s3": "Acepta los pagos conforme llegan",
    "how.s3b": "Un toque confirma lo que entró. FairFriends actualiza la parte de cada quien al instante.",
    "early.title": "El primer lanzamiento ya casi está listo.",
    "early.sub": "FairFriends para iOS y Android está en pulido final. La app sale en español e inglés desde el día uno — si quieres entrar antes, salúdanos en GitHub.",
    "early.repo": "FairFriends en GitHub",
    "early.contact": "Habla con nosotros",
    "footer.tag": "divide gastos con amigos, sin fricción.",
    "footer.built": "Construida por",
  },
};

const langToggle = document.getElementById("lang-toggle");
let lang = "en";

function applyLang(next) {
  lang = next;
  document.documentElement.lang = lang;
  const dict = I18N[lang];
  document.querySelectorAll("[data-i18n]").forEach((el) => {
    const key = el.getAttribute("data-i18n");
    if (dict[key] !== undefined) el.innerHTML = dict[key];
  });
  langToggle.querySelectorAll(".lang-opt").forEach((opt) => {
    if (opt.dataset.lang === lang) opt.setAttribute("data-active", "");
    else opt.removeAttribute("data-active");
  });
  try { localStorage.setItem("ff-lang", lang); } catch {}
}

langToggle.addEventListener("click", () => {
  applyLang(lang === "en" ? "es" : "en");
});

let saved = "en";
try { saved = localStorage.getItem("ff-lang") || "en"; } catch {}
applyLang(saved === "es" ? "es" : "en");

/* ---------- hero phone parallax (fine pointers only) ---------- */
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
const phone = document.getElementById("phone");

if (phone && !reduceMotion.matches && finePointer.matches) {
  let targetX = 0, targetY = 0, curX = 0, curY = 0, raf = 0;
  const tick = () => {
    curX += (targetX - curX) * 0.08;
    curY += (targetY - curY) * 0.08;
    phone.style.transform = `rotateY(${(-6 + curX * 4).toFixed(2)}deg) rotateX(${(2 + curY * -3).toFixed(2)}deg)`;
    if (Math.abs(targetX - curX) > 0.001 || Math.abs(targetY - curY) > 0.001) {
      raf = requestAnimationFrame(tick);
    } else {
      raf = 0;
    }
  };
  const schedule = () => { if (!raf) raf = requestAnimationFrame(tick); };
  document.addEventListener("pointermove", (e) => {
    targetX = (e.clientX / window.innerWidth - 0.5) * 2;
    targetY = (e.clientY / window.innerHeight - 0.5) * 2;
    schedule();
  });
  document.addEventListener("pointerleave", () => { targetX = 0; targetY = 0; schedule(); });
}
