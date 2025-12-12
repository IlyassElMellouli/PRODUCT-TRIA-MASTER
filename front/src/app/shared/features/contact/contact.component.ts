import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule, 
} from '@angular/forms';

import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { ButtonModule } from 'primeng/button';
import { MessageModule } from 'primeng/message';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule, 
    InputTextModule,
    InputTextareaModule,
    ButtonModule,
    MessageModule, 
  ],
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss'],
})
export class ContactComponent implements OnInit {
  private fb = inject(FormBuilder);
  
  contactForm!: FormGroup;
  
  successMessage: string | null = null; 

  ngOnInit(): void {
    this.contactForm = this.fb.group({
      email: [
        '',
        [Validators.required, Validators.email] 
      ],
      message: [
        '',
        [Validators.required, Validators.maxLength(300)] 
      ],
    });
  }

  get controls() {
    return this.contactForm.controls;
  }

  onSubmit(): void {
    this.successMessage = null;
    
    if (this.contactForm.invalid) {
      this.contactForm.markAllAsTouched();
      return;
    }

    console.log('Données à envoyer:', this.contactForm.value);

    setTimeout(() => {
        this.successMessage = 'Demande de contact envoyée avec succès.';
        
        this.contactForm.reset();
        
        setTimeout(() => this.successMessage = null, 5000); 
    }, 500);

  }
}