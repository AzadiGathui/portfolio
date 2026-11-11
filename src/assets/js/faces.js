// A case study's team, as faces (layouts/project.njk; styles: "Team" in
// style.css). CSS shows a person's name and role under their face on hover
// and on keyboard focus. This adds what CSS can't:
//   - touch: there is no hover, so the first tap on a face shows who it is
//     and the second follows the link to their profile
//   - Escape puts a name away without moving the pointer or the focus
(() => {
  const faces = [...document.querySelectorAll(".face")];
  if (!faces.length) return;
  const close = () => faces.forEach((face) => face.classList.remove("is-open", "is-put-away"));

  let pointer = "mouse";
  document.addEventListener("pointerdown", (e) => {
    pointer = e.pointerType;
    if (!e.target.closest(".face")) close();
  });
  for (const face of faces) {
    face.addEventListener("click", (e) => {
      if (pointer !== "touch" || face.classList.contains("is-open")) return;
      e.preventDefault();   // first tap: show the name, don't leave the page
      close();
      face.classList.add("is-open");
    });
    // put away with Escape: shown again once the pointer or focus has left and come back
    face.addEventListener("pointerleave", () => face.classList.remove("is-put-away"));
    face.addEventListener("focusout", () => face.classList.remove("is-put-away"));
  }
  document.addEventListener("keydown", (e) => {
    if (e.key !== "Escape") return;
    for (const face of faces) {
      if (face.matches(":hover, :focus-within, .is-open")) face.classList.add("is-put-away");
      face.classList.remove("is-open");
    }
  });
})();
