import React, {
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState,
} from 'react';
import {
    AirtableLinkedRecordField,
    AirtableRecord,
} from 'shared/airtable/types';
import { v1APIRoute } from 'shared/api/routes';
import {
    FetchRecordsForLinkedRecordsSelectorInput,
    FetchRecordsForLinkedRecordsSelectorOutput,
} from 'shared/api/types/fetchRecordsForLinkedRecordsSelector';
import { executeApiRequest } from 'shared/executeApiRequest';
import debounce from 'shared/helpers/debounce';
import { LinkedRecordIdsToAirtableRecords } from 'shared/types/linkedRecordsIdsToPrimaryValues';
import { assertUnreachable } from 'shared/utils/assertUnreachable';
import { LoadingState } from 'shared/utils/loadingState';

import { Listbox } from '@headlessui/react';
import { SearchIcon, XIcon } from '@heroicons/react/solid';

import useIntersectionObserver from '../../../../hooks/useIntersectionObserver';
import { useAppDispatch } from '../../../../redux/hooks';
import { simpleLogError } from '../../../../utils/logError';
import { publicExtensionActions } from '../../../PublicExtension/redux/publicExtensionReducer';
import { useLinkedRecordIdsToPrimaryValues } from '../../../PublicExtension/redux/publicExtensionSelectors';
import ErrorMessage from '../../../reusables/ErrorMessage';
import Modal from '../../../reusables/Modal';
import Spinner from '../../../reusables/Spinner';

import classes from './LinkedRecordsField.styles';

type LinkedRecordsFieldProps = {
    airtableField: AirtableLinkedRecordField;
    value: string[] | undefined;
    setValue: (value: string[] | undefined) => void;
    extensionId: string;
    extensionSessionId: string;
};
const emptyValueForLinkedRecords: string[] = [];

