import { Contact, ContactDeal, ContactTag, Deal, RawContact, Tag } from '../types/Contact';

const getContacts = async () => {
    const { REACT_APP_API_URL, REACT_APP_API_KEY, HOST } = process.env;
    const apiUrl = REACT_APP_API_URL || 'localhost';
    const apiKey = REACT_APP_API_KEY || '';
    const params = '?include=contactTags.tag,contactDeals.deal';
    const res = await fetch(`${apiUrl}/api/3/contacts${params}`, {
        method: 'GET',
        mode: 'cors',
        headers: {
            'Api-Token': apiKey,
            Origin: HOST || 'localhost',
        },
    });
    const rawData = await res.json();
    const tagMap: { [key: string]: Tag } = {};
    const dealMap: { [key: string]: Deal } = {};
    const contactTagMap: { [key: string]: ContactTag } = {};
    const contactDealMap: { [key: string]: ContactDeal } = {};

    // Create relevant maps for external entities: O(n)
    rawData.tags.forEach(({ id, tag }: Tag) => (tagMap[id] = { id, tag }));
    rawData.contactTags.forEach(({ id, tag, contact }: ContactTag) => (contactTagMap[id] = { id, tag, contact }));
    rawData.deals.forEach(
        ({ contact, id, value, currency, title }: Deal) => (dealMap[id] = { id, contact, value, currency, title }),
    );
    rawData.contactDeals.forEach(({ id, deal, contact }: ContactDeal) => (contactDealMap[id] = { id, deal, contact }));

    return rawData.contacts.reduce((contacts: Contact[], contact: RawContact) => {
        const { id, firstName, lastName, contactDeals, contactTags } = contact;
        return [
            ...contacts,
            {
                id,
                firstName,
                lastName,
                tags: contactTags.map((cTagID) => tagMap[contactTagMap[cTagID].tag]),
                deals: contactDeals.map((cDealID) => dealMap[contactDealMap[cDealID].deal]),
            },
        ];
    }, []);
};

export default getContacts;
