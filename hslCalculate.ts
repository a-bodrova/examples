export type HslCalculate = (coefficient: number) => string;
/**
 * @param coefficient: safetyIndex
 *
 * safetyIndex:
 *
 * -1: unknown
 * 0.00 - 0.33 - error (красный)
 * 0.34 - 0.66 - warning (желтый)
 * 0.67 - 1.00 - green (зеленый)
 *
 * hsl:
 *
 * hue - значение в градусах, от 0 до 360, 0 - красный, 60 - желтый, 120 - зеленый, 180 - циан, 240 - синий, 300 - маджента
 * saturation - значение насыщенности в процентах (0 - серый, 100 - максимальная насыщенность)
 * lightness - значение яркости в процентах (0 - черный, 100 - белый)
 *
 * https://tsh.io/blog/why-should-you-use-hsl-color-representation-in-css/
 */

export const hslCalculate: HslCalculate = (coefficient) => {
  // если -1, то данных нет, синий
  if (coefficient < 0) {
    return "hsl(208 80% 28%)";
  }

  // от 0 до 0,33 - красный, деление на 3 нужно для более красного оттенка, т.к. hue = 33 - это грязно-оранжевый
  if (coefficient < 0.34) {
    return `hsl(${coefficient === 0 ? 0 : Math.round((100 * coefficient) / 3)} 100% 40%)`;
  }

  // от 0,66 до 1 - зеленый
  if (coefficient > 0.66) {
    return `hsl(${Math.round(120 * coefficient)} 100% 35%)`;
  }

  // coefficient >= 0.34 || coefficient <= 0.66 // желтый, если saturation = 100%, то цвет слишком светлый, не видно белый текст
  return `hsl(${Math.round(100 * coefficient)} 80% 50%)`;
};

