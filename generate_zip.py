#!/usr/bin/env python3
import os
import sys
import zipfile

def create_project_zip(output_path="/tmp/tuteur-scolastique-ai-engineer.zip"):
    exclude_dirs = {
        'node_modules',
        'dist',
        '.git',
        '__pycache__',
        '.system_generated',
        '.artifacts',
        '.cache'
    }
    exclude_extensions = {'.zip', '.log', '.tmp', '.pyc'}
    exclude_files = {'.env', '.DS_Store'}

    base_dir = os.path.dirname(os.path.abspath(__file__))

    with zipfile.ZipFile(output_path, 'w', zipfile.ZIP_DEFLATED) as zf:
        for root, dirs, files in os.walk(base_dir):
            # Prune excluded directories
            dirs[:] = [d for d in dirs if d not in exclude_dirs and not d.startswith('.')]
            
            for file in files:
                if file in exclude_files:
                    continue
                if any(file.endswith(ext) for ext in exclude_extensions):
                    continue
                
                full_path = os.path.join(root, file)
                rel_path = os.path.relpath(full_path, base_dir)
                zf.write(full_path, rel_path)
                
    print(f"Archive created successfully at {output_path} ({os.path.getsize(output_path)} bytes)")

if __name__ == "__main__":
    out = sys.argv[1] if len(sys.argv) > 1 else "/tmp/tuteur-scolastique-ai-engineer.zip"
    create_project_zip(out)
