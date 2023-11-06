import { Status } from './types';

export const hebrewStatusesMap = {
    [Status.NOT_PROCESSED]: 'לא מעובד',
    [Status.AUTHORIZED]: 'מאושר',
    [Status.SUSPICIOUS]: 'חשוד',
    [Status.MESSAGE_SENT]: 'הודעה נשלחה',
};
