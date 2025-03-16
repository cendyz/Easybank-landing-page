import { computed, defineComponent, useAttrs, ref, mergeProps, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderSlot, ssrRenderAttr, ssrRenderComponent, ssrRenderList, ssrInterpolate } from 'vue/server-renderer';
import { u as useNuxtApp, a as useRuntimeConfig, _ as _export_sfc } from './server.mjs';
import { u as useBankStore } from './bank.mjs';
import { l as defu, r as withLeadingSlash, m as hasProtocol, n as joinURL, v as parseURL, x as encodePath, y as encodeParam, p as publicAssetsURL } from '../nitro/nitro.mjs';
import { u as useHead } from './v3.mjs';
import 'pinia';
import 'vue-router';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'node:url';
import 'ipx';
import '../routes/renderer.mjs';
import 'vue-bundle-renderer/runtime';
import 'unhead/server';
import 'unhead/utils';
import 'devalue';
import 'unhead/plugins';

async function imageMeta(_ctx, url) {
  const meta = await _imageMeta(url).catch((err) => {
    console.error("Failed to get image meta for " + url, err + "");
    return {
      width: 0,
      height: 0,
      ratio: 0
    };
  });
  return meta;
}
async function _imageMeta(url) {
  {
    const imageMeta2 = await import('image-meta').then((r) => r.imageMeta);
    const data = await fetch(url).then((res) => res.buffer());
    const metadata = imageMeta2(data);
    if (!metadata) {
      throw new Error(`No metadata could be extracted from the image \`${url}\`.`);
    }
    const { width, height } = metadata;
    const meta = {
      width,
      height,
      ratio: width && height ? width / height : void 0
    };
    return meta;
  }
}

function createMapper(map) {
  return (key) => {
    return key ? map[key] || key : map.missingValue;
  };
}
function createOperationsGenerator({ formatter, keyMap, joinWith = "/", valueMap } = {}) {
  if (!formatter) {
    formatter = (key, value) => `${key}=${value}`;
  }
  if (keyMap && typeof keyMap !== "function") {
    keyMap = createMapper(keyMap);
  }
  const map = valueMap || {};
  Object.keys(map).forEach((valueKey) => {
    if (typeof map[valueKey] !== "function") {
      map[valueKey] = createMapper(map[valueKey]);
    }
  });
  return (modifiers = {}) => {
    const operations = Object.entries(modifiers).filter(([_, value]) => typeof value !== "undefined").map(([key, value]) => {
      const mapper = map[key];
      if (typeof mapper === "function") {
        value = mapper(modifiers[key]);
      }
      key = typeof keyMap === "function" ? keyMap(key) : key;
      return formatter(key, value);
    });
    return operations.join(joinWith);
  };
}
function parseSize(input = "") {
  if (typeof input === "number") {
    return input;
  }
  if (typeof input === "string") {
    if (input.replace("px", "").match(/^\d+$/g)) {
      return Number.parseInt(input, 10);
    }
  }
}
function parseDensities(input = "") {
  if (input === void 0 || !input.length) {
    return [];
  }
  const densities = /* @__PURE__ */ new Set();
  for (const density of input.split(" ")) {
    const d = Number.parseInt(density.replace("x", ""));
    if (d) {
      densities.add(d);
    }
  }
  return Array.from(densities);
}
function checkDensities(densities) {
  if (densities.length === 0) {
    throw new Error("`densities` must not be empty, configure to `1` to render regular size only (DPR 1.0)");
  }
}
function parseSizes(input) {
  const sizes = {};
  if (typeof input === "string") {
    for (const entry of input.split(/[\s,]+/).filter((e) => e)) {
      const s = entry.split(":");
      if (s.length !== 2) {
        sizes["1px"] = s[0].trim();
      } else {
        sizes[s[0].trim()] = s[1].trim();
      }
    }
  } else {
    Object.assign(sizes, input);
  }
  return sizes;
}

