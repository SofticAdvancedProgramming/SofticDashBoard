import { Injectable } from '@angular/core';
import { ErrorModel } from '../../../models/error';

@Injectable({
  providedIn: 'root'
})
export class ErrorHandlerService {
  private errorMessages: ErrorModel[] = [
    { key: "1", value: "Email is already in use." },
    { key: "2", value: "Email does not exist." },
    { key: "3", value: "Email is not confirmed." },
    { key: "4", value: "Invalid email address." },
    { key: "5", value: "Invalid email or password." },
    { key: "6", value: "Invalid password." },
    { key: "7", value: "Invalid OTP." },
    { key: "8", value: "Department does not exist." },
    { key: "9", value: "Phone number is already in use." },
    { key: "10", value: "Phone number does not exist." },
    { key: "11", value: "Phone number is not confirmed." },
    { key: "12", value: "Invalid input." },
    { key: "13", value: "Account is not active." },
    { key: "14", value: "Face does not match." },
    { key: "15", value: "Invalid company." },
    { key: "16", value: "Invalid NFC." },
    { key: "17", value: "Company extension is already in use." },
    { key: "18", value: "OTP code is incorrect or expired." },
    { key: "19", value: "Password reset failed. Please try again." }
    
  ];

  getErrorMessage(key: string): string {
    const error = this.errorMessages.find(e => e.key === key);
    return error ? error.value : 'An unknown error occurred.';
  }
}
