import { AirtableField } from '../airtable/types';

/**
 * We use this to update a linked records primary value after it's saved
 * in a line item form (aka modal for editing linked records)
 */
export type DidSaveFormInModalFunc = (args: {
    recordId: string;
    primaryValue: string;
}) => void;

/**
 * Used on the frontend for the form
 */
export type FrontendPublicExtensionContext =
    | {
          type: 'direct-url';
          /**
           * NOTE(abdul): This may not be the actual record ID that is used by the form
           * if the user is using the login page feature but also provided a record ID.
           * In that case, we do not want to use the record ID from the URL.
           *
           * If the URL contains the record ID we provide it here.
           */
          potentialRecordIdFromUrl: string | null;
      }
    | {
          type: 'modal';
          /**
           * Since login pages do not exist for line item forms, this is the definitive record ID.
           */
          recordId: string | null;
          didSaveFormInModal: DidSaveFormInModalFunc;
      };

/**
 * Used on the backend when saving a form
 */
export type BackendPublicExtensionContext =
    | {
          type: 'direct-url';
          recordId: string;
      }
    | {
          type: 'modal';
          primaryFieldName: string;
          primaryFieldAirtableConfig: AirtableField['config'];
      };
