import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { Store } from '@ngrx/store';
import { State } from '../../store/state';
import { MatDialogRef } from '@angular/material/dialog';
import { signup } from '../../store/auth/auth.actions';
import { SignupDto } from '../../shared/dtos/signup.dto';
import { throttle } from 'rxjs/operators';
import { interval } from 'rxjs';
import { AuthService } from '../../services/auth.service';

export const countries = [
  { name: 'Afghanistan', cc: '93'},
  { name: 'Albania', cc: '355'},
  { name: 'Algeria', cc: '213'},
  { name: 'American Samoa',	cc: '1-684'},
  { name: 'Andorra', cc: '376'},
  { name: 'Angola',	cc: '244'},
  { name: 'Anguilla',	cc: '1-264'},
  { name: 'Antarctica',	cc: '672'},
  { name: 'Antigua and Barbuda', cc: '1-268'},
  { name: 'Argentina', cc: '54'},
  { name: 'Armenia', cc: '374'},
  { name: 'Aruba', cc: '297'},
  { name: 'Australia', cc: '61'},
  { name: 'Austria', cc: '43'},
  { name: 'Azerbaijan', cc: '994'},
  { name: 'Bahamas', cc: '1-242'},
  { name: 'Bahrain', cc: '973'},
  { name: 'Bangladesh',	cc: '880'},
  { name: 'Barbados',	cc: '1-246'},
  { name: 'Belarus', cc: '375'},
  { name: 'Belgium', cc: '32'},
  { name: 'Belize', cc: '501'},
  { name: 'Benin', cc: '229'},
  { name: 'Bermuda', cc: '1-441'},
  { name: 'Bhutan',	cc: '975'},
  { name: 'Bolivia',	cc: '591'},
  { name: 'Bosnia and Herzegovina',	cc: '387'},
  { name: 'Botswana',	cc: '267'},
  { name: 'Brazil', cc: '55'},
  { name: 'British Indian Ocean Territory',	cc: '246'},
  { name: 'British Virgin Islands',	cc: '1-284'},
  { name: 'Brunei',	cc: '673'},
  { name: 'Bulgaria',	cc: '359'},
  { name: 'Burkina Faso',	cc: '226'},
  { name: 'Burundi',	cc: '257'},
  { name: 'Cambodia',	cc: '855'},
  { name: 'Cameroon',	cc: '237'},
  { name: 'Canada',	cc: '1'},
  { name: 'Cape Verde',	cc: '238'},
  { name: 'Cayman Islands',	cc: '1-345'},
  { name: 'Central African Republic',	cc: '236'},
  { name: 'Chad',	cc: '235'},
  { name: 'Chile', cc: '56'},
  { name: 'China', cc: '86'},
  { name: 'Christmas Island',	cc: '61'},
  { name: 'Cocos Islands',	cc: '61'},
  { name: 'Colombia',	cc: '57'},
  { name: 'Comoros', cc: '269'},
  { name: 'Cook Islands',	cc: '682'},
  { name: 'Costa Rica',	cc: '506'},
  { name: 'Croatia',	cc: '385'},
  { name: 'Cuba',	cc: '53'},
  { name: 'Curacao',	cc: '599'},
  { name: 'Cyprus',	cc: '357'},
  { name: 'Czech Republic',	cc: '420'},
  { name: 'Democratic Republic of the Congo',	cc: '243'},
  { name: 'Denmark', cc: '45'},
  { name: 'Djibouti',	cc: '253'},
  { name: 'Dominica',	cc: '1-767'},
  { name: 'Dominican Republic',	cc: '1-809'},
  { name: 'Dominican Republic',	cc: '1-829'},
  { name: 'Dominican Republic', cc: '1-849'},
  { name: 'East Timor',	cc: '67'},
  { name: 'Ecuador', cc: '593'},
  { name: 'Egypt', cc: '20'},
  { name: 'El Salvador', cc: '503'},
  { name: 'Equatorial Guinea', cc: '240'},
  { name: 'Eritrea', cc: '291'},
  { name: 'Estonia', cc: '372'},
  { name: 'Ethiopia', cc: '251'},
  { name: 'Falkland Islands', cc: '500'},
  { name: 'Faroe Islands', cc: '298'},
  { name: 'Fiji', cc: '679'},
  { name: 'Finland', cc: '358'},
  { name: 'France',	cc: '33'},
  { name: 'French Polynesia',	cc: '689'},
  { name: 'Gabon', cc: '241'},
  { name: 'Gambia', cc: '220'},
  { name: 'Georgia', cc: '995'},
  { name: 'Germany', cc: '49'},
  { name: 'Ghana', cc: '233'},
  { name: 'Gibraltar', cc: '350'},
  { name: 'Greece',	cc: '30'},
  { name: 'Greenland', cc: '299'},
  { name: 'Grenada', cc: '1-473'},
  { name: 'Guam',	cc: '1-671'},
  { name: 'Guatemala', cc: '502'},
  { name: 'Guernsey',	cc: '44-1481'},
  { name: 'Guinea',	cc: '224'},
  { name: 'Guinea-Bissau', cc: '245'},
  { name: 'Guyana',	cc: '592'},
  { name: 'Haiti', cc: '509'},
  { name: 'Honduras', cc: '504'},
  { name: 'Hong Kong', cc: '852'},
  { name: 'Hungary', cc: '36'},
  { name: 'Iceland', cc: '354'},
  { name: 'Indonesia', cc: '62'},
  { name: 'Iran', cc: '98'},
  { name: 'Iraq',	cc: '964'},
  { name: 'Ireland', cc: '353'},
  { name: 'Isle of Man', cc: '44-1624'},
  { name: 'Israel',	cc: '972'},
  { name: 'Italy', cc: '39'},
  { name: 'Ivory Coast', cc: '225'},
  { name: 'Jamaica', cc: '1-876'},
  { name: 'Japan', cc: '81'},
  { name: 'Jersey',	cc: '44-1534'},
  { name: 'Jordan', cc: '962'},
  { name: 'Kazakhstan', cc: '7'},
  { name: 'Kenya', cc: '254'},
  { name: 'Kiribati', cc: '686'},
  { name: 'Kosovo', cc: '383'},
  { name: 'Kuwait', cc: '965'},
  { name: 'Kyrgyzstan', cc: '996'},
  { name: 'Laos', cc: '856'},
  { name: 'Latvia', cc: '371'},
  { name: 'Lebanon', cc: '961'},
  { name: 'Lesotho', cc: '266'},
  { name: 'Liberia', cc: '231'},
  { name: 'Libya', cc: '218'},
  { name: 'Liechtenstein', cc: '423'},
  { name: 'Lithuania', cc: '370'},
  { name: 'Luxembourg', cc: '352'},
  { name: 'Macau', cc: '853'},
  { name: 'Macedonia', cc: '389'},
  { name: 'Madagascar', cc: '261'},
  { name: 'Malawi', cc: '265'},
  { name: 'Malaysia', cc: '60'},
  { name: 'Maldives', cc: '960'},
  { name: 'Mali', cc: '223'},
  { name: 'Malta', cc: '356'},
  { name: 'Marshall Islands', cc: '692'},
  { name: 'Mauritania', cc: '222'},
  { name: 'Mauritius', cc: '230'},
  { name: 'Mayotte', cc: '262'},
  { name: 'Mexico', cc: '52'},
  { name: 'Micronesia', cc: '691'},
  { name: 'Moldova', cc: '373'},
  { name: 'Monaco', cc: '377'},
  { name: 'Mongolia', cc: '976'},
  { name: 'Montenegro', cc: '382'},
  { name: 'Montserrat',	cc: '1-664'},
  { name: 'Morocco', cc: '212'},
  { name: 'Mozambique', cc: '258'},
  { name: 'Myanmar', cc: '95'},
  { name: 'Namibia', cc: '264'},
  { name: 'Nauru', cc: '674'},
  { name: 'Nepal', cc: '977'},
  { name: 'Netherlands', cc: '31'},
  { name: 'Netherlands Antilles', cc: '599'},
  { name: 'New Caledonia', cc: '687'},
  { name: 'New Zealand', cc: '64'},
  { name: 'Nicaragua', cc: '505'},
  { name: 'Niger', cc: '227'},
  { name: 'Nigeria', cc: '234'},
  { name: 'Niue',	cc: '683', 	},
  { name: 'North Korea', cc: '850'},
  { name: 'Northern Mariana Islands',	cc: '1-670'},
  { name: 'Norway', cc: '47'},
  { name: 'Oman', cc: '968'},
  { name: 'Pakistan', cc: '92'},
  { name: 'Palau',	cc: '680'},
  { name: 'Palestine', cc: '970'},
  { name: 'Panama', cc: '507'},
  { name: 'Papua New Guinea', cc: '675'},
  { name: 'Paraguay', cc: '595'},
  { name: 'Peru', cc: '51'},
  { name: 'Philippines', cc: '63'},
  { name: 'Pitcairn', cc: '64'},
  { name: 'Poland', cc: '48'},
  { name: 'Portugal', cc: '351'},
  { name: 'Puerto Rico', cc: '1-787'},
  { name: 'Puerto Rico', cc: '1-939'},
  { name: 'Qatar', cc: '974'},
  { name: 'Republic of the Congo', cc: '242'},
  { name: 'Reunion', cc: '262'},
  { name: 'Romania', cc: '40'},
  { name: 'Russia', cc: '7'},
  { name: 'Rwanda', cc: '250'},
  { name: 'Saint Barthelemy', cc: '590'},
  { name: 'Saint Helena',	cc: '290'},
  { name: 'Saint Kitts and Nevis', cc: '1-869'},
  { name: 'Saint Lucia', cc: '1-758'},
  { name: 'Saint Martin',	cc: '590'},
  { name: 'Saint Pierre and Miquelon', cc: '508'},
  { name: 'Saint Vincent and the Grenadines', cc: '1-784'},
  { name: 'Samoa', cc: '685'},
  { name: 'San Marino',	cc: '378'},
  { name: 'Sao Tome and Principe', cc: '239'},
  { name: 'Saudi Arabia', cc: '966'},
  { name: 'Senegal', cc: '221'},
  { name: 'Serbia', cc: '381'},
  { name: 'Seychelles', cc: '248'},
  { name: 'Sierra Leone', cc: '232'},
  { name: 'Singapore', cc: '65'},
  { name: 'Sint Maarten',	cc: '1-721'},
  { name: 'Slovakia', cc: '421'},
  { name: 'Slovenia', cc: '386'},
  { name: 'Solomon Islands', cc: '677'},
  { name: 'Somalia', cc: '252'},
  { name: 'South Africa', cc: '27'},
  { name: 'South Korea', cc: '82'},
  { name: 'South Sudan', cc: '211'},
  { name: 'Spain', cc: '34'},
  { name: 'Sri Lanka', cc: '94'},
  { name: 'Sudan', cc: '249'},
  { name: 'Suriname', cc: '597'},
  { name: 'Svalbard and Jan Mayen', cc: '47'},
  { name: 'Swaziland', cc: '268'},
  { name: 'Sweden', cc: '46'},
  { name: 'Switzerland', cc: '41'},
  { name: 'Syria', cc: '963'},
  { name: 'Taiwan', cc: '886'},
  { name: 'Tajikistan', cc: '992'},
  { name: 'Tanzania', cc: '255'},
  { name: 'Thailand', cc: '66'},
  { name: 'Togo', cc: '228'},
  { name: 'Tokelau', cc: '690'},
  { name: 'Tonga', cc: '676'},
  { name: 'Trinidad and Tobago', cc: '1-868'},
  { name: 'Tunisia', cc: '216'},
  { name: 'Turkey', cc: '90'},
  { name: 'Turkmenistan', cc: '993'},
  { name: 'Turks and Caicos Islands',	cc: '1-649'},
  { name: 'Tuvalu', cc: '688'},
  { name: 'U.S. Virgin Islands', cc: '1-340'},
  { name: 'Uganda', cc: '256'},
  { name: 'Ukraine', cc: '380'},
  { name: 'United Arab Emirates', cc: '971'},
  { name: 'United Kingdom', cc: '44'},
  { name: 'United States', cc: '1'},
  { name: 'Uruguay', cc: '598'},
  { name: 'Uzbekistan', cc: '998'},
  { name: 'Vanuatu', cc: '678'},
  { name: 'Vatican', cc: '379'},
  { name: 'Venezuela', cc: '58'},
  { name: 'Vietnam', cc: '84'},
  { name: 'Wallis and Futuna', cc: '681'},
  { name: 'Western Sahara', cc: '212'},
  { name: 'Yemen', cc: '967'},
  { name: 'Zambia', cc: '260'},
  { name: 'Zimbabwe', cc: '263'}
];

