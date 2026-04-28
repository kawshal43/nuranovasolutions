import b from "../assets/b.png";
import c from "../assets/c.png";
import f from "../assets/f.png";
import g from "../assets/g.png";
import h from "../assets/h.png";
import i from "../assets/i.png";

const ambientServiceIcons = [b, c, f, g, h, i];

const rgba = (color, opacity) => `rgba(${color}, ${opacity})`;

function buildBackdropFilter({ blur, saturate, brightness }) {
  return `blur(${blur}) saturate(${saturate}) brightness(${brightness})`;
}

function buildRadialLayerBackground(layer) {
  return [
    "radial-gradient(",
    `circle at ${layer.anchor ?? "50% 50%"},`,
    `${rgba(layer.color, layer.coreOpacityStart ?? 1)} 0%,`,
    `${rgba(layer.color, layer.coreOpacity ?? 0.84)} ${layer.coreStop ?? "16%"},`,
    `${rgba(layer.color, 0)} ${layer.fadeStop ?? "74%"}`,
    ")",
  ].join(" ");
}

function buildBackgroundLayerStyle(layer) {
  const style = {
    opacity: String(layer.opacity),
    filter: `blur(${layer.blur})`,
    borderRadius: layer.radius ?? "999px",
    mixBlendMode: layer.blendMode ?? "normal",
    transform: layer.transform ?? "none",
  };

  if (layer.inset) {
    style.inset = layer.inset;
  } else {
    style.top = layer.top;
    style.left = layer.left;
    style.right = layer.right;
    style.bottom = layer.bottom;
    style.width = layer.width;
    style.height = layer.height;
  }

  style.background =
    layer.type === "linear" ? layer.background : buildRadialLayerBackground(layer);

  return style;
}

function buildCardSurface(glass) {
  return [
    "linear-gradient(",
    "180deg,",
    `${rgba(glass.surfaceColor, glass.surfaceOpacityTop)} 0%,`,
    `${rgba(glass.surfaceColor, glass.surfaceOpacity)} 48%,`,
    `${rgba(glass.tintColor, glass.tintOpacity)} 100%`,
    ")",
  ].join(" ");
}

function buildCardShadow(glass, isHover = false) {
  const shadowOpacity = isHover ? glass.shadowOpacityHover : glass.shadowOpacity;
  const borderOpacity = isHover ? glass.borderOpacityHover : glass.borderOpacity;

  return [
    `0 calc(18px * var(--card-shadow-lift)) calc(36px * var(--card-shadow-lift)) ${rgba(glass.shadowColor, shadowOpacity)}`,
    `inset 0 1px 0 ${rgba(glass.lightColor, glass.lightOpacity)}`,
    `inset 0 -28px 38px ${rgba(glass.glowColor, glass.glowOpacity * glass.liquidDepthOpacity)}`,
    `0 0 0 1px ${rgba(glass.borderColor, borderOpacity * 0.54)}`,
  ].join(", ");
}

function buildCardHighlight(glass) {
  return [
    `radial-gradient(128% 82% at 18% 2%, ${rgba(glass.lightColor, glass.liquidHighlightOpacity)}, transparent 34%)`,
    `radial-gradient(96% 64% at 84% 14%, ${rgba(glass.lightColor, glass.lightOpacity * 0.74)}, transparent 30%)`,
    `linear-gradient(180deg, ${rgba(glass.lightColor, glass.rimLightOpacity)}, ${rgba(glass.lightColor, 0)} 32%, ${rgba(glass.glowColor, glass.glowOpacity)} 100%)`,
  ].join(", ");
}

function buildButtonSurface(sharedGlass, variantGlass) {
  return [
    "linear-gradient(",
    "180deg,",
    `${rgba(sharedGlass.surfaceColor, sharedGlass.surfaceOpacityTop)} 0%,`,
    `${rgba(sharedGlass.surfaceColor, sharedGlass.surfaceOpacity)} 44%,`,
    `${rgba(variantGlass.tintColor, variantGlass.tintOpacity)} 100%`,
    ")",
  ].join(" ");
}

function buildButtonHighlight(sharedGlass) {
  return [
    `radial-gradient(118% 118% at 24% 0%, ${rgba(sharedGlass.lightColor, sharedGlass.lightOpacity)}, transparent 36%)`,
    `linear-gradient(180deg, ${rgba(sharedGlass.lightColor, sharedGlass.rimLightOpacity)}, ${rgba(sharedGlass.lightColor, 0)} 48%)`,
  ].join(", ");
}

