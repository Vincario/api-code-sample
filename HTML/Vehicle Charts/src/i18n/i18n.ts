import i18next, { InitOptions } from 'i18next';
import en from './en';

export const i18n = i18next.createInstance();

export function initI18n(lng: string) {
    const config: InitOptions = {
        lng,
        debug: false,
        resources: {
            en: { translation: en },
        },
    };

    return i18n.init(config);
}