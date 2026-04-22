import { useMemo, useState } from 'react';
import { LuCheck } from "react-icons/lu";

const BUTTONS = [
    { key: 'clear' },
    { key: 'divide' },
    { key: 'multiply' },
    { key: 'backspace' },
    { key: '7' },
    { key: '8' },
    { key: '9' },
    { key: 'subtract' },
    { key: '4' },
    { key: '5' },
    { key: '6' },
    { key: 'add' },
    { key: '1' },
    { key: '2' },
    { key: '3' },
    { key: 'equals' },
    { key: '.' },
    { key: '0' },
    { key: '000' },
    { key: 'check' },
];

const BUTTON_META = {
    clear: { label: 'C', type: 'utility' },
    divide: { label: String.fromCharCode(247), value: '/' },
    multiply: { label: 'x', value: '*' },
    subtract: { label: '-', value: '-' },
    add: { label: '+', value: '+' },
    equals: { label: '=', type: 'accent' },
    check: { label: 'check', type: 'accent' },
    backspace: { label: 'backspace', type: 'utility' },
};

const operatorSet = new Set(['/', '*', '-', '+']);

const expandExponential = (value) => {
    const stringValue = String(value);

    if (!/[eE]/.test(stringValue)) {
        return stringValue;
    }

    const [mantissa, exponentPart] = stringValue.toLowerCase().split('e');
    const exponent = Number.parseInt(exponentPart, 10);
    const negative = mantissa.startsWith('-');
    const unsignedMantissa = negative ? mantissa.slice(1) : mantissa;
    const [integerPart, decimalPart = ''] = unsignedMantissa.split('.');
    const digits = `${integerPart}${decimalPart}`;
    const decimalIndex = integerPart.length;
    const nextIndex = decimalIndex + exponent;

    let expanded;

    if (nextIndex <= 0) {
        expanded = `0.${'0'.repeat(Math.abs(nextIndex))}${digits}`;
    } else if (nextIndex >= digits.length) {
        expanded = `${digits}${'0'.repeat(nextIndex - digits.length)}`;
    } else {
        expanded = `${digits.slice(0, nextIndex)}.${digits.slice(nextIndex)}`;
    }

    const normalized = expanded.replace(/^0+(?=\d)/, '').replace(/(\.\d*?)0+$/, '$1').replace(/\.$/, '');
    return negative ? `-${normalized}` : normalized;
};

const formatResult = (value) => {
    if (!Number.isFinite(value)) {
        return 'Error';
    }

    const normalized = Number.parseFloat(value.toFixed(8));
    return expandExponential(normalized);
};

const evaluateExpression = (expression) => {
    const sanitized = expression.replace(/x/g, '*').replace(new RegExp(String.fromCharCode(247), 'g'), '/').trim();

    if (!sanitized || /[+\-*/.]$/.test(sanitized)) {
        return expression;
    }

    try {
        const result = Function(`"use strict"; return (${sanitized})`)();
        return formatResult(result);
    } catch {
        return 'Error';
    }
};

const getEvaluableExpression = (expression) => {
    const sanitized = expression.replace(/x/g, '*').replace(new RegExp(String.fromCharCode(247), 'g'), '/').trim();
    return sanitized.replace(/[+\-*/.]+$/, '');
};

const getPreviewTotal = (expression) => {
    const evaluableExpression = getEvaluableExpression(expression);

    if (!evaluableExpression) {
        return '0';
    }

    try {
        const result = Function(`"use strict"; return (${evaluableExpression})`)();
        return formatResult(result);
    } catch {
        return '0';
    }
};

const getDisplayChunks = (expression) => {
    if (!expression || expression === '0' || expression === 'Error') {
        return [expression || '0'];
    }

    const chunks = expression.match(/[^+\-*/]+[+\-*/]?/g);
    return chunks?.length ? chunks : [expression];
};

const getDisplaySizeClass = (expression) => {
    const length = expression?.length || 0;

    if (length > 24) {
        return 'text-lg sm:text-xl';
    }

    if (length > 18) {
        return 'text-2xl sm:text-3xl';
    }

    return 'text-3xl sm:text-4xl';
};

