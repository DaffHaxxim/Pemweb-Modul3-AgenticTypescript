// VERBATIM JavaScript from Modul 2, section 2.3 (DOM Manipulation), renamed to .ts.
// Not part of the build (lives in notes/, not src/). Checked with: npx tsc -p notes
// Only change: the second `paragraphs` (2.3.10) is wrapped in a block, because all snippets
// share one file here and a repeated `const` name would add a redeclaration error that
// is an artifact of concatenating the snippets, not of the original code.

// 2.3.1 DOM Document
const title = document.getElementById("title");
const paragraphs = document.querySelectorAll("p");

// 2.3.2 DOM Elements
title.textContent = "New Title";
title.style.color = "blue";

// 2.3.3 DOM HTML
const content = document.getElementById("content");
content.innerHTML =
  "<h1>Judul Baru</h1><p>Paragraf diubah dengan innerHTML.</p>";

// 2.3.4 DOM Forms
const form = document.getElementById("myForm");
form.addEventListener("submit", (event) => {
  event.preventDefault();
  const inputValue = document.getElementById("inputField").value;
  alert(`Input value: ${inputValue}`);
});

// 2.3.5 DOM CSS
title.style.fontSize = "24px";
title.style.backgroundColor = "yellow";

// 2.3.6 DOM Animations
const box = document.getElementById("box");
box.style.transition = "transform 0.5s";
box.style.transform = "rotate(45deg)";

// 2.3.7 DOM Events
function changeText(id) {
  id.innerHTML = "Huft!";
}

// 2.3.8 DOM Event Listener
button.addEventListener("click", () => {
  console.log("Button was clicked!");
});

// 2.3.9 DOM Nodes
const parentElement = document.getElementById("parent");
const childElement = document.getElementById("child");
parentElement.removeChild(childElement);

// 2.3.10 DOM Collections & Node List
{
  const paragraphs = document.querySelectorAll("p");
  paragraphs.forEach((p) => {
    p.style.color = "green";
  });
}

const divs = document.getElementsByTagName("div");
for (let i = 0; i < divs.length; i++) {
  divs[i].style.backgroundColor = "yellow";
}
