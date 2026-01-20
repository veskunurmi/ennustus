# ENNUSTUS - Weekly Forecast Application

A full-stack web application that generates personalized weekly forecasts based on user input (name, birth month, birth year) using OpenAI's GPT-4o-mini model. The application features a React frontend with PayPal payment integration and a Node.js/Express backend.

**🚀 [Deployment Guide](DEPLOYMENT.md)** - Step-by-step instructions for deploying to Vercel & Render

## Features

- 🔮 AI-powered personalized weekly forecasts in Finnish & English
- 💳 PayPal payment integration
- 📱 Responsive mobile-first design
- 🔒 Secure environment variable configuration
- ⏱️ Request timeout protection
- 🛡️ Rate limiting to prevent abuse
- 📝 Input validation on both client and server
- 💾 Local caching with 7-day expiration
- 🔄 Share forecasts via WhatsApp or copy to clipboard
- 🌐 Multilingual support (Finnish & English)

## Tech Stack

### Frontend
- React 19.2.3
- React DOM
- PayPal React SDK
- CSS3 with responsive design

### Backend
- Node.js with Express 5.2.1
- OpenAI API (GPT-4o-mini)
- CORS middleware
- Environment variable management (dotenv)

## Project Structure

```
Ennustus/
├── Backend/
│   ├── server.js           # Main backend server with API endpoints
│   ├── testi-api.js        # OpenAI connection test utility
│   ├── package.json        # Backend dependencies
│   └── .env.example        # Environment variables template
├── frontend/
│   ├── public/
│   │   └── index.html      # HTML entry point
│   ├── src/
│   │   ├── App.js          # Main React component
│   │   ├── App.css         # Application styles
│   │   ├── index.js        # React render entry
│   │   └── index.css       # Global styles
│   ├── package.json        # Frontend dependencies
│   └── .env.example        # Environment variables template
└── README.md               # This file
```

## Setup Instructions

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- OpenAI API key (with GPT-4o-mini access)
- PayPal developer account

### Backend Setup