export default function Calculator({
    initialValue = '0',
    title = 'Calculator',
    onChange,
    onEquals,
}) {
    const [expression, setExpression] = useState(initialValue || '0');

    const displayValue = useMemo(() => expression || '0', [expression]);
    const displayChunks = useMemo(() => getDisplayChunks(displayValue), [displayValue]);
    const totalValue = useMemo(() => getPreviewTotal(displayValue), [displayValue]);
    const displaySizeClass = useMemo(() => getDisplaySizeClass(displayValue), [displayValue]);

    const updateExpression = (nextValue) => {
        setExpression(nextValue);
        if (onChange) {
            onChange(nextValue);
        }
    };

    const appendDigit = (digit) => {
        if (expression === 'Error') {
            updateExpression(digit);
            return;
        }

        if (expression === '0' && digit !== '.') {
            updateExpression(digit);
            return;
        }

        updateExpression(`${expression}${digit}`);
    };

    const appendDecimal = () => {
        if (expression === 'Error') {
            updateExpression('0.');
            return;
        }

        const segments = expression.split(/[+\-*/]/);
        const currentSegment = segments[segments.length - 1];

        if (currentSegment.includes('.')) {
            return;
        }

        if (!currentSegment) {
            updateExpression(`${expression}0.`);
            return;
        }

        updateExpression(`${expression}.`);
    };

    const appendOperator = (operator) => {
        if (expression === 'Error') {
            return;
        }

        const current = expression || '0';
        const lastChar = current.slice(-1);

        if (operatorSet.has(lastChar)) {
            updateExpression(`${current.slice(0, -1)}${operator}`);
            return;
        }

        updateExpression(`${current}${operator}`);
    };

    const handlePress = (key) => {
        if (key === 'clear') {
            updateExpression('0');
            return;
        }

        if (key === 'backspace') {
            if (expression === 'Error' || expression.length <= 1) {
                updateExpression('0');
                return;
            }

            updateExpression(expression.slice(0, -1));
            return;
        }

        if (key === 'equals') {
            const evaluated = evaluateExpression(expression);
            updateExpression(evaluated);
            return;
        }

        if (key === 'check') {
            const evaluated = evaluateExpression(expression);
            updateExpression(evaluated);
            if (onEquals) {
                onEquals(evaluated);
            }
            return;
        }

        if (key === '.') {
            appendDecimal();
            return;
        }

        if (BUTTON_META[key]?.value) {
            appendOperator(BUTTON_META[key].value);
            return;
        }

        appendDigit(key);
    };

    return (
        <section className="w-full p-4 sm:p-5 ">
            <div className="mb-4 rounded-[28px] border border-white/5 bg-[linear-gradient(180deg,rgba(255,255,255,0.03),rgba(255,255,255,0.01))] p-5 sm:p-6">
                <div className="text-[10px] font-semibold uppercase tracking-[0.24em] text-[var(--color-theme-secondary-text)]">
                    {/* {title} */}
                    {/* Total: <span className='text-[var(--color-light)]'>{totalValue}</span> */}
                    Total: <span className='text-[var(--color-theme-important)]'>{totalValue}</span>
                </div>
                {/* <div className="mt-2 block w-full max-w-full whitespace-normal break-all [overflow-wrap:anywhere] text-sm leading-6 text-[var(--color-theme-secondary-text)]">
                    Total: {totalValue}
                </div> */}
                <div className={`mt-6 flex min-h-[72px] w-full max-w-full flex-wrap justify-end gap-x-1 gap-y-2 text-right font-black leading-[1.05] tracking-tight text-[var(--color-light)] ${displaySizeClass}`}>
                    {displayChunks.map((chunk, index) => (
                        <span key={`${chunk}-${index}`} className="max-w-full break-all text-right">
                            {chunk}
                        </span>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-4 auto-rows-[4rem] gap-3 sm:auto-rows-[4.5rem]">
                {BUTTONS.map(({ key, rowSpan }) => {
                    const meta = BUTTON_META[key] || { label: key, type: 'number' };
                    const isAccent = meta.type === 'accent';
                    const isUtility = meta.type === 'utility';

                    return (
                        <button
                            key={key}
                            type="button"
                            onClick={() => handlePress(key)}
                            className={[
                                'flex h-full items-center justify-center rounded-[22px] border text-[var(--color-light)] transition-all duration-200 active:scale-[0.98]',
                                rowSpan ? 'row-span-2' : '',
                                isAccent
                                    ? 'border-[var(--color-theme-important)] bg-[linear-gradient(135deg,var(--color-theme-important),var(--color-theme-important-dark))] shadow-[0_14px_30px_var(--color-theme-important-low)]'
                                    : isUtility
                                        ? 'border-white/10 bg-white/[0.04] hover:border-[var(--color-theme-important)]/40 hover:bg-white/[0.06]'
                                        : 'border-white/8 bg-[var(--color-theme-tertiary)]/80 hover:border-[var(--color-theme-important)]/35 hover:bg-[var(--color-theme-tertiary-light)]/80',
                            ].join(' ')}
                        >
                            {key === 'backspace' ? (
                                <span className="relative block h-7 w-10 text-[var(--color-theme-important)]">
                                    <span className="absolute inset-y-0 right-0 w-8 rounded-r-[0.35rem] border border-current border-l-0" />
                                    <span className="absolute left-0 top-1/2 h-[1.1rem] w-[1.1rem] -translate-y-1/2 rotate-45 border-b border-l border-current bg-transparent" />
                                    <span className="absolute inset-0 flex items-center justify-center text-sm font-bold">x</span>
                                </span>
                            ) : key === 'check' ? (
                                <LuCheck size={32} strokeWidth={3} />
                            ) : (
                                <span className={`flex items-center justify-center leading-none select-none ${isAccent ? 'text-3xl font-black' : 'text-[2rem] font-semibold'}`}>
                                    {meta.label}
                                </span>
                            )}
                        </button>
                    );
                })}
            </div>
        </section>
    );
}