function createImage(globalOptions) {
  const ctx = {
    options: globalOptions
  };
  const getImage = (input, options = {}) => {
    const image = resolveImage(ctx, input, options);
    return image;
  };
  const $img = (input, modifiers = {}, options = {}) => {
    return getImage(input, {
      ...options,
      modifiers: defu(modifiers, options.modifiers || {})
    }).url;
  };
  for (const presetName in globalOptions.presets) {
    $img[presetName] = (source, modifiers, options) => $img(source, modifiers, { ...globalOptions.presets[presetName], ...options });
  }
  $img.options = globalOptions;
  $img.getImage = getImage;
  $img.getMeta = (input, options) => getMeta(ctx, input, options);
  $img.getSizes = (input, options) => getSizes(ctx, input, options);
  ctx.$img = $img;
  return $img;
}
async function getMeta(ctx, input, options) {
  const image = resolveImage(ctx, input, { ...options });
  if (typeof image.getMeta === "function") {
    return await image.getMeta();
  } else {
    return await imageMeta(ctx, image.url);
  }
}
function resolveImage(ctx, input, options) {
  var _a, _b;
  if (input && typeof input !== "string") {
    throw new TypeError(`input must be a string (received ${typeof input}: ${JSON.stringify(input)})`);
  }
  if (!input || input.startsWith("data:")) {
    return {
      url: input
    };
  }
  const { provider, defaults } = getProvider(ctx, options.provider || ctx.options.provider);
  const preset = getPreset(ctx, options.preset);
  input = hasProtocol(input) ? input : withLeadingSlash(input);
  if (!provider.supportsAlias) {
    for (const base in ctx.options.alias) {
      if (input.startsWith(base)) {
        const alias = ctx.options.alias[base];
        if (alias) {
          input = joinURL(alias, input.slice(base.length));
        }
      }
    }
  }
  if (provider.validateDomains && hasProtocol(input)) {
    const inputHost = parseURL(input).host;
    if (!ctx.options.domains.find((d) => d === inputHost)) {
      return {
        url: input
      };
    }
  }
  const _options = defu(options, preset, defaults);
  _options.modifiers = { ..._options.modifiers };
  const expectedFormat = _options.modifiers.format;
  if ((_a = _options.modifiers) == null ? void 0 : _a.width) {
    _options.modifiers.width = parseSize(_options.modifiers.width);
  }
  if ((_b = _options.modifiers) == null ? void 0 : _b.height) {
    _options.modifiers.height = parseSize(_options.modifiers.height);
  }
  const image = provider.getImage(input, _options, ctx);
  image.format = image.format || expectedFormat || "";
  return image;
}
function getProvider(ctx, name) {
  const provider = ctx.options.providers[name];
  if (!provider) {
    throw new Error("Unknown provider: " + name);
  }
  return provider;
}
function getPreset(ctx, name) {
  if (!name) {
    return {};
  }
  if (!ctx.options.presets[name]) {
    throw new Error("Unknown preset: " + name);
  }
  return ctx.options.presets[name];
}
function getSizes(ctx, input, opts) {
  var _a, _b, _c, _d, _e;
  const width = parseSize((_a = opts.modifiers) == null ? void 0 : _a.width);
  const height = parseSize((_b = opts.modifiers) == null ? void 0 : _b.height);
  const sizes = parseSizes(opts.sizes);
  const densities = ((_c = opts.densities) == null ? void 0 : _c.trim()) ? parseDensities(opts.densities.trim()) : ctx.options.densities;
  checkDensities(densities);
  const hwRatio = width && height ? height / width : 0;
  const sizeVariants = [];
  const srcsetVariants = [];
  if (Object.keys(sizes).length >= 1) {
    for (const key in sizes) {
      const variant = getSizesVariant(key, String(sizes[key]), height, hwRatio, ctx);
      if (variant === void 0) {
        continue;
      }
      sizeVariants.push({
        size: variant.size,
        screenMaxWidth: variant.screenMaxWidth,
        media: `(max-width: ${variant.screenMaxWidth}px)`
      });
      for (const density of densities) {
        srcsetVariants.push({
          width: variant._cWidth * density,
          src: getVariantSrc(ctx, input, opts, variant, density)
        });
      }
    }
    finaliseSizeVariants(sizeVariants);
  } else {
    for (const density of densities) {
      const key = Object.keys(sizes)[0];
      let variant = key ? getSizesVariant(key, String(sizes[key]), height, hwRatio, ctx) : void 0;
      if (variant === void 0) {
        variant = {
          size: "",
          screenMaxWidth: 0,
          _cWidth: (_d = opts.modifiers) == null ? void 0 : _d.width,
          _cHeight: (_e = opts.modifiers) == null ? void 0 : _e.height
        };
      }
      srcsetVariants.push({
        width: density,
        src: getVariantSrc(ctx, input, opts, variant, density)
      });
    }
  }
  finaliseSrcsetVariants(srcsetVariants);
  const defaultVariant = srcsetVariants[srcsetVariants.length - 1];
  const sizesVal = sizeVariants.length ? sizeVariants.map((v) => `${v.media ? v.media + " " : ""}${v.size}`).join(", ") : void 0;
  const suffix = sizesVal ? "w" : "x";
  const srcsetVal = srcsetVariants.map((v) => `${v.src} ${v.width}${suffix}`).join(", ");
  return {
    sizes: sizesVal,
    srcset: srcsetVal,
    src: defaultVariant == null ? void 0 : defaultVariant.src
  };
}
function getSizesVariant(key, size, height, hwRatio, ctx) {
  const screenMaxWidth = ctx.options.screens && ctx.options.screens[key] || Number.parseInt(key);
  const isFluid = size.endsWith("vw");
  if (!isFluid && /^\d+$/.test(size)) {
    size = size + "px";
  }
  if (!isFluid && !size.endsWith("px")) {
    return void 0;
  }
  let _cWidth = Number.parseInt(size);
  if (!screenMaxWidth || !_cWidth) {
    return void 0;
  }
  if (isFluid) {
    _cWidth = Math.round(_cWidth / 100 * screenMaxWidth);
  }
  const _cHeight = hwRatio ? Math.round(_cWidth * hwRatio) : height;
  return {
    size,
    screenMaxWidth,
    _cWidth,
    _cHeight
  };
}
function getVariantSrc(ctx, input, opts, variant, density) {
  return ctx.$img(
    input,
    {
      ...opts.modifiers,
      width: variant._cWidth ? variant._cWidth * density : void 0,
      height: variant._cHeight ? variant._cHeight * density : void 0
    },
    opts
  );
}
function finaliseSizeVariants(sizeVariants) {
  var _a;
  sizeVariants.sort((v1, v2) => v1.screenMaxWidth - v2.screenMaxWidth);
  let previousMedia = null;
  for (let i = sizeVariants.length - 1; i >= 0; i--) {
    const sizeVariant = sizeVariants[i];
    if (sizeVariant.media === previousMedia) {
      sizeVariants.splice(i, 1);
    }
    previousMedia = sizeVariant.media;
  }
  for (let i = 0; i < sizeVariants.length; i++) {
    sizeVariants[i].media = ((_a = sizeVariants[i + 1]) == null ? void 0 : _a.media) || "";
  }
}
function finaliseSrcsetVariants(srcsetVariants) {
  srcsetVariants.sort((v1, v2) => v1.width - v2.width);
  let previousWidth = null;
  for (let i = srcsetVariants.length - 1; i >= 0; i--) {
    const sizeVariant = srcsetVariants[i];
    if (sizeVariant.width === previousWidth) {
      srcsetVariants.splice(i, 1);
    }
    previousWidth = sizeVariant.width;
  }
}

const operationsGenerator = createOperationsGenerator({
  keyMap: {
    format: "f",
    fit: "fit",
    width: "w",
    height: "h",
    resize: "s",
    quality: "q",
    background: "b"
  },
  joinWith: "&",
  formatter: (key, val) => encodeParam(key) + "_" + encodeParam(val)
});
const getImage = (src, { modifiers = {}, baseURL } = {}, ctx) => {
  if (modifiers.width && modifiers.height) {
    modifiers.resize = `${modifiers.width}x${modifiers.height}`;
    delete modifiers.width;
    delete modifiers.height;
  }
  const params = operationsGenerator(modifiers) || "_";
  if (!baseURL) {
    baseURL = joinURL(ctx.options.nuxt.baseURL, "/_ipx");
  }
  return {
    url: joinURL(baseURL, params, encodePath(src))
  };
};
const validateDomains = true;
const supportsAlias = true;

const ipx = /*#__PURE__*/Object.freeze({
  __proto__: null,
  getImage: getImage,
  supportsAlias: supportsAlias,
  validateDomains: validateDomains
});

const imageOptions = {
  "screens": {
    "xs": 320,
    "sm": 640,
    "md": 768,
    "lg": 1024,
    "xl": 1280,
    "xxl": 1536,
    "2xl": 1536
  },
  "presets": {},
  "provider": "ipx",
  "domains": [],
  "alias": {},
  "densities": [
    1,
    2
  ],
  "format": [
    "webp"
  ]
};
imageOptions.providers = {
  ["ipx"]: { provider: ipx, defaults: {} }
};

const useImage = () => {
  const config = useRuntimeConfig();
  const nuxtApp = useNuxtApp();
  return nuxtApp.$img || nuxtApp._img || (nuxtApp._img = createImage({
    ...imageOptions,
    nuxt: {
      baseURL: config.app.baseURL
    },
    runtimeConfig: config
  }));
};

