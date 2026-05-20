import sys
import re
import os

def fix_file(filepath):
    if not os.path.exists(filepath):
        return
    content = open(filepath).read()
    # Ensure one blank line before headers
    new_content = re.sub(r'(?<!\n)\n(##|###)', r'\n\n\1', content)
    # Fix potential triple newlines
    new_content = re.sub(r'\n{3,}', r'\n\n', new_content)
    with open(filepath, 'w') as f:
        f.write(new_content.strip() + '\n')

if len(sys.argv) > 1:
    fix_file(sys.argv[1])
else:
    fix_file('references/climatology.md')