1. **Navigate to Backend directory:**
   ```bash
   cd Backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Create `.env` file from template:**
   ```bash
   cp .env.example .env
   ```

4. **Configure environment variables in `.env`:**
   ```
   OPENAI_API_KEY=sk_test_xxxxxxxxxxxx
   PORT=3001
   FRONTEND_URL=http://localhost:3000
   NODE_ENV=development
   ```
   - Get your OpenAI API key from [platform.openai.com](https://platform.openai.com/api-keys)
   - Ensure your OpenAI account has at least $5 credit available

5. **Test the OpenAI connection (optional):**
   ```bash
   node testi-api.js
   ```

6. **Start the backend server:**
   ```bash
   npm start
   # Server runs on http://localhost:3001
   ```

### Frontend Setup

1. **Navigate to frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Create `.env` file from template:**
   ```bash
   cp .env.example .env
   ```

4. **Configure environment variables in `.env`:**
   ```
   REACT_APP_PAYPAL_CLIENT_ID=AYU029JlcaJbUvhaG23hZ84IvrnDjvBpImwk9UAvvXHm1_kbVFl-bt2wBFtZ2A3azbxlTZIJFWmBKSg0
   REACT_APP_API_URL=http://localhost:3001
   ```
   - Get your PayPal Client ID from [PayPal Developer Dashboard](https://developer.paypal.com/dashboard/)
   - The API_URL should match your backend PORT

5. **Start the development server:**
   ```bash
   npm start
   # Application runs on http://localhost:3000
   ```

## API Documentation

### POST `/api/ennustus`

Generates a personalized weekly forecast.

**Request body:**
```json
{
  "name": "Nimi",
  "birthMonth": "Tammikuu",
  "birthYear": 1990,
  "luckyNumber": 42
}
```

**Response (200 OK):**
```json
{
  "ennustus": "Detailed forecast text in Finnish..."
}
```

**Error responses:**
- `400 Bad Request`: Invalid input data
- `429 Too Many Requests`: Rate limit exceeded (5 requests per minute per IP)
- `500 Internal Server Error`: Server processing error
- `504 Gateway Timeout`: OpenAI API timeout

## Security Features

1. **Environment Variables**: Sensitive keys (OpenAI API key, PayPal Client ID) stored in `.env`
2. **CORS Configuration**: Restricted to specific frontend origin
3. **Input Validation**: Both client-side and server-side validation
4. **Rate Limiting**: 5 requests per minute per IP address
5. **Request Timeout**: 30-second timeout for API calls
6. **Error Handling**: Detailed error logging without exposing sensitive information

## Data Flow

1. User enters personal information (name, birth month, birth year)
2. Frontend validates input locally
3. User completes PayPal payment
4. Frontend sends validated data to backend API
5. Backend validates input again and calls OpenAI API
6. Backend applies rate limiting and timeout protection
7. Generated forecast returned to frontend
8. Frontend caches forecast in localStorage (7-day expiration)
9. User can share via WhatsApp or copy to clipboard

## Forecast Generation

The forecast is generated using OpenAI's GPT-4o-mini model with a detailed system prompt that incorporates:

- Astrological interpretations based on birth month and year
- Cultural and symbolic meanings
- Planetary positions
- Numerological analysis using the lucky number
- Life phase interpretation
- Current global events and phenomena

The forecast structure includes:
- Astrological interpretation
- Work and tasks
- Relationships
- Money and practical matters
- Energy and general focus
- Spiritual growth and inner world
- Weekly key theme
- Favorable moment
- Time to approach with caution

## Performance & Caching

- **localStorage Caching**: 7-day expiration for generated forecasts
- **Rate Limiting**: Prevents abuse (5 req/min per IP)
- **Request Timeout**: 30 seconds for API calls
- **Retry Logic**: 2 automatic retries for failed requests

## Troubleshooting

### OpenAI Connection Error
- Verify API key in `.env` is correct
- Check OpenAI account has sufficient credits ($5+)
- Ensure your IP is not blocked

### PayPal Payment Issues
- Verify PayPal Client ID in frontend `.env`
- Test in PayPal sandbox mode for development
- Clear browser cache if issues persist

### CORS Errors
- Verify `FRONTEND_URL` matches frontend origin
- Check backend `.env` configuration
- Ensure backend and frontend are running on configured ports

### Slow Response Times
- Check OpenAI API status
- Verify internet connection
- Rate limiting may delay requests (wait 1 minute)

## Development

### Building for Production

**Backend:**
```bash
cd Backend
npm install --production
# Set NODE_ENV=production in .env
```

**Frontend:**
```bash
cd frontend
npm run build
# Generates optimized build in /build directory
```

### Running Tests

```bash
# Frontend
cd frontend
npm test

# Backend (manual testing recommended)
node testi-api.js
```

## Environment Variables Reference

### Backend (.env)
| Variable | Description | Example |
|----------|-------------|---------|
| `OPENAI_API_KEY` | OpenAI API key | `sk_test_xxxx` |
| `PORT` | Server port | `3001` |
| `FRONTEND_URL` | Frontend origin for CORS | `http://localhost:3000` |
| `NODE_ENV` | Environment | `development` or `production` |

### Frontend (.env)
| Variable | Description | Example |
|----------|-------------|---------|
| `REACT_APP_PAYPAL_CLIENT_ID` | PayPal client ID | `AYU029Jl...` |
| `REACT_APP_API_URL` | Backend API URL | `http://localhost:3001` |

## API Rate Limits

- **Default**: 5 requests per minute per IP address
- **Error Response**: HTTP 429 Too Many Requests
- **Error Message**: "Liian monta pyyntöä. Yritä uudelleen myöhemmin."

## Future Improvements

- [ ] User authentication and accounts
- [ ] Multiple forecast types
- [ ] Email delivery of forecasts
- [ ] Subscription plans
- [ ] Analytics dashboard
- [ ] API documentation portal
- [ ] Multilingual support
- [ ] Integration with other payment providers

## License

ISC

## Support

For issues or questions:
1. Check troubleshooting section above
2. Review error messages in browser console
3. Check backend logs for server errors
4. Verify all environment variables are correctly configured

## Contributing

When contributing:
1. Maintain input validation on both client and server
2. Follow existing code style
3. Test with various inputs
4. Update documentation for new features
5. Handle errors gracefully with user-friendly messages

---

**Last Updated**: January 2026
