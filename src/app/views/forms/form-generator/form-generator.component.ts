import { Component, OnInit } from '@angular/core';
import {ConfigService} from '../../../services/config.service';
import {AbstractControl, FormControl, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-form-generator',
  templateUrl: './form-generator.component.html',
  styleUrls: ['./form-generator.component.scss']
})
export class FormGeneratorComponent implements OnInit {

  formObj: UiPage;
  submitted = false;
  form: FormGroup;

  constructor( private _config:ConfigService) {

    //this.formObj = new UiPage(formObjTest);

    this._config.getPage(1).subscribe(
      res => {
        this.formObj = new UiPage(<JavaUiPage> res);
        console.log(res);
        console.log(this.formObj);

        const formGroup = {};
        for(const group of this.formObj.groups) {
          for(const i of group.configs){
            //formGroup[i.key] = new FormControl(i.value || '', this.mapValidators(i.validation));
            formGroup[i.key.toString()] = new FormControl(i.value || '', this.mapValidators(i.webUiValidators));//todo validators
          }
        }

        this.form = new FormGroup(formGroup);
      },
      err => {
        console.error('Could not get page from server:');
        console.log(err);
      }
    );

    if(this.formObj){

    }
  }

  ngOnInit() {}

  private mapValidators(validators) {
    const formValidators = [];

    if(validators) {
      for(const validation of Object.values(validators)) {
        if(validation === 'REQUIRED') {
          formValidators.push(Validators.required);
        } else if(validation === 'EMAIL') {
          formValidators.push(Validators.email);
        }
      }
    }

    return formValidators;
  }


  inputValidation(key){
    if(this.submitted && this.form.controls[key].valid){
      return {'is-valid':true};
    }else if(this.submitted) {
      return {'is-invalid': true };
    }
  }

  onSubmit(form, e) {
    // e.target.classList.add('was-validated');
    this.submitted = true;
    console.log(form);
    console.log(this.form);
  }

}

export class UiPage {
  id: number;
  title: String;
  description: String;
  groups: UiGroup[] = [];
  constructor(o:JavaUiPage) {
    this.id = o.id;
    this.title = o.title;
    this.description = o.description;
    const self = this;
    // https://stackoverflow.com/questions/33946567/javascript-iterate-over-values-of-object
    Object.keys(o.groups).forEach(function(key){
      self.groups.push( new UiGroup( o.groups[key] ) );
    });
  }
}

export class UiGroup {
  id: number;
  pageId: number;
  title: String;
  description: String;
  configs: UiConfig[] = [];

  constructor ( g:JavaUiGroup ) {
    this.id = g.id;
    this.pageId = g.pageId;
    this.title = g.title;
    this.description = g.description;
    const self = this;
    Object.keys(g.configs).forEach(function(key){
      self.configs.push( new UiConfig( g.configs[key] ) );
    });
  }
}

export class UiConfig {
  key: String;
  value: any;
  requiresRestart: boolean;
  webUiFormType: String;
  webUiGroup: number;
  webUiValidators: String[];

  constructor (o: JavaUiConfig) {
    this.key = o.key;
    this.value = o.value;
    this.requiresRestart = o.requiresRestart;
    this.webUiFormType = o.webUiFormType;
    this.webUiGroup = o.webUiGroup;
    this.webUiValidators = o.webUiValidators;
  }
}

export interface JavaUiPage {
  id: number;
  title: String;
  description: String;
  groups: {};
}
export interface JavaUiGroup {
  id: number;
  pageId: number;
  title: String;
  description: String;
  configs: {};
}
export interface JavaUiConfig {
  key: String;
  value: any;
  requiresRestart: boolean;
  webUiFormType: String;
  webUiGroup: number;
  webUiValidators: String[];
}