@Component({
  selector: 'app-signup-form',
  templateUrl: './signup-form.component.html',
  styleUrls: ['./signup-form.component.scss']
})
export class SignupFormComponent implements OnInit {
  throttlingTime = 1000; // Miliseconds
  countries = countries;
  retypePasswordEnabled = false;
  signupForm = new FormGroup({
    usernameControl: new FormControl('', [Validators.required]),
    emailControl: new FormControl('', [Validators.required, Validators.email]),
    passwordControl: new FormControl('', [
      Validators.required,
      Validators.pattern(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/)
    ]),
    retypePasswordControl: new FormControl({value: '', disabled: true}, [
      Validators.required,
      Validators.pattern(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/),
      (control: AbstractControl): {[key: string]: any} | null => {
        const password = this.signupForm.get('passwordControl').value;
        const value = control.value;
        let isValid = false;
        if (password === value) {
          isValid = true;
        }
        return isValid ? null : { passwordsMustBeEqual: {value: control.value}};
      }
    ]),
    msisdnControl: new FormControl('', [Validators.required]),
    ccControl: new FormControl('', [Validators.required]),
    nameControl: new FormControl('', [Validators.required]),
    middleNameControl: new FormControl(''),
    lastNameControl: new FormControl('', [Validators.required]),
    genderControl: new FormControl(''),
    nameTitleControl: new FormControl(''),
    secretQuestionControl: new FormControl('', [Validators.required]),
    secretAnswerControl: new FormControl('', [Validators.required])
  });
  errorMessage: string | null;
  get isValid(): boolean {
    return this.signupForm.valid && !this.signupForm.pristine;
  }
  hide = true;

