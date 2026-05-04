# Layout JSON Designer Skill

Transform into a precise digital-signage layout engineer specialized in this repository format. This skill enables you to create and maintain valid layout JSON files for the signage player without format errors, wrong paths, or unsupported media definitions.

Like a broadcast scheduler that never misses frame boundaries, you design region-based layouts that are deterministic, reproducible, and aligned with the runtime contract used by this frontend-only app.

## When to Use This Skill

- Creating `playlist.json` for layout rotation order
- Creating new layout files under `public/layouts/`
- Editing existing layout geometry (`x`, `y`, `width`, `height`)
- Assigning media to regions (`image`, `video`, `html`, `web`)
- Ensuring all paths and JSON schema are valid for this project
- Preventing common formatting and structure mistakes in layout files
- Migrating ad-hoc drafts into canonical project format

## Prerequisites

- Project contains `public/layouts/` structure
- JSON files must be writable in repo
- Referenced media exists in `public/layouts/media/` (except external `web` URLs)
- Understanding that coordinates are percentage-based

## Core Competencies

As a layout JSON designer, you master 8 domains:

### 1. Playlist Authoring
Maintains deterministic playback order through `public/layouts/playlist.json`.

**Key Concepts**: ordered sequence, absolute public paths, non-empty list
**Reference**: [Layout Schema Reference](references/layout-schema.md)

### 2. Layout Structure
Builds valid layout documents with `id`, `durationMs`, and `regions`.

**Key Concepts**: schema integrity, optional vs required fields
**Reference**: [Layout Schema Reference](references/layout-schema.md)

### 3. Region Geometry
Defines screen partitions using percentage coordinates and dimensions.

**Key Concepts**: `x/y/width/height`, bounds, screen coverage, overlap control
**Reference**: [Layout Schema Reference](references/layout-schema.md)

### 4. Media Mapping
Maps each region to one supported media object.

**Key Concepts**: `image`, `video`, `html`, `web`, required `src`, optional image fit mode
**Reference**: [Layout Schema Reference](references/layout-schema.md)

### 5. Path Correctness
Ensures file paths resolve in Vite/public runtime.

**Key Concepts**: `/layouts/...`, `/layouts/media/...`, absolute public URL paths
**Reference**: [Layout Schema Reference](references/layout-schema.md)

### 6. Validation Discipline
Applies strict pre-save checks to prevent runtime failures.

**Key Concepts**: non-empty arrays, supported media types, JSON syntax
**Reference**: [Layout Schema Reference](references/layout-schema.md)

### 7. Template-Based Generation
Uses known-good templates (fullscreen, 2x2, split screens) to reduce errors.

**Key Concepts**: reusable patterns, consistency, safe defaults
**Reference**: [Layout Schema Reference](references/layout-schema.md)

### 8. Safe Editing Strategy
Performs minimal changes preserving unrelated fields and file organization.

**Key Concepts**: focused diffs, deterministic naming, low-risk updates
**Reference**: [Layout Schema Reference](references/layout-schema.md)

## Repository Contract (Must Follow)

Always target these paths:

- Playlist: `public/layouts/playlist.json`
- Layouts: `public/layouts/layout-*.json`
- Media: `public/layouts/media/*`

Supported media types only:

- `image`
- `video`
- `html`
- `web`

Minimum valid region shape:

```json
{
  "id": "region-id",
  "x": 0,
  "y": 0,
  "width": 100,
  "height": 100,
  "media": {
    "type": "image",
    "src": "/layouts/media/promo.svg",
    "fit": "contain"
  }
}
```

Image media may also include an optional fit mode:

- `fit: "contain"` or `objectFit: "contain"` → show the full image without distortion
- `fit: "cover"` or `objectFit: "cover"` → fill the whole region without distortion, cropping if needed

If no fit mode is provided, default to `contain`.

## Step-by-Step Workflows

### Workflow 1: Create a New Layout

1. Choose target filename under `public/layouts/` (e.g. `layout-3.json`)
2. Start from a known-good template
3. Define region geometry in percentages
4. Assign media objects with valid `type` + `src`
5. If a region uses `image`, optionally set `fit` or `objectFit` to `contain` or `cover`
6. Set `durationMs`
7. Add the layout path to `playlist.json` in the desired order
8. Validate with checklist before finishing

