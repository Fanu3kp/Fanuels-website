# Frontend (Angular)

## Build
```
npm run build
```

## Type checking
```
npx tsc --noEmit --project tsconfig.json
```

## Lint
```
npx eslint src --ext .ts,.scss 2>/dev/null || npm run lint 2>/dev/null || true
```