  constructor(
    private store: Store<State>,
    public dialogRef: MatDialogRef<SignupFormComponent>,
    public authService: AuthService
  ) {}

  ngOnInit() {
    const usernameControl = this.signupForm.get('usernameControl');
    usernameControl.valueChanges.pipe(
      throttle(ev => interval(this.throttlingTime))
    ).subscribe((value) => {
      // console.log(value);
      this.checkUsernameAvailability();
    });
    const emailControl = this.signupForm.get('emailControl');
    emailControl.valueChanges.pipe(
      throttle(ev => interval(this.throttlingTime))
    ).subscribe((value) => {
      // console.log(value);
      this.checkEmailAvailability();
    });
    const passwordControl = this.signupForm.get('passwordControl');
    const retypePasswordControl = this.signupForm.get('retypePasswordControl');
    passwordControl.valueChanges.subscribe(value => {
      // console.log('Value', value);
      // console.log('Status', passwordControl.status);
      if (passwordControl.status === 'VALID') {
        retypePasswordControl.enable();
      } else {
        retypePasswordControl.disable();
      }
    });

    // Error message in case a valid request is sent but server throws an error
    this.authService.signupError$.subscribe((errorMessage: string) => {
      if (errorMessage) {
        this.errorMessage = errorMessage;
      }
    });
  }

