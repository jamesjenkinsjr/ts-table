// These were the relevant currencies found within
// the dummy data
export enum Currency {
    USD = 'usd',
    EUR = 'eur',
    AUD = 'aud',
}

export interface Tag {
    id: string;
    tag: string;
}

export interface ContactTag {
    id: string;
    contact: string;
    tag: string;
}

export interface Deal {
    id: string;
    contact: string;
    title: string;
    value: string;
    currency: Currency;
}

export interface ContactDeal {
    id: string;
    contact: string;
    deal: string;
}

export interface RawContact {
    id: string;
    firstName: string;
    lastName: string;
    contactTags: string[];
    contactDeals: string[];
}

export interface Contact {
    id: string;
    firstName: string;
    lastName: string;
    tags: Tag[];
    deals: Deal[];
}
