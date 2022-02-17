/**
 *
 * 实现import-html-entry
 * https://github.com/kuitos/import-html-entry
 * 这里只实现 getExternalScripts  execScripts
 *  从模版中获取script  以及执行js
 */

import { fetchResource } from "./fetch-resource";

export const importHtml = async (url) => {
  console.log(url);
  const html = await fetchResource(url);
  const template = document.createElement("div");
  template.innerHTML = html;

  const scripts = template.querySelectorAll("script");

  //获取所有的script
  async function getExternalScripts() {
    console.log(scripts);
    return Promise.all(
      Array.from(scripts).map((script) => {
        const src = script.getAttribute("src");
        if (!src) {
          return Promise.resolve(script.innerHTML);
        } else {
          console.log(src, url);
          return fetchResource(src.startsWith("http") ? src : `${url}${src}`);
        }
      })
    );
  }

  //执行所有的script
  async function execScripts() {
    const scripts = await getExternalScripts();
    const module = { exports: {} };
    // no-unused-vars
    const exports = module.exports;
    scripts.forEach((res) => {
      eval(res);
    });
    return module.exports;
  }

  return {
    template,
    getExternalScripts,
    execScripts,
  };
};
