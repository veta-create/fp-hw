/**
 * @file Домашка по FP ч. 2
 *
 * Подсказки:
 * Метод get у инстанса Api – каррированый
 * GET / https://animals.tech/{id}
 *
 * GET / https://api.tech/numbers/base
 * params:
 * – number [Int] – число
 * – from [Int] – из какой системы счисления
 * – to [Int] – в какую систему счисления
 *
 * Иногда промисы от API будут приходить в состояние rejected, (прямо как и API в реальной жизни)
 * Ответ будет приходить в поле {result}
 */
import Api from '../tools/api';
import {
    allPass,
    gte,
    ifElse,
    length,
    lte,
    pipe,
    prop,
    tap,
    __,
    andThen,
    otherwise,
    test,
} from 'ramda';

const api = new Api();
const fetchBinaryString = (decimalNumber) => api.get('https://api.tech/numbers/base', {from: 10, to: 2, number: decimalNumber});
const fetchAnimal = (animalId) => api.get(`https://animals.tech/${animalId}`, {});
const decimalNumberRegEx = test(/(^\d+$|^\d+\.\d*$|^\d*\.\d+$)/);
const numberLengthBetweenTwoAndTen = pipe(length, allPass([gte(__, 2), lte(__, 10)]));
const validateNumber = allPass([numberLengthBetweenTwoAndTen, decimalNumberRegEx]);

const processSequence = ({value, writeLog, handleSuccess, handleError}) => {
    const log = tap(writeLog);
    const getResult = prop('result');
    const validationError = () => {handleError('ValidationError')};

    const step1_logString = log;
    const step2_validateNumberAndContinueOnSuccess = (next) => ifElse(validateNumber, next, validationError);
    const step3_convertNumberToIntegerAndLogIt = pipe(Math.round, log);
    const step4_convertNumberToBinaryStringLogItAndContinueOnSuccess = (next) => pipe(fetchBinaryString, andThen(pipe(getResult, log, next)), otherwise(handleError));
    const step5_getBinaryStringLengthAndLogIt = pipe(length, log);
    const step6_squareLengthAndLogIt = pipe((len) => len**2, log);
    const step7_takeReminderOfDivisionByThreeAndLogIt = pipe((val) => val%3, log);
    const step8_fetchAnimalAndContinueOnSuccess = (next) => pipe(fetchAnimal, andThen(pipe(getResult, next)), otherwise(handleError));
    const step9_handleSuccess = handleSuccess;

    const onSuccessfulValidation = pipe(step3_convertNumberToIntegerAndLogIt, step4_convertNumberToBinaryStringLogItAndContinueOnSuccess(pipe(step5_getBinaryStringLengthAndLogIt, step6_squareLengthAndLogIt, step7_takeReminderOfDivisionByThreeAndLogIt, step8_fetchAnimalAndContinueOnSuccess(step9_handleSuccess))));
    const processNumber = pipe(step1_logString, step2_validateNumberAndContinueOnSuccess(onSuccessfulValidation));
    processNumber(value);
}

export default processSequence;