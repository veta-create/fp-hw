/**
 * @file Домашка по FP ч. 1
 *
 * Основная задача — написать самому, или найти в FP библиотеках функции anyPass/allPass
 * Эти функции/их аналоги есть и в ramda и в lodash
 *
 * allPass — принимает массив функций-предикатов, и возвращает функцию-предикат, которая
 * вернет true для заданного списка аргументов, если каждый из предоставленных предикатов
 * удовлетворяет этим аргументам (возвращает true)
 *
 * anyPass — то же самое, только удовлетворять значению может единственная функция-предикат из массива.
 *
 * Если какие либо функции написаны руками (без использования библиотек) это не является ошибкой
 */

import {
    curry,
    filter,
    identity,
    countBy,
    length,
    eqBy,
    F,
    all,
    allPass,
    anyPass,
    complement,
    compose,
    count,
    equals,
    gte,
    ifElse,
    prop,
    values
} from "ramda";

/* Геттеры */
const getTriangle = prop('triangle');
const getSquare = prop('square');
const getCircle = prop('circle');
const getStar = prop('star');

/* Цвета */
const validateColor = color => figure => equals(figure, color);

const isWhite = validateColor('white');
const isNotWhite = complement(isWhite);

const isBlue = validateColor('blue');
const isOrange = validateColor('orange');
const isRed = validateColor('red');
const isGreen = validateColor('green');

const isAnyColor = anyPass([
    isWhite,
    isBlue,
    isOrange,
    isRed,
    isGreen,
]);

const isAnyColorExcept = (color) => {
    const colorsExcept = [isWhite, isBlue, isOrange, isRed, isGreen].filter(c => !equals(c, color));
    return anyPass(colorsExcept);
}

const isAnyColorExceptWhite = isAnyColorExcept(isWhite);

const filterFiguresByColor = curry((colorPredicate, figures) => filter(colorPredicate, values(figures)));

const countNonWhiteFigures = compose(countBy(identity), filterFiguresByColor(isNotWhite));
const countFiguresWithColor = (colorPredicate) => (figures) => count(colorPredicate, values(figures));

const countFiguresWithGreenColor = countFiguresWithColor(isGreen);
const countFiguresWithBlueColor = countFiguresWithColor(isBlue);
const countFiguresWithRedColor = countFiguresWithColor(isRed);

/* Математические сравнения */
const isAtLeastTwo = (count) => gte(count, 2);
const isZero = value => equals(value, 0);
const isBothZeroes = (a, b) => all(isZero, [a ,b]);
const isEqual = (a, b) => equals(a, b);
const isEqualsExceptZero = ifElse(isBothZeroes, F, isEqual);

// 1. Красная звезда, зеленый квадрат, все остальные белые.
export const validateFieldN1 = allPass([
    compose(isRed, getStar),
    compose(isGreen, getSquare),
    compose(isWhite, getTriangle),
    compose(isWhite, getCircle)
]);

// 2. Как минимум две фигуры зеленые.
export const validateFieldN2 = compose(
  isAtLeastTwo,
  countFiguresWithGreenColor
);

// 3. Количество красных фигур равно кол-ву синих.
export const validateFieldN3 = (figures) => isEqualsExceptZero(
    countFiguresWithRedColor(figures),
    countFiguresWithBlueColor(figures)
);

// 4. Синий круг, красная звезда, оранжевый квадрат треугольник любого цвета
export const validateFieldN4 = allPass([
    compose(isBlue, getCircle),
    compose(isRed, getStar),
    compose(isOrange, getSquare),
    compose(isAnyColor, getTriangle),
]);

// 5. Три фигуры одного любого цвета кроме белого (четыре фигуры одного цвета – это тоже true).
export const validateFieldN5 = (figures) => values(countNonWhiteFigures(figures)).some(count => gte(count, 3));

// 6. Ровно две зеленые фигуры (одна из зелёных – это треугольник), плюс одна красная. Четвёртая оставшаяся любого доступного цвета, но не нарушающая первые два условия
// Cильно сложно 🙈🙈🙈
export const validateFieldN6 = allPass([
    compose(eqBy(identity, 2), countFiguresWithGreenColor),
    compose(isGreen, getTriangle),
    compose(eqBy(identity, 1), countFiguresWithRedColor),
    figures => {
        const nonGreenAndNonRedFigures = filterFiguresByColor(figure => !(isGreen(figure) || isRed(figure)), figures);
        return equals(length(nonGreenAndNonRedFigures), 1);
    }
]);

// 7. Все фигуры оранжевые.
export const validateFieldN7 = allPass([
    compose(isOrange, getStar),
    compose(isOrange, getSquare),
    compose(isOrange, getTriangle),
    compose(isOrange, getCircle)
]);

// 8. Не красная и не белая звезда, остальные – любого цвета.
export const validateFieldN8 = compose(
    anyPass([isBlue, isOrange, isGreen]),
    getStar
);

// 9. Все фигуры зеленые.
export const validateFieldN9 = allPass([
    compose(isGreen, getStar),
    compose(isGreen, getSquare),
    compose(isGreen, getTriangle),
    compose(isGreen, getCircle)
]);

// 10. Треугольник и квадрат одного цвета (не белого), остальные – любого цвета
export const validateFieldN10 = allPass([
    figures => isAnyColorExceptWhite(getTriangle(figures)),
    figures => isAnyColorExceptWhite(getSquare(figures)),
    figures => equals(getTriangle(figures), getSquare(figures))
]);