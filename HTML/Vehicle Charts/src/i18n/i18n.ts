import i18next, { InitOptions } from 'i18next';
import en from './en';

const i18nInstance = i18next.createInstance();

export function initI18n(lng: string) {
    const config: InitOptions = {
        lng: lng,
        debug: false,
        resources: {
            en: { translation: en },
        },
    };

    return i18nInstance.init(config);
}