const baseImageProps = {
  // input source
  src: { type: String, required: false },
  // modifiers
  format: { type: String, required: false },
  quality: { type: [Number, String], required: false },
  background: { type: String, required: false },
  fit: { type: String, required: false },
  modifiers: { type: Object, required: false },
  // options
  preset: { type: String, required: false },
  provider: { type: String, required: false },
  sizes: { type: [Object, String], required: false },
  densities: { type: String, required: false },
  preload: {
    type: [Boolean, Object],
    required: false
  },
  // <img> attributes
  width: { type: [String, Number], required: false },
  height: { type: [String, Number], required: false },
  alt: { type: String, required: false },
  referrerpolicy: { type: String, required: false },
  usemap: { type: String, required: false },
  longdesc: { type: String, required: false },
  ismap: { type: Boolean, required: false },
  loading: {
    type: String,
    required: false,
    validator: (val) => ["lazy", "eager"].includes(val)
  },
  crossorigin: {
    type: [Boolean, String],
    required: false,
    validator: (val) => ["anonymous", "use-credentials", "", true, false].includes(val)
  },
  decoding: {
    type: String,
    required: false,
    validator: (val) => ["async", "auto", "sync"].includes(val)
  },
  // csp
  nonce: { type: [String], required: false }
};
const useBaseImage = (props) => {
  const options = computed(() => {
    return {
      provider: props.provider,
      preset: props.preset
    };
  });
  const attrs = computed(() => {
    return {
      width: parseSize(props.width),
      height: parseSize(props.height),
      alt: props.alt,
      referrerpolicy: props.referrerpolicy,
      usemap: props.usemap,
      longdesc: props.longdesc,
      ismap: props.ismap,
      crossorigin: props.crossorigin === true ? "anonymous" : props.crossorigin || void 0,
      loading: props.loading,
      decoding: props.decoding,
      nonce: props.nonce
    };
  });
  const $img = useImage();
  const modifiers = computed(() => {
    return {
      ...props.modifiers,
      width: parseSize(props.width),
      height: parseSize(props.height),
      format: props.format,
      quality: props.quality || $img.options.quality,
      background: props.background,
      fit: props.fit
    };
  });
  return {
    options,
    attrs,
    modifiers
  };
};
const imgProps = {
  ...baseImageProps,
  placeholder: { type: [Boolean, String, Number, Array], required: false },
  placeholderClass: { type: String, required: false },
  custom: { type: Boolean, required: false }
};

const _sfc_main$6 = /* @__PURE__ */ defineComponent({
  __name: "NuxtImg",
  __ssrInlineRender: true,
  props: imgProps,
  emits: ["load", "error"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const attrs = useAttrs();
    const isServer = true;
    const $img = useImage();
    const _base = useBaseImage(props);
    const placeholderLoaded = ref(false);
    const imgEl = ref();
    const sizes = computed(() => $img.getSizes(props.src, {
      ..._base.options.value,
      sizes: props.sizes,
      densities: props.densities,
      modifiers: {
        ..._base.modifiers.value,
        width: parseSize(props.width),
        height: parseSize(props.height)
      }
    }));
    const imgAttrs = computed(() => {
      const attrs2 = { ..._base.attrs.value, "data-nuxt-img": "" };
      if (!props.placeholder || placeholderLoaded.value) {
        attrs2.sizes = sizes.value.sizes;
        attrs2.srcset = sizes.value.srcset;
      }
      return attrs2;
    });
    const placeholder = computed(() => {
      let placeholder2 = props.placeholder;
      if (placeholder2 === "") {
        placeholder2 = true;
      }
      if (!placeholder2 || placeholderLoaded.value) {
        return false;
      }
      if (typeof placeholder2 === "string") {
        return placeholder2;
      }
      const size = Array.isArray(placeholder2) ? placeholder2 : typeof placeholder2 === "number" ? [placeholder2, placeholder2] : [10, 10];
      return $img(props.src, {
        ..._base.modifiers.value,
        width: size[0],
        height: size[1],
        quality: size[2] || 50,
        blur: size[3] || 3
      }, _base.options.value);
    });
    const mainSrc = computed(
      () => props.sizes ? sizes.value.src : $img(props.src, _base.modifiers.value, _base.options.value)
    );
    const src = computed(() => placeholder.value ? placeholder.value : mainSrc.value);
    if (props.preload) {
      const isResponsive = Object.values(sizes.value).every((v) => v);
      useHead({
        link: [{
          rel: "preload",
          as: "image",
          nonce: props.nonce,
          ...!isResponsive ? { href: src.value } : {
            href: sizes.value.src,
            imagesizes: sizes.value.sizes,
            imagesrcset: sizes.value.srcset
          },
          ...typeof props.preload !== "boolean" && props.preload.fetchPriority ? { fetchpriority: props.preload.fetchPriority } : {}
        }]
      });
    }
    const nuxtApp = useNuxtApp();
    nuxtApp.isHydrating;
    return (_ctx, _push, _parent, _attrs) => {
      if (!_ctx.custom) {
        _push(`<img${ssrRenderAttrs(mergeProps({
          ref_key: "imgEl",
          ref: imgEl,
          class: props.placeholder && !placeholderLoaded.value ? props.placeholderClass : void 0
        }, {
          ...unref(isServer) ? { onerror: "this.setAttribute('data-error', 1)" } : {},
          ...imgAttrs.value,
          ...unref(attrs)
        }, { src: src.value }, _attrs))}>`);
      } else {
        ssrRenderSlot(_ctx.$slots, "default", {
          ...unref(isServer) ? { onerror: "this.setAttribute('data-error', 1)" } : {},
          imgAttrs: {
            ...imgAttrs.value,
            ...unref(attrs)
          },
          isLoaded: placeholderLoaded.value,
          src: src.value
        }, null, _push, _parent);
      }
    };
  }
});

const mobileIntro = publicAssetsURL("/img/bg-intro-mobile.svg");

const desktopIntro = publicAssetsURL("/img/bg-intro-desktop.svg");

const phones = publicAssetsURL("/img/image-mockups.png");

