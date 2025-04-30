#!/bin/bash
set -e

# Colors for terminal output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

PACKAGE_NAME="@sraz-sw/fullstack-shared"

echo -e "${YELLOW}Directly fixing all imports (without barrel files)...${NC}"

cd ./client/chat-whatsapp-clone

# Find all files with specific imports from package subpaths
SCHEMA_FILES=$(grep -l -r --include="*.ts" --include="*.tsx" "${PACKAGE_NAME}/schemas" src/ || true)
REALTIME_FILES=$(grep -l -r --include="*.ts" --include="*.tsx" "${PACKAGE_NAME}/realtime" src/ || true)
QUERY_FILES=$(grep -l -r --include="*.ts" --include="*.tsx" "${PACKAGE_NAME}/queryParams" src/ || true)

# Process schema imports - update to import directly from main package
if [ -n "$SCHEMA_FILES" ]; then
  echo -e "${YELLOW}Processing files with schema imports:${NC}"
  echo "$SCHEMA_FILES"
  
  for file in $SCHEMA_FILES; do
    echo -e "${YELLOW}Fixing import in $file...${NC}"
    
    # Extract imported symbols
    IMPORTS=$(grep -o "import { .*} from '${PACKAGE_NAME}/schemas'" "$file" | sed -E "s/import \{ (.*) \} from.*$/\1/")
    if [ -z "$IMPORTS" ]; then
      IMPORTS=$(grep -o "import { .*} from \"${PACKAGE_NAME}/schemas\"" "$file" | sed -E "s/import \{ (.*) \} from.*$/\1/")
    fi
    
    if [ -n "$IMPORTS" ]; then
      echo -e "${YELLOW}Found imports: $IMPORTS${NC}"
      
      # Check if we have type imports (using regex to find import type or curly braces with type inside)
      if [[ "$file" =~ "import type" || "$(grep "import.*from.*${PACKAGE_NAME}/schemas" "$file")" =~ "import".*"type".* ]]; then
        echo -e "${YELLOW}Handling type imports${NC}"
        sed -i '' "s|import.*from ['\"]${PACKAGE_NAME}/schemas['\"]|import type { $IMPORTS } from '${PACKAGE_NAME}'|g" "$file"
      else
        echo -e "${YELLOW}Handling value imports${NC}"
        sed -i '' "s|import.*from ['\"]${PACKAGE_NAME}/schemas['\"]|import { $IMPORTS } from '${PACKAGE_NAME}'|g" "$file"
      fi
    fi
    
    echo -e "${GREEN}✓ Fixed${NC}"
  done
fi

# Process realtime imports
if [ -n "$REALTIME_FILES" ]; then
  echo -e "${YELLOW}Files with realtime imports:${NC}"
  echo "$REALTIME_FILES"
  
  for file in $REALTIME_FILES; do
    echo -e "${YELLOW}Fixing import in $file...${NC}"
    # Direct import is fine for realtime submodule
    echo -e "${GREEN}✓ Leaving as is - subpath import is fine${NC}"
  done
fi

# Process queryParams imports
if [ -n "$QUERY_FILES" ]; then
  echo -e "${YELLOW}Files with queryParams imports:${NC}"
  echo "$QUERY_FILES"
  
  for file in $QUERY_FILES; do
    echo -e "${YELLOW}Fixing import in $file...${NC}"
    # Direct import is fine for queryParams submodule
    echo -e "${GREEN}✓ Leaving as is - subpath import is fine${NC}"
  done
fi

# Get rid of the types directory if it exists and is empty
if [ -d "src/types" ]; then
  # Check if directory is empty (except for .DS_Store)
  if [ -z "$(find src/types -type f -not -name ".DS_Store" | head -1)" ]; then
    echo -e "${YELLOW}Removing empty types directory...${NC}"
    rm -rf src/types
  else
    echo -e "${YELLOW}Types directory contains files, keeping it.${NC}"
  fi
fi

echo -e "${GREEN}✅ All imports have been directly fixed! No barrel files used.${NC}" 