import i18next, { InitOptions } from 'i18next';
import en from './en';

export function initI18n(lng: string) {
    const config: InitOptions = {
        lng: lng,
        debug:false,
        resources: {
            en: {translation: en},
        },
    };

    return i18next.init(config);
}
