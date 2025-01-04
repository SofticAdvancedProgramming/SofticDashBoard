import { Component } from '@angular/core';
import { TranslationService } from '../../core/services/translationService/translation.service';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-change-language',
  standalone: true,
  imports: [],
  templateUrl: './change-language.component.html',
  styleUrl: './change-language.component.css'
})
export class ChangeLanguageComponent {
  currentLang = localStorage.getItem('lang') || 'ar';
  selectedFlag: string = 'assets/images/flags/us.png';
  selectedLanguage: string = 'English';
  languageMap: { [key: string]: { flag: string, name: string } } = {
    'en': { flag: 'assets/images/flags/us.png', name: 'English' },
    'ar': { flag: 'assets/images/flags/sa.png', name: 'عربي' }
  };

  constructor(
    private translationService: TranslationService,
  ) {
    this.handelFlag();
  }

  

  changeLanguage(lang: string): void {
    this.currentLang = lang;
    localStorage.setItem('lang', this.currentLang);
    this.translationService.changeLang(this.currentLang);
    this.handelFlag();
  }

  handelFlag(): void {
    if (this.languageMap[this.currentLang]) {
      this.selectedFlag = this.languageMap[this.currentLang].flag;
      this.selectedLanguage = this.languageMap[this.currentLang].name;
    }
  }
}