const _sfc_main$5 = /* @__PURE__ */ defineComponent({
  __name: "Header",
  __ssrInlineRender: true,
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtImg = _sfc_main$6;
      _push(`<header${ssrRenderAttrs(mergeProps({ class: "pb-[10rem] bg-neutral-3 lg:overflow-x-clip lg:pb-0" }, _attrs))}><div class="lg:container relative text-center lg:flex lg:px-[3.5rem] xl:px-0"><picture><source${ssrRenderAttr("srcset", unref(desktopIntro))} media="(min-width: 1024px)">`);
      _push(ssrRenderComponent(_component_NuxtImg, {
        src: unref(mobileIntro),
        alt: "",
        "aria-hidden": "true",
        class: "block w-full lg:absolute lg:left-[50rem] xl:left-[55rem] lg:top-[-20rem] xl:top-[-26rem] lg:z-[0]"
      }, null, _parent));
      _push(`</picture>`);
      _push(ssrRenderComponent(_component_NuxtImg, {
        src: unref(phones),
        alt: "4 phones",
        class: "block w-[calc(100%-3rem)] absolute top-[-7rem] left-1/2 translate-x-[-50%] md:w-[70%] md:top-[5rem] lg:w-[65rem] xl:w-[70rem] lg:left-[91rem] xl:left-[119.9rem] lg:top-[-10.5rem] lg:z-[20]"
      }, null, _parent));
      _push(`<div class="lg:py-[12rem] lg:text-left"><h1 class="text-[4rem] leading-[1.1] mt-[-3rem] mb-[3rem] text-primary-1 md:text-[5rem] md:w-[40rem] md:mx-auto lg:mt-0 lg:mx-0 lg:text-[6.5rem] lg:w-[50rem]"> Next generation digital banking </h1><p class="text-[1.5rem] px-[1rem] text-neutral-1 md:text-[1.7rem] md:w-[47rem] md:mx-auto lg:mx-0 lg:px-0 lg:text-[1.82rem]"> Take your financial life online. Your Easybank account will be a one-stop-shop for spending, saving, budgeting, investing, and much more. </p><button type="button" class="capitalize mt-[4rem] bg-gradient-to-r from-primary-2 to-primary-3 text-neutral-4 px-[2.8rem] py-[1.1rem] rounded-full font-w700 text-[1.4rem] md:text-[1.6rem] lg:hover:opacity-60 lg:transition-opacity"> request invite </button></div></div></header>`);
    };
  }
});

const img1$1 = "data:image/svg+xml,%3csvg%20xmlns='http://www.w3.org/2000/svg'%20width='72'%20height='72'%3e%3cdefs%3e%3clinearGradient%20id='a'%20x1='0%25'%20x2='99.58%25'%20y1='0%25'%20y2='99.58%25'%3e%3cstop%20offset='0%25'%20stop-color='%2333D35E'/%3e%3cstop%20offset='100%25'%20stop-color='%232AB6D9'/%3e%3c/linearGradient%3e%3c/defs%3e%3cg%20fill='none'%20fill-rule='evenodd'%3e%3ccircle%20cx='36'%20cy='36'%20r='36'%20fill='url(%23a)'/%3e%3cpath%20fill='%23FFF'%20fill-rule='nonzero'%20d='M45.984%2016a3.336%203.336%200%20013.332%203.332v3.727l4.11%204.118a8.72%208.72%200%20012.553%206.141v21.994a.666.666%200%2001-.667.667H43.32a.666.666%200%2001-.667-.667V48.84l-.382-.612a9.632%209.632%200%2001-.83-8.553L25.799%2045.7a3.332%203.332%200%2001-4.307-1.91l-2.504-6.502A3.325%203.325%200%200116%2033.99V19.332A3.336%203.336%200%200119.332%2016zm8.662%2033.316h-10.66v5.33h10.66v-5.33zm-7.996%201.332v1.333h-1.332v-1.333h1.332zm3.675-24.69l2.255%205.855a3.332%203.332%200%2001-1.91%204.305l-.683.266%202.465%202.466-.942.942-10.618-10.615a2.222%202.222%200%2000-3.209%203.073l5.46%205.957c.196.213.232.53.088.78a8.309%208.309%200%2000.169%208.534l.289.462h10.957V33.318a7.379%207.379%200%2000-2.162-5.198l-2.159-2.163zm-9.798%2011.36H29.565v.004l-7.953%203.065%201.124%202.923a1.999%201.999%200%20002.584%201.147l16.073-6.195-.866-.944zm-14.658.004h-5.44l.702%201.824%204.738-1.824zm20.115-19.99H19.332a2%202%200%2000-2%202V33.99a2%202%200%20002%202h19.974l-2.602-2.843a3.555%203.555%200%20015.13-4.916l6.104%206.105c.025-.114.04-.23.045-.346V23.582l-.006-.015h.006v-4.235a2%202%200%2000-1.999-2zm3.332%209.712v6.946a3.332%203.332%200%2001-.282%201.333l1.156-.446a1.999%201.999%200%20001.148-2.584l-2.022-5.25zm-27.32%204.281v1.333h-2.664v-1.333h2.665zm11.994%200v1.333h-2.665v-1.333h2.665zm-11.993-3.998v1.333h-2.665v-1.333h2.665zm3.998%200v1.333h-2.666v-1.333h2.666zm3.998%200v1.333h-2.666v-1.333h2.666zm3.997%200v1.333h-2.665v-1.333h2.665zm-10.394-8.662c.957%200%201.732.776%201.732%201.733v3.198c0%20.957-.775%201.732-1.732%201.732h-3.198a1.732%201.732%200%2001-1.733-1.732v-3.198c0-.957.776-1.733%201.733-1.733zm0%201.333h-3.198a.4.4%200%2000-.4.4v.932h1.332v1.333h-1.332v.933c0%20.22.179.4.4.4h3.198a.4.4%200%2000.4-.4v-.933h-1.333V21.33h1.333v-.932a.4.4%200%2000-.4-.4zm21.722-.666v1.998h-1.333v-1.998h1.333zm-2.666%200v1.998H41.32v-1.998h1.332zm-2.665%200v1.998h-1.332v-1.998h1.332zm-2.665%200v1.998h-1.333v-1.998h1.333z'/%3e%3c/g%3e%3c/svg%3e";