  onSubmit(): void {
    // console.log('Button clicked');
    if (!this.isValid) {
      // console.log('From is not valid');
      return;
    }
    const signupDto: SignupDto = {
      username: this.signupForm.value.usernameControl,
      email: this.signupForm.value.emailControl,
      password: this.signupForm.value.passwordControl,
      msisdn: this.signupForm.value.msisdnControl + '',
      cc: this.signupForm.value.ccControl,
      name: this.signupForm.value.nameControl,
      middleName: this.signupForm.value.middleNameControl,
      lastName: this.signupForm.value.lastNameControl,
      gender: this.signupForm.value.genderControl,
      nameTitle: this.signupForm.value.nameTitleControl,
      secretQuestion: this.signupForm.value.secretQuestionControl,
      secretAnswer: this.signupForm.value.secretAnswerControl
    };
    // console.log('Signup dto', signupDto);
    this.store.dispatch(signup(signupDto));
  }

  onClose() {
    this.signupForm.reset();
    // Close modal
    this.dialogRef.close();
  }

  checkUsernameAvailability() {
    const usernameControl = this.signupForm.get('usernameControl');
    const username  = usernameControl.value;
    if (username) {
      this.authService.checkUsernameAvailability(username).subscribe((res: { usernameIsAvailable: boolean }) => {
        if (!res.usernameIsAvailable) {
          // console.log('usernamer is not available ): ');
          usernameControl.setErrors({ notAvailable: { errorMessage: 'Username is not available' }});
        } else {
          /* const newErrors = usernameControl.errors;
          delete newErrors.notAvailable;
          usernameControl.setErrors(newErrors); */
        }
      });
    }
  }

  checkEmailAvailability() {
    const emailControl = this.signupForm.get('emailControl');
    const email  = emailControl.value;
    if (email) {
      this.authService.checkEmailAvailability(email).subscribe((res: { emailIsAvailable: boolean }) => {
        if (!res.emailIsAvailable) {
          // console.log('email is not available ): ');
          emailControl.setErrors({ notAvailable: { errorMessage: 'Email is not available' }});
        } else {
          /* const newErrors = emailControl.errors;
          delete newErrors.notAvailable;
          emailControl.setErrors(newErrors); */
        }
      });
    }
  }

}
