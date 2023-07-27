# TransferBank

# React + TypeScript + Vite

Simple bank mockup application.

Within this application are currently implemented some actions as:
- Account registration
- Authentication
- PIX key registration
- Money deposit request
- Money transfer to another registered user's account through the registered PIX keys
- List fulfilled transactions detaling amount, sender and destination user, time and remaining account value
- Validations made to prevent non unique keys to be registered, or user to send money amounts to his own account from itself
- Chart with all the transactions made by the authenticated user

#### The project is an SPA and all components out of authentication routes (login/register) are rendered in the main home page.

- Main Home Page:
![image](https://github.com/flpfrnc/transferBank/assets/13010905/2f60aeeb-b023-487b-ae54-8a18122df5ac)


Technologies used in this project:
- ViteJS + React + Typescript
- React Router Dom
- React ChartJS
- CryptoJS
- Tailwind CSS

