import { v as pop, t as push, x as stringify } from "../../chunks/index.js";
import { e as escape_html } from "../../chunks/escaping.js";
const replacements = {
  translate: /* @__PURE__ */ new Map([
    [true, "yes"],
    [false, "no"]
  ])
};
function attr(name, value, is_boolean = false) {
  if (value == null || !value && is_boolean) return "";
  const normalized = name in replacements && replacements[name].get(value) || value;
  const assignment = is_boolean ? "" : `="${escape_html(normalized, true)}"`;
  return ` ${name}${assignment}`;
}
function Icon($$payload, $$props) {
  push();
  let { name, size = 15 } = $$props;
  $$payload.out.push(`<div class="dropdown-icon svelte-16tm08j"><svg${attr("width", size)}${attr("height", size)} class="svelte-16tm08j"><use${attr("href", `#${stringify(name)}`)}></use></svg></div>`);
  pop();
}
function _page($$payload) {
  $$payload.out.push(`<div>Hello @econic/ui-kit `);
  Icon($$payload, { name: "arrow-right" });
  $$payload.out.push(`<!----></div>`);
}
export {
  _page as default
};
