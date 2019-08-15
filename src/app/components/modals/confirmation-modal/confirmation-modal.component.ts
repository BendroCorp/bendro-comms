import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { NgbModal, ModalDismissReasons, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable, of } from 'rxjs';


@Component({
  selector: 'ngbd-modal-content',
  template: `
  <div class="modal-header">
    <h4 class="modal-title" id="modal-basic-title">Confirmation</h4>
    <button type="button" class="close" aria-label="Close" (click)="activeModal.dismiss()">
      <span aria-hidden="true">&times;</span>
    </button>
  </div>
  <div class="modal-body">
    {{modalText}}
  </div>
  <div class="modal-footer">
    <button class="btn btn-primary" (click)="yes()">Yes</button>
    <button type="button" class="btn btn-outline-dark" (click)="no()">No</button>
  </div>
  `
})
export class ConfirmationModalContent {
  @Input() modalText;

  constructor(public activeModal: NgbActiveModal) {}

  yes() {
    this.activeModal.close();
  }

  no() {
    this.activeModal.dismiss();
  }
}

@Component({
  selector: 'app-confirmation-modal',
  templateUrl: './confirmation-modal.component.html',
  styleUrls: ['./confirmation-modal.component.scss']
})
export class ConfirmationModal implements OnInit {

  constructor(private modalService: NgbModal) {}

  public open(confirmationText: string) : Promise<boolean> {
    let modal = this.modalService.open(ConfirmationModalContent)
    modal.componentInstance.modalText = confirmationText;
    
    return modal.result.then((result) => {
      return true; // closed
    }, (reason) => {
      return false; // dismissed
    });
  }

  ngOnInit() {
  }

}