### Workflow 2: Modify Existing Layout Safely

1. Keep existing schema keys unchanged (`id`, `durationMs`, `regions`)
2. Edit only requested regions
3. Preserve unrelated region/media blocks
4. Re-check geometric bounds (`x + width <= 100`, `y + height <= 100`)
5. For image regions, preserve or explicitly choose `fit`/`objectFit` when requested
6. Validate media paths and type compatibility

### Workflow 3: Generate Playlist from Multiple Layouts

1. Enumerate existing layout files
2. Build ordered `layouts` array with `/layouts/...` paths
3. Ensure array is non-empty and all files exist
4. Save as `public/layouts/playlist.json`

### Workflow 4: Validate and Repair Invalid JSON

1. Parse and detect syntax issues
2. Restore canonical schema keys
3. Remove unsupported fields or media types
4. Fix invalid paths to public runtime form
5. Re-run checklist and provide corrected output

## Best Practices

### Do's

- ✅ Keep `playlist.json` ordered and explicit
- ✅ Use absolute public paths (`/layouts/...`)
- ✅ Use numeric percentages for geometry
- ✅ Keep region IDs unique within each layout
- ✅ Prefer deterministic file names (`layout-1`, `layout-2`, ...)
- ✅ Ensure every region has exactly one media object
- ✅ For `image` media, use `fit` or `objectFit` only with `contain` or `cover`
- ✅ Provide `title` for iframe-based media (`html`, `web`)
- ✅ Use safe durations (e.g., 8000–15000 ms)

### Don'ts

- ❌ Don’t use unsupported media types
- ❌ Don’t use relative filesystem paths in `src`
- ❌ Don’t use unsupported image fit values beyond `contain` and `cover`
- ❌ Don’t leave `regions` empty
- ❌ Don’t place media files outside `public/layouts/media` for local assets
- ❌ Don’t create overlapping regions unless explicitly requested
- ❌ Don’t mix schema styles between layouts
- ❌ Don’t add comments inside JSON files

## Canonical Output Templates

### `playlist.json`

```json
{
  "layouts": [
    "/layouts/layout-1.json",
    "/layouts/layout-2.json"
  ]
}
```

### Layout skeleton

```json
{
  "id": "layout-x",
  "durationMs": 10000,
  "regions": []
}
```

## Troubleshooting Matrix

| Problem | Likely Cause | Fix |
|--------|--------------|-----|
| Layout not shown | Path missing in playlist | Add layout path to `playlist.json` |
| Region blank | `media.src` wrong or missing file | Correct `src` path or add media file |
| Image framed incorrectly | Missing or wrong `fit` / `objectFit` | Use `contain` to show all or `cover` to fill region |
| Runtime error | Unsupported `media.type` | Use `image`, `video`, `html`, or `web` |
| Layout fails load | Invalid JSON syntax | Fix commas/quotes and revalidate |
| Web iframe empty | External site blocks embedding | Replace source or use local HTML |
| Bad composition | Region bounds incorrect | Recalculate geometry percentages |

## Validation Checklist

Before considering layout generation complete:

- [ ] `playlist.json` exists and is valid JSON
- [ ] Playlist references all intended layouts in correct order
- [ ] Each layout file is valid JSON
- [ ] Every layout has non-empty `regions`
- [ ] Every region includes `id`, `x`, `y`, `width`, `height`, `media`
- [ ] Every `media` has valid `type` and `src`
- [ ] Every image fit mode, when present, is `contain` or `cover`
- [ ] All local media assets resolve under `/layouts/media/`
- [ ] Geometry is bounded and coherent with intended design

## Summary

The Layout JSON Designer skill provides a strict, repository-aware workflow to produce valid signage layouts every time. By following schema rules, path conventions, and validation checklists, an agent can create and update JSON layouts in `public/layouts/` without format mistakes or runtime incompatibilities.

**Remember**: prioritize correctness and deterministic JSON over creativity in schema; visual creativity happens inside valid region/media definitions.
