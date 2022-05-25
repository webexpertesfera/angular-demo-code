
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { VisitResponse, UserModel, ConsultationModel, CustomerModel, CustomerVisitFormModel } from './../../model/safesante-ysera';
import { PatientService } from './../patient.service';
import { ElementRef, OnInit, Component, ViewChild, ChangeDetectorRef, HostListener, Inject } from "@angular/core";
import { Router } from "@angular/router";
import { DateAdapter } from "@angular/material/core";
import { DOCUMENT } from '@angular/common';
import { DeviceDetectorService } from 'ngx-device-detector';
import { WINDOW } from '../../utils/window';
import { environment } from '../../../environments/environment';


@Component({
  selector: 'safesante-matlc-patient',
  templateUrl: './patient.component.html',
  styleUrls: ['./patient.component.scss']
})
export class PatientComponent implements OnInit {

  visitForm: CustomerVisitFormModel = new CustomerVisitFormModel();
  visitResponse: VisitResponse;

  @ViewChild('input0', { static: false }) inputElement0: ElementRef;
  @ViewChild('input1', { static: false }) inputElement1: ElementRef;
  @ViewChild('input2', { static: false }) inputElement2: ElementRef;
  @ViewChild('input3', { static: false }) inputElement3: ElementRef;
  @ViewChild('input4', { static: false }) inputElement4: ElementRef;
  @ViewChild('input5', { static: false }) inputElement5: ElementRef;
  @ViewChild('input6', { static: false }) inputElement6: ElementRef;
  @ViewChild('input7', { static: false }) inputElement7: ElementRef;
  @ViewChild('input8', { static: false }) inputElement8: ElementRef;
  @ViewChild('input9', { static: false }) inputElement9: ElementRef;

  startDate = new Date(1990, 0, 1);

  inputElements: Map<number, ElementRef> = new Map<number, ElementRef>();
  formSubimittedOnce: boolean;
  showWaitingCursor = false;
  inputFocused: boolean;

  isMobile: boolean;
  isPortrait: boolean;
  constructor(private router: Router, @Inject(DOCUMENT) private document: any, private changeDetector: ChangeDetectorRef, private dateAdapter: DateAdapter<any>,
    private patientService: PatientService, private deviceService: DeviceDetectorService, private pairingInfoModal: NgbModal,
    @Inject(WINDOW) private window: Window) { }

  submitDisabled = false;


  firstname: string;
  step = 0;
  maxStep = 8;
  patientPaid = false;

  ngOnInit() {
    this.visitForm.customer = new CustomerModel();
    this.updateInputsMap();
    this.focusCurrentElement();
    this.isMobile = this.deviceService.isMobile();
    this.isPortrait = this.window.innerWidth < this.window.innerHeight;
    this.dateAdapter.setLocale('fr');
  }

  private focusCurrentElement() {
    if (this.inputElements.get(this.step) && !this.isMobile) {
      this.inputElements.get(this.step).nativeElement.focus();
    }
  }

  ameNumberValid() {
    const regexValidated = /^([1-37-8])([0-9]{2})(0[0-9]|[2-35-9][0-9]|[14][0-2])((0[1-9]|[1-8][0-9]|9[0-69]|2[abAB])(00[1-9]|0[1-9][0-9]|[1-8][0-9]{2}|9[0-8][0-9]|990)|(9[78][0-9])(0[1-9]|[1-8][0-9]|90))([0-9]{3})?([0-8][0-9]|9[0-7])$/.test(this.visitForm.customer.ameNumber);
    const controlKey = this.visitForm.customer.ameNumber.substr(this.visitForm.customer.ameNumber.length - 2, 2);
    const ameNumber = this.visitForm.customer.ameNumber.substring(0, this.visitForm.customer.ameNumber.length - 2);
    const keyValid = 97 - (Number(ameNumber) % 97) == Number(controlKey);
    return regexValidated && keyValid;
  }

  removeModals() {
    const backDropElements = this.document.getElementsByClassName('modal-backdrop');
    for (const backDropElement of backDropElements) {
      backDropElement.remove();
    }
    const modalWindowElements = this.document.getElementsByClassName('modal fade');
    for (const modalWindowElement of modalWindowElements) {
      modalWindowElement.remove();
    }
  }

  private updateInputsMap() {
    this.inputElements.set(0, this.inputElement0);
    this.inputElements.set(1, this.inputElement1);
    this.inputElements.set(2, this.inputElement2);
    this.inputElements.set(3, this.inputElement3);
    this.inputElements.set(4, this.inputElement4);
    this.inputElements.set(5, this.inputElement5);
    this.inputElements.set(6, this.inputElement6);
    this.inputElements.set(7, this.inputElement7);
    this.inputElements.set(8, this.inputElement8);
    this.inputElements.set(9, this.inputElement9);
  }

  return() {
    this.router.navigate(['/accueil']);
  }

  nextStep() {
    if (this.step == 4 && this.visitForm.customer.insuranceCase == 'NONE') {
      this.step = this.step + 2;
    } else if (this.step < this.maxStep && this.isStepValid()) {
      this.step++;
    }
    this.changeDetector.detectChanges();
    this.updateInputsMap();
    if (this.inputElements.get(this.step)) {
      this.inputElements.get(this.step).nativeElement.focus();
    }
  }

