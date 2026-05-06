import csv
import os
import re

# Input CSV file
input_file = "Pakistan Medicines Dataset.csv"

# Output folder
output_folder = "medicine_txt_files"
os.makedirs(output_folder, exist_ok=True)

def clean_filename(name):
    return re.sub(r'[^\w\-_\. ]', '_', name)

def format_text(row):
    # Handle missing values
    def safe(val):
        return val.strip() if val and val.strip() != "NaN" else "N/A"

    name = safe(row['Drug Name'])
    manufacturer = safe(row['Manufacturer'])
    strength = safe(row['Strength'])
    form = safe(row['Form'])
    indication = safe(row['Indication'])
    side_effects = safe(row['Side Effects'])
    available = safe(row['Available In'])
    age = safe(row['Age Restriction'])
    prescription = safe(row['Prescription Required'])
    price = safe(row['Price'])

    # Build formatted text
    text = f"""{name}
Composition: {strength}.
Manufacturer: {manufacturer}
Form: {form}

Use: {indication}

Side Effects: {side_effects}

Availability: {available}
Age Restriction: {age}
Prescription Required: {prescription}
Price: {price}
"""
    return text

# Read CSV and create files
with open(input_file, newline='', encoding='utf-8') as csvfile:
    reader = csv.DictReader(csvfile)

    for row in reader:
        name = clean_filename(row['Drug Name'])
        filename = os.path.join(output_folder, f"{name}.txt")

        content = format_text(row)

        with open(filename, "w", encoding="utf-8") as f:
            f.write(content)

print("✅ TXT files generated successfully!")