const LinkedRecordsField = (props: LinkedRecordsFieldProps) => {
    const [isLoading, setIsLoading] = useState(false);
    const [shouldFetchRecords, setShouldFetchRecords] = useState(true);
    const [isSelectorOpen, setIsSelectorOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectorRecords, setSelectorRecords] = useState<AirtableRecord[]>(
        []
    );
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const { root, ref, inView } = useIntersectionObserver({
        rootMargin: '400px',
    });

    const dispatch = useAppDispatch();
    const linkedRecordIdsToPrimaryValues = useLinkedRecordIdsToPrimaryValues();
    const offset = useRef<string | null>(null);
    const lastFetchUnixEpoch = useRef<number | null>(null);

    const selectedRecordsIds = props.value || emptyValueForLinkedRecords;

    const linkedTableId = props.airtableField.config.options.linkedTableId;

    useEffect(() => {
        if (inView) fetchRecordsForLinkedRecordsSelector(searchTerm);

        // We only want this to run when the user scrolls all the way down in the selector
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [inView]);

    const openSelector = async () => {
        setIsSelectorOpen(true);

        if (shouldFetchRecords) {
            await fetchRecordsForLinkedRecordsSelector(searchTerm);
        }
    };
    const closeSelector = () => setIsSelectorOpen(false);

    const handleSearchInputChange: React.ChangeEventHandler<HTMLInputElement> =
        (event) => {
            setSearchTerm(event.target.value);
            fetchLinkedRecordIdsToPrimaryValuesWithDebounce(event.target.value);
        };

    const addRecordIdToCellValue = (value: string) => {
        props.setValue([...(props.value ?? []), value]);
        setIsSelectorOpen(false);
    };

    const removeRecord = (recordToRemoveId: string) => {
        props.setValue(
            props.value?.filter((recordId) => recordId !== recordToRemoveId)
        );
    };

    const fetchRecordsForLinkedRecordsSelector = useCallback(
        async (searchTerm: string) => {
            const unixEpoch = Date.now();
            // Early return to avoid excessive fetching
            if (Number(lastFetchUnixEpoch.current) > unixEpoch - 200) {
                return;
            }
            lastFetchUnixEpoch.current = unixEpoch;

            if (!offset.current) {
                setIsLoading(true);
            }
            try {
                const result = await executeApiRequest<
                    FetchRecordsForLinkedRecordsSelectorInput,
                    FetchRecordsForLinkedRecordsSelectorOutput
                >({
                    route: v1APIRoute.fetchRecordsForLinkedRecordsSelector,
                    body: {
                        linkedRecordFieldName: props.airtableField.name,
                        searchTerm,
                        offset: offset.current,
                    },
                    source: {
                        type: 'website',
                    },
                });
                if (result.type === 'success') {
                    if (offset.current) {
                        setSelectorRecords((oldRecords) =>
                            oldRecords.concat(result.data.records)
                        );
                    } else {
                        setSelectorRecords(result.data.records);
                    }
                    offset.current = result.data.offset;

                    const linkedRecordIdsToAirtableRecordsForSearchResult =
                        result.data.records.reduce((acc, curr) => {
                            acc[curr.id] = curr;
                            return acc;
                        }, {} as LinkedRecordIdsToAirtableRecords);

                    dispatch(
                        publicExtensionActions.addMorePrimaryValuesUsingPrimaryFieldsAndRecords(
                            {
                                linkedTableIdsToPrimaryFields: {
                                    ...result.data
                                        .additionalTableIdsToPrimaryFields,
                                    [linkedTableId]:
                                        result.data.primaryFieldInLinkedTable,
                                },
                                linkedTableIdsToRecordIds: {
                                    [linkedTableId]: {
                                        recordIds: Object.keys(
                                            linkedRecordIdsToAirtableRecordsForSearchResult
                                        ),
                                        linkedRecordFieldIdsInMainTable: [
                                            props.airtableField.id,
                                        ],
                                    },
                                },
                                linkedRecordIdsToAirtableRecords: {
                                    ...result.data
                                        .additionalRecordIdsToAirtableRecords,
                                    ...linkedRecordIdsToAirtableRecordsForSearchResult,
                                },
                            }
                        )
                    );

                    dispatch(
                        publicExtensionActions.addMoreLinkedRecordIdsToAirtableRecords(
                            {
                                linkedRecordIdsToAirtableRecords:
                                    linkedRecordIdsToAirtableRecordsForSearchResult,

                                linkedTableFieldIdsToAirtableFields:
                                    result.data
                                        .linkedTableFieldIdsToAirtableFields,
                            }
                        )
                    );
                } else {
                    throw new Error(result.message);
                }
            } catch (error) {
                simpleLogError(error);
                setErrorMessage(
                    error.message ?? 'Unable to load linked records.'
                );
            } finally {
                setIsLoading(false);
                setShouldFetchRecords(false);
            }
        },
        [
            props.airtableField.name,
            props.airtableField.id,
            dispatch,
            linkedTableId,
        ]
    );

    const fetchLinkedRecordIdsToPrimaryValuesWithDebounce = useMemo(() => {
        const debouncedFetchLinkedRecordIdsToPrimaryValues = debounce(
            async (searchTerm) => {
                offset.current = null;
                await fetchRecordsForLinkedRecordsSelector(searchTerm);
            },
            1000
        );
        return debouncedFetchLinkedRecordIdsToPrimaryValues;
    }, [fetchRecordsForLinkedRecordsSelector]);

    const getRecordDisplayValue = (recordId: string): LoadingState<string> => {
        return linkedRecordIdsToPrimaryValues.type === 'loaded'
            ? {
                  type: 'loaded',
                  data: linkedRecordIdsToPrimaryValues.data[recordId],
              }
            : linkedRecordIdsToPrimaryValues;
    };

    return (
        <>
            {selectedRecordsIds.length ? (
                <div className={classes.selectedRecordsContainer}>
                    {selectedRecordsIds.map((recordId) => (
                        <SelectedRecord
                            recordId={recordId}
                            recordDisplayValue={getRecordDisplayValue(recordId)}
                            onRemove={removeRecord}
                            key={recordId}
                        />
                    ))}
                </div>
            ) : null}
            <div className={classes.buttonsContainer}>
                <FooterButtons
                    onClickForFind={openSelector}
                    addRecordIdToCellValue={addRecordIdToCellValue}
                    cellHasRecords={selectedRecordsIds.length > 0}
                    airtableFieldId={props.airtableField.id}
                />
            </div>

            {isSelectorOpen ? (
                <Modal
                    removePadding
                    hideDismissButton
                    title={null}
                    dismiss={closeSelector}
                >
                    <div className={classes.dialogContent}>
                        <div className={classes.dialogHeaderContainer}>
                            <div className={classes.dialogHeader}>
                                <SearchIcon
                                    className={classes.searchIcon}
                                    aria-hidden='true'
                                />
                                <input
                                    type='text'
                                    className={classes.searchInput}
                                    style={{ boxShadow: 'none' }}
                                    value={searchTerm}
                                    onChange={handleSearchInputChange}
                                    placeholder='Find an option'
                                    autoFocus
                                />
                                <XIcon
                                    className={classes.closeDialogIcon}
                                    aria-hidden='true'
                                    onClick={closeSelector}
                                />
                            </div>
                        </div>
                        <div className={classes.listContainer} ref={root}>
                            {isLoading ? (
                                <div className={classes.spinner}>
                                    <Spinner />
                                </div>
                            ) : (
                                <>
                                    <SelectorList
                                        selectorRecords={selectorRecords}
                                        selectedRecordsIds={selectedRecordsIds}
                                        getRecordDisplayValue={
                                            getRecordDisplayValue
                                        }
                                        addRecordIdToCellValue={
                                            addRecordIdToCellValue
                                        }
                                        errorMessage={errorMessage}
                                    />
                                    {offset.current ? (
                                        <div
                                            className={classes.loadMoreSpinner}
                                            ref={ref}
                                        >
                                            <Spinner />
                                        </div>
                                    ) : null}
                                </>
                            )}
                        </div>
                    </div>
                </Modal>
            ) : null}
        </>
    );
};

const SelectorList = (props: {
    selectorRecords: AirtableRecord[];
    selectedRecordsIds: string[];
    getRecordDisplayValue: (recordId: string) => LoadingState<string>;
    addRecordIdToCellValue: (recordId: string) => void;
    errorMessage: string | null;
}) => {
    const notSelectedRecordsIds = props.selectorRecords.filter(
        (record) => !props.selectedRecordsIds.includes(record.id)
    );
    if (props.errorMessage) {
        return <ErrorMessage message={props.errorMessage} />;
    } else if (notSelectedRecordsIds.length) {
        return (
            <Listbox value={null} onChange={props.addRecordIdToCellValue}>
                <Listbox.Button className={classes.listboxButton} />
                <Listbox.Options static className={classes.listboxOptions}>
                    {notSelectedRecordsIds.map((record) => (
                        <SelectorListItem
                            recordId={record.id}
                            getRecordDisplayValue={props.getRecordDisplayValue}
                            key={record.id}
                        />
                    ))}
                </Listbox.Options>
            </Listbox>
        );
    } else {
        return <div className={classes.noResults}>No matching options</div>;
    }
};

const SelectorListItem = (props: {
    recordId: string;
    getRecordDisplayValue: (recordId: string) => LoadingState<string>;
}) => {
    const recordDisplayValue = props.getRecordDisplayValue(props.recordId);

    return (
        <Listbox.Option
            className={classes.listboxOption}
            value={props.recordId}
        >
            <RecordDisplayValueView
                recordDisplayValue={recordDisplayValue}
                render={(displayValue) => (
                    <p className={classes.listboxOptionValue(displayValue)}>
                        {displayValue}
                    </p>
                )}
            />
        </Listbox.Option>
    );
};

const SelectedRecord = (props: {
    recordId: string;
    recordDisplayValue: LoadingState<string>;

    /**
     * Undefined when the field is read-only
     */
    onRemove?: (recordId: string) => void;
}) => {
    const { onRemove } = props;

    return (
        <div className={classes.selectedRecord(props.recordDisplayValue)}>
            <div className='ml-1 overflow-hidden'>
                <RecordDisplayValueView
                    recordDisplayValue={props.recordDisplayValue}
                    render={(displayValue) => (
                        <div className='flex items-center flex-1'>
                            <p className='overflow-hidden whitespace-nowrap text-ellipsis'>
                                {displayValue}
                            </p>
                        </div>
                    )}
                />
            </div>
            {onRemove ? (
                <button
                    type='button'
                    className={classes.iconButton}
                    onClick={() => onRemove(props.recordId)}
                >
                    <XIcon className={classes.icon} aria-hidden='true' />
                </button>
            ) : null}
        </div>
    );
};

const RecordDisplayValueView = (props: {
    recordDisplayValue: LoadingState<string>;
    render: (data: string) => JSX.Element;
}) => {
    switch (props.recordDisplayValue.type) {
        case 'notLoaded':
        case 'loading':
            return (
                <div className='w-32 h-4 bg-gray-100 rounded animate-pulse' />
            );

        case 'loaded':
            return props.render(props.recordDisplayValue.data);

        case 'failed':
            return (
                <p className='text-sm font-medium text-red-800 whitespace-pre-wrap'>
                    {props.recordDisplayValue.errorMessage}
                </p>
            );

        default:
            assertUnreachable(props.recordDisplayValue);
    }
};

const FooterButtons = (props: {
    onClickForFind: () => void;
    addRecordIdToCellValue: (recordId: string) => void;
    cellHasRecords: boolean;
    airtableFieldId: string;
}) => {
    return (
        <div
            className={`flex flex-1 items-center flex-wrap ${
                props.cellHasRecords ? 'mt-3' : 'mt-2'
            }`}
        >
            <button
                type='button'
                className={`${classes.addButton} mr-3`}
                onClick={props.onClickForFind}
                id={props.airtableFieldId}
            >
                <SearchIcon className={classes.buttonIcon} />
                Find
            </button>
        </div>
    );
};

export default LinkedRecordsField;