  previousStep() {
    if (this.step == 6 && this.visitForm.customer.insuranceCase == 'NONE') {
      this.step = this.step - 2;
    } else if (this.step > 0) {
      this.step--;
    }
    this.changeDetector.detectChanges();
    this.updateInputsMap();
    if (this.inputElements.get(this.step)) {
      this.inputElements.get(this.step).nativeElement.focus();
    }
  }

  keytab(event) {
    event.stopPropagation();
    console.log("keytab");
    if (this.inputElements.get(this.step + 1)) {

      this.inputElements.get(this.step + 1).nativeElement.focus();
    }
  }

  noTreatingPractitionier() {
    this.visitForm.noTreatingPractitionier = true;
  }


  hasTreatingPractitionier() {
    this.visitForm.noTreatingPractitionier = false;
  }


  firstNameValid(): boolean {
    return this.visitForm.customer.firstname != null && this.visitForm.customer.firstname != "";
  }

  lastNameValid(): boolean {
    return this.visitForm.customer.lastname != null && this.visitForm.customer.lastname != "";
  }


  birthdateValid(): boolean {
    return this.visitForm.customer.birthdate != null && this.visitForm.customer.birthdate.toString() != "" && new Date(this.visitForm.customer.birthdate) < new Date();
  }

  genderValid() {
    return this.visitForm.customer.gender != null && this.visitForm.customer.gender != "";
  }

  insuranceCaseValid() {
    return !!this.visitForm.customer.insuranceCase;
  }


  emailValid() {
    return this.visitForm.customer.email != null && this.visitForm.customer.email != "";
  }

  treatingPractitionerEntered() {
    return this.visitForm.treatingPractitionerFirstname != null && this.visitForm.treatingPractitionerFirstname != ''
      && this.visitForm.treatingPractitionerLastname != null && this.visitForm.treatingPractitionerLastname != '';
  }

  isStepValid(): boolean {
    switch (this.step) {
      case 0:
        return this.firstNameValid();
      case 1:
        return this.lastNameValid();
      case 2:
        return this.genderValid();
      case 3:
        return this.birthdateValid();
      case 4:
        return this.insuranceCaseValid();
      case 5:
        if (this.visitForm.customer.insuranceCase == 'SS') {
          return this.vitaleCardValid();
        }
        if (this.visitForm.customer.insuranceCase == 'AME') {
          return this.ameNumberValid();
        }
        return true;

      case 6:
        return true;
      case 7:
        return this.emailValid();
      case 8:
        return true;
      default:
        return true;
    }
  }

  vitaleCardValid() {
    const regexValidated = /^([1-37-8])([0-9]{2})(0[0-9]|[2-35-9][0-9]|[14][0-2])((0[1-9]|[1-8][0-9]|9[0-69]|2[abAB])(00[1-9]|0[1-9][0-9]|[1-8][0-9]{2}|9[0-8][0-9]|990)|(9[78][0-9])(0[1-9]|[1-8][0-9]|90))([0-9]{3})?([0-8][0-9]|9[0-7])$/.test(this.visitForm.customer.securiteSocialeNumber);
    const controlKey = this.visitForm.customer.securiteSocialeNumber.substr(this.visitForm.customer.securiteSocialeNumber.length - 2, 2);
    const ssNumber = this.visitForm.customer.securiteSocialeNumber.substring(0, this.visitForm.customer.securiteSocialeNumber.length - 2);
    const keyValid: boolean = 97 - (Number(ssNumber) % 97) == Number(controlKey);
    return regexValidated && keyValid;
  }



  formIsValid(): boolean {
    const isFormValid: boolean = this.genderValid() && this.firstNameValid()
      && this.lastNameValid() && this.birthdateValid()
      && this.vitaleCardValid();
    return isFormValid;
  }

  saveCustomerAndStartTLC() {
    this.submitDisabled = true;
    this.patientService.postFreeCustomerVisitDetails(this.visitForm).subscribe((consultation: ConsultationModel) => {
      this.patientService.setConsultation(consultation);
      this.patientService.getConnectedUser().subscribe((connectedUser: UserModel) => {
        sessionStorage.setItem('sessionUser', JSON.stringify(connectedUser));
        this.onPayment();
      }, (error) => {
        console.log(error);
      });
    }, () => {
      this.submitDisabled = false;
      console.log("error while submitting visit form");
    });
  }

  @HostListener('document:keyup', ['$event'])
  handleDeleteKeyboardEvent(event: KeyboardEvent) {
    if (event.key === "Enter" || (event.key === "ArrowRight" && !this.inputFocused)) {
      this.nextStep();
      // remove something...
    } else if (event.key === "ArrowLeft" && !this.inputFocused) {
      this.previousStep();
    } else if (event.key === "Escape") {
      this.return();
    }
  }

  onFocus() {
    this.inputFocused = true;
  }

  onBlur() {
    this.inputFocused = false;

  }

  @HostListener('window:resize', ['$event']) onResize(event: any) {
    this.isPortrait = this.window.innerWidth < this.window.innerHeight;
    this.isMobile = this.deviceService.isMobile();
  }


}