const img2$1 = "data:image/svg+xml,%3csvg%20xmlns='http://www.w3.org/2000/svg'%20width='72'%20height='72'%3e%3cdefs%3e%3clinearGradient%20id='a'%20x1='0%25'%20x2='99.58%25'%20y1='0%25'%20y2='99.58%25'%3e%3cstop%20offset='0%25'%20stop-color='%2333D35E'/%3e%3cstop%20offset='100%25'%20stop-color='%232AB6D9'/%3e%3c/linearGradient%3e%3c/defs%3e%3cg%20fill='none'%20fill-rule='evenodd'%3e%3ccircle%20cx='36'%20cy='36'%20r='36'%20fill='url(%23a)'/%3e%3cpath%20fill='%23FFF'%20fill-rule='nonzero'%20d='M44.633%2016a3.096%203.096%200%20013.092%203.092v7.57c5.23.286%209.393%204.365%209.393%209.338%200%204.973-4.162%209.052-9.393%209.338v7.57A3.095%203.095%200%200144.633%2056H27.099a3.095%203.095%200%2001-3.092-3.092v-7.24a.587.587%200%20111.174%200v3.522h21.37v-3.852a10.479%2010.479%200%2001-2.89-.568l-4.383%202.391c-.466.254-1.013-.22-.833-.716l1.308-3.596h-6.705a.592.592%200%2001-.415-.172l-4.697-4.696a.593.593%200%2001-.172-.415V24.728c0-.324.263-.587.587-.587h15.03c.324%200%20.587.263.587.587v2.402c.819-.258%201.685-.419%202.583-.468v-4.478H25.18v20.704a.587.587%200%2011-1.174%200V19.092A3.096%203.096%200%200127.099%2016zm1.918%2034.364H25.18v2.544a1.92%201.92%200%20001.918%201.918h17.534a1.92%201.92%200%20001.918-1.918v-2.544zm-9.433.705c.325%200%20.587.262.587.587v1.878a.587.587%200%2001-.587.587h-2.505a.587.587%200%2001-.587-.587v-1.878c0-.325.263-.587.587-.587zm-.587%201.174h-1.33v.704h1.33v-.704zM47.138%2027.82c-4.856%200-8.806%203.67-8.806%208.18%200%202.217.94%204.293%202.647%205.846.177.16.239.41.157.635l-1.056%202.905%203.251-1.773a.587.587%200%2001.49-.034%209.343%209.343%200%20003.317.601c4.856%200%208.806-3.67%208.806-8.18s-3.95-8.18-8.806-8.18zm0%201.33c.324%200%20.587.264.587.588v1.291h.04a2.469%202.469%200%20012.465%202.466v.626a.587.587%200%2011-1.174%200v-.626c0-.712-.58-1.291-1.292-1.291h-.94c-.884%200-1.604.72-1.604%201.604%200%20.885.72%201.605%201.605%201.605h.626a2.782%202.782%200%20012.779%202.779c0%201.44-1.1%202.627-2.505%202.765v1.305a.587.587%200%2011-1.174%200v-1.291h-.04a2.469%202.469%200%2001-2.465-2.466.587.587%200%20111.174%200c0%20.712.58%201.291%201.292%201.291h.939c.885%200%201.605-.72%201.605-1.604%200-.885-.72-1.605-1.605-1.605h-.626a2.782%202.782%200%2001-2.78-2.779c0-1.44%201.102-2.627%202.506-2.765v-1.305c0-.324.263-.587.587-.587zm-4.345-3.835H28.938v11.663h4.11c.324%200%20.587.263.587.588v4.11h5.567c-1.327-1.622-2.044-3.593-2.044-5.676%200-1.112.208-2.18.59-3.17h-6.266a.587.587%200%20110-1.174h6.82c.399-.711.893-1.369%201.466-1.957h-2.023a.587.587%200%20110-1.174h3.13c.076%200%20.148.014.214.04.53-.38%201.1-.71%201.704-.985v-2.265zM32.461%2038.153h-2.692l2.692%202.692v-2.692zm3.405-3.366a.587.587%200%20110%201.174h-4.384a.587.587%200%20110-1.174zm-.626-6.263a.587.587%200%20110%201.175h-3.758a.587.587%200%20110-1.175zm9.393-11.35H27.099a1.92%201.92%200%2000-1.918%201.918v1.918h21.37v-1.918a1.92%201.92%200%2000-1.918-1.918zm-7.515%201.33a.587.587%200%20110%201.175h-2.505a.587.587%200%20110-1.174z'/%3e%3c/g%3e%3c/svg%3e";

