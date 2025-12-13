import re
import json
import os

def clean_text(text):
    """Clean text: First letter capitalized, rest lowercase, no redundant ! or &, add missing apostrophes"""
    # Remove excessive punctuation (! and &)
    text = re.sub(r'[!&]+', '', text)
    # Remove multiple spaces
    text = re.sub(r'\s+', ' ', text)
    # Strip whitespace
    text = text.strip()
    
    # Capitalize first letter of each word, rest lowercase
    text = text.title()
    
    # Handle common possessive cases - add missing apostrophes
    text = re.sub(r'\bJoes\b', "Joe's", text)
    text = re.sub(r'\bDmitris\b', "Dmitri's", text)
    text = re.sub(r'\bMamas\b', "Mama's", text)
    
    return text

def parse_vendor_line(line):
    """Parse a vendor line into name, location, and cuisine"""
    # Remove leading/trailing decorative characters and whitespace
    line = line.strip()
    line = line.strip('║').strip()
    
    # Skip empty lines or decorative lines
    if not line or '═' in line or '☕' in line:
        return None
    
    # Skip header line
    if 'DMITRI' in line.upper() and 'NAPKIN' in line.upper():
        return None
    
    if 'stain' in line.lower():
        return None
    
    print(f"Processing: {line}")
    
    # Normalize the line - replace multiple spaces with single space
    working_line = re.sub(r'\s+', ' ', line)
    
    # Try splitting by dash first
    if ' - ' in working_line:
        parts = [p.strip() for p in working_line.split(' - ')]
        if len(parts) >= 3:
            # Format: name - location - cuisine
            name = parts[0]
            location = parts[1]
            cuisine = parts[2]
        elif len(parts) == 2:
            name = parts[0]
            location = parts[1]
            cuisine = ""
        else:
            return None
    elif ',' in working_line:
        # Split by comma
        parts = working_line.split(',', 1)
        name = parts[0].strip()
        rest = parts[1].strip() if len(parts) > 1 else ""
        
        # Try to split rest into location and cuisine
        # Look for ... as separator
        if '...' in rest:
            location, cuisine = rest.split('...', 1)
            location = location.strip()
            cuisine = cuisine.strip()
        else:
            # Last word is likely cuisine
            rest_words = rest.split()
            if rest_words:
                cuisine = rest_words[-1]
                location = ' '.join(rest_words[:-1])
            else:
                location = rest
                cuisine = ""
    else:
        # No clear delimiter - parse by pattern
        # Look for location keywords to split name from location
        location_keywords = ['main', 'north', 'near', 'next', 'food', 'mobile', 'roams', 
                            'area', 'east', 'west', 'south', 'plaza', 'court', 'stage']
        
        words = working_line.split()
        name_end_idx = len(words)
        
        for i, word in enumerate(words):
            if word.lower() in location_keywords:
                name_end_idx = i
                break
        
        if name_end_idx == len(words):
            # No location keyword found - try to find all caps section as name
            name_parts = []
            rest_parts = []
            for word in words:
                if word.isupper() and not rest_parts:
                    name_parts.append(word)
                else:
                    rest_parts.append(word)
            
            if name_parts:
                name = ' '.join(name_parts)
                rest = ' '.join(rest_parts)
            else:
                # Fallback: first 2-3 words as name
                name = ' '.join(words[:3])
                rest = ' '.join(words[3:])
        else:
            name = ' '.join(words[:name_end_idx])
            rest = ' '.join(words[name_end_idx:])
        
        # Extract cuisine from rest (usually last word or phrase)
        cuisine_keywords = ['mexican food', 'polish food', 'pizza slices', 'hot drinks',
                           'waffles', 'italian', 'pretzels', 'sushi', 'pizza', 'cookies', 
                           'pastries', 'food', 'curry', 'tacos']
        
        cuisine = ""
        location = rest
        
        for keyword in cuisine_keywords:
            if keyword in rest.lower():
                idx = rest.lower().index(keyword)
                location = rest[:idx].strip()
                cuisine = rest[idx:].strip()
                break
        
        # If no cuisine keyword found, last word might be cuisine
        if not cuisine and rest:
            rest_words = rest.split()
            if rest_words and rest_words[-1].lower() not in ['around', 'about', 'nearby']:
                cuisine = rest_words[-1]
                location = ' '.join(rest_words[:-1])
    
    # Clean up all parts
    name = clean_text(name)
    location = clean_text(location.rstrip('.')) if location else ""
    cuisine = clean_text(cuisine.rstrip('.')) if cuisine else ""
    
    # Special case: infer cuisine from name if not found
    if not cuisine or cuisine.strip() == "":
        name_lower = name.lower()
        if 'curry' in name_lower:
            cuisine = "Curry"
        elif 'pizza' in name_lower:
            cuisine = "Pizza"
        elif 'taco' in name_lower:
            cuisine = "Tacos"
        elif 'pretzel' in name_lower:
            cuisine = "Pretzels"
        elif 'sushi' in name_lower:
            cuisine = "Sushi"
    
    return {
        "name": name,
        "location": location,
        "cuisine": cuisine
    }

# Process all .txt files in the data directory
data_dir = 'data'
output_dir = 'output'

# Create output directory if it doesn't exist
os.makedirs(output_dir, exist_ok=True)

# Get all .txt files in data directory
txt_files = [f for f in os.listdir(data_dir) if f.endswith('.txt')]

for txt_file in txt_files:
    input_path = os.path.join(data_dir, txt_file)
    output_file = txt_file.replace('.txt', '.json')
    output_path = os.path.join(output_dir, output_file)
    
    print(f"\n{'='*60}")
    print(f"Processing: {txt_file}")
    print(f"{'='*60}")
    
    # Read the vendor file
    with open(input_path, 'r') as f:
        lines = f.readlines()
    
    vendors = []
    for line in lines:
        vendor = parse_vendor_line(line)
        if vendor:
            vendors.append(vendor)
    
    # Save as JSON
    with open(output_path, 'w') as f:
        json.dump(vendors, f, indent=2)
    
    print(f"\nProcessed {len(vendors)} vendors")
    print(f"Output saved to {output_path}")
    print("\nVendors:")
    for v in vendors:
        print(f"  - {v['name']:<30} | {v['location']:<30} | {v['cuisine']}")

print(f"\n{'='*60}")
print("All files processed!")
print(f"{'='*60}")
