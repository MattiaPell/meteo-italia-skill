import os

def get_frontmatter(filepath):
    filename = os.path.basename(filepath)
    rel_path = os.path.relpath(filepath, "references")

    is_climatology_dir = rel_path.startswith("climatology/")
    low_confidence_files = ["climatology.md", "event_reliability.md", "model_bias.md", "local_phenomena.md"]

    if filename in low_confidence_files or is_climatology_dir:
        source = "LLM-generated"
        confidence = "low"
    else:
        source = "Mixed"
        confidence = "medium"

    if "climatology" in filepath:
        verification = ["T max media", "T min media", "Precip. media"]
    elif filename == "event_reliability.md":
        verification = ["Probabilità corretta", "Orizzonte temporale"]
    elif filename == "model_bias.md":
        verification = ["Entità bias", "Delta T UHI"]
    elif filename == "local_phenomena.md":
        verification = ["Soglie vento", "Segnali nei dati"]
    else:
        verification = ["Endpoint API", "Soglie operative", "ID stazioni"]

    yaml = "---\n"
    yaml += f'source: "{source}"\n'
    yaml += 'last_verified: "2026-05-28"\n'
    yaml += f'confidence: "{confidence}"\n'
    yaml += "verification_needed:\n"
    for v in verification:
        yaml += f'  - "{v}"\n'
    yaml += "---\n\n"
    return yaml

def process_references(root_dir):
    for root, dirs, files in os.walk(root_dir):
        for file in files:
            if file.endswith(".md"):
                filepath = os.path.join(root, file)
                with open(filepath, 'r') as f:
                    content = f.read()

                # Avoid double frontmatter if already present (though shouldn't be)
                if content.startswith("---"):
                    print(f"Skipping {filepath}, frontmatter already exists.")
                    continue

                frontmatter = get_frontmatter(filepath)
                new_content = frontmatter + content

                with open(filepath, 'w') as f:
                    f.write(new_content)
                print(f"Added frontmatter to {filepath}")

if __name__ == "__main__":
    process_references("references")
