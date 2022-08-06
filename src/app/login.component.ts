import { Component } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';

@Component({
  selector: 'app-login',
  template: `
    <button (click)="auth.loginWithRedirect()">Log in</button>
  `,
  styles: [`
    button {
      margin: 8px;
      display: inline-block;
      max-width: 200px;
      background: hsl(230deg, 60%, 48%);
      font-weight: 600;
      font-size: 0.875rem;
      font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
      padding: 8px 16px;
      border: none;
      border-radius: 6px;
      color: #fff;
    }

    button:hover {
      background: hsl(230deg, 70%, 52%);
      cursor: pointer;
      color: hsl(230deg, 2%, 100%);
    }
  `]
})
export class LoginComponent {
  constructor(public auth: AuthService) {}
}