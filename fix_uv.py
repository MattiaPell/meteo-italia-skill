import sys
content = open('references/uv_marine_recent.md').read()
# Remove duplicated/misplaced sections
lines = content.splitlines()
cleaned_lines = []
for line in lines:
    if '### Wind Chill (Vento Freddo)' in line:
        continue
    if '| Wind Chill | Categoria | Pericolo |' in line:
        continue
    if '| 0 a -10°C | Fastidio |' in line:
        continue
    if '| -10 a -25°C | Freddo Intenso |' in line:
        continue
    if '| -25 a -45°C | Freddo Estremo |' in line:
        continue
    if '| < -45°C | Emergenza |' in line:
        continue
    if '## 🌾 Bilancio Idrologico' in line:
        continue
    if 'L\'evapotraspirazione potenziale (ET0)' in line:
        continue
    if '| Condizione | Interpretazione | Impatto |' in line:
        continue
    if '| Precip >> ET0 |' in line:
        continue
    if '| Precip ≈ ET0 |' in line:
        continue
    if '| Precip < ET0 |' in line:
        continue
    if '| ET0 > 5mm/giorno |' in line:
        continue
    if '**Soglie Umidità del Suolo' in line:
        continue
    if '- **<0.15 m³/m³**:' in line:
        continue
    if '- **0.15–0.30 m³/m³**:' in line:
        continue
    if '- **0.35 m³/m³**:' in line:
        continue
    cleaned_lines.append(line)

with open('references/uv_marine_recent.md', 'w') as f:
    f.write("\n".join(cleaned_lines).strip() + '\n')