const img3$1 = "data:image/svg+xml,%3csvg%20xmlns='http://www.w3.org/2000/svg'%20width='72'%20height='72'%3e%3cdefs%3e%3clinearGradient%20id='a'%20x1='0%25'%20x2='99.58%25'%20y1='0%25'%20y2='99.58%25'%3e%3cstop%20offset='0%25'%20stop-color='%2333D35E'/%3e%3cstop%20offset='100%25'%20stop-color='%232AB6D9'/%3e%3c/linearGradient%3e%3c/defs%3e%3cg%20fill='none'%20fill-rule='evenodd'%3e%3ccircle%20cx='36'%20cy='36'%20r='36'%20fill='url(%23a)'/%3e%3cpath%20fill='%23FFF'%20fill-rule='nonzero'%20d='M36%2016a4.522%204.522%200%20014.516%204.516%204.514%204.514%200%2001-1.951%203.713c2.647%201.031%204.532%203.601%204.532%206.61v3.226h-6.452v.645c0%20.356.29.645.645.645h1.29c1.068%200%201.936.868%201.936%201.935v1.29a1.938%201.938%200%2001-1.935%201.936h-1.153l.69.69-.964%201.59c.047.1.081.2.124.3h6.287a5.146%205.146%200%2001-1.759-3.87%205.167%205.167%200%20015.162-5.161%205.167%205.167%200%20015.161%205.16%205.154%205.154%200%2001-1.904%204c3.283.621%205.775%203.507%205.775%206.969V56H41.161v-7.42a.969.969%200%2000-.967-.967h-.968v1.15l-1.802.443c-.08.215-.17.43-.269.642l.963%201.59-3.453%203.454-1.59-.963c-.214.1-.428.19-.642.268L31.99%2056h-4.883l-.442-1.802a8.519%208.519%200%2001-.642-.268l-1.59.962-3.454-3.453.963-1.59a8.632%208.632%200%2001-.268-.642l-1.803-.443V43.88l1.803-.443c.079-.214.169-.428.268-.642l-.963-1.59.69-.69h-1.153a1.938%201.938%200%2001-1.935-1.935v-1.29c0-1.068.868-1.936%201.935-1.936h1.29a.645.645%200%2000.646-.645v-.645H16v-3.226c0-3.009%201.885-5.579%204.532-6.61a4.514%204.514%200%2001-1.951-3.713A4.522%204.522%200%200123.097%2016a4.522%204.522%200%20014.516%204.516%204.514%204.514%200%2001-1.952%203.713%207.126%207.126%200%20013.887%203.67%207.128%207.128%200%20013.887-3.67%204.514%204.514%200%2001-1.951-3.713A4.522%204.522%200%200136%2016zm12.903%2028.387H31.806a.969.969%200%20000%201.936h8.388a2.26%202.26%200%20012.258%202.258v6.129h9.032v-7.097h1.29v7.097h1.936v-4.516a5.813%205.813%200%2000-5.807-5.807zm-17.925-6.452h-2.86l-.37%201.514-.347.11a7.029%207.029%200%2000-1.113.465l-.32.167-1.339-.81-2.021%202.022.81%201.338-.168.32a7.08%207.08%200%2000-.465%201.114l-.11.346-1.514.372v2.86l1.514.37.109.347c.117.368.273.743.466%201.113l.167.32-.81%201.339%202.021%202.021%201.338-.81.322.168c.37.192.744.349%201.114.466l.344.11.373%201.513h2.86l.37-1.514.346-.109a7.029%207.029%200%20001.113-.466l.322-.167%201.338.81%202.021-2.021-.81-1.338.167-.322c.193-.37.35-.744.467-1.114l.11-.344%201.512-.373v-.14H35.21a5.813%205.813%200%2001-5.662%204.517%205.813%205.813%200%2001-5.806-5.806%205.813%205.813%200%20015.806-5.807c1.936%200%203.74.985%204.813%202.581h1.503l-.017-.034-.167-.322.81-1.338-2.022-2.021-1.338.81-.321-.167a7.08%207.08%200%2000-1.113-.466l-.346-.11-.372-1.514zm-1.43%203.871a4.522%204.522%200%2000-4.516%204.517%204.522%204.522%200%20004.516%204.516%204.521%204.521%200%20004.327-3.226h-1.371a3.225%203.225%200%2011-1.71-4.265%202.234%202.234%200%20011.012-.251h.898a4.533%204.533%200%2000-3.156-1.29zm0%202.581a1.938%201.938%200%2000-1.935%201.936c0%201.067.868%201.935%201.935%201.935.623%200%201.184-.3%201.542-.773a2.253%202.253%200%2001-1.542-2.13c0-.337.08-.653.212-.94-.071-.009-.14-.028-.212-.028zm17.42-9.032a3.875%203.875%200%2000-3.871%203.87%203.875%203.875%200%20003.87%203.872%203.875%203.875%200%20003.872-3.871%203.875%203.875%200%2000-3.871-3.871zm-11.613-1.29H23.742v.645a1.938%201.938%200%2001-1.936%201.935h-1.29a.645.645%200%2000-.645.645v1.29c0%20.357.289.646.645.646h2.443l1.473-1.472%201.59.962c.213-.1.428-.189.642-.268l.443-1.803h4.883l.443%201.803c.214.08.428.169.642.268l1.59-.962%201.472%201.472h2.444a.645.645%200%2000.645-.645v-1.29a.645.645%200%2000-.645-.646h-1.29a1.938%201.938%200%2001-1.936-1.935v-.645zm-12.258-9.033a5.813%205.813%200%2000-5.807%205.807v1.935h1.936v-5.161h1.29v5.161h5.161v-5.161h1.29v5.161h1.936V30.84a5.813%205.813%200%2000-5.806-5.807zm12.903%200a5.813%205.813%200%2000-5.806%205.807v1.935h1.935v-5.161h1.29v5.161h5.162v-5.161h1.29v5.161h1.935V30.84A5.813%205.813%200%200036%2025.032zm15.484-1.29A4.522%204.522%200%200156%2028.258a4.522%204.522%200%2001-4.516%204.516h-7.097v-4.516a4.522%204.522%200%20014.516-4.516zm0%201.29h-2.58a3.23%203.23%200%2000-3.227%203.226v3.226h5.807a3.23%203.23%200%20003.226-3.226%203.23%203.23%200%2000-3.226-3.226zm-3.226%203.871v1.29h-1.29v-1.29h1.29zm2.58%200v1.29h-1.29v-1.29h1.29zm2.581%200v1.29h-1.29v-1.29h1.29zm0-2.58v1.29h-6.451v-1.29h6.451zM23.097%2017.29a3.23%203.23%200%2000-3.226%203.226%203.23%203.23%200%20003.226%203.226%203.23%203.23%200%20003.226-3.226%203.23%203.23%200%2000-3.226-3.226zm12.903%200a3.23%203.23%200%2000-3.226%203.226A3.23%203.23%200%200036%2023.742a3.23%203.23%200%20003.226-3.226A3.23%203.23%200%200036%2017.29z'/%3e%3c/g%3e%3c/svg%3e";

const img4$1 = "" + __buildAssetsURL("icon-api.Uv2yuT7M.svg");

