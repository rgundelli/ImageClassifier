import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import * as mobilenet from '@tensorflow-models/mobilenet';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  private errorMessage: string = '';
  private img: any;
  private reader = new FileReader();
  private net: mobilenet.MobileNet;
  private predictions: any;
  
  private title = 'Image Classifier';
  private classifierForm: FormGroup;

  constructor(private fb: FormBuilder){
    this.classifierForm = this.fb.group({
      photo: ['', Validators.nullValidator]
    });
  }

  async ngOnInit() {
    console.log('Loading mobilenet..');
    this.net = await mobilenet.load();
    console.log('Mobilenet successfully loaded');
  }

  async classifyImage(value){
    const imageElement =  <HTMLImageElement>document.getElementById('img');

    if(imageElement == null){
      this.errorMessage = "Please select an image!";
      return;
    }

    this.predictions = await this.net.classify(imageElement);
  }

  preview(files) {
    if (files.length === 0){
      return;
    }
 
    var mimeType = files[0].type;
    if (mimeType.match(/image\/*/) == null) {
      this.errorMessage = "Only images are supported.";
      return;
    }
   
    this.reader.readAsDataURL(files[0]); 
    this.reader.onload = (event) => { 
        this.img = this.reader.result;
    }

    this.predictions = null;
    this.errorMessage = null;
  }
}