function buildButtonShadow(sharedGlass, variantGlass, isHover = false) {
  const glowOpacity = isHover ? variantGlass.glowOpacityHover : variantGlass.glowOpacity;
  const shadowOpacity = isHover ? sharedGlass.shadowOpacityHover : sharedGlass.shadowOpacity;

  return [
    `0 10px 24px ${rgba(sharedGlass.shadowColor, shadowOpacity)}`,
    `inset 0 1px 0 ${rgba(sharedGlass.lightColor, sharedGlass.lightOpacity)}`,
    `inset 0 -18px 26px ${rgba(variantGlass.glowColor, glowOpacity)}`,
  ].join(", ");
}

export const serviceContraller = {
  page: {
    padding: "clamp(112px, 12vw, 148px) 0 clamp(82px, 10vw, 120px)",
    paddingMobile: "96px 0 58px",
    scrollMarginTop: "96px",
    shellWidthDesktop: "min(1140px, calc(100% - 40px))",
    shellWidthTablet: "min(980px, calc(100% - 32px))",
    shellWidthMobile: "min(420px, calc(100% - 28px))",
    gridColumnsDesktop: "repeat(3, minmax(0, 1fr))",
    gridColumnsTablet: "repeat(2, minmax(0, 1fr))",
    gridColumnsMobile: "1fr",
    gridGapDesktop: "clamp(22px, 2.4vw, 30px)",
    gridGapMobile: "22px",
    dividerMargin: "clamp(18px, 2.4vw, 24px) 0 clamp(30px, 3.2vw, 40px)",
    dividerMarginMobile: "16px 0 24px",
    dividerHeight: "1px",
    ambientFilter: "saturate(1.08) brightness(1.02)",
  },
  background: {
    ambientIcons: {
      icons: ambientServiceIcons,
      minColumns: 4,
      minRows: 6,
      columnWidth: 260,
      rowHeight: 240,
      rowWeight: 2,
      spawnModulo: 3,
      spawnOffset: 0,
      jitterX: 0.22,
      jitterY: 0.22,
      sizeMin: 72,
      sizeMax: 138,
      durXMin: 55,
      durXMax: 95,
      durYMin: 50,
      durYMax: 90,
      durZMin: 24,
      durZMax: 42,
      delXMin: -50,
      delXMax: 0,
      delYMin: -50,
      delYMax: 0,
      delZMin: -24,
      delZMax: 0,
    },
  },
  hero: {
    headingAnimationDuration: 760,
    typingSpeed: 36,
    delayBetweenSteps: 120,
    scrollTriggerViewportRatio: 0.25,
    initialOffsetY: "18px",
    transitionDuration: "0.55s",
    contentGap: "10px",
    contentMaxWidth: "560px",
    titleSize: "clamp(2.6rem, 5vw, 4.35rem)",
    titleSizeMobile: "clamp(2.25rem, 11vw, 3.2rem)",
    titleLineHeight: "0.98",
    titleWeight: "800",
    titleLetterSpacing: "-0.055em",
    subtitleMinHeight: "2rem",
    subtitleSize: "clamp(0.98rem, 1.05vw, 1.12rem)",
    subtitleLineHeight: "1.6",
    subtitleMobileMaxWidth: "26rem",
    caretColor: "#7bb0ff",
  },
  cardBehavior: {
    lerpSpeed: 0.06,
    bounceOvershoot: 0.18,
    fadeSpeed: 1.5,
    driftY: 44,
    columnStagger: 26,
    entranceViewportFactor: 0.44,
    exitViewportStartFactor: 0.16,
    scaleStart: 0.94,
    scaleRange: 0.06,
    shadowLiftRange: 0.04,
  },
  card: {
    maxWidth: "332px",
    maxWidthMobile: "100%",
    minHeight: "360px",
    minHeightTablet: "346px",
    minHeightMobile: "334px",
    gap: "12px",
    padding: "28px 22px 18px",
    paddingTablet: "26px 20px 18px",
    paddingMobile: "24px 16px 16px",
    radius: "24px",
    fontFamily: '"Roboto", Arial, sans-serif',
    imageWrapMinHeight: "96px",
    imageWidth: "clamp(96px, 7vw, 118px)",
    imageHeight: "clamp(78px, 5.7vw, 98px)",
    contentGap: "14px",
    copyGap: "10px",
    titleSize: "clamp(0.9rem, 0.96vw, 1.02rem)",
    titleSizeMobile: "clamp(0.88rem, 3.6vw, 1rem)",
    titleLineHeight: "1.2",
    titleWeight: "900",
    titleLetterSpacing: "0.01em",
    titleTransform: "uppercase",
    titleWhiteSpace: "normal",
    descriptionMaxWidth: "23ch",
    descriptionMaxWidthTablet: "25ch",
    descriptionSize: "0.86rem",
    descriptionLineHeight: "1.6",
    descriptionWeight: "500",
    actionsGap: "8px",
    buttonHeight: "38px",
    buttonRadius: "999px",
    buttonFontSize: "13px",
    buttonFontWeight: "700",
  },
  themes: {
    light: {
      pageBaseBackground: "transparent",
      headingColor: "var(--text-primary)",
      headingShadow: "0 12px 30px rgba(123, 124, 255, 0.08)",
      subtitleColor: "color-mix(in srgb, var(--text-secondary) 84%, transparent)",
      dividerBackground: [
        "linear-gradient(",
        "90deg,",
        "rgba(179, 197, 255, 0.06) 0%,",
        "rgba(176, 194, 255, 0.3) 18%,",
        "rgba(214, 198, 255, 0.34) 52%,",
        "rgba(255, 199, 224, 0.26) 82%,",
        "rgba(255, 199, 224, 0.06) 100%",
        ")",
      ].join(" "),
      ambientOpacity: "0.52",
      ambientOpacityMobile: "0.42",
      backgroundLayers: [
        {
          id: "landing-light-cyan",
          type: "radial",
          color: "172, 236, 255",
          opacity: 0.2,
          blur: "18px",
          top: "-10rem",
          left: "-14rem",
          width: "56rem",
          height: "36rem",
          anchor: "38% 34%",
          fadeStop: "74%",
        },
        {
          id: "landing-light-lilac",
          type: "radial",
          color: "213, 190, 255",
          opacity: 0.24,
          blur: "32px",
          top: "-4rem",
          left: "12%",
          width: "52rem",
          height: "40rem",
          anchor: "46% 46%",
          fadeStop: "76%",
        },
        {
          id: "landing-light-blue",
          type: "radial",
          color: "173, 197, 255",
          opacity: 0.14,
          blur: "28px",
          top: "28%",
          right: "6%",
          width: "34rem",
          height: "26rem",
          anchor: "52% 42%",
          fadeStop: "72%",
        },
        {
          id: "landing-light-rose",
          type: "radial",
          color: "255, 207, 226",
          opacity: 0.2,
          blur: "30px",
          bottom: "-8rem",
          right: "-4rem",
          width: "44rem",
          height: "30rem",
          anchor: "54% 44%",
          fadeStop: "74%",
        },
      ],
      cardGlass: {
        surfaceColor: "255, 255, 255",
        surfaceOpacityTop: 0,
        surfaceOpacity: 0,
        tintColor: "188, 212, 255",
        tintOpacity: 0.22,
        blur: "10px",
        saturate: "250%",
        brightness: "1.08",
        borderColor: "255, 255, 255",
        borderOpacity: 0.58,
        borderOpacityHover: 0.72,
        lightColor: "255, 255, 255",
        lightOpacity: 0.38,
        rimLightOpacity: 0.24,
        shadowColor: "93, 120, 164",
        shadowOpacity: 0.18,
        shadowOpacityHover: 0.24,
        glowColor: "126, 164, 255",
        glowOpacity: 0,
        liquidHighlightOpacity: 0.32,
        liquidDepthOpacity: 0.34,
        titleColor: "var(--text-primary)",
        descriptionColor: "var(--text-muted)",
      },
      buttonGlass: {
        shared: {
          surfaceColor: "255, 255, 255",
          surfaceOpacityTop: 0,
          surfaceOpacity: 0,
          blur: "18px",
          saturate: "188%",
          brightness: "1.08",
          borderColor: "255, 255, 255",
          borderOpacity: 0.42,
          lightColor: "255, 255, 255",
          lightOpacity: 0,
          rimLightOpacity: 0.18,
          shadowColor: "93, 120, 164",
          shadowOpacity: 0.08,
          shadowOpacityHover: 0.2,
        },
        primary: {
          tintColor: "96, 153, 255",
          tintOpacity: 1,
          glowColor: "96, 153, 255",
          glowOpacity: 5,
          glowOpacityHover: 0.3,
          borderColor: "124, 173, 255",
          borderOpacity: 0.44,
          borderOpacityHover: 0.58,
          textColor: "var(--primary-contrast)",
        },
        secondary: {
          tintColor: "208, 224, 255",
          tintOpacity: 1,
          glowColor: "132, 176, 255",
          glowOpacity: 0.1,
          glowOpacityHover: 0.16,
          borderColor: "104, 154, 255",
          borderOpacity: 0.46,
          borderOpacityHover: 0.62,
          textColor: "var(--primary)",
        },
      },
    },
    dark: {
      pageBaseBackground: "transparent",
      headingColor: "#edf4ff",
      headingShadow: "0 14px 34px rgba(77, 126, 255, 0.14)",
      subtitleColor: "rgba(195, 208, 231, 0.88)",
      dividerBackground: [
        "linear-gradient(",
        "90deg,",
        "rgba(144, 180, 255, 0) 0%,",
        "rgba(172, 198, 255, 0) 18%,",
        "rgba(200, 219, 255, 0) 52%,",
        "rgba(224, 147, 211, 0) 82%,",
        "rgba(224, 147, 211, 0) 100%",
        ")",
      ].join(" "),
      ambientOpacity: "0.66",
      ambientOpacityMobile: "0.56",
      backgroundLayers: [
        {
          id: "landing-dark-blue",
          type: "radial",
          color: "67, 113, 255",
          opacity: 0.18,
          blur: "16px",
          top: "-8rem",
          left: "-12rem",
          width: "52rem",
          height: "34rem",
          anchor: "38% 30%",
          fadeStop: "74%",
        },
        {
          id: "landing-dark-cyan",
          type: "radial",
          color: "72, 194, 255",
          opacity: 0.12,
          blur: "22px",
          top: "10%",
          right: "10%",
          width: "32rem",
          height: "24rem",
          anchor: "50% 50%",
          fadeStop: "72%",
        },
        {
          id: "landing-dark-violet",
          type: "radial",
          color: "118, 89, 255",
          opacity: 0.18,
          blur: "28px",
          bottom: "8%",
          left: "4%",
          width: "38rem",
          height: "28rem",
          anchor: "42% 58%",
          fadeStop: "76%",
        },
        {
          id: "landing-dark-pink",
          type: "radial",
          color: "255, 109, 178",
          opacity: 0.14,
          blur: "30px",
          bottom: "-8rem",
          right: "-4rem",
          width: "40rem",
          height: "30rem",
          anchor: "54% 46%",
          fadeStop: "74%",
        },
      ],
      cardGlass: {
        surfaceColor: "15, 26, 45",
        surfaceOpacityTop: 0,
        surfaceOpacity: 0.54,
        tintColor: "79, 131, 255",
        tintOpacity: 0.1,
        blur: "24px",
        saturate: "175%",
        brightness: "1.04",
        borderColor: "204, 226, 255",
        borderOpacity: 0.16,
        borderOpacityHover: 0.5,
        lightColor: "255, 255, 255",
        lightOpacity: 0,
        rimLightOpacity: 0.08,
        shadowColor: "2, 8, 23",
        shadowOpacity: 0,
        shadowOpacityHover: 0.56,
        glowColor: "81, 129, 255",
        glowOpacity: 0,
        liquidHighlightOpacity: 0,
        liquidDepthOpacity: 0.24,
        titleColor: "var(--text-primary)",
        descriptionColor: "var(--text-muted)",
      },
      buttonGlass: {
        shared: {
          surfaceColor: "255, 255, 255",
          surfaceOpacityTop: 0,
          surfaceOpacity: 0,
          blur: "180px",
          saturate: "180%",
          brightness: "1.03",
          borderColor: "196, 220, 255",
          borderOpacity: 0.18,
          lightColor: "255, 255, 255",
          lightOpacity: 0,
          rimLightOpacity: 0.08,
          shadowColor: "2, 8, 23",
          shadowOpacity: 0.14,
          shadowOpacityHover: 0.2,
        },
        primary: {
          tintColor: "88, 146, 255",
          tintOpacity: 0.72,
          glowColor: "88, 146, 255",
          glowOpacity: 0,
          glowOpacityHover: 0.3,
          borderColor: "124, 175, 255",
          borderOpacity: 0.42,
          borderOpacityHover: 0.56,
          textColor: "var(--primary-contrast)",
        },
        secondary: {
          tintColor: "88, 146, 255",
          tintOpacity: 0.08,
          glowColor: "132, 176, 255",
          glowOpacity: 0.1,
          glowOpacityHover: 0.16,
          borderColor: "132, 176, 255",
          borderOpacity: 0.4,
          borderOpacityHover: 0.56,
          textColor: "var(--primary)",
        },
      },
    },
  },
};

