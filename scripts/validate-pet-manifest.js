const fs = require('fs');
const path = require('path');

const requiredExpressions = new Set(['happy', 'idle', 'sleepy', 'angry', 'surprised']);
const manifestPath = path.join(__dirname, '..', 'assets', 'hatch-pet', 'anime-mochi', 'pet.json');
const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
const errors = [];

if (!manifest.id || !manifest.displayName || !manifest.description) {
  errors.push('pet.json must include id, displayName, and description.');
}

if (!manifest.spritesheetPath) {
  errors.push('pet.json must include spritesheetPath for hatch-pet compatibility.');
} else {
  const spritesheetPath = path.join(path.dirname(manifestPath), manifest.spritesheetPath);
  if (!fs.existsSync(spritesheetPath)) {
    errors.push(`spritesheetPath does not exist: ${manifest.spritesheetPath}.`);
  }
}

if (!manifest.runtime || !Array.isArray(manifest.runtime.expressions)) {
  errors.push('pet.json must include runtime.expressions.');
} else {
  const seen = new Set(manifest.runtime.expressions.map((expression) => expression.id));

  for (const expressionId of requiredExpressions) {
    if (!seen.has(expressionId)) {
      errors.push(`Missing required expression: ${expressionId}.`);
    }
  }

  for (const expression of manifest.runtime.expressions) {
    if (!expression.asset) {
      errors.push(`Expression ${expression.id} is missing an asset path.`);
      continue;
    }

    const assetPath = path.join(path.dirname(manifestPath), expression.asset);
    if (!fs.existsSync(assetPath)) {
      errors.push(`Expression asset does not exist: ${expression.asset}.`);
    }
  }
}

if (errors.length > 0) {
  console.error(errors.join('\n'));
  process.exit(1);
}

console.log(`Validated ${manifest.displayName} manifest with ${manifest.runtime.expressions.length} expressions.`);
