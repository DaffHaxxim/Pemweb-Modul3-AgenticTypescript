// Exercise 7 (part 2) - Modul 2 section 2.3 (DOM Manipulation) in strict TypeScript.
// Original: notes/07-original/dom.original.ts. Each fix below answers one error recorded in
// notes/07-refactor-errors.md. Wrapped in a function because Node has no `document`;
// it is type-checked by `npm run typecheck` but intentionally never called by index.ts.
export function setupDom(): void {
  // 2.3.1 / 2.3.2 / 2.3.5: getElementById returns HTMLElement | null, so check first (module section 8).
  const title = document.getElementById("title");
  if (title) {
    title.textContent = "New Title";
    title.style.color = "blue";
    title.style.fontSize = "24px";
    title.style.backgroundColor = "yellow";
  }

  // 2.3.3
  const content = document.getElementById("content");
  if (content) {
    content.innerHTML = "<h1>Judul Baru</h1><p>Paragraf diubah dengan innerHTML.</p>";
  }

  // 2.3.4: `.value` exists on HTMLInputElement, not on HTMLElement, so narrow with instanceof (module section 9.4).
  const form = document.getElementById("myForm");
  if (form) {
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const input = document.getElementById("inputField");
      if (input instanceof HTMLInputElement) {
        alert(`Input value: ${input.value}`);
      }
    });
  }

  // 2.3.6
  const box = document.getElementById("box");
  if (box) {
    box.style.transition = "transform 0.5s";
    box.style.transform = "rotate(45deg)";
  }

  // 2.3.8: `button` was never declared in the original; look it up like the other elements.
  const button = document.getElementById("button");
  if (button) {
    button.addEventListener("click", () => {
      console.log("Button was clicked!");
    });
  }

  // 2.3.9: removeChild needs a non-null Node.
  const parentElement = document.getElementById("parent");
  const childElement = document.getElementById("child");
  if (parentElement && childElement) {
    parentElement.removeChild(childElement);
  }

  // 2.3.10: NodeList
  const paragraphs = document.querySelectorAll("p");
  paragraphs.forEach((p) => {
    p.style.color = "green";
  });

  // 2.3.10: HTMLCollection. With noUncheckedIndexedAccess, divs[i] is possibly undefined (module section 2).
  const divs = document.getElementsByTagName("div");
  for (let i = 0; i < divs.length; i++) {
    const div = divs[i];
    if (div) {
      div.style.backgroundColor = "yellow";
    }
  }
}

// 2.3.7: the parameter needs a type (TS7006). HTMLElement is what `innerHTML` lives on.
export function changeText(id: HTMLElement): void {
  id.innerHTML = "Huft!";
}
