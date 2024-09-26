import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';
import { debounceTime } from 'rxjs';
import { Country } from '../models/country.model'; // Import the Country model
import { RegistrationServiceService } from '../registration-service.service'; // Import the registration service
import Swal from 'sweetalert2'; // Import SweetAlert for user feedback

@Component({
  selector: 'app-registration-form',
  templateUrl: './registration-form.component.html',
  styleUrls: ['./registration-form.component.css']
})
export class RegistrationFormComponent {
  registrationForm: FormGroup; 
  countries: Country[] = []; 
  usernameAvailable: boolean | null = null; // Tracks whether the username is available or not
  errorMessage: string | null = null; // Error message for registration failure

  constructor(private fb: FormBuilder, private registrationService: RegistrationServiceService) {
    // Initialize the registration form with validation rules
    this.registrationForm = this.fb.group({
      username: ['', [
        Validators.required,
        Validators.maxLength(20),
        this.lowercaseValidator() // Custom validator for lowercase and space validation
      ]],
      country: ['', Validators.required] 
    });
  }

  ngOnInit(): void {
    this.getCountries(); // Fetch list of countries on component initialization
  }

  getCountries(): void {
    // Fetch countries from the API and assign to the `countries` array
    this.registrationService.getCountries().subscribe({
      next: (data) => {
        this.countries = data;
      },
      error: (error) => {
        console.error('Error fetching countries', error); // Log error if fetching fails
      }
    });
  }

  // Return error message based on form validation status
  getErrorMessage(field: string): string | null {
    const control = this.registrationForm.get(field);

    if (control?.invalid && (control.touched || control.dirty)) {
      if (field === 'username') {
        if (control.hasError('required')) {
          return 'Username is required.';
        }
        if (control.hasError('maxlength')) {
          return 'Username cannot exceed 20 characters.';
        }
        if (control.hasError('lowercase')) {
          return 'Username must be in lowercase.';
        }
        if (control.hasError('spaces')) {
          return 'Username cannot contain spaces.';
        }
      }
    }
    
    return null; 
  }

  // Custom validator to check for lowercase and spaces in the username
  lowercaseValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      const hasLowercase = value && value !== value.toLowerCase(); // Check if it's lowercase
      const hasSpaces = value && /\s/.test(value); // Check if it contains spaces
      if (hasLowercase || hasSpaces) {
        return { 
          lowercase: hasLowercase, 
          spaces: hasSpaces 
        };
      }
      return null;
    };
  }

  // Check if the username is available using the registration service
  checkUsernameAvailability(): void {
    const username = this.registrationForm.get('username')?.value.toLowerCase();
    if (!username) {
      this.usernameAvailable = null;
      return;
    }

    if (this.getErrorMessage('username')) {
      return; // Exit if there are validation errors
    }

    // Perform debounce to delay the check by 300ms
    this.registrationService.checkUsernameAvailability(username).pipe(
      debounceTime(300)
    ).subscribe({
      next: (response) => {
        this.usernameAvailable = response.available; // Update the availability status
      },
      error: (error) => {
        console.error('Error checking username availability', error); // Log error
      }
    });
  }

  // Handle form submission
  onSubmit(): void {
    if (this.registrationForm.valid) {
      const { username, country } = this.registrationForm.value;
      // Call the registration service to register the user
      this.registrationService.registerUser(username, country).subscribe({
        next: () => {
          this.errorMessage = null; // Clear error message on success
          this.registrationForm.reset(); // Reset the form
          this.usernameAvailable = null; // Reset username availability status
          this.registrationForm.get('country')?.setValue(''); // Reset the country field
  
          // Show success message using SweetAlert
          Swal.fire({
            icon: 'success',
            title: 'Registration Successful',
            text: 'You have been successfully registered!',
            confirmButtonText: 'OK'
          });
        },
        error: (error) => {
          this.errorMessage = 'Registration failed. Please try again.'; // Display error message on failure
          console.error('Error during registration', error); // Log error
        }
      });
    }
  }
}
