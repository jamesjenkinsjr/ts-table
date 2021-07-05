import React, { useEffect, useState } from 'react';

import getContacts from '../../api/getContacts';
import { Contact } from '../../types/Contact';
import { getDeals, getInitials, getTotalValue } from './utils';

import './Table.css';

enum ColumnType {
    CONTACT = 'Contact',
    VALUE = 'Total Value',
    LOCATION = 'Location',
    DEALS = 'Deals',
    TAGS = 'Tags',
}

const columnHeadingMap: { [key in ColumnType]: string } = {
    [ColumnType.CONTACT]: '--contact',
    [ColumnType.VALUE]: '--value',
    [ColumnType.LOCATION]: '--location',
    [ColumnType.DEALS]: '--deals',
    [ColumnType.TAGS]: '--tags',
};

const Table: React.FC = () => {
    const [contactData, setContactData] = useState<Contact[]>([]);
    const [selectedRows, setSelectedRows] = useState<string[]>([]);

    // Initial fetch for table data (only runs once)
    useEffect(() => {
        const getContactData = async () => {
            const contacts = await getContacts();
            setContactData(contacts);
        };
        getContactData();
    }, []);

    const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) =>
        e.target.checked ? setSelectedRows(contactData.map((c) => c.id)) : setSelectedRows([]);

    const contactRows = contactData.map((c) => {
        const cellValueMap: { [key in ColumnType]: string } = {
            [ColumnType.CONTACT]: `${c.firstName} ${c.lastName}`,
            [ColumnType.VALUE]: getTotalValue(c.deals),
            // Reviewing the dummy data, it does not appear that contact entities
            // have location as a system/base field on their record (including the
            // dummy custom fields).
            // I also checked to see if account/organization might have a location
            // to pull from but the dummy data also does not have a value for these.
            // Lastly I checked the addresses endpoint and found one sole record
            // but with no clear association to contacts nor accounts
            // Putting a uniform location for all in as a result
            [ColumnType.LOCATION]: 'Chicago, IL, USA',
            [ColumnType.DEALS]: getDeals(c.deals),
            [ColumnType.TAGS]: c.tags.map((t) => t.tag).join(', '),
        };
        const handleSelectRow = () =>
            setSelectedRows((currentState) =>
                currentState.includes(c.id) ? currentState.filter((id) => id !== c.id) : [...currentState, c.id],
            );
        return (
            <li key={c.id} className={'table__list-item'}>
                <input
                    checked={selectedRows.includes(c.id)}
                    onChange={handleSelectRow}
                    className={'table__list-item-checkbox'}
                    type={'checkbox'}
                />
                {Object.keys(cellValueMap).map((cell, i) => (
                    <p
                        key={`${c.id}-cell-${i}`}
                        className={`table__list-item-cell table__list-item-cell${columnHeadingMap[cell as ColumnType]}`}
                        title={cellValueMap[cell as ColumnType]}
                    >
                        {cell === ColumnType.CONTACT && (
                            <div className={'table__name-avatar'}>{getInitials(cellValueMap[cell as ColumnType])}</div>
                        )}
                        {cellValueMap[cell as ColumnType]}
                    </p>
                ))}
            </li>
        );
    });

    // Insert the table heading
    const rowsWithHeading = [
        <li key={'0'} className={'table__list-item table__list-heading'}>
            <input onChange={handleSelectAll} className={'table__list-item-checkbox'} type={'checkbox'} />
            {Object.keys(columnHeadingMap).map((heading, i) => (
                <p
                    key={`heading-${i}`}
                    className={`table__list-heading-cell table__list-heading-cell${
                        columnHeadingMap[heading as ColumnType]
                    }`}
                >
                    {heading}
                </p>
            ))}
        </li>,
        ...contactRows,
    ];

    return (
        <div className={'table'}>
            <h1 className={'table__header'}>{'Camp Contact Table'}</h1>
            <ul className={'table__list'}>{rowsWithHeading}</ul>
        </div>
    );
};

export default Table;
