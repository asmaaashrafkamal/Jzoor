import ScrollReveal from "scrollreveal";

export const initScrollReveal = (selector = '.reveal', configType = 'default') => {
  const baseConfig = {
    distance: "60px",
    duration: 600,
    delay: 200,
    reset: false,
  };

  const configs = {
    default: { origin: 'bottom' },
    top: { origin: 'top' },
    topInterval: { origin: 'top', interval: 100 },
    left: { origin: 'left' },
    leftInterval:{origin:'left' ,interval:100},
    right: { origin: 'right' },
    zoom: { origin: 'top', scale: 0.5 },
  };

  const finalConfig = {
    ...baseConfig,
    ...(configs[configType] || configs.default),
  };

  ScrollReveal().reveal(selector, finalConfig);
};