const _sfc_main$4 = /* @__PURE__ */ defineComponent({
  __name: "FirstSection",
  __ssrInlineRender: true,
  setup(__props) {
    const profitsData = ref([
      {
        img: img1$1,
        title: "Online Banking",
        desc: "Our modern web and mobile applications allow you to keep track of your finances wherever you are in the world."
      },
      {
        img: img2$1,
        title: "Simple Budgeting",
        desc: "See exactly where your money goes each month. Receive notifications when you’re close to hitting your limits."
      },
      {
        img: img3$1,
        title: "Fast Onboarding",
        desc: "We don’t do branches. Open your account in minutes online and start taking control of your finances right away."
      },
      {
        img: img4$1,
        title: "Open API",
        desc: "Manage your savings, investments, pension, and much more from one account. Tracking your money has never been easier."
      }
    ]);
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<section${ssrRenderAttrs(mergeProps({ class: "bg-neutral-2 py-[7rem] px-[2.2rem] text-center text-neutral-1 text-[1.5rem] md:text-[1.6rem] lg:text-left lg:z-[9] lg:relative lg:px-0" }, _attrs))}><div class="container lg:px-[3.5rem] xl:px-0"><h2 class="text-[3rem] leading-[1.2] mb-[2.2rem] px-[1rem] text-primary-1 md:text-[3.5rem] lg:px-0"> Why choose Easybank? </h2><p class="md:w-[38rem] md:mx-auto lg:w-[57rem] lg:mx-0"> We leverage Open Banking to turn your bank account into your financial hub. Control your finances like never before. </p><div class="mt-[7rem] grid gap-y-[3rem] lg:grid lg:grid-cols-2 lg:place-items-center lg:gap-y-[6rem] xl:flex xl:gap-x-[5%]"><!--[-->`);
      ssrRenderList(profitsData.value, (item, index) => {
        _push(`<div class="xl:w-[23%]"><img${ssrRenderAttr("src", item.img)}${ssrRenderAttr("alt", item.title)} class="block mx-auto w-[7rem] h-[7rem] md:w-[8rem] md:h-[8rem] lg:mx-0"><h3 class="text-primary-1 text-[2rem] my-[2rem] md:text-[2.2rem]">${ssrInterpolate(item.title)}</h3><p class="md:w-[38rem] md:mx-auto lg:w-[26.5rem] lg:mx-0">${ssrInterpolate(item.desc)}</p></div>`);
      });
      _push(`<!--]--></div></div></section>`);
    };
  }
});

const img1 = publicAssetsURL("/img/image-currency.jpg");

const img2 = publicAssetsURL("/img/image-restaurant.jpg");

const img3 = publicAssetsURL("/img/image-plane.jpg");

const img4 = publicAssetsURL("/img/image-confetti.jpg");

const _sfc_main$3 = /* @__PURE__ */ defineComponent({
  __name: "SecondSection",
  __ssrInlineRender: true,
  setup(__props) {
    const articlesData = ref([
      {
        img: img1,
        quote: "By Claire Robinson",
        title: "Receive money in any currency with no fees",
        desc: "The world is getting smaller and we’re becoming more mobile. So why should you be forced to only receive	money in a single …",
        alt: "Money"
      },
      {
        img: img2,
        quote: "By Wilson Hutton",
        title: "Treat yourself without worrying about money",
        desc: "Our simple budgeting feature allows you to separate out your spending and set realistic limits each month. That means you …",
        alt: "Restaurant"
      },
      {
        img: img3,
        quote: "By Wilson Hutton",
        title: "Take your Easybank card wherever you go",
        desc: "We want you to enjoy your travels. This is why we don’t charge any fees on purchases while you’re abroad. We’ll even show you …",
        alt: "Plane"
      },
      {
        img: img4,
        quote: "By Claire Robinson",
        title: "Our invite-only Beta accounts are now live!",
        desc: "After a lot of hard work by the whole team, we’re excited to launch our closed beta.  It’s easy to request an invite through the site ...",
        alt: "Confetti"
      }
    ]);
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtImg = _sfc_main$6;
      _push(`<section${ssrRenderAttrs(mergeProps({ class: "bg-neutral-3 py-[7rem] px-[2.2rem]" }, _attrs))}><div class="text-center container"><h2 class="capitalize text-[3rem] md:text-[3.5rem]">latest articles</h2><div class="mt-[3rem] grid gap-y-[3rem] md:grid-cols-2 md:gap-[2rem] xl:grid-cols-4"><!--[-->`);
      ssrRenderList(articlesData.value, (item, index) => {
        _push(`<div class="rounded-lg overflow-hidden">`);
        _push(ssrRenderComponent(_component_NuxtImg, {
          src: item.img,
          alt: item.alt,
          class: "block h-[27rem] w-full z-[10]"
        }, null, _parent));
        _push(`<div class="p-[3rem] pb-[3.9rem mt-[-2.5rem] bg-neutral-4 z-[20] relative text-neutral-1 text-left grid gap-y-[1rem]"><p class="text-[1.1rem] xl:text-[1.2rem]">${ssrInterpolate(item.quote)}</p><h3 class="text-primary-1 xl:text-[1.8rem] lg:hover:text-primary-2 lg:transition-colors lg:cursor-pointer lg:w-fit">${ssrInterpolate(item.title)}</h3><p class="text-[1.3rem] xl:text-[1.35rem]">${ssrInterpolate(item.desc)}</p></div></div>`);
      });
      _push(`<!--]--></div></div></section>`);
    };
  }
});

const logo = "" + __buildAssetsURL("logoFot.DcJF7KD0.png");

const fb = "data:image/svg+xml,%3csvg%20xmlns='http://www.w3.org/2000/svg'%20width='20'%20height='20'%3e%3cpath%20fill='%23FFF'%20d='M18.896%200H1.104C.494%200%200%20.494%200%201.104v17.793C0%2019.506.494%2020%201.104%2020h9.58v-7.745H8.076V9.237h2.606V7.01c0-2.583%201.578-3.99%203.883-3.99%201.104%200%202.052.082%202.329.119v2.7h-1.598c-1.254%200-1.496.597-1.496%201.47v1.928h2.989l-.39%203.018h-2.6V20h5.098c.608%200%201.102-.494%201.102-1.104V1.104C20%20.494%2019.506%200%2018.896%200z'/%3e%3c/svg%3e";

const yt = "data:image/svg+xml,%3csvg%20xmlns='http://www.w3.org/2000/svg'%20width='21'%20height='20'%3e%3cpath%20fill='%23FFF'%20d='M10.333%200c-5.522%200-10%204.478-10%2010%200%205.523%204.478%2010%2010%2010%205.523%200%2010-4.477%2010-10%200-5.522-4.477-10-10-10zm3.701%2014.077c-1.752.12-5.653.12-7.402%200C4.735%2013.947%204.514%2013.018%204.5%2010c.014-3.024.237-3.947%202.132-4.077%201.749-.12%205.651-.12%207.402%200%201.898.13%202.118%201.059%202.133%204.077-.015%203.024-.238%203.947-2.133%204.077zM8.667%208.048l4.097%201.949-4.097%201.955V8.048z'/%3e%3c/svg%3e";

const x = "data:image/svg+xml,%3csvg%20xmlns='http://www.w3.org/2000/svg'%20width='21'%20height='18'%3e%3cpath%20fill='%23FFF'%20d='M20.667%202.797a8.192%208.192%200%2001-2.357.646%204.11%204.11%200%20001.804-2.27%208.22%208.22%200%2001-2.606.996A4.096%204.096%200%200014.513.873c-2.649%200-4.595%202.472-3.997%205.038a11.648%2011.648%200%2001-8.457-4.287%204.109%204.109%200%20001.27%205.478A4.086%204.086%200%20011.47%206.59c-.045%201.901%201.317%203.68%203.29%204.075a4.113%204.113%200%2001-1.853.07%204.106%204.106%200%20003.834%202.85%208.25%208.25%200%2001-6.075%201.7%2011.616%2011.616%200%20006.29%201.843c7.618%200%2011.922-6.434%2011.662-12.205a8.354%208.354%200%20002.048-2.124z'/%3e%3c/svg%3e";

const pt = "data:image/svg+xml,%3csvg%20xmlns='http://www.w3.org/2000/svg'%20width='20'%20height='20'%3e%3cpath%20fill='%23FFF'%20d='M10%200C4.478%200%200%204.477%200%2010c0%204.237%202.636%207.855%206.356%209.312-.088-.791-.167-2.005.035-2.868.182-.78%201.172-4.97%201.172-4.97s-.299-.6-.299-1.486c0-1.39.806-2.428%201.81-2.428.852%200%201.264.64%201.264%201.408%200%20.858-.545%202.14-.828%203.33-.236.995.5%201.807%201.48%201.807%201.778%200%203.144-1.874%203.144-4.58%200-2.393-1.72-4.068-4.177-4.068-2.845%200-4.515%202.135-4.515%204.34%200%20.859.331%201.781.745%202.281a.3.3%200%2001.069.288l-.278%201.133c-.044.183-.145.223-.335.134-1.249-.581-2.03-2.407-2.03-3.874%200-3.154%202.292-6.052%206.608-6.052%203.469%200%206.165%202.473%206.165%205.776%200%203.447-2.173%206.22-5.19%206.22-1.013%200-1.965-.525-2.291-1.148l-.623%202.378c-.226.869-.835%201.958-1.244%202.621.937.29%201.931.446%202.962.446%205.522%200%2010-4.477%2010-10S15.522%200%2010%200z'/%3e%3c/svg%3e";

const insta = "data:image/svg+xml,%3csvg%20xmlns='http://www.w3.org/2000/svg'%20width='21'%20height='20'%3e%3cpath%20fill='%23FFF'%20d='M10.333%201.802c2.67%200%202.987.01%204.042.059%202.71.123%203.976%201.409%204.1%204.099.048%201.054.057%201.37.057%204.04%200%202.672-.01%202.988-.058%204.042-.124%202.687-1.386%203.975-4.099%204.099-1.055.048-1.37.058-4.042.058-2.67%200-2.986-.01-4.04-.058-2.717-.124-3.976-1.416-4.1-4.1-.048-1.054-.058-1.37-.058-4.041%200-2.67.01-2.986.058-4.04.124-2.69%201.387-3.977%204.1-4.1%201.054-.048%201.37-.058%204.04-.058zm0-1.802C7.618%200%207.278.012%206.211.06%202.579.227.56%202.242.394%205.877.345%206.944.334%207.284.334%2010s.011%203.057.06%204.123c.166%203.632%202.181%205.65%205.816%205.817%201.068.048%201.408.06%204.123.06%202.716%200%203.057-.012%204.124-.06%203.628-.167%205.651-2.182%205.816-5.817.049-1.066.06-1.407.06-4.123s-.011-3.056-.06-4.122C20.11%202.249%2018.093.228%2014.458.06%2013.39.01%2013.049%200%2010.333%200zm0%204.865a5.135%205.135%200%20100%2010.27%205.135%205.135%200%20000-10.27zm0%208.468a3.333%203.333%200%20110-6.666%203.333%203.333%200%20010%206.666zm5.339-9.87a1.2%201.2%200%2010-.001%202.4%201.2%201.2%200%20000-2.4z'/%3e%3c/svg%3e";

const _sfc_main$2 = /* @__PURE__ */ defineComponent({
  __name: "Footer",
  __ssrInlineRender: true,
  setup(__props) {
    const linksData = ref(["about us", "contact", "blog", "careers", "support", "privacy policy"]);
    const socialsData = ref([
      {
        img: fb,
        alt: "facebook"
      },
      {
        img: yt,
        alt: "youtube"
      },
      {
        img: x,
        alt: "twitter"
      },
      {
        img: pt,
        alt: "pinterest"
      },
      {
        img: insta,
        alt: "instagram"
      }
    ]);
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<footer${ssrRenderAttrs(mergeProps({ class: "py-[4rem] bg-primary-1 xl:py-[6rem]" }, _attrs))} data-v-98d7b22e><div class="text-center lg:grid lg:grid-cols-3 lg:items-center container" data-v-98d7b22e><div class="xl:flex xl:flex-col xl:gap-y-[2rem] xl:items-start" data-v-98d7b22e><img${ssrRenderAttr("src", unref(logo))} alt="easybank logo" class="block mx-auto xl:mx-0" data-v-98d7b22e><div class="flex justify-center gap-x-[1.5rem] my-[3.5rem] lg:mb-0" data-v-98d7b22e><!--[-->`);
      ssrRenderList(socialsData.value, (item, index) => {
        _push(`<a href="#" class="hoverIcon" data-v-98d7b22e><img${ssrRenderAttr("src", item.img)}${ssrRenderAttr("alt", `${item.alt} icon`)} class="w-[2.3rem] lg:brightness-15" data-v-98d7b22e></a>`);
      });
      _push(`<!--]--></div></div><div class="grid gap-y-[1rem] capitalize text-neutral-3 lg:grid-cols-2 lg:text-left lg:gap-y-[2rem] xl:translate-x-[-8rem]" data-v-98d7b22e><!--[-->`);
      ssrRenderList(linksData.value, (item, index) => {
        _push(`<a href="#" class="lg:hover:text-primary-2 lg:transition-colors lg:w-fit" data-v-98d7b22e>${ssrInterpolate(item)}</a>`);
      });
      _push(`<!--]--></div><div class="xl:flex xl:flex-col xl:justify-between" data-v-98d7b22e><button type="button" class="capitalize mt-[4rem] bg-gradient-to-r from-primary-2 to-primary-3 text-neutral-4 px-[2.8rem] py-[1.1rem] rounded-full font-w700 text-[1.4rem] lg:mt-0 xl:w-fit xl:ml-auto hoverButton" data-v-98d7b22e> request invite </button><p class="text-neutral-1 text-[1.4rem] mt-[3rem] xl:ml-auto" data-v-98d7b22e> © Easybank. All Rights Reserved ${ssrInterpolate((/* @__PURE__ */ new Date()).getFullYear())}</p></div></div></footer>`);
    };
  }
});

