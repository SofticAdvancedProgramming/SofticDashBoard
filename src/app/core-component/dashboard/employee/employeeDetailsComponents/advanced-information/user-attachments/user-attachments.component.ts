import { Component } from '@angular/core';
import { LocalStorageService } from '../../../../../../services/local-storage-service/local-storage.service';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { Subject, takeUntil, tap } from 'rxjs';
import { UserAttachmentsService } from '../../../../../../services/userAttachmentsService/user-attachments.service';
import { Attachments } from '../../../../../../../models/advancedIfomation';
import { TranslateModule } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-user-attachments',
  standalone: true,
  imports: [RouterModule, TranslateModule, CommonModule, FormsModule],
  templateUrl: './user-attachments.component.html',
  styleUrl: './user-attachments.component.css'
})
export class UserAttachmentsComponent {
  private unsubscribe$ = new Subject<void>();
  id: number = 0;
  userAttachments?:Attachments[];

  constructor(private userAttachmentsService: UserAttachmentsService,private localStorageService: LocalStorageService,private route:ActivatedRoute) {}

  ngOnInit(): void {
    this.route.paramMap.pipe(
      takeUntil(this.unsubscribe$)
    ).subscribe(params => {
      this.id = Number(params.get('id'));
      console.log(this.id);
      this.getAttachments();
    })
  }

  getAttachments() {
    this.userAttachmentsService
      .getAttachments({userId: this.id})
      .pipe(
        tap((res) => {
          this.userAttachments = res.data.list;
          console.log(res);
          
        }),
        takeUntil(this.unsubscribe$)
      )
      .subscribe();
  }

  // downloadFile() {
  //   const fileUrl = this.userAttachments?.file; // Path to your file
  //   const link = document.createElement('a');
  //   link.href = fileUrl;
  //   link.download = this.userAttachments?.file; // Name of the file to be downloaded
  //   link.click();
  // }
  isImage(file: string): boolean {
    return /\.(jpg|jpeg|png|gif)$/i.test(file);
  }
  
  isPDF(file: string): boolean {
    return /\.pdf$/i.test(file);
  }
  
  isText(file: string): boolean {
    return /\.(txt|log)$/i.test(file);
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
