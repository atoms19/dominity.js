import { DominityElement } from "./dom.js";
import {el} from "./builder.js"
/**
 *
 * @param {string} qry
 * @param  {...any} args
 * @returns {DominityElement}
 */
export function $el(qry, ...args) {
   return el(new DominityElement(qry).elem, ...args);
}
/**
 *
 * @param {string} qry
 * @returns {DominityElement[]}
 */
export function $$el(qry) {
   let elemArr = [];
   document.querySelectorAll(qry).forEach((e) => {
      elemArr.push(new DominityElement(e));
   });
   return elemArr;
}

export let htmlTags = [
   "a",
   "abbr",
   "address",
   "area",
   "article",
   "aside",
   "audio",
   "b",
   "base",
   "bdi",
   "bdo",
   "blockquote",
   "body",
   "br",
   "button",
   "canvas",
   "caption",
   "cite",
   "code",
   "col",
   "colgroup",
   "data",
   "datalist",
   "dd",
   "del",
   "details",
   "dfn",
   "dialog",
   "div",
   "dl",
   "dt",
   "em",
   "embed",
   "fieldset",
   "figcaption",
   "figure",
   "footer",
   "form",
   "h1",
   "h2",
   "h3",
   "h4",
   "h5",
   "h6",
   "header",
   "hr",
   "html",
   "i",
   "iframe",
   "img",
   "input",
   "ins",
   "kbd",
   "label",
   "legend",
   "li",
   "link",
   "main",
   "map",
   "mark",
   "meta",
   "meter",
   "nav",
   "noscript",
   "object",
   "ol",
   "optgroup",
   "option",
   "output",
   "p",
   "param",
   "picture",
   "pre",
   "progress",
   "q",
   "rb",
   "rp",
   "rt",
   "rtc",
   "s",
   "samp",
   "script",
   "section",
   "select",
   "small",
   "source",
   "span",
   "strong",
   "style",
   "sub",
   "summary",
   "sup",
   "table",
   "tbody",
   "td",
   "template",
   "textarea",
   "tfoot",
   "th",
   "thead",
   "time",
   "title",
   "tr",
   "u",
   "ul",
   "var",
   "video",
   "wbr",
   "slot"
   , "svg",
   "path",
   "circle",
   "rect",
   "polygon",
   "polyline",
   "line",
   "menu",
   "menuitem",
   "portal",
   "ruby",
   "track"

];

