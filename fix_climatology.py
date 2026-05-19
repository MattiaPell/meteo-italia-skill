import sys
content = open('references/climatology.md').read()
# Ensure one blank line before headers
import re
new_content = re.sub(r'\n(##|###)', r'\n\n\1', content)
# Fix potential triple newlines
new_content = re.sub(r'\n{3,}', r'\n\n', new_content)
with open('references/climatology.md', 'w') as f:
    f.write(new_content.strip() + '\n')
