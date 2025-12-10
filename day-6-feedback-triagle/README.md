# Day 6: Feedback Triangle - Issue Auto-Labeler

## Overview
This challenge implements a CI/CD workflow that automatically analyzes, categorizes, and labels GitHub issues.

## Implementation

### GitHub Actions Workflow
The workflow is located at `.github/workflows/issue-labeler.yml` and:

1. **Triggers**: Executes automatically when a new issue is opened
2. **Analyzes**: Examines the issue title and body for keywords
3. **Categorizes**: Applies appropriate labels based on content analysis
4. **Labels**: Uses three categories:
   - **Urgent**: Critical issues, bugs, security vulnerabilities, production problems
   - **Feature**: Feature requests, enhancements, new functionality
   - **Question**: Questions, help requests, documentation queries

### How It Works

The workflow uses keyword matching to categorize issues:

- **Urgent Keywords**: urgent, critical, bug, crash, broken, security, blocker, etc.
- **Feature Keywords**: feature, enhancement, add, implement, improve, integration, etc.
- **Question Keywords**: how, why, what, question, help, explain, clarify, etc.

Multiple labels can be applied to a single issue if it matches multiple categories.

### Features

1. **Automatic Label Creation**: The workflow creates the three required labels if they don't exist
2. **Smart Analysis**: Uses keyword matching to intelligently categorize issues
3. **Feedback Comment**: Posts a comment on the issue explaining the applied labels
4. **Fallback**: If no keywords match, defaults to "Question" label

### Testing

To test the workflow:

1. Push this workflow to your GitHub repository
2. Create a new issue with different content:
   - "Bug: App crashes on startup" → Should get **Urgent** label
   - "Add dark mode feature" → Should get **Feature** label
   - "How do I configure this?" → Should get **Question** label
   - "Critical bug: Add new search functionality" → Should get both **Urgent** and **Feature** labels

## Files Created

- `.github/workflows/issue-labeler.yml` - The main GitHub Actions workflow

## Notes

- The workflow requires `issues: write` permission to add labels
- Labels are color-coded: Urgent (red), Feature (green), Question (purple)
- The workflow runs on Ubuntu latest
- Uses `actions/github-script@v7` for JavaScript-based GitHub API interactions
