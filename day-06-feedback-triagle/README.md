# Day 6: Feedback Triangle - AI-Powered Issue Auto-Labeler

## Overview
This challenge implements a CI/CD workflow that automatically analyzes, categorizes, and labels GitHub issues using **Goose** with AI-powered intelligence via OpenRouter.

## Implementation

### GitHub Actions Workflow
The workflow is located at `.github/workflows/issue-labeler.yml` and:

1. **Triggers**: Executes automatically when a new issue is opened
2. **Analyzes**: Uses Goose with AI (Claude 3.5 Sonnet via OpenRouter) to intelligently analyze the issue
3. **Categorizes**: Applies appropriate labels based on AI understanding of the content
4. **Labels**: Uses three categories:
   - **Urgent**: Critical issues, bugs, security vulnerabilities, production problems
   - **Feature**: Feature requests, enhancements, new functionality
   - **Question**: Questions, help requests, documentation queries

### How It Works

The workflow uses AI-powered analysis through Goose:

1. **Label Creation**: First, ensures the three required labels exist in the repository
2. **Python Setup**: Sets up Python 3.11 and installs Goose
3. **AI Analysis**: 
   - Passes the issue title and body to Goose
   - Uses OpenRouter with Claude 3.5 Sonnet for intelligent analysis
   - AI evaluates the content and determines appropriate label(s)
   - Returns structured JSON with labels and reasoning
4. **Apply Results**: Applies the AI-suggested labels and posts a comment explaining the decision

### Required Secrets

You must add the following secret to your GitHub repository:

- **OPENROUTER_API_KEY**: Your OpenRouter API key for AI model access

To add the secret:
1. Go to your repository Settings
2. Navigate to Secrets and variables → Actions
3. Click "New repository secret"
4. Add `OPENROUTER_API_KEY` with your API key value

### Features

1. **AI-Powered Analysis**: Uses Claude 3.5 Sonnet through OpenRouter for intelligent categorization
2. **Context Understanding**: AI understands nuance and context, not just keywords
3. **Multi-Label Support**: Can apply multiple labels if the issue spans categories
4. **Detailed Reasoning**: Provides explanation for why labels were chosen
5. **Automatic Label Creation**: Creates required labels if they don't exist
6. **Fallback Handling**: Defaults to "Question" label if AI analysis fails

### Testing

To test the workflow:

1. Add the `OPENROUTER_API_KEY` secret to your repository
2. Push this workflow to your GitHub repository
3. Create new issues with different content:
   - "Bug: App crashes on startup" → Should get **Urgent** label
   - "Add dark mode feature" → Should get **Feature** label  
   - "How do I configure this?" → Should get **Question** label
   - "Critical security vulnerability in authentication" → Should get **Urgent** label
   - "Would like to add export functionality" → Should get **Feature** label

### Advantages Over Keyword Matching

- **Context Awareness**: Understands the meaning, not just keywords
- **Nuanced Analysis**: Can detect urgency even without explicit "urgent" keywords
- **Better Accuracy**: Handles complex issues that span multiple categories
- **Adaptive**: Doesn't rely on predefined keyword lists

## Files Created

- `.github/workflows/issue-labeler.yml` - The main GitHub Actions workflow with Goose integration

## Notes

- The workflow requires `issues: write` permission to add labels
- Labels are color-coded: Urgent (red), Feature (green), Question (purple)
- The workflow runs on Ubuntu latest with Python 3.11
- Uses `goose-ai` package for AI-powered analysis
- Requires OpenRouter API key as a repository secret
