# RUDI Survey System

An anonymous AI literacy survey platform built for RUDI (Responsible Use of Digital Intelligence).

## Overview

The RUDI Survey system allows you to create custom survey links for organizations to assess AI familiarity, adoption, and concerns among staff members. Survey responses are automatically saved to Google Sheets for easy viewing and analysis.

## Features

- **Anonymous Surveys**: No personal information required
- **Organization Customization**: Custom survey links with organization names
- **Google Sheets Integration**: Responses automatically saved to a Google Sheet
- **Professional Design**: Clean, modern interface matching RUDI's brand
- **Mobile Responsive**: Works on all devices
- **Progress Tracking**: Visual progress bar as users complete the survey
- **Easy Administration**: Simple admin interface to create survey links

## Survey Questions

The survey includes 8 questions covering:
1. Age range
2. Industry sector
3. AI tools familiarity
4. AI usage frequency
5. Organizational AI adoption
6. Comfort with digital tools (0-10 scale)
7. AI concerns
8. 60-day priorities

## File Structure

```
/rudi-web
├── survey.html              # Main survey page
├── survey-admin.html        # Admin interface for creating survey links
├── js/
│   └── config.js           # Configuration (webhook URL, sheet ID)
├── scripts/
│   └── setup-sheet.js      # Script to configure Google Sheet
├── credentials.json        # Google service account credentials (gitignored)
├── GOOGLE-SHEETS-SETUP.md  # Detailed setup instructions
└── docs/
    └── survey-outline.txt  # Survey question structure
```

## Quick Start

### For Administrators

1. **Create a survey link**:
   - Open `survey-admin.html`
   - Enter the organization name
   - Click "Generate Survey Link"
   - Copy and share the link with the organization

2. **View responses**:
   - Open your Google Sheet: [RUDI Survey Responses](https://docs.google.com/spreadsheets/d/1LC-kPwyQZG3w8TnA46wE6bXiajC9A0M3eb6dXZrhG-s)
   - All responses appear in real-time
   - Use Google Sheets features to filter, sort, and analyze data

### For Survey Respondents

1. Click the survey link provided by your organization
2. Complete all 8 questions
3. Click "Submit Survey"
4. Done! Your anonymous response has been recorded

## Setup Instructions

### Prerequisites

- Google account with access to Google Sheets
- Node.js installed (for running the setup script)
- Text editor for configuration

### Initial Setup

1. **Configure Google Sheets**:
   ```bash
   # Run the setup script
   npm install
   node scripts/setup-sheet.js <YOUR_SHEET_ID>
   ```

2. **Set up Apps Script webhook**:
   - Follow instructions in `GOOGLE-SHEETS-SETUP.md` (Steps 3-4)
   - Deploy the Apps Script and copy the webhook URL

3. **Update configuration**:
   - Edit `js/config.js`
   - Add your Apps Script webhook URL

4. **Test the survey**:
   - Open `survey-admin.html`
   - Create a test survey link
   - Fill out the survey
   - Check Google Sheets for the response

## Configuration

### Config File (js/config.js)

```javascript
const CONFIG = {
    SHEETS_WEBHOOK_URL: 'your-apps-script-url',
    SHEET_ID: 'your-sheet-id',
    DEPLOYMENT_ID: 'your-deployment-id'
};
```

Update these values with your Google Apps Script deployment information.

### Google Service Account

The `credentials.json` file contains the service account credentials needed to access Google Sheets. This file should:
- Never be committed to version control (already in `.gitignore`)
- Be shared only with authorized administrators
- Have Editor access to the Google Sheet

## Deployment

### Local Testing

```bash
# Serve the site locally
python3 -m http.server 8000

# Open in browser
open http://localhost:8000/survey-admin.html
```

### Production Deployment

The survey is deployed as part of the RUDI website:
- **Production URL**: https://learnrudi.com/survey.html
- **Admin URL**: https://learnrudi.com/survey-admin.html (keep this private)

Update the Apps Script URL in `js/config.js` before deploying.

## Usage Tips

### Creating Effective Survey Links

- Use clear organization names (e.g., "Warren County ESC")
- Track which organizations received links using the admin interface
- Survey links are permanent and can be reused

### Viewing and Analyzing Results

- **Filter by organization**: Use Google Sheets filter feature
- **Export data**: File → Download → CSV or Excel
- **Create charts**: Insert → Chart in Google Sheets
- **Share results**: Share the Google Sheet with team members (view-only recommended)

### Privacy Considerations

- Surveys are completely anonymous
- No email addresses or names are collected
- Only the organization name is included in responses
- Google Sheet access should be limited to authorized personnel

## Troubleshooting

### Survey not submitting

1. Check browser console for errors (F12 → Console)
2. Verify `js/config.js` has the correct webhook URL
3. Check Apps Script deployment is active
4. Confirm service account has Editor access to the sheet

### Responses not appearing in Google Sheets

1. Check Apps Script execution logs (Extensions → Apps Script → Executions)
2. Run the test function in Apps Script to verify setup
3. Confirm the webhook URL matches the deployed Apps Script URL
4. Check that the sheet ID in config.js is correct

### Config not loading

1. Verify `js/config.js` exists in the correct location
2. Check browser console for 404 errors
3. Ensure the script tag is in the `<head>` section of survey.html

## Maintenance

### Updating Survey Questions

1. Edit `docs/survey-outline.txt` with new questions
2. Update the `surveyQuestions` array in `survey.html`
3. Update the Apps Script to handle new fields
4. Add new column headers to the Google Sheet
5. Test thoroughly before deploying

### Updating Configuration

1. Edit `js/config.js` with new values
2. No need to update HTML files
3. Changes take effect immediately

### Rotating Credentials

If service account credentials need to be rotated:
1. Create a new service account in Google Cloud
2. Share the Google Sheet with the new service account email
3. Download new credentials.json
4. Replace the old credentials file
5. Test the setup script to verify access

## Technical Details

### Stack

- **Frontend**: Vanilla HTML, CSS, JavaScript
- **Backend**: Google Apps Script
- **Storage**: Google Sheets
- **Hosting**: Vercel (or any static hosting)

### Dependencies

- Node.js (for setup script only)
- googleapis npm package (for setup script only)
- No runtime dependencies

### Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Security

- Service account credentials stored locally (not in repo)
- Apps Script webhook URL is public but only accepts POST requests
- Google Sheet access controlled via Google permissions
- No authentication required for surveys (by design - anonymous)
- CORS handled via Apps Script's no-cors mode

## Support

For issues or questions:
1. Check `GOOGLE-SHEETS-SETUP.md` for detailed setup instructions
2. Review the troubleshooting section above
3. Check browser console for error messages
4. Contact RUDI technical support

## License

Part of the RUDI (Responsible Use of Digital Intelligence) project.

---

**Last Updated**: October 2025
**Version**: 1.0
