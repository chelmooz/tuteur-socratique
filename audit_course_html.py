#!/usr/bin/env python3
"""
Audit script to analyze CSS custom properties and structural patterns
across all HTML course files in the corpus.
"""

import os
import re
import json
from collections import Counter, defaultdict
from pathlib import Path

CORPUS_DIR = Path("/home/chelmooz/Downloads/tuteur scholastique update/tuteur-scolastique/data/corpus")

# Regex patterns
ROOT_VARS_PATTERN = re.compile(r':root\s*{([^}]+)}')
VAR_PATTERN = re.compile(r'--([\w-]+):\s*([^;]+);?')
CLASS_PATTERN = re.compile(r'\.([\w-]+)\s*{')
STRUCTURE_CLASSES = [
    'wrap', 'header', 'card', 'module', 'tabs', 'btn', 'progress', 'bar',
    'eyebrow', 'pill', 'grid', 'diagram', 'flow', 'quiz', 'choice', 'feedback',
    'score', 'muted', 'top', 'check'
]

def extract_root_variables(css_text):
    """Extract all CSS custom properties from :root block."""
    match = ROOT_VARS_PATTERN.search(css_text)
    if not match:
        return {}
    vars_text = match.group(1)
    return {m.group(1): m.group(2).strip() for m in VAR_PATTERN.finditer(vars_text)}

def extract_classes(css_text):
    """Extract all CSS class names."""
    return set(CLASS_PATTERN.findall(css_text))

def analyze_file(filepath):
    """Analyze a single HTML file."""
    try:
        content = filepath.read_text(encoding='utf-8')
    except Exception as e:
        return {"error": str(e)}
    
    # Extract <style> content
    style_match = re.search(r'<style>(.*?)</style>', content, re.DOTALL)
    css = style_match.group(1) if style_match else ""
    
    # Extract root variables
    root_vars = extract_root_variables(css)
    
    # Extract classes
    classes = extract_classes(css)
    
    # Check for structural patterns
    has_header = '<header' in content
    has_footer = '<footer' in content
    has_tabs = 'tabs' in content
    has_progress = 'progress' in content
    has_quiz = 'quiz' in content
    has_diagram = 'diagram' in content
    has_localStorage = 'localStorage' in content
    
    return {
        "filename": filepath.name,
        "root_vars": root_vars,
        "classes": list(classes),
        "structure": {
            "has_header": has_header,
            "has_footer": has_footer,
            "has_tabs": has_tabs,
            "has_progress": has_progress,
            "has_quiz": has_quiz,
            "has_diagram": has_diagram,
            "has_localStorage": has_localStorage,
        }
    }

def main():
    html_files = list(CORPUS_DIR.glob("*.html"))
    print(f"Found {len(html_files)} HTML files")
    
    all_results = []
    var_counter = Counter()
    var_values = defaultdict(Counter)
    class_counter = Counter()
    structure_counter = Counter()
    
    for filepath in html_files:
        result = analyze_file(filepath)
        if "error" in result:
            print(f"Error in {filepath.name}: {result['error']}")
            continue
        
        all_results.append(result)
        
        # Count variable names
        for var_name in result["root_vars"]:
            var_counter[var_name] += 1
        
        # Count variable values
        for var_name, var_value in result["root_vars"].items():
            var_values[var_name][var_value] += 1
        
        # Count classes
        for cls in result["classes"]:
            class_counter[cls] += 1
        
        # Count structural features
        for key, value in result["structure"].items():
            if value:
                structure_counter[key] += 1
    
    # Print analysis
    print("\n=== CSS Custom Properties (variable names) ===")
    for var, count in var_counter.most_common():
        print(f"  --{var}: {count}/{len(html_files)} files")
    
    print("\n=== Variable Values (most common per variable) ===")
    for var_name, values in var_values.items():
        print(f"  --{var_name}:")
        for value, count in values.most_common(3):
            print(f"    {value}: {count}")
    
    print("\n=== Structural Classes (used in >50% of files) ===")
    for cls, count in class_counter.most_common():
        if count > len(html_files) * 0.5:
            print(f"  .{cls}: {count}/{len(html_files)}")
    
    print("\n=== Structural Features ===")
    for feat, count in structure_counter.most_common():
        print(f"  {feat}: {count}/{len(html_files)}")
    
    # Save detailed results
    output = {
        "total_files": len(html_files),
        "variable_names": dict(var_counter),
        "variable_values": {k: dict(v) for k, v in var_values.items()},
        "classes": dict(class_counter),
        "structures": dict(structure_counter),
        "files": all_results
    }
    
    with open("course_audit_report.json", "w") as f:
        json.dump(output, f, indent=2)
    
    print("\nDetailed report saved to course_audit_report.json")

if __name__ == "__main__":
    main()