const _sfc_setup$2 = _sfc_main$2.setup;
_sfc_main$2.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/Footer.vue");
  return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
const __nuxt_component_2 = /* @__PURE__ */ _export_sfc(_sfc_main$2, [["__scopeId", "data-v-98d7b22e"]]);

const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  __name: "Main",
  __ssrInlineRender: true,
  setup(__props) {
    const store = useBankStore();
    return (_ctx, _push, _parent, _attrs) => {
      const _component_FirstSection = _sfc_main$4;
      const _component_SecondSection = _sfc_main$3;
      const _component_Footer = __nuxt_component_2;
      _push(`<main${ssrRenderAttrs(mergeProps({ class: "w-full" }, _attrs))} data-v-81b2ad4c>`);
      _push(ssrRenderComponent(_component_FirstSection, null, null, _parent));
      _push(ssrRenderComponent(_component_SecondSection, null, null, _parent));
      _push(ssrRenderComponent(_component_Footer, null, null, _parent));
      if (unref(store).isOpenMenu) {
        _push(`<div class="absolute top-0 left-0 w-full h-full opacity-70 bg-gradient-to-t from-transparent to-slate-900 transition-opacity" data-v-81b2ad4c></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</main>`);
    };
  }
});

const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/Main.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const __nuxt_component_1 = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["__scopeId", "data-v-81b2ad4c"]]);

const _sfc_main = {};
function _sfc_ssrRender(_ctx, _push, _parent, _attrs) {
  const _component_Header = _sfc_main$5;
  const _component_Main = __nuxt_component_1;
  _push(`<!--[-->`);
  _push(ssrRenderComponent(_component_Header, null, null, _parent));
  _push(ssrRenderComponent(_component_Main, null, null, _parent));
  _push(`<!--]-->`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const index = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);

export { index as default };
//# sourceMappingURL=index.vue.mjs.map
