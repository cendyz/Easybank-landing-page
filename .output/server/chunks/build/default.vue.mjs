import { _ as __nuxt_component_0 } from './nuxt-link.mjs';
import { defineComponent, ref, watch, mergeProps, unref, withCtx, createTextVNode, toDisplayString, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderAttr, ssrRenderClass, ssrRenderList, ssrRenderComponent, ssrInterpolate } from 'vue/server-renderer';
import { u as useBankStore } from './bank.mjs';
import { _ as _export_sfc } from './server.mjs';
import '../nitro/nitro.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'node:url';
import 'ipx';
import 'pinia';
import 'vue-router';

const logo = "data:image/svg+xml,%3csvg%20xmlns='http://www.w3.org/2000/svg'%20width='139'%20height='20'%3e%3cdefs%3e%3clinearGradient%20id='a'%20x1='72.195%25'%20x2='17.503%25'%20y1='0%25'%20y2='100%25'%3e%3cstop%20offset='0%25'%20stop-color='%2333D35E'/%3e%3cstop%20offset='100%25'%20stop-color='%232AB6D9'/%3e%3c/linearGradient%3e%3c/defs%3e%3cg%20fill='none'%20fill-rule='evenodd'%3e%3cpath%20fill='%232D314D'%20fill-rule='nonzero'%20d='M37.754%2015.847c2.852%200%205.152-1.622%205.952-4.216h-3.897c-.376.665-1.14%201.066-2.055%201.066-1.237%200-2.065-.674-2.32-1.978h8.44c.051-.352.081-.694.081-1.037%200-3.335-2.537-5.95-6.201-5.95-3.568%200-6.175%202.564-6.175%206.049%200%203.473%202.628%206.066%206.175%206.066zm2.344-7.297h-4.596c.317-1.129%201.11-1.749%202.252-1.749%201.181%200%202%20.613%202.344%201.75zm10.946%207.296c1.32%200%202.5-.434%203.43-1.188l.336.804h3.027V4.093h-2.919l-.4.88c-.94-.775-2.135-1.222-3.474-1.222-3.476%200-5.961%202.505-5.961%206.026%200%203.533%202.485%206.07%205.961%206.07zm.524-3.467c-1.467%200-2.545-1.108-2.545-2.593%200-1.475%201.069-2.583%202.545-2.583%201.466%200%202.544%201.108%202.544%202.583%200%201.485-1.078%202.593-2.544%202.593zm13.123%203.467c3.02%200%205.025-1.554%205.025-3.93%200-2.883-2.387-3.256-4.183-3.575-1.08-.193-1.95-.344-1.95-.99%200-.527.422-.838%201.05-.838.71%200%201.197.337%201.197%201.063h3.667c-.044-2.303-1.92-3.843-4.816-3.843-2.912%200-4.854%201.47-4.854%203.75%200%202.757%202.337%203.289%204.1%203.574%201.092.181%201.952.368%201.952%201.024%200%20.587-.543.88-1.116.88-.742%200-1.32-.383-1.32-1.214h-3.77c.036%202.463%201.919%204.1%205.018%204.1zm8.1%203.858c2.936%200%204.344-1.257%205.877-4.736l4.764-10.863h-4.206l-2.249%206.263-2.412-6.263H70.31l4.698%2010.43c-.53%201.414-.983%201.804-2.48%201.804H71.45v3.365h1.341zm18.504-3.858c3.5%200%205.973-2.515%205.973-6.048S94.796%203.75%2091.295%203.75a5.332%205.332%200%2000-2.825.784V0H84.6v15.474h2.897l.37-.844c.923.771%202.102%201.216%203.428%201.216zm-.523-3.467c-1.467%200-2.545-1.108-2.545-2.58%200-1.486%201.078-2.594%202.545-2.594%201.466%200%202.544%201.108%202.544%202.593%200%201.473-1.087%202.58-2.544%202.58zm13.598%203.467c1.32%200%202.5-.434%203.43-1.188l.336.804h3.027V4.093h-2.918l-.401.88c-.939-.775-2.135-1.222-3.474-1.222-3.476%200-5.96%202.505-5.96%206.026%200%203.533%202.484%206.07%205.96%206.07zm.524-3.467c-1.467%200-2.545-1.108-2.545-2.593%200-1.475%201.07-2.583%202.545-2.583%201.467%200%202.545%201.108%202.545%202.583%200%201.485-1.078%202.593-2.545%202.593zm12.653%203.095V9.403c0-1.447.702-2.3%201.923-2.3.986%200%201.483.657%201.483%201.98v6.39h3.915V8.543c0-2.897-1.733-4.773-4.373-4.773-1.47%200-2.733.565-3.58%201.508l-.537-1.172h-2.747v11.369h3.916zm13.748%200v-4.808l2.848%204.808h4.616l-3.902-5.95%203.543-5.419h-4.397l-2.708%204.454V0h-3.916v15.474h3.916z'/%3e%3cg%20fill='url(%23a)'%3e%3cpath%20d='M10.802%200L0%2019.704h5.986L16.789%200z'/%3e%3cpath%20opacity='.5'%20d='M18.171%200L7.368%2019.704h5.986L24.157%200z'/%3e%3cpath%20opacity='.15'%20d='M25.539%200L14.737%2019.704h5.986L31.525%200z'/%3e%3c/g%3e%3c/g%3e%3c/svg%3e";

