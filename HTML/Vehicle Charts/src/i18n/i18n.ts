import i18next, { InitOptions } from 'i18next';
import en from './en';
import cs from './cs';

export function initI18n(lng: string) {
    const config: InitOptions = {
        lng: lng,
        debug:true,
        resources: {
            en: {translation: en},
            cs: {translation: cs},
        },
    };

    return i18next.init(config);
}
