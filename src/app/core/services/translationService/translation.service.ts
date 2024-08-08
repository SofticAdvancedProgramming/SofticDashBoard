import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';


@Injectable({
  providedIn: 'root'
})
export class TranslationService {

  constructor(public translateService: TranslateService) {
    this.translateService.setDefaultLang('en');
    this.translateService.use('en');
  }

  //change Language
  async changeLang(lang: string) {
    await this.translateService.setDefaultLang(lang);
    await this.translateService.use(lang);
    localStorage.setItem('lang', lang)
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
  }

  getCurrentLanguage() {
    const lang = localStorage.getItem('lang');
    lang == 'ar' ? true : false;
  }

  //get current language
  getLang(): any {
    const lang = localStorage.getItem('lang');
    lang ? lang : this.translateService.getDefaultLang();
  }

  getKey(key: string | string[]) {
    this.translateService.get(key);
  }

  //get translation
  translate(key: string): string {
    let result: string = '';
    this.translateService.get(key)
      .subscribe(translation => {
        result = translation;
      });
    return result;
  }

  //get page direction
  getDirection() {
    let lang: string = this.getLang();
    lang === 'en' ? 'ltr' : 'rtl'
  }
}
