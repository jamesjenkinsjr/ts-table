import { Currency, Deal } from '../../types/Contact';

// [currency] -> USD rate as of July 5th, 2021
const exchangeRateMap: { [key in Currency]: number } = {
    [Currency.USD]: 1,
    [Currency.AUD]: 0.75,
    [Currency.EUR]: 1.19,
};

export const currencySymbolMap: { [key in Currency]: string } = {
    [Currency.USD]: '$',
    [Currency.EUR]: '€',
    [Currency.AUD]: 'A$',
};

export const convertToUSD = (value: number, currency: Currency) => {
    return value * exchangeRateMap[currency];
};

export const getInitials = (name: string) =>
    name
        .split(' ')
        .map((val) => val[0])
        .join('');

export const getTotalValue = (deals: Deal[]) =>
    `$${deals
        .reduce((total, deal) => total + convertToUSD(+deal.value, deal.currency), 0)
        .toLocaleString('en', {
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        })}`;

export const getDeals = (deals: Deal[]) =>
    deals
        .map((deal) => `${deal.title} (${currencySymbolMap[deal.currency]}${(+deal.value).toLocaleString()})`)
        .join(', ');
