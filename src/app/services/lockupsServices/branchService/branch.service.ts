import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { branch } from '../../../../models/branch'; 
import { ApiCall } from '../../../core/services/http-service/HttpService';
import { branchController } from '../../../apis/branchController';
import { BranchSC } from '../../../core/models/Lookup/Branch.model';
 
@Injectable({
  providedIn: 'root'
})
export class BranchService {

  constructor(private apiCall: ApiCall) { }

  getBranch(request: BranchSC = {}): Observable<any> {
    return this.apiCall.request('POST', branchController.getBranch, request);
  }

  addBranch(branch: branch): Observable<any> {
    return this.apiCall.request('POST', branchController.addBranch, branch);
  }

  editBranch(branch: branch): Observable<any> {
    return this.apiCall.request('POST', branchController.editBranch, branch);
  }

  deleteBranch(id: number, companyId: number): Observable<any> {
    return this.apiCall.request('POST', branchController.deleteBranch(id, companyId), {});
  }

  activateBranch(id: number, companyId: number): Observable<any> {
    return this.apiCall.request('POST', branchController.activateBranch(id, companyId), {});
  }

  deactivateBranch(id: number, companyId: number): Observable<any> {
    return this.apiCall.request('POST', branchController.deactivateBranch(id, companyId), {});
  }
}