export function getServiceContrallerThemeMode(themeAttribute) {
  return themeAttribute === "dark" ? "dark" : "light";
}

export function getServiceContrallerTheme(mode = "light") {
  return serviceContraller.themes[mode] ?? serviceContraller.themes.light;
}

export function getServiceContrallerBackgroundLayers(mode = "light") {
  return getServiceContrallerTheme(mode).backgroundLayers.map((layer) => ({
    id: layer.id,
    style: buildBackgroundLayerStyle(layer),
  }));
}

export function createServiceContrallerVars(mode = "light") {
  const theme = getServiceContrallerTheme(mode);
  const { page, hero, card } = serviceContraller;
  const { cardGlass, buttonGlass } = theme;

  return {
    "--services-page-padding": page.padding,
    "--services-page-padding-mobile": page.paddingMobile,
    "--services-page-scroll-margin-top": page.scrollMarginTop,
    "--services-page-base-background": theme.pageBaseBackground,
    "--services-heading-color": theme.headingColor,
    "--services-heading-shadow": theme.headingShadow,
    "--services-subtitle-color": theme.subtitleColor,
    "--services-divider-background": theme.dividerBackground,
    "--services-ambient-opacity": theme.ambientOpacity,
    "--services-ambient-opacity-mobile": theme.ambientOpacityMobile,
    "--services-ambient-filter": page.ambientFilter,
    "--services-shell-width": page.shellWidthDesktop,
    "--services-shell-width-tablet": page.shellWidthTablet,
    "--services-shell-width-mobile": page.shellWidthMobile,
    "--services-grid-columns": page.gridColumnsDesktop,
    "--services-grid-columns-tablet": page.gridColumnsTablet,
    "--services-grid-columns-mobile": page.gridColumnsMobile,
    "--services-grid-gap": page.gridGapDesktop,
    "--services-grid-gap-mobile": page.gridGapMobile,
    "--services-divider-height": page.dividerHeight,
    "--services-divider-margin": page.dividerMargin,
    "--services-divider-margin-mobile": page.dividerMarginMobile,
    "--services-hero-initial-offset-y": hero.initialOffsetY,
    "--services-hero-transition-duration": hero.transitionDuration,
    "--services-hero-content-gap": hero.contentGap,
    "--services-hero-content-max-width": hero.contentMaxWidth,
    "--services-hero-title-size": hero.titleSize,
    "--services-hero-title-size-mobile": hero.titleSizeMobile,
    "--services-hero-title-line-height": hero.titleLineHeight,
    "--services-hero-title-weight": hero.titleWeight,
    "--services-hero-title-letter-spacing": hero.titleLetterSpacing,
    "--services-hero-subtitle-min-height": hero.subtitleMinHeight,
    "--services-hero-subtitle-size": hero.subtitleSize,
    "--services-hero-subtitle-line-height": hero.subtitleLineHeight,
    "--services-hero-subtitle-mobile-max-width": hero.subtitleMobileMaxWidth,
    "--services-hero-caret-color": hero.caretColor,
    "--services-card-max-width": card.maxWidth,
    "--services-card-max-width-mobile": card.maxWidthMobile,
    "--services-card-min-height": card.minHeight,
    "--services-card-min-height-tablet": card.minHeightTablet,
    "--services-card-min-height-mobile": card.minHeightMobile,
    "--services-card-gap": card.gap,
    "--services-card-padding": card.padding,
    "--services-card-padding-tablet": card.paddingTablet,
    "--services-card-padding-mobile": card.paddingMobile,
    "--services-card-radius": card.radius,
    "--services-card-font-family": card.fontFamily,
    "--services-card-background": buildCardSurface(cardGlass),
    "--services-card-backdrop-filter": buildBackdropFilter(cardGlass),
    "--services-card-border": rgba(cardGlass.borderColor, cardGlass.borderOpacity),
    "--services-card-border-hover": rgba(cardGlass.borderColor, cardGlass.borderOpacityHover),
    "--services-card-shadow": buildCardShadow(cardGlass, false),
    "--services-card-shadow-hover": buildCardShadow(cardGlass, true),
    "--services-card-highlight": buildCardHighlight(cardGlass),
    "--services-card-image-wrap-min-height": card.imageWrapMinHeight,
    "--services-card-image-width": card.imageWidth,
    "--services-card-image-height": card.imageHeight,
    "--services-card-content-gap": card.contentGap,
    "--services-card-copy-gap": card.copyGap,
    "--services-card-title-size": card.titleSize,
    "--services-card-title-size-mobile": card.titleSizeMobile,
    "--services-card-title-line-height": card.titleLineHeight,
    "--services-card-title-weight": card.titleWeight,
    "--services-card-title-letter-spacing": card.titleLetterSpacing,
    "--services-card-title-transform": card.titleTransform,
    "--services-card-title-white-space": card.titleWhiteSpace,
    "--services-card-title-color": cardGlass.titleColor,
    "--services-card-description-max-width": card.descriptionMaxWidth,
    "--services-card-description-max-width-tablet": card.descriptionMaxWidthTablet,
    "--services-card-description-size": card.descriptionSize,
    "--services-card-description-line-height": card.descriptionLineHeight,
    "--services-card-description-weight": card.descriptionWeight,
    "--services-card-description-color": cardGlass.descriptionColor,
    "--services-card-actions-gap": card.actionsGap,
    "--services-card-button-height": card.buttonHeight,
    "--services-card-button-radius": card.buttonRadius,
    "--services-card-button-font-size": card.buttonFontSize,
    "--services-card-button-font-weight": card.buttonFontWeight,
    "--services-card-button-border": rgba(
      buttonGlass.shared.borderColor,
      buttonGlass.shared.borderOpacity
    ),
    "--services-card-button-backdrop-filter": buildBackdropFilter(buttonGlass.shared),
    "--services-card-button-highlight": buildButtonHighlight(buttonGlass.shared),
    "--services-card-button-primary-background": buildButtonSurface(
      buttonGlass.shared,
      buttonGlass.primary
    ),
    "--services-card-button-primary-color": buttonGlass.primary.textColor,
    "--services-card-button-primary-border": rgba(
      buttonGlass.primary.borderColor,
      buttonGlass.primary.borderOpacity
    ),
    "--services-card-button-primary-border-hover": rgba(
      buttonGlass.primary.borderColor,
      buttonGlass.primary.borderOpacityHover
    ),
    "--services-card-button-primary-shadow": buildButtonShadow(
      buttonGlass.shared,
      buttonGlass.primary,
      false
    ),
    "--services-card-button-primary-shadow-hover": buildButtonShadow(
      buttonGlass.shared,
      buttonGlass.primary,
      true
    ),
    "--services-card-button-secondary-background": buildButtonSurface(
      buttonGlass.shared,
      buttonGlass.secondary
    ),
    "--services-card-button-secondary-color": buttonGlass.secondary.textColor,
    "--services-card-button-secondary-border": rgba(
      buttonGlass.secondary.borderColor,
      buttonGlass.secondary.borderOpacity
    ),
    "--services-card-button-secondary-shadow": buildButtonShadow(
      buttonGlass.shared,
      buttonGlass.secondary,
      false
    ),
    "--services-card-button-secondary-background-hover": buildButtonSurface(
      buttonGlass.shared,
      {
        ...buttonGlass.secondary,
        tintOpacity: buttonGlass.secondary.tintOpacity + 0.05,
      }
    ),
    "--services-card-button-secondary-border-hover": rgba(
      buttonGlass.secondary.borderColor,
      buttonGlass.secondary.borderOpacityHover
    ),
  };
}
