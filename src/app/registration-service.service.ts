import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { Country } from './models/country.model'; // Import Country model for type safety
import { HttpClient } from '@angular/common/http'; // Import HttpClient to make HTTP requests

@Injectable({
  providedIn: 'root'
})
export class RegistrationServiceService {

  private apiUrl = 'http://localhost:3000'; // Base URL for the API

  constructor(private http: HttpClient) {}

  // Fetch the list of countries from the API
  getCountries(): Observable<Country[]> {
    return this.http.get<Country[]>(`${this.apiUrl}/countries`);
  }

  // Check if the username is available by fetching the list of registered users
  checkUsernameAvailability(username: string): Observable<{ available: boolean }> {
    return this.http.get<{ username: string; available: boolean }[]>(`${this.apiUrl}/register`).pipe(
      map(users => {
        const user = users.find(u => u.username === username); // Find if the username already exists
        return { available: !user }; // Return true if the username is not found
      })
    );
  }

  // Register a new user with the provided username and country
  registerUser(username: string, country: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, { username, country });
  }
}
