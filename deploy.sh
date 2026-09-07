#!/usr/bin/env bash
# ===========================================================
#  Deploy India Job Scanner to Netlify (Mac / Linux)
#  Run:  bash deploy.sh
# ===========================================================
set -e

echo
echo " Step 1 of 2 - signing in to Netlify"
echo " A browser window will open. Click \"Authorize\"."
echo " (If you are already signed in, this finishes instantly.)"
echo
npx -y netlify-cli login

echo
echo " Step 2 of 2 - deploying"
echo
echo " If this is your FIRST deploy, answer the prompts like this:"
echo "   What would you like to do?  ->  Create & configure a new project"
echo "   Team                        ->  press Enter"
echo "   Project name                ->  type a name, or Enter for a random one"
echo
npx -y netlify-cli deploy --prod --dir=. --functions=netlify/functions

echo
echo " Done. The \"Website URL\" printed above is your live bot."
echo
