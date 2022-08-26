import clsx from 'clsx';
import { AirtableValue } from 'shared/airtable/types';

export const unnamedRecordPlaceholder = 'Unnamed record';

const buttonBase =
    'inline-flex items-center p-1.5 text-sm font-medium leading-4 text-white border border-transparent rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2';

const classes = {
    selectedRecordsContainer: 'mb-2 space-y-2 text-sm',
    selectedRecord: (primaryFieldValue: AirtableValue) =>
        clsx(
            'flex items-center justify-between px-2 py-2 bg-white border-2 rounded-md',
            primaryFieldValue ? 'text-gray-800' : 'text-gray-500'
        ),
    iconButton:
        'inline-flex items-center p-1 bg-white border border-transparent rounded-full hover:bg-gray-100 focus:outline-none',
    icon: 'w-4 h-4 text-gray-400 transition-colors duration-75 hover:text-gray-500',
    buttonsContainer: 'space-x-1 mb-2',
    addButton: clsx(
        'inline-flex items-center px-2.5 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded duration-200 transition-all text-gray-700 bg-gray-200 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
    ),
    clearButton: clsx(
        buttonBase,
        'bg-red-600 hover:bg-red-700 focus:ring-red-500'
    ),
    buttonIcon: '-ml-0.5 mr-2 h-4 w-4',
    dialogContent: 'bg-white flex flex-1 flex-col',
    dialogHeaderContainer: 'px-4 mt-4',
    dialogHeader: 'relative flex items-center pb-3 border-b-2',
    searchIcon: 'w-5 h-5 text-gray-400 pointer-events-none',
    searchInput:
        'block w-full pl-2 bg-transparent border-none rounded-md sm:text-sm',
    closeDialogIcon:
        'w-5 h-5 text-gray-400 transition-colors duration-75 cursor-pointer hover:text-gray-500',
    listContainer: 'h-96 overflow-y-auto p-4 text-sm',
    listboxButton: 'sr-only',
    listboxOptions:
        'space-y-2 outline-none w-full after after:h-2 after:block after:w-full',
    listboxOption: ({ active }: { active: boolean }) =>
        clsx(
            'relative p-4 transition-colors bg-white border-2 border-gray-200 rounded-lg shadow-sm cursor-pointer hover:border-indigo-300 text-base',
            active && 'border-indigo-300'
        ),
    listboxOptionValue: (displayValue: string) =>
        clsx(
            'overflow-hidden text-ellipsis whitespace-nowrap',
            displayValue === unnamedRecordPlaceholder && 'text-gray-500'
        ),
    spinner: 'flex justify-center items-center h-full',
    loadMoreSpinner: 'flex justify-center py-8',
    noResults: 'text-center',
};

export default classes;