const hamburger = "data:image/svg+xml,%3csvg%20xmlns='http://www.w3.org/2000/svg'%20width='24'%20height='11'%3e%3cg%20fill='%232D314D'%20fill-rule='evenodd'%3e%3cpath%20d='M0%200h24v1H0zM0%205h24v1H0zM0%2010h24v1H0z'/%3e%3c/g%3e%3c/svg%3e";

const closeMenu = "data:image/svg+xml,%3csvg%20xmlns='http://www.w3.org/2000/svg'%20width='18'%20height='19'%3e%3cg%20fill='%232D314D'%20fill-rule='evenodd'%3e%3cpath%20d='M.868.661l16.97%2016.97-.706.708L.162%201.369z'/%3e%3cpath%20d='M.161%2017.632L17.131.662l.708.706-16.97%2016.97z'/%3e%3c/g%3e%3c/svg%3e";

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "default",
  __ssrInlineRender: true,
  setup(__props) {
    const store = useBankStore();
    const navMenu = ref();
    const linksData = ref(["home", "about", "contact", "blog", "careers"]);
    const handleCloseOutside = (e) => {
      if (navMenu.value && !navMenu.value.contains(e.target)) {
        store.isOpenMenu = false;
      }
    };
    watch(
      () => store.isOpenMenu,
      (newValue) => {
        if (newValue) {
          (void 0).addEventListener("click", handleCloseOutside);
        } else {
          (void 0).removeEventListener("click", handleCloseOutside);
        }
      }
    );
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      _push(`<nav${ssrRenderAttrs(mergeProps({
        class: "px-[3rem] py-[2.2rem] bg-white w-full relative z-[100] lg:px-[3.5rem]",
        ref_key: "navMenu",
        ref: navMenu
      }, _attrs))} data-v-d91a4b5b><div class="flex justify-between relative container lg:items-center lg:justify-between lg:px-0 xl:px-0" data-v-d91a4b5b><img${ssrRenderAttr("src", unref(logo))} class="w-[15rem] h-[2.3rem]" alt="logo easybank" data-v-d91a4b5b><button type="button" aria-label="open close nav menu" class="lg:hidden" data-v-d91a4b5b><img${ssrRenderAttr("src", unref(store).isOpenMenu ? unref(closeMenu) : unref(hamburger))}${ssrRenderAttr("alt", unref(store).isOpenMenu ? "close menu" : "open menu")} class="${ssrRenderClass([unref(store).isOpenMenu ? "w-[2rem] h-[2.1rem]" : "w-[2.8rem]", "h-[1.8rem]"])}" data-v-d91a4b5b></button>`);
      if (unref(store).isOpenMenu) {
        _push(`<div class="absolute top-[9.5rem] w-[calc(100%-4.4rem)] left-1/2 translate-x-[-50%] justify-items-center bg-neutral-4 grid gap-y-[1.5rem] py-[3rem] rounded-md lg:none" data-v-d91a4b5b><!--[-->`);
        ssrRenderList(linksData.value, (item, index) => {
          _push(ssrRenderComponent(_component_NuxtLink, {
            to: "/",
            key: index,
            class: "first-letter:uppercase text-[1.8rem] w-fit"
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`${ssrInterpolate(item)}`);
              } else {
                return [
                  createTextVNode(toDisplayString(item), 1)
                ];
              }
            }),
            _: 2
          }, _parent));
        });
        _push(`<!--]--></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<div class="hidden lg:flex gap-x-[3.5rem]" data-v-d91a4b5b><!--[-->`);
      ssrRenderList(linksData.value, (item, index) => {
        _push(ssrRenderComponent(_component_NuxtLink, {
          to: "/",
          key: index,
          class: "first-letter:uppercase text-[1.5rem] text-neutral-1 lg:hover:text-black lg:transition-colors lg:relative lineHover"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`${ssrInterpolate(item)}`);
            } else {
              return [
                createTextVNode(toDisplayString(item), 1)
              ];
            }
          }),
          _: 2
        }, _parent));
      });
      _push(`<!--]--></div><button type="button" class="hidden lg:block capitalize bg-gradient-to-r from-primary-2 to-primary-3 text-neutral-4 px-[2.8rem] py-[1.1rem] rounded-full font-w700 text-[1.4rem] lg:hover:opacity-60 lg:transition-opacity" data-v-d91a4b5b> request invite </button></div></nav>`);
    };
  }
});

const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("layouts/default.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const _default = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-d91a4b5b"]]);

export { _default as default };
//# sourceMappingURL=default.vue.mjs